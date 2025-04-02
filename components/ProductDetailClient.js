"use client";
import React, { useState, use, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";
import { IoMdSwap } from "react-icons/io";
import { FaShippingFast } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import {
  Tabs,
  Flex,
  Progress,
  Input,
  Pagination,
  Button,
  Spin,
  Avatar,
} from "antd";
import sad from "./../public/sad.jpg";
import { toast } from "react-toastify";
import { MdOutlineSecurity } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { RiHome9Line } from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Modal, Rate } from "antd";

import Link from "next/link";
import CardProduct from "./CardProduct";
import { useGetOrdersQuery } from "@/app/store/features/orders";
import {
  useAddReviewMutation,
  useGetReviewsQuery,
} from "@/app/store/features/reviews";
import { useGetBlogsQuery } from "@/app/store/features/blogs";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/app/store/features/products";
import { useUser } from "@/hook/useUser";
import { addToCart } from "@/app/store/slices/cartSlice";
const { TextArea } = Input;
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] text-white p-3 rounded-full shadow-lg z-50 hover:bg-[#323232]"
  >
    <FaChevronLeft className="text-[20px]" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] text-white p-3 rounded-full shadow-lg z-50 hover:bg-[#323232]"
  >
    <FaChevronRight className="text-[20px]" />
  </button>
);

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Nếu đã là URL Cloudinary đầy đủ
  if (imageUrl.startsWith('https://res.cloudinary.com/')) {
    return imageUrl;
  }
  
  // Nếu là ID của ảnh trên Cloudinary, tạo URL đầy đủ
  try {
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dahm7mli8/image/upload/';
    // Loại bỏ các ký tự "/" ở đầu nếu có
    const cleanImagePath = imageUrl.replace(/^\/+/, '');
    return `${cloudinaryBaseUrl}${cleanImagePath}`;
  } catch (error) {
    console.error('Error processing Cloudinary URL:', error, imageUrl);
    return null;
  }
};

