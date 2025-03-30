import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "@/config/baseUrl";
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["orders"],

  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["orders"],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`, // Thêm query lấy sản phẩm theo ID
    }),
    getOrderByIdOrder: builder.query({
      query: (orderId) => `/orders/orders/${orderId}`,
    }),
    addOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: formData, // Gửi FormData thay vì JSON object
        headers: {
          // Không đặt Content-Type, trình duyệt sẽ tự động thêm boundary
        },
      }),
    }),

    updateStatusPayment: builder.mutation({
      query: ({ orderId, paymentMethod }) => ({
        url: `/orders/${orderId}/status-payment`,
        method: "PATCH",
        body: { paymentMethod },
      }),
      invalidatesTags: ["orders"],
    }),

    updateStatusDelivery: builder.mutation({
      query: ({ id, newStatus }) => ({
        url: `orders/status/${id}`,
        method: "PATCH",
        body: { newStatus },
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderByIdOrderQuery,
  useUpdateStatusPaymentMutation,
  useUpdateStatusDeliveryMutation,
} = orderApi;
