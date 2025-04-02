"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Popconfirm, message } from "antd";
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

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl; // API đã trả về URL đầy đủ từ Cloudinary
};

const Blog = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addBlog] = useAddBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const { data: blogs, isLoading, refetch } = useGetBlogsQuery();

  const showModal = (content) => {
    setSelectedContent(content);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const handleSaveBlog = async (formData) => {
    try {
      setIsSubmitting(true);

      // Validate form data
      const title = formData.get("title");
      const category = formData.get("category");

      if (!title || !category) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      if (editingBlog) {
        const response = await updateBlog({
          id: editingBlog._id,
          formData,
        }).unwrap();

        if (response) {
          toast.success("Cập nhật blog thành công");
          await refetch(); // Đảm bảo dữ liệu được cập nhật
        }
      } else {
        const response = await addBlog(formData).unwrap();
        if (response) {
          toast.success("Thêm blog thành công");
          await refetch();
        }
      }

      handleCancel();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      await refetch();
      toast.success("Xóa blog thành công!");
    } catch (error) {
      toast.error("Xóa blog thất bại!");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (image) => {
        const validImageUrl = getValidImageUrl(image);
        return validImageUrl ? (
          <Image
            style={{ borderRadius: "10px", objectFit: "cover" }}
            alt="Blog thumbnail"
            width={100}
            height={100}
            src={validImageUrl}
            priority={false}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        );
      },
    },
    {
      title: "Tùy chọn",
      key: "actions",
      fixed: "right",
      width: 280,
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => showModal(record.content)}>
            Xem chi tiết
          </Button>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa blog này?"
            description="Bạn có chắc chắn muốn xóa blog này không?"
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
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài viết`,
        }}
      />

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
        styles={{
          body: {
            maxHeight: '600px',
            overflowY: 'auto'
          }
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: selectedContent }}></div>
      </Modal>

      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onOk={() => document.querySelector("#blogForm")?.requestSubmit()}
        onCancel={handleCancel}
        confirmLoading={isSubmitting}
        okText={editingBlog ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={700}
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
