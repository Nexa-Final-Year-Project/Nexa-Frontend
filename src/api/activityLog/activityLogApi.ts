import { baseApi } from "../baseApi";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: ({ params }) => ({
        url: "/activity-logs",
        method: "GET",
        params,
      }),
    }),
    getActivityLogById: builder.query({
      query: (id) => ({
        url: `/activity-logs/${id}`,
        method: "GET",
      }),
    }),
    createActivityLog: builder.mutation({
      query: (activityLog) => ({
        url: "/activity-logs",
        method: "POST",
        body: activityLog,
      }),
    }),
    deleteActivityLog: builder.mutation({
      query: (id) => ({
        url: `/activity-logs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useLazyGetActivityLogsQuery,
  useLazyGetActivityLogByIdQuery,
  useCreateActivityLogMutation,
  useDeleteActivityLogMutation,
} = activityLogApi;
