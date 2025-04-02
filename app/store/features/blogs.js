import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "@/config/baseUrl";
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["blogs"],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["blogs"],
    }),
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`, // Thêm query lấy sản phẩm theo ID
    }),

    addBlog: builder.mutation({
      query: (formData) => ({
        url: "/blogs",
        method: "POST",
        body: formData,
        // Không set Content-Type để browser tự xử lý multipart/form-data
      }),
      invalidatesTags: ["blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
