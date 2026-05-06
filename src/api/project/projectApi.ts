import { baseApi } from "../baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
      }),
      providesTags: ["Projects"],
      // Poll every 15 seconds for real-time updates
      pollingInterval: 15000,
    }),
    getProjectById: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Projects", id }],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: "/project",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation({
      query: (project) => ({
        url: `/project/${project.id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: (_result, _error, project) => [
        "Projects",
        { type: "Projects", id: project.id },
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    inviteMember: builder.mutation({
      query: ({ projectId, memberEmail, role, confirmed }) => ({
        url: `/project/${projectId}/invite`,
        method: "POST",
        body: { email: memberEmail, role, confirmed },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Projects", id: arg.projectId },
      ],
    }),
    acceptInvite: builder.mutation({
      query: (token: string) => ({
        // ✅ token is string, not object
        url: `/project/accept-invite`,
        method: "POST",
        body: { token }, // ✅ This creates { token: "eyJhbGci..." }
      }),
    }),
    // Add a GET endpoint for email links
    acceptInviteGet: builder.query({
      query: (token) => ({
        url: `/project/invite?token=${token}`, // For GET requests from email links
        method: "GET",
      }),
    }),
    getPendingInvites: builder.query({
      query: () => ({
        url: "/project/pending-invites",
        method: "GET",
      }),
      providesTags: ["PendingInvites"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useLazyGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useInviteMemberMutation,
  useAcceptInviteMutation,
  useAcceptInviteGetQuery,
  useLazyAcceptInviteGetQuery,
  useGetPendingInvitesQuery,
} = projectApi;
