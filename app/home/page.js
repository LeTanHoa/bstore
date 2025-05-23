"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import banner1 from "../../public/bn1.png";
import banner2 from "../../public/bn2.png";
import banner3 from "../../public/bn3.png";
import banner4 from "../../public/bn4.png";
import bannermb1 from "../../public/bgm1.png";
import bannermb2 from "../../public/bgm2.png";
import bannermb3 from "../../public/bgm3.png";
import bannermb4 from "../../public/bgm4.png";
import ipcate from "../../public/IP_Desk.png";
import ipadcate from "../../public/Ipad_Desk.png";
import mac from "../../public/Mac_Desk.png";
import watch from "../../public/Watch_Desk.png";
import airpods from "../../public/Speaker_Desk.png";
import accessories from "../../public/Phukien_Desk.png";
import Link from "next/link";
import CardProduct from "@/components/CardProduct";
import { useGetProductsQuery } from "../store/features/products";
import { Spin } from "antd";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { RiHome9Line } from "react-icons/ri";
import { Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useGetFlashSalesQuery } from "../store/features/sales";
import FlashSaleSection from "@/components/FlashSaleSection";
import { useUser } from "@/hook/useUser";
import { FaLongArrowAltUp } from "react-icons/fa";
import { usePathname } from "next/navigation";
const { Countdown } = Statistic;
import { SendOutlined, UpOutlined } from "@ant-design/icons";
import Chat from "@/components/Chat";
import { MessageOutlined } from "@ant-design/icons";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";

