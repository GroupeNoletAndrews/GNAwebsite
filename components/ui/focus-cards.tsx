
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import type { Service } from "../../types";
import { motion, AnimatedContainer, itemVariants } from '../Animated';

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Service;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-xl bg-gray-900/50 border border-gray-800 h-full transition-all duration-300 ease-out p-8 flex flex-col",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <div className="text-white mb-6">{card.icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
      <p className="text-lg text-gray-400">{card.description}</p>
    </motion.div>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: Service[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <AnimatedContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </AnimatedContainer>
  );
}
