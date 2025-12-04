"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  ListChecks,
  FolderKanban,
  History,
  Search,
  Sparkles,
  Command,
  Clock,
  X,
} from "lucide-react";

type EntityType = "Task" | "Project" | "User" | "ActivityLog";

type SearchResult = {
  id: string;
  entityType: EntityType;
  title: string;
  description?: string;
  link: string;
  pinned?: boolean;
};

const FILTERS: EntityType[] = ["Task", "Project", "User", "ActivityLog"];

const ICONS: Record<EntityType, React.ReactNode> = {
  Task: <ListChecks className="w-4 h-4 text-violet-400" />,
  Project: <FolderKanban className="w-4 h-4 text-emerald-400" />,
  User: <User className="w-4 h-4 text-cyan-400" />,
  ActivityLog: <History className="w-4 h-4 text-amber-400" />,
};

const FILTER_COLORS: Record<EntityType, { active: string; inactive: string }> = {
  Task: { 
    active: "bg-violet-500/20 border-violet-500/40 text-violet-300", 
    inactive: "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/[0.1]" 
  },
  Project: { 
    active: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300", 
    inactive: "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/[0.1]" 
  },
  User: { 
    active: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300", 
    inactive: "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/[0.1]" 
  },
  ActivityLog: { 
    active: "bg-amber-500/20 border-amber-500/40 text-amber-300", 
    inactive: "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/[0.1]" 
  },
};

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<EntityType[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecent(stored);
  }, []);

  // Save recent
  const saveRecent = (q: string) => {
    if (!q.trim()) return;
    let updated = [q, ...recent.filter((r) => r !== q)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Fetch results
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      const typeParam =
        activeFilters.length > 0 ? `&type=${activeFilters.join(",")}` : "";
      const res = await fetch(
        `http://localhost:5000/api/search?q=${query}${typeParam}`,
        { credentials: "include" }
      );
      const data: SearchResult[] = await res.json();
      setResults([
        ...data.filter((d) => d.pinned),
        ...data.filter((d) => !d.pinned),
      ]);
      setActiveIndex(0);
      setLoading(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, activeFilters]);

  const grouped = results.reduce((acc, item) => {
    acc[item.entityType] = acc[item.entityType] || [];
    acc[item.entityType].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[activeIndex];
        if (selected) {
          saveRecent(query);
          window.location.href = selected.link;
        }
      } else if (e.key === "Escape") {
        setQuery("");
        setResults([]);
      }
    },
    [results, activeIndex, query]
  );

  // Shortcut "/"
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const toggleFilter = (filter: EntityType) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const highlight = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-violet-500/30 text-violet-200 font-medium px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Search input */}
      <div className="
        relative flex items-center w-full
        bg-neutral-900/80 border border-white/[0.08]
        rounded-2xl px-4 py-3
        backdrop-blur-xl
        focus-within:border-violet-500/40
        focus-within:shadow-[0_0_30px_rgba(139,92,246,0.15)]
        transition-all duration-300
        group
      ">
        <Search className="w-5 h-5 text-white/30 group-focus-within:text-violet-400 transition-colors duration-200" />
        <Input
          ref={inputRef}
          placeholder="Search tasks, projects, users..."
          className="
            border-0 bg-transparent
            focus-visible:ring-0 focus:outline-none
            text-sm text-white placeholder:text-white/30
            ml-3 w-full
          "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        )}
        <div className="
          hidden sm:flex items-center gap-1
          px-2 py-1 rounded-lg
          bg-white/[0.05] border border-white/[0.06]
          text-xs text-white/30
          ml-2
        ">
          <Command className="w-3 h-3" />
          <span>/</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {FILTERS.map((f) => {
          const isActive = activeFilters.includes(f);
          const colors = FILTER_COLORS[f];
          return (
            <button
              key={f}
              className={`
                flex items-center gap-2 px-4 py-2
                rounded-xl border text-xs font-medium
                transition-all duration-200 cursor-pointer
                ${isActive ? colors.active : colors.inactive}
              `}
              onClick={() => toggleFilter(f)}
            >
              {ICONS[f]} <span>{f}</span>
            </button>
          );
        })}
      </div>

      {/* Recent searches */}
      {!query && recent.length > 0 && (
        <Card className="
          absolute top-20 w-full z-50
          bg-neutral-950/95 border border-white/[0.08]
          rounded-2xl overflow-hidden
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          backdrop-blur-xl
        ">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs uppercase font-semibold text-white/40 mb-3 px-2">
              <Clock className="w-3.5 h-3.5" />
              Recent Searches
            </div>
            {recent.map((r, i) => (
              <div
                key={i}
                className="
                  px-3 py-2.5 text-sm text-white/70
                  cursor-pointer rounded-xl
                  hover:bg-white/[0.05] hover:text-white
                  transition-all duration-200
                "
                onClick={() => setQuery(r)}
              >
                {r}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Results dropdown */}
      {query && (
        <Card className="
          absolute top-20 w-full z-50
          bg-neutral-950/95 border border-white/[0.08]
          rounded-2xl overflow-hidden
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          backdrop-blur-xl
          max-h-[60vh] overflow-y-auto
        ">
          <CardContent className="p-3">
            {loading && (
              <div className="flex items-center gap-3 p-4 text-sm text-white/50">
                <Loader2 className="animate-spin w-5 h-5 text-violet-400" />
                <span>Searching...</span>
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="
                  w-12 h-12 rounded-xl
                  bg-white/[0.03] border border-white/[0.06]
                  flex items-center justify-center
                ">
                  <Search className="w-5 h-5 text-white/30" />
                </div>
                <p className="text-sm text-white/40">
                  No results found. Try different keywords.
                </p>
              </div>
            )}

            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 text-xs uppercase font-semibold text-white/40 mb-2 px-2">
                  {ICONS[type as EntityType]} {type}
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const globalIndex = results.findIndex(
                      (r) => r.id === item.id
                    );
                    const isActive = activeIndex === globalIndex;
                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        className={`
                          flex items-start gap-3 rounded-xl px-3 py-3
                          transition-all duration-200 cursor-pointer
                          ${isActive
                            ? "bg-gradient-to-r from-violet-600/20 to-cyan-600/10 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                            : "hover:bg-white/[0.03] border border-transparent"
                          }
                        `}
                      >
                        <div className={`
                          p-2 rounded-lg
                          ${isActive ? "bg-violet-500/20" : "bg-white/[0.03]"}
                        `}>
                          {ICONS[item.entityType]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white/90 truncate">
                            {highlight(item.title)}
                          </div>
                          {item.description && (
                            <div className="text-xs text-white/40 truncate mt-0.5">
                              {highlight(item.description)}
                            </div>
                          )}
                        </div>
                        {item.pinned && (
                          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
