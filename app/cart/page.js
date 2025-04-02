"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Radio, Select, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "../store/features/products";
import { IoCloseSharp } from "react-icons/io5";
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { useAddOrderMutation } from "../store/features/orders";
import Link from "next/link";

const { Option } = Select;

function Cart() {
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const { data: products, isLoading } = useGetProductsQuery();
  const cartItems = useSelector((state) => state.cart.items);
  const [addOrder] = useAddOrderMutation();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Gọi ngay khi component mount
    window.addEventListener("resize", handleResize); // Cập nhật khi resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const dataCart = useMemo(() => {
    // Tạo một object để nhóm các sản phẩm theo ID và colorId
    const groupedItems = cartItems.reduce((acc, cartItem) => {
      const key = `${cartItem.id}`;
      if (!acc[key]) {
        acc[key] = {
          ...cartItem.product,
          selectedColor: cartItem.color,
          selectedColorName: cartItem.colorName,
          selectedImage: cartItem.image,
          selectedColorId: cartItem.colorId,
          quantity: cartItem.quantity,
        };
      }
      return acc;
    }, {});

    // Chuyển object thành array
    return Object.values(groupedItems);
  }, [cartItems]);

  const handleRemoveFromCart = (productId, colorId) => {
    dispatch(removeFromCart({ id: productId, colorId }));
  };

  // Sửa lại hàm tăng/giảm số lượng
  const handleIncrease = (productId, colorId) => {
    dispatch(addToCart({ id: productId, colorId }));
  };

  const handleDecrease = (productId, colorId) => {
    dispatch(decreaseQuantity({ id: productId, colorId }));
  };

  const [deliveryMethod, setDeliveryMethod] = useState("Giao tận nơi");
  const [form] = Form.useForm();

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setDistricts([]);
    setWards([]);
    form.setFieldsValue({
      province: provinces.find((p) => p.code === value)?.name,
      district: null,
      ward: null,
    });

    fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    form.setFieldsValue({
      district: districts.find((p) => p.code === value)?.name,
      ward: null,
    });

    fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleWardChange = (value) => {
    form.setFieldsValue({ ward: value });
  };
  // const [selectedColors, setSelectedColors] = useState({});
  // const [selectedImages, setSelectedImages] = useState({});
  // const [selectedColorName, setSelectedColorName] = useState({});
  // const [selectedId, setSelectedId] = useState({});
  // useEffect(() => {
  //   if (dataCart && dataCart.length > 0) {
  //     const initialColors = {};
  //     const initialImages = {};
  //     const initialColorsName = {};
  //     const initialId = {};
  //     dataCart.forEach((item) => {
  //       initialColors[item._id] = item.colors[0]?.colorCode || "";
  //       initialImages[item._id] = item.colors[0]?.images[0] || "";
  //       initialColorsName[item._id] = item.colors[0]?.colorName || "";
  //       initialId[item._id] = item.colors[0]?._id || "";
  //     });
  //     setSelectedColors(initialColors);
  //     setSelectedImages(initialImages);
  //     setSelectedColorName(initialColorsName);
  //     setSelectedId(initialId);
  //   }
  // }, [dataCart]);

  // const handleColorChange = (productId, colorCode) => {
  //   const product = dataCart.find((item) => item._id === productId);
  //   const selectedColor = product.colors.find((c) => c.colorCode === colorCode);
  //   setSelectedColors((prev) => ({ ...prev, [productId]: colorCode }));
  //   setSelectedImages((prev) => ({
  //     ...prev,
  //     [productId]: selectedColor?.images[0] || "",
  //   }));
  // };

  const randomNumber = () =>
    Math.floor(1000000000 + Math.random() * 9000000000);

  const handleSubmit = async (values) => {
    const orderId = randomNumber();
    const orderData = {
      ...values,
      user: user,
      deliveryMethod,
      orderId,
      cartItems: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color, // Lấy trực tiếp từ item
        image: item.image, // Lấy trực tiếp từ item
        colorName: item.colorName, // Lấy trực tiếp từ item
        colorId: item.colorId, // Lấy trực tiếp từ item
      })),
      totalPrice: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    };

    try {
      const response = await addOrder(orderData).unwrap();
      toast.success("Đặt hàng thành công!");
      //dispatch(clearCart()); // Xóa giỏ hàng sau khi đặt hàng thành công
      router.push(`/cart/ordersuccess?orderId=${orderId}`); // Chỉ truyền orderId qua query
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Đã xảy ra lỗi khi đặt hàng!");
    }
  };

  return (
    <div className="max-w-xl my-32 px-3 md:px-0   mx-auto   ">
      {/* Danh sách sản phẩm */}
      <div className="bg-gray-100 rounded-xl shadow-xl p-4">
        {cartItems?.map((item, index) => (
          <div
            key={`${item._id}-${item.colorId}-${index}`}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex items-center gap-4">
              <Link className="cursor-pointer" href={`/product/${item.id}`}>
                <Image
                  src={`${item.image}`}
                  alt={item.name}
                  width={80}
                  height={80}
                />
              </Link>
              <div className="flex flex-col gap-2 ">
                <Link href={`/product/${item.id}`}>
                  <p className="font-semibold">{item.name}</p>
                </Link>

                <div className="flex items-center gap-2">
                  <span
                    className={` block w-4 h-4 rounded-full`}
                    style={{ background: item.color }}
                  ></span>
                  <span>{item.colorName}</span>
                </div>

                {/* <div className="flex items-center gap-3">
                  <Select
                    value={item.selectedColor}
                    onChange={(value) => {
                      const newColor = item.colors.find(
                        (c) => c.colorCode === value
                      );
                      handleColorChange(
                        item._id,
                        value,
                        newColor.colorName,
                        newColor.images[0],
                        newColor._id
                      );
                    }}
                    style={{ width: isMobile ? 100 : 300 }}
                  >
                    {item.colors.map((color) => (
                      <Option key={color._id} value={color.colorCode}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 inline-block rounded-full border"
                            style={{ backgroundColor: color.colorCode }}
                          ></span>
                          {color.colorName}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div> */}
              </div>
            </div>

            <div className="text-right flex flex-col gap-3">
              <span
                onClick={() => handleRemoveFromCart(item?.id, item?.colorId)}
                className="flex justify-end w-full cursor-pointer"
              >
                <IoCloseSharp />
              </span>
              <p className="font-semibold">{item?.price?.toLocaleString()}đ</p>
              <div className="flex items-center">
                <Button onClick={() => handleDecrease(item?.id, item?.colorId)}>
                  -
                </Button>
                <span className="px-3">{item.quantity}</span>
                <Button onClick={() => handleIncrease(item?.id, item?.colorId)}>
                  +
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Tổng tiền */}
        <div className="flex justify-between py-2 font-semibold">
          <p>Tạm tính ({cartItems.length} sản phẩm):</p>
          <p>
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString()}
            đ
          </p>
        </div>

        {/* Form thông tin khách hàng */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.username,
            gender: "Anh",
            deliveryMethod: "Giao tận nơi",
          }}
          onFinish={handleSubmit}
        >
          <p className="font-semibold">Thông tin khách hàng</p>
          <Form.Item name="gender" className="my-2">
            <Radio.Group>
              <Radio value="Anh">Anh</Radio>
              <Radio value="Chị">Chị</Radio>
            </Radio.Group>
          </Form.Item>
          <div className="flex gap-2 w-full">
            <Form.Item
              className="w-full"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Họ và Tên" />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </div>

          {/* Chọn hình thức nhận hàng */}
          <p className="font-semibold">Chọn hình thức nhận hàng</p>
          <Form.Item name="deliveryMethod" className="my-2">
            <Radio.Group
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              <Radio value="Giao tận nơi">Giao tận nơi</Radio>
              <Radio value="Nhận tại cửa hàng">Nhận tại cửa hàng</Radio>
            </Radio.Group>
          </Form.Item>

          {deliveryMethod === "Giao tận nơi" ? (
            <>
              <Form.Item
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
                ]}
              >
                <Select
                  placeholder="Chọn Tỉnh / Thành phố"
                  onChange={handleProvinceChange}
                >
                  {provinces.map((province) => (
                    <Option key={province.code} value={province.code}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện" },
                ]}
              >
                <Select
                  placeholder="Chọn Quận / Huyện"
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                >
                  {districts.map((district) => (
                    <Option key={district.code} value={district.code}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ward"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select
                  placeholder="Chọn Phường / Xã"
                  onChange={handleWardChange}
                  disabled={!selectedDistrict}
                >
                  {wards.map((ward) => (
                    <Option key={ward.code} value={ward.name}>
                      {ward.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="note">
                <Input placeholder="Số nhà, tên đường" />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="store">
              <Select>
                <Option value="Chọn cửa hàng">Chọn cửa hàng</Option>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
              </Select>
            </Form.Item>
          )}

          {/* Nhập ghi chú */}
          <p className="font-semibold">Nhập ghi chú (nếu có)</p>
          <Form.Item name="notes" className="flex flex-col gap-2">
            <Checkbox.Group>
              <Checkbox value="callCustomer">
                Gọi nguồn khách nhận hàng
              </Checkbox>
              <Checkbox value="guide">
                Hướng dẫn sử dụng, giải đáp thắc mắc sản phẩm
              </Checkbox>
              <Checkbox value="invoice">Xuất hóa đơn công ty</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={cartItems?.length === 0}
            >
              Đặt hàng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Cart;
