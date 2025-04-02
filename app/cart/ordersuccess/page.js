"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Radio,
  Button,
  Divider,
  Select,
  Spin,
  message,
} from "antd";
import { ShoppingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetOrderByIdOrderQuery,
  useUpdateStatusPaymentMutation,
} from "@/app/store/features/orders";
import QRCode from "qrcode"; // Import thư viện qrcode
import momo_img from "../../../public/MoMo_Logo.png";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCart } from "@/app/store/slices/cartSlice";
import { useUser } from "@/hook/useUser";
import axios from "axios";
import baseUrl from "@/config/baseUrl";
const OrderSuccess = () => {
  const { user, loading, logout } = useUser();
  const [updateStatusPayment] = useUpdateStatusPaymentMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const {
    data: order,
    isLoading,
    isFetching,
    error,
  } = useGetOrderByIdOrderQuery(orderId, {
    skip: !orderId,
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán tiền mặt khi nhận hàng"
  );

  const bankInfo = {
    bankName: "Ngân hàng Phương Đông (OCB)",
    accountNumber: "13052002",
    accountHolder: "Công Ty Cổ Phần Thế Giới Di Động",
    branch: "CN TPHCM",
    transferContent: `FCE2J9 HOA`,
    amount: order?.totalPrice.toLocaleString(),
  };
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // State để lưu URL của mã QR
  const qrData = `Ngân hàng: ${bankInfo.bankName}\nSố tài khoản: ${
    bankInfo.accountNumber
  }\nChủ tài khoản: ${
    bankInfo.accountHolder
  }\nSố tiền: ${bankInfo?.amount?.toLocaleString()}đ\nNội dung: ${
    bankInfo.transferContent
  }`;
  useEffect(() => {
    QRCode.toDataURL(qrData, { width: 128 }, (err, url) => {
      if (err) {
        console.error("Lỗi khi tạo mã QR:", err);
        return;
      }
      setQrCodeUrl(url);
    });
  }, [qrData]);
  const deliveryOptions = [
    {
      label: "6 hình thức thanh toán khác",
      value: "6 hình thức thanh toán khác",
    },
    { label: "Thanh toán qua ví điện tử", value: "Thanh toán qua ví điện tử" },
    {
      label: "Thanh toán qua thẻ tín dụng",
      value: "Thanh toán qua thẻ tín dụng",
    },
  ];

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDeliveryOptionChange = (value) => {
    setSelectedDeliveryOption(value);
  };
  const handleConfirmOrder = async () => {
    try {
      if (paymentMethod === "Chuyển khoản qua ví momo") {
        try {
          const res = await axios.post(`${baseUrl}/payments/payment`, {
            order: order,
            amount: order.totalPrice,
            user: user,
            orderId: orderId,
            selected: paymentMethod,
          });
          console.log(res);

          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
         
          dispatch(clearCart());
        } catch (error) {
          console.log(error);
        }
      } else {
        const response = await updateStatusPayment({ orderId, paymentMethod });
        await axios.post(`${baseUrl}/emails/emailOrder`, {
          //email, username, title, price, selected
          email: order.user?.email,
          username: order.name || order.user?.username,
          price: order.totalPrice,
          products: order.cartItems,
          orderId: orderId,
          selected: paymentMethod,
          delivery: order.deliveryMethod,
          phone: order.phone,
          ward: order.ward,
          district: order.district,
          province: order.province,
          note: order.note,
          store: order.store,
          statusPayment: order.statusPayment,
        });
        toast.success("Xác nhận thanh toán thành công!");
        dispatch(clearCart());
        router.push("/home");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thanh toán:", error);
    }
  };

  // Nếu không có orderId
  if (!orderId) {
    return (
      <div className="min-h-screen  bg-gray-100  flex justify-center items-center">
        <Card className="max-w-2xl  w-full shadow-lg rounded-lg border-none">
          <p className="text-red-500 text-center">
            Không có ID đơn hàng trong URL
          </p>
          <Button
            type="primary"
            className="w-full h-12 text-base mt-4"
            onClick={() => router.push("/home")}
          >
            Về trang chủ TopZone
          </Button>
        </Card>
      </div>
    );
  }

  // Nếu đang tải dữ liệu
  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu có lỗi hoặc không tìm thấy đơn hàng
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-center">
        <Card className="max-w-2xl w-full shadow-lg rounded-lg border-none">
          <p className="text-red-500 text-center">
            {error
              ? `Lỗi khi tải đơn hàng: ${error.message}`
              : `Không tìm thấy đơn hàng với ID: ${orderId}`}
          </p>
          <Button
            type="primary"
            className="w-full h-12 text-base mt-4"
            onClick={() => router.push("/home")}
          >
            Về trang chủ TopZone
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 md:px-0  py-28 ">
      <div className="bg-gray-10 flex justify-center items-center0">
        <Card
          title={
            <div className="flex items-center gap-2">
              <ShoppingOutlined className="text-green-500 text-xl" />
              <span className="text-lg font-semibold text-green-500">
                Đặt hàng thành công
              </span>
            </div>
          }
          className="max-w-2xl  w-full shadow-lg rounded-lg border-none"
        >
          <p className="text-gray-500 mb-6">
            Cảm ơn {order.gender} {order.name || order.user?.username} đã cho
            TopZone cơ hội được phục vụ.
          </p>
          <Descriptions
            title={
              <span className="text-lg font-semibold">
                Đơn hàng: #{orderId}
              </span>
            }
            column={1}
            bordered
            className="mb-6"
          >
            <Descriptions.Item
              label={<span className="font-semibold">Người nhận</span>}
            >
              {order.gender} {order.name || order.user?.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Số điện thoại</span>}
            >
              {order.phone || order.user?.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="font-semibold">{order?.deliveryMethod}</span>
              }
            >
              {order?.deliveryMethod === "Nhận tại cửa hàng" ? (
                `${order.store}`
              ) : (
                <>
                  {" "}
                  {`${order.note ?? ""}, ${order.ward ?? ""}, ${
                    order.district ?? ""
                  }, ${order.province ?? ""}`}
                  <br /> (Nhân viên sẽ gọi xác nhận trước khi giao).
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Tổng tiền</span>}
            >
              {new Intl.NumberFormat("vi-VN").format(
                order.totalPrice.toLocaleString()
              )}{" "}
              vnđ
            </Descriptions.Item>
          </Descriptions>
          <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-center gap-2">
            <CheckCircleOutlined className="text-yellow-500 text-xl" />
            <span className="text-blue-500">
              Bạn được tích {Math.floor(order.totalPrice / 1000)} điểm cho đơn
              hàng này.
              <br />
              Xem hướng dẫn sử dụng{" "}
              <a href="#" className="text-blue-500 underline">
                Quà tặng VIP
              </a>
            </span>
          </div>
          <div className="bg-orange-50 p-4 rounded-md mb-6 border border-orange-200">
            <p className="text-orange-500 font-semibold">
              Đơn hàng chưa được thanh toán
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Chọn hình thức thanh toán:
            </h3>
            <Radio.Group
              onChange={handlePaymentMethodChange}
              value={paymentMethod}
              className="flex flex-col gap-2"
            >
              <Radio value="Thanh toán tiền mặt khi nhận hàng">
                Thanh toán tiền mặt khi nhận hàng
              </Radio>
              <Radio value="Chuyển khoản ngân hàng">
                Chuyển khoản ngân hàng
              </Radio>
              <div className="flex items-center">
                <Radio value="Chuyển khoản qua ví momo">
                  Chuyển khoản qua ví Momo
                </Radio>
                <Image src={momo_img} width={30} height={30} alt="" />
              </div>
            </Radio.Group>

            {paymentMethod === "Thanh toán tiền mặt khi nhận hàng" && (
              <>
                <p className="text-gray-500 mt-2">
                  Khi cần hỗ trợ vui lòng gọi{" "}
                  <span className="text-blue-500">
                    1900 9696 42 (08h00 - 21h30)
                  </span>
                </p>
                <Button type="link" className="text-blue-500 p-0 mt-1">
                  Xem chính sách hỗ trợ online
                </Button>
              </>
            )}

            {paymentMethod === "Chuyển khoản ngân hàng" && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
                <div className="text-gray-700">
                  <p>
                    <strong>Ngân hàng:</strong> {bankInfo.bankName}
                  </p>
                  <p>
                    <strong>Số tài khoản:</strong> {bankInfo.accountNumber}{" "}
                    <span className="text-blue-500 cursor-pointer">
                      Sao chép
                    </span>
                  </p>
                  <p>
                    <strong>Chủ tài khoản:</strong> {bankInfo.accountHolder}
                  </p>
                  <p>
                    <strong>Chi nhánh:</strong> {bankInfo.branch}
                  </p>
                  <p>
                    <strong>Nội dung CK:</strong> {bankInfo.transferContent}{" "}
                    <span className="text-blue-500 cursor-pointer">
                      Sao chép
                    </span>
                  </p>
                  <p>
                    <strong>Số tiền:</strong> {bankInfo.amount.toLocaleString()}
                    đ
                  </p>
                </div>
                <div className="flex justify-center mt-4">
                  {qrCodeUrl ? (
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <Spin size="small" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = qrCodeUrl;
                      link.download = "qrcode.png";
                      link.click();
                    }}
                  >
                    Tải mã QR CODE
                  </Button>
                </div>
                <p className="text-gray-500 text-center mt-2">
                  Dùng ứng dụng ngân hàng quét mã QR để chuyển khoản
                </p>
              </div>
            )}
          </div>
          <Divider />
          <div className="mb-6 flex flex-col gap-4">
            {order.cartItems?.map((item, index) => (
              <div key={item.id + index} className="flex items-center gap-4">
                <Image
                  src={`${item.image}`}
                  alt={item.name || "Sản phẩm"}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{item.name}</p>
                  <p className="text-gray-600">Màu: {item.colorName}</p>
                  <p className="text-gray-600">Số lượng: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="primary"
            className="w-full h-12 text-base"
            onClick={handleConfirmOrder}
          >
            Xác nhận thanh toán
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;
