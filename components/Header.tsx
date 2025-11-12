import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { NAV_LINKS } from '../constants';
import { CursorHover } from './Cursor';

interface HeaderProps {
  onNavigate: (index: number) => void;
  activeIndex: number;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Détection du scroll pour mobile - changement immédiat
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const handleScroll = () => {
        const scrollContainer = document.querySelector('.overflow-y-auto');
        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop;
          setIsScrolled(scrollTop > 0);
        }
      };

      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
        // Vérifier immédiatement l'état du scroll
        handleScroll();
      }

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    } else {
      // Sur desktop, utiliser activeIndex comme avant
      setIsScrolled(activeIndex > 0);
    }
  }, [activeIndex]);

  useEffect(() => {
    // Fermer le menu mobile lors du changement de section
    setIsOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('hasAnimated');
    if (hasAnimated) {
      setIsLoaded(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sectionIdMap: { [key: string]: number } = {
    '#about': 1,
    '#services': 2,
    '#team': 3,
    '#pourquoi-nous-choisir': 4,
    '#contact': 5,
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-gray-950/70 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20 sm:h-24 md:h-28">
          <div
            className={`flex-shrink-0 transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'md:opacity-0 md:pointer-events-none opacity-100'
            }`}
          >
            <CursorHover as="button" onClick={() => onNavigate(0)} className="block">
              <img
                className="h-12 sm:h-16 md:h-20 w-auto"
                src="https://plexview.ca/assets/Nolet__andrews_blanc-CHc9YYqz.png"
                alt="Groupe Nolet & Andrews"
              />
            </CursorHover>
          </div>

          <div
            className={`hidden md:block transition-all duration-300 ${
              isScrolled ? 'relative' : 'absolute left-1/2 -translate-x-1/2'
            }`}
          >
            <motion.div layout className="flex items-baseline space-x-2">
              {NAV_LINKS.map((link, index) => {
                const sectionIndex = sectionIdMap[link.href];
                const isActive = activeIndex === sectionIndex;

                return (
                  <motion.div
                    key={link.name}
                    animate={{ scale: isActive ? 1.25 : 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  >
                    <CursorHover
                      as="button"
                      onClick={() => onNavigate(sectionIndex)}
                      className={`px-3 py-2 rounded-md text-lg font-medium transition-all transform duration-500 ease-in-out cursor-pointer whitespace-nowrap ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                      } ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                      style={{ transitionDelay: `${200 + index * 150}ms` }}
                    >
                      {link.name}
                    </CursorHover>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <CursorHover>
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900/70 backdrop-blur-sm inline-flex items-center justify-center p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-white/20 touch-manipulation transition-all"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">{isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {!isOpen ? (
                    <svg
                      className="block h-7 w-7 sm:h-8 sm:w-8"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg
                      className="block h-7 w-7 sm:h-8 sm:w-8"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </motion.div>
              </motion.button>
            </CursorHover>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-950/95 backdrop-blur-sm shadow-lg"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              {NAV_LINKS.map((link, index) => {
                const sectionIndex = sectionIdMap[link.href];
                const isActive = activeIndex === sectionIndex;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CursorHover
                      as="button"
                      className={`w-full text-left block px-4 py-3 rounded-lg text-base sm:text-lg font-medium transition-all cursor-pointer touch-manipulation ${
                        isActive
                          ? 'text-white bg-white/10 border border-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => {
                        onNavigate(sectionIndex);
                        setIsOpen(false);
                      }}
                    >
                      {link.name}
                    </CursorHover>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
