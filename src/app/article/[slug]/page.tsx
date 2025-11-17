"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NewsArticle, Category } from "@/types";
import { fetchNews } from "@/lib/api";

// Manual comments data
const comments = [
  {
    id: 1,
    name: "Ethan Carter",
    date: "July 27, 2024",
    content:
      "Great coverage of the conference! It's exciting to see the progress in AI and sustainable tech.",
  },
  {
    id: 2,
    name: "Olivia Bennett",
    date: "July 27, 2024",
    content:
      "I agree! The focus on ethical considerations is also very important.",
  },
];

const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [comment, setComment] = useState("");

  const getCategoryFromArticle = (article: NewsArticle): Category => {
    const sourceName = article.source?.name?.toLowerCase() || "";

    if (
      sourceName.includes("tech") ||
      sourceName.includes("ai") ||
      sourceName.includes("digital")
    ) {
      return "technology";
    } else if (
      sourceName.includes("business") ||
      sourceName.includes("finance") ||
      sourceName.includes("market")
    ) {
      return "business";
    } else if (
      sourceName.includes("politics") ||
      sourceName.includes("government")
    ) {
      return "politics";
    } else if (
      sourceName.includes("entertainment") ||
      sourceName.includes("movie") ||
      sourceName.includes("music")
    ) {
      return "entertainment";
    } else if (sourceName.includes("world") || sourceName.includes("global")) {
      return "world";
    } else {
      return "general";
    }
  };

  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setIsLoading(true);
        setIsRelatedLoading(true);

        console.log("🔍 Article - Loading article for slug:", params.slug);

        // Get all articles to find the current one
        const allArticles = await fetchNews("all", "");
        console.log("🔍 Article - Fetched articles:", allArticles.length);

        // Find the current article using the EXACT same slug logic
        const slug = params.slug as string;
        const currentArticle = allArticles.find((a) => {
          const articleSlug = createSlug(a.title);
          return articleSlug === slug;
        });

        console.log("🔍 Article - Found article:", currentArticle);

        if (currentArticle) {
          setArticle(currentArticle);

          // Get related articles from the same category or general news
          const category = getCategoryFromArticle(currentArticle);
          const related = await fetchNews(
            category === "all" ? "general" : category,
            ""
          );
          setRelatedArticles(
            related.filter((a) => createSlug(a.title) !== slug).slice(0, 2)
          );
        } else {
          console.log(" Article - Article not found for slug:", slug);
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading article:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
        setIsRelatedLoading(false);
      }
    };

    if (params.slug) {
      loadArticleData();
    }
  }, [params.slug, router]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment:", comment);
    setComment("");
    alert("Comment submitted! (This is a demo)");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  // Fix: Add display category function that returns display names
  const getDisplayCategory = (article: NewsArticle): string => {
    const category = getCategoryFromArticle(article);
    const categoryMap: Record<Category, string> = {
      all: "All",
      general: "Top Stories",
      world: "World",
      politics: "Politics",
      business: "Business",
      technology: "Tech",
      entertainment: "Culture",
    };
    return categoryMap[category] || "General";
  };

  const getFullArticleContent = (article: NewsArticle) => {
    if (article.content) {
      return article.content.replace(/\[\+\d+\s*chars\]$/g, "").trim();
    }

    if (article.description) {
      return `
${article.description}

This breaking news story continues to develop as more information becomes available. Our team is closely monitoring the situation and will provide updates as they emerge.

The implications of this development could have far-reaching consequences across multiple sectors. Industry experts are analyzing the potential impact and what it means for the future.

Stay tuned for more detailed analysis and expert commentary on this evolving story. We'll bring you the latest information as it becomes available.
      `.trim();
    }

    return "This article provides comprehensive coverage of the latest developments. For the full story and additional details, please visit the original source using the link below.";
  };

  const handleReadOriginal = () => {
    if (article?.url) {
      window.open(article.url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCategoryChange={() => {}} onSearch={() => {}} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCategoryChange={() => {}} onSearch={() => {}} />
        <main className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-4">Slug: {params.slug}</p>
          <Link href="/" className="text-red-600 hover:underline">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const articleCategory = getCategoryFromArticle(article);
  const displayCategory = getDisplayCategory(article);
  const fullContent = getFullArticleContent(article);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onCategoryChange={() => {}} onSearch={() => {}} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-red-600">
            News
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${articleCategory}`}
            className="hover:text-red-600"
          >
            {displayCategory}
          </Link>
          <span>/</span>
          <span className="text-gray-400">Current Article</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap">
              <span className="font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {displayCategory}
              </span>
              <span>
                By {article.author || article.source?.name || "Unknown Author"}
              </span>
              <span>•</span>
              <span>Published on {formatDate(article.publishedAt)}</span>
            </div>

            {/* Social Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                <span className="text-lg">👍</span>
                <span>1.2k</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                <span className="text-lg">👎</span>
                <span>34</span>
              </button>
              <button
                onClick={handleReadOriginal}
                className="flex items-center space-x-1 hover:text-red-600 transition-colors bg-[#1173D4] text-white px-4 py-2 rounded-lg"
              >
                <span>📖</span>
                <span>Read Original</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.urlToImage ? (
          <div className="mb-8">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-md"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="mb-8 h-64 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image Available</span>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-red-600">
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {article.description || "Breaking news story unfolding..."}
            </p>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            {fullContent.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Source Information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Source:</strong> {article.source?.name || "Unknown"} |
              <strong> Published:</strong> {formatDate(article.publishedAt)}
              {article.author && (
                <>
                  <strong> | Author:</strong> {article.author}
                </>
              )}
            </p>
          </div>
        </article>

        {/* Social Share Section */}
        <div className="border-t border-b border-gray-200 py-6 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm font-medium text-gray-900">
              Share this article:
            </span>
            <div className="flex space-x-4">
              <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="w-5 h-5">📱</span>
              </button>
              <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="w-5 h-5">🐦</span>
              </button>
              <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="w-5 h-5">💼</span>
              </button>
              <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="w-5 h-5">📘</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Articles
          </h2>
          {isRelatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {related.urlToImage ? (
                    <div className="h-48">
                      <img
                        src={related.urlToImage}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {getDisplayCategory(related)}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {related.description || "Read more about this story."}
                    </p>
                    <Link
                      href={`/article/${createSlug(related.title)}`}
                      className="text-red-600 font-medium hover:text-red-700 text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No related articles found.
            </p>
          )}
        </section>

        {/* Comments Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comments List */}
          <div className="space-y-6 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">
                    {comment.name}
                  </span>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form
            onSubmit={handleSubmitComment}
            className="bg-gray-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add a comment...
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              required
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#1173D4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
