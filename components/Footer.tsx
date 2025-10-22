import React from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../constants';
import { CursorHover } from './Cursor';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800">
      <div 
        className="text-center max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map((item) => (
              <CursorHover as="a" key={item.name} href={item.href} className="text-base text-gray-400 hover:text-white transition">
                {item.name}
              </CursorHover>
            ))}
          </div>
          <div className="flex justify-center space-x-6">
            {SOCIAL_LINKS.map((item) => (
              <CursorHover as="a" key={item.name} href={item.href} className="text-gray-400 hover:text-white transition">
                <span className="sr-only">{item.name}</span>
                {item.icon}
              </CursorHover>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-base text-gray-500">
          &copy; {new Date().getFullYear()} Groupe Nolet & Andrews. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;