"use client";
import React, { use, useEffect, useState } from "react";
import { useGetProductsQuery } from "../../store/features/products";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useRouter } from "next/navigation";
const Products = ({ params }) => {
  const [dataType, setDataType] = useState([]);
  const [choose, setChoose] = useState("Tất cả");
  const { id } = use(params);
  const router = useRouter();

  const { data: products } = useGetProductsQuery();

  const removeDiacritics = (str) => {
    return str
      .normalize("NFD") // Tách dấu khỏi chữ
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/[^a-zA-Z0-9]/g, "") // Xóa ký tự đặc biệt
      .toLowerCase(); // Chuyển thành chữ thường
  };
  const filterProduct = products?.filter(
    (item) => removeDiacritics(item?.productType) === id
  );
  useEffect(() => {
    if (choose === "Tất cả") {
      setDataType(filterProduct);
    } else {
      const filterType = products?.filter(
        (item) =>
          removeDiacritics(item?.productType) === id && item?.type === choose
      );
      setDataType(filterType);
    }
  }, [choose, id, products]);

  const handleClick = (id) => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.error("ID sản phẩm không tồn tại!");
    }
  };

  return (
    <div className="bg-[#3e3e3f]">
      <div className="max-w-screen-xl flex flex-col gap-10 mx-auto px-3 md:px-0 py-32">
        <div className="text-gray-300 gap-5 md:gap-10 flex flex-wrap md:flex-nowrap text-[18px]">
          <span
            className={`${
              choose === "Tất cả" ? "pb-1 border-b-2  border-b-gray-300" : ""
            } cursor-pointer `}
            onClick={() => setChoose("Tất cả")}
          >
            Tất cả
          </span>
          {[...new Set(filterProduct?.map((item) => item.type))].map(
            (type, index) => (
              <span
                className={`${
                  choose === type ? "pb-1 border-b-2 border-b-gray-300" : ""
                } cursor-pointer`}
                onClick={() => setChoose(type)}
                key={index}
              >
                {type}
              </span>
            )
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3  gap-5">
          {dataType?.map((item) => {
            return (
              <div
                className=" relative card-hover group z-10 
               bg-[#323232] w-full gap-5 justify-center rounded-xl shadow-md flex items-center flex-col h-[300px] md:h-[460px]"
                key={item._id}
              >
                <div className="px-4">
                  <Image
                    src={`https://api-bstore-no35.vercel.app/uploads/${item?.colors[0]?.images[0]}`}
                    alt={name}
                    width={280}
                    height={280}
                  />
                </div>
                <span
                  onClick={() => handleClick(item?._id)}
                  className="cursor-pointer  text-white text-center line-clamp-2 px-3"
                >
                  {item?.name}
                </span>
                <div className="flex items-center w-full justify-evenly">
                  <span className=" text-white font-bold">
                    {item?.price} VNĐ
                  </span>
                </div>

                <div className="absolute top-4 left-5 flex  items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaRegHeart className="text-[22px]  text-white" />
                  <HiOutlineShoppingBag className="text-[22px] text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
