"use client";

import Lenis from "lenis";

// Get the global Lenis instance if it exists
export function getLenis(): Lenis | null {
  // In browser environment
  if (typeof window !== "undefined") {
    return (window as any).__lenis || null;
  }
  return null;
}

// Scroll to a specific element by ID
export function scrollToElement(
  elementId: string,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  const lenis = getLenis();
  if (!lenis) return;

  const element = document.getElementById(elementId);
  if (!element) return;

  lenis.scrollTo(element, options);
}

// Scroll to a specific position
export function scrollTo(
  target: number | HTMLElement | string,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  const lenis = getLenis();
  if (!lenis) return;

  lenis.scrollTo(target, options);
}

// Stop scrolling
export function stop() {
  const lenis = getLenis();
  if (!lenis) return;
  
  lenis.stop();
}

// Start scrolling (after it was stopped)
export function start() {
  const lenis = getLenis();
  if (!lenis) return;
  
  lenis.start();
}

// Get current scroll progress (0-1)
export function getScrollProgress(): number {
  const lenis = getLenis();
  if (!lenis) return 0;
  
  return lenis.progress;
}

// Get current scroll position
export function getScrollPosition(): number {
  const lenis = getLenis();
  if (!lenis) return 0;
  
  return lenis.scroll;
}

// Register a scroll listener
export function onScroll(callback: (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => void) {
  const lenis = getLenis();
  if (!lenis) return () => {};
  
  lenis.on('scroll', callback);
  
  // Return an unsubscribe function
  return () => {
    lenis.off('scroll', callback);
  };
}

// Check if an element is in viewport
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  if (!element || typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  return (
    rect.top <= windowHeight + offset &&
    rect.bottom >= 0 - offset
  );
}

// Get scroll progress for a specific element (0 when element enters viewport, 1 when it leaves)
export function getElementScrollProgress(element: HTMLElement): number {
  if (!element || typeof window === 'undefined') return 0;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Calculate how far the element has moved through the viewport
  // 0 when the element's top enters the bottom of the viewport
  // 1 when the element's bottom leaves the top of the viewport
  return Math.max(0, Math.min(1, 
    1 - (rect.bottom / (windowHeight + rect.height))
  ));
}
