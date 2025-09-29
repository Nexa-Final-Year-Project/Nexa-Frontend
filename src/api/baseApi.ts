import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const HOST = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";
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
