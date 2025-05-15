// API service for connecting to the integrityproject backend server
import { NewsArticle, RankedArticle } from '@/types/news';

// Base URL for API requests - connecting to integrityproject server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API keys for services
const SUPABASE_URL = 'https://hphpnxjfpnrmurjrbcef.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaHBueGpmcG5ybXVyanJiY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTM5NzYsImV4cCI6MjA2MTUyOTk3Nn0.9AaAHIKNcX3PHkKQKfoIEnqiehS-utxoPWSRfBl91R0';

// Additional API keys from integrityproject
const NEWS_KEY = 'pub_83393351512f8f49e67a9d6b177b5289b6fed';
const GOOGLE_KEY = 'AIzaSyBa3v8T1fFAq0BOOVsQmEEU9MZO-UEFRwQ';
const RESEND_KEY = 're_XcNacJpA_KPuyQqkU187Q72zZ5UdfBsPG';

// Default fetch options with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Helper function to check if the response is OK
const checkResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: `HTTP error ${response.status}: ${response.statusText}` 
    }));
    throw new Error(error.error || `HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json().catch(() => {
    throw new Error('Invalid JSON response from API');
  });
};

// Helper function for filtering articles by tags
function filterArticlesByTags(articles: NewsArticle[], tags: string[]): NewsArticle[] {
  if (!tags.length) return articles;
  
  return articles.filter(article => 
    article.tags.some(tag => tags.includes(tag))
  );
}

// Create new articles using the AI service
export async function createArticle(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if apiKey is in UUID format (will be validated by backend)
    if (!apiKey || apiKey.length !== 36 || !apiKey.includes('-')) {
      throw new Error('Invalid API key format. Expected UUID format like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    }

    console.log(`Sending request to: ${API_BASE_URL}/create-articles with key: ${apiKey}`);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/create-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: apiKey }),
    });
    
    if (!response.ok) {
      console.error(`Error response: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText}`);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return checkResponse(response);
  } catch (error) {
    console.error('Error creating article:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Fetch articles with pagination
export async function getAllArticles(page: number = 1, limit: number = 10): Promise<NewsArticle[]> {
  try {
    // Using the /articles endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/articles?page=${page}&limit=${limit}`
    );
    return checkResponse(response);
  } catch (error) {
    console.error('Error fetching articles:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Fetch a specific article by ID
export async function getArticleById(id: string): Promise<NewsArticle | null> {
  try {
    // Using the /article/{id} endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(`${API_BASE_URL}/article/${id}`);
    return checkResponse(response);
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

// Fetch recommended articles
export async function getRecommendedArticles(): Promise<RankedArticle[]> {
  try {
    // Using the /recommended endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(`${API_BASE_URL}/recommended`, {
      credentials: 'include', // Include cookies for user identification
    });
    return checkResponse(response);
  } catch (error) {
    console.error('Error fetching recommended articles:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Fetch trending articles
export async function getTrendingArticles(): Promise<NewsArticle[]> {
  try {
    // Using the /trending endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(`${API_BASE_URL}/trending`);
    return checkResponse(response);
  } catch (error) {
    console.error('Error fetching trending articles:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Filter articles by tags
export async function getArticlesByTags(tags: string[]): Promise<NewsArticle[]> {
  try {
    // Using the /filter-articles?tag= endpoint as implemented in integrityproject/src/server/main.ts
    const tagsString = tags.join('+');
    const response = await fetchWithTimeout(`${API_BASE_URL}/filter-articles?tag=${tagsString}`);
    return checkResponse(response);
  } catch (error) {
    console.error('Error fetching articles by tags:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    // Using the /login endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies for session management
    });
    return checkResponse(response);
  } catch (error) {
    console.error('Error logging in:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Register new user
export async function registerUser(email: string, password: string) {
  try {
    // Using the /register endpoint as implemented in integrityproject/src/server/main.ts
    const response = await fetchWithTimeout(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies for session management
    });
    return checkResponse(response);
  } catch (error) {
    console.error('Error registering user:', error instanceof Error ? error.message : error);
    throw error;
  }
}
