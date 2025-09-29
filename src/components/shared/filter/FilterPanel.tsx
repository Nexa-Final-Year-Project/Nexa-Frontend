"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

type FilterGroupType = "checkbox" | "date-range" | "search";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  key: string;
  label: string;
  type: FilterGroupType;
  options?: FilterOption[]; // for checkbox
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  groups: FilterGroup[];
  selected: Record<string, any>; // can hold arrays, strings, or date objects
  onApply: (selected: Record<string, any>) => void;
  onClearAll: () => void;
}

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

  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);

  const toggleCheckbox = (groupKey: string, optionId: string) => {
    setLocalSelected((prev) => {
      const current = prev[groupKey] || [];
      if (current.includes(optionId)) {
        return {
          ...prev,
          [groupKey]: current.filter((s: string) => s !== optionId),
        };
      }
      return { ...prev, [groupKey]: [...current, optionId] };
    });
  };

  const handleInputChange = (groupKey: string, value: any) => {
    setLocalSelected((prev) => ({ ...prev, [groupKey]: value }));
  };

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
    const cleared: Record<string, any> = {};
    groups.forEach((g) => {
      if (g.type === "checkbox") cleared[g.key] = [];
      if (g.type === "search") cleared[g.key] = "";
      if (g.type === "date-range") cleared[g.key] = { start: "", end: "" };
    });
    setLocalSelected(cleared);
    onClearAll();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="glass-card fixed left-1/2 top-1/2 z-50 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl focus:outline-none">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold">
              Filters
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close filter panel"
                className="rounded-md p-2 hover:bg-muted/30"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-auto">
            {groups.map((group) => (
              <section key={group.key}>
                <h3 className="mb-2 font-semibold">{group.label}</h3>

                {/* ✅ Checkbox filter */}
                {group.type === "checkbox" && (
                  <div className="flex flex-wrap gap-2">
                    {group.options?.map((option) => (
                      <label
                        key={option.id}
                        className={`cursor-pointer rounded-md border px-3 py-1 text-sm transition ${
                          localSelected[group.key]?.includes(option.id)
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-gray-300 text-muted-foreground hover:border-primary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            localSelected[group.key]?.includes(option.id) ||
                            false
                          }
                          onChange={() => toggleCheckbox(group.key, option.id)}
                          className="mr-2 cursor-pointer"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}

                {/* 🔎 Search filter */}
                {group.type === "search" && (
                  <input
                    type="text"
                    value={localSelected[group.key] || ""}
                    onChange={(e) =>
                      handleInputChange(group.key, e.target.value)
                    }
                    placeholder={`Search ${group.label.toLowerCase()}...`}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring focus:ring-primary/30"
                  />
                )}

                {/* 📅 Date range filter */}
                {group.type === "date-range" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={localSelected[group.key]?.start || ""}
                      onChange={(e) =>
                        handleDateChange(group.key, "start", e.target.value)
                      }
                      className="rounded-md border px-2 py-1 text-sm"
                    />
                    <input
                      type="date"
                      value={localSelected[group.key]?.end || ""}
                      onChange={(e) =>
                        handleDateChange(group.key, "end", e.target.value)
                      }
                      className="rounded-md border px-2 py-1 text-sm"
                    />
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleClearAll}
              className="rounded-md bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/80"
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
