import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { IoBagOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/store/slices/cartSlice";
import { toast } from "react-toastify";

const CardProduct = ({
  image,
  name,
  price,
  id,
  product,
  color,
  colorName,
  colorId,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        color: color || "",
        colorName: colorName || "",
        colorId: colorId || "",
        image: image || "",
        product,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product");
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.error("ID sản phẩm không tồn tại!");
    }
  };

  return (
    <div
      className={`relative card-hover group z-10 ${
        isProductPage ? "bg-white " : "bg-[#323232]"
      }  w-[280px] gap-5 justify-center rounded-xl shadow-md flex items-center flex-col h-[460px]`}
    >
      <div className="px-4">
        {image ? (
          <Image
            src={image}
            alt={name || "Product Image"}
            width={280}
            height={280}
          />
        ) : (
          <div className="w-[280px] h-[280px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <span
        onClick={handleClick}
        className={`cursor-pointer ${
          isProductPage ? "text-black" : "text-white"
        } text-center line-clamp-2 px-3`}
      >
        {name}
      </span>
      <div className="flex items-center w-full justify-evenly">
        <span
          className={`${isProductPage ? "text-black" : "text-white"} font-bold`}
        >
          {price} VNĐ
        </span>
      </div>

      <div className="absolute top-4 left-5 flex  items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaRegHeart
          className={`text-[22px] ${
            isProductPage ? "text-black" : "text-white"
          } cursor-pointer`}
        />
        <HiOutlineShoppingBag
          onClick={handleAddToCart}
          className={`text-[22px] ${
            isProductPage ? "text-black" : "text-white"
          } cursor-pointer`}
        />
      </div>
    </div>
  );
};

export default CardProduct;
