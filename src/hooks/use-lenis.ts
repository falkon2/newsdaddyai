"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  orientation?: "vertical" | "horizontal";
}

export function useLenis({
  duration = 1.2,
  easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel = true,
  smoothTouch = true,
  wheelMultiplier = 1,
  touchMultiplier = 2,
  orientation = "vertical",
}: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);
  
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      duration,
      easing,
      orientation,
      gestureOrientation: orientation,
      smoothWheel,
      smoothTouch,
      wheelMultiplier,
      touchMultiplier,
    });

    // Make Lenis instance available globally
    if (typeof window !== 'undefined') {
      (window as any).__lenis = lenisRef.current;
    }

    // Create the animation frame for Lenis
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation frame
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        
        // Remove global reference
        if (typeof window !== 'undefined') {
          (window as any).__lenis = undefined;
        }
      }
    };
  }, [
    duration,
    easing,
    orientation,
    smoothWheel,
    smoothTouch,
    wheelMultiplier,
    touchMultiplier,
  ]);

  return lenisRef.current;
}
