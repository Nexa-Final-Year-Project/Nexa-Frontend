"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartComponentProps {
  data: any[];
  config: ChartConfig;
  xAxisKey: string; // usually the label field
  yAxisKey: string; // usually the value field
  barDataKey: string; // numeric values for the bars
  layout?: "horizontal" | "vertical";
}

export const BarChartComponent = ({
  data,
  config,
  xAxisKey,
  yAxisKey,
  barDataKey,
  layout = "vertical",
}: BarChartComponentProps) => {
  const isHorizontal = layout === "horizontal";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={config}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {isHorizontal ? (
            <>
              {/* Horizontal: labels on X, numbers on Y */}
              <XAxis
                dataKey={xAxisKey}
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  config[value as keyof typeof config]?.label || value
                }
              />
              <YAxis type="number" />
            </>
          ) : (
            <>
              {/* Vertical: labels on Y, numbers on X */}
              <XAxis type="number" />
              <YAxis
                dataKey={yAxisKey}
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  config[value as keyof typeof config]?.label || value
                }
              />
            </>
          )}

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar dataKey={barDataKey} radius={5}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || "var(--color-primary)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
