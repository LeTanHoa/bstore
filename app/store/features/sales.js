import baseUrl from "@/config/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["sales"],
  endpoints: (builder) => ({
    getFlashSales: builder.query({
      query: () => "/sales/flash-sales",
      providesTags: ["sales"],
    }),
    getSaleById: builder.query({
      query: (id) => `/sales/${id}`,
      providesTags: ["sales"],
    }),
    addSale: builder.mutation({
      query: (sale) => ({
        url: "/sales",
        method: "POST",
        body: sale,
      }),
      invalidatesTags: ["sales"], // Add this to refresh the list after adding
    }),
    updateSale: builder.mutation({
      query: ({ id, sale }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body: sale,
      }),
      invalidatesTags: ["sales"], // Add this to refresh the list after updating
    }),
    deleteSale: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sales"], // Add this to refresh the list after deleting
    }),
  }),
});

export const {
  useGetFlashSalesQuery,
  useGetSaleByIdQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = saleApi;
