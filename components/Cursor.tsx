import { motion } from 'framer-motion';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// --- Context ---
type CursorVariant = 'default' | 'text' | 'button' | 'link';

interface CursorContextProps {
  setHoveredElement: (element: HTMLElement | null, padding?: number) => void;
  setCursorVariant: (variant: CursorVariant) => void;
}
const CursorContext = createContext<CursorContextProps | null>(null);

// --- Provider Component ---
interface CursorProviderProps {
  children: React.ReactNode;
}
export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [highlightStyle, setHighlightStyle] = useState({
    borderRadius: '0.5rem',
    padding: 0,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch devices or mobile screens
    if (typeof window !== 'undefined') {
      const isMobile =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 1024;
      setIsTouchDevice(isMobile);
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    // We update the React state here to have the highlighter follow smoothly
    // when not attached to a hovered element.
    setMousePosition({ x: clientX, y: clientY });

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      if (cursorFollowerRef.current) {
        cursorFollowerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    });
  }, []);

  useEffect(() => {
    if (!isTouchDevice) {
      window.addEventListener('mousemove', onMouseMove);
    }
    return () => {
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', onMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      }
    };
  }, [isTouchDevice, onMouseMove]);

  const elementRect = hoveredElement?.getBoundingClientRect();

  const contextValue = {
    setHoveredElement: (el: HTMLElement | null, padding: number = 0) => {
      setHoveredElement(el);

      // Copier TOUS les styles pertinents de l'élément
      if (el) {
        const styles = window.getComputedStyle(el);

        // Récupérer les 4 valeurs de border-radius séparément
        const topLeft = styles.borderTopLeftRadius;
        const topRight = styles.borderTopRightRadius;
        const bottomRight = styles.borderBottomRightRadius;
        const bottomLeft = styles.borderBottomLeftRadius;

        // Construire le border-radius complet
        let borderRadius = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;

        // Debug complet
        console.log('=== DEBUG CURSOR ===');
        console.log('Element:', el.tagName, el.className);
        console.log('Border-radius brut:', styles.borderRadius);
        console.log('Border-radius détaillé:', { topLeft, topRight, bottomRight, bottomLeft });
        console.log('Largeur:', styles.width);
        console.log('Hauteur:', styles.height);
        console.log('Padding:', styles.padding);
        console.log('Padding ajouté au highlight:', padding);

        setHighlightStyle({
          borderRadius: borderRadius,
          padding: padding,
        });

        setCursorVariant('default');
      } else {
        setHighlightStyle({
          borderRadius: '0.5rem',
          padding: 0,
        });
      }
    },
    setCursorVariant,
  };

  if (isTouchDevice) {
    return <>{children}</>;
  }

  // Determine cursor visibility and style based on the current state.
  const isFollowerVisible = !hoveredElement;
  const followerScale = cursorVariant === 'text' ? 0 : 1;
  const caretOpacity = cursorVariant === 'text' && !hoveredElement ? 1 : 0;

  return (
    <CursorContext.Provider value={contextValue}>
      {/* 1. The ultra-responsive follower, positioned directly for performance. */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ opacity: isFollowerVisible ? 1 : 0 }}
      >
        {/* The default dot */}
        <div
          className="bg-white rounded-full mix-blend-difference transition-transform duration-200"
          style={{
            width: 16,
            height: 16,
            transform: `scale(${followerScale})`,
          }}
        />
        {/* The text input caret */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white mix-blend-difference transition-opacity duration-200"
          style={{
            width: 2,
            height: 24,
            opacity: caretOpacity,
          }}
        />
      </div>

      {/* 2. The smooth highlight effect, managed entirely by Framer Motion. */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] bg-white/20 mix-blend-exclusion"
        animate={{
          x: elementRect ? elementRect.left - highlightStyle.padding / 2 : mousePosition.x,
          y: elementRect ? elementRect.top - highlightStyle.padding / 2 : mousePosition.y,
          width: elementRect ? elementRect.width + highlightStyle.padding : 0,
          height: elementRect ? elementRect.height + highlightStyle.padding : 0,
          borderRadius: highlightStyle.borderRadius,
        }}
        transition={{ type: 'spring', mass: 0.5, stiffness: 400, damping: 40 }}
      />
      {children}
    </CursorContext.Provider>
  );
};

// --- Hover Component Wrapper ---
interface CursorHoverProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as'> {
  children: React.ReactNode;
  cursorStyle?: 'block' | 'text' | 'button' | 'link';
  padding?: number;
  as?: React.ElementType;
}
export const CursorHover: React.FC<CursorHoverProps> = ({
  children,
  cursorStyle = 'block',
  padding = 10,
  as: Tag = 'div',
  ...props
}) => {
  const context = useContext(CursorContext);
  const ref = useRef<HTMLElement>(null);

  if (!context) {
    return <Tag {...props}>{children}</Tag>;
  }

  const { setHoveredElement, setCursorVariant } = context;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (cursorStyle === 'text') {
      setCursorVariant('text');
    } else if (cursorStyle === 'button' && ref.current) {
      setCursorVariant('button');
      // Pour les boutons, détecter l'enfant direct (le vrai button/element)
      const targetElement = (ref.current.firstElementChild as HTMLElement) || ref.current;
      setHoveredElement(targetElement, padding);
    } else if (cursorStyle === 'link' && ref.current) {
      setCursorVariant('link');
      const targetElement = (ref.current.firstElementChild as HTMLElement) || ref.current;
      setHoveredElement(targetElement, padding);
    } else if (cursorStyle === 'block' && ref.current) {
      setHoveredElement(ref.current, padding);
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setHoveredElement(null);
    setCursorVariant('default');
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <Tag ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {children}
    </Tag>
  );
};
