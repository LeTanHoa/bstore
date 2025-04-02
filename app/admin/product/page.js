"use client";
import { Button, Table, message, Modal, Popconfirm } from "antd";
import { useState } from "react";

import ProductForm from "@/components/AdminComponents/ProductForm";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/app/store/features/products";
import HeadingAdmin from "@/components/AdminComponents/HeadingAdmin";
import Image from "next/image";
import { RxUpdate } from "react-icons/rx";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [content, setContent] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const [isModalContentOpen, setIsModalContentOpen] = useState(false);
  const showModalContent = (ct) => {
    setIsModalContentOpen(true);
    setContent(ct);
  };

  const handleOkContent = () => {
    setIsModalContentOpen(false);
  };

  const handleCancelContent = () => {
    setIsModalContentOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      refetch();
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    setFormKey((prev) => prev + 1);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormKey((prev) => prev + 1);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    refetch();
    message.success(
      editingProduct ? "Cập nhật thành công!" : "Thêm mới thành công!"
    );
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 60,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      ellipsis: true, // Cắt chữ nếu quá dài
    },
    {
      title: "Mô tả",
      key: "description",
      align: "center",
      width: 120,
      render: (_, record) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => showModalContent(record.description)}
        >
          Xem chi tiết
        </span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Ngày ra mắt",
      dataIndex: "releaseDate",
      key: "releaseDate",
      align: "center",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa có",
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      sorter: (a, b) => a.stock - b.stock,
      sortOrder: sortedInfo.columnKey === "stock" && sortedInfo.order,
    },
    {
      title: "Chip",
      dataIndex: "chip",
      key: "chip",
      align: "center",
      ellipsis: true,
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Storage",
      dataIndex: "storage",
      key: "storage",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Màn hình",
      dataIndex: "display",
      key: "display",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Pin",
      dataIndex: "battery",
      key: "battery",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Camera",
      dataIndex: "camera",
      key: "camera",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Hệ điều hành",
      dataIndex: "os",
      key: "os",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productType",
      key: "productType",
      align: "center",
      filters: [
        { text: "iPhone", value: "iPhone" },
        { text: "iMac", value: "iMac" },
        { text: "iPad", value: "iPad" },
        { text: "AirPod", value: "AirPod" },
        { text: "Watch", value: "Watch" },
        { text: "Phụ kiện", value: "Phụ kiện" },
      ],
      onFilter: (value, record) => record.productType === value,
    },
    {
      title: "Dung lượng",
      dataIndex: "capacities",
      key: "capacities",
      align: "center",
      render: (capacities) =>
        capacities && capacities.length > 0 ? capacities.join(", ") : "Chưa có",
    },
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      align: "center",
      width: 200,
      render: (colors) => (
        <div className="flex flex-col gap-2">
          {colors?.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <span style={{ fontWeight: "bold", color: "black" }}>
                {color?.colorName} ({color?.colorCode})
              </span>
              {color?.images && color?.images.length > 0 && (
                <Image
                  src={color.images[0]} // Hiển thị ảnh đầu tiên
                  alt={color.colorName || "Color Image"}
                  width={50}
                  height={50}
                  style={{ borderRadius: "5px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg"; // Fallback nếu ảnh lỗi
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (record) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<RxUpdate />}
            onClick={() => handleOpenEdit(record)}
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeadingAdmin title="Quản lý sản phẩm" />
      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={handleOpenAdd}
      >
        Thêm Sản phẩm
      </Button>

      <div className="w-full">
        <Table
          dataSource={products}
          onChange={handleChange}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="w-full"
        />

        <Modal
          centered
          title="Chi tiết mô tả"
          open={isModalContentOpen}
          onOk={handleOkContent}
          onCancel={handleCancelContent}
          width={1000}
        >
          <p
            className="h-[600px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          ></p>
        </Modal>

        <Modal
          title={editingProduct ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          <ProductForm
            key={formKey}
            initialValues={editingProduct}
            onSuccess={handleFormSuccess}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
