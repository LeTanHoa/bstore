"use client";
import React, { use, useEffect, useState } from "react";
import {
  useGetBlogByIdQuery,
  useGetBlogsQuery,
} from "@/app/store/features/blogs";
import Image from "next/image";
import { MdNavigateNext } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import Link from "next/link";

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

const BlogDetail = ({ params }) => {
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { id } = use(params);
  const { data: blog, isLoading } = useGetBlogByIdQuery(id);
  const { data: blogs } = useGetBlogsQuery();

  const filterBlogs = blogs?.filter(
    (item) => item?.category === blog?.category
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
    dots: true,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />, // Sử dụng custom next button
    prevArrow: <CustomPrevArrow />, // Sử dụng custom prev button
  };
  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);
  return (
    <div className="bg-black">
      <div className="max-w-screen-lg px-3 md:px-0 py-24 md:py-32 mx-auto ">
        <div className="flex items-center mb-5">
          <span
            onClick={() => router.push("/blogs")}
            className="text-white whitespace-nowrap md:whitespace-normal cursor-pointer"
          >
            Tin tức
          </span>
          <MdNavigateNext className="text-[24px] text-white cursor-pointer" />
          <span className="text-white">{blog?.category}</span>
          <MdNavigateNext className="text-[24px] text-white cursor-pointer" />
          <span className="text-white line-clamp-1 md:line-clamp-none ">
            {blog?.title}
          </span>
        </div>
        <span className=" text-[22px] md:text-[28px] mb-5 block text-white">
          {blog?.title}
        </span>
        <div className=" flex flex-col bg-white p-5  rounded-t-xl gap-5">
          <Image
            style={{
              borderRadius: "10px",
              objectFit: "cover",
              width: "100%",
              height: "auto",
            }}
            alt=""
            width={100}
            height={100}
            src={`https://api-bstore-no35.vercel.app/uploads/${blog?.image}`}
          />
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: blog?.content }}
          ></p>
        </div>
        <div className="bg-[#444444] rounded-b-xl ">
          <div className="">
            <span className="text-white font-bold px-5 pt-5 block text-[18px] md:text-[22px]">
              Bài viết liên quan
            </span>
            <Slider {...settings}>
              {filterBlogs?.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="bg-white mx-2 rounded-xl overflow-hidden  flex"
                  >
                    <div className=" flex flex-col w-full">
                      <div className="">
                        <Image
                          src={`https://api-bstore-no35.vercel.app/uploads/${item.image}`}
                          alt=""
                          className=" w-full   object-cover"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="flex flex-col justify-between p-3">
                        <Link href={`/blogs/${item?._id}`}>
                          <span className="line-clamp-2 text-[18px] text-black">
                            {item.title}
                          </span>
                        </Link>
                        <span className="text-black text-[14px]">
                          {" "}
                          <span suppressHydrationWarning>
                            {new Date(item.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
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
    </div>
  );
};

export default BlogDetail;
