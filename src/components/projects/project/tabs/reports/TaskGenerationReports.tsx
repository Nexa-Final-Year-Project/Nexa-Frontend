"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ReportReviewModal from "./ReportReviewModal";
import AssignmentReviewModal from "../AssignmentReviewModal";
import DeleteReportModal from "@/components/shared/modals/DeleteReportModal";
import { useAuthStore } from "@/store/auth/authStore";
import { reportsApi } from "@/api/reports/reportsApi";
import toast from "@/lib/customToast";
import { ProjectMember } from "@/types/project";

const normalizeStatus = (status?: string | null) => {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "_");
  if (normalized === "pending" || normalized === "pendingreview") {
    return "pending_review";
  }
  if (["approved", "rejected", "pending_review"].includes(normalized)) {
    return normalized as "approved" | "rejected" | "pending_review";
  }
  return normalized || "pending_review";
};

function formatStatusDisplay(status?: string) {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Pending Review";
  }
}

// Helper to create display title - defined outside component so it's available in useCallback
function makeDisplayTitle(r: any, projectId?: string): string | null {
  try {
    const date = new Date(r.createdAt || r.generatedAt || Date.now());

    // Try to get task count from various sources
    const taskCount =
      r.summary?.totalTasks ||
      r.meta?.summary?.totalTasks ||
      r.suggestionsCreated ||
      r.meta?.suggestionsCreated ||
      (r.assignmentSuggestions || []).length ||
      null;

    // Try to get phase count
    const phaseCount =
      r.summary?.totalPhases || r.meta?.summary?.totalPhases || null;

    // Build a descriptive title
    if (taskCount && phaseCount) {
      return `Auto Report — Generated ${taskCount} tasks across ${phaseCount} phases — ${taskCount} suggestions • ${date.toLocaleDateString()}`;
    } else if (taskCount) {
      return `Auto Report — ${taskCount} suggestions • ${date.toLocaleDateString()}`;
    }

    // Fallback: use backlog summary snippet
    const short = (r.meta?.backlogSummary || "").split(".")[0];
    const count = r.suggestionsCreated || r.meta?.suggestionsCreated || "?";
    return `Auto Report — ${
      short || projectId || "Project"
    } — ${count} suggestions • ${date.toLocaleDateString()}`;
  } catch (e) {
    return null;
  }
}

