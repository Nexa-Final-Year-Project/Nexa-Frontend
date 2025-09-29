"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const ICONS: Record<EntityType, JSX.Element> = {
  Task: <ListChecks className="w-4 h-4 text-blue-500" />,
  Project: <FolderKanban className="w-4 h-4 text-green-500" />,
  User: <User className="w-4 h-4 text-purple-500" />,
  ActivityLog: <History className="w-4 h-4 text-orange-500" />,
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
        <span key={i} className="bg-yellow-200 font-semibold rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Search input */}
      <div className="flex items-center bg-white border rounded-full shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder="Search tasks, projects, users..."
          className="border-0 focus-visible:ring-0 focus:outline-none text-sm ml-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={activeFilters.includes(f) ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => toggleFilter(f)}
          >
            {ICONS[f]} <span className="ml-1">{f}</span>
          </Button>
        ))}
      </div>

      {/* Recent searches */}
      {!query && recent.length > 0 && (
        <Card className="absolute top-20 w-full shadow-xl z-50 rounded-xl">
          <CardContent className="p-3">
            <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
              Recent Searches
            </div>
            {recent.map((r, i) => (
              <div
                key={i}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
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
        <Card className="absolute top-20 w-full shadow-xl z-50 rounded-xl">
          <CardContent className="p-2">
            {loading && (
              <div className="flex items-center gap-2 p-3 text-sm text-gray-500">
                <Loader2 className="animate-spin w-4 h-4" />
                Searching...
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="p-3 text-sm text-gray-400">
                No results found. Try different keywords.
              </div>
            )}

            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="mb-3">
                <div className="flex items-center gap-1 text-xs uppercase font-semibold text-gray-500 mb-2">
                  {ICONS[type as EntityType]} {type}
                </div>
                <div className="space-y-1">
                  {items.map((item, idx) => {
                    const globalIndex = results.findIndex(
                      (r) => r.id === item.id
                    );
                    const isActive = activeIndex === globalIndex;
                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        className={`flex items-start gap-2 rounded-lg px-3 py-2 transition ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div>{ICONS[item.entityType]}</div>
                        <div>
                          <div className="font-medium text-sm">
                            {highlight(item.title)}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500">
                              {highlight(item.description)}
                            </div>
                          )}
                        </div>
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
