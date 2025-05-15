"use client";

import React, { useState, useEffect, useRef } from 'react';
import { NewsArticle } from '@/types/news';
import FullScreenArticleCard from './full-screen-article-card';
import { useLenis } from '@/hooks/use-lenis';
import { motion, useAnimation } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Loader2 } from 'lucide-react';

interface VerticalSnapScrollProps {
  articles: NewsArticle[];
  loadMore: () => Promise<void>;
}

export default function VerticalSnapScroll({ articles, loadMore }: VerticalSnapScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastArticleRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Initialize Lenis with snap scrolling settings
  const lenis = useLenis({
    duration: 1.2,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    snapType: "mandatory",
  });

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      if (e.dir === 'Up' || e.dir === 'Down') {
        setSwipeDirection(e.dir.toLowerCase() as 'up' | 'down');
      }
    },
    onSwipedUp: () => {
      if (activeIndex < articles.length - 1) {
        const nextElement = containerRef.current?.children[activeIndex + 1] as HTMLElement;
        nextElement?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onSwipedDown: () => {
      if (activeIndex > 0) {
        const prevElement = containerRef.current?.children[activeIndex - 1] as HTMLElement;
        prevElement?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setSwipeDirection(null);
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  // Handle intersection observer for infinite loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && !isLoading) {
          setIsLoading(true);
          await loadMore();
          setIsLoading(false);
        }
      },
      { threshold: 0.5 }
    );

    if (lastArticleRef.current) {
      observer.observe(lastArticleRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, loadMore]);

  // Handle scroll snapping and active article updates
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const articleElements = containerRef.current.children;
      
      let newActiveIndex = activeIndex;
      
      for (let i = 0; i < articleElements.length; i++) {
        const element = articleElements[i];
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        
        if (Math.abs(elementCenter - viewportCenter) < windowHeight / 2) {
          newActiveIndex = i;
          break;
        }
      }
      
      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, controls]);

  return (
    <div 
      {...swipeHandlers}
      ref={containerRef}
      className="relative h-[100svh] overflow-y-auto snap-y snap-mandatory"
    >
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          ref={index === articles.length - 1 ? lastArticleRef : undefined}
          className="snap-start h-[100svh] w-full relative"
          initial={{ opacity: 0, y: 20 }}
          animate={index === activeIndex ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FullScreenArticleCard
            article={article}
            isActive={index === activeIndex}
          />
        </motion.div>
      ))}
      {isLoading && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
