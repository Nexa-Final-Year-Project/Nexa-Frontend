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
      // Accept an object with projectId and optional sprint_config
      query: (data) => {
        const projectId =
          typeof data === "string" ? data : data?.projectId || "";
        const body: {
          sprint_config?: {
            sprintLengthDays?: number;
            workHoursPerDay?: number;
            sprintGoals?: string[];
            startDate?: string;
          };
          maxTasksPerMember?: number;
        } = {};

        // Include sprint_config if provided
        if (typeof data === "object" && data?.sprint_config) {
          body.sprint_config = data.sprint_config;
        }

        // Include maxTasksPerMember if provided
        if (typeof data === "object" && data?.maxTasksPerMember) {
          body.maxTasksPerMember = data.maxTasksPerMember;
        }

        return {
          url: `/sprint/plan/${projectId}`,
          method: "POST",
          body,
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
