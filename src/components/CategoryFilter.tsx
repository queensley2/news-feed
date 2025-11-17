"use client";

import { useState } from "react";
import { Category } from "@/types";

interface CategoryFilterProps {
  onCategoryChange?: (category: Category) => void;
}

const categories: { id: Category; name: string }[] = [
  { id: "general", name: "Top Stories" },
  { id: "world", name: "World" },
  { id: "politics", name: "Politics" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Tech" },
  { id: "entertainment", name: "Cultures" },
];

export default function CategoryFilter({
  onCategoryChange,
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const handleCategoryClick = (categoryId: Category) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="overflow-x-auto bg-white hide-scrollbar">
      <div className="container mx-auto px-4">
        <div className="flex gap-5 space-x-1 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`nav-item ${
                activeCategory === category.id
                  ? "active"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
