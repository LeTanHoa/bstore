"use client";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/hook/useUser";
import logo from "./../../public/logotrang.png";
import Image from "next/image";

const { Sider } = Layout;

const AdminLayout = () => {
  const { user, logout } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Danh sách menu
  const menuItems = [
    {
      key: "12",
      icon: <HomeOutlined />,
      label: <Link href="/home">Trang chủ</Link>,
    },
    {
      key: "1",
      icon: <BarChartOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Người dùng</Link>,
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/admin/product">Sản phẩm</Link>,
    },
    {
      key: "4",
      icon: <InfoCircleOutlined />,
      label: <Link href="/admin/blog">Tin tức</Link>,
    },
    {
      key: "5",
      icon: <DollarOutlined />,
      label: <Link href="/admin/bill">Hóa đơn</Link>,
    },
    {
      key: "6",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/sales">Flash Sale</Link>,
    },
    // {
    //   key: "7",
    //   icon: <SendOutlined />,
    //   label: <Link href="/admin/chat">Chat</Link>,
    // },

    // {
    //   key: "7",
    //   icon: <FileTextOutlined />,
    //   label: <Link href="/admin/reports">Reports</Link>,
    // },
    // {
    //   key: "8",
    //   icon: <TeamOutlined />,
    //   label: <Link href="/admin/teams">Teams</Link>,
    // },
    // {
    //   key: "9",
    //   icon: <SettingOutlined />,
    //   label: <Link href="/admin/settings">Settings</Link>,
    // },
    // {
    //   key: "10",
    //   icon: <QuestionCircleOutlined />,
    //   label: <Link href="/admin/help">Help</Link>,
    // },
    {
      key: "11",
      icon: <LogoutOutlined />,
      label: (
        <span
          onClick={() => {
            logout();
            message.success("Đăng xuất thành công!");
            router.push("/login");
          }}
        >
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <>
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{
            margin: "10px",
            position: "fixed",
            zIndex: 1000,
          }}
        />
      )}

      {/* Sidebar chính */}
      {!isMobile ? (
        <Sider
          // collapsible
          // collapsed={collapsed}
          // onCollapse={(value) => setCollapsed(value)}
          style={{
            minHeight: "100vh",
            height: "100%",
            backgroundColor: "#323232",
            color: "#fff",
          }}
          width="100%"
        >
          <div
            className="logo"
            style={{
              color: "#fff",
              textAlign: "center",
              display: "flex",
              paddingTop: "20px",
              justifyContent: "center",
              borderBottom: "1px solid #2B2F3A",
            }}
          >
            <Image
              src={logo}
              alt=""
              className="mb-5"
              width={100}
              height={100}
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            style={{
              backgroundColor: "#323232",
              color: "#fff",
              borderRight: 0,
            }}
            items={menuItems}
          />
        </Sider>
      ) : (
        // Drawer thay thế Sidebar trên Mobile
        <Drawer
          title="Admin Menu"
          placement="left"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={200}
          style={{
            backgroundColor: "#323232", // Màu xanh lá, bạn có thể thay bằng mã màu khác như #00f cho xanh dương
            color: "#fff !important", // Giữ màu trắng cho chữ
          }}
        >
          <Menu
            style={{
              backgroundColor: "#323232", // Đồng bộ màu xanh với Drawer
              color: "#fff !important", // Giữ màu trắng cho chữ
            }}
            itemStyle={{
              color: "#fff !important", // Màu chữ trắng cho các mục
            }}
            selectedKeys={[]} // Nếu cần, thêm để tránh kiểu mặc định của mục được chọn
            mode="inline"
            items={menuItems}
            onClick={() => setDrawerVisible(false)}
          />
        </Drawer>
      )}
    </>
  );
};

export default AdminLayout;
