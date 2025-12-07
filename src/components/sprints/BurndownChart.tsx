"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BurndownPoint {
  date: string;
  remainingHours: number;
}

interface BurndownChartProps {
  burndownForecast?: BurndownPoint[];
  totalEffort?: number;
  sprintLengthDays?: number;
}

const BurndownChart: React.FC<BurndownChartProps> = ({
  burndownForecast = [],
  totalEffort = 0,
  sprintLengthDays = 14,
}) => {
  const chartData = useMemo(() => {
    if (!burndownForecast.length) return null;

    const maxHours = Math.max(
      ...burndownForecast.map((p) => p.remainingHours),
      totalEffort
    );
    const chartHeight = 300;
    const chartWidth = Math.max(600, burndownForecast.length * 30);
    const pointSpacing = chartWidth / (burndownForecast.length - 1 || 1);
    const pixelPerHour = chartHeight / (maxHours || 1);

    // Calculate ideal burndown line (straight from start to end)
    const idealPoints = burndownForecast.map((_, index) => ({
      x: index * pointSpacing,
      y:
        chartHeight -
        maxHours * (index / (burndownForecast.length - 1 || 1)) * pixelPerHour,
    }));

    // Calculate actual burndown line
    const actualPoints = burndownForecast.map((point, index) => ({
      x: index * pointSpacing,
      y: chartHeight - point.remainingHours * pixelPerHour,
    }));

    return {
      maxHours,
      chartHeight,
      chartWidth,
      pointSpacing,
      pixelPerHour,
      idealPoints,
      actualPoints,
    };
  }, [burndownForecast, totalEffort]);

  if (!burndownForecast.length || !chartData) {
    return (
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
        <p className="text-sm">No burndown forecast available</p>
      </div>
    );
  }

  const finalRemainingHours =
    burndownForecast[burndownForecast.length - 1]?.remainingHours || 0;
  const burndownRate =
    burndownForecast.length > 1
      ? ((totalEffort - finalRemainingHours) / totalEffort) * 100
      : 0;
  const isOnTrack = finalRemainingHours <= 0;

  // Build SVG paths
  const idealPath = `M ${chartData.idealPoints
    .map((p) => `${p.x},${p.y}`)
    .join(" L ")}`;
  const actualPath = `M ${chartData.actualPoints
    .map((p) => `${p.x},${p.y}`)
    .join(" L ")}`;

  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">Total Effort</p>
          <p className="text-lg font-semibold text-white">{totalEffort}h</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">Remaining</p>
          <p className="text-lg font-semibold text-white">
            {finalRemainingHours.toFixed(1)}h
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">Burndown Rate</p>
          <div className="flex items-center gap-1">
            <p className="text-lg font-semibold text-white">
              {burndownRate.toFixed(0)}%
            </p>
            {isOnTrack ? (
              <TrendingDown className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 overflow-x-auto">
        <svg
          width={chartData.chartWidth + 60}
          height={chartData.chartHeight + 60}
          className="min-w-full"
          shapeRendering="geometricPrecision"
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = (chartData.chartHeight / 4) * i + 30;
            const hours = chartData.maxHours * (1 - i / 4);
            return (
              <g key={`grid-${i}`}>
                <line
                  x1="40"
                  y1={y}
                  x2={chartData.chartWidth + 40}
                  y2={y}
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeDasharray="4,4"
                />
                <text
                  x="35"
                  y={y + 4}
                  fontSize="12"
                  textAnchor="end"
                  fill="white"
                  opacity="0.6"
                >
                  {hours.toFixed(0)}h
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1="40"
            y1="30"
            x2="40"
            y2={chartData.chartHeight + 30}
            stroke="white"
            opacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1={chartData.chartHeight + 30}
            x2={chartData.chartWidth + 40}
            y2={chartData.chartHeight + 30}
            stroke="white"
            opacity="0.3"
            strokeWidth="2"
          />

          {/* Ideal burndown line (dashed) */}
          <path
            d={idealPath}
            fill="none"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="5,5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Actual burndown line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {chartData.actualPoints.map((point, index) => (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              opacity="0.8"
            >
              <title>
                {format(parseISO(burndownForecast[index].date), "MMM d")}:{" "}
                {burndownForecast[index].remainingHours.toFixed(1)}h
              </title>
            </circle>
          ))}

          {/* Date labels */}
          {burndownForecast.map((point, index) => {
            if (
              index % Math.ceil(burndownForecast.length / 6) === 0 ||
              index === burndownForecast.length - 1
            ) {
              return (
                <text
                  key={`label-${index}`}
                  x={chartData.pointSpacing * index + 40}
                  y={chartData.chartHeight + 50}
                  fontSize="11"
                  textAnchor="middle"
                  fill="white"
                  opacity="0.6"
                >
                  {format(parseISO(point.date), "MMM d")}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-white/70">Actual Burndown</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 border-t-2 border-dashed border-white/30"></div>
          <span className="text-white/70">Ideal Burndown</span>
        </div>
        <div className="flex items-center gap-2">
          {isOnTrack ? (
            <>
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-green-400">On Track</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-red-400">Behind Schedule</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BurndownChart;
