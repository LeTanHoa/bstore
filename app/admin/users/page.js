"use client";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/app/store/features/users";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Popconfirm, Form, Input, Alert } from "antd";
import HeadingAdmin from "@/components/AdminComponents/HeadingAdmin";
import {
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "@/hook/useUser";
import baseUrl from "@/config/baseUrl";
const Users = () => {
  const { user } = useUser();
  const {
    data: users,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds as fallback
  });
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  useEffect(() => {
    // Handle WebSocket connection error
    const handleConnectionError = () => {
      toast.error("Mất kết nối đến máy chủ. Đang thử kết nối lại...");
      setTimeout(() => {
        refetch();
      }, 5000); // Try to reconnect after 5 seconds
    };

    // Add event listener for offline status
    window.addEventListener("offline", handleConnectionError);

    // Cleanup
    return () => {
      window.removeEventListener("offline", handleConnectionError);
    };
  }, [refetch]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/register`,
        { ...values, role: "admin" }
      );
      toast.success("Đăng ký thành công!");
      handleCancel();
      refetch();
    } catch (error) {
      if (error.message === "Network Error") {
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối!"
        );
      } else {
        toast.error(error.response?.data?.message || "Đăng ký thất bại!");
      }
    }
  };

  const handleUpdate = (record) => {
    setSelectedUser(record);
    setIsUpdateModalOpen(true);
    updateForm.setFieldsValues({
      username: record.username,  
      phone: record.phone,
      address: record.address,
    });
  };

  const handleUpdateSubmit = async (values) => {
    try {
      await updateUser({ id: selectedUser._id, formData: values });
      toast.success("Cập nhật thành công!");
      setIsUpdateModalOpen(false);
      updateForm.resetFields();
      refetch();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, idx) => <span>{idx + 1}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Vai trò",
      key: "role",
      render: (record) => (
        <span>{record?.role === "user" ? "Người dùng" : "Quản trị viên"}</span>
      ),
      filters: [
        { text: "Người dùng", value: "user" },
        { text: "Quản trị viên", value: "admin" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(), // Định dạng thời gian
    },
    {
      title: "Ngày chỉnh sửa",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(), // Định dạng thời gian
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (text, record) => (
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
            onClick={() => handleUpdate(record)}
            primary
            icon={<RxUpdate />}
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      refetch();
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };
  return (
    <div className="h-screen">
      <HeadingAdmin title="Quản lý Tài Khoản Người Dùng" />

      {fetchError && (
        <Alert
          message="Lỗi kết nối"
          description="Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối của bạn."
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={showModal}
      >
        Thêm tài khoản
      </Button>

      <Modal
        title="Đăng Ký Tài Khoản Mới"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cập Nhật Thông Tin Người Dùng"
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          updateForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form
          form={updateForm}
          name="update"
          onFinish={handleUpdateSubmit}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          </Form.Item>

          <Form.Item name="phone">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item name="address">
            <Input
              prefix={<HomeOutlined />}
              placeholder="Địa chỉ"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
        className="w-full"
      />
    </div>
  );
};

export default Users;
