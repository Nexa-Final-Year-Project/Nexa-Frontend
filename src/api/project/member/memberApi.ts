import { baseApi } from "../../baseApi";

export const projectMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProjectMember: builder.mutation({
      query: (projectMember) => ({
        url: "/projectMember",
        method: "POST",
        body: projectMember,
      }),
    }),
    updateProjectMember: builder.mutation({
      query: (projectMember) => ({
        url: `/projectMember/${projectMember.id}`,
        method: "PUT",
        body: projectMember,
      }),
    }),
    deleteProjectMember: builder.mutation({
      query: ({ projectId, memberId }) => ({
        url: `/projectMember/${projectId}`,
        method: "DELETE",
        body: { memberId },
      }),
    }),
  }),
});

export const {
  useCreateProjectMemberMutation,
  useUpdateProjectMemberMutation,
  useDeleteProjectMemberMutation,
} = projectMemberApi;
