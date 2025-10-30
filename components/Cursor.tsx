import { motion } from 'framer-motion';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// --- Context ---
interface CursorContextProps {
  setHoveredElement: (element: HTMLElement | null) => void;
  setCursorVariant: (variant: 'default' | 'text') => void;
}
const CursorContext = createContext<CursorContextProps | null>(null);

// --- Provider Component ---
interface CursorProviderProps {
  children: React.ReactNode;
}
export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text'>('default');
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
    setHoveredElement: (el: HTMLElement | null) => {
      setHoveredElement(el);
      // If setting a hover element, ensure the variant is default (not text).
      if (el) setCursorVariant('default');
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
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-lg bg-white/20 mix-blend-exclusion"
        animate={{
          x: elementRect ? elementRect.left - 5 : mousePosition.x,
          y: elementRect ? elementRect.top - 5 : mousePosition.y,
          width: elementRect ? elementRect.width + 10 : 0,
          height: elementRect ? elementRect.height + 10 : 0,
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
  cursorStyle?: 'block' | 'text';
  as?: React.ElementType;
}
export const CursorHover: React.FC<CursorHoverProps> = ({
  children,
  cursorStyle = 'block',
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
    if (cursorStyle === 'block' && ref.current) {
      setHoveredElement(ref.current);
    } else if (cursorStyle === 'text') {
      setCursorVariant('text');
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
