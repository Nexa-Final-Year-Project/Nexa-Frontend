import { Modal } from "@/components/ui/modal/Modal";
import React, { useEffect, useState, useRef } from "react";
import { useProjects } from "@/hooks/projects/useProjects";
import { useSprints } from "@/hooks/sprints/useSprints";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/Spinner";
import toast from "@/lib/customToast";

interface SprintPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SprintPlannerModal: React.FC<SprintPlannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, fetchAllProjects } = useProjects();
  const { generateSprints } = useSprints();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ensure projects are loaded when modal opens
  if (isOpen) fetchAllProjects().catch(() => {});
  }, [isOpen, fetchAllProjects]);

  // close combobox on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!comboboxRef.current) return;
      if (!comboboxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleGenerate = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      await generateSprints(selectedProjectId);
      toast.success("Sprint plan generated successfully");
      onClose();
    } catch {
      toast.error("Failed to generate sprint plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sprint Planner"
      open={isOpen}
      onOpenChange={onClose}
      size="md"
      hideTrigger
    >
      <div className="space-y-4 py-2">
        <label className="block text-sm font-medium">Project</label>
        <div>
          <div className="relative" ref={comboboxRef}>
            <input
              type="text"
              placeholder="Search or select a project..."
              value={query || projects?.find((p) => p._id === selectedProjectId)?.name || ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={(e) => {
                const filtered = (projects || []).filter((p) =>
                  p.name.toLowerCase().includes((query || "").toLowerCase())
                );
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setDropdownOpen(true);
                  setHighlightedIndex((hi) => Math.min(hi + 1, filtered.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((hi) => Math.max(hi - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const sel = filtered[highlightedIndex];
                  if (sel) {
                    setSelectedProjectId(sel._id);
                    setQuery(sel.name);
                    setDropdownOpen(false);
                  }
                } else if (e.key === "Escape") {
                  setDropdownOpen(false);
                }
              }}
              className="w-full rounded-lg border px-3 py-2 shadow-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">▾</div>

            {dropdownOpen && (
              <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg">
                {(projects || [])
                  .filter((p) =>
                    p.name.toLowerCase().includes((query || "").toLowerCase())
                  )
                  .map((p, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <li
                        key={p._id}
                        data-selected={selectedProjectId === p._id}
                        onMouseDown={(ev) => {
                          // use onMouseDown to avoid blur before click
                          ev.preventDefault();
                          setSelectedProjectId(p._id);
                          setQuery(p.name);
                          setDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`cursor-pointer rounded-md px-3 py-2 ${
                          isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/30"
                        }`}
                      >
                        {p.name}
                      </li>
                    );
                  })}
                {(projects || []).filter((p) => p.name.toLowerCase().includes((query || "").toLowerCase())).length === 0 && (
                  <li className="px-3 py-2 text-sm text-muted-foreground">No projects found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleGenerate}
            disabled={!selectedProjectId || loading}
            className="max-w-sm w-full cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Spinner size="sm" />
                Generating...
              </div>
            ) : (
              "Generate Sprint Plan"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SprintPlannerModal;