const ProductDetailClient = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = use(params);
  const itemsPerPage = 5;
  const { user, loading, logout } = useUser();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [more, setMore] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const { data: products } = useGetProductsQuery();
  const { data: blogs } = useGetBlogsQuery();
  const { data: reviews } = useGetReviewsQuery();
  const { data: orders } = useGetOrdersQuery();
  const [addReview] = useAddReviewMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const filterBlogs = blogs?.filter(
    (item) => item?.category === product?.productType
  );
  const filterOrder = orders?.filter(
    (item) =>
      item?.user?.id === user?.id &&
      item?.statusPayment === "Đã thanh toán" &&
      item?.deliveryStatus === "Hoàn thành"
  );

  const exists = filterOrder?.some((order) =>
    order.cartItems?.some((it) => it?.id === id)
  );

  const userProductReviews = reviews?.filter((item) => item?.productId === id);

  const handleAddToCart = (id, name, price, colorInfo) => {
    if (!colorInfo) {
      toast.error("Vui lòng chọn màu sắc!");
      return;
    }

    dispatch(
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        color: colorInfo.colorCode,
        colorName: colorInfo.colorName,
        image: colorInfo.images[0],
        colorId: colorInfo._id,
        product,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleBeforeChange = (oldIndex, newIndex) => {
    setIsScrolled(newIndex > 0);
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Gọi ngay khi component mount
    window.addEventListener("resize", handleResize); // Cập nhật khi resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    beforeChange: handleBeforeChange,
  };
  const settingsProduct = {
    dots: false,
    infinite: false, // Ngăn lỗi khi chỉ có 1 phần tử
    speed: 500,
    slidesToShow: products?.length > 1 && !isMobile ? 4.3 : 1.25, // Nếu chỉ có 1 item thì chỉ hiển thị 1
    slidesToScroll: 1,
    adaptiveHeight: false, // Không cho phép thay đổi chiều cao
    nextArrow: <CustomNextArrow />, // Sử dụng custom next button
    prevArrow: <CustomPrevArrow />, // Sử dụng custom prev button
  };

  const shuffledData = Array.isArray(products) ? [...products] : [];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const filterReview =
    selectedRating === null
      ? userProductReviews
      : userProductReviews.filter((review) => review.rating === selectedRating);

  const totalReviews = filterReview?.length; // Tổng số đánh giá
  const averageRating =
    totalReviews > 0
      ? filterReview?.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      : 0;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => filterReview?.filter((review) => review.rating === star).length
  );

  const ratingPercentages = ratingCounts.map((count) =>
    totalReviews > 0 ? parseFloat(((count / totalReviews) * 100).toFixed(1)) : 0
  );

  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán index để cắt mảng
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = filterReview?.slice(startIndex, endIndex);

  const dataShuff = shuffleArray(shuffledData);

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      return;
    }

    try {
      const newOrder = {
        comment,
        rating,
        productId: id,
        user,
      };

      await addReview(newOrder).unwrap();
      toast.success("Đánh giá đã được gửi");
      setComment("");
      setRating(0);
      handleCancel();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };

  const featurePolly = [
    {
      icon: <MdOutlineSecurity size={40} />,
      title: "Thương hiệu đảm bảo",
      description: "Nhập khẩu, bảo hành chính hãng",
    },
    {
      icon: <FaShippingFast size={40} />,
      title: "Đổi trả dễ dàng",
      description: "Theo chính sách đổi trả tại Shop",
    },
    {
      icon: <FaProductHunt size={40} />,
      title: "Sản phẩm chất lượng",
      description: "Đảm bảo tương thích và độ bền cao",
    },
    {
      icon: <RiHome9Line size={40} />,
      title: "Giao hàng tận nơi",
      description: "Tại 63 tỉnh thành",
    },
  ];
  const filterProduct = products?.filter(
    (item) => item._id !== id && item?.productType === product?.productType
  );

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product?.colors[0]?.images[0]) {
      const imageUrl = getValidImageUrl(product.colors[0].images[0]);
      setSelectedImage(imageUrl);
    }
  }, [product]);

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center text-[14px] md:text-[18px] font-bold justify-center ">
          Thông tin sản phẩm
        </div>
      ),
      children: (
        <div className="bg-white p-4 rounded-xl w-full h-full">
          <div className="flex gap-3 flex-col">
            <span className="font-bold text-[18px] md:text-[24px]">
              Thông tin sản phẩm
            </span>
            <div className="flex flex-col md:flex-row gap-5 md:gap-0">
              <div className=" w-full md:w-1/2  border-r-0 md:border-r-2 md:border-gray-100 pr-4">
                <div className="w-full">
                  <span className="font-bold text-[16px] md:text-[18px]">
                    Mô tả sản phẩm
                  </span>
                  <p
                    className={` ${
                      more ? "line-clamp-6" : ""
                    } w-full text-justify`}
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></p>
                  <div className=" w-full flex ">
                    <span
                      onClick={() => setMore(!more)}
                      className="font-bold border border-gray-200 w-max px-3 py-1 rounded-lg   block mt-5 cursor-pointer"
                    >
                      {more ? "Đọc thêm" : "Rút gọn"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="pl-0 md:pl-5 w-full">
                  <span className="font-bold text-[18px]">
                    Bài viết liên quan
                  </span>
                  <div>
                    {filterBlogs?.length === 0 ? (
                      <span> Không có bài viết nào</span>
                    ) : (
                      <div className="grid grid-cols-2 mt-2 gap-3">
                        {filterBlogs?.map((item) => {
                          return (
                            <div
                              key={item._id}
                              className="flex  gap-1 h-[100px] rounded-xl border overflow-hidden border-gray-200 "
                            >
                              <Image
                                className=" w-1/2 object-cover"
                                src={`${item?.image}`}
                                alt=""
                                width={100}
                                height={100}
                              />
                              <div className="w-1/2 flex flex-col justify-between">
                                <Link href={`/blogs/${item?._id}`}>
                                  <span className="p-1  line-clamp-3 text-[12px]">
                                    {item?.title}
                                  </span>
                                </Link>
                                <span
                                  suppressHydrationWarning
                                  className="text-[10px] text-gray-400"
                                >
                                  {new Date(item?.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center text-[14px] md:text-[18px] justify-center font-bold w-full">
          So sánh sản phẩm
        </div>
      ),
      children: (
        <div className=" slide-product flex flex-col gap-5 h-[800px] overflow-y-scroll overflow-x-hidden bg-white w-full p-4 rounded-xl">
          <span className="font-bold text-[18px] md:text-[22px]">
            So sánh sản phẩm tương tự
          </span>
          <div className="flex ">
            <div
              style={{
                boxShadow: isScrolled
                  ? "rgba(0, 0, 0, 0.1) 10px 0px 6px -5px"
                  : "",
              }}
              className={`flex flex-col z-30 w-[150px]  md:w-[260px] pt-4  pl-4 h-full`}
            >
              <div className="flex flex-col">
                <Image
                  width={100}
                  height={100}
                  src={`${product?.colors[0]?.images[0]}`}
                  alt=""
                />
                <span className="mt-3 line-clamp-1">{product?.name || ""}</span>
                <span className="font-bold mt-10 text-[18px]">
                  {product?.price || ""}
                </span>
                <div className="w-full flex my-3">
                  <span className="border border-gray-500 rounded-md  px-2  block">
                    Đang xem
                  </span>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-4">
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span className="line-clamp-2">
                    {product?.description || ""}
                  </span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Mô tả sản phẩm
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.chip || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Chip
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.ram || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    RAM
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.storage || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Bộ nhớ
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.display || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Màn hình
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.battery || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Pin
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.camera || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Camera
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span>{product?.os || "không được trang bị"}</span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    OS
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span className="line-clamp-1">
                    {product?.colors
                      ?.map((color) => color.colorName)
                      .join(", ") || "không được trang bị"}
                  </span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    Màu sắc
                  </span>
                </div>
                <div className="relative border-t-2 py-3 border-t-gray-300">
                  <span className="line-clamp-1">
                    {product?.capacities.join(", ") || "không được trang bị"}
                  </span>
                  <span className="absolute -top-3 left-0 bg-white pr-5 font-bold">
                    {product?.productType === "Phụ kiện"
                      ? "Kích thước"
                      : "Dung lượng"}
                  </span>
                </div>
              </div>
            </div>
            <div className=" w-[calc(100%-150px)] md:w-[calc(100%-260px)]">
              <Slider
                {...settings}
                className="w-full"
                beforeChange={handleBeforeChange}
              >
                {filterProduct?.map((item, index) => {
                  return (
                    <div
                      key={item._id}
                      className={` ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } flex  flex-col w-[180px] md:w-[260px] pt-4 h-max`}
                    >
                      <div className="flex pl-5 flex-col">
                        <Image
                          width={100}
                          height={100}
                          src={`${item?.colors?.[0]?.images?.[0]}`}
                          alt=""
                        />
                        <span
                          onClick={() => router.push(`/product/${item?._id}`)}
                          className=" line-clamp-1 cursor-pointer mt-3"
                        >
                          {item?.name}
                        </span>
                        <span className="font-bold mt-10 text-[18px]">
                          {item?.price}
                        </span>
                        <div className="w-full flex my-3">
                          <span className="border border-gray-500 rounded-md  px-2  block">
                            {" "}
                            So sánh chi tiết
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-col gap-4">
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="line-clamp-2 pl-5">
                            {product?.description}
                          </span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.chip || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.ram || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.storage || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.display || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.battery || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 ">{item?.camera || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5  ">{item?.os || ""}</span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 line-clamp-1">
                            {item?.colors
                              ?.map((color) => color.colorName)
                              .join(", ")}
                          </span>
                        </div>
                        <div className="relative border-t-2 py-3 border-t-gray-300">
                          <span className="pl-5 line-clamp-1">
                            {item?.capacities.join(", ") || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (isLoading)
    return (
      <div className="min-h-screen flex w-full h-full items-center justify-center">
        <Spin />
      </div>
    );
  if (!product) return <p>Không tìm thấy sản phẩm</p>;
  return (
    <div className="min-h-screen">
      <div className="mt-28 max-w-screen-xl px-3 md:px-0 gap-5 flex flex-col mx-auto">
        <div className="flex items-center gap-5">
          <IoChevronBackOutline
            onClick={() => router.back()}
            className="text-[24px] cursor-pointer"
          />
          <span className="font-bold text-[20px] md:text-[25px]">
            {product.name}
          </span>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 ">
          {/* Hiển thị ảnh sản phẩm */}
          <div>
            {/* Ảnh lớn */}
            <div className="border rounded-lg p-10 overflow-hidden">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover"
                  unoptimized={false}
                />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-100">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              {product.colors[selectedColorIndex].images.map((img, index) => {
                const validImageUrl = getValidImageUrl(img);
                return validImageUrl ? (
                  <Image
                    key={index}
                    src={validImageUrl}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={80}
                    height={80}
                    className={`cursor-pointer p-1 border rounded-lg ${
                      selectedImage === validImageUrl ? "border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(validImageUrl)}
                  />
                ) : null;
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-[30px]">{product.name}</h1>
            <span className="text-red-500 font-bold text-[23px]">
              {product.price} VNĐ
            </span>
            <p>Dung lượng: {product.capacities}</p>
            <span className="">Danh mục: {product.productType}</span>
            <span className="flex items-center gap-2">
              Số lượng: {product.stock > 0 ? product.stock : "Hết hàng"}
            </span>
            <div className="flex items-center gap-3">
              <h3 className="">Màu sắc:</h3>
              <div className="flex gap-3 ">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedImage(color.images[0]); // Cập nhật ảnh lớn
                    }}
                    className={`p-1 rounded-md border  ${
                      selectedColorIndex === index
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300"
                    }`}
                  >
                    <span
                      className="w-6 h-6 block shadow-xl border border-gray-100 rounded-full"
                      style={{ backgroundColor: color.colorCode }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              <button
                onClick={() => {
                  handleAddToCart(
                    product?._id,
                    product?.name,
                    product?.price,
                    product.colors[selectedColorIndex]
                  );
                  router.push("/cart");
                }}
                className="w-full md:w-1/2 px-5 py-5 bg-red-500 text-white rounded-md"
              >
                Mua ngay với giá {product.price} VNĐ
              </button>
              <button
                onClick={() =>
                  handleAddToCart(
                    product?._id,
                    product?.name,
                    product?.price,
                    product.colors[selectedColorIndex]
                  )
                }
                className="w-full md:w-1/2 px-5 flex items-center justify-center gap-3 py-5 bg-blue-500 text-white rounded-md"
              >
                Thêm vào giỏ <IoBagOutline />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                <IoMdSwap className="text-[22px]" /> Hư gì đổi nấy 12 tháng tại
                3047 siêu thị trên toàn quốc
              </span>
              <span className="flex items-center gap-3">
                <FaShippingFast className="text-[22px]" /> Giao hàng nhanh toàn
                quốc
              </span>
              <span className="flex items-center gap-3">
                <BsTelephone className="text-[22px]" /> Tổng đài: 0384316021
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 px-3 md:px-0 flex flex-col gap-5 mt-10 h-full pb-5 ">
        <div className="max-w-screen-xl w-full mx-auto ">
          <div className="w-full flex justify-between">
            <div className="flex justify-between w-full ">
              <Tabs defaultActiveKey="1" className="w-full" items={items} />
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl rounded-xl p-5 pb-10 w-full bg-white  mx-auto ">
          <div className="flex text-[18px] md:text-[24px]  font-bold ">
            Khách hàng nói gì về sản phẩm
          </div>
          <div className="w-full md:w-[80%] flex flex-col gap-5 ">
            <div className="flex flex-col md:flex-row gap-5 ">
              <div className=" w-full md:w-4/12 justify-center items-center flex flex-col gap-2">
                <span className="font-bold text-[50px]">
                  {averageRating.toFixed(1)}{" "}
                  {/* Hiển thị trung bình sao với 1 số thập phân */}
                </span>
                <span>{totalReviews} lượt đánh giá</span>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-[25px] ${
                        index < Math.round(averageRating)
                          ? "text-yellow-300"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  color="danger"
                  onClick={showModal}
                  className="w-full"
                  variant="solid"
                >
                  Đánh giá sản phẩm
                </Button>
                <Modal
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  centered
                  footer={false}
                >
                  {exists ? (
                    <div className="flex flex-col gap-4 items-center justify-center">
                      <span className="font-bold text-[20px]">
                        Đánh giá sản phẩm
                      </span>
                      <div>
                        <Rate
                          onChange={setRating}
                          className="text-[40px]"
                          value={rating}
                        />
                      </div>
                      <Input.TextArea
                        rows={4}
                        placeholder="Nhập đánh giá của bạn..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        key="submit"
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!comment || rating === 0}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center flex-col gap-2 justify-center">
                      <Image src={sad} alt="" width={300} height={300} />
                      <span>Gửi đánh giá không thành công!</span>
                      <p>
                        Quý khách vui lòng mua hàng để tham gia đánh giá sản
                        phẩm.
                      </p>
                      <Button
                        variant="solid"
                        onClick={handleCancel}
                        className="w-full"
                        color="danger"
                      >
                        Đã hiểu
                      </Button>
                    </div>
                  )}
                </Modal>
              </div>
              <div className="w-full md:w-8/12">
                <Flex gap="small" className="mt-5" vertical>
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    <div key={star} className="flex items-center gap-1">
                      {star} <FaStar className="text-yellow-300" />
                      <Progress
                        percent={ratingPercentages[5 - star]}
                        strokeColor="red"
                        className="ml-3"
                        size={[undefined, 15]}
                      />
                    </div>
                  ))}
                </Flex>
              </div>
            </div>
            <div className="w-full flex gap-4  flex-col-reverse md:flex-row md:justify-between">
              <span className="font-bold whitespace-nowrap text-[16px] md:text-[20px]">
                {filterReview?.length} bình luận
              </span>
              <div className="flex gap-2 items-center w-full overflow-x-auto md:overflow-x-hidden">
                <span
                  onClick={() => setSelectedRating(null)}
                  className={`px-3 py-1 gap-2 flex whitespace-nowrap items-center border ${
                    selectedRating === null
                      ? "border-red-500 text-red-500"
                      : "border-black"
                  } rounded-3xl cursor-pointer`}
                >
                  Tất cả
                </span>
                {[5, 4, 3, 2, 1].map((star) => (
                  <span
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className={`px-3 py-1 gap-2 flex items-center border ${
                      selectedRating === star
                        ? "border-red-500 text-red-500"
                        : "border-black"
                    } rounded-3xl cursor-pointer`}
                  >
                    {star} <FaStar className="text-[14px] " />
                  </span>
                ))}
              </div>
            </div>

            <hr />
            <div className="flex flex-col gap-5">
              {filterReview?.length === 0 ? (
                <span className="text-center">Chưa có bình luận nào</span>
              ) : (
                <>
                  {currentReviews?.map((review) => (
                    <div
                      key={review._id}
                      className="flex gap-4 border-b pb-2 md:pb-4"
                    >
                      <div>
                        <Avatar size={35}>
                          {review.user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-2">
                          <span className="font-semibold">
                            {review.user.username}
                          </span>
                          <span
                            suppressHydrationWarning
                            className="text-[13px] text-gray-400"
                          >
                            •{" "}
                            {new Date(review?.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar
                              key={index}
                              className={`text-[14px] ${
                                index < review.rating
                                  ? "text-yellow-300"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div>
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Phân trang */}
                  <div className="w-full flex justify-center mt-5">
                    <Pagination
                      current={currentPage}
                      total={filterReview?.length}
                      pageSize={itemsPerPage}
                      onChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="flex text-[20px] md:text-[24px] font-bold ">
            Có thể bạn quan tâm !
          </div>
          {/* <div>
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <Spin />
              </div>
            ) : (
              <Slider {...settingsProduct}>
                {dataShuff?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        name={item?.name}
                        price={item?.price}
                        id={item?._id}
                      />
                    </div>
                  );
                })}
              </Slider>
            )}
          </div> */}
        </div>
        <div className=" my-5 max-w-screen-xl w-full mx-auto ">
          <div className=" grid grid-cols-2 gap-5 md:flex md:justify-between w-full">
            {featurePolly.map((item, indx) => {
              return (
                <div key={indx}>
                  <div className="flex justify-center flex-col items-center gap-5">
                    <div className="bg-white text-red-500 shadow-xl border p-3 rounded-2xl">
                      {item.icon}
                    </div>
                    <div className="flex items-center  flex-col">
                      <div>{item.title}</div>
                      <div className="text-center">{item.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
