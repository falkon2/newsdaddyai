"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type FocusCardItem = {
  id: string;
  title: string;
  content: React.ReactNode;
  src?: string;
};

interface FocusCardsProps {
  items: FocusCardItem[];
  className?: string;
}

export const FocusCards = ({ items, className }: FocusCardsProps) => {
  const [activeTab, setActiveTab] = useState<string>(items[0]?.id || "");

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Tab navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "px-4 py-2 text-sm whitespace-nowrap rounded-full transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {item.title}
          </motion.button>
        ))}
      </div>

      {/* Content area */}
      <div className="relative">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "transition-all duration-300",
              activeTab === item.id ? "opacity-100" : "opacity-0 hidden"
            )}
          >
            {activeTab === item.id && item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// For backward compatibility (old implementation)
export function Card({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: any;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      {card.src && (
        <img
          src={card.src}
          alt={card.title}
          className="object-cover absolute inset-0"
        />
      )}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {card.title}
        </div>
      </div>
    </div>
  );
}
