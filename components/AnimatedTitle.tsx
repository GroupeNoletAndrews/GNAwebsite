import type Lenis from 'lenis';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface AnimatedTitleProps {
  lenis: Lenis | null;
  isActive?: boolean;
  title: string;
  description: string;
  sectionRef: React.RefObject<HTMLDivElement>;
  cardsListRef?: React.RefObject<HTMLDivElement>;
  cardsColumnRef?: React.RefObject<HTMLDivElement>;
  initialFontSizeDesktop?: number;
  finalFontSizeDesktop?: number;
  initialFontSizeMobile?: number;
  disableContentAnimation?: boolean;
  customContentScroller?: boolean;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  lenis,
  isActive,
  title,
  description,
  sectionRef,
  cardsListRef,
  cardsColumnRef,
  initialFontSizeDesktop = 6,
  finalFontSizeDesktop = 3,
  initialFontSizeMobile = 3.75,
  disableContentAnimation = false,
  customContentScroller = false,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [dimensions, setDimensions] = useState({
    introAnimDistance: 0,
    cardsScrollDistance: 0,
    titleTranslateX: 0,
  });

  const calculateDimensions = useCallback(() => {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) {
      if (sectionRef.current) sectionRef.current.style.height = '';
      if (titleRef.current) {
        titleRef.current.style.transform = '';
        titleRef.current.style.fontSize = '';
        titleRef.current.style.lineHeight = '';
        titleRef.current.style.opacity = '1';
      }
      if (descriptionRef.current) descriptionRef.current.style.opacity = '';
      if (cardsColumnRef?.current) cardsColumnRef.current.style.opacity = '';
      if (cardsListRef?.current) cardsListRef.current.style.transform = '';

      setDimensions({ introAnimDistance: 0, cardsScrollDistance: 0, titleTranslateX: 0 });
      return;
    }

    if (!sectionRef.current || !titleRef.current) {
      if (sectionRef.current) sectionRef.current.style.height = '';
      setDimensions({ introAnimDistance: 0, cardsScrollDistance: 0, titleTranslateX: 0 });
      return;
    }

    const titleEl = titleRef.current;
    titleEl.style.transform = '';
    const titleRect = titleEl.getBoundingClientRect();
    const titleFinalCenter = titleRect.left + titleRect.width / 2;
    const screenCenter = window.innerWidth / 2;
    const initialTranslateX = screenCenter - titleFinalCenter;

    const introDistance = window.innerHeight;
    let scrollDistance = 0;

    if (cardsListRef?.current) {
      const cardsScrollHeight = cardsListRef.current.scrollHeight;
      // For visible height, we can use window height as a proxy if the column ref isn't available
      const cardsVisibleHeight = cardsColumnRef?.current?.clientHeight ?? window.innerHeight;
      scrollDistance = Math.max(0, cardsScrollHeight - cardsVisibleHeight * 0.5); // Adjust calculation
    }

    const totalHeight = introDistance + scrollDistance + window.innerHeight;

    sectionRef.current.style.height = `${totalHeight}px`;

    setDimensions({
      introAnimDistance: introDistance,
      cardsScrollDistance: scrollDistance,
      titleTranslateX: initialTranslateX,
    });

    if (titleRef.current) {
      titleRef.current.style.transform = `translateX(${initialTranslateX}px)`;
      const initialFontSize = window.innerWidth < 640 ? initialFontSizeMobile : initialFontSizeDesktop;
      titleRef.current.style.fontSize = `${initialFontSize}rem`;
      titleRef.current.style.lineHeight = '1.1';
      titleRef.current.style.opacity = '1';
    }
  }, [sectionRef, cardsListRef, cardsColumnRef, initialFontSizeDesktop, initialFontSizeMobile]);

  useEffect(() => {
    if (titleRef.current && window.innerWidth >= 768) {
      titleRef.current.style.opacity = '0';
    }

    const timeoutId = setTimeout(calculateDimensions, 100);
    window.addEventListener('resize', calculateDimensions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [calculateDimensions]);

  useEffect(() => {
    if (!lenis || !sectionRef.current || !isActive) return;

    const handleScroll = (e: { scroll: number }) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      const start = sectionRef.current.offsetTop;
      const currentScroll = e.scroll;
      const { introAnimDistance, cardsScrollDistance, titleTranslateX } = dimensions;

      if (introAnimDistance === 0) return;

      let introProgress = (currentScroll - start) / introAnimDistance;
      introProgress = Math.max(0, Math.min(1, introProgress));

      const translateX_px = titleTranslateX * (1 - introProgress);
      const initialFontSize = window.innerWidth < 640 ? initialFontSizeMobile : initialFontSizeDesktop;
      const fontSize = initialFontSize - introProgress * (initialFontSize - finalFontSizeDesktop);

      let cardTranslateY = 0;
      if (currentScroll > start + introAnimDistance) {
        const scrollWithinCards = currentScroll - (start + introAnimDistance);
        cardTranslateY = Math.min(scrollWithinCards, cardsScrollDistance);
      }

      const exitAnimStart = start + introAnimDistance + cardsScrollDistance;
      const exitAnimDistance = window.innerHeight;
      let exitProgress = 0;
      if (currentScroll > exitAnimStart) {
        exitProgress = (currentScroll - exitAnimStart) / exitAnimDistance;
        exitProgress = Math.max(0, Math.min(1, exitProgress));
      }

      requestAnimationFrame(() => {
        if (titleRef.current) {
          titleRef.current.style.transform = `translateX(${translateX_px}px)`;
          titleRef.current.style.fontSize = `${fontSize}rem`;
          titleRef.current.style.lineHeight = '1.1';
        }

        if (descriptionRef.current) {
          descriptionRef.current.style.opacity = `${Math.min(1, Math.max(0, (introProgress - 0.5) * 4))}`;
        }

        if (!disableContentAnimation) {
          if (cardsColumnRef?.current) {
            const fadeInOpacity = Math.min(1, Math.max(0, (introProgress - 0.5) / 0.5));
            const fadeOutOpacity = 1 - Math.min(1, Math.max(0, exitProgress / 0.8));
            cardsColumnRef.current.style.opacity = `${Math.min(fadeInOpacity, fadeOutOpacity)}`;
          }

          if (cardsListRef?.current && !customContentScroller) {
            cardsListRef.current.style.transform = `translateY(-${cardTranslateY}px)`;
          }
        }
      });
    };

    lenis.on('scroll', handleScroll);
    handleScroll({ scroll: lenis.scroll });

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [
    lenis,
    isActive,
    dimensions,
    sectionRef,
    cardsListRef,
    cardsColumnRef,
    initialFontSizeDesktop,
    finalFontSizeDesktop,
    initialFontSizeMobile,
    disableContentAnimation,
    customContentScroller,
  ]);

  return (
    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center">
      <h2
        ref={titleRef}
        className="text-6xl sm:text-8xl font-extrabold text-white tracking-tight text-center max-w-5xl whitespace-nowrap transition-opacity duration-200"
        style={{ willChange: 'transform, font-size, opacity' }}
      >
        {title}
      </h2>
      <p
        ref={descriptionRef}
        className="max-w-md mx-auto text-2xl text-gray-400 text-center mt-8 opacity-0 transition-opacity duration-300"
        style={{ willChange: 'opacity' }}
      >
        {description}
      </p>
    </div>
  );
};
