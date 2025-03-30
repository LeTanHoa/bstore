"use client";
import React from "react";
import { Table, Image, Tag } from "antd";

const TopSellingProducts = ({ products }) => {
  console.log(products);
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={`https://api-bstore-no35.vercel.app/uploads/${record.image}`}
            alt={record.name}
            width={50}
            height={50}
            className="object-cover rounded"
            preview={false}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Màu sắc",
      key: "color",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: record.color }}
          />
          <span>{record.colorName}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium">
          {new Intl.NumberFormat("vi-VN").format(price)} VND
        </span>
      ),
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
      render: (quantity) => (
        <Tag color="blue" className="text-base px-3 py-1">
          {quantity} chiếc
        </Tag>
      ),
    },
    {
      title: "Số đơn hàng",
      dataIndex: "orderCount",
      key: "orderCount",
      render: (count) => (
        <Tag color="green" className="text-base px-3 py-1">
          {count} đơn
        </Tag>
      ),
    },
    {
      title: "Doanh thu",
      key: "revenue",
      render: (record) => (
        <span className="font-medium text-red-500">
          {new Intl.NumberFormat("vi-VN").format(
            record.price * record.totalQuantity
          )}
          VND
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white shadow">
      <Table
        columns={columns}
        dataSource={products?.slice(0, 5)}
        rowKey={(record) => `${record.id}-${record.color}-${record.colorName}`}
        pagination={false}
        className="w-full"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default TopSellingProducts;
