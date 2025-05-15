"use client";

import React, { useRef, useEffect } from "react";

interface AnimateOnScrollProps {
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
}

export default function AnimateOnScroll({ 
  children, 
  className = "", 
  threshold = 0.1,
  animation = "fade-in",
  delay = 0,
  duration = 0.6,
  once = true
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove("animate");
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px"
      }
    );
    
    const element = ref.current;
    
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, once]);
  
  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in": return "aos-fade-in";
      case "slide-up": return "aos-slide-up";
      case "slide-down": return "aos-slide-down";
      case "slide-left": return "aos-slide-left";
      case "slide-right": return "aos-slide-right";
      case "zoom-in": return "aos-zoom-in";
      case "rotate": return "aos-rotate";
      default: return "aos-fade-in";
    }
  };
  
  const getStyle = () => {
    return {
      opacity: animation.includes("fade") ? 0 : 1,
      transitionDelay: `${delay}s`,
      transitionDuration: `${duration}s`
    };
  };
  
  return (
    <div 
      ref={ref} 
      className={`${className} ${getAnimationClass()}`}
      style={getStyle()}
    >
      {children}
    </div>
  );
}
