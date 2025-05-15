"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CardContainer } from '@/components/ui/3d-card';
import { NewsArticle } from '@/types/news';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface ArticleCardProps {
  article: NewsArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Get a short excerpt from the content
  const getExcerpt = (content: string, maxLength = 150) => {
    const text = content || '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  
  // Format timestamp to a human-readable format (e.g., "2 hours ago", "3 days ago")
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const articleDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - articleDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      // Format date as MM/DD/YYYY
      return articleDate.toLocaleDateString();
    }
  };
  
  const content = article.content || article.body || '';
  
  return (
    <Link href={`/article/${article.id}`} className="block h-full">
      <CardContainer>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-2 text-xl">{article.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-4 text-sm">
              {getExcerpt(content)}
            </p>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground"
                >
                  {tag.toLowerCase().replace('_', ' ')}
                </span>
              ))}
              <div className="ml-auto flex flex-col items-end text-xs text-muted-foreground">
                {article.views_last_24 && (
                  <span>
                    {article.views_last_24} views
                  </span>
                )}
                {article.created_at && (
                  <span>
                    {formatTimestamp(article.created_at)}
                  </span>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </CardContainer>
    </Link>
  );
}
