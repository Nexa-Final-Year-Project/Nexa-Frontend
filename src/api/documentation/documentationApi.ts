import { baseApi } from "../baseApi";

export interface DocumentationType {
  _id: string;
  projectId: string;
  title: string;
  documentType: "Technical" | "Product" | "Client-Facing";
  audience: "Developers" | "Managers" | "Clients" | "Mixed";
  depthLevel: "Brief" | "Standard" | "Detailed";
  content: {
    projectOverview: string;
    problemStatement: string;
    systemArchitecture: string;
    techStack: string;
    sprintBreakdown: string;
    taskWorkflow: string;
    aiFeatures: string;
    apiOverview: string;
    databaseModels: string;
    authSecurity: string;
    deploymentNotes: string;
    futureRoadmap: string;
    appendix: string;
  };
  metadata: {
    projectName: string;
    projectDescription: string;
    owner: string;
    timeline: string;
    sprintCount: number;
    taskCount: number;
    teamSize: number;
  };
  generatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: "generating" | "completed" | "failed";
  version: number;
  aiGenerated: boolean;
  generationError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateDocumentationRequest {
  documentType?: "Technical" | "Product" | "Client-Facing";
  audience?: "Developers" | "Managers" | "Clients" | "Mixed";
  depthLevel?: "Brief" | "Standard" | "Detailed";
  customInputs?: Record<string, any>;
}

export interface DocumentationResponse {
  success: boolean;
  message?: string;
  data?: DocumentationType | DocumentationType[];
  error?: string;
}

export interface GenerationStatusResponse {
  success: boolean;
  data?: {
    status: "generating" | "completed" | "failed";
    error: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (!token) {
    console.warn("No auth token found in localStorage");
  }

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Helper to get API base URL
const getBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;
};

// Generate new documentation
export const generateDocumentation = async (
  projectId: string,
  request: GenerateDocumentationRequest
): Promise<DocumentationResponse> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/documentation/projects/${projectId}/generate`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Failed to generate documentation"
      );
    }
    return data;
  } catch (error: any) {
    console.error("Generate Documentation Error:", error);
    throw error;
  }
};

// Get all documentation for a project
export const getProjectDocumentation = async (
  projectId: string
): Promise<DocumentationResponse> => {
  try {
    const headers = getAuthHeaders();
    console.log(
      "Fetching documentation - Project:",
      projectId,
      "Has token:",
      !!headers.Authorization
    );

    const response = await fetch(
      `${getBaseUrl()}/documentation/projects/${projectId}`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();

    console.log("Documentation response:", response.status, data);

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Failed to load documentation"
      );
    }
    return data;
  } catch (error: any) {
    console.error("Documentation API Error:", error);
    throw error;
  }
};

// Get specific documentation by ID
export const getDocumentation = async (
  documentationId: string
): Promise<DocumentationResponse> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load documentation");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

// Update documentation
export const updateDocumentation = async (
  documentationId: string,
  updates: {
    content?: Partial<DocumentationType["content"]>;
    title?: string;
  }
): Promise<DocumentationResponse> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update documentation");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

// Delete documentation
export const deleteDocumentation = async (
  documentationId: string
): Promise<DocumentationResponse> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete documentation");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

// Check generation status
export const getGenerationStatus = async (
  documentationId: string
): Promise<GenerationStatusResponse> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}/status`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to check status");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

// Export documentation as PDF
export const exportToPDF = async (documentationId: string): Promise<Blob> => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}/export/pdf`,
      {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to export to PDF");
    }
    return await response.blob();
  } catch (error: any) {
    throw error;
  }
};

// Export documentation as Word
export const exportToWord = async (documentationId: string): Promise<Blob> => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(
      `${getBaseUrl()}/documentation/${documentationId}/export/word`,
      {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to export to Word");
    }
    return await response.blob();
  } catch (error: any) {
    throw error;
  }
};

// Helper function to download blob
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
