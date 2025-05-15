import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { NewsArticle } from '@/types/news';
import { getArticleById, getArticlesByTags } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WavyBackground } from '@/components/ui/wavy-background';
import ArticleCard from '@/components/news/article-card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export default function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
  const router = useRouter();
  
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
  
  // Handle the case where the article is still loading or not found
  if (router.isFallback || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Article header */}
      <div className="mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mb-4 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
        
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl mb-8">
          <WavyBackground className="w-full h-full absolute inset-0">
            <div className="relative z-10 flex flex-col justify-center h-full w-full px-6 md:px-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white"
                  >
                    {tag.toLowerCase().replace('_', ' ')}
                  </span>
                ))}
              </div>
              {article.created_at && (
                <div className="mt-2 text-sm text-white/80">
                  Published {formatTimestamp(article.created_at)}
                </div>
              )}
            </div>
          </WavyBackground>
        </div>
      </div>
      
      {/* Article content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="p-4 md:p-8">
            <div className="prose prose-sm md:prose dark:prose-invert max-w-none">
              {/* Article metadata for mobile - visible on small screens */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-xs">
                    {article.views_last_24 || 0} views
                  </span>
                </div>
                {article.created_at && (
                  <span className="text-muted-foreground text-xs">
                    {formatTimestamp(article.created_at)}
                  </span>
                )}
              </div>
              
              <div className="whitespace-pre-line">
                {article.content || article.body}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Sidebar with related articles */}
        <div className="space-y-6 order-1 lg:order-2">
          <div>
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No related articles found.</p>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-bold mb-4">Explore Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/?tag=${tag}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {tag.toLowerCase().replace('_', ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }
  
  try {
    // Fetch the article by ID
    const article = await getArticleById(id);
    
    if (!article) {
      return {
        notFound: true,
      };
    }
    
    // Fetch related articles based on tags
    let relatedArticles: NewsArticle[] = [];
    if (article.tags && article.tags.length > 0) {
      // Take up to 3 tags to find related articles
      const relatedTags = article.tags.slice(0, 3);
      const taggedArticles = await getArticlesByTags(relatedTags);
      
      // Filter out the current article and limit to 3 related articles
      relatedArticles = taggedArticles
        .filter(a => a.id !== article.id)
        .slice(0, 3);
    }
    
    return {
      props: {
        article,
        relatedArticles,
      },
    };
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    return {
      notFound: true,
    };
  }
};
