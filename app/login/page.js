"use client";
import { Form, Input, Button, message, Modal } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { toast } from "react-toastify";
import { useState } from "react";
import ForgotPassword from "@/components/ForgotPassword";
import baseUrl from "@/config/baseUrl";
const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { login } = useUser();

  const [isModalOpenResetPassword, setIsModalOpenResetPassword] =
    useState(false);
  const showModalResetPassword = () => {
    setIsModalOpenResetPassword(true);
  };
  const handleOkResetPassword = () => {
    setIsModalOpenResetPassword(false);
  };
  const handleCancelResetPassword = () => {
    setIsModalOpenResetPassword(false);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, values);
      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        await login(response.data.token);
        router.push("/home");
      } else {
        toast.error("Đăng nhập không thành công!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="max-w-md mx-auto my-40 p-3 bg-white ">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="rounded-xl shadow-xl p-3"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
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
            Đăng Nhập
          </Button>
        </Form.Item>

        <div className="text-center space-y-2">
          <div>
            <Button type="link" onClick={showModalResetPassword}>
              Quên mật khẩu?
            </Button>
          </div>
          <div>
            <span>Chưa có tài khoản? </span>
            <Link href="/register" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </Form>

      <Modal
        title="Quên mật khẩu"
        open={isModalOpenResetPassword}
        onOk={handleOkResetPassword}
        footer={false}
        centered
        onCancel={handleCancelResetPassword}
      >
        <ForgotPassword />
      </Modal>
    </div>
  );
};

export default Login;
