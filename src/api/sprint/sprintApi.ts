import { baseApi } from "../baseApi";

export const sprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query({
      query: () => ({
        url: "/sprints",
        method: "GET",
      }),
    }),
    getSprintByProjectId: builder.query({
      query: (projectId) => ({
        url: `/sprints/${projectId}`,
        method: "GET",
      }),
    }),
    getSprintById: builder.query({
      query: (id) => ({
        url: `/sprints/sprint/${id}`,
        method: "GET",
      }),
    }),
    createSprint: builder.mutation({
      query: (sprint) => ({
        url: "/sprints",
        method: "POST",
        body: sprint,
      }),
    }),
    planSprintsByAI: builder.mutation({
      query: (data) => ({
        url: "/sprints/plan",
        method: "POST",
        body: data,
      }),
    }),
    updateSprint: builder.mutation({
      query: (sprint) => ({
        url: `/sprints/${sprint.id}`,
        method: "PUT",
        body: sprint,
      }),
    }),
    deleteSprint: builder.mutation({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSprintsQuery,
  useLazyGetSprintsQuery,
  useLazyGetSprintByProjectIdQuery,
  usePlanSprintsByAIMutation,
  useLazyGetSprintByIdQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintApi;
