import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
// If BASE_URL already ends with /api, use it as-is; otherwise add /api
const HOST = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

export const baseApi = createApi({
  reducerPath: "hmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: HOST,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${localStorage.getItem("authToken")}`
      );
      return headers;
    },
  }),

  endpoints: () => ({}),
});