export default function TaskGenerationReports({
  projectId,
  members,
}: {
  projectId: string;
  members: ProjectMember[];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [openReportId, setOpenReportId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { user } = useAuthStore();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any | null>(null);

  // Assignment review modal state (for direct editing from delete modal)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [reportForAssignment, setReportForAssignment] = useState<any | null>(
    null
  );

  // Prevent duplicate fetches
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  // Detect legacy local reports missing owner fields (from localStorage only)
  const [hasLegacy, setHasLegacy] = useState(false);

  // Centralized fetch function with deduplication
  const fetchReports = useCallback(
    async (force = false) => {
      // Prevent concurrent fetches and throttle to 1 per second
      const now = Date.now();
      if (
        !force &&
        (fetchingRef.current || now - lastFetchTimeRef.current < 1000)
      ) {
        return;
      }

      fetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);

      try {
        const rawBackend =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const backend = rawBackend.endsWith("/api")
          ? rawBackend.slice(0, -4)
          : rawBackend;
        const res = await fetch(
          `${backend}/api/reports?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authToken") || ""
              }`,
            },
            credentials: "include",
          }
        );

        let backendReports: any[] = [];
        if (res.ok) {
          const data = await res.json();
          backendReports = data.reports || [];
        }

        // Build a set of backend report IDs to avoid adding localStorage duplicates
        const backendIds = new Set(
          backendReports.flatMap((r: any) =>
            [r._id, r.reportId].filter(Boolean)
          )
        );

        // Get localStorage reports (these are partial - only have reportId, meta, success, etc.)
        // Only include them if they're NOT already in backend (i.e., new and not yet synced)
        let localOnlyReports: any[] = [];
        try {
          const local = JSON.parse(
            localStorage.getItem("generationReports") || "[]"
          );
          const { user } = useAuthStore.getState();

          // Filter out reports that are now in backend (clean up localStorage)
          const cleanedLocal = (Array.isArray(local) ? local : []).filter(
            (r: any) => {
              const id = r.reportId || r._id;
              // Keep only if NOT in backend (i.e., truly new/not-synced)
              return !id || !backendIds.has(id);
            }
          );

          // Update localStorage to remove synced entries
          if (cleanedLocal.length !== (local || []).length) {
            localStorage.setItem(
              "generationReports",
              JSON.stringify(cleanedLocal)
            );
          }

          localOnlyReports = cleanedLocal.filter((r: any) => {
            // Check ownership
            const ownerMatch =
              (!r.ownerId && !r.ownerEmail) || // legacy
              (user && (r.ownerId === user.id || r.ownerEmail === user.email));
            if (!ownerMatch) return false;

            // Check project
            if (r.projectId && r.projectId !== projectId) return false;

            return true;
          });
        } catch (e) {}

        // Combine: prefer backend reports (they have full data), then local-only
        // Local reports that exist in backend should NOT be added
        const combined = [...backendReports, ...localOnlyReports];

        // Deduplicate and decorate
        const seen = new Set<string>();
        const decorated = combined
          .map((r: any, idx: number) => {
            const id = r._id || r.reportId;
            return {
              ...r,
              _id: r._id || r.reportId,
              reportId: r.reportId || r._id,
              displayTitle:
                r.displayTitle ||
                makeDisplayTitle(r, projectId) ||
                `Generation Report • ${new Date(
                  r.createdAt || Date.now()
                ).toLocaleString()}`,
              uniqueKey: id || `report-${idx}`,
              // Normalize status
              status: normalizeStatus(r.status),
            };
          })
          .filter((r: any) => {
            const key = r._id || r.reportId;
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });

        setReports(decorated);

        // Update legacy detection
        try {
          const local = JSON.parse(
            localStorage.getItem("generationReports") || "[]"
          );
          setHasLegacy(
            Array.isArray(local) &&
              local.some((r: any) => !r.ownerId && !r.ownerEmail)
          );
        } catch (e) {
          setHasLegacy(false);
        }
      } catch (e) {
        console.warn("Could not fetch reports from backend:", e);
        // Fallback to localStorage only
        try {
          const local = JSON.parse(
            localStorage.getItem("generationReports") || "[]"
          );
          const { user } = useAuthStore.getState();
          const ownedLocal = (Array.isArray(local) ? local : [])
            .filter((r: any) => {
              if (!r.ownerId && !r.ownerEmail) return true;
              if (!user) return false;
              return r.ownerId === user.id || r.ownerEmail === user.email;
            })
            .filter((r: any) => !r.projectId || r.projectId === projectId);

          const decorated = ownedLocal.map((r: any, idx: number) => ({
            ...r,
            _id: r._id || r.reportId,
            reportId: r.reportId || r._id,
            displayTitle:
              r.displayTitle ||
              makeDisplayTitle(r, projectId) ||
              `Generation Report • ${new Date(
                r.createdAt || Date.now()
              ).toLocaleString()}`,
            uniqueKey: r._id || r.reportId || `report-${idx}`,
            status: normalizeStatus(r.status),
          }));
          setReports(decorated);
        } catch (e) {
          setReports([]);
        }
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    [projectId]
  );

  // Single useEffect for initial fetch
  useEffect(() => {
    fetchReports(true);
  }, [fetchReports]);

  // Listen for task generation events to refresh
  useEffect(() => {
    const onTasksGenerated = () => {
      // Delay fetch slightly to allow backend to save
      setTimeout(() => fetchReports(true), 500);
    };

    const onReportsChanged = () => {
      fetchReports(false);
    };

    window.addEventListener("tasks:generated", onTasksGenerated);
    window.addEventListener("generationReports:changed", onReportsChanged);

    return () => {
      window.removeEventListener("tasks:generated", onTasksGenerated);
      window.removeEventListener("generationReports:changed", onReportsChanged);
    };
  }, [fetchReports]);

  useEffect(() => {
    if (openReportId) {
      const r = reports.find((x) => x.reportId === openReportId);
      if (r) setSelected(r);
      else {
        // if not yet present, try from localStorage
        try {
          const local = JSON.parse(
            localStorage.getItem("generationReports") || "[]"
          );
          const lr = (local || []).find(
            (x: any) => x.reportId === openReportId
          );
          if (lr) setSelected(lr);
        } catch (e) {}
      }
    }
  }, [openReportId, reports]);

  const openReport = (r: any) => {
    setSelected(r);
    // Avoid URL param side effects; keep state-only.
  };

  // Creating reports is disabled; reports are generated after tasks.

  // Clean up local storage and state after deletion
  const cleanupAfterDelete = (r: any) => {
    setReports((prev) =>
      prev.filter((x: any) => x.reportId !== r.reportId && x._id !== r._id)
    );
    try {
      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      localStorage.setItem(
        "generationReports",
        JSON.stringify(
          local.filter((x: any) => x.reportId !== r.reportId && x._id !== r._id)
        )
      );
      window.dispatchEvent(new Event("generationReports:changed"));
    } catch (e) {}
  };

  // Delete report only (keep tasks)
  const handleDeleteKeepTasks = async () => {
    if (!reportToDelete) return;
    const r = reportToDelete;
    const id = r._id || r.reportId;

    if (id) {
      await reportsApi.deleteReport(id);
    }

    cleanupAfterDelete(r);
    toast.success("Report deleted. Tasks have been kept.");
  };

  // Delete report and all associated tasks
  const handleDeleteWithTasks = async () => {
    if (!reportToDelete) return;
    const r = reportToDelete;
    const id = r._id || r.reportId;

    if (id) {
      const result = await reportsApi.deleteReportWithTasks(id);
      toast.success(`Report and ${result.deletedTasks || 0} tasks deleted.`);
    } else {
      toast.success("Report deleted.");
    }

    cleanupAfterDelete(r);
    // Trigger task refresh
    window.dispatchEvent(new Event("tasks:refresh"));
  };

  // Open delete confirmation modal
  const openDeleteModal = (r: any) => {
    setReportToDelete(r);
    setDeleteModalOpen(true);
  };

  const [legacyBackup, setLegacyBackup] = useState<any[] | null>(null);
  function migrateLegacyLocal() {
    if (!user) {
      toast.error("Login required for migration");
      return;
    }
    try {
      const local = JSON.parse(
        localStorage.getItem("generationReports") || "[]"
      );
      setLegacyBackup(local);
      const migrated = (local || []).map((r: any) => {
        if (r.ownerId || r.ownerEmail) return r;
        return { ...r, ownerId: user.id, ownerEmail: user.email };
      });
      localStorage.setItem("generationReports", JSON.stringify(migrated));
      window.dispatchEvent(new Event("generationReports:changed"));
      setHasLegacy(false);
      toast.success("Legacy reports tagged with ownership");
    } catch (e) {
      toast.error("Migration failed");
    }
  }

  function undoLegacyMigration() {
    try {
      if (!legacyBackup) return;
      localStorage.setItem("generationReports", JSON.stringify(legacyBackup));
      window.dispatchEvent(new Event("generationReports:changed"));
      setHasLegacy(
        Array.isArray(legacyBackup) &&
          legacyBackup.some((r: any) => !r.ownerId && !r.ownerEmail)
      );
      setLegacyBackup(null);
      toast.success("Legacy migration undone");
    } catch (e) {
      toast.error("Failed to undo migration");
    }
  }

  function filteredReportsCount(list: any[], q: string, statusFilter: string) {
    return list.filter((r) => {
      // Use normalized status for filtering
      const normalized = normalizeStatus(r.status);
      if (statusFilter !== "all" && normalized !== statusFilter) return false;
      const hay = `${r.displayTitle || ""} ${
        r.meta?.backlogSummary || ""
      }`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    }).length;
  }

  function getPagedReports(
    list: any[],
    q: string,
    statusFilter: string,
    sort: string,
    pageNum: number,
    size: number
  ) {
    const filtered = list.filter((r) => {
      // Use normalized status for filtering
      const normalized = normalizeStatus(r.status);
      if (statusFilter !== "all" && normalized !== statusFilter) return false;
      const hay = `${r.displayTitle || ""} ${
        r.meta?.backlogSummary || ""
      }`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    });

    const sorted = filtered.sort((a: any, b: any) => {
      if (sort === "newest")
        return (
          new Date(b.createdAt || Date.now()).getTime() -
          new Date(a.createdAt || Date.now()).getTime()
        );
      if (sort === "oldest")
        return (
          new Date(a.createdAt || Date.now()).getTime() -
          new Date(b.createdAt || Date.now()).getTime()
        );
      if (sort === "title")
        return (a.displayTitle || "").localeCompare(b.displayTitle || "");
      if (sort === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

    const start = (pageNum - 1) * size;
    return sorted.slice(start, start + size);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-slate-100" : "text-neutral-900"
            }`}
          >
            Task Generation Reports
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-slate-400" : "text-neutral-600"
            }`}
          >
            Minimal list view — click an item to open review modal
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {hasLegacy && (
            <Button
              onClick={migrateLegacyLocal}
              className="bg-amber-500 text-black hover:bg-amber-600 w-full sm:w-auto"
              title="Tag local reports with your ownership"
            >
              Migrate Legacy
            </Button>
          )}
          {legacyBackup && (
            <Button
              variant="outline"
              onClick={undoLegacyMigration}
              className={`w-full sm:w-auto border ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Undo Migration
            </Button>
          )}
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`w-full sm:w-64 border ${
              isDark
                ? "bg-white/10 text-white placeholder:text-white/40 border-white/20"
                : "bg-white text-neutral-900 placeholder:text-neutral-500 border-neutral-300"
            }`}
          />
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className={`w-full sm:w-44 border ${
                isDark
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-neutral-100 text-neutral-900 border-neutral-300"
              }`}
            >
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent
              className={`${
                isDark
                  ? "bg-neutral-900 text-white border-white/20"
                  : "bg-white text-neutral-900 border-neutral-300"
              }`}
            >
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
            <SelectTrigger
              className={`w-full sm:w-40 border ${
                isDark
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-neutral-100 text-neutral-900 border-neutral-300"
              }`}
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent
              className={`${
                isDark
                  ? "bg-neutral-900 text-white border-white/20"
                  : "bg-white text-neutral-900 border-neutral-300"
              }`}
            >
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div
          className={`rounded-lg border p-2 max-h-[76vh] overflow-y-auto ${
            isDark
              ? "bg-neutral-900/80 border-neutral-800"
              : "bg-neutral-50 border-neutral-300"
          }`}
        >
          {loading && (
            <div
              className={`p-3 ${
                isDark ? "text-slate-400" : "text-neutral-600"
              }`}
            >
              Loading…
            </div>
          )}
          {!loading && reports.length === 0 && (
            <div
              className={`p-3 ${
                isDark ? "text-slate-400" : "text-neutral-600"
              }`}
            >
              No reports yet.
            </div>
          )}
          {!loading && (
            <ul
              className={`divide-y ${
                isDark ? "divide-neutral-700" : "divide-neutral-200"
              }`}
            >
              {getPagedReports(
                reports,
                search,
                filterStatus,
                sortBy,
                page,
                pageSize
              ).map((r, idx) => (
                <li
                  key={r.uniqueKey || r._id || r.reportId || `report-${idx}`}
                  onClick={() => openReport(r)}
                  className="cursor-pointer"
                >
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-neutral-900/70 border-neutral-700 hover:bg-neutral-800/70 hover:border-neutral-600 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                        : "bg-white border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-10 w-10 rounded-md border flex items-center justify-center text-sm font-medium flex-shrink-0 shadow-inner ${
                          isDark
                            ? "bg-neutral-800/80 border-neutral-700 text-neutral-200"
                            : "bg-violet-100 border-violet-200 text-violet-700"
                        }`}
                      >
                        RG
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            isDark ? "text-neutral-100" : "text-neutral-900"
                          }`}
                        >
                          {r.displayTitle || `Report ${r.reportId}`}
                        </div>
                        <div
                          className={`text-xs truncate mt-1 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {r.meta?.backlogSummary}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 text-sm sm:text-xs">
                      <div
                        className={`text-xs font-medium ${
                          isDark
                            ? normalizeStatus(r.status) === "approved"
                              ? "text-neutral-200"
                              : normalizeStatus(r.status) === "rejected"
                              ? "text-neutral-400"
                              : "text-neutral-300"
                            : normalizeStatus(r.status) === "approved"
                            ? "text-emerald-600"
                            : normalizeStatus(r.status) === "rejected"
                            ? "text-rose-600"
                            : "text-amber-600"
                        }`}
                      >
                        {formatStatusDisplay(r.status)}
                      </div>
                      <div
                        className={`text-[11px] ${
                          isDark ? "text-neutral-500" : "text-neutral-600"
                        }`}
                      >
                        {new Date(
                          r.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(r);
                        }}
                        className="px-3 py-1 text-xs rounded bg-red-600/90 text-white hover:bg-red-600 cursor-pointer"
                        title="Delete report"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {filteredReportsCount(reports, search, filterStatus) > pageSize && (
            <div
              className={`mt-3 flex items-center justify-between text-sm px-3 ${
                isDark ? "text-gray-400" : "text-neutral-600"
              }`}
            >
              <div>
                {filteredReportsCount(reports, search, filterStatus)} reports
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className={`px-2 py-1 rounded ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
                  }`}
                >
                  Prev
                </Button>
                <div>Page {page}</div>
                <Button
                  onClick={() => setPage(page + 1)}
                  className={`px-2 py-1 rounded ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
                  }`}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render modal overlay separately so the list stays minimal */}
      {selected && (
        <ReportReviewModal
          open={!!selected}
          onClose={() => setSelected(null)}
          report={selected}
          members={members}
        />
      )}

      {/* Delete confirmation modal */}
      <DeleteReportModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReportToDelete(null);
        }}
        report={reportToDelete}
        onDeleteWithTasks={handleDeleteWithTasks}
        onDeleteKeepTasks={handleDeleteKeepTasks}
        onEditAssignments={() => {
          // Close delete modal and open assignment review modal with the same report
          setDeleteModalOpen(false);
          setReportForAssignment(reportToDelete);
          setAssignmentModalOpen(true);
        }}
      />

      {/* Assignment Review Modal (for direct editing from delete modal) */}
      {assignmentModalOpen && reportForAssignment && (
        <AssignmentReviewModal
          open={assignmentModalOpen}
          onClose={() => {
            setAssignmentModalOpen(false);
            setReportForAssignment(null);
            // Refresh reports list after closing
            fetchReports(true);
          }}
          report={reportForAssignment}
        />
      )}
    </div>
  );
}
