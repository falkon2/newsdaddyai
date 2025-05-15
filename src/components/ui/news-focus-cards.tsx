"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsArticle } from "@/types/news";
import { formatRelativeTime } from "@/utils/date";
import { useRouter } from "next/router";

interface NewsFocusCardsProps {
  articles: NewsArticle[];
  className?: string;
}

export const NewsFocusCards = ({ articles, className }: NewsFocusCardsProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false
  }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    });

    return () => {
      emblaApi.off("select", () => {});
    };
  }, [emblaApi]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Function to scroll to previous slide
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  
  // Function to scroll to next slide
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Navigate to article page when clicked
  const handleArticleClick = (id: string) => {
    router.push(`/article/${id}`);
  };

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {articles.map((article, index) => (
              <div 
                key={article.id} 
                className="relative flex-[0_0_90%] min-w-0 mx-2 h-[500px] sm:h-[550px] md:flex-[0_0_70%] md:h-[600px] lg:flex-[0_0_50%] cursor-pointer"
                onClick={() => handleArticleClick(article.id)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={controls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.5, 
                        delay: index * 0.1 
                      }
                    }
                  }}
                  className={cn(
                    "w-full h-full rounded-xl overflow-hidden transition-all duration-500",
                    activeIndex === index 
                      ? "scale-100 shadow-2xl" 
                      : "scale-[0.85] opacity-70"
                  )}
                >
                  {/* Background Image - using a generic image placeholder if no image */}
                  <div 
                    className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/70"
                    style={{
                      backgroundImage: `url(https://source.unsplash.com/random/800x600?${article.tags?.[0]?.toLowerCase() || 'news'})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                  
                  {/* Content */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags?.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2 py-1 bg-amber-500/80 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {article.title}
                    </h2>
                    <p className="text-sm md:text-base line-clamp-3 mb-4 text-gray-200">
                      {article.content?.substring(0, 150)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-300">
                        {article.created_at && formatRelativeTime(article.created_at)}
                      </span>
                      <span className="text-xs bg-gray-800/50 px-2 py-1 rounded-full">
                        Views: {article.views_last_24 || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute top-1/2 right-4 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "bg-white w-4" 
                  : "bg-white/50"
              )}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
