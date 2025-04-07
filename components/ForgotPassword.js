import { useState } from "react";
import baseUrl from "@/config/baseUrl";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1); // 1: email form, 2: otp form
  const [email, setEmail] = useState("");

  const handleSendOTP = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/auth/forgot-password-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setEmail(values.email); // Lưu lại email
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/auth/reset-password-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white ">
      {step === 1 ? (
        <Form form={form} layout="vertical" onFinish={handleSendOTP}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Vui lòng nhập email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi mã OTP
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input placeholder="Nhập mã OTP" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
