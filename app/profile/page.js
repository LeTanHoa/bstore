"use client";
import { useUser } from "@/hook/useUser";
import {
  Button,
  Card,
  message,
  Descriptions,
  Avatar,
  Space,
  Tabs,
  Form,
  Input,
} from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "@/config/baseUrl";
const changePassword = async (data) => {
  try {
    const response = await axios.put(`${baseUrl}/auth/change-password`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Đổi mật khẩu thành công!");
    return response.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu"
    );
  }
};

export default function Profile() {
  const { user, loading, logout } = useUser();
  const router = useRouter();
  const [form] = Form.useForm();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Đang tải...</div>;
  }

  if (!user) {
    toast.error("Vui lòng đăng nhập!");
    router.push("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    router.push("/login");
  };

  const onFinish = async (values) => {
    try {
      const { currentPassword, newPassword } = values;

      // Kiểm tra mật khẩu cũ và mới có khớp không
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }

      // Gọi API đổi mật khẩu
      await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Đổi mật khẩu thành công!");
      form.resetFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: (
        <div className="py-4 flex flex-col gap-5">
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={<span className="font-semibold">ID</span>}
            >
              {user.id}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Tên đăng nhập</span>}
            >
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Email</span>}
            >
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Số điện thoại</span>}
            >
              {user.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Địa chỉ</span>}
            >
              {user.address}
            </Descriptions.Item>
          </Descriptions>
          <div className="flex items-center justify-between">
            <Button
              type="primary"
              primary
              onClick={handleLogout}
              className="h-9"
            >
              Đăng Xuất
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <div className="w-full flex justify-center">
          <Form
            form={form}
            name="change-password"
            onFinish={onFinish}
            layout="vertical"
            className="py-4 w-full"
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-3 md:px-0 flex flex-col gap-5 items-center  py-32 bg-[#3e3e3f] ">
      <span className="text-white text-[22px] md:text-3xl uppercase font-bold text-center">
        Thông tin cá nhân
      </span>
      <Card className="w-full md:w-[50%] shadow-lg  rounded-lg">
        <Tabs defaultActiveKey="1" items={items} className="min-h-[400px] " />
      </Card>
    </div>
  );
}
