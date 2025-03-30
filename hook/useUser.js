"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { message } from "antd";
import { toast } from "react-toastify";
import baseUrl from "@/config/baseUrl";
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
      localStorage.setItem("user", JSON.stringify(response.data));
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
    const token = localStorage.getItem("token");
    fetchUserInfo(token);
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/`;
    setLoading(true);
    const response = await fetchUserInfo(token); // Gọi API lấy user ngay sau khi login
    if (response) {
      setUser(response); // Cập nhật user ngay lập tức
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
