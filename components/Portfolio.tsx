import React from 'react';
// FIX: PORTFOLIO_ITEMS is not exported from constants.tsx. Defined it as an empty array to fix build error.
// import { PORTFOLIO_ITEMS } from '../constants';
import { motion, AnimatedContainer, itemVariants } from './Animated';
import { CursorHover } from './Cursor';

// FIX: Added type for a portfolio item, as it's no longer imported.
interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

const Portfolio: React.FC = () => {
  // FIX: Using an empty array for PORTFOLIO_ITEMS as it's missing from constants.
  const PORTFOLIO_ITEMS: PortfolioItem[] = [];
  
  return (
    <section id="portfolio" className="w-full py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContainer className="text-center" stagger={0.1}>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Nos Réalisations</motion.h2>
          <motion.p variants={itemVariants} className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
            Découvrez quelques-uns des projets qui illustrent notre expertise et notre engagement envers l'excellence.
          </motion.p>
        </AnimatedContainer>
        <AnimatedContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {PORTFOLIO_ITEMS.length > 0 ? (
            PORTFOLIO_ITEMS.map((item) => (
              <CursorHover key={item.id}>
                <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-sm font-semibold text-white">{item.category}</p>
                    <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                  </div>
                </motion.div>
              </CursorHover>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-full text-center text-gray-400 text-lg">
              Nos réalisations seront bientôt disponibles ici.
            </motion.div>
          )}
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default Portfolio;
