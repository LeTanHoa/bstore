"use client";
import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed z-50 bottom-4 left-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
      <p className="text-sm">
        Trang web này sử dụng các công nghệ như cookie để kích hoạt chức năng
        thiết yếu của trang web cũng như cho phân tích, cá nhân hóa, quảng cáo.
      </p>
      <button
        onClick={handleAccept}
        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Đồng ý
      </button>
    </div>
  );
};

export default CookieConsent;
