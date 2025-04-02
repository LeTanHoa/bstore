"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { message } from "antd";
import { toast } from "react-toastify";
import baseUrl from "@/config/baseUrl";
import CryptoJS from "crypto-js";

// Khóa bí mật để mã hóa (nên đặt trong biến môi trường)
const SECRET_KEY = "xFH56skeZKijABEFjIBpkMJviFVJeWNulMSBpUd8SBA=";

// Hàm mã hóa dữ liệu
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Hàm giải mã dữ liệu
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decrypt error:", error);
    return null;
  }
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async (token) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      // Mã hóa dữ liệu user trước khi lưu
      localStorage.setItem("user", encryptData(response.data));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể lấy thông tin người dùng"
      );
      if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const encryptedToken = localStorage.getItem("token");
    const token = encryptedToken ? decryptData(encryptedToken) : null;

    // Thử lấy và giải mã user từ localStorage
    const encryptedUser = localStorage.getItem("user");
    if (encryptedUser) {
      try {
        const decryptedUser = decryptData(encryptedUser);
        if (decryptedUser) {
          setUser(decryptedUser);
        }
      } catch (e) {
        console.error("Error decrypting user:", e);
      }
    }

    if (token) {
      fetchUserInfo(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token, userData) => {
    // Mã hóa token và user data trước khi lưu
    localStorage.setItem("token", encryptData(token));
    document.cookie = `token=${token}; path=/`; // Cookie vẫn giữ nguyên để dễ sử dụng với API
    setLoading(true);

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", encryptData(userData));
      setLoading(false);
    } else {
      await fetchUserInfo(token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
