"use client";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Space,
  Select,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/app/store/features/products";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "react-toastify";
import Ckeditor5 from "../Ckeditor5";

dayjs.extend(customParseFormat);
const { Option } = Select;

const ProductForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([
    { colorName: "", colorCode: "", fileList: [] },
  ]);

  const handleAddColor = () => {
    setColors([...colors, { colorName: "", colorCode: "", fileList: [] }]);
  };

  const handleRemoveColor = (index) => {
    if (colors.length === 1) {
      message.warning("Phải có ít nhất một màu sắc!");
      return;
    }
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const handleImageChange = (index, { fileList }) => {
    const newColors = [...colors];
    newColors[index].fileList = fileList.map((file) => ({
      ...file,
      existingImage:
        file.existingImage ||
        (file.status === "done" ? file.url?.split("/").pop() : null),
    }));
    setColors(newColors);
  };

  useEffect(() => {
    if (initialValues) {
      const releaseDate = initialValues.releaseDate
        ? dayjs(initialValues.releaseDate)
        : null;

      form.setFieldsValue({
        ...initialValues,
        releaseDate: releaseDate,
        description: initialValues.description || "", // Đảm bảo description được set
      });

      if (initialValues.colors) {
        const formattedColors = initialValues.colors.map((color) => ({
          colorName: color.colorName || "",
          colorCode: color.colorCode || "",
          fileList: color.images
            ? color.images.map((image, idx) => ({
                uid: `-${idx}`,
                name: `image-${idx}.jpg`,
                status: "done",
                url: `https://api-bstore-no35.vercel.app/uploads/${image}`,
                existingImage: image,
              }))
            : [],
        }));
        setColors(formattedColors);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ releaseDate: null, description: "" });
      setColors([{ colorName: "", colorCode: "", fileList: [] }]);
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      colors.forEach((color, index) => {
        formData.append(`colors[${index}][colorName]`, color.colorName || "");
        formData.append(`colors[${index}][colorCode]`, color.colorCode || "");

        color.fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append(`colors[${index}][images]`, file.originFileObj);
          } else if (file.existingImage) {
            formData.append(
              `colors[${index}][existingImages][]`,
              file.existingImage
            );
          }
        });
      });

      Object.keys(values).forEach((key) => {
        if (values[key]) {
          if (key === "releaseDate") {
            formData.append(key, values[key].toISOString());
          } else if (Array.isArray(values[key])) {
            values[key].forEach((item, idx) =>
              formData.append(`${key}[${idx}]`, item)
            );
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      let result;
      if (initialValues?._id) {
        result = await updateProduct({
          id: initialValues._id,
          formData,
        }).unwrap();
        toast.success("Cập nhật thành công!");
      } else {
        result = await addProduct(formData).unwrap();
        toast.success("Thêm mới thành công!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} name="productForm" onFinish={onFinish} layout="vertical">
      <Form.Item label="Tên sản phẩm" name="name">
        <Input />
      </Form.Item>

      {/* Thay Input.TextArea bằng CKEditor */}
      <Form.Item label="Mô tả" name="description">
        <Ckeditor5
          initialValue={initialValues?.description || ""}
          onChange={(data) => form.setFieldsValue({ description: data })}
        />
      </Form.Item>

      <Form.Item label="Giá" name="price">
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Ngày ra mắt" name="releaseDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Số lượng" name="stock">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Chip" name="chip">
          <Input />
        </Form.Item>

        <Form.Item label="RAM" name="ram">
          <Input />
        </Form.Item>

        <Form.Item label="Storage" name="storage">
          <Input />
        </Form.Item>

        <Form.Item label="Display" name="display">
          <Input />
        </Form.Item>

        <Form.Item label="Battery" name="battery">
          <Input />
        </Form.Item>

        <Form.Item label="Camera" name="camera">
          <Input />
        </Form.Item>

        <Form.Item label="OS" name="os">
          <Input />
        </Form.Item>

        <Form.Item label="Thuộc" name="type">
          <Input />
        </Form.Item>
      </div>

      <Form.Item label="Loại sản phẩm" name="productType">
        <Select placeholder="Chọn loại sản phẩm">
          <Option value="iPhone">iPhone</Option>
          <Option value="iPod">iPod</Option>
          <Option value="iPad">iPad</Option>
          <Option value="Mac">Mac Book</Option>
          <Option value="Watch">Loa, Tai nghe</Option>
          <Option value="Phụ kiện">Phụ kiện</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Dung lượng" name="capacities">
        <Select mode="tags" placeholder="VD: 64GB, 128GB, 256GB" />
      </Form.Item>

      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            position: "relative",
          }}
        >
          <Form.Item label={`Màu sắc ${index + 1}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Tên màu"
                  value={color.colorName}
                  onChange={(e) =>
                    handleColorChange(index, "colorName", e.target.value)
                  }
                />
                <Input
                  placeholder="Mã màu (HEX)"
                  value={color.colorCode}
                  onChange={(e) =>
                    handleColorChange(index, "colorCode", e.target.value)
                  }
                />
              </div>
              <Upload
                multiple
                listType="picture-card"
                beforeUpload={() => false}
                fileList={color.fileList}
                onChange={(info) => handleImageChange(index, info)}
              >
                {color.fileList.length < 5 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveColor(index)}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            Xóa
          </Button>
        </div>
      ))}

      <Button type="dashed" className="mb-3" onClick={handleAddColor}>
        Thêm Màu Sắc
      </Button>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {initialValues ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
