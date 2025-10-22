import React from 'react';
import { motion, type Variants } from 'framer-motion';

// Re-export motion for convenience in other components
export { motion };

// A standard variant for items fading in on scroll
export const itemVariants: Variants = {
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
 */
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  stagger = 0,
  delay = 0,
}) => {
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
