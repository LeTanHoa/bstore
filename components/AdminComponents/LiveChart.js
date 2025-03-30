"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsData from "highcharts/modules/data";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import { useGetOrdersQuery } from "@/app/store/features/orders"; // Import query từ Redux Toolkit

export default function LiveChart({ currentYear }) {
  const chartRef = useRef(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [enablePolling, setEnablePolling] = useState(false);
  const [pollingTime, setPollingTime] = useState(2);
  const { data: orders, isLoading, refetch } = useGetOrdersQuery();
  const [isMobile, setIsMobile] = useState(false);

  const filterOrder = useMemo(
    () =>
      orders?.filter(
        (item) =>
          item?.statusPayment === "Đã thanh toán" &&
          item?.deliveryStatus === "Hoàn thành" &&
          item?.orderSuccess === true
      ),
    [orders]
  );

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const calculateMonthlyRevenue = (data) => {
    const monthlyRevenue = Array(12).fill(0);
    data?.forEach((order) => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const price = parseFloat(order.totalPrice) || 0;
        monthlyRevenue[month] += price;
      }
    });
    return monthlyRevenue;
  };
  useEffect(() => {
    if (!orders) return; // Prevent running when orders is undefined
    setMonthlyRevenue(calculateMonthlyRevenue(filterOrder));
  }, [currentYear, orders, filterOrder]);

  const chartOptions = {
    chart: {
      type: "areaspline",
    },
    title: {
      text: `Doanh thu theo tháng trong năm ${currentYear}`,
    },
    xAxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      title: {
        text: "Tháng",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Doanh thu (VND)",
      },
      labels: {
        formatter: function () {
          return (this.value / 1000000).toFixed(2) + "M"; // Hiển thị đơn vị triệu
        },
      },
    },
    series: [
      {
        name: "Doanh thu",
        data: monthlyRevenue,
        color: "#32CD32",
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#32CD32"],
            [1, "#32CD3200"],
          ],
        },
        threshold: null,
        marker: {
          lineWidth: 1,
          lineColor: null,
          fillColor: "white",
        },
      },
    ],
    accessibility: {
      announceNewData: {
        enabled: false,
      },
    },
    plotOptions: {
      areaspline: {
        marker: {
          enabled: false, // Tắt marker để biểu đồ mượt mà hơn
        },
      },
    },
    credits: {
      enabled: false, // Tắt watermark Highcharts
    },
  };

  // Cập nhật dữ liệu khi nhận được từ API
  useEffect(() => {
    if (!isLoading && orders) {
      const filteredOrders = orders.filter(
        (item) =>
          item?.statusPayment === "Đã thanh toán" &&
          item?.deliveryStatus === "Hoàn thành" &&
          item?.orderSuccess === true
      );
      const newMonthlyRevenue = calculateMonthlyRevenue(filteredOrders);
      setMonthlyRevenue(newMonthlyRevenue);
      if (chartRef.current) {
        chartRef.current.chart.series[0].setData(newMonthlyRevenue);
      }
    }
  }, [orders, isLoading]);

  // Cập nhật dữ liệu theo thời gian thực khi bật polling
  useEffect(() => {
    let interval;
    if (enablePolling) {
      interval = setInterval(() => {
        refetch(); // Gọi lại API để lấy dữ liệu mới
      }, pollingTime * 1000);
    }
    return () => clearInterval(interval);
  }, [enablePolling, pollingTime, refetch]);

  // Hiển thị loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* <div>
        <label>
          Enable Polling:
          <input
            type="checkbox"
            checked={enablePolling}
            onChange={(e) => setEnablePolling(e.target.checked)}
          />
        </label>
        <label className="ml-4">
          Polling Time (seconds):
          <input
            type="number"
            value={pollingTime}
            onChange={(e) => setPollingTime(Math.max(1, e.target.value))}
            min="1"
            className="ml-2 p-1 border"
          />
        </label>
      </div> */}
      <div
        // className={` ${
        //   isMobile ? "w-full overscroll-x-auto " : ""
        // } `}
        className="min-w-[360px] max-w-[800px]"
        style={{ margin: "1em auto" }}
      >
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    </div>
  );
}
