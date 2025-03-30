"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import HeadingAdmin from "@/components/AdminComponents/HeadingAdmin";
import Image from "next/image";
import BlogForm from "@/components/AdminComponents/BlogForm";
import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
} from "@/app/store/features/blogs";
import { toast } from "react-toastify";

const Blog = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);

  const [addBlog] = useAddBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const { data: blogs, isLoading, refetch } = useGetBlogsQuery();

  // Hiển thị modal xem chi tiết
  const showModal = (content) => {
    setSelectedContent(content);
    setIsViewModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const handleSaveBlog = async (formData) => {
    try {
      if (editingBlog) {
        // Cập nhật blog
        await updateBlog({ id: editingBlog._id, formData }).unwrap();
        toast.success("Cập nhật blog thành công");
      } else {
        // Thêm blog mới
        await addBlog(formData).unwrap();
        toast.success("Thêm blog thành công");
      }
      setEditingBlog(null);

      refetch();
      handleCancel();
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  // Mở modal chỉnh sửa
  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setIsModalVisible(true);
  };

  // Xóa blog
  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      refetch();
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          style={{ borderRadius: "10px", objectFit: "cover" }}
          alt=""
          width={100}
          height={100}
          src={`https://api-bstore-no35.vercel.app/uploads/${image}`}
        />
      ),
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => showModal(record.content)}>
            Xem chi tiết
          </Button>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Chỉnh sửa
          </Button>
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
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen">
      <HeadingAdmin title="Quản lý Blog" />
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm Blog Mới
      </Button>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: "max-content" }} // Đảm bảo Table rộng tối đa
        className="w-full" // Thêm class Tailwind để chiếm toàn bộ width
      />

      {/* Modal Xem Chi Tiết */}
      <Modal
        title="Chi tiết bài viết"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={1000}
        bodyStyle={{ maxHeight: "600px", overflowY: "auto" }}
      >
        <div dangerouslySetInnerHTML={{ __html: selectedContent }}></div>
      </Modal>

      {/* Modal Thêm/Chỉnh Sửa Bài Viết */}
      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onOk={() => document.querySelector("#blogForm")?.requestSubmit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <BlogForm
          onSubmit={handleSaveBlog}
          initialValues={editingBlog || {}}
          formId="blogForm"
        />
      </Modal>
    </div>
  );
};

export default Blog;
