import { Modal } from "@/components/ui/modal/Modal";
import React, { useEffect, useState, useRef } from "react";
import { useProjects } from "@/hooks/projects/useProjects";
import { useSprints } from "@/hooks/sprints/useSprints";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/Spinner";
import toast from "@/lib/customToast";
import {
  Sparkles,
  FolderKanban,
  ChevronDown,
  Calendar,
  Clock,
  Target,
  Users,
} from "lucide-react";

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

  // Sprint configuration state
  const [sprintLengthDays, setSprintLengthDays] = useState<number>(14);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(6);
  const [maxTasksPerMember, setMaxTasksPerMember] = useState<number>(5);
  const [sprintGoals, setSprintGoals] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

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
      // Build sprint config from form inputs
      const sprintConfig = {
        sprintLengthDays,
        workHoursPerDay,
        sprintGoals: sprintGoals
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0),
        startDate,
      };

      await generateSprints(selectedProjectId, sprintConfig, maxTasksPerMember);
      toast.success("Sprint plan generated successfully");
      onClose();
    } catch {
      toast.error("Failed to generate sprint plan");
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects?.find((p) => p._id === selectedProjectId);

  return (
    <Modal
      title="Sprint Planner"
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      hideTrigger
    >
      <div className="py-4 min-h-[400px] flex flex-col max-h-[80vh] overflow-y-auto">
        {/* Header Description */}
        <div className="flex items-start gap-4 mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">
              AI-Powered Sprint Generation
            </h3>
            <p className="text-sm text-white/50">
              Our AI will analyze your project's tasks, team capacity, and
              historical velocity to create an optimized sprint plan with
              balanced workload distribution.
            </p>
          </div>
        </div>

        {/* Project Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Select Project
          </label>
          <div className="relative" ref={comboboxRef}>
            <div className="relative">
              <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search or select a project..."
                value={query || selectedProject?.name || ""}
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
                    setHighlightedIndex((hi) =>
                      Math.min(hi + 1, filtered.length - 1)
                    );
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
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>

            {dropdownOpen && (
              <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/[0.08] bg-neutral-900 p-1 shadow-xl">
                {(projects || [])
                  .filter((p) =>
                    p.name.toLowerCase().includes((query || "").toLowerCase())
                  )
                  .map((p, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    const isSelected = selectedProjectId === p._id;
                    return (
                      <li
                        key={p._id}
                        data-selected={isSelected}
                        onMouseDown={(ev) => {
                          ev.preventDefault();
                          setSelectedProjectId(p._id);
                          setQuery(p.name);
                          setDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          isHighlighted
                            ? "bg-emerald-500/20 text-white"
                            : "text-white/70 hover:bg-white/[0.04]"
                        } ${
                          isSelected
                            ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-4 h-4 text-emerald-400" />
                          {p.name}
                        </div>
                      </li>
                    );
                  })}
                {(projects || []).filter((p) =>
                  p.name.toLowerCase().includes((query || "").toLowerCase())
                ).length === 0 && (
                  <li className="px-3 py-2.5 text-sm text-white/40">
                    No projects found
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Selected Project Info */}
          {selectedProject && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-900/40 border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {selectedProject.name}
                  </p>
                  <p className="text-xs text-white/40">
                    {selectedProject.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sprint Configuration */}
        {selectedProjectId && (
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Sprint Configuration
            </h4>

            {/* Start Date & Sprint Length Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Sprint Length */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Sprint Length (days)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={sprintLengthDays}
                    onChange={(e) =>
                      setSprintLengthDays(Number(e.target.value))
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Work Hours & Max Tasks Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Work Hours Per Day */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Work Hours / Day
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Max Tasks Per Member */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Max Tasks / Member
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={maxTasksPerMember}
                    onChange={(e) =>
                      setMaxTasksPerMember(Number(e.target.value))
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sprint Goals */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Sprint Goals (comma separated)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <textarea
                  value={sprintGoals}
                  onChange={(e) => setSprintGoals(e.target.value)}
                  placeholder="e.g., Deliver login feature, Resolve P1 bugs, Complete API integration"
                  rows={2}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-6 mt-auto">
          <Button
            onClick={handleGenerate}
            disabled={!selectedProjectId || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Generating Sprint Plan...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Sprint Plan
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SprintPlannerModal;
