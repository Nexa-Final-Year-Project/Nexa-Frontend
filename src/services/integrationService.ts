const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_ENDPOINT = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.replace("/api", "/api/integrations")
  : `${API_BASE_URL}/api/integrations`;

export type IntegrationPlatform = "jira" | "trello" | "clickup";

export interface Integration {
  _id?: string;
  platform: IntegrationPlatform;
  status: "connected" | "disconnected" | "error";
  connectedAt?: string;
  config?: {
    workspace?: string;
    teamName?: string;
    apiEndpoint?: string;
  };
  metadata?: {
    accountName?: string;
    accountEmail?: string;
    permissions?: string[];
    lastValidatedAt?: string;
    externalUserId?: string;
  };
  lastSyncAt?: string;
  errorMessage?: string;
}

export interface ExternalProject {
  id: string;
  name: string;
  description: string;
  meta?: Record<string, any>;
}

export interface ImportConfig {
  importTasks: boolean;
  importSprints: boolean;
  importMembers: boolean;
  importComments: boolean;
  createNewProject: boolean;
  targetProjectId?: string;
}

export interface ImportProgress {
  phase: string;
  current: number;
  total: number;
  message: string;
}

export interface ImportResults {
  projectCreated: boolean;
  projectName?: string;
  tasksCreated: number;
  sprintsCreated: number;
  membersCreated: number;
  phasesCreated: number;
  epicsCreated: number;
  storiesCreated: number;
  commentsCreated: number;
  errors: Array<{
    entity: string;
    externalId: string;
    title: string;
    error: string;
  }>;
}

export interface ImportJob {
  _id: string;
  platform: IntegrationPlatform;
  status: "pending" | "fetching" | "mapping" | "importing" | "completed" | "failed" | "cancelled";
  externalProjectName: string;
  progress: ImportProgress;
  results: ImportResults;
  projectId?: string;
  config: ImportConfig;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface JiraCredentials {
  email: string;
  apiToken: string;
  siteUrl: string;
}

export interface TrelloCredentials {
  apiKey: string;
  token: string;
}

export interface ClickUpCredentials {
  apiToken: string;
}

export type PlatformCredentials = JiraCredentials | TrelloCredentials | ClickUpCredentials;

export const PLATFORM_INFO: Record<IntegrationPlatform, {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  authFields: string[];
  helpUrl: string;
  helpText: string;
}> = {
  jira: {
    name: "Jira",
    description: "Import projects, sprints, and issues from Atlassian Jira Cloud",
    icon: "🔷",
    color: "blue",
    category: "Project Management",
    authFields: ["email", "apiToken", "siteUrl"],
    helpUrl: "https://id.atlassian.com/manage-profile/security/api-tokens",
    helpText: "Create an API token from your Atlassian account settings. Your site URL looks like: https://your-team.atlassian.net",
  },
  trello: {
    name: "Trello",
    description: "Import boards, lists, and cards from Trello",
    icon: "📋",
    color: "blue",
    category: "Project Management",
    authFields: ["apiKey", "token"],
    helpUrl: "https://trello.com/power-ups/admin",
    helpText: "Get your API key from the Trello Power-Up Admin page, then generate a token by visiting the authorization URL.",
  },
  clickup: {
    name: "ClickUp",
    description: "Import spaces, folders, lists, and tasks from ClickUp",
    icon: "⚡",
    color: "purple",
    category: "Project Management",
    authFields: ["apiToken"],
    helpUrl: "https://app.clickup.com/settings/apps",
    helpText: "Find your personal API token in ClickUp Settings > Apps.",
  },
};

class IntegrationService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getProjectIntegrations(projectId: string): Promise<Integration[]> {
    const response = await fetch(`${API_ENDPOINT}/project/${projectId}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch integrations");
    const data = await response.json();
    return data.data;
  }

  async connectPlatform(
    projectId: string,
    platform: IntegrationPlatform,
    credentials: PlatformCredentials
  ): Promise<Integration> {
    const response = await fetch(`${API_ENDPOINT}/connect`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ projectId, platform, credentials }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to connect");
    return data.data;
  }

  async disconnectPlatform(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/disconnect`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ projectId, platform }),
    });
    if (!response.ok) throw new Error("Failed to disconnect");
  }

  async browseExternalProjects(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<ExternalProject[]> {
    const response = await fetch(
      `${API_ENDPOINT}/browse/${projectId}/${platform}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to browse external projects");
    const data = await response.json();
    return data.data;
  }

  async startImport(params: {
    projectId: string;
    platform: IntegrationPlatform;
    externalProjectId: string;
    externalProjectName: string;
    config: ImportConfig;
  }): Promise<string> {
    const response = await fetch(`${API_ENDPOINT}/import`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to start import");
    return data.data.jobId;
  }

  async getImportStatus(jobId: string): Promise<ImportJob> {
    const response = await fetch(`${API_ENDPOINT}/import/${jobId}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch import status");
    const data = await response.json();
    return data.data;
  }

  async getImportHistory(): Promise<ImportJob[]> {
    const response = await fetch(`${API_ENDPOINT}/imports`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch import history");
    const data = await response.json();
    return data.data;
  }

  async cancelImport(jobId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/import/${jobId}/cancel`, {
      method: "POST",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to cancel import");
  }
}

export const integrationService = new IntegrationService();
