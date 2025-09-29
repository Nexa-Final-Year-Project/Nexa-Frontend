// components/SearchInput.tsx
"use client";

import React from "react";
import { LucideSearch } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <LucideSearch
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-gray-300 bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
};

export default SearchInput;
