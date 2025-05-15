"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { WavyBackground } from '@/components/ui/wavy-background';
import { NewsArticle } from '@/types/news';
import Link from 'next/link';

interface FeaturedArticleProps {
  article: NewsArticle;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  // Get a short excerpt from the content
  const getExcerpt = (content: string, maxLength = 200) => {
    const text = content || '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  
  const content = article.content || article.body || '';
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      <WavyBackground className="w-full h-full absolute inset-0">
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 md:px-10 text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <TextGenerateEffect words={article.title} />
            </h1>
            <p className="text-white/80 text-lg mb-8 line-clamp-3">
              {getExcerpt(content)}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white"
                >
                  {tag.toLowerCase().replace('_', ' ')}
                </span>
              ))}
            </div>
            <Link href={`/article/${article.id}`} passHref>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Read Full Article
              </Button>
            </Link>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}
