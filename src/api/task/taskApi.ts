import { baseApi } from "../baseApi";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => ({
        url: "/tasks",
        method: "GET",
      }),
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
      }),
    }),
    getTasksByUserId: builder.query({
      query: (userId) => ({
        url: `/tasksAssignment/user/${userId}`,
        method: "GET",
      }),
    }),
    getTaskByProjectId: builder.query({
      query: (projectId) => ({
        url: `/tasks/${projectId}`,
        method: "GET",
      }),
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
    }),
    generateTasksByAI: builder.mutation({
      query: ({ description, projectId, config, team }) => {
        const authToken = localStorage.getItem("authToken");

        return {
          url: "/tasks/generate-tasks",
          method: "POST",
          body: {
            project_id: projectId,

            description,

            auth_token: authToken ? `Bearer ${authToken}` : "",

            team: (team || []).map((member: any) => ({
              _id: member._id || member.memberId?._id,
              name: member.name || member.memberId?.name,
              role: member.role || member.memberId?.role,
              reliability:
                member.reliability ||
                member.memberId?.reliability ||
                0.8,
              hourlyCapacity:
                member.hourlyCapacity ||
                member.memberId?.hourlyCapacity ||
                40,
            })),

            config: config || {},
          },
        };
      },
    }),
    updateTask: builder.mutation({
      query: (task) => ({
        url: `/tasks/${task.id}`,
        method: "PUT",
        body: task,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
    }),
    assignTask: builder.mutation({
      query: ({ taskId, userId }) => ({
        url: `/tasksAssignment`,
        method: "POST",
        body: { taskId, userId },
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useLazyGetTaskByIdQuery,
  useLazyGetTaskByProjectIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGenerateTasksByAIMutation,
  useLazyGetTasksByUserIdQuery,
  useAssignTaskMutation,
} = taskApi;
