"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge/badge";

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
  return (
    <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 overflow-x-auto">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-px after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none cursor-pointer !text-sm whitespace-nowrap"
        >
          <tab.icon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {tab.label}
          {tab.badge && (
            <Badge
              className={`ms-1.5 min-w-5 px-1 ${
                typeof tab.badge === "number"
                  ? "bg-primary/15"
                  : "bg-primary text-primary-foreground"
              }`}
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
