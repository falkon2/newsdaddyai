import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/types/news';
import { FocusCards } from '@/components/ui/focus-cards';
import { NewsFocusCards } from '@/components/ui/news-focus-cards';
import ArticleCard from '@/components/news/article-card';
import { formatRelativeTime } from '@/utils/date';
import Link from 'next/link';
import AnimateOnScroll from '@/components/ui/animate-on-scroll';

interface ScrollableNewsFeedProps {
  articles: NewsArticle[];
  loadMore: () => Promise<void>;
}

export default function ScrollableNewsFeed({ articles, loadMore }: ScrollableNewsFeedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Initialize new observer for infinite scrolling
    observerRef.current = new IntersectionObserver(async (entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting && !isLoading) {
        setIsLoading(true);
        await loadMore();
        setIsLoading(false);
      }
    }, { threshold: 0.5 });

    // Observe the last article
    if (lastArticleRef.current) {
      observerRef.current.observe(lastArticleRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [articles, isLoading, loadMore]);

  // Group articles by their top tag for tabbed navigation
  const articlesByTag: Record<string, NewsArticle[]> = {};
  articles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      const topTag = article.tags[0];
      if (!articlesByTag[topTag]) {
        articlesByTag[topTag] = [];
      }
      articlesByTag[topTag].push(article);
    }
  });

  const tags = Object.keys(articlesByTag);

  return (
    <>
      {/* Horizontal scrollable tabs for desktop */}
      <div className="hidden md:block mb-6">
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 text-sm whitespace-nowrap bg-secondary rounded-full hover:bg-secondary/80"
            >
              {tag.toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Cards for news */}
      <div className="mb-6">
        <NewsFocusCards articles={articles.slice(0, 6)} className="w-full" />
      </div>

      {/* Regular grid for desktop view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {articles.map((article, index) => (
          <AnimateOnScroll 
            key={article.id}
            animation="slide-up" 
            delay={index * 0.1} 
            duration={0.5}
            className="w-full"
          >
            <div ref={index === articles.length - 1 ? lastArticleRef : null}>
              <ArticleCard article={article} />
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Mobile list view (additional articles) */}
      <div className="space-y-4 mt-8">
        {articles.slice(6).map((article, index) => {
          const isLast = index === articles.slice(6).length - 1;
          return (
            <AnimateOnScroll
              key={article.id}
              animation="slide-up"
              delay={index * 0.05}
              duration={0.4}
              className="w-full"
            >
              <div ref={isLast ? lastArticleRef : null}>
                <Link href={`/article/${article.id}`} className="block">
                  <motion.div 
                    className="bg-card rounded-lg overflow-hidden shadow-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.content?.substring(0, 100) || article.body?.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {article.tags?.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full"
                            >
                              {tag.toLowerCase()}
                            </span>
                          ))}
                        </div>
                        {article.created_at && (
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(article.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}
