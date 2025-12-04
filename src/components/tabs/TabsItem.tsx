"use client";

import React, { ReactNode, useRef, useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";

interface TabContent {
  id: string;
  content?: ReactNode;
  component?: ReactNode;
}

interface TabItemReusableProps {
  tabs: TabContent[];
}

export function TabItemReusable({ tabs }: TabItemReusableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>(0);

  // Preserve scroll position on tab change
  useEffect(() => {
    const handleTabChange = () => {
      // Store current scroll position before tab changes
      const currentScroll = window.scrollY;
      
      // Use requestAnimationFrame to restore scroll after DOM updates
      requestAnimationFrame(() => {
        window.scrollTo({ top: currentScroll, behavior: "instant" });
      });
    };

    // Listen for tab content changes
    const container = containerRef.current;
    if (container) {
      const observer = new MutationObserver(handleTabChange);
      observer.observe(container, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: minHeight || "auto" }}>
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
          forceMount={false}
          className="data-[state=inactive]:hidden"
        >
          <div className="mt-2 rounded-lg p-4 text-center text-white/60">
            {tab.component || tab.content}
          </div>
        </TabsContent>
      ))}
    </div>
  );
}
