import { NewsArticle, Category } from "@/types";

/**
 * Fetch news articles from the API route
 * @param category - News category filter (default: "all")
 * @param searchQuery - Search query for finding specific news
 * @returns Promise of filtered NewsArticle array
 */
export async function fetchNews(
  category: Category = "all",
  searchQuery: string = ""
): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (searchQuery) params.append("search", searchQuery);

    const response = await fetch(`/api/news?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}
