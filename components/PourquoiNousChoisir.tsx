import { motion } from 'framer-motion';
import type Lenis from 'lenis';
import React, { useRef } from 'react';
import { useIsMobile } from '../lib/use-is-mobile';
import { AnimatedContainer, useItemVariants } from './Animated';
import { AnimatedTitle } from './AnimatedTitle';
import { WobbleCard } from './ui/WobbleCard';

interface PourquoiNousChoisirProps {
  isActive?: boolean;
  lenis: Lenis | null;
}

const reasons = [
  {
    title: 'Expertise reconnue',
    description: 'Plus de 30 ans d’expérience en stratégie numérique, gestion et technologies.',
  },
  {
    title: 'Approche sur mesure',
    description: 'Chaque solution est adaptée à vos objectifs, vos ressources et votre réalité d’affaires.',
  },
  {
    title: 'Vision intégrée',
    description:
      'Nous couvrons l’ensemble du spectre des entreprises : optimisation, transformation et consultance stratégique.',
  },
  {
    title: 'Résultats concrets',
    description: 'Nos recommandations sont toujours orientées vers des gains mesurables et durables.',
  },
  {
    title: 'Innovation continue',
    description: 'Nous intégrons les meilleures pratiques et technologies pour garder vos solutions à jour.',
  },
  {
    title: 'Accompagnement humain',
    description: 'Un partenariat basé sur la transparence, la confiance et une communication claire.',
  },
  {
    title: 'Sécurité et conformité',
    description: 'Vos données et vos outils sont protégés selon les normes les plus strictes (Loi 25, RGPD).',
  },
  {
    title: 'Soutien durable',
    description: 'Nous restons présents après la mise en place pour assurer suivi, évolution et pérennité.',
  },
];

const PourquoiNousChoisir: React.FC<PourquoiNousChoisirProps> = ({ isActive, lenis }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);
  const cardsColumnRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const itemVariants = useItemVariants();

  const mobileLayout = (
    <AnimatedContainer
      className="w-full flex flex-col items-center justify-center text-center py-20 px-4"
      stagger={0.1}
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Pourquoi nous choisir ?</h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
          Et si vos opérations étaient aussi agiles que votre vision d'affaires ?
        </p>
      </motion.div>
      <div className="w-full max-w-2xl space-y-6">
        {reasons.map(reason => (
          <motion.div key={reason.title} variants={itemVariants}>
            <WobbleCard containerClassName="bg-gray-900/70 border border-gray-800">
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-base text-gray-400">{reason.description}</p>
              </div>
            </WobbleCard>
          </motion.div>
        ))}
      </div>
    </AnimatedContainer>
  );

  return (
    <section id="pourquoi-nous-choisir" className="w-full ">
      <div className="hidden md:block">
        <div className="max-w-[1800px] mx-auto">
          <div ref={sectionRef} className="relative">
            <div className="sticky top-0 h-screen w-full grid grid-cols-1 md:grid-cols-5 overflow-hidden px-8 gap-x-8">
              <AnimatedTitle
                lenis={lenis}
                isActive={isActive}
                title="Pourquoi Nous choisir ?"
                description="Et si vos opérations étaient aussi agiles que votre vision d’affaires ?"
                sectionRef={sectionRef}
                cardsListRef={cardsListRef}
                cardsColumnRef={cardsColumnRef}
              />
              <div
                ref={cardsColumnRef}
                className="hidden md:flex md:col-span-3 items-start justify-start relative pt-[30vh] pb-[30vh] opacity-0 max-h-screen overflow-hidden px-12"
                style={{ willChange: 'opacity' }}
              >
                <div ref={cardsListRef} className="w-full" style={{ willChange: 'transform' }}>
                  <div className="space-y-8">
                    {reasons.map(reason => (
                      <WobbleCard
                        key={reason.title}
                        containerClassName="bg-gray-900/80 border border-gray-700 shadow-2xl shadow-black/30"
                      >
                        <div className="p-12 text-left">
                          <h3 className="text-3xl font-bold text-white">{reason.title}</h3>
                          <p className="text-xl mt-4 text-gray-300">{reason.description}</p>
                        </div>
                      </WobbleCard>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">{mobileLayout}</div>
    </section>
  );
};

export default PourquoiNousChoisir;
