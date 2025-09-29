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
        url: `/projectMembers/${projectMember.id}`,
        method: "PUT",
        body: projectMember,
      }),
    }),
    deleteProjectMember: builder.mutation({
      query: (id) => ({
        url: `/projectMember/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateProjectMemberMutation,
  useUpdateProjectMemberMutation,
  useDeleteProjectMemberMutation,
} = projectMemberApi;
