/* eslint-disable react/prop-types */
//disable ts type errors for this file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Filter, Users, Flag, CheckCircle } from "lucide-react";
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
  const FilterSection = ({ title, icon: Icon, items, selectedItems, onToggle }) => (
    <section className="
      bg-white/[0.02] border border-white/[0.06]
      rounded-xl p-4
    ">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>
        {selectedItems.length > 0 && (
          <span className="
            ml-auto px-2 py-0.5 rounded-md
            bg-violet-500/20 text-violet-400
            text-xs font-medium
          ">
            {selectedItems.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const id = typeof item === "object" ? item.id : item;
          const name = typeof item === "object" ? item.name : item;
          const isChecked = selectedItems.includes(id);

          return (
            <label
              key={id}
              className={`
                flex cursor-pointer items-center justify-center
                rounded-lg border px-4 py-2
                text-sm font-medium
                transition-all duration-200
                ${isChecked
                  ? "border-violet-500/50 bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white/80 hover:border-white/[0.1]"
                }
              `}
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
        <Dialog.Content className="
          fixed left-1/2 top-1/2 z-50
          w-[90vw] max-w-lg
          -translate-x-1/2 -translate-y-1/2
          rounded-2xl
          bg-neutral-950/95 border border-white/[0.08]
          p-6
          shadow-[0_25px_80px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          focus:outline-none
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
        ">
          {/* Background glow */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-violet-500/10 rounded-full blur-[80px]" />
          </div>
          
          {/* Header */}
          <div className="relative flex items-center justify-between pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="
                w-10 h-10 rounded-xl
                bg-gradient-to-br from-violet-500/20 to-cyan-500/20
                border border-violet-500/30
                flex items-center justify-center
              ">
                <Filter className="w-5 h-5 text-violet-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-white">
                Filter Tasks
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close filter panel"
                className="
                  p-2 rounded-xl cursor-pointer
                  text-white/40 hover:text-white
                  bg-white/[0.02] hover:bg-white/[0.05]
                  border border-white/[0.06] hover:border-white/[0.1]
                  transition-all duration-200
                "
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Filter Sections */}
          <div className="relative custom-scrollbar max-h-[55vh] space-y-4 overflow-auto py-5">
            <FilterSection
              title="Owners"
              icon={Users}
              items={owners}
              selectedItems={localOwners}
              onToggle={(id) =>
                toggleSelection(id, localOwners, setLocalOwners)
              }
            />
            <FilterSection
              title="Priorities"
              icon={Flag}
              items={priorities}
              selectedItems={localPriorities}
              onToggle={(id) =>
                toggleSelection(id, localPriorities, setLocalPriorities)
              }
            />
            <FilterSection
              title="Statuses"
              icon={CheckCircle}
              items={statuses}
              selectedItems={localStatuses}
              onToggle={(id) =>
                toggleSelection(id, localStatuses, setLocalStatuses)
              }
            />
          </div>

          {/* Footer with actions */}
          <div className="relative mt-4 flex justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <button
              onClick={handleClearAll}
              className="
                px-5 py-2.5 rounded-xl cursor-pointer
                text-sm font-medium text-white/60
                bg-white/[0.03] border border-white/[0.06]
                hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400
                transition-all duration-200
              "
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="
                flex items-center gap-2
                px-6 py-2.5 rounded-xl cursor-pointer
                text-sm font-semibold text-white
                bg-gradient-to-r from-emerald-600 to-cyan-600
                border border-emerald-500/30
                shadow-[0_0_20px_rgba(16,185,129,0.3)]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <Sparkles className="w-4 h-4" />
              Apply Filters
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
