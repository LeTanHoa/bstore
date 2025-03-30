"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  DatePicker,
  Input,
  Button,
  Card,
  InputNumber,
  Table,
  Tag,
  Popconfirm,
  Select,
} from "antd";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetProductsQuery } from "@/app/store/features/products";
import {
  useGetFlashSalesQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} from "@/app/store/features/sales";
import HeadingAdmin from "@/components/AdminComponents/HeadingAdmin";

const { RangePicker } = DatePicker;
const { Option } = Select;

const FlashSale = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);
  const { data: products } = useGetProductsQuery();
  const { data: rawFlashSales, isLoading, error } = useGetFlashSalesQuery();
  const flashSales = Array.isArray(rawFlashSales?.data)
    ? rawFlashSales?.data
    : [];
  const [addSale] = useAddSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();

  const handleSubmit = async (values) => {
    try {
      const [startTime, endTime] = values.timeRange;
      const flashSaleData = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        products: values.products,
        discount: values.discount,
        status: values.status,
      };

      if (editingFlashSale) {
        await updateSale({
          id: editingFlashSale._id,
          sale: flashSaleData,
        }).unwrap();
        toast.success("Cập nhật flash sale thành công!");
      } else {
        await addSale(flashSaleData).unwrap();
        toast.success("Tạo flash sale thành công!");
      }

      form.resetFields();
      setEditingFlashSale(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSale(id).unwrap();
      toast.success("Xóa flash sale thành công!");
    } catch (error) {
      toast.error("Không thể xóa flash sale!");
    }
  };

  const handleEdit = (record) => {
    setEditingFlashSale(record);
    form.setFieldsValue({
      timeRange: [moment(record.startTime), moment(record.endTime)],
      products: record.products,
      discount: record.discount,
      status: record.status,
    });
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "products",
      render: (products) => <span>{products.length} sản phẩm</span>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status === "active"
            ? "Đang diễn ra"
            : status === "pending"
            ? "Sắp diễn ra"
            : "Đã kết thúc"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="py-6 h-screen ">
      <HeadingAdmin title="Quản lý Sales" />

      <Card
        title={editingFlashSale ? "Cập nhật Flash Sale" : "Tạo Flash Sale Mới"}
        className="mb-6"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="timeRange"
            label="Thời gian diễn ra"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="products"
            label="Sản phẩm áp dụng"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              className="w-full"
            >
              {products?.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="Phần trăm giảm giá"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
              className="w-full"
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="pending">
            <Select>
              <Option value="pending">Sắp diễn ra</Option>
              <Option value="active">Đang diễn ra</Option>
              <Option value="ended">Đã kết thúc</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingFlashSale ? "Cập nhật" : "Tạo Flash Sale"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Danh sách Flash Sale">
        <Table
          columns={columns}
          dataSource={flashSales}
          rowKey="_id"
          loading={loading}
          scroll={{ x: "max-content" }}
          className="w-full"
        />
      </Card>
    </div>
  );
};

export default FlashSale;
