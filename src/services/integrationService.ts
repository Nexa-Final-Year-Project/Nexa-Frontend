/**
 * Integration API Service
 *
 * ⚠️ MOCK INTEGRATION LAYER - FOR DEMONSTRATION ONLY
 *
 * This service handles communication with the mock integration backend.
 * All external API calls are simulated for academic demonstration.
 *
 * The architecture is designed to be easily upgraded to real OAuth
 * and API integrations in production.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_ENDPOINT = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.replace("/api", "/api/integrations")
  : `${API_BASE_URL}/api/integrations`;

// Debug logging
if (typeof window !== "undefined") {
  console.log("🔗 Integration Service Config:", {
    BASE_URL: API_BASE_URL,
    ENDPOINT: API_ENDPOINT,
  });
}

/**
 * Integration platform types
 */
export type IntegrationPlatform =
  | "jira"
  | "slack"
  | "asana"
  | "trello"
  | "github";

/**
 * Integration status
 */
export interface Integration {
  platform: IntegrationPlatform;
  status: "connected" | "disconnected";
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
  };
  _id?: string;
}

/**
 * Platform information for UI display
 */
export const PLATFORM_INFO = {
  jira: {
    name: "Jira",
    description: "Sync issues, sprints, and projects with Atlassian Jira",
    icon: "🔷",
    color: "blue",
    category: "Project Management",
  },
  slack: {
    name: "Slack",
    description: "Connect channels and receive notifications in Slack",
    icon: "💬",
    color: "purple",
    category: "Communication",
  },
  asana: {
    name: "Asana",
    description: "Sync tasks and projects with Asana workspace",
    icon: "⭕",
    color: "pink",
    category: "Project Management",
  },
  trello: {
    name: "Trello",
    description: "Import boards, lists, and cards from Trello",
    icon: "📋",
    color: "blue",
    category: "Project Management",
  },
  github: {
    name: "GitHub",
    description: "Link repositories, issues, and pull requests",
    icon: "🐙",
    color: "gray",
    category: "Development",
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

  /**
   * Get all integrations for a project
   */
  async getProjectIntegrations(projectId: string): Promise<Integration[]> {
    const url = `${API_ENDPOINT}/projects/${projectId}/integrations`;
    console.log("🔗 Fetching integrations from:", url);
    console.log("🔑 Auth token present:", !!localStorage.getItem("authToken"));

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Failed to fetch integrations: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Integrations loaded:", data.data?.length || 0);
      return data.data;
    } catch (error) {
      console.error("❌ Error fetching integrations:", error);
      throw error;
    }
  }

  /**
   * Connect to a platform
   *
   * ⚠️ This simulates OAuth flow - no real external API calls
   */
  async connectIntegration(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<Integration> {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/projects/${projectId}/integrations/${platform}/connect`,
        {
          method: "POST",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to connect to ${platform}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a platform
   */
  async disconnectIntegration(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/projects/${projectId}/integrations/${platform}/disconnect`,
        {
          method: "POST",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to disconnect from ${platform}`);
      }
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      throw error;
    }
  }

  /**
   * Get mock data from a connected platform
   *
   * ⚠️ Returns simulated data - not real API calls
   */
  async getIntegrationData(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/projects/${projectId}/integrations/${platform}/data`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch integration data"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching data from ${platform}:`, error);
      throw error;
    }
  }

  /**
   * Get specific integration details
   */
  async getIntegrationDetails(
    projectId: string,
    platform: IntegrationPlatform
  ): Promise<Integration> {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/projects/${projectId}/integrations/${platform}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Integration not found");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching integration details:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
