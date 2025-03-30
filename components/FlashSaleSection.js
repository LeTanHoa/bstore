"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import CardProductSale from "./CardProductSale";
import { Statistic } from "antd";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moment from "moment";
import Countdown from "react-countdown";

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

const FlashSaleSection = ({ flashSaleData }) => {
  const { discount, startTime, endTime, products } = flashSaleData;
  // Thời gian kết thúc

  const start = moment(startTime);
  const end = moment(endTime);
  const now = moment();

  // Nếu hiện tại chưa đến startTime, hiển thị đầy đủ 48 giờ
  const deadline = now.isBefore(start)
    ? end.toDate()
    : new Date(now.valueOf() + end.diff(now));

  const renderer = ({ hours, minutes, completed }) => {
    if (completed) {
      return <span style={{ color: "red" }}>Flash Sale đã kết thúc!</span>;
    } else {
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      return (
        <span style={{ color: "white", fontSize: "22px" }}>
          {formattedHours}:{formattedMinutes}
        </span>
      );
    }
  };

  // const startDate = moment(startTime).format(" HH:mm");
  // const endDate = moment(endTime).format(" HH:mm");
  // const deadline = moment(endTime).valueOf();

  // Thời gian kết thúc

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

  return (
    <div className="w-full py-5">
      <div className="flex pt-5 px-5 w-full flex-col md:flex-row gap-5 justify-between items-center">
        <div>
          <span className="text-white font-bold text-[24px]">
            Flash Sale - Giảm {discount}% Săn Ngay
          </span>
        </div>
        <div className="flex flex-col text-white items-center">
          <span className="text-[18px]">Kết thúc trong</span>
          <span className="text-white">
            {/* <Countdown
              valueStyle={{ color: "white", fontSize: "22px" }}
              value={countdownTime}
              format="HH:mm" // Hiển thị dưới dạng giờ:phút
              onFinish={() => alert("Flash Sale đã kết thúc!")}
            /> */}
            <Countdown date={deadline} renderer={renderer} />
          </span>
        </div>
        <div className="flex flex-col text-white items-center">
          <span className="text-[18px]">Diễn ra</span>
          <span className="text-[18px] md:text-[22px] ">
            {moment(startTime).format("DD/MM/YYYY HH:mm")} -{" "}
            {moment(endTime).format("DD/MM/YYYY HH:mm")}
          </span>
        </div>
      </div>
      <div className="w-full mt-5 ">
        <Slider {...settingsProduct}>
          {products?.map((item) => {
            const discountedPrice = Math.round(
              item.price * (1 - discount / 100)
            );
            return (
              <div key={item._id} className="px-2">
                <CardProductSale
                  image={item?.colors[0]?.images[0]}
                  name={item?.name}
                  price={item?.price}
                  id={item?._id}
                  discount={discountedPrice}
                />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default FlashSaleSection;
