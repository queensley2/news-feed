import { formatDate } from "@/utils/helper";
import { NewsArticle, Category } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
  category: Category;
  onArticleClick?: (article: NewsArticle) => void;
}

export default function NewsCard({
  article,
  category,
  onArticleClick,
}: NewsCardProps) {
  const handleClick = () => {
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="news-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:scale-[1.02] focus:shadow-lg focus:outline-none"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Read full article: ${article.title || "News article"}`}
    >
      {article.urlToImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title || "News image"}
            width={400}
            height={192}
            className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-5">
        <span className="news-category text-black">
          {category === "all"
            ? "General"
            : category.charAt(0).toUpperCase() + category.slice(1)}
        </span>

        <h3 className="text-lg text-black font-semibold mb-2 line-clamp-2 leading-tight">
          {article.title || "No title available"}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description || "No description available"}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="font-medium">
            {article.source?.name || "Unknown source"}
          </span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
