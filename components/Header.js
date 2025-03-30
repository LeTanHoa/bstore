"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoBagOutline, IoSearch, IoMenu } from "react-icons/io5"; // Thêm IoMenu
import { FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { Avatar, message, Dropdown, Space } from "antd";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import logo from "./../public/logotrang.png";
import Image from "next/image";
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State cho menu mobile
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const router = useRouter();
  const { user, loading, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const items = [
    {
      label: "Thông tin cá nhân",
      key: "0",
      onClick: () => router.push("/profile"),
    },
    user?.role === "admin" && {
      label: "Hệ thống quản lý",
      key: "1",
      onClick: () => router.push("/admin"),
    },
    {
      label: "Hóa đơn của tôi",
      key: "2",
      onClick: () => router.push("/mybill"),
    },
    {
      label: "Đăng xuất",
      key: "3",
      onClick: () => {
        logout();
        message.success("Đăng xuất thành công!");
        router.push("/login");
      },
    },
  ].filter(Boolean);

  const dataPath = [
    { name: "iPhone", path: "iphone" },
    { name: "Mac", path: "mac" },
    { name: "iPad", path: "ipad" },
    { name: "Watch", path: "watch" },
    { name: "Tai nghe, loa", path: "airpod" },
    { name: "Phụ kiện", path: "phukien" },
  ];

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?key=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {!isAdminRoute && (
        <div className="bg-black w-full h-[70px] sm:h-[75px] fixed top-0 left-0 right-0 z-50 shadow-2xl">
          <div className="h-full flex items-center max-w-screen-sm md:max-w-screen-xl mx-auto px-2  overflow-hidden">
            {/* Logo */}
            <div className="w-3/12 sm:w-2/12">
              <Link href="/home" className="  cursor-pointer">
                <Image src={logo} alt="" width={80} height={80} />
              </Link>
            </div>

            {/* Navigation - Ẩn trên mobile, hiển thị trên desktop */}
            <div className="hidden md:flex md:w-8/12 justify-center text-white items-center gap-4 sm:gap-5">
              <Link href="/home">Trang chủ</Link>
              {dataPath.map((item, idx) => (
                <Link key={idx} href={`/category/${item.path}`}>
                  {item.name}
                </Link>
              ))}
              <Link href="/blogs">Tin tức</Link>
            </div>

            {/* Icons */}
            <div className="flex w-9/12 md:w-2/12 text-white justify-end items-center gap-4 sm:gap-6 md:gap-8">
              {/* Icon Menu - Hiển thị trên mobile */}
              <IoMenu
                className="text-[20px] sm:text-[23px] cursor-pointer md:hidden"
                onClick={() => setIsMenuOpen(true)}
              />
              <IoSearch
                className="text-[20px] sm:text-[23px] cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
              <div className="relative">
                <IoBagOutline
                  onClick={() => router.push("/cart")}
                  className="text-[20px] sm:text-[23px] cursor-pointer"
                />
                <span className="absolute -top-1 -right-1 text-white bg-red-500 rounded-full w-3 h-3 sm:w-4 sm:h-4 text-[10px] sm:text-[12px] flex items-center justify-center">
                  {cartItems.length}
                </span>
              </div>
              {user ? (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar className="bg-slate-400 cursor-pointer">
                        <span className="uppercase font-bold text-[16px] sm:text-[20px]">
                          {user?.username?.charAt(0)}
                        </span>
                      </Avatar>
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <FiUser className="text-[20px] sm:text-[23px]" />
              )}
            </div>
          </div>

          {/* Mobile Menu - Hiển thị khi nhấp vào icon menu */}
          {isMenuOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className="text-white flex flex-col text-center space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href="/home" onClick={() => setIsMenuOpen(false)}>
                  Trang chủ
                </Link>
                {dataPath.map((item, idx) => (
                  <div key={idx}>
                    <Link
                      href={`/category/${item.path}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                <Link href="/blogs" onClick={() => setIsMenuOpen(false)}>
                  Tin tức
                </Link>
              </div>
              <IoCloseSharp
                className="absolute top-4 right-4 text-white text-[24px] cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          )}

          {/* Search Overlay */}
          {isSearchOpen && (
            <div
              className="fixed top-0 left-0 z-50 right-0 bottom-0 pt-2 bg-black bg-opacity-90 flex items-start justify-center"
              onClick={() => setIsSearchOpen(false)}
            >
              <div className="flex items-center w-full max-w-[90%] sm:max-w-xl px-4">
                <IoMdSearch className="text-white text-[20px] sm:text-[23px]" />
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full bg-black text-white p-2 sm:p-3 text-base sm:text-lg rounded-lg border-none focus:outline-none"
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <IoCloseSharp
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white text-[20px] sm:text-[23px] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
