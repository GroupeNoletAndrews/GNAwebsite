import { motion, type Variants } from 'framer-motion';
import React from 'react';
import { useIsMobile } from '../lib/use-is-mobile';

// Re-export motion for convenience in other components
export { motion };

// Variant standard pour desktop (avec animations complètes)
export const itemVariantsDesktop: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Variant simplifié pour mobile (seulement opacity, pas de transformations)
export const itemVariantsMobile: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Export conditionnel basé sur le device (fallback desktop par défaut)
export const itemVariants: Variants = itemVariantsDesktop;

/**
 * Hook pour obtenir les variants appropriés selon le device
 */
export function useItemVariants(): Variants {
  const isMobile = useIsMobile();
  return isMobile ? itemVariantsMobile : itemVariantsDesktop;
}

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number; // Delay between children animations
  delay?: number; // Initial delay for the whole container
}

/**
 * A container that animates its children into view when it's scrolled to.
 * Use stagger prop for list animations. For single items, just wrap them.
 * Children that need to be animated must be <motion.div> or similar and have a `variants` prop.
 *
 * Sur mobile, les animations sont simplifiées pour améliorer la performance et l'affichage.
 */
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  stagger = 0,
  delay = 0,
}) => {
  const isMobile = useIsMobile();

  // Sur mobile, utiliser un div simple sans animations pour éviter les problèmes de rendu
  if (isMobile) {
    return (
      <div className={className} style={{ opacity: 1 }}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};
