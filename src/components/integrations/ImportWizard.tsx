"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  integrationService,
  IntegrationPlatform,
  Integration,
  ExternalProject,
  ImportConfig,
  ImportJob,
  PLATFORM_INFO,
  PlatformCredentials,
} from "@/services/integrationService";
import toast from "@/lib/customToast";

interface ImportWizardProps {
  projectId: string;
  platform: IntegrationPlatform;
  integration: Integration;
  onClose: () => void;
  onComplete: (newProjectId?: string) => void;
}

type WizardStep = "connect" | "browse" | "configure" | "importing" | "results";

export default function ImportWizard({
  projectId,
  platform,
  integration,
  onClose,
  onComplete,
}: ImportWizardProps) {
  const info = PLATFORM_INFO[platform];
  const isConnected = integration.status === "connected";

  const [step, setStep] = useState<WizardStep>(isConnected ? "browse" : "connect");
  const [connecting, setConnecting] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [externalProjects, setExternalProjects] = useState<ExternalProject[]>([]);
  const [browsing, setBrowsing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ExternalProject | null>(null);
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    importTasks: true,
    importSprints: true,
    importMembers: true,
    importComments: false,
    createNewProject: true,
  });
  const [importJob, setImportJob] = useState<ImportJob | null>(null);
  const [pollingActive, setPollingActive] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isConnected && step === "browse") {
      browseProjects();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      let creds: PlatformCredentials;
      switch (platform) {
        case "jira":
          if (!credentials.email || !credentials.apiToken || !credentials.siteUrl) {
            toast.error("Please fill in all fields");
            setConnecting(false);
            return;
          }
          creds = {
            email: credentials.email,
            apiToken: credentials.apiToken,
            siteUrl: credentials.siteUrl.replace(/\/$/, ""),
          };
          break;
        case "trello":
          if (!credentials.apiKey || !credentials.token) {
            toast.error("Please fill in all fields");
            setConnecting(false);
            return;
          }
          creds = { apiKey: credentials.apiKey, token: credentials.token };
          break;
        case "clickup":
          if (!credentials.apiToken) {
            toast.error("Please enter your API token");
            setConnecting(false);
            return;
          }
          creds = { apiToken: credentials.apiToken };
          break;
        default:
          throw new Error("Unknown platform");
      }

      await integrationService.connectPlatform(projectId, platform, creds);
      toast.success(`Connected to ${info.name} successfully!`);
      setStep("browse");
      browseProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to connect");
    } finally {
      setConnecting(false);
    }
  };

  const browseProjects = async () => {
    setBrowsing(true);
    try {
      const projects = await integrationService.browseExternalProjects(projectId, platform);
      setExternalProjects(projects);
    } catch (err: any) {
      toast.error(err.message || "Failed to browse projects");
    } finally {
      setBrowsing(false);
    }
  };

  const handleStartImport = async () => {
    if (!selectedProject) return;

    try {
      const jobId = await integrationService.startImport({
        projectId,
        platform,
        externalProjectId: selectedProject.id,
        externalProjectName: selectedProject.name,
        config: importConfig,
      });

      setStep("importing");
      setPollingActive(true);

      pollRef.current = setInterval(async () => {
        try {
          const job = await integrationService.getImportStatus(jobId);
          setImportJob(job);

          if (["completed", "failed", "cancelled"].includes(job.status)) {
            if (pollRef.current) clearInterval(pollRef.current);
            setPollingActive(false);
            if (job.status === "completed") {
              setStep("results");
              toast.success("Import completed successfully!");
            } else if (job.status === "failed") {
              toast.error(`Import failed: ${job.errorMessage}`);
            }
          }
        } catch {
          // Keep polling
        }
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to start import");
    }
  };

  const handleCancel = async () => {
    if (importJob?._id && pollingActive) {
      try {
        await integrationService.cancelImport(importJob._id);
        toast.success("Import cancelled");
      } catch {}
    }
    if (pollRef.current) clearInterval(pollRef.current);
    onClose();
  };

  const renderStepIndicator = () => {
    const steps: { key: WizardStep; label: string }[] = [
      { key: "connect", label: "Connect" },
      { key: "browse", label: "Select" },
      { key: "configure", label: "Configure" },
      { key: "importing", label: "Import" },
      { key: "results", label: "Done" },
    ];
    const currentIdx = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center gap-1 mb-6">
        {steps.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                idx === currentIdx
                  ? "bg-blue-500 text-white"
                  : idx < currentIdx
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-white/60"
              }`}
            >
              {idx < currentIdx && <span>&#10003;</span>}
              <span>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  idx < currentIdx ? "bg-emerald-500/50" : "bg-neutral-200 dark:bg-white/[0.06]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderConnectStep = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
        <p className="text-sm text-blue-700 dark:text-blue-300">{info.helpText}</p>
        <a
          href={info.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline mt-2 inline-block"
        >
          Get your credentials here &rarr;
        </a>
      </div>

      {platform === "jira" && (
        <>
          <InputField label="Atlassian Email" placeholder="you@company.com" value={credentials.email || ""} onChange={(v) => setCredentials({ ...credentials, email: v })} />
          <InputField label="API Token" placeholder="Your Jira API token" type="password" value={credentials.apiToken || ""} onChange={(v) => setCredentials({ ...credentials, apiToken: v })} />
          <InputField label="Site URL" placeholder="https://your-team.atlassian.net" value={credentials.siteUrl || ""} onChange={(v) => setCredentials({ ...credentials, siteUrl: v })} />
        </>
      )}

      {platform === "trello" && (
        <>
          <InputField label="API Key" placeholder="Your Trello API key" value={credentials.apiKey || ""} onChange={(v) => setCredentials({ ...credentials, apiKey: v })} />
          <InputField label="Token" placeholder="Your Trello authorization token" type="password" value={credentials.token || ""} onChange={(v) => setCredentials({ ...credentials, token: v })} />
        </>
      )}

      {platform === "clickup" && (
        <InputField label="API Token" placeholder="Your ClickUp personal API token" type="password" value={credentials.apiToken || ""} onChange={(v) => setCredentials({ ...credentials, apiToken: v })} />
      )}

      <button
        onClick={handleConnect}
        disabled={connecting}
        className="w-full py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {connecting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Validating & Connecting...
          </span>
        ) : (
          `Connect to ${info.name}`
        )}
      </button>
    </div>
  );

  const renderBrowseStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Select which {platform === "trello" ? "board" : platform === "clickup" ? "space" : "project"} to import into NEXA.
      </p>

      {browsing ? (
        <div className="flex flex-col items-center py-10 gap-3">
          <Spinner size="lg" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Loading from {info.name}...</span>
        </div>
      ) : externalProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-neutral-500 dark:text-neutral-400">No projects found in your {info.name} account.</p>
          <button onClick={browseProjects} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {externalProjects.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setSelectedProject(ep);
                setStep("configure");
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/5 ${
                selectedProject?.id === ep.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                  : "border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]"
              }`}
            >
              <div className="font-medium text-neutral-900 dark:text-white">{ep.name}</div>
              {ep.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{ep.description}</p>
              )}
              {ep.meta && (
                <div className="flex gap-3 mt-2 text-xs text-neutral-400 dark:text-white/30">
                  {ep.meta.key && <span>Key: {ep.meta.key}</span>}
                  {ep.meta.memberCount && <span>{ep.meta.memberCount} members</span>}
                  {ep.meta.spaceName && <span>Space: {ep.meta.spaceName}</span>}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{info.icon}</span>
          <span className="font-medium text-neutral-900 dark:text-white">{selectedProject?.name}</span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{selectedProject?.description}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">What to import</h4>
        <ToggleOption label="Tasks / Issues" description="Import all tasks, bugs, and stories" checked={importConfig.importTasks} onChange={(v) => setImportConfig({ ...importConfig, importTasks: v })} />
        <ToggleOption label="Sprints" description={platform === "trello" ? "Trello doesn't have native sprints" : "Import sprint data and history"} checked={importConfig.importSprints} onChange={(v) => setImportConfig({ ...importConfig, importSprints: v })} disabled={platform === "trello"} />
        <ToggleOption label="Team Members" description="Import team member references" checked={importConfig.importMembers} onChange={(v) => setImportConfig({ ...importConfig, importMembers: v })} />
        <ToggleOption label="Comments" description="Import task comments (may take longer)" checked={importConfig.importComments} onChange={(v) => setImportConfig({ ...importConfig, importComments: v })} />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Import destination</h4>
        <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] cursor-pointer hover:border-blue-500/30">
          <input
            type="radio"
            checked={importConfig.createNewProject}
            onChange={() => setImportConfig({ ...importConfig, createNewProject: true })}
            className="text-blue-500"
          />
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-white">Create new project</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">A new project will be created with imported data</div>
          </div>
        </label>
      </div>

      <button
        onClick={handleStartImport}
        className="w-full py-3 rounded-xl font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
      >
        Start Import
      </button>
      <button
        onClick={() => setStep("browse")}
        className="w-full py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        &larr; Back to selection
      </button>
    </div>
  );

  const renderImportingStep = () => {
    const progress = importJob?.progress;
    const pct =
      progress && progress.total > 0
        ? Math.round((progress.current / progress.total) * 100)
        : 0;

    return (
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Importing from {info.name}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {progress?.message || "Starting import..."}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>{progress?.phase || "pending"}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(pct, 5)}%` }}
            />
          </div>
        </div>

        {importJob?.results && importJob.results.tasksCreated > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Tasks" value={importJob.results.tasksCreated} />
            <StatCard label="Sprints" value={importJob.results.sprintsCreated} />
            <StatCard label="Phases" value={importJob.results.phasesCreated} />
            <StatCard label="Epics" value={importJob.results.epicsCreated} />
          </div>
        )}

        <button
          onClick={handleCancel}
          className="w-full py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
        >
          Cancel Import
        </button>
      </div>
    );
  };

  const renderResultsStep = () => {
    const results = importJob?.results;
    const hasErrors = (results?.errors?.length || 0) > 0;

    return (
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-3xl text-emerald-600 dark:text-emerald-400">
            &#10003;
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Import Complete!</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {results?.projectName
              ? `"${results.projectName}" has been imported`
              : "Data imported successfully"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Tasks Created" value={results?.tasksCreated || 0} color="emerald" />
          <StatCard label="Sprints Created" value={results?.sprintsCreated || 0} color="blue" />
          <StatCard label="Phases" value={results?.phasesCreated || 0} color="purple" />
          <StatCard label="Epics" value={results?.epicsCreated || 0} color="amber" />
          {(results?.commentsCreated || 0) > 0 && (
            <StatCard label="Comments" value={results?.commentsCreated || 0} color="cyan" />
          )}
          {(results?.membersCreated || 0) > 0 && (
            <StatCard label="Members" value={results?.membersCreated || 0} color="pink" />
          )}
        </div>

        {hasErrors && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
              {results?.errors.length} item(s) had issues:
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {results?.errors.slice(0, 10).map((e, idx) => (
                <div key={idx} className="text-xs text-red-500/70 dark:text-red-300/70">
                  [{e.entity}] {e.title}: {e.error}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            onComplete(importJob?.projectId);
            onClose();
          }}
          className="w-full py-3 rounded-xl font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          View Imported Project
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Import from {info.name}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{info.category}</p>
            </div>
          </div>
          <button
            onClick={step === "importing" ? handleCancel : onClose}
            className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-white text-xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {renderStepIndicator()}
          {step === "connect" && renderConnectStep()}
          {step === "browse" && renderBrowseStep()}
          {step === "configure" && renderConfigureStep()}
          {step === "importing" && renderImportingStep()}
          {step === "results" && renderResultsStep()}
        </div>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
      />
    </div>
  );
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
        disabled
          ? "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 opacity-50 cursor-not-allowed"
          : checked
          ? "border-blue-500/30 bg-blue-50 dark:bg-blue-500/5"
          : "border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/[0.1]"
      }`}
    >
      <div>
        <div className="text-sm font-medium text-neutral-900 dark:text-white">{label}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-blue-500 focus:ring-blue-500 bg-white dark:bg-neutral-700"
      />
    </label>
  );
}

function StatCard({
  label,
  value,
  color = "blue",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    pink: "text-pink-600 dark:text-pink-400",
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06] text-center">
      <div className={`text-2xl font-bold ${colorMap[color] || "text-blue-600 dark:text-blue-400"}`}>
        {value}
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{label}</div>
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-8 h-8 border-3" : "w-4 h-4 border-2";
  return (
    <div
      className={`${sizeClasses} border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  );
}
