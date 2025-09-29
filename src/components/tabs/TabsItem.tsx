"use client";

import React, { ReactNode } from "react";
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
  return (
    <>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <div className="mt-2 rounded-lg  p-4 text-center">
            {tab.component || tab.content}
          </div>
        </TabsContent>
      ))}
    </>
  );
}
