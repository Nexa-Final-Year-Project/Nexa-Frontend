import { Card } from "@/components/ui/card/Card";
import React from "react";
import { useTheme } from "next-themes";

interface OverviewCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const OverviewCard = ({ title, description, children }: OverviewCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      className={`
      px-8 py-6 lg:h-[400px] h-full
      backdrop-blur-sm rounded-2xl border
      transition-all duration-300
      ${
        isDark
          ? "bg-neutral-900/40 border-white/[0.06] hover:border-white/[0.1]"
          : "bg-white border-neutral-200 hover:border-neutral-300 shadow-lg"
      }
    `}
    >
      <div className="mb-4">
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-xs mt-1 ${
            isDark ? "text-white/40" : "text-neutral-500"
          }`}
        >
          {description}
        </p>
      </div>
      {children}
    </Card>
  );
};

export default OverviewCard;
