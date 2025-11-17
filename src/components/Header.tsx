"use client";

import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { Category } from "@/types";

interface HeaderProps {
  onCategoryChange?: (category: Category) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ onCategoryChange, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleCategoryChange = (category: Category) => {
    onCategoryChange?.(category);
    setIsMenuOpen(false); 
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
    setIsSearchOpen(false); 
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <h1 className="text-xl font-bold text-black">News Today</h1>

              {/* Right side buttons */}
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-black hover:text-[#4D8FDB] transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600 hover:text-[#4D8FDB] transition-colors"
                  aria-label="Menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
              <div className="mt-4">
                <SearchBar onSearch={handleSearch} />
              </div>
            )}

            {/* Mobile Date */}
            <div className="text-xs text-gray-500 mt-2 text-center">
              {currentDate}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-black">News Today</h1>
              <div className="hidden lg:block">
                <CategoryFilter onCategoryChange={onCategoryChange} />
              </div>
            </div>
            <div className="flex-1 max-w-2xl">
              <SearchBar onSearch={onSearch} />
            </div>

            <div className="text-sm text-gray-500 whitespace-nowrap">
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Category Filter */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <CategoryFilter onCategoryChange={handleCategoryChange} />
          </div>
        </div>
      )}
    </header>
  );
}
