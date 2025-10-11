import { baseApi } from "../baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
      }),
    }),
    getProjectById: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: "/project",
        method: "POST",
        body: project,
      }),
    }),
    updateProject: builder.mutation({
      query: (project) => ({
        url: `/project/${project.id}`, 
        method: "PUT",
        body: project,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
    }),
    inviteMember: builder.mutation({
      query: ({ projectId, memberEmail, role }) => ({
        url: `/project/${projectId}/invite`,
        method: "POST",
        body: { email: memberEmail, role },
      }),
    }),
  acceptInvite: builder.mutation({
  query: (token: string) => ({  // ✅ token is string, not object
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
} = projectApi;