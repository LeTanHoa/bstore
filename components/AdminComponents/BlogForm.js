"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Ckeditor5 from "../Ckeditor5";

const { Option } = Select;

const BlogForm = ({ initialValues = {}, onSubmit, formId }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState(initialValues.title || "");
  const [content, setContent] = useState(initialValues.content || "");
  const [category, setCategory] = useState(initialValues.category || null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setTitle(initialValues.title || "");
    setContent(initialValues.content || "");
    setCategory(initialValues.category || null);
    setImage(null); // Không load ảnh cũ, chỉ cập nhật khi chọn mới
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  const handleUpload = (file) => {
    setImage(file);
    return false; // Ngăn upload tự động
  };

  const handleSubmit = () => {
    if (!title || !category) {
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleSubmit} id={formId}>
        <Form.Item label="Tiêu đề" required>
          <Input
            placeholder="Nhập tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Loại sản phẩm" required>
          <Select
            placeholder="Chọn loại sản phẩm"
            value={category}
            onChange={(value) => setCategory(value)}
          >
            <Option value="iPhone">iPhone</Option>
            <Option value="iPod">iPod</Option>
            <Option value="iPad">iPad</Option>
            <Option value="Mac">Mac Book</Option>
            <Option value="Watch">Loa, Tai nghe</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            accept="image/*"
            listType="picture"
            maxCount={1}
            beforeUpload={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Nội dung">
          <Ckeditor5 onChange={setContent} initialValue={content} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogForm;
