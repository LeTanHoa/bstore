"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useGetBlogsQuery } from "../store/features/blogs";
import Link from "next/link";

import bliphone from "../../public/blip.png";
import blmac from "../../public/blmac.png";
import blw from "../../public/blogw.png";
import blpk from "../../public/blogpk.png";
import blipad from "../../public/blogipb.png";
import blair from "../../public/blogair.png";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
const Blogs = () => {
  const [isMobile, setIsMobile] = useState(false);


  const { data: blogs } = useGetBlogsQuery();
  const [cate, setCate] = useState("iPhone");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Gọi ngay khi component mount
    window.addEventListener("resize", handleResize); // Cập nhật khi resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!blogs || blogs.length === 0) {
    return <div className="text-white text-center py-10">Đang tải...</div>;
  }

  const topThree = blogs.slice(0, 3);

  const dataCate = [
    {
      name: "iPhone",
      image: bliphone,
    },
    {
      name: "Mac",
      image: blmac,
    },
    {
      name: "iPad",
      image: blipad,
    },
    {
      name: "AirPod",
      image: blair,
    },
    {
      name: "Watch",
      image: blw,
    },
    {
      name: "Phụ kiện",
      image: blpk,
    },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <CustomNextArrow />, // Sử dụng custom next button
    prevArrow: <CustomPrevArrow />,
  };

  const filterCate = blogs.filter((item) => item.category === cate);

  return (
    <div className="bg-[#3e3e3f]">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-24 w-full flex flex-col px-3 md:px-0 gap-5">
          {isMobile ? (
            <Slider {...settings}>
              {topThree.map((item) => (
                <div
                  key={item._id}
                  className="relative m-1 h-full overflow-hidden rounded-2xl"
                >
                  <Image
                    src={`https://api-bstore-no35.vercel.app/uploads/${item?.image}`}
                    alt=""
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    priority
                  />

                  <div className="absolute bottom-0  flex items-center justify-center w-full h-28 bg-gradient-to-t from-black to-transparent">
                    <Link href={`/blogs/${item?._id}`}>
                      <span className="text-white px-4 line-clamp-2 text-[20px] md:text-[30px]">
                        {item?.title}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="w-full gap-2 flex">
              {/* Cột trái */}
              <div className="w-8/12">
                <div className="relative h-full overflow-hidden rounded-l-2xl">
                  <Image
                    src={`https://api-bstore-no35.vercel.app/uploads/${topThree[0]?.image}`}
                    alt=""
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    priority
                  />

                  <div className="absolute bottom-0  flex items-center justify-center w-full h-28 bg-gradient-to-t from-black to-transparent">
                    <Link href={`/blogs/${topThree[0]?._id}`}>
                      <span className="text-white px-4 line-clamp-2 text-[30px]">
                        {topThree[0]?.title}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="w-4/12 flex flex-col gap-2">
                {topThree.slice(1).map((item, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden ${
                      index === 0 ? "rounded-tr-2xl" : "rounded-br-2xl"
                    }`}
                  >
                    <Image
                      src={`https://api-bstore-no35.vercel.app/uploads/${item?.image}`}
                      alt=""
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      priority
                    />
                    <div className="absolute bottom-0  flex items-center justify-center w-full h-20 bg-gradient-to-t from-black to-transparent">
                      <Link href={`/blogs/${item?._id}`}>
                        <span className="text-white px-4 line-clamp-2 text-[20px]">
                          {item.title}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex w-full overflow-x-auto md:grid md:grid-cols-6 gap-5">
              {dataCate?.map((item, id) => (
                <div
                  key={id}
                  onClick={() => setCate(item.name)}
                  className={`flex min-w-[120px] md:w-auto shadow-xl justify-center items-center gap-2 ${
                    item.name === cate ? "bg-black" : "bg-[#2c2c2c]"
                  } rounded-lg cursor-pointer p-2`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-[50px] md:w-[70px]"
                    width={100}
                    height={100}
                  />
                  <span className="text-white text-[16px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div>
              {filterCate?.length === 0 ? (
                <span className="text-white">Chưa có thông tin hiển thị !</span>
              ) : (
                <div className="flex flex-col gap-4">
                  {filterCate?.map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="w-full md:w-[700px] gap-3 flex flex-col "
                      >
                        <div className="rounded-xl  flex w-full gap-3 md:gap-0">
                          <div className="w-5/12 ">
                            <Image
                              src={`https://api-bstore-no35.vercel.app/uploads/${item.image}`}
                              alt=""
                              className=" w-full rounded-xl  object-cover"
                              width={100}
                              height={100}
                            />
                          </div>
                          <div className="w-7/12 flex flex-col justify-between p-0 md:p-3">
                            <Link href={`/blogs/${item?._id}`}>
                              <span className="line-clamp-2 text-[16px] md:text-[20px] text-white">
                                {item.title}
                              </span>
                            </Link>
                            <span className="text-white text-[14px]">
                              {" "}
                              <span suppressHydrationWarning>
                                {new Date(item.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </span>
                          </div>
                        </div>
                        <hr />
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
  );
};
export default Blogs;
