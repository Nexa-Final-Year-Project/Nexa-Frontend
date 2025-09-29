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
      query: ({ description, project }) => ({
        url: "/tasks/generate-tasks",
        method: "POST",
        body: { description, project },
      }),
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
