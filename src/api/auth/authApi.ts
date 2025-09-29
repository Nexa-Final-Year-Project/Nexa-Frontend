import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/send-link",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmailLink: builder.mutation({
      query: ({ email, emailLink }) => ({
        url: "/auth/verify-link",
        method: "POST",
        body: { email, emailLink },
      }),
    }),
    googleLogin: builder.query({
      query: () => ({
        url: `oauth/google`,
        method: "GET",
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "me",
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyEmailLinkMutation,
  useLazyGoogleLoginQuery,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} = authApi;
