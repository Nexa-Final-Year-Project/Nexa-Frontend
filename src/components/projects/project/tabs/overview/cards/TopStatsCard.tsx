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
  color?: string; // color theme: "violet" | "emerald" | "rose" | "amber" | "cyan"
}

// Color configurations for different themes
const colorConfig = {
  violet: {
    gradient: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    glow: "rgba(139,92,246,0.2)",
    line: "#8B5CF6",
  },
  emerald: {
    gradient: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    glow: "rgba(16,185,129,0.2)",
    line: "#10B981",
  },
  rose: {
    gradient: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    glow: "rgba(244,63,94,0.2)",
    line: "#F43F5E",
  },
  amber: {
    gradient: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    glow: "rgba(245,158,11,0.2)",
    line: "#F59E0B",
  },
  cyan: {
    gradient: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    glow: "rgba(6,182,212,0.2)",
    line: "#06B6D4",
  },
};

export const TopStatCard = ({
  title,
  value,
  icon,
  trend,
  chartData,
  color = "violet",
}: TopStatCardProps) => {
  const isPositive = trend !== undefined && trend >= 0;
  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.violet;

  return (
    <Card className={`
      relative overflow-hidden
      bg-neutral-900/40 border border-white/[0.06]
      rounded-2xl p-5
      transition-all duration-300
      hover:border-white/[0.1]
      hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
      group cursor-pointer
    `}>
      {/* Background glow effect */}
      <div 
        className={`
          absolute inset-0 
          bg-gradient-to-br ${config.gradient}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          blur-xl
        `}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`
                p-2.5 rounded-xl
                bg-gradient-to-br ${config.gradient}
                border ${config.border}
                ${config.iconColor}
                shadow-[0_0_15px_${config.glow}]
                group-hover:scale-105
                transition-transform duration-300
              `}>
                {icon}
              </div>
            )}
            <span className="text-sm font-medium text-white/50">{title}</span>
          </div>
          {trend !== undefined && (
            <div
              className={`
                flex items-center gap-1
                text-xs font-semibold
                px-2.5 py-1 rounded-lg
                ${isPositive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }
              `}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="text-3xl font-bold text-white tracking-tight">
          {value}
        </div>

        {/* Sparkline */}
        {chartData && chartData.length > 0 && (
          <div className="h-12 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={config.line} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={config.line} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={`url(#gradient-${color})`}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Hover shine effect */}
      <div className="
        absolute inset-0 
        bg-gradient-to-r from-transparent via-white/[0.02] to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-700 ease-out
        pointer-events-none
      " />
    </Card>
  );
};
