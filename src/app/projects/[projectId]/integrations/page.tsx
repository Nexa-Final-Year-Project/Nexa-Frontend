"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  integrationService,
  Integration,
  IntegrationPlatform,
  ImportJob,
  PLATFORM_INFO,
} from "@/services/integrationService";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import ImportWizard from "@/components/integrations/ImportWizard";
import { useProjects } from "@/hooks/projects/useProjects";
import toast from "@/lib/customToast";

export default function IntegrationsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<IntegrationPlatform | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [importHistory, setImportHistory] = useState<ImportJob[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { fetchAllProjects } = useProjects();

  useEffect(() => {
    if (projectId) {
      loadIntegrations();
      loadHistory();
    }
  }, [projectId]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationService.getProjectIntegrations(projectId);
      setIntegrations(data);
    } catch (error: any) {
      toast.error(`Failed to load integrations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const jobs = await integrationService.getImportHistory();
      setImportHistory(jobs);
    } catch {
      // Non-critical
    }
  };

  const handleImport = (platform: IntegrationPlatform) => {
    setSelectedPlatform(platform);
    setShowWizard(true);
  };

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    try {
      await integrationService.disconnectPlatform(projectId, platform);
      toast.success(`${PLATFORM_INFO[platform].name} disconnected`);
      await loadIntegrations();
    } catch (error: any) {
      toast.error(`Failed to disconnect: ${error.message}`);
    }
  };

  const handleImportComplete = async (newProjectId?: string) => {
    loadIntegrations();
    loadHistory();
    await fetchAllProjects();
    if (newProjectId) {
      router.push(`/projects/${newProjectId}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "Completed" },
      failed: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Failed" },
      cancelled: { bg: "bg-neutral-500/15", text: "text-neutral-600 dark:text-neutral-400", label: "Cancelled" },
      importing: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "In Progress" },
      fetching: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "Fetching" },
      pending: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "Pending" },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Import & Integrations
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Connect your existing tools and import projects, tasks, sprints, and team data into NEXA. Supports Jira, Trello, and ClickUp.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/15">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Connect", desc: "Enter your API credentials" },
            { step: "2", title: "Select", desc: "Choose a project or board to import" },
            { step: "3", title: "Configure", desc: "Pick what data to bring over" },
            { step: "4", title: "Import", desc: "We handle the rest automatically" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">{s.title}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.platform}
            integration={integration}
            onImport={() => handleImport(integration.platform as IntegrationPlatform)}
            onDisconnect={() => handleDisconnect(integration.platform as IntegrationPlatform)}
          />
        ))}
      </div>

      {/* Import History */}
      {importHistory.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <span className={`transition-transform ${showHistory ? "rotate-90" : ""}`}>&#9654;</span>
            Import History ({importHistory.length})
          </button>

          {showHistory && (
            <div className="space-y-3">
              {importHistory.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/[0.06] shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {PLATFORM_INFO[job.platform]?.icon || "?"}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {job.externalProjectName || "Unknown"}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-white/40">
                        {job.startedAt
                          ? new Date(job.startedAt).toLocaleString()
                          : "N/A"}
                        {job.results && (
                          <span className="ml-2">
                            &bull; {job.results.tasksCreated} tasks, {job.results.sprintsCreated} sprints
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mapping Reference */}
      <div className="mt-10 p-5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06]">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
          Data Mapping Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MappingColumn
            platform="Jira"
            icon="🔷"
            mappings={[
              ["Project", "NEXA Project"],
              ["Sprint", "Sprint"],
              ["Epic", "Epic"],
              ["Story / Task / Bug", "Task"],
              ["Issue Status", "Task Status"],
              ["Issue Priority", "Task Priority"],
              ["Assignee", "Team Member"],
              ["Comments", "Comments"],
            ]}
          />
          <MappingColumn
            platform="Trello"
            icon="📋"
            mappings={[
              ["Board", "NEXA Project"],
              ["List", "Epic (grouping)"],
              ["Card", "Task"],
              ["Labels", "Priority / Type"],
              ["List Name", "Task Status"],
              ["Card Members", "Team Member"],
              ["Checklists", "Task Description"],
              ["Comments", "Comments"],
            ]}
          />
          <MappingColumn
            platform="ClickUp"
            icon="⚡"
            mappings={[
              ["Space", "NEXA Project"],
              ["Folder", "Phase"],
              ["List", "Epic"],
              ["Task", "Task"],
              ["Status", "Task Status"],
              ["Priority", "Task Priority"],
              ["Assignees", "Team Member"],
              ["Comments", "Comments"],
            ]}
          />
        </div>
      </div>

      {/* Import Wizard Modal */}
      {showWizard && selectedPlatform && (
        <ImportWizard
          projectId={projectId}
          platform={selectedPlatform}
          integration={
            integrations.find((i) => i.platform === selectedPlatform) || {
              platform: selectedPlatform,
              status: "disconnected",
            }
          }
          onClose={() => {
            setShowWizard(false);
            setSelectedPlatform(null);
          }}
          onComplete={handleImportComplete}
        />
      )}
    </div>
  );
}

function MappingColumn({
  platform,
  icon,
  mappings,
}: {
  platform: string;
  icon: string;
  mappings: string[][];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <span className="text-sm font-medium text-neutral-900 dark:text-white">{platform}</span>
      </div>
      <div className="space-y-1.5">
        {mappings.map(([from, to], idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 flex-1">{from}</span>
            <span className="text-neutral-300 dark:text-neutral-600">&rarr;</span>
            <span className="text-neutral-700 dark:text-neutral-300 flex-1">{to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
