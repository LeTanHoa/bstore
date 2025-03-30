import baseUrl from "@/config/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/auth",
      //   providesTags: ["users"],
    }),
    // getUserById: builder.query({
    //   query: (id) => `/users/${id}`,
    // }),

    // addUser: builder.mutation({
    //   query: (user) => ({
    //     url: "/users",
    //     method: "POST",
    //     body: user,
    //   }),
    // //   invalidatesTags: ["users"],
    // }),
    // updateUser: builder.mutation({
    //   query: ({ id, formData }) => ({
    //     url: `/users/${id}`,
    //     method: "PUT",
    //     body: formData, // Gửi FormData thay vì JSON object
    //     headers: {
    //       // Không đặt Content-Type, trình duyệt sẽ tự động thêm boundary
    //     },
    //   }),
    // }),
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/auth/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,

  //   useGetuserByIdQuery,
  //   useAdduserMutation,
} = userApi;
