"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import OverviewCard from "../OverviewCard";
import { Card } from "@/components/ui/card/Card";

interface TopStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number; // positive or negative %
  chartData?: { value: number }[];
  color?: string; // Tailwind color classes e.g. "text-green-600"
}

export const TopStatCard = ({
  title,
  value,
  icon,
  trend,
  chartData,
  color = "text-blue-600",
}: TopStatCardProps) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card className=" p-4 flex flex-col gap-2 w-full border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className={`p-2 rounded-lg ${color}`}>{icon}</div>}
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="text-2xl font-bold">{value}</div>

      {/* Sparkline */}
      {chartData && chartData.length > 0 && (
        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
