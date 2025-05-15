"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/types/news';
import { formatRelativeTime } from '@/utils/date';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Share2, MessageCircle, Bookmark } from 'lucide-react';

interface FullScreenArticleCardProps {
  article: NewsArticle;
  isActive: boolean;
}

export default function FullScreenArticleCard({ article, isActive }: FullScreenArticleCardProps) {
  return (
    <motion.div
      className={`relative w-full h-[100svh] bg-background flex flex-col justify-between p-6 ${
        isActive ? 'z-10' : 'z-0'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/article/${article.id}`} className="block">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span>{formatRelativeTime(article.created_at)}</span>
            <span>•</span>
            <div className="flex gap-2">
              {article.tags?.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 bg-secondary/50 rounded-full text-xs"
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Article preview */}
        <div className="mb-6 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-base/relaxed text-muted-foreground">
            {article.content?.substring(0, 280) || article.body?.substring(0, 280)}...
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Link href={`/article/${article.id}`}>
          <Button variant="secondary" size="sm">
            Read More
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-primary/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
