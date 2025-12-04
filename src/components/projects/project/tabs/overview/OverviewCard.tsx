import { Card } from "@/components/ui/card/Card";
import React from "react";

interface OverviewCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const OverviewCard = ({ title, description, children }: OverviewCardProps) => {
  return (
    <Card className="
      px-8 py-6 lg:h-[400px] h-full
      bg-neutral-900/40 border border-white/[0.06]
      backdrop-blur-sm rounded-2xl
      hover:border-white/[0.1] transition-all duration-300
    ">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-white/40 mt-1">{description}</p>
      </div>
      {children}
    </Card>
  );
};

export default OverviewCard;
