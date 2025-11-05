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
            "MMM d"
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
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search sprints..."
          className="border px-3 py-1 rounded"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className="flex items-center cursor-pointer"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
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
      <EditableTable<SprintType>
        columns={columns}
        data={sprints}
        onChange={(updated) => {
          console.log("Updated sprints:", updated);
        }}
      />
    </div>
  );
};
