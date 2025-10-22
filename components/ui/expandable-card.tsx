import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../../lib/use-outside-click';
import { cn } from '../../lib/utils';

interface ExpandableCardProps {
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
  layoutId: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({ children, expandedContent, className, layoutId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setIsActive(false));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsActive(false);
      }
    };

    const mainScroller = document.querySelector('.overflow-y-auto');

    if (isActive) {
      document.body.style.overflow = 'hidden';
      if (mainScroller) {
        (mainScroller as HTMLElement).style.overflowY = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
      if (mainScroller) {
        (mainScroller as HTMLElement).style.overflowY = 'auto';
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (mainScroller) {
        (mainScroller as HTMLElement).style.overflowY = 'auto';
      }
    };
  }, [isActive]);

  const modalContent = (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 grid place-items-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsActive(false)}
          />
          <motion.div
            layoutId={layoutId}
            ref={ref}
            className="relative w-full md:w-2/3 lg:w-1/2 max-w-4xl h-auto max-h-[90vh] overflow-y-auto bg-gray-950/80 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50"
          >
            <div className="p-8 md:p-12">
              <button
                onClick={() => setIsActive(false)}
                className="absolute top-4 right-4 text-gray-400 transition z-10 p-2 rounded-full hover:bg-white/10"
              >
                <span className="sr-only">Fermer</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              {expandedContent}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div layoutId={layoutId} className={cn('cursor-pointer', className)} onClick={() => setIsActive(true)}>
        {children}
      </motion.div>

      {isMounted ? createPortal(modalContent, document.body) : null}
    </>
  );
};
