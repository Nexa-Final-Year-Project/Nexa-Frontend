"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Type definitions for more flexible filtering
type FilterGroupType = "checkbox" | "date-range" | "search";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  key: string;
  label: string;
  type: FilterGroupType;
  options?: FilterOption[]; // for checkbox type
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  groups: FilterGroup[];
  selected: Record<string, any>; // can hold arrays, strings, or date objects
  onApply: (selected: Record<string, any>) => void;
  onClearAll: () => void;
}

/**
 * A generic, reusable, and stylish filter panel with a glassmorphism effect.
 * Supports checkbox, search, and date-range filter types.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  groups,
  selected,
  onApply,
  onClearAll,
}) => {
  const [localSelected, setLocalSelected] =
    useState<Record<string, any>>(selected);

  // Sync state if the panel is reopened with different external filters
  useEffect(() => {
    if (open) {
      setLocalSelected(selected);
    }
  }, [selected, open]);

  // Toggles a checkbox option in a filter group
  const toggleCheckbox = (groupKey: string, optionId: string) => {
    setLocalSelected((prev) => {
      const currentSelection = prev[groupKey] || [];
      const newSelection = currentSelection.includes(optionId)
        ? currentSelection.filter((s: string) => s !== optionId)
        : [...currentSelection, optionId];
      return { ...prev, [groupKey]: newSelection };
    });
  };

  // Handles value change for text-based inputs like search
  const handleInputChange = (groupKey: string, value: any) => {
    setLocalSelected((prev) => ({ ...prev, [groupKey]: value }));
  };

  // Handles changes for date-range inputs
  const handleDateChange = (
    groupKey: string,
    field: "start" | "end",
    value: string
  ) => {
    setLocalSelected((prev) => ({
      ...prev,
      [groupKey]: { ...prev[groupKey], [field]: value },
    }));
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleClearAll = () => {
    const clearedState: Record<string, any> = {};
    groups.forEach((g) => {
      if (g.type === "checkbox") clearedState[g.key] = [];
      if (g.type === "search") clearedState[g.key] = "";
      if (g.type === "date-range") clearedState[g.key] = { start: "", end: "" };
    });
    setLocalSelected(clearedState);
    onClearAll(); // Propagate the clear event to the parent
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl focus:outline-none dark:bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Filters
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close filter panel"
                className="cursor-pointer rounded-full p-1.5 text-neutral-600 transition-colors hover:bg-black/10 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable Filter Area */}
          <div className="custom-scrollbar max-h-[60vh] space-y-6 overflow-auto pr-2">
            {groups.map((group) => (
              <section key={group.key}>
                <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {group.label}
                </h3>

                {/* Checkbox Group */}
                {group.type === "checkbox" && (
                  <div className="flex flex-wrap gap-2">
                    {group.options?.map((option) => {
                      const isChecked =
                        localSelected[group.key]?.includes(option.id) || false;
                      return (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${
                            isChecked
                              ? "border-transparent bg-primary/20 text-primary dark:bg-primary/30"
                              : "border-neutral-400/50 bg-black/5 text-neutral-700 hover:bg-black/10 dark:border-neutral-600/50 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              toggleCheckbox(group.key, option.id)
                            }
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Search Input */}
                {group.type === "search" && (
                  <input
                    type="text"
                    value={localSelected[group.key] || ""}
                    onChange={(e) =>
                      handleInputChange(group.key, e.target.value)
                    }
                    placeholder={`Search ${group.label.toLowerCase()}...`}
                    className="w-full rounded-lg border border-neutral-400/50 bg-black/5 px-3 py-2 text-sm text-neutral-800 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-primary/50 dark:border-neutral-600/50 dark:bg-white/5 dark:text-neutral-100 dark:placeholder-neutral-400"
                  />
                )}

                {/* Date Range Inputs */}
                {group.type === "date-range" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={localSelected[group.key]?.start || ""}
                      onChange={(e) =>
                        handleDateChange(group.key, "start", e.target.value)
                      }
                      className="w-full cursor-text rounded-lg border border-neutral-400/50 bg-black/5 px-3 py-2 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-primary/50 dark:border-neutral-600/50 dark:bg-white/5 dark:text-neutral-100"
                    />
                    <span className="text-neutral-500 dark:text-neutral-400">
                      -
                    </span>
                    <input
                      type="date"
                      value={localSelected[group.key]?.end || ""}
                      onChange={(e) =>
                        handleDateChange(group.key, "end", e.target.value)
                      }
                      className="w-full cursor-text rounded-lg border border-neutral-400/50 bg-black/5 px-3 py-2 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-primary/50 dark:border-neutral-600/50 dark:bg-white/5 dark:text-neutral-100"
                    />
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Footer with Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <button
              onClick={handleClearAll}
              className="cursor-pointer rounded-lg bg-black/5 px-5 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="cursor-pointer rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
