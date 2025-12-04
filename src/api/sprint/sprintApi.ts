import { baseApi } from "../baseApi";

export const sprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query({
      query: () => ({
        url: "/sprint",
        method: "GET",
      }),
    }),
    getSprintByProjectId: builder.query({
      query: (projectId) => ({
        url: `/sprint/${projectId}`,
        method: "GET",
      }),
    }),
    getSprintById: builder.query({
      query: (id) => ({
        url: `/sprint/sprint/${id}`,
        method: "GET",
      }),
    }),
    createSprint: builder.mutation({
      query: (sprint) => ({
        url: "/sprint",
        method: "POST",
        body: sprint,
      }),
    }),
    planSprintsByAI: builder.mutation({
      // Accept either a projectId string or an object { projectId }
      query: (data) => {
        const projectId = typeof data === "string" ? data : (data?.projectId || "");
        return {
          url: `/sprint/plan/${projectId}`,
          method: "POST",
          // keep body empty; backend expects projectId in URL
        };
      },
    }),
    updateSprint: builder.mutation({
      query: (sprint) => ({
        url: `/sprint/${sprint.id}`,
        method: "PUT",
        body: sprint,
      }),
    }),
    deleteSprint: builder.mutation({
      query: (id) => ({
        url: `/sprint/${id}`,
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
