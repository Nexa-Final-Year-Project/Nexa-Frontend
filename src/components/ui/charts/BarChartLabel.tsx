"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartLabelProps {
  data: { [key: string]: string | number }[];
  config: ChartConfig;
  xAxisKey: string;
  barDataKey: string;
  barColor?: string;
  showLabel?: boolean;
  labelPosition?: "top" | "center" | "bottom" | "inside" | "outside";
  borderRadius?: number;
}

export function BarChartLabel({
  data,
  config,
  xAxisKey,
  barDataKey,
  barColor = "var(--chart-1)",
  showLabel = true,
  labelPosition = "top",
  borderRadius = 8,
}: BarChartLabelProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={config}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey={barDataKey} fill={barColor} radius={borderRadius}>
            {showLabel && (
              <LabelList
                position={labelPosition}
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
