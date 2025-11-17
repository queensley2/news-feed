import { NewsArticle, Category } from "@/types";

// Temporary hardcoded solution
const API_KEY =
  process.env.NEXT_PUBLIC_NEWS_API_KEY || "0e67c853139e41abb3a28619e6cffb5b";
const BASE_URL = "https://newsapi.org/v2";

export async function fetchNews(
  category: Category = "all",
  searchQuery: string = ""
): Promise<NewsArticle[]> {
  try {
    let url;
    const baseParams = `pageSize=20&apiKey=${API_KEY}`;

    if (searchQuery) {
      url = `${BASE_URL}/everything?q=${encodeURIComponent(
        searchQuery
      )}&sortBy=publishedAt&${baseParams}`;
    } else {
      if (category === "all") {
        url = `${BASE_URL}/top-headlines?country=us&${baseParams}`;
      } else {
        url = `${BASE_URL}/top-headlines?country=us&category=${category}&${baseParams}`;
      }
    }

    // Modern fetch configuration for better performance
    const response = await fetch(url, {
      // These options help with modern HTTP features
      method: "GET",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
      },
      // Enable modern fetch features
      keepalive: true,
      // Next.js specific: ensure proper handling
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    } as RequestInit & { next?: { revalidate: number } });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "ok" && data.articles) {
      return data.articles.filter(
        (article: NewsArticle) => article.title !== "[Removed]"
      );
    } else {
      throw new Error("Invalid response from news API");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}
