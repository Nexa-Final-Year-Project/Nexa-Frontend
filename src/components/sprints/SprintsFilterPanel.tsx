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
  Current:
    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30",
  Upcoming:
    "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30",
  Completed:
    "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30",
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
      <div className="space-y-3">
        <h4 className="font-medium text-white/80 text-sm">Status</h4>
        <div className="flex gap-2 flex-wrap">
          {["Current", "Upcoming", "Completed"].map((status) => (
            <Badge
              key={status}
              className={cn(
                "cursor-pointer px-3 py-1.5 rounded-lg border transition-all duration-200",
                filters.status === status
                  ? statusColors[status]
                  : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white"
              )}
              onClick={() => setFilters({ ...filters, status })}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <h4 className="font-medium text-white/80 text-sm">Progress</h4>
        <Slider.Root
          value={filters.progress || [0, 100]}
          onValueChange={(val: number[]) =>
            setFilters({ ...filters, progress: val })
          }
          max={100}
          step={10}
          className="relative flex items-center select-none w-full h-5"
        >
          <Slider.Track className="bg-white/[0.06] relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-gradient-to-r from-violet-500 to-violet-400 rounded-full h-full shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </Slider.Root>
        <div className="flex justify-between text-xs text-white/40">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-white/80 text-sm">Date Range</h4>
        <div className="flex gap-2 mb-3">
          {["Today", "Past Week", "Past Month"].map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant="outline"
              className={cn(
                "rounded-lg border-white/[0.06] text-white/60 bg-white/[0.02]",
                "hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-white",
                "transition-all duration-200",
                filters.datePreset === preset &&
                  "bg-violet-500/10 border-violet-500/30 text-white"
              )}
              onClick={() => {
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
