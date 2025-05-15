import { GetServerSideProps } from 'next';
import { useEffect, useState, useCallback } from 'react';
import { NewsArticle } from '@/types/news';
import { getAllArticles, getTrendingArticles, getArticlesByTags } from '@/services/api';
import FeaturedArticle from '@/components/news/featured-article';
import ArticleCard from '@/components/news/article-card';
import TagsFilter from '@/components/news/tags-filter';
import GenerateArticleButton from '@/components/news/generate-article-button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollableNewsFeed from '@/components/news/scrollable-news-feed';
import { NewsFocusCards } from '@/components/ui/news-focus-cards';

interface HomeProps {
  initialArticles: NewsArticle[];
  trendingArticles: NewsArticle[];
}

export default function Home({ initialArticles, trendingArticles }: HomeProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger data refresh
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Featured article is the first trending article or first regular article
  const featuredArticle = 
    trendingArticles?.length > 0 
      ? trendingArticles[0] 
      : articles.length > 0 
        ? articles[0] 
        : null;
  
  // Articles to display in the grid (excluding the featured one)
  const displayArticles = selectedTags.length > 0
    ? articles.filter(article => 
        article.tags.some(tag => selectedTags.includes(tag))
      )
    : articles;
  
  // Filter articles when tags change
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      if (selectedTags.length > 0) {
        setLoading(true);
        try {
          // Using the getArticlesByTags API to fetch filtered articles
          const filtered = await getArticlesByTags(selectedTags);
          setArticles(filtered);
          setPage(1); // Reset pagination when filters change
          setHasMore(filtered.length >= 10); // Assuming 10 per page
        } catch (error) {
          console.error('Error fetching filtered articles:', error);
          // Fallback to client-side filtering if API call fails
          const filtered = initialArticles.filter(article => 
            article.tags.some(tag => selectedTags.includes(tag))
          );
          setArticles(filtered);
          setHasMore(false); // Can't load more with client filtering
        } finally {
          setLoading(false);
        }
      } else {
        setArticles(initialArticles);
        setPage(1);
        setHasMore(initialArticles.length >= 10);
      }
    };
    
    fetchFilteredArticles();
  }, [selectedTags, initialArticles, refreshKey]);

  // Function to refresh articles
  const refreshArticles = async () => {
    setLoading(true);
    try {
      const [newArticles, newTrending] = await Promise.all([
        getAllArticles(),
        getTrendingArticles()
      ]);
      setArticles(newArticles);
      setPage(1);
      setHasMore(newArticles.length >= 10);
      // Increment refreshKey to force a re-render
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing articles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load more articles for infinite scrolling
  const loadMoreArticles = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      // In a real implementation, you would fetch the next page
      // For now, we're simulating by waiting and not adding new articles
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example of how you would implement:
      // const nextPage = await getAllArticles(page + 1);
      // if (nextPage.length > 0) {
      //   setArticles(prev => [...prev, ...nextPage]);
      //   setPage(prev => prev + 1);
      //   setHasMore(nextPage.length >= 10);
      // } else {
      //   setHasMore(false);
      // }
      
      // For demo purposes, just disable loading more
      setHasMore(false);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  return (
    <div className="space-y-12">
      {/* Hero section with featured article */}
      <section className="py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <TextGenerateEffect words="Integrity News" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Satirical AI-powered news that cuts through the noise with a sharp edge of humor and truth.
          </p>
          
          {/* Generate Article Button */}
          <div className="mt-6">
            <GenerateArticleButton 
              onSuccess={refreshArticles}
            />
          </div>
        </div>
        
        {featuredArticle ? (
          <FeaturedArticle article={featuredArticle} />
        ) : (
          <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse" />
        )}
      </section>
      
      <Separator />
      
      {/* Articles section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
        </div>
        
        <TagsFilter 
          selectedTags={selectedTags} 
          onTagSelect={setSelectedTags} 
        />
        
        {loading && displayArticles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : displayArticles.length > 0 ? (
          <ScrollableNewsFeed 
            articles={displayArticles} 
            loadMore={loadMoreArticles}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedTags.length > 0 
                ? "No articles found with the selected tags. Try selecting different tags."
                : "No articles available. Check back later for fresh content."}
            </p>
          </div>
        )}
      </section>
      
      {/* Trending section */}
      {trendingArticles?.length > 0 && (
        <>
          <Separator />
          <section>
            <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
            
            {/* Trending focus cards */}
            <div className="mb-8">
              <NewsFocusCards 
                articles={trendingArticles.slice(0, 5)} 
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch initial articles and trending articles in parallel
    const [initialArticles, trendingArticles] = await Promise.all([
      getAllArticles(),
      getTrendingArticles(),
    ]);

    // Add fake IDs for development if they don't exist
    const articlesWithIds = initialArticles.map((article, index) => ({
      ...article,
      id: article.id || `article-${index}`,
    }));

    const trendingWithIds = trendingArticles.map((article, index) => ({
      ...article,
      id: article.id || `trending-${index}`,
    }));

    return {
      props: {
        initialArticles: articlesWithIds,
        trendingArticles: trendingWithIds,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty arrays as fallback
    return {
      props: {
        initialArticles: [],
        trendingArticles: [],
      },
    };
  }
};
