"use client";

import { useState, ChangeEvent } from "react";
import { Search } from "lucide-react";

import { debounce } from "@/utils/helper";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");

  const handleSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
  }, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for news, topics..."
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}