const deadline = Date.now() + 1000 * 60 * 3000;
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-[-0px] md:left-[-60px] top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] text-white p-3 rounded-full shadow-lg z-10 hover:bg-[#323232]"
  >
    <FaChevronLeft className="text-[20px]" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-[-0px] md:right-[-60px] top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] text-white p-3 rounded-full shadow-lg z-10 hover:bg-[#323232]"
  >
    <FaChevronRight className="text-[20px]" />
  </button>
);
const HomePage = () => {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const { user, loading, logout } = useUser();
  const { data: products, isLoading } = useGetProductsQuery();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const datasIphone = products?.filter((item) => item.productType === "iPhone");
  const datasMac = products?.filter((item) => item.productType === "Mac");
  const datasIpad = products?.filter((item) => item.productType === "iPad");
  const datasWatch = products?.filter((item) => item.productType === "Watch");
  const datasAirpods = products?.filter(
    (item) => item.productType === "Airpod"
  );
  const datasAccessories = products?.filter(
    (item) => item.productType === "Phụ kiện"
  );

  const { data: rawFlashSales } = useGetFlashSalesQuery();
  const flashSales = Array.isArray(rawFlashSales?.data)
    ? rawFlashSales?.data
    : [];

  const flashSaleProducts = flashSales?.find(
    (item) => item.status === "active"
  );

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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const settingsProduct = {
    dots: false,
    infinite: false, // Ngăn lỗi khi chỉ có 1 phần tử
    speed: 500,
    slidesToShow: products?.length > 1 ? 4.3 : 1, // Nếu chỉ có 1 item thì chỉ hiển thị 1
    slidesToScroll: 1,
    adaptiveHeight: false, // Không cho phép thay đổi chiều cao
    nextArrow: <CustomNextArrow />, // Sử dụng custom next button
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.35,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.35,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.25,
          slidesToScroll: 2,
        },
      },
    ], // Sử dụng custom prev button
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

  const categories = [
    {
      id: 1,
      name: "iPhone",
      slug: "iphone",
      img: ipcate,
    },
    {
      id: 2,
      name: "iPad",
      slug: "ipad",
      img: ipadcate,
    },
    {
      id: 3,
      name: "Mac",
      slug: "mac",
      img: mac,
    },
    {
      id: 4,
      name: "Watch",
      slug: "watch",
      img: watch,
    },
    {
      id: 5,
      name: "Airpods",
      slug: "airpod",
      img: airpods,
    },

    {
      id: 7,
      name: "Phụ kiện",
      slug: "phukien",
      img: accessories,
    },
  ];

  return (
    <div className="pb-20 bg-[#3e3e3f] mt-[70px] w-full ">
      <div className="">
        <Slider {...settings}>
          <div>
            <Image
              src={isMobile ? bannermb1 : banner1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Image
              src={isMobile ? bannermb2 : banner2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Image
              src={isMobile ? bannermb3 : banner3}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Image
              src={isMobile ? bannermb4 : banner4}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </Slider>
      </div>

      <div className="max-w-screen-sm px-3 md:px-0 md:max-w-screen-xl  mx-auto flex flex-col gap-10 mt-14 ">
        <div className=" grid grid-cols-2 gap-5 md:flex md:justify-between">
          {featurePolly.map((item, indx) => {
            return (
              <div key={indx}>
                <div className="flex justify-center flex-col items-center gap-5">
                  <div className="bg-white text-red-500 shadow-xl border p-2 md:p-3 rounded-2xl">
                    {item.icon}
                  </div>
                  <div className="flex items-center flex-col">
                    <div className="text-white">{item.title}</div>
                    <div className="text-white text-center">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full">
          <div className="grid grid-cols-2  md:grid-cols-6 gap-5 px-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                className="cursor-pointer"
                href={`/category/${category.slug}`}
              >
                <div className="flex flex-col shadow-md items-center justify-center bg-[#323232] rounded-xl h-[250px] ">
                  <Image
                    src={category.img}
                    className="w-[150px]  object-cover"
                    alt=""
                  />
                  <div className="text-white">{category.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className=" w-full rounded-xl ">
          {flashSaleProducts ? (
            <FlashSaleSection flashSaleData={flashSaleProducts} />
          ) : (
            ""
          )}
        </div>

        <div className=" w-full rounded-xl ">
          <div className="flex flex-col gap-5 w-full  ">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-orange-300 to-orange-600 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  Sản phẩm dành cho bạn
                </h2>
              </div>
            </div>

            <div className="w-full">
              {isLoading ? (
                <div className="w-full  flex items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <Slider {...settingsProduct}>
                  {products?.map((item) => {
                    return (
                      <div key={item._id} className="mx-2">
                        <CardProduct
                          image={item?.colors[0]?.images[0]}
                          color={item?.colors[0]?.colorCode}
                          colorName={item?.colors[0]?.colorName}
                          colorId={item?.colors[0]?._id}
                          name={item.name}
                          price={item.price}
                          id={item._id}
                          product={item}
                        />
                      </div>
                    );
                  })}
                </Slider>
              )}
            </div>
          </div>
        </div>

        <div className=" flex flex-col gap-10  w-full  ">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-pink-500 to-red-600 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  iPhone
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/iphone")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasIphone?.map((item) =>
                  item?.colors?.length > 0 &&
                  item.colors[0]?.images?.length > 0 ? (
                    <div key={item?._id} className="mx-2">
                      <CardProduct
                        image={item.colors[0].images[0]}
                        color={item.colors[0].colorCode}
                        colorName={item.colors[0].colorName}
                        colorId={item.colors[0]._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  ) : null
                )}
              </Slider>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                <h2 className="pl-5 text-3xl font-semibold text-white tracking-tight">
                  iPad
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/ipad")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasIpad?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        color={item?.colors[0]?.colorCode}
                        colorName={item?.colors[0]?.colorName}
                        colorId={item?.colors[0]?._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-yellow-500 to-yellow-300 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  Mac
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/mac")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasMac?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        color={item?.colors[0]?.colorCode}
                        colorName={item?.colors[0]?.colorName}
                        colorId={item?.colors[0]?._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  Watch
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/watch")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasWatch?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        color={item?.colors[0]?.colorCode}
                        colorName={item?.colors[0]?.colorName}
                        colorId={item?.colors[0]?._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  AirPod
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/airpod")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasAirpods?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        color={item?.colors[0]?.colorCode}
                        colorName={item?.colors[0]?.colorName}
                        colorId={item?.colors[0]?._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="relative w-fit">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[8px] h-8 bg-gradient-to-b from-zinc-50 to-zinc-400 rounded-full"></div>
                <h2 className="pl-5  text-3xl font-semibold text-white tracking-tight">
                  Phụ Kiện
                </h2>
              </div>
              <span
                className="text-white cursor-pointer"
                onClick={() => router.push("/category/phukien")}
              >
                Xem thêm
              </span>
            </div>
            <div>
              <Slider {...settingsProduct}>
                {datasAccessories?.map((item) => {
                  return (
                    <div key={item._id} className="mx-2">
                      <CardProduct
                        image={item?.colors[0]?.images[0]}
                        color={item?.colors[0]?.colorCode}
                        colorName={item?.colors[0]?.colorName}
                        colorId={item?.colors[0]?._id}
                        name={item.name}
                        price={item.price}
                        id={item._id}
                        product={item}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>

            <div className="fixed right-6 md:right-10 bottom-10 z-50 flex flex-col gap-5">
              <div
                onClick={() => window.scrollTo(0, 0)}
                className="w-12 md:w-16 h-12 md:h-16  flex items-center justify-center bg-blue-500 rounded-full cursor-pointer select-none"
              >
                <FaLongArrowAltUp className="text-[20px] md:text-[30px] text-white" />
              </div>
              {!isAdminRoute && user?.role === "user" && (
                <div>
                  <div
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-12 md:w-16 h-12 md:h-16 flex items-center justify-center bg-blue-500 rounded-full cursor-pointer select-none"
                  >
                    <MessageOutlined className="text-[20px] md:text-[30px] text-white" />
                  </div>
                  {isChatOpen && (
                    <div className="fixed right-2 md:right-10 overflow-hidden bottom-28 md:bottom-36 w-96 h-[500px] bg-white shadow-lg rounded-lg">
                      <Chat
                        userId={user?.id}
                        role={user?.role}
                        isChatOpen={isChatOpen}
                        setIsChatOpen={setIsChatOpen}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
