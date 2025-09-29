import React from "react";
import { Calendar } from "../ui/calendar";
import * as Slider from "@radix-ui/react-slider";
import { FilterPanelDrawer } from "../shared/filter/FilterPanelDrawer";
import { Badge } from "../ui/badge/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SprintsFilterPanelProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  applyFilters: () => void;
}

const statusColors: Record<string, string> = {
  Current: "bg-blue-500 text-white hover:bg-blue-600",
  Upcoming: "bg-yellow-500 text-white hover:bg-yellow-600",
  Completed: "bg-green-500 text-white hover:bg-green-600",
};

const SprintsFilterPanel = ({
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  applyFilters,
}: SprintsFilterPanelProps) => {
  return (
    <FilterPanelDrawer
      open={filterOpen}
      onClose={() => setFilterOpen(false)}
      onApply={applyFilters}
      onClear={() => setFilters({})}
      title="Sprint Filters"
    >
      {/* Status */}
      <div className="space-y-2">
        <h4 className="font-medium">Status</h4>
        <div className="flex gap-2 flex-wrap">
          {["Current", "Upcoming", "Completed"].map((status) => (
            <Badge
              key={status}
              className={cn(
                "cursor-pointer px-3 py-1 rounded-full",
                filters.status === status
                  ? statusColors[status]
                  : "border hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              onClick={() => setFilters({ ...filters, status })}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <h4 className="font-medium">Progress</h4>
        <Slider.Root
          value={filters.progress || [0, 100]}
          onValueChange={(val: number[]) =>
            setFilters({ ...filters, progress: val })
          }
          max={100}
          step={10}
          className="relative flex items-center select-none w-full h-5"
        >
          <Slider.Track className="bg-gray-300 dark:bg-gray-700 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow" />
          <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow" />
        </Slider.Root>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <h4 className="font-medium">Date Range</h4>
        <div className="flex gap-2 mb-2">
          {["Today", "Past Week", "Past Month"].map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant="outline"
              onClick={() => {
                // Example: just mock
                setFilters({ ...filters, datePreset: preset });
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={filters.dateRange}
          onSelect={(range) => setFilters({ ...filters, dateRange: range })}
        />
      </div>
    </FilterPanelDrawer>
  );
};

export default SprintsFilterPanel;
