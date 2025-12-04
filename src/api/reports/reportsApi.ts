import axios from "axios";

// Get base URL and ensure it doesn't end with /api (to avoid double /api)
const rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl.slice(0, -4) : rawBaseUrl;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
  },
});

export const reportsApi = {
  // Update report (save changes)
  updateReport: async (reportId: string, data: any) => {
    console.log("[reportsApi] updateReport called with reportId:", reportId);
    const response = await axios.patch(
      `${BASE_URL}/api/reports/${reportId}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  // Approve report (commits hierarchy and tasks)
  // NOTE: Backend mounts pm-approval routes at /api/ai, not /api/pm-approval
  approveReport: async (reportId: string, approvedBy?: string) => {
    console.log("[reportsApi] approveReport called with reportId:", reportId, "approvedBy:", approvedBy);
    const response = await axios.post(
      `${BASE_URL}/api/ai/report/${reportId}/approve`,
      { approvedBy },
      getAuthHeaders()
    );
    return response.data;
  },

  // Reject report
  rejectReport: async (reportId: string, reason?: string) => {
    console.log("[reportsApi] rejectReport called with reportId:", reportId);
    const response = await axios.post(
      `${BASE_URL}/api/reports/${reportId}/reject`,
      { reason },
      getAuthHeaders()
    );
    return response.data;
  },

  // Get suggestions by report
  // NOTE: Backend mounts pm-approval routes at /api/ai
  getSuggestionsByReport: async (reportId: string) => {
    console.log("[reportsApi] getSuggestionsByReport called with reportId:", reportId);
    const response = await axios.get(
      `${BASE_URL}/api/ai/report/${reportId}/suggestions`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Update assignment suggestions
  updateAssignments: async (reportId: string, assignmentReasons: any[]) => {
    console.log("[reportsApi] updateAssignments called with reportId:", reportId);
    const response = await axios.patch(
      `${BASE_URL}/api/reports/${reportId}/assignments`,
      { assignmentReasons },
      getAuthHeaders()
    );
    return response.data;
  },

  // Bulk approve suggestions
  // NOTE: Backend mounts pm-approval routes at /api/ai
  bulkApproveSuggestions: async (
    suggestionIds: string[],
    approvedBy?: string
  ) => {
    console.log("[reportsApi] bulkApproveSuggestions called with:", suggestionIds.length, "suggestions");
    const response = await axios.post(
      `${BASE_URL}/api/ai/suggestions/bulk-approve`,
      { suggestionIds, approvedBy },
      getAuthHeaders()
    );
    return response.data;
  },

  // Bulk update suggestions
  // NOTE: Backend mounts pm-approval routes at /api/ai
  bulkUpdateSuggestions: async (updates: any[]) => {
    console.log("[reportsApi] bulkUpdateSuggestions called");
    const response = await axios.patch(
      `${BASE_URL}/api/ai/suggestions/bulk-update`,
      { updates },
      getAuthHeaders()
    );
    return response.data;
  },

  // Approve single suggestion
  // NOTE: Backend mounts pm-approval routes at /api/ai
  approveSuggestion: async (suggestionId: string, approvedBy?: string) => {
    console.log("[reportsApi] approveSuggestion called with suggestionId:", suggestionId);
    const response = await axios.post(
      `${BASE_URL}/api/ai/suggestion/${suggestionId}/approve`,
      { approvedBy },
      getAuthHeaders()
    );
    return response.data;
  },

  // Decline single suggestion
  // NOTE: Backend mounts pm-approval routes at /api/ai
  declineSuggestion: async (
    suggestionId: string,
    declinedBy?: string,
    reason?: string
  ) => {
    console.log("[reportsApi] declineSuggestion called with suggestionId:", suggestionId);
    const response = await axios.post(
      `${BASE_URL}/api/ai/suggestion/${suggestionId}/decline`,
      { declinedBy, reason },
      getAuthHeaders()
    );
    return response.data;
  },

  // Delete report (keep tasks)
  deleteReport: async (reportId: string) => {
    console.log("[reportsApi] deleteReport called with reportId:", reportId);
    const response = await axios.delete(
      `${BASE_URL}/api/reports/${reportId}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Delete report and all associated tasks
  deleteReportWithTasks: async (reportId: string) => {
    console.log("[reportsApi] deleteReportWithTasks called with reportId:", reportId);
    const response = await axios.delete(
      `${BASE_URL}/api/reports/${reportId}/with-tasks`,
      getAuthHeaders()
    );
    return response.data;
  },
};
