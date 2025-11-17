import NewsCard from "./NewsCard";
import { NewsArticle, Category } from "@/types";

interface NewsGridProps {
  articles: NewsArticle[];
  category: Category;
  isLoading?: boolean;
  onArticleClick?: (article: NewsArticle) => void;
}

export default function NewsGrid({
  articles,
  category,
  isLoading = false,
  onArticleClick,
}: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          No Articles Found
        </h2>
        <p className="text-gray-500 mb-6">
          Try adjusting your search or filter criteria.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh News
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {articles.map((article, index) => (
        <NewsCard
          key={article.url || index}
          article={article}
          category={category}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  );
}
