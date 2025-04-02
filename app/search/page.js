"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../store/features/products";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Image from "next/image";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Search = () => {
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: products, isLoading } = useGetProductsQuery();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("key") || "";
  const [choose, setChoose] = useState("");
  const router = useRouter();

  const handleAddToCart = (id, name, price) => {
    dispatch(addToCart({ id, name, price, quantity: 1 }));
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };
  // Lọc sản phẩm theo searchQuery
  useEffect(() => {
    if (searchQuery) {
      const filtered = products?.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setChoose(""); // Reset filter khi tìm kiếm mới
    }
  }, [searchQuery, products]);

  // Lọc theo danh mục (nếu chọn)
  const displayProducts = choose
    ? filteredProducts.filter((item) => item.type === choose)
    : filteredProducts;

  const handleClick = (id) => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.error("ID sản phẩm không tồn tại!");
    }
  };

  return (
    <div className="bg-[#3e3e3f] min-h-screen">
      <div className="max-w-screen-xl px-3 md:px-0 flex flex-col gap-10 mx-auto py-32">
        <span className="text-white">
          Tìm thấy {displayProducts?.length} kết quả cho &quot;{searchQuery}
          &quot;
        </span>
        {/* Danh mục loại sản phẩm */}
        <div className="text-gray-300 gap-5 md:gap-10 flex flex-wrap md:flex-nowrap text-[18px]">
          {filteredProducts?.length > 0 &&
            [...new Set(filteredProducts?.map((item) => item.type))].map(
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

        {/* Hiển thị sản phẩm */}
        <div className="">
          {displayProducts?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {displayProducts?.map((item) => (
                <div
                  className="relative card-hover group z-10 bg-[#323232] w-full gap-5 justify-center rounded-xl shadow-md flex items-center flex-col h-[300px] md:h-[460px]"
                  key={item._id}
                >
                  <div className="px-4">
                    <Image
                      src={`${item?.colors[0]?.images[0]}`}
                      alt={item.name}
                      width={280}
                      height={280}
                    />
                  </div>
                  <span
                    onClick={() => handleClick(item._id)}
                    className="cursor-pointer text-white text-center line-clamp-2 px-3"
                  >
                    {item?.name}
                  </span>
                  <div className="flex items-center w-full justify-evenly">
                    <span className="text-white font-bold">
                      {item?.price} VNĐ
                    </span>
                  </div>

                  <div className="absolute top-4 left-5 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaRegHeart className="text-[22px] text-white" />
                    <HiOutlineShoppingBag
                      onClick={() =>
                        handleAddToCart(item?._id, item?.name, item?.price)
                      }
                      className="text-[22px] text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex rounded-xl py-20 text-[20px] text-white justify-center items-center w-full bg-[#323232]">
              <ul>
                Để tìm được kết quả chính xác hơn, bạn vui lòng:
                <li className="list-disc">
                  Kiểm tra lỗi chính tả của từ khóa đã nhập
                </li>
                <li className="list-disc">Thử lại bằng từ khóa khác</li>
                <li className="list-disc">
                  Thử lại bằng những từ khóa tổng quát hơn
                </li>
                <li className="list-disc">
                  Thử lại bằng những từ khóa ngắn gọn hơn
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
