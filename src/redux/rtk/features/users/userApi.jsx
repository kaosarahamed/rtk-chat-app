import { apiSlice } from "../apis/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) => `/users?email=${email}`,
    }),
  }),
});

export const { useGetUserQuery } = userApi;
