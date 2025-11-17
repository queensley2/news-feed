"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsGrid from "@/components/NewsGrid";
import Footer from "@/components/Footer";
import { fetchNews } from "@/lib/api";
import { NewsArticle, Category } from "@/types";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllArticles, setShowAllArticles] = useState<boolean>(false);
  const router = useRouter();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  const loadNews = async (category: Category = "all", query: string = "") => {
    try {
      setIsLoading(true);
      setError(null);
      const news = await fetchNews(category, query);
      setArticles(news);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Failed to load news:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews(category, searchQuery);
  }, [category, searchQuery]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setShowAllArticles(false); 
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowAllArticles(false); 
  };

  const toggleShowAllArticles = () => {
    setShowAllArticles(!showAllArticles);
  };


  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);

    // Create a URL-friendly slug from the title
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    console.log("🔗 Home - Clicked article:", article.title);
    console.log("🔗 Home - Generated slug:", slug);
    console.log("🔗 Home - Navigating to:", `/article/${slug}`);

    router.push(`/article/${slug}`);
  };

  const breakingNews = articles[0];
  const displayedArticles = showAllArticles ? articles : articles.slice(0, 6);
  const hasMoreArticles = articles.length > 6;

  const categories = [
    { label: "All", value: "all" },
    { label: "Top Stories", value: "general" },
    { label: "World", value: "world" },
    { label: "Politics", value: "politics" },
    { label: "Business", value: "business" },
    { label: "Tech", value: "technology" },
    { label: "Culture", value: "entertainment" },
  ];

  const filterCategories = [
    { label: "All", value: "all" },
    { label: "Top Stories", value: "general" },
    { label: "World", value: "world" },
    { label: "Politics", value: "politics" },
    { label: "Business", value: "business" },
    { label: "Tech", value: "technology" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
        <div className="px-4 py-8 mx-auto container">
          <SearchBar onSearch={handleSearch} />
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => loadNews(category, searchQuery)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onCategoryChange={handleCategoryChange} onSearch={handleSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8 px-2">
          {filterCategories.map((cat) => (
            <button
              key={cat.value}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                category === cat.value
                  ? "bg-[#4D8FDB] text-white border-[#4D8FDB]"
                  : "text-gray-700 border-gray-300 hover:border-[#4D8FDB] hover:text-[#4D8FDB]"
              }`}
              onClick={() => handleCategoryChange(cat.value as Category)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Breaking News Banner */}
        {breakingNews && (
          <div className="bg-gradient-to-r from-[#102834] to-[#0F232C] rounded-xl text-white p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10 lg:mb-12 shadow-lg mx-2 sm:mx-0">
            <div className="max-w-4xl">
              <span className="inline-block bg-white text-red-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                BREAKING
              </span>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 leading-tight">
                {breakingNews.title}
              </h2>
              <p className="text-red-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {breakingNews.description ||
                  "A significant development has just occurred. Our team provides in-depth analysis and live updates as the situation develops."}
              </p>
              <button
                onClick={() => handleArticleClick(breakingNews)}
                className="inline-block bg-[#1173D4] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Read More
              </button>
            </div>
          </div>
        )}

        {/* Recent Articles Section */}
        <section className="mb-12 sm:mb-16 px-2 sm:px-0">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {category === "all"
                ? "Recent Articles"
                : `${categories.find((c) => c.value === category)?.label} News`}
            </h2>
          </div>

          <NewsGrid
            articles={displayedArticles}
            category={category}
            isLoading={isLoading}
            onArticleClick={handleArticleClick}
          />

          {/* Show More Button */}
          {hasMoreArticles && !showAllArticles && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={toggleShowAllArticles}
                className="bg-[#1173D4] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-[#1173D4] transition-colors shadow-md text-sm sm:text-base"
              >
                Show More Articles
              </button>
            </div>
          )}

          {/* Show Less Button */}
          {showAllArticles && hasMoreArticles && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={toggleShowAllArticles}
                className="bg-gray-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md text-sm sm:text-base"
              >
                Show Less
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
