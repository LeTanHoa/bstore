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
    // Reset form khi mở modal thêm mới
    setFormKey((prev) => prev + 1);
  };

  const handleOpenEdit = (product) => {
    // Set dữ liệu cũ khi edit
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    // Reset form sau khi đóng modal
    setFormKey((prev) => prev + 1);
  };

  // Hàm xử lý khi submit form thành công
  const handleFormSuccess = () => {
    handleCloseModal();
    refetch();
    message.success(
      editingProduct ? "Cập nhật thành công!" : "Thêm mới thành công!"
    );
  };

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

      <div className="w-full ">
        <Table
          dataSource={products}
          onChange={handleChange}
          sortedInfo={sortedInfo}
          columns={[
            {
              title: "STT",
              dataIndex: "stt",
              key: "stt",
              align: "center",
              render: (_, __, idx) => idx + 1,
            },
            {
              title: "Tên",
              dataIndex: "name",
              key: "name",
              align: "center",
            },
            {
              title: "Mô tả",

              key: "description",
              align: "center",
              render: (_, record) => (
                <span onClick={() => showModalContent(record.description)}>
                  Xem chi tiết
                </span>
              ),
              //   render: (_, record) => (
              //
              //   ),
            },
            {
              title: "Giá",
              dataIndex: "price",
              key: "price",
              align: "center",
              sorter: (a, b) => a.price - b.price,
              sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
            },
            {
              title: "Ngày ra mắt",
              dataIndex: "releaseDate",
              key: "releaseDate",
              align: "center",
              render: (record) => (
                <span suppressHydrationWarning>
                  {new Date(record).toLocaleDateString("vi-VN")}
                </span>
              ),
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
            },
            { title: "RAM", dataIndex: "ram", key: "ram", align: "center" },
            {
              title: "Storage",
              dataIndex: "storage",
              key: "storage",
              align: "center",
            },
            {
              title: "Màn hình",
              dataIndex: "display",
              key: "display",
              align: "center",
            },
            {
              title: "Pin",
              dataIndex: "battery",
              key: "battery",
              align: "center",
            },
            {
              title: "Camera",
              dataIndex: "camera",
              key: "camera",
              align: "center",
            },
            {
              title: "Hệ điều hành",
              dataIndex: "os",
              key: "os",
              align: "center",
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
              render: (capacities) => capacities.join(", "),
            },
            {
              title: "Màu sắc",
              dataIndex: "colors",
              key: "colors",
              align: "center",
              render: (colors) => (
                <div className="w-full flex">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-full flex flex-col items-center justify-between"
                    >
                      <span style={{ fontWeight: "bold", color: "black" }}>
                        {color?.colorName}
                      </span>
                      {color.images.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginTop: "5px",
                          }}
                        >
                          {color?.images?.length > 0 && (
                            <Image
                              src={`https://api-bstore-no35.vercel.app/uploads/${color?.images[0]}`}
                              alt={color.colorName}
                              width={50}
                              height={50}
                              style={{ borderRadius: "5px" }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: "Tùy chọn",
              render: (record) => (
                <>
                  <div style={{ display: "flex", gap: "10px" }}>
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
                    <Button
                      type="primary"
                      onClick={() => handleOpenEdit(record)}
                      primary
                      icon={<RxUpdate />}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                </>
              ),
            },
          ]}
          loading={isLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }} // Đảm bảo Table rộng tối đa
          className="w-full" // Thêm class Tailwind để chiếm toàn bộ width
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
            key={formKey} // Thêm key để reset form
            initialValues={editingProduct}
            onSuccess={handleFormSuccess}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
