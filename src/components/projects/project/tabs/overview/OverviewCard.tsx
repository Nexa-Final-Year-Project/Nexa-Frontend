import { Card } from "@/components/ui/card/Card";
import React from "react";

interface OverviewCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const OverviewCard = ({ title, description, children }: OverviewCardProps) => {
  return (
    <Card className="px-12 py-6 lg:h-[400px] h-full">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {children}
    </Card>
  );
};

export default OverviewCard;
