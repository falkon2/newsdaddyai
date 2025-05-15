import { GetServerSideProps } from 'next';
import { NewsArticle } from '@/types/news';
import { getTrendingArticles } from '@/services/api';
import ArticleCard from '@/components/news/article-card';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TrendingPageProps {
  articles: NewsArticle[];
}

export default function TrendingPage({ articles }: TrendingPageProps) {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="py-6">
        <h1 className="text-4xl font-bold mb-2">
          <TextGenerateEffect words="Trending Articles" />
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          See what's popular on Integrity News right now
        </p>
        
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.slice(0, 2).map((article, index) => (
              <Card key={article.id} className="relative overflow-hidden p-6 h-[200px] flex flex-col justify-center">
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {article.views_last_24} views
                </div>
                <h2 className="text-2xl font-bold mb-2 line-clamp-2">{article.title}</h2>
                <p className="text-muted-foreground line-clamp-2">
                  {(article.content || article.body || '').slice(0, 100)}...
                </p>
                <a href={`/article/${article.id}`} className="absolute inset-0 z-10" aria-label={article.title}></a>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <Separator />
      
      {/* All trending articles */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Trending Articles</h2>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No trending articles at the moment. Check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch trending articles
    const articles = await getTrendingArticles();
    
    // Add fake IDs for development if they don't exist
    const articlesWithIds = articles.map((article, index) => ({
      ...article,
      id: article.id || `trending-${index}`,
      // If views_last_24 doesn't exist, add a random number for demonstration
      views_last_24: article.views_last_24 || Math.floor(Math.random() * 1000) + 100,
    }));
    
    // Sort by views (highest first)
    articlesWithIds.sort((a, b) => (b.views_last_24 || 0) - (a.views_last_24 || 0));
    
    return {
      props: {
        articles: articlesWithIds,
      },
    };
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    
    // Return empty array as fallback
    return {
      props: {
        articles: [],
      },
    };
  }
};
