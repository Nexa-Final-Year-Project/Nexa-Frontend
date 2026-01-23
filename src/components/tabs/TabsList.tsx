"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge/badge";
import { useTheme } from "next-themes";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface TabsListReusableProps {
  tabs: Tab[];
}

export function TabsListReusable({ tabs }: TabsListReusableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TabsList
      className={`
      relative flex flex-wrap sm:flex-nowrap items-center gap-1 p-1.5
      ${
        isDark
          ? "bg-white/[0.02] border border-white/[0.06]"
          : "bg-neutral-100/80 border border-neutral-200"
      }
      rounded-2xl mb-6
      overflow-x-auto scrollbar-none max-w-full w-full min-w-0
      backdrop-blur-sm
    `}
    >
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className={`
            relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl
            text-xs sm:text-sm font-medium
            ${
              isDark
                ? "text-white/50 hover:text-white/70 hover:bg-white/[0.03]"
                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/60"
            }
            transition-all duration-300 cursor-pointer
            whitespace-nowrap
            flex-shrink-0
            ${
              isDark
                ? "data-[state=active]:text-white data-[state=active]:bg-white/[0.08] data-[state=active]:border data-[state=active]:border-white/[0.1]"
                : "data-[state=active]:text-neutral-900 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-neutral-200 data-[state=active]:shadow-sm"
            }
            group/tab
          `}
        >
          <tab.icon
            className={`
              relative z-10 w-4 h-4
              ${
                isDark
                  ? "text-white/40 group-data-[state=active]/tab:text-white"
                  : "text-neutral-400 group-data-[state=active]/tab:text-neutral-700"
              }
              transition-colors duration-300
            `}
            aria-hidden="true"
          />
          <span className="relative z-10">{tab.label}</span>
          {tab.badge && (
            <Badge
              className={`
                relative z-10 ml-1 min-w-5 px-1.5 py-0.5 rounded-lg text-[10px] font-semibold
                ${
                  typeof tab.badge === "number"
                    ? isDark
                      ? "bg-white/[0.08] text-white/60 border border-white/[0.06]"
                      : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                    : isDark
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }
              `}
              variant="secondary"
            >
              {tab.badge}
            </Badge>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
