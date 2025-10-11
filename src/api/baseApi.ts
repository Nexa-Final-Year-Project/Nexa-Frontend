import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const HOST = BASE_URL;
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
