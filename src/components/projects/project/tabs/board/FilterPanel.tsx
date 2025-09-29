"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

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
  // Local state for user selections before applying
  const [localOwners, setLocalOwners] = useState(selectedOwners);
  const [localPriorities, setLocalPriorities] = useState(selectedPriorities);
  const [localStatuses, setLocalStatuses] = useState(selectedStatuses);

  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
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
              Filter Tasks
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
            {/* Owners */}
            <section>
              <h3 className="mb-2 font-semibold">Owners</h3>
              <div className="flex flex-wrap gap-2">
                {owners.map((owner) => (
                  <label
                    key={owner.id}
                    className={`cursor-pointer rounded-md border px-3 py-1 text-sm transition ${
                      localOwners.includes(owner.id)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-gray-300 text-muted-foreground hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={localOwners.includes(owner.id)}
                      onChange={() =>
                        toggleSelection(owner.id, localOwners, setLocalOwners)
                      }
                      className="mr-2 cursor-pointer"
                    />
                    {owner.name}
                  </label>
                ))}
              </div>
            </section>

            {/* Priorities */}
            <section>
              <h3 className="mb-2 font-semibold">Priorities</h3>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <label
                    key={priority}
                    className={`cursor-pointer rounded-md border px-3 py-1 text-sm transition ${
                      localPriorities.includes(priority)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-gray-300 text-muted-foreground hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={localPriorities.includes(priority)}
                      onChange={() =>
                        toggleSelection(
                          priority,
                          localPriorities,
                          setLocalPriorities
                        )
                      }
                      className="mr-2 cursor-pointer"
                    />
                    {priority}
                  </label>
                ))}
              </div>
            </section>

            {/* Statuses */}
            <section>
              <h3 className="mb-2 font-semibold">Statuses</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <label
                    key={status}
                    className={`cursor-pointer rounded-md border px-3 py-1 text-sm transition ${
                      localStatuses.includes(status)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-gray-300 text-muted-foreground hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={localStatuses.includes(status)}
                      onChange={() =>
                        toggleSelection(status, localStatuses, setLocalStatuses)
                      }
                      className="mr-2 cursor-pointer"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </section>

            {/* TODO: Add date range picker here if you want */}
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
