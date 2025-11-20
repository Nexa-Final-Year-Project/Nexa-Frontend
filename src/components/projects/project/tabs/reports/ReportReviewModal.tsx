"use client";
import React, { useMemo, useState } from "react";
import { ProjectMember } from "@/types/project";
import toast from "@/lib/customToast";

export default function ReportReviewModal({
  open,
  onClose,
  report,
  members,
}: {
  open: boolean;
  onClose: () => void;
  report: any;
  members: ProjectMember[];
}) {
  const meta = report?.meta || {};

  const [status, setStatus] = useState(report?.status || "Pending Review");
  const [decisionLog, setDecisionLog] = useState<string[]>(meta?.decisionLog || []);
  const [assignmentReasons, setAssignmentReasons] = useState<any[]>(
    meta?.assignmentReasons || []
  );
  const [memberCapacity, setMemberCapacity] = useState<Record<string, any>>(
    meta?.memberCapacity || {}
  );
  const [internalSearch, setInternalSearch] = useState("");

  const filteredDecisionIndices = decisionLog
    .map((d, idx) => ({ d, idx }))
    .filter(({ d }) => !internalSearch || d.toLowerCase().includes(internalSearch.toLowerCase()))
    .map(({ idx }) => idx);

  const filteredAssignmentIndices = assignmentReasons
    .map((a, idx) => ({ a, idx }))
    .filter(({ a }) => {
      if (!internalSearch) return true;
      const hay = `${a.task_title || ''} ${a.member_name || ''} ${a.reason || ''}`.toLowerCase();
      return hay.includes(internalSearch.toLowerCase());
    })
    .map(({ idx }) => idx);

  const taskDistribution = useMemo(() => {
    const byRole: Record<string, number> = {};
    (assignmentReasons || []).forEach((a) => {
      const role = a.role || a.member_role || a.member_name || "Unspecified";
      byRole[role] = (byRole[role] || 0) + 1;
    });
    return byRole;
  }, [assignmentReasons]);

  const workload = meta?.workloadDifficulty || {};

  // simple inline svg line chart for overview sparkline
  const Sparkline = ({ values = [] as number[] }: { values?: number[] }) => {
    const w = 220;
    const h = 48;
    if (!values || !values.length) return <div className="text-sm text-slate-300">No data</div>;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={w} height={h} className="block">
        <polyline points={points} fill="none" stroke="#94a3b8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  };

  const saveDraft = () => {
    // persist draft locally so the reports list shows updated status
    try {
      const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
      const updated = (local || []).map((r: any) => (r.reportId === report.reportId ? { ...r, status: "Draft", meta: { ...r.meta, decisionLog, assignmentReasons, memberCapacity } } : r));
      localStorage.setItem("generationReports", JSON.stringify(updated));
      // notify other components in the same window that generationReports changed
      try { window.dispatchEvent(new Event('generationReports:changed')); } catch (e) {}
    } catch (e) {}
    toast.success("Draft saved");
    onClose();
  };

  const approveAndAssign = () => {
    // update local storage so UI reflects approval
    try {
      const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
      const updated = (local || []).map((r: any) => (r.reportId === report.reportId ? { ...r, status: "Approved", meta: { ...r.meta, decisionLog, assignmentReasons, memberCapacity } } : r));
      localStorage.setItem("generationReports", JSON.stringify(updated));
      try { window.dispatchEvent(new Event('generationReports:changed')); } catch (e) {}
    } catch (e) {}
    setStatus("Approved");
    toast.success("Report approved");
    onClose();
  };

  const rejectReport = () => {
    try {
      const local = JSON.parse(localStorage.getItem("generationReports") || "[]");
      const updated = (local || []).map((r: any) => (r.reportId === report.reportId ? { ...r, status: "Rejected", meta: { ...r.meta, decisionLog, assignmentReasons, memberCapacity } } : r));
      localStorage.setItem("generationReports", JSON.stringify(updated));
      try { window.dispatchEvent(new Event('generationReports:changed')); } catch (e) {}
    } catch (e) {}
    setStatus("Rejected");
    toast.error("Report rejected");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-[92vw] max-w-6xl max-h-[90vh] bg-slate-900/80 rounded-lg shadow-xl overflow-hidden flex flex-col ring-1 ring-black/30">
        {/* Header (fixed) - minimal, neutral */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-800 text-slate-50 z-10">
          <div>
            <div className="text-xs text-slate-300">Report ID</div>
            <div className="text-lg font-semibold tracking-tight text-slate-100">{report?.reportId}</div>
            <div className="text-sm text-slate-400 mt-1">Status: <span className="font-medium text-slate-100">{status}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <input
              placeholder="Search inside report..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              className="px-3 py-2 rounded bg-slate-800/60 text-slate-100 placeholder:text-slate-500 border border-slate-700"
            />
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(JSON.stringify(report));
                  toast.success('Copied report JSON');
                } catch (e) {
                  toast.error('Copy failed');
                }
              }}
              className="px-3 py-2 border border-slate-700 rounded text-slate-200 hover:bg-slate-800/50"
            >
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report-${report?.reportId || Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 border border-slate-700 rounded text-slate-200 hover:bg-slate-800/50"
            >
              Export
            </button>
            <button onClick={approveAndAssign} className="px-3 py-2 bg-neutral-700 text-neutral-100 rounded hover:bg-neutral-600">Approve</button>
            <button onClick={rejectReport} className="px-3 py-2 bg-neutral-700 text-neutral-100 rounded hover:bg-neutral-600">Reject</button>
            <button onClick={saveDraft} className="px-3 py-2 border border-neutral-700 rounded text-neutral-200">Save</button>
            <button onClick={onClose} aria-label="Close" className="px-3 py-2 text-slate-300 hover:text-white">✕</button>
          </div>
        </div>

        {/* Body: scrollable */}
        <div className="p-6 overflow-y-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2">
              <div className="p-4 rounded bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <h3 className="font-semibold text-slate-100">Backlog Summary</h3>
                <p className="text-sm text-slate-300 mt-2">{meta?.backlogSummary}</p>
                <div className="mt-3"><Sparkline values={[(meta?.sprintHealthScore || 0),  (meta?.sprintHealthScore || 0) + 1, (meta?.sprintHealthScore || 0) - 1, (meta?.sprintHealthScore || 0) + 2]} /></div>
              </div>
            </div>

            <div className="p-4 rounded bg-slate-800/50 border border-slate-700 text-slate-100">
              <h3 className="font-semibold">Sprint Health Score</h3>
              <div className="text-3xl font-bold mt-2">{meta?.sprintHealthScore ?? "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded bg-slate-800/50 border border-slate-700 text-slate-100">
              <h4 className="font-medium mb-3">Task Distribution by Role</h4>
              {Object.entries(taskDistribution).length === 0 && (
                <div className="text-sm text-slate-400">No data</div>
              )}
              {Object.entries(taskDistribution).map(([role, count]) => (
                <div key={role} className="flex items-center gap-3 mb-2">
                  <div className="w-40 text-sm text-slate-200">{role}</div>
                  <div className="flex-1 bg-slate-700 rounded h-3">
                    <div
                      className="bg-slate-400 h-3 rounded"
                      style={{ width: `${Math.min(100, (count / 1) * 5)}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-slate-300 text-right">{count}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded bg-slate-800/50 border border-slate-700 text-slate-100">
              <h4 className="font-medium mb-3">Workload Difficulty by Role</h4>
              {Object.entries(workload).map(([role, value]) => (
                <div key={role} className="flex items-center gap-3 mb-2">
                  <div className="w-40 text-sm text-slate-200">{role}</div>
                  <div className="flex-1 bg-slate-700 rounded h-3">
                    <div
                      className="bg-slate-500 h-3 rounded"
                      style={{ width: `${Math.min(100, (value as number) / 2)}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-slate-300 text-right">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editable tables */}
          <div className="space-y-6">
            <section>
              <h4 className="font-semibold mb-2 text-slate-100">Suggested Tasks (Decision Log)</h4>
              <div className="rounded max-h-60 overflow-y-auto bg-slate-900/30 border border-slate-700 p-2">
                <ul className="divide-y">
                  {decisionLog.filter((d) => !internalSearch || d.toLowerCase().includes(internalSearch.toLowerCase())).map((d, i) => (
                    <li key={i} className="p-3 flex items-start gap-3">
                      <textarea
                        value={d}
                        onChange={(e) => {
                          const clone = [...decisionLog];
                          clone[i] = e.target.value;
                          setDecisionLog(clone);
                        }}
                        className="flex-1 text-sm bg-slate-800/60 border border-slate-700 rounded p-2 text-slate-100"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setDecisionLog(decisionLog.filter((_, idx) => idx !== i));
                          }}
                          className="px-2 py-1 text-sm border rounded text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-3">
                  <button
                    onClick={() => setDecisionLog(["New suggested task", ...decisionLog])}
                    className="px-3 py-1 rounded border text-slate-200"
                  >
                    Add Suggestion
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-slate-100">Assignment Reasons</h4>
              <div className="rounded max-h-60 overflow-auto bg-slate-900/30 border border-slate-700">
                <table className="w-full text-sm text-slate-100">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="text-left px-3 py-2">Task Title</th>
                      <th className="text-left px-3 py-2">Assigned Member</th>
                      <th className="text-left px-3 py-2">Reason</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentReasons.filter((a) => {
                      if (!internalSearch) return true;
                      const hay = `${a.task_title || ''} ${a.member_name || ''} ${a.reason || ''}`.toLowerCase();
                      return hay.includes(internalSearch.toLowerCase());
                    }).map((a, i) => (
                      <tr key={a.task_id || i} className="border-t border-slate-700">
                        <td className="px-3 py-2">
                          <input
                            value={a.task_title}
                            onChange={(e) => {
                              const clone = [...assignmentReasons];
                              clone[i] = { ...clone[i], task_title: e.target.value };
                              setAssignmentReasons(clone);
                            }}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={a.member_name}
                            onChange={(e) => {
                              const clone = [...assignmentReasons];
                              clone[i] = { ...clone[i], member_name: e.target.value };
                              setAssignmentReasons(clone);
                            }}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={a.reason}
                            onChange={(e) => {
                              const clone = [...assignmentReasons];
                              clone[i] = { ...clone[i], reason: e.target.value };
                              setAssignmentReasons(clone);
                            }}
                            className="w-full bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => setAssignmentReasons(assignmentReasons.filter((_, idx) => idx !== i))}
                            className="text-sm text-rose-400"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3">
                  <button
                    onClick={() => setAssignmentReasons([{ task_id: `new-${Date.now()}`, task_title: "New task", member_name: "unassigned", reason: "" }, ...assignmentReasons])}
                    className="px-3 py-1 rounded border text-slate-200"
                  >
                    Add Row
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-slate-100">Member Capacity</h4>
              <div className="rounded max-h-60 overflow-auto bg-slate-900/30 border border-slate-700 p-2">
                <table className="w-full text-sm text-slate-100">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="text-left px-3 py-2">Member Name</th>
                      <th className="text-left px-3 py-2">Total Capacity</th>
                      <th className="text-left px-3 py-2">Assigned Tasks</th>
                      <th className="text-left px-3 py-2">Max Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(memberCapacity).map(([name, cap]) => (
                      <tr key={name} className="border-t border-slate-700">
                        <td className="px-3 py-2 text-slate-200">{name}</td>
                        <td className="px-3 py-2">
                          <input
                            className="w-24 bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                            value={cap.total}
                            onChange={(e) => setMemberCapacity({ ...memberCapacity, [name]: { ...cap, total: Number(e.target.value) } })}
                          />
                        </td>
                        <td className="px-3 py-2 text-slate-300">{cap.assignedTasks}</td>
                        <td className="px-3 py-2">
                          <input
                            className="w-24 bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                            value={cap.maxTasks}
                            onChange={(e) => setMemberCapacity({ ...memberCapacity, [name]: { ...cap, maxTasks: Number(e.target.value) } })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
