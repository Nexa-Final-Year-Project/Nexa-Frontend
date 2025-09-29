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
        url: `/projects/${project.id}`,
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
      query: ({ projectId, memberEmail }) => ({
        url: `/project/${projectId}/invite`,
        method: "POST",
        body: { email: memberEmail },
      }),
    }),
    acceptInvite: builder.mutation({
      query: ({ token }) => ({
        url: `/project/123/accept-invite`,
        method: "POST",
        body: { token },
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
} = projectApi;
