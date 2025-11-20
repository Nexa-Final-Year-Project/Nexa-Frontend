"use client";
import React, { useEffect, useState } from "react";
import ReportReviewModal from "./ReportReviewModal";
import { ProjectMember } from "@/types/project";

type GenerationReportMeta = any;

export default function TaskGenerationReports({
  projectId,
  members,
}: {
  projectId: string;
  members: ProjectMember[];
}) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [openReportId, setOpenReportId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    // Try fetching reports for project. If backend endpoint isn't available yet,
    // fall back to an empty list. The UI supports updating once real data exists.
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports?projectId=${projectId}`);
        if (res.ok) {
          const data = await res.json();
          let combined = data.reports || [];
          // merge with any locally-stored generated reports
          try {
            const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
            if (Array.isArray(local) && local.length) {
              // prepend local items that are not already present (by reportId)
              const existingIds = new Set((combined || []).map((r: any) => r.reportId));
              const toAdd = local.filter((r: any) => !existingIds.has(r.reportId));
              combined = [...toAdd, ...combined];
            }
          } catch (e) {}

          // compute a nice display title for each report if missing
          const decorated = (combined || []).map((r: any) => ({
            displayTitle:
              r.displayTitle ||
              makeDisplayTitle(r) ||
              `Generation Report • ${new Date(r.createdAt || Date.now()).toLocaleString()}`,
            ...r,
          }));
          setReports(decorated || []);
        } else {
          // no-op: keep empty list
          // still try to show locally saved reports
          try {
            const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
            const decorated = (local || []).map((r: any) => ({
              displayTitle:
                r.displayTitle ||
                makeDisplayTitle(r) ||
                `Generation Report • ${new Date(r.createdAt || Date.now()).toLocaleString()}`,
              ...r,
            }));
            setReports(Array.isArray(decorated) ? decorated : []);
          } catch (e) {
            setReports([]);
          }
        }
      } catch (e) {
        console.warn("Could not fetch reports (dev):", e);
        try {
          const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
          const decorated = (local || []).map((r: any) => ({
            displayTitle:
              r.displayTitle ||
              makeDisplayTitle(r) ||
              `Generation Report • ${new Date(r.createdAt || Date.now()).toLocaleString()}`,
            ...r,
          }));
          setReports(Array.isArray(decorated) ? decorated : []);
        } catch (e) {
          setReports([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // If URL contains open param, open that report once then remove the param
    try {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const open = url.searchParams.get("open");
          if (open) {
            setOpenReportId(open);
            // remove the param so it doesn't auto-open again
            const params = new URLSearchParams(window.location.search);
            params.delete("open");
            const base = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
            window.history.replaceState({}, "", base);
        }
      }
    } catch (e) {
      // noop
    }
  }, [projectId]);

  // Update reports when local generationReports changes in the same tab
  useEffect(() => {
    const handler = () => {
      try {
        const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
        const decorated = (local || []).map((r: any) => ({
          displayTitle: r.displayTitle || makeDisplayTitle(r) || `Generation Report • ${new Date(r.createdAt || Date.now()).toLocaleDateString}`,
          ...r,
        }));
        setReports((prev) => {
          // merge keeping any server items already present, but prefer local for same id
          const map = new Map<string, any>();
          (prev || []).forEach((p: any) => { if (p.reportId) map.set(p.reportId, p); });
          (decorated || []).forEach((d: any) => { if (d.reportId) map.set(d.reportId, d); });
          // preserve ordering: local first, then server-other
          const merged = [
            ...(decorated || []).filter((d: any) => d.reportId && map.has(d.reportId)),
            ...(prev || []).filter((p: any) => !((decorated || []).find((d: any) => d.reportId === p.reportId)))
          ];
          return merged;
        });
      } catch (e) {
        // noop
      }
    };

    window.addEventListener("generationReports:changed", handler);
    // initialize once from localStorage immediately
    try { handler(); } catch (e) { /* noop */ }
    return () => window.removeEventListener("generationReports:changed", handler);
  }, []);

  useEffect(() => {
    if (openReportId) {
      const r = reports.find((x) => x.reportId === openReportId);
      if (r) setSelected(r);
      else {
        // if not yet present, try from localStorage
        try {
          const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
          const lr = (local || []).find((x: any) => x.reportId === openReportId);
          if (lr) setSelected(lr);
        } catch (e) {}
      }
    }
  }, [openReportId, reports]);

  const openReport = (r: any) => {
    setSelected(r);
    // push query so coming from toast works
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "task-generation-reports");
      url.searchParams.set("open", r.reportId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  function makeDisplayTitle(r: any) {
    try {
      const date = new Date(r.createdAt || Date.now());
      const short = (r.meta?.backlogSummary || "").split(".")[0];
      const count = r.suggestionsCreated || r.meta?.suggestionsCreated || (r.suggestions || []).length || "?";
      return `Auto Report — ${short || projectId} — ${count} suggestions • ${date.toLocaleDateString()}`;
    } catch (e) {
      return null;
    }
  }

  function filteredReportsCount(list: any[], q: string, statusFilter: string) {
    return list.filter((r) => {
      if (statusFilter !== "all" && (r.status || "Pending Review") !== statusFilter) return false;
      const hay = `${r.displayTitle || ''} ${r.meta?.backlogSummary || ''}`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    }).length;
  }

  function getPagedReports(list: any[], q: string, statusFilter: string, sort: string, pageNum: number, size: number) {
    const filtered = list.filter((r) => {
      if (statusFilter !== "all" && (r.status || "Pending Review") !== statusFilter) return false;
      const hay = `${r.displayTitle || ''} ${r.meta?.backlogSummary || ''}`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    });

    const sorted = filtered.sort((a: any, b: any) => {
      if (sort === 'newest') return (new Date(b.createdAt || Date.now()).getTime()) - (new Date(a.createdAt || Date.now()).getTime());
      if (sort === 'oldest') return (new Date(a.createdAt || Date.now()).getTime()) - (new Date(b.createdAt || Date.now()).getTime());
      if (sort === 'title') return (a.displayTitle || '').localeCompare(b.displayTitle || '');
      if (sort === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

    const start = (pageNum - 1) * size;
    return sorted.slice(start, start + size);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Task Generation Reports</h2>
          <p className="text-sm text-slate-400 mt-1">Minimal list view — click an item to open review modal</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded bg-slate-800/60 text-slate-100 placeholder:text-slate-500 border border-slate-700 w-64"
          />
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-2 py-2 bg-slate-800/60 rounded text-slate-100 border border-slate-700">
            <option value="all">All statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-2 bg-slate-800/60 rounded text-slate-100 border border-slate-700">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-2 max-h-[76vh] overflow-y-auto">
          {loading && <div className="p-3 text-slate-400">Loading…</div>}
          {!loading && reports.length === 0 && <div className="p-3 text-slate-400">No reports yet.</div>}
          {!loading && (
            <ul className="divide-y">
              {getPagedReports(reports, search, filterStatus, sortBy, page, pageSize).map((r) => (
                <li key={r.reportId} onClick={() => openReport(r)} className={`flex items-center justify-between gap-4 px-4 py-3 cursor-pointer hover:bg-slate-800/40 transition`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-md bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-200 text-sm font-medium flex-shrink-0">RG</div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-100 truncate">{r.displayTitle || `Report ${r.reportId}`}</div>
                      <div className="text-xs text-slate-400 truncate mt-1">{r.meta?.backlogSummary}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`text-xs font-medium ${r.status === 'Approved' ? 'text-slate-200' : r.status === 'Rejected' ? 'text-slate-400' : 'text-slate-300'}`}>{r.status || 'Pending Review'}</div>
                    <div className="text-xxs text-slate-500">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {filteredReportsCount(reports, search, filterStatus) > pageSize && (
            <div className="mt-3 flex items-center justify-between text-slate-400 text-sm px-3">
              <div>{filteredReportsCount(reports, search, filterStatus)} reports</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} className="px-2 py-1 rounded bg-slate-800/50">Prev</button>
                <div>Page {page}</div>
                <button onClick={() => setPage(page + 1)} className="px-2 py-1 rounded bg-slate-800/50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render modal overlay separately so the list stays minimal */}
      {selected && (
        <ReportReviewModal open={!!selected} onClose={() => setSelected(null)} report={selected} members={members} />
      )}
    </div>
  );
}
