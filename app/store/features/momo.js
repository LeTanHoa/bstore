import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "@/config/baseUrl";
export const momoApi = createApi({
  reducerPath: "momoApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["momos"],
  endpoints: (builder) => ({
    getMomos: builder.query({
      query: () => "/payments/get-all-payment",
      providesTags: ["momos"],
    }),
    getMomoById: builder.query({
      query: (id) => `/payments/${id}`, // Thêm query lấy sản phẩm theo ID
    }),
  }),
});

export const { useGetMomosQuery, useGetMomoByIdQuery } = momoApi;
