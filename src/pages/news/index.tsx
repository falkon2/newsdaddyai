"use client";

import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { NewsArticle } from '@/types/news';
import { getAllArticles } from '@/services/api';
import VerticalSnapScroll from '@/components/news/vertical-snap-scroll';

interface NewsPageProps {
  initialArticles: NewsArticle[];
}

export default function NewsPage({ initialArticles }: NewsPageProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const newArticles = await getAllArticles(nextPage, 5); // Load 5 articles per page
      
      if (newArticles.length > 0) {
        setArticles(prev => [...prev, ...newArticles]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="-mt-24 relative">
      <VerticalSnapScroll 
        articles={articles} 
        loadMore={loadMore}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch initial articles (5 per page)
    const articles = await getAllArticles(1, 5);
    
    // Add fake IDs for development if they don't exist
    const articlesWithIds = articles.map((article, index) => ({
      ...article,
      id: article.id || `article-${index}`,
    }));
    
    return {
      props: {
        initialArticles: articlesWithIds,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    
    return {
      props: {
        initialArticles: [],
      },
    };
  }
};
