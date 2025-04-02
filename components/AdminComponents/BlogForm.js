"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Ckeditor5 from "../Ckeditor5";

const { Option } = Select;

const BlogForm = ({ initialValues = {}, onSubmit, formId }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState(initialValues.title || "");
  const [content, setContent] = useState(initialValues.content || "");
  const [category, setCategory] = useState(initialValues.category || null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setTitle(initialValues.title || "");
    setContent(initialValues.content || "");
    setCategory(initialValues.category || null);
    setFileList([]); // Reset file list
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleUpload = (file) => {
    // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("File phải nhỏ hơn 5MB!");
      return false;
    }
    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ chấp nhận file ảnh!");
      return false;
    }
    setFileList([file]);
    return false; // Ngăn upload tự động
  };

  const handleSubmit = () => {
    if (!title || !category) {
      message.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (fileList.length > 0) {
      formData.append("image", fileList[0]);
    }

    onSubmit(formData);
  };

  return (
    <div className="h-[400px] w-full overflow-y-scroll">
      <Form form={form} layout="vertical" onFinish={handleSubmit} id={formId}>
        <Form.Item
          label="Tiêu đề"
          required
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input
            placeholder="Nhập tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Loại sản phẩm"
          required
          rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
        >
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
            fileList={fileList}
            beforeUpload={handleUpload}
            onRemove={() => setFileList([])}
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
