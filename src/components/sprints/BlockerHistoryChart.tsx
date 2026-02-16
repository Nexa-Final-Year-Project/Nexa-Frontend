"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { format, parseISO } from "date-fns";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";
import axios from "axios";

interface BlockerHistoryEntry {
  timestamp: string;
  healthScore: number | null;
  status: string | null;
  blockerCount: number;
  trigger: string;
  summary: string | null;
  topBlockers: Array<{
    type: string;
    severity: string;
    entityType: string;
    entityId: string;
    description: string;
  }>;
}

interface BlockerHistoryChartProps {
  sprintId: string;
  className?: string;
}

export default function BlockerHistoryChart({
  sprintId,
  className = "",
}: BlockerHistoryChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [history, setHistory] = useState<BlockerHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!sprintId) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sprint/${sprintId}/blockers/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setHistory(response.data.history || []);
        }
      } catch (err: any) {
        console.error("Failed to fetch blocker history:", err);
        setError("Failed to load blocker history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sprintId]);

  if (loading) {
    return (
      <div
        className={`rounded-xl p-6 flex items-center justify-center ${
          isDark
            ? "bg-white/[0.02] border border-white/[0.04]"
            : "bg-neutral-50 border border-neutral-200"
        } ${className}`}
      >
        <div className="flex items-center gap-2 text-neutral-500">
          <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error || history.length === 0) {
    return (
      <div
        className={`rounded-xl p-6 ${
          isDark
            ? "bg-white/[0.02] border border-white/[0.04]"
            : "bg-neutral-50 border border-neutral-200"
        } ${className}`}
      >
        <p className="text-sm text-neutral-500 text-center">
          {error || "No blocker history available yet"}
        </p>
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 100;
  const height = 60;
  const padding = { top: 5, right: 5, bottom: 5, left: 5 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Get valid data points (with health score)
  const validHistory = history.filter(
    (h) => typeof h.healthScore === "number"
  );

  if (validHistory.length === 0) {
    return (
      <div
        className={`rounded-xl p-6 ${
          isDark
            ? "bg-white/[0.02] border border-white/[0.04]"
            : "bg-neutral-50 border border-neutral-200"
        } ${className}`}
      >
        <p className="text-sm text-neutral-500 text-center">
          No health score data available
        </p>
      </div>
    );
  }

  const maxScore = 100;
  const minScore = 0;

  // Generate SVG path points
  const points = validHistory.map((entry, i) => {
    const x = padding.left + (i / Math.max(1, validHistory.length - 1)) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      ((entry.healthScore! - minScore) / (maxScore - minScore)) * chartHeight;
    return { x, y, entry };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Area path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  // Calculate trend
  const firstScore = validHistory[0].healthScore!;
  const lastScore = validHistory[validHistory.length - 1].healthScore!;
  const trend = lastScore - firstScore;
  const trendPercent = Math.abs(trend).toFixed(0);

  const getTrendConfig = () => {
    if (trend > 10)
      return {
        icon: TrendingUp,
        text: "Improving",
        color: isDark ? "text-emerald-400" : "text-emerald-600",
        bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
      };
    if (trend < -10)
      return {
        icon: TrendingDown,
        text: "Declining",
        color: isDark ? "text-rose-400" : "text-rose-600",
        bg: isDark ? "bg-rose-500/10" : "bg-rose-50",
      };
    return {
      icon: Shield,
      text: "Stable",
      color: isDark ? "text-blue-400" : "text-blue-600",
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
    };
  };

  const trendConfig = getTrendConfig();
  const TrendIcon = trendConfig.icon;

  return (
    <div
      className={`rounded-xl p-4 ${
        isDark
          ? "bg-white/[0.02] border border-white/[0.04]"
          : "bg-neutral-50 border border-neutral-200"
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neutral-500" />
          <span
            className={`text-sm font-medium ${
              isDark ? "text-white/80" : "text-neutral-700"
            }`}
          >
            Blocker Health Trend
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${trendConfig.bg} ${trendConfig.color}`}
        >
          <TrendIcon className="w-3 h-3" />
          {trendConfig.text} {trendPercent !== "0" && `${trendPercent}pts`}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mb-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
          <defs>
            <linearGradient
              id="blockerGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.2)"}
              />
              <stop
                offset="100%"
                stopColor={isDark ? "rgba(59,130,246,0)" : "rgba(37,99,235,0)"}
              />
            </linearGradient>
          </defs>

          {/* Threshold lines */}
          {/* 60% threshold line */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight * 0.4}
            x2={width - padding.right}
            y2={padding.top + chartHeight * 0.4}
            stroke={isDark ? "rgba(251,191,36,0.2)" : "rgba(245,158,11,0.2)"}
            strokeWidth="1"
            strokeDasharray="2,2"
          />

          {/* Area fill */}
          <path d={areaPath} fill="url(#blockerGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={isDark ? "rgba(59,130,246,0.9)" : "rgba(37,99,235,0.9)"}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {points.map((point, i) => {
            const score = point.entry.healthScore!;
            const color =
              score >= 80
                ? isDark
                  ? "#34d399"
                  : "#10b981"
                : score >= 60
                ? isDark
                  ? "#fbbf24"
                  : "#f59e0b"
                : isDark
                ? "#f87171"
                : "#ef4444";

            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="2.5"
                fill={color}
                stroke={isDark ? "#000" : "#fff"}
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Labels */}
        <div
          className={`flex justify-between text-xs mt-1 ${
            isDark ? "text-neutral-500" : "text-neutral-600"
          }`}
        >
          <span>
            {format(parseISO(validHistory[0].timestamp), "MMM d, HH:mm")}
          </span>
          <span>
            {format(
              parseISO(validHistory[validHistory.length - 1].timestamp),
              "MMM d, HH:mm"
            )}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`rounded-lg p-2 ${
            isDark ? "bg-white/[0.03]" : "bg-white border border-neutral-200"
          }`}
        >
          <div className="text-xs text-neutral-500 mb-0.5">Current</div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {lastScore}
          </div>
        </div>
        <div
          className={`rounded-lg p-2 ${
            isDark ? "bg-white/[0.03]" : "bg-white border border-neutral-200"
          }`}
        >
          <div className="text-xs text-neutral-500 mb-0.5">Average</div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {Math.round(
              validHistory.reduce((sum, h) => sum + h.healthScore!, 0) /
                validHistory.length
            )}
          </div>
        </div>
        <div
          className={`rounded-lg p-2 ${
            isDark ? "bg-white/[0.03]" : "bg-white border border-neutral-200"
          }`}
        >
          <div className="text-xs text-neutral-500 mb-0.5">Scans</div>
          <div
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {validHistory.length}
          </div>
        </div>
      </div>

      {/* Latest event */}
      {validHistory.length > 0 && (
        <div
          className={`mt-3 rounded-lg p-2.5 text-xs ${
            isDark
              ? "bg-black/20 border border-white/[0.04]"
              : "bg-white border border-neutral-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-500">Latest Scan</span>
            <span className="text-neutral-500">
              {format(parseISO(validHistory[validHistory.length - 1].timestamp), "MMM d, HH:mm")}
            </span>
          </div>
          <div className={`${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
            Trigger: <span className="capitalize">{validHistory[validHistory.length - 1].trigger.replace(/_/g, " ")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
