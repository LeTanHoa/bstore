"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="w-screen mx-auto flex">
      <div className={`w-2/12 ${isMobile ? "bg-[#3f3f40] flex  w-full justify-center" : ""}`}>
        <AdminLayout />
      </div>
      <div className="flex  bg-[#3f3f40] flex-col w-10/12">
        <div className="p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
