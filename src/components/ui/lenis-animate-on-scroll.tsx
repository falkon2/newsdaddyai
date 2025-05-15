"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { getLenis } from "@/utils/scroll";

interface LenisAnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-down" 
    | "slide-left" 
    | "slide-right"
    | "zoom-in"
    | "rotate";
  delay?: number;
  duration?: number;
  once?: boolean;
  distance?: number;
  rootMargin?: string;
}

export default function LenisAnimateOnScroll({ 
  children, 
  className = "", 
  threshold = 0.1,
  animation = "fade-in",
  delay = 0,
  duration = 0.6,
  once = true,
  distance = 50,
  rootMargin = "0px 0px -100px 0px"
}: LenisAnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Define animation variants based on the animation type
  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration, 
          delay,
          ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic bezier for smoother motion
        }
      }
    };
    
    switch (animation) {
      case "slide-up":
        return {
          hidden: { ...baseVariants.hidden, y: distance },
          visible: { ...baseVariants.visible, y: 0 }
        };
      case "slide-down":
        return {
          hidden: { ...baseVariants.hidden, y: -distance },
          visible: { ...baseVariants.visible, y: 0 }
        };
      case "slide-left":
        return {
          hidden: { ...baseVariants.hidden, x: distance },
          visible: { ...baseVariants.visible, x: 0 }
        };
      case "slide-right":
        return {
          hidden: { ...baseVariants.hidden, x: -distance },
          visible: { ...baseVariants.visible, x: 0 }
        };
      case "zoom-in":
        return {
          hidden: { ...baseVariants.hidden, scale: 0.8 },
          visible: { ...baseVariants.visible, scale: 1 }
        };
      case "rotate":
        return {
          hidden: { ...baseVariants.hidden, rotate: -10 },
          visible: { ...baseVariants.visible, rotate: 0 }
        };
      case "fade-in":
      default:
        return baseVariants;
    }
  };
  
  useEffect(() => {
    const lenis = getLenis();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
          controls.start("hidden");
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    const element = ref.current;
    
    if (element) {
      observer.observe(element);
    }
    
    // Setup Lenis scroll event listener if we want continuous animation effects
    if (!once && lenis) {
      const onScrollHandler = () => {
        if (element && isInViewport(element)) {
          const scrollPos = lenis.scroll;
          // You can use scrollPos to create custom scroll-based animations
          // This is a simple example - modify as needed
          const elementTop = element.getBoundingClientRect().top + scrollPos;
          const scrollProgress = Math.max(0, Math.min(1, (scrollPos - elementTop + window.innerHeight) / window.innerHeight));
          
          // Use scrollProgress for custom animations if needed
          // For example, you could use this to adjust opacity or transform values
        }
      };
      
      lenis.on('scroll', onScrollHandler);
      
      return () => {
        observer.disconnect();
        lenis.off('scroll', onScrollHandler);
      };
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, once, controls, isVisible]);
  
  // Helper function to check if element is in viewport
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  };
  
  const variants = getAnimationVariants();
  
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
