import { motion } from 'framer-motion';
import React from 'react';
import { useIsMobile } from '../lib/use-is-mobile';
import { AnimatedContainer, useItemVariants } from './Animated';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => {
  const itemVariants = useItemVariants();

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-4 sm:p-6">
      <div className="flex-shrink-0 mb-3 sm:mb-4 flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-900 text-white">
        <div className="scale-75 sm:scale-100">{icon}</div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-base sm:text-lg text-gray-400">{children}</p>
    </motion.div>
  );
};

interface AboutProps {
  isActive?: boolean;
}

const About: React.FC<AboutProps> = ({ isActive }) => {
  const isMobile = useIsMobile();
  const itemVariants = useItemVariants();

  const variants = isMobile
    ? {
        visible: { opacity: 1, transition: { duration: 1.5 } },
        hidden: { opacity: 0, transition: { duration: 1 } },
      }
    : {
        visible: { opacity: 1, scale: 1, transition: { duration: 2, delay: 0, when: 'beforeChildren' } },
        hidden: { opacity: 0, scale: 0.95, transition: { duration: 1.2 } },
      };

  const contentJSX = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedContainer className="text-center" stagger={0.4}>
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
        >
          Un véritable partenaire de croissance
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-400 px-2"
        >
          Chez Groupe Nolet & Andrews, nous simplifions vos opérations, optimisons vos ressources et accélérons la
          croissance de votre entreprise. Grâce à nos solutions et méthodes éprouvées, chaque défi devient une
          opportunité claire et mesurable.
        </motion.p>
      </AnimatedContainer>
      <AnimatedContainer
        className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.5}
      >
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          title="Partenariat"
        >
          Nous travaillons en étroite collaboration avec nos clients, agissant comme une extension de leur équipe pour
          assurer leur succès.
        </FeatureCard>
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Résultats"
        >
          Nous optimisons vos processus, vos finances et vos équipes pour générer des gains concrets et durables. Chaque
          action vise à améliorer votre efficacité et votre croissance.
        </FeatureCard>
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          title="Innovation"
        >
          Chaque organisation est unique. Nous développons des solutions sur mesure, technologiques, stratégiques et
          opérationnelles qui vous offrent un avantage durable et une longueur d'avance.
        </FeatureCard>
      </AnimatedContainer>
    </div>
  );

  return (
    <section id="about" className="w-full min-h-screen flex items-center justify-center py-16 sm:py-20 lg:py-24">
      {isMobile ? (
        <div className="w-full" style={{ opacity: 1 }}>
          {contentJSX}
        </div>
      ) : (
        <motion.div className="w-full" variants={variants} initial="hidden" animate={isActive ? 'visible' : 'hidden'}>
          {contentJSX}
        </motion.div>
      )}
    </section>
  );
};

export default About;
