"use client";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateStatusDeliveryMutation,
} from "@/app/store/features/orders";
import HeadingAdmin from "@/components/AdminComponents/HeadingAdmin";
import { Table, Input, Space, Button, Modal, Select, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useGetMomosQuery } from "@/app/store/features/momo";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import baseUrl from "@/config/baseUrl";

const { Option } = Select;

// Thêm hàm xử lý URL Cloudinary
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Nếu đã là URL đầy đủ
  if (imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Tạo URL Cloudinary đầy đủ
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/dahm7mli8/image/upload/';
  const cleanImagePath = imageUrl.replace(/^\/+/, '');
  return `${cloudinaryBaseUrl}${cleanImagePath}`;
};

const Bill = () => {
  const { data: orders, isLoading, refetch } = useGetOrdersQuery();
  const [updateStatusDelivery] = useUpdateStatusDeliveryMutation();
  const searchInput = useRef(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [deleteOrder] = useDeleteOrderMutation();
  const [isModalViewBillOpen, setIsModalViewBillOpen] = useState(false);
  const statusOptionsForAdmin = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang giao",
    "Hoàn thành",
    "Hủy bỏ",
    "Trả hàng",
  ];

  const orderSuccess = orders?.filter((order) => order.orderSuccess === true);

  const handleStatusChange = async (
    id,
    newStatus,
    email,
    username,
    orderId
  ) => {
    try {
      const updateStatus = await updateStatusDelivery({
        id,
        newStatus,
      }).unwrap();

      // Gửi email
      const emailResponse = await axios.post(`${baseUrl}/emails/emailStatus`, {
        email,
        username,
        status: newStatus,
        orderId,
      });

      if (emailResponse.data) {
        toast.success(updateStatus.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleViewBill = (record) => {
    setSelectedBill(record);
    setIsModalViewBillOpen(true);
  };

  const handleOkViewBill = () => {
    setIsModalViewBillOpen(false);
  };

  const handleCancelViewBill = () => {
    setIsModalViewBillOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        className="text-[18px]"
        style={{ color: filtered ? "#1890ff" : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const handleDelete = async (id) => {
    try {
      const response = await deleteOrder(id).unwrap();
      console.log("API Response:", response);
      if (response.success) {
        toast.success("Xóa thành công!");
        refetch();
      } else {
        throw new Error(response.message || "API trả về lỗi");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error(error.message || "Xóa thất bại!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      render: (_, __, idx) => <span>{idx + 1}</span>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      ...getColumnSearchProps("orderId"),
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      render: (_, record) => <span>{record?.user?.email}</span>,
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
      ...getColumnSearchProps("phone"),
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
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src={getValidImageUrl(item?.image)}
                alt={item?.name || "Product image"}
                width={50}
                height={50}
              />
              <div className="mb-1">
                {item.name} - SL: <strong>{item.quantity} </strong> -{" "}
                {item.colorName}
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
      dataIndex: "formOfPayment",
      key: "formOfPayment",
      align: "center",
      filters: [
        { text: "Thanh toán qua ví Momo", value: "Thanh toán qua ví Momo" },
        {
          text: "Thanh toán tiền mặt khi nhận hàng",
          value: "Thanh toán tiền mặt khi nhận hàng",
        },
        { text: "Chuyển khoản ngân hàng", value: "Chuyển khoản ngân hàng" },
      ],
      onFilter: (value, record) => record.formOfPayment === value,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "statusPayment",
      key: "statusPayment",
      align: "center",
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
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text) => (
        <span suppressHydrationWarning>
          {new Date(text).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Xem hóa đơn",
      key: "viewBill",
      align: "center",
      render: (record) => (
        <>
          {record?.pay.length > 0 ? (
            <Button type="link" onClick={() => handleViewBill(record)}>
              Xem
            </Button>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      align: "center",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (deliveryStatus, record) => (
        <Select
          defaultValue={deliveryStatus}
          style={{ width: 150 }}
          onChange={(value) =>
            handleStatusChange(
              record._id,
              value,
              record?.user?.email,
              record?.name,
              record?.orderId
            )
          }
          disabled={
            deliveryStatus === "Hoàn thành" || deliveryStatus === "Hủy bỏ"
          } // Không cho sửa nếu đã hoàn thành hoặc hủy
        >
          {statusOptionsForAdmin.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Hành động",
      render: (record) => (
        <>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa blog này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="h-screen">
      <HeadingAdmin title="Quản lý Hóa Đơn" />
      <Table
        columns={columns}
        dataSource={orderSuccess}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        className=" w-full rounded-lg overflow-hidden"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
      <Modal
        title="Chi tiết hóa đơn"
        open={isModalViewBillOpen}
        onOk={handleOkViewBill}
        onCancel={handleCancelViewBill}
        centered
      >
        {selectedBill && (
          <div>
            <p>
              <strong>Mã đơn hàng:</strong> {selectedBill?.pay[0]?.orderId}
            </p>
            <p>
              <strong>Số tiền:</strong> {selectedBill?.pay[0]?.amount} VND
            </p>
            <p>
              <strong>Hình thức thanh toán:</strong>{" "}
              {selectedBill?.pay[0]?.payType}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedBill?.pay[0]?.message}
            </p>
            <p>
              <strong>Thời gian giao dịch:</strong>{" "}
              {new Date(selectedBill?.pay[0]?.responseTime).toLocaleString(
                "vi-VN"
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bill;
