"use client";
import { useUser } from "@/hook/useUser";
import React from "react";
import {
  useGetOrdersQuery,
  useUpdateStatusDeliveryMutation,
} from "../store/features/orders";
import { Select, Table } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const { Option } = Select;

const MyBill = () => {
  const { user, loading, logout } = useUser();
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [updateStatusDelivery] = useUpdateStatusDeliveryMutation();

  const router = useRouter();

  const filterOrder = orders?.filter((item) => item?.user?.id === user?.id);

  const statusOptionsForUser = [
    "Đã nhận được hàng",
    "Chưa nhận được hàng",
    "Yêu cầu trả hàng",
  ];

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateStatus = await updateStatusDelivery({
        id,
        newStatus,
      }).unwrap();
      toast.success(updateStatus.message);
    } catch (error) {
      toast.error("Cập nhập thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      render: (_, __, idx) => <span>{idx}</span>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      key: "address",
      align: "center",
      render: (record) => (
        <span>
          {record.deliveryMethod === "Nhận tại cửa hàng"
            ? `Cửa hàng ${record.store || "Không xác định"}`
            : `${record.note || ""}, ${record.ward || ""}, ${
                record.district || ""
              }, ${record.province || ""}`}
        </span>
      ),
    },
    {
      title: "Sản phẩm",
      key: "cartItems",
      align: "center",
      render: (record) => (
        <div className="grid-cols-2 grid gap-y-5">
          {record.cartItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(`/product/${item?.id}`)}
              className="flex items-center gap-2 cursor-pointer "
            >
              <div>
                <Image
                  src={`https://api-bstore-no35.vercel.app/uploads/${item?.image}`}
                  alt=""
                  width={50}
                  height={50}
                />
              </div>
              <div className="mb-1">
                {item.name} - SL: {item.quantity} - {item.colorName}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => (
        <span className="w-full block">
          {new Intl.NumberFormat("vi-VN").format(text)} VND
        </span>
      ),
    },
    {
      title: "Hình thức thanh toán",
      align: "center",
      dataIndex: "formOfPayment",
      key: "formOfPayment",
    },
    {
      title: "Trạng thái thanh toán",
      align: "center",

      dataIndex: "statusPayment",
      key: "statusPayment",
      render: (status) => (
        <span
          className={`px-2 py-1 w-full block rounded ${
            status === "Đã thanh toán"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Ngày mua",
      align: "center",

      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <span suppressHydrationWarning>
          {new Date(text).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      align: "center",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (deliveryStatus, record) => (
        <>
          {deliveryStatus === "Đang giao" ? (
            <Select
              defaultValue="Chưa nhận được hàng"
              style={{ width: "max-content" }}
              onChange={(value) => handleStatusChange(record._id, value)}
            >
              {statusOptionsForUser.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          ) : (
            <strong>{deliveryStatus}</strong>
          )}
        </>
      ),
    },
  ];
  return (
    <div className=" my-28 md:my-36 px-3 md:px-0 flex flex-col gap-5 max-w-screen-xl mx-auto">
      <span className="text-center uppercase block font-bold  text-[18px] md:text-[24px]">
        Danh sách các đơn hàng của {user?.username}
      </span>
      <Table
        columns={columns}
        dataSource={filterOrder}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        className="  w-full rounded-lg overflow-hidden"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
    </div>
  );
};

export default MyBill;
