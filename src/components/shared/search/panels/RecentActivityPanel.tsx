"use client";

import React from "react";
import DropdownSearchPanel from "../DropdownSearchPanel";
import { useActivityLogs } from "@/hooks/activityLogs/useActivityLogs";
import { useAuthStore } from "@/store/auth/authStore";
import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import { ActionType, EntityType, ActivityLog } from "@/types/activityLogs";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, ChevronDown, ChevronUp, Filter } from "lucide-react";

const RecentActivityPanel = ({ trigger }: { trigger: React.ReactNode }) => {
  const { activityLogs, fetchAllActivityLogs } = useActivityLogs();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<ActionType | "">(
    ""
  );
  const [selectedEntity, setSelectedEntity] = React.useState<EntityType | "">(
    ""
  );
  const [showAll, setShowAll] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    // Backend expects the query param name `user` (not `userId`), so send that.
    if (user?.id) {
      fetchAllActivityLogs({ user: user.id });
    }
  }, [user?.id, fetchAllActivityLogs]);

  // filtering logic
  const filteredLogs = React.useMemo(() => {
    return activityLogs.filter((log: ActivityLog) => {
      const matchesSearch =
        !searchTerm ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = !selectedAction || log.action === selectedAction;
      const matchesEntity =
        !selectedEntity || log.entityType === selectedEntity;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [activityLogs, searchTerm, selectedAction, selectedEntity]);

  // Show only 3 logs initially, or all if showAll is true
  const displayedLogs = showAll ? filteredLogs : filteredLogs.slice(0, 3);

  const hasActiveFilters = selectedAction || selectedEntity;

  return (
    <DropdownSearchPanel
      trigger={trigger}
      content={
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-80"
        >
          {/* Header */}
          <div className="p-3 border-b border-neutral-200 dark:border-white/[0.06] flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Recent Activity
            </span>
            <span className="ml-auto text-xs text-neutral-500 dark:text-white/40 bg-neutral-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
              {filteredLogs.length}
            </span>
          </div>

          {/* Search & Filters */}
          <div className="p-3 border-b border-neutral-200 dark:border-white/[0.06] space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activity…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 focus:outline-none focus:border-neutral-300 dark:focus:border-white/10 transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-xs transition-colors ${
                hasActiveFilters
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/60"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded text-[10px]">
                  Active
                </span>
              )}
              <ChevronDown
                className={`w-3 h-3 ml-auto transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filters Expanded */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 pt-2">
                    <select
                      value={selectedAction}
                      onChange={(e) =>
                        setSelectedAction(e.target.value as ActionType | "")
                      }
                      className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-700 dark:text-white/70 focus:outline-none focus:border-neutral-300 dark:focus:border-white/10"
                    >
                      <option value="" className="bg-white dark:bg-neutral-900">
                        All Actions
                      </option>
                      {Object.values(ActionType).map((action) => (
                        <option
                          key={String(action)}
                          value={String(action)}
                          className="bg-white dark:bg-neutral-900"
                        >
                          {String(action)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedEntity}
                      onChange={(e) =>
                        setSelectedEntity(e.target.value as EntityType | "")
                      }
                      className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-700 dark:text-white/70 focus:outline-none focus:border-neutral-300 dark:focus:border-white/10"
                    >
                      <option value="" className="bg-white dark:bg-neutral-900">
                        All Types
                      </option>
                      {Object.values(EntityType).map((entity) => (
                        <option
                          key={String(entity)}
                          value={String(entity)}
                          className="bg-white dark:bg-neutral-900"
                        >
                          {String(entity)}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logs */}
          <div className="p-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {displayedLogs.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-emerald-500/40 dark:text-emerald-400/40" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-white/50 mb-1">
                  No activity found
                </p>
                <p className="text-xs text-neutral-400 dark:text-white/30">
                  {searchTerm
                    ? "Try a different search"
                    : "Your activity will appear here"}
                </p>
              </div>
            ) : (
              <ActivityLogs logs={displayedLogs} />
            )}
          </div>

          {/* Show more/less button */}
          {filteredLogs.length > 3 && (
            <div className="p-2 border-t border-neutral-200 dark:border-white/[0.06]">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center justify-center gap-2 w-full p-2 rounded-lg text-xs text-neutral-500 dark:text-white/50 hover:text-neutral-700 dark:hover:text-white/70 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show all ({filteredLogs.length})
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      }
      contentClassName="p-0"
      position={{ side: "right", align: "start" }}
    />
  );
};

export default RecentActivityPanel;
