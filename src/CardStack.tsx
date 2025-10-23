"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CardItem {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
}

export function CardStack({ items }: { items: CardItem[] }) {
  const [cards, setCards] = React.useState(items);

  React.useEffect(() => {
    // loop the animation by rotating the first card to the end every few seconds
    const interval = setInterval(() => {
      setCards((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md h-[28rem] perspective-[1000px]">
      <AnimatePresence>
        {cards.map((card, index) => {
          const zIndex = cards.length - index;
          return (
            <motion.div
              key={card.id}
              className="absolute w-full bg-white dark:bg-neutral-900 border border-black/10 rounded-2xl shadow-lg p-6 text-black dark:text-white font-literata"
              style={{ zIndex }}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -30, rotateX: -10 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="mb-2 text-[15px] font-semibold">{card.name}</div>
              <div className="text-sm mb-4 opacity-70">{card.designation}</div>
              <div className="text-[15px] leading-[1.55]">{card.content}</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
