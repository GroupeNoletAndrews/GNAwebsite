import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type Lenis from 'lenis';
import { cn } from '../lib/utils';

// --- ScrollStackItem ---
interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={cn(
      'scroll-stack-card relative w-full h-auto max-w-2xl min-h-[20rem] p-12 rounded-[40px] box-border origin-center',
      itemClassName
    )}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      willChange: 'transform, filter'
    }}
  >
    {children}
  </div>
);

// --- ScrollStack ---
interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  baseScale?: number;
  blurAmount?: number;
  lenis: Lenis | null;
  sectionRef: React.RefObject<HTMLDivElement>;
  introScrollOffset: number;
  innerRef?: React.RefObject<HTMLDivElement>;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 200,
  itemScale = 0.05,
  itemStackDistance = 20,
  baseScale = 0.8,
  blurAmount = 2,
  lenis,
  sectionRef,
  introScrollOffset,
  innerRef
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const isUpdatingRef = useRef(false);
  const lastTransformsRef = useRef(new Map<number, string>());


  const updateCardTransforms = useCallback(() => {
    if (isUpdatingRef.current || !sectionRef.current || !introScrollOffset || !cardsRef.current.length) return;

    isUpdatingRef.current = true;
    
    const scrollInSection = Math.max(0, (lenis?.scroll ?? 0) - (sectionRef.current?.offsetTop ?? 0));
    const scrollAfterIntro = Math.max(0, scrollInSection - introScrollOffset);

    const numCards = cardsRef.current.length;
    const distancePerCard = itemDistance;

    const topCardIndex = Math.min(numCards - 1, Math.floor(scrollAfterIntro / distancePerCard));
    const progressToNext = (scrollAfterIntro % distancePerCard) / distancePerCard;
    
    const updates: (()=>void)[] = [];

    cardsRef.current.forEach((card, i) => {
        if (!card) return;

        let scale, translateY, blur, zIndex;
        const depth = i - topCardIndex;

        if (depth < 0) {
            // Card is stacked behind the top card.
            const absDepth = Math.abs(depth);
            scale = 1 - absDepth * itemScale;
            translateY = -absDepth * itemStackDistance;
            blur = absDepth * blurAmount;
            zIndex = numCards - absDepth;
        } else if (depth === 0) {
            // This is the top card, being pushed away by the next one.
            scale = 1 - progressToNext * itemScale;
            translateY = -progressToNext * itemStackDistance;
            blur = progressToNext * blurAmount;
            zIndex = numCards;
        } else if (depth === 1) {
            // This card is animating in from the bottom.
            scale = baseScale + (1 - baseScale) * progressToNext;
            translateY = (1 - progressToNext) * (window.innerHeight / 4); // Animate from bottom
            blur = 0;
            zIndex = numCards - 1;
        } else {
            // This card is waiting further down the stack.
            scale = baseScale;
            translateY = window.innerHeight / 4; // Start off-screen
            blur = 0;
            zIndex = numCards - depth;
        }

        const transformString = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        const filterString = blur > 0 ? `blur(${blur.toFixed(2)}px)` : 'none';

        if(lastTransformsRef.current.get(i) !== transformString + filterString) {
          updates.push(()=>{
            card.style.transform = transformString;
            card.style.filter = filterString;
            card.style.zIndex = `${zIndex}`;
          });
          lastTransformsRef.current.set(i, transformString + filterString);
        }
    });

    if(updates.length > 0) {
        requestAnimationFrame(() => {
            updates.forEach(fn => fn());
        });
    }

    isUpdatingRef.current = false;
  }, [lenis, sectionRef, introScrollOffset, itemDistance, itemScale, itemStackDistance, baseScale, blurAmount]);
  
  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    if (!scrollerRef.current || !lenis) return;
    
    // FIX: Explicitly cast to HTMLElement[] to fix 'style' not existing on 'unknown' type error.
    const cards = Array.from(scrollerRef.current.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;
    
    cards.forEach((card) => {
      card.style.gridArea = '1 / 1 / 2 / 2';
    });
    
    lenis.on('scroll', handleScroll);
    updateCardTransforms();

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, handleScroll, updateCardTransforms]);

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)} ref={scrollerRef}>
      <div className="relative w-full h-full grid" ref={innerRef}>
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;