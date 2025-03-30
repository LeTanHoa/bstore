"use client";
import React, { useState } from "react";
import { Card, Row, Col, Progress, Carousel } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SolidGaugeChart from "@/components/AdminComponents/SolidGaugeChart";
import LiveChart from "@/components/AdminComponents/LiveChart";
import { useGetOrdersQuery } from "../store/features/orders";
import { useGetUsersQuery } from "../store/features/users";
import TopSellingProducts from "@/components/AdminComponents/TopSellingProducts";

// Cấu hình biểu đồ Highcharts
const currentYear = new Date().getFullYear();

const Dashboard = () => {
  const { data: orders } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();
  const [selectYear, setSelectYear] = useState(currentYear);

  const filterUserCus = users?.filter((item) => item?.role === "user");
  const filterOrder = orders?.filter(
    (item) =>
      item?.statusPayment === "Đã thanh toán" &&
      item?.deliveryStatus === "Hoàn thành" &&
      item?.orderSuccess === true
  );

  const totalRevenue = filterOrder?.reduce(
    (acc, num) => acc + Number(num.totalPrice),
    0
  );
  const formattedRevenue = totalRevenue?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const filterDelivery = orders?.filter(
    (item) =>
      item?.deliveryStatus === "Đã xác nhận" &&
      item?.statusPayment === "Đã thanh toán"
  );
  function analyzeTopSellingProducts(orders) {
    // Tạo một object để theo dõi số lượng bán của mỗi sản phẩm
    const productSales = {};

    // Duyệt qua tất cả các đơn hàng
    filterOrder?.forEach((order) => {
      order.cartItems.forEach((item) => {
        const productKey = `${item.id}-${item.name}-${item.colorName}`;

        if (!productSales[productKey]) {
          productSales[productKey] = {
            id: item.id,
            name: item.name,
            color: item.color,
            colorName: item.colorName,
            price: item.price,
            image: item.image,
            totalQuantity: 0,
            orderCount: 0,
          };
        }

        productSales[productKey].totalQuantity += item.quantity;
        productSales[productKey].orderCount += 1;
      });
    });

    // Chuyển object thành array để sắp xếp
    const sortedProducts = Object.values(productSales).sort((a, b) => {
      // Sắp xếp theo tổng số lượng bán, nếu bằng nhau thì xét số đơn hàng
      if (b.totalQuantity === a.totalQuantity) {
        return b.orderCount - a.orderCount;
      }
      return b.totalQuantity - a.totalQuantity;
    });

    return {
      topProducts: sortedProducts,
      summary: sortedProducts.map((product) => ({
        name: product.name,
        colorName: product.colorName,
        totalQuantity: product.totalQuantity,
        orderCount: product.orderCount,
        revenue: product.price * product.totalQuantity,
      })),
    };
  }
  const result = analyzeTopSellingProducts(orders);
  console.log(result);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Overview Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 uppercase font-bold">Danh thu</p>
                <h3 className="text-2xl font-bold">{formattedRevenue}</h3>
              </div>
             
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 uppercase font-bold">Đặt hàng</p>
                <h3 className="text-2xl font-bold">{filterOrder?.length}</h3>
              </div>
             
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 uppercase font-bold">Người dùng</p>
                <h3 className="text-2xl font-bold">{filterUserCus?.length}</h3>
              </div>
             
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 uppercase font-bold">
                  Chờ vận chuyển
                </p>
                <h3 className="text-2xl font-bold">{filterDelivery?.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sales Analytics & Sales Target */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={16}>
          <Card className="shadow-md">
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row  justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Phân tích bán hàng</h3>
              <div>
                <span className="mr-2">Lựa chọn</span>
                <select
                  value={selectYear}
                  onChange={(e) => setSelectYear(Number(e.target.value))}
                  className="border p-1 rounded"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value={currentYear}> {currentYear}</option>
                </select>
              </div>
            </div>
            <div className="w-full overflow-x-scroll md:overflow-hidden">
              <LiveChart currentYear={selectYear} />
            </div>
            {/* <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-gray-500">Thu nhập</p>
                <h4 className="text-lg font-bold">23,262.00</h4>
                <p className="text-red-500">
                  <ArrowDownOutlined /> 0.05%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Chi phí</p>
                <h4 className="text-lg font-bold">11,135.00</h4>
                <p className="text-red-500">
                  <ArrowDownOutlined /> 0.05%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Sự cân bằng</p>
                <h4 className="text-lg font-bold">48,135.00</h4>
                <p className="text-green-500">
                  <ArrowUpOutlined /> 0.05%
                </p>
              </div>
            </div> */}
            {/* Sử dụng Highcharts thay vì Chart.js */}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-md h-full">
            <h3 className="text-xl font-bold mb-4">Mục tiêu bán hàng</h3>
            <div className="text-center">
              <SolidGaugeChart />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Selling Products & Current Offer */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={16}>
          <Card className="shadow-md">
            <h3 className="text-xl font-bold mb-4">Sản phẩm bán chạy</h3>
            <TopSellingProducts products={result?.topProducts} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-md h-full">
            <h3 className="text-xl font-bold mb-4">Ưu đãi hiện tại</h3>
            <div>
              <p>40% Discount Offer</p>
              <Progress percent={40} status="active" />
              <p className="text-gray-500 text-sm">Expire on: 05-08-...</p>
            </div>
            <div className="mt-4">
              <p>100 Taka Coupon</p>
              <Progress percent={60} status="active" />
              <p className="text-gray-500 text-sm">Expire on: 09-10-...</p>
            </div>
            <div className="mt-4">
              <p>Stock Out Sell</p>
              <Progress percent={80} status="active" strokeColor="#36d399" />
              <p className="text-gray-500 text-sm">Upcoming on: 14-09-...</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
