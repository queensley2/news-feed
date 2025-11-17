import axios, { AxiosInstance, AxiosError } from "axios";
import { NewsArticle, Category, NewsResponse } from "@/types";

// API Configuration
const API_KEY =
  process.env.NEXT_PUBLIC_NEWS_API_KEY || "0e67c853139e41abb3a28619e6cffb5b";
const BASE_URL = "https://newsapi.org/v2";

// Create Axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Axios request interceptor
axiosInstance.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] Status: ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      } - ${error.status}`
    );
    return Promise.reject(error);
  }
);

/**
 * Fetch news articles from NewsAPI
 * @param category - News category filter (default: "all")
 * @param searchQuery - Search query for finding specific news
 * @returns Promise of filtered NewsArticle array
 */
export async function fetchNews(
  category: Category = "all",
  searchQuery: string = ""
): Promise<NewsArticle[]> {
  try {
    let response;

    if (searchQuery) {
      // Use /everything endpoint for search queries
      response = await axiosInstance.get<NewsResponse>("/everything", {
        params: {
          q: searchQuery,
          sortBy: "publishedAt",
          pageSize: 20,
          apiKey: API_KEY,
        },
      });
    } else {
      // Use /top-headlines endpoint for category filtering,,,
      const params: Record<string, string | number> = {
        country: "us",
        pageSize: 20,
        apiKey: API_KEY,
      };

      if (category !== "all") {
        params.category = category;
      }

      response = await axiosInstance.get<NewsResponse>("/top-headlines", {
        params,
      });
    }

    const data = response.data;

    // Validate response structure
    if (data.status === "ok" && data.articles) {
      // Filter out articles with removed titles
      const filteredArticles = data.articles.filter(
        (article: NewsArticle) => article.title !== "[Removed]"
      );

      console.log(
        `[API Success] Retrieved ${filteredArticles.length} articles for category: ${category}`
      );

      return filteredArticles;
    } else {
      throw new Error(
        `Invalid response from News API: ${data.status || "unknown"}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error(`[API Fetch Error] ${message}`, error);
      throw new Error(`Failed to fetch news: ${message}`);
    } else if (error instanceof Error) {
      console.error(`[API Fetch Error] ${error.message}`, error);
      throw error;
    } else {
      console.error("[API Fetch Error] Unknown error occurred");
      throw new Error("An unknown error occurred while fetching news");
    }
  }
}
