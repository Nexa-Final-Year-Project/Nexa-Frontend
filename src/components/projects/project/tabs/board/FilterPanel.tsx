/* eslint-disable react/prop-types */
//disable ts type errors for this file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Interface for the component props, remains unchanged.
interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  owners: { id: string; name: string }[];
  priorities: string[];
  statuses: string[];
  selectedOwners: string[];
  selectedPriorities: string[];
  selectedStatuses: string[];
  onApplyFilters: (
    owners: string[],
    priorities: string[],
    statuses: string[]
  ) => void;
  onClearAll: () => void;
}

/**
 * A reusable and accessible filter panel component for tasks.
 * It provides options to filter by owners, priorities, and statuses.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  owners,
  priorities,
  statuses,
  selectedOwners,
  selectedPriorities,
  selectedStatuses,
  onApplyFilters,
  onClearAll,
}) => {
  // Local state for user selections before applying, allowing cancellation.
  const [localOwners, setLocalOwners] = useState(selectedOwners);
  const [localPriorities, setLocalPriorities] = useState(selectedPriorities);
  const [localStatuses, setLocalStatuses] = useState(selectedStatuses);

  // Effect to sync local state when the modal is re-opened with new props.
  useEffect(() => {
    if (open) {
      setLocalOwners(selectedOwners);
      setLocalPriorities(selectedPriorities);
      setLocalStatuses(selectedStatuses);
    }
  }, [selectedOwners, selectedPriorities, selectedStatuses, open]);

  // Generic function to toggle an item in a selection array.
  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((s) => s !== id)
        : [...prevSelected, id]
    );
  };

  const handleApply = () => {
    onApplyFilters(localOwners, localPriorities, localStatuses);
    onClose();
  };

  const handleClearAll = () => {
    setLocalOwners([]);
    setLocalPriorities([]);
    setLocalStatuses([]);
    onClearAll();
  };

  // Helper component for rendering a section to avoid repetition.
  const FilterSection = ({ title, items, selectedItems, onToggle }) => (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const id = typeof item === "object" ? item.id : item;
          const name = typeof item === "object" ? item.name : item;
          const isChecked = selectedItems.includes(id);

          return (
            <label
              key={id}
              className={`flex cursor-pointer items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${
                isChecked
                  ? "border-transparent bg-primary/20 text-primary dark:bg-primary/30"
                  : "border-neutral-400/50 bg-black/5 text-neutral-700 hover:bg-black/10 dark:border-neutral-600/50 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(id)}
                className="sr-only" // Visually hide the checkbox but keep it accessible
              />
              {name}
            </label>
          );
        })}
      </div>
    </section>
  );

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl focus:outline-none dark:bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Filter Tasks
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close filter panel"
                className="rounded-full p-1.5 text-neutral-600 transition-colors hover:bg-black/10 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Filter Sections */}
          <div className="custom-scrollbar max-h-[60vh] space-y-6 overflow-auto pr-2">
            <FilterSection
              title="Owners"
              items={owners}
              selectedItems={localOwners}
              onToggle={(id) =>
                toggleSelection(id, localOwners, setLocalOwners)
              }
            />
            <FilterSection
              title="Priorities"
              items={priorities}
              selectedItems={localPriorities}
              onToggle={(id) =>
                toggleSelection(id, localPriorities, setLocalPriorities)
              }
            />
            <FilterSection
              title="Statuses"
              items={statuses}
              selectedItems={localStatuses}
              onToggle={(id) =>
                toggleSelection(id, localStatuses, setLocalStatuses)
              }
            />
          </div>

          {/* Footer with actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <button
              onClick={handleClearAll}
              className="rounded-lg bg-black/5 px-5 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
