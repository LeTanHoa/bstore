"use client";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import baseUrl from "@/config/baseUrl";
const Register = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleRegister = async (values) => {
    try {
      // Gửi thông tin đăng ký và yêu cầu OTP
      const response = await axios.post(
        `${baseUrl}/auth/register/send-otp`,
        values
      );
      setUserInfo(values);
      setIsOtpSent(true);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể gửi mã OTP!");
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register/verify-otp`, {
        ...userInfo,
        otp: values.otp,
      });
      toast.success("Đăng ký thành công!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã OTP không đúng!");
    }
  };

  // Form xác nhận OTP
  if (isOtpSent) {
    return (
      <div className="max-w-md mx-auto p-6 my-40 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Xác nhận OTP</h2>
        <Form
          form={form}
          name="otpVerification"
          onFinish={handleVerifyOtp}
          layout="vertical"
        >
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input
              prefix={<NumberOutlined />}
              placeholder="Nhập mã OTP"
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
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  // Form đăng ký ban đầu
  return (
    <div className="max-w-md mx-auto p-6 my-40 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
      <Form
        form={form}
        name="register"
        onFinish={handleRegister}
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
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Số điện thoại"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }, // Kiểm tra độ dài
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

        <div className="text-center">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="text-blue-500 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
