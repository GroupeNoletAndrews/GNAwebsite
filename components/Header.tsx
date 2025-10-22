
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    setIsScrolled(activeIndex > 0);
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
  
  const sectionIdMap: { [key: string]: number } = {
    '#about': 1,
    '#services': 2,
    '#team': 3,
    '#pourquoi-nous-choisir': 4,
    '#contact': 5,
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-950/70 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28">
          
          {/* Logo */}
          <div className={`flex-shrink-0 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <CursorHover as="button" onClick={() => onNavigate(0)} className="block">
              <img className="h-20 w-auto" src="https://plexview.ca/assets/Nolet__andrews_blanc-CHc9YYqz.png" alt="Groupe Nolet & Andrews" />
            </CursorHover>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:block transition-all duration-300 ${isScrolled ? 'relative' : 'absolute left-1/2 -translate-x-1/2'}`}>
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
                      className={`px-3 py-2 rounded-md text-lg font-medium transition-all transform duration-500 ease-in-out cursor-pointer whitespace-nowrap ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
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
          <div className="-mr-2 flex md:hidden">
            <CursorHover>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900/50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </CursorHover>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-950/95 backdrop-blur-sm">
            {NAV_LINKS.map((link, index) => {
               const sectionIndex = sectionIdMap[link.href];
               const isActive = activeIndex === sectionIndex;
              return (
              <CursorHover
                as="button"
                key={link.name}
                className={`w-full text-left block px-3 py-2 rounded-md text-lg font-medium transition-all transform duration-500 ease-in-out cursor-pointer ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                onClick={() => { onNavigate(sectionIndex); setIsOpen(false); }}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {link.name}
              </CursorHover>
            )})}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
