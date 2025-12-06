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
    //GetTask by user ID
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
    // Create Task
    createTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
    }),
// Generate Tasks by AI
     generateTasksByAI: builder.mutation({
  query: ({ description, projectId, config, team }) => {
    const authToken = localStorage.getItem("authToken");

    return {
      url: "/tasks/generate-tasks",
      method: "POST",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: {
        project_id: projectId,
        description,
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

// Update Task 
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
