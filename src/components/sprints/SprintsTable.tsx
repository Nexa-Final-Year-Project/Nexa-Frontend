/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon, Filter, FilterIcon } from "lucide-react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { Sprint as SprintType } from "@/types/sprint";
import { EditableTable } from "../ui/table/EditableTable";
import { ReusableDropdownMenu } from "../ui/dropdown/ReusableDropdownMenu";
import { Play, Settings, Trash, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge/badge";
import { Progress } from "@/components/ui/progress";
import SprintsFilterPanel from "./SprintsFilterPanel";
import { useTheme } from "next-themes";

/* -------------------- Helpers -------------------- */
const getSprintStatus = (sprint: SprintType) => {
  const now = new Date();
  const startDate = parseISO(sprint.startDate);
  const endDate = parseISO(sprint.endDate);

  if (now < startDate) return "upcoming";
  if (now > endDate) return "completed";
  return "current";
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "current":
      return "default";
    case "completed":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "current":
      return "Current";
    case "completed":
      return "Completed";
    case "upcoming":
      return "Upcoming";
    default:
      return status;
  }
};

/* -------------------- Table Component -------------------- */
export const SprintsTable = ({
  sprints,
  calculateProgress,
  onStartSprint,
  onConfigure,
  onDelete,
}: {
  sprints: SprintType[];
  calculateProgress: (id: string) => number;
  onStartSprint: (sprint: SprintType) => void;
  onConfigure: (sprint: SprintType) => void;
  onDelete: (sprint: SprintType) => void;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filters, setFilters] = useState<any>({});
  /* -------------- Filtering -------------------- */
  // const filteredSprints = useMemo(() => {
  //   return sprints?.filter((sprint) => {
  //     const sprintStatus = getSprintStatus(sprint);

  //     // Status filter
  //     const inStatus =
  //       !filters.status || filters.status === "all"
  //         ? true
  //         : sprintStatus === filters.status;

  //     // Search filter
  //     const inSearch = filters.search
  //       ? sprint.name.toLowerCase().includes(filters.search.toLowerCase()) ||
  //         sprint.goals?.some((g) =>
  //           g.toLowerCase().includes(filters.search.toLowerCase())
  //         )
  //       : true;

  //     // Date filter
  //     const inDateRange =
  //       filters.start && filters.end
  //         ? isWithinInterval(parseISO(sprint.startDate), {
  //             start: filters.start,
  //             end: filters.end,
  //           })
  //         : true;

  //     return inStatus && inSearch && inDateRange;
  //   });
  // }, [sprints, filters]);

  /* -------------------- Dropdown Items -------------------- */
  const dropdownItems = (sprint: SprintType) => [
    {
      label: (
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4" /> Mark as Current
        </div>
      ),
      onClick: () => onStartSprint(sprint),
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" /> Configure
        </div>
      ),
      onClick: () => onConfigure(sprint),
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Trash className="h-4 w-4" /> Delete
        </div>
      ),
      onClick: () => onDelete(sprint),
    },
  ];

  /* -------------------- Columns -------------------- */
  const columns = [
    {
      header: "Name",
      accessor: "name",
      width: "15%",
      render: (row: SprintType) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.name || row.sprintName}</span>
        </div>
      ),
    },
    {
      header: "Goal",
      accessor: "goals",
      width: "25%",
      render: (row: SprintType) => (
        <div className="flex items-center">
          {row.goals?.length ? (
            <span className="text-sm line-clamp-1">{row.goals.join(", ")}</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              No goals specified
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Dates",
      accessor: "startDate",
      width: "15%",
      render: (row: SprintType) => (
        <div className="flex items-center">
          {`${format(parseISO(row.startDate), "MMM d")} - ${format(
            parseISO(row.endDate),
            "MMM d",
          )}`}
        </div>
      ),
    },
    {
      header: "Progress",
      accessor: "progress",
      width: "20%",
      render: (row: SprintType) => (
        <div className="flex items-center w-full">
          <Progress value={calculateProgress(row._id)} className="w-full" />
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "15%",
      render: (row: SprintType) => {
        const status = getSprintStatus(row);
        return (
          <div className="flex items-center">
            <Badge variant={getStatusBadgeVariant(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      width: "10%",
      render: (row: SprintType) => (
        <div className="flex items-center">
          <ReusableDropdownMenu
            trigger={
              <Button variant="ghost" className="p-1 cursor-pointer">
                <Settings className="h-4 w-4" />
              </Button>
            }
            items={dropdownItems(row)}
          />
        </div>
      ),
    },
  ];

  const [filterOpen, setFilterOpen] = useState(false);

  const applyFilters = () => {
    console.log("Applied filters:", filters);
    setFilterOpen(false);
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-4">
      {/* Filter Panel Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className={`relative flex-1 w-full max-w-md`}>
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isDark ? "text-white/30" : "text-neutral-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search sprints..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300
              ${
                isDark
                  ? "bg-neutral-900/40 border border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 hover:border-white/[0.1] hover:bg-neutral-900/50"
                  : "bg-neutral-100 border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-neutral-400"
              }`}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap
            ${
              isDark
                ? "bg-neutral-900/40 border-white/[0.06] text-white/70 hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-white"
                : "bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200 hover:border-neutral-400"
            }`}
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <SprintsFilterPanel
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />
      {/* Table */}
      <div
        className={`border rounded-2xl overflow-hidden backdrop-blur-sm
        ${
          isDark
            ? "bg-neutral-900/40 border-white/[0.06]"
            : "bg-white border-neutral-200"
        }`}
      >
        <div className="overflow-x-auto">
          <EditableTable<SprintType>
            columns={columns}
            data={sprints}
            onChange={(updated) => {
              console.log("Updated sprints:", updated);
            }}
          />
        </div>
      </div>
    </div>
  );
};
