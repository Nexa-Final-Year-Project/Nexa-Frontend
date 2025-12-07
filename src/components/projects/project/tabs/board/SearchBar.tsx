// components/SearchInput.tsx
"use client";

import React from "react";
import { LucideSearch } from "lucide-react";
import { useTheme } from "next-themes";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative w-full max-w-md">
      <LucideSearch
        size={20}
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          isDark ? "text-muted-foreground" : "text-neutral-500"
        }`}
      />
      <input
        type="search"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-full border py-2 pl-10 pr-4 text-sm focus:ring-1 transition-all ${
          isDark
            ? "border-gray-300 bg-background text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            : "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
        }`}
      />
    </div>
  );
};

export default SearchInput;
