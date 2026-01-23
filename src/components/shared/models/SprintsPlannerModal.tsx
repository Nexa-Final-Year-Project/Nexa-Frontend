import { Modal } from "@/components/ui/modal/Modal";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
  const surface = isDark
    ? "bg-neutral-900/60 border-white/[0.08]"
    : "bg-white border-neutral-200 shadow-sm";
  const subtle = isDark
    ? "bg-white/[0.03] border-white/[0.06]"
    : "bg-neutral-50 border-neutral-200";

  return (
    <Modal
      title="Sprint Planner"
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      hideTrigger
    >
      <div className="py-4 min-h-[400px] flex flex-col max-h-[80vh] overflow-y-auto space-y-6">
        {/* Header Description */}
        <div
          className={`flex items-start gap-4 p-4 rounded-2xl border shadow-sm ${
            isDark
              ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-cyan-500/10 border-emerald-500/20"
              : "bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl ${
              isDark ? "bg-emerald-500/10" : "bg-emerald-100"
            }`}
          >
            <Sparkles
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`text-sm font-medium mb-1 ${
                isDark ? "text-white" : "text-emerald-900"
              }`}
            >
              AI-Powered Sprint Generation
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-white/50" : "text-emerald-700/60"
              }`}
            >
              Our AI will analyze your project's tasks, team capacity, and
              historical velocity to create an optimized sprint plan with
              balanced workload distribution.
            </p>
          </div>
        </div>

        {/* Project Selection */}
        <div className={`${surface} rounded-2xl border p-4 sm:p-5`}>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Select Project
          </label>
          <div className="relative" ref={comboboxRef}>
            <div className="relative">
              <FolderKanban
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-white/40" : "text-neutral-400"
                }`}
              />
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
                className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all focus:outline-none focus:ring-1 ${
                  isDark
                    ? "border-white/[0.08] bg-neutral-900/70 text-white placeholder:text-white/30 focus:border-emerald-500/40 focus:ring-emerald-500/20"
                    : "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-white/40" : "text-neutral-400"
                }`}
              />
            </div>

            {dropdownOpen && (
              <ul
                className={`absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border p-1 shadow-xl scrollbar-thin ${
                  isDark
                    ? "border-white/[0.08] bg-neutral-950/90 backdrop-blur"
                    : "border-neutral-200 bg-white"
                }`}
              >
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
                            ? isDark
                              ? "bg-emerald-500/20 text-white"
                              : "bg-emerald-100 text-emerald-900"
                            : isDark
                            ? "text-white/70 hover:bg-white/[0.04]"
                            : "text-neutral-700 hover:bg-neutral-100"
                        } ${
                          isSelected
                            ? isDark
                              ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                              : "bg-emerald-50 border-l-2 border-emerald-500"
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
                  <li
                    className={`px-3 py-2.5 text-sm ${
                      isDark ? "text-white/40" : "text-neutral-500"
                    }`}
                  >
                    No projects found
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Selected Project Info */}
          {selectedProject && (
            <div className={`mt-4 p-4 rounded-xl border ${subtle}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {selectedProject.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/40" : "text-neutral-600"
                    }`}
                  >
                    {selectedProject.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sprint Configuration */}
        {selectedProjectId && (
          <div className={`${surface} rounded-2xl border p-4 sm:p-5 space-y-4`}>
            <h4
              className={`text-sm font-medium flex items-center gap-2 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              <Target
                className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
              Sprint Configuration
            </h4>

            {/* Start Date & Sprint Length Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  Start Date
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? "border-white/[0.08] bg-neutral-900/60 text-white focus:border-emerald-500/40 focus:ring-emerald-500/20"
                        : "border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>
              </div>

              {/* Sprint Length */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  Sprint Length (days)
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={sprintLengthDays}
                    onChange={(e) =>
                      setSprintLengthDays(Number(e.target.value))
                    }
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? "border-white/[0.08] bg-neutral-900/60 text-white focus:border-emerald-500/40 focus:ring-emerald-500/20"
                        : "border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Work Hours & Max Tasks Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Work Hours Per Day */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  Work Hours / Day
                </label>
                <div className="relative">
                  <Clock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? "border-white/[0.08] bg-neutral-900/60 text-white focus:border-emerald-500/40 focus:ring-emerald-500/20"
                        : "border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>
              </div>

              {/* Max Tasks Per Member */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  Max Tasks / Member
                </label>
                <div className="relative">
                  <Users
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={maxTasksPerMember}
                    onChange={(e) =>
                      setMaxTasksPerMember(Number(e.target.value))
                    }
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? "border-white/[0.08] bg-neutral-900/60 text-white focus:border-emerald-500/40 focus:ring-emerald-500/20"
                        : "border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Sprint Goals */}
            <div>
              <label
                className={`block text-xs font-medium mb-1.5 ${
                  isDark ? "text-white/60" : "text-neutral-600"
                }`}
              >
                Sprint Goals (comma separated)
              </label>
              <div className="relative">
                <Target
                  className={`absolute left-3 top-3 w-4 h-4 ${
                    isDark ? "text-white/40" : "text-neutral-400"
                  }`}
                />
                <textarea
                  value={sprintGoals}
                  onChange={(e) => setSprintGoals(e.target.value)}
                  placeholder="e.g., Deliver login feature, Resolve P1 bugs, Complete API integration"
                  rows={2}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 resize-none ${
                    isDark
                      ? "border-white/[0.08] bg-neutral-900/60 text-white placeholder:text-white/30 focus:border-emerald-500/40 focus:ring-emerald-500/20"
                      : "border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2 mt-auto">
          <Button
            onClick={handleGenerate}
            disabled={!selectedProjectId || loading}
            className={`w-full py-3 rounded-xl font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
              isDark
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            }`}
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
