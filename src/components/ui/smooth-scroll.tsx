"use client";

import { ReactNode } from "react";
import { useLenis } from "@/hooks/use-lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  // Initialize Lenis with our preferred settings
  useLenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    orientation: "vertical",
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  return <>{children}</>;
}
