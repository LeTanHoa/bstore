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
import Image from "next/image";
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
  // Khởi tạo state colors đơn giản hơn
  const [colors, setColors] = useState([
    {
      colorName: "",
      colorCode: "",
      fileList: [],
      existingImages: [],
      // Không cần _id cho màu mới
    },
  ]);
  const handleAddColor = () => {
    setColors([
      ...colors,
      {
        colorName: "",
        colorCode: "",
        fileList: [],
        existingImages: [],
        // Không cần _id cho màu mới
      },
    ]);
  };

  const handleRemoveColor = async (index, colorId) => {
    if (colors.length === 1) {
      message.warning("Phải có ít nhất một màu sắc!");
      return;
    }

    try {
      if (colorId && initialValues?._id) {
        // Gọi API xóa color
        await updateProduct({
          id: initialValues._id,
          formData: JSON.stringify({ colorIdToDelete: colorId }),
          action: "deleteColor",
        }).unwrap();
        toast.success("Đã xóa màu sắc thành công!");
      }

      // Cập nhật state local
      setColors(colors.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing color:", error);
      toast.error("Có lỗi xảy ra khi xóa màu sắc!");
    }
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const handleImageChange = (index, { fileList: newFileList }) => {
    const newColors = [...colors];
    newColors[index].fileList = newFileList.map((file) => ({
      ...file,
      url: file.url || (file.response ? file.response.url : undefined),
    }));
    setColors(newColors);
  };

  const handleRemoveImage = (colorIndex, imageUrl) => {
    const newColors = [...colors];
    newColors[colorIndex].existingImages = newColors[
      colorIndex
    ].existingImages.filter((img) => img !== imageUrl);
    newColors[colorIndex].fileList = newColors[colorIndex].fileList.filter(
      (file) => file.url !== imageUrl
    );
    setColors(newColors);
  };

  useEffect(() => {
    if (initialValues) {
      const releaseDate = initialValues.releaseDate
        ? dayjs(initialValues.releaseDate)
        : null;
      form.setFieldsValue({
        ...initialValues,
        releaseDate,
        description: initialValues.description || "",
        capacities: initialValues.capacities || [],
      });

      if (initialValues.colors && Array.isArray(initialValues.colors)) {
        const formattedColors = initialValues.colors.map((color) => ({
          colorName: color.colorName || "",
          colorCode: color.colorCode || "",
          fileList: color.images
            ? color.images.map((image, idx) => ({
                uid: `-${idx}`,
                name: `image-${idx}.jpg`,
                status: "done",
                url: typeof image === "string" ? image : image.url,
              }))
            : [],
          existingImages: color.images || [],
          _id: color._id || null,
        }));
        setColors(formattedColors);
      } else {
        setColors([
          {
            colorName: "",
            colorCode: "",
            fileList: [],
            existingImages: [],
            _id: null,
          },
        ]);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        releaseDate: null,
        description: "",
        capacities: [],
      });
      setColors([
        {
          colorName: "",
          colorCode: "",
          fileList: [],
          existingImages: [],
          _id: null,
        },
      ]);
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "colors") {
          if (key === "releaseDate") {
            formData.append(key, value.toISOString());
          } else if (key === "capacities" && Array.isArray(value)) {
            value.forEach((cap, idx) =>
              formData.append(`capacities[${idx}]`, cap)
            );
          } else {
            formData.append(key, value);
          }
        }
      });

      // Add colors
      colors.forEach((color, index) => {
        // Chỉ gửi _id nếu là màu đã tồn tại (trong trường hợp update)
        if (color._id) {
          formData.append(`colors[${index}][_id]`, color._id);
        }
        formData.append(`colors[${index}][colorName]`, color.colorName);
        formData.append(`colors[${index}][colorCode]`, color.colorCode);

        // Add existing images to keep
        color.existingImages.forEach((image, imgIdx) => {
          formData.append(`colors[${index}][imagesToKeep][${imgIdx}]`, image);
        });

        // Add new images
        if (color.fileList) {
          color.fileList.forEach((file) => {
            if (file.originFileObj) {
              formData.append(`colors[${index}][images]`, file.originFileObj);
            }
          });
        }
      });

      let result;
      if (initialValues?._id) {
        result = await updateProduct({
          id: initialValues._id,
          formData,
        }).unwrap();
      } else {
        result = await addProduct(formData).unwrap();
      }

      toast.success(
        initialValues ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className="h-[600px] md:h-[700px] overflow-y-scroll"
      form={form}
      name="productForm"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Ckeditor5
          initialValue={initialValues?.description || ""}
          onChange={(data) => form.setFieldsValue({ description: data })}
        />
      </Form.Item>
      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Ngày ra mắt" name="releaseDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Số lượng"
          name="stock"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
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
      <Form.Item
        label="Loại sản phẩm"
        name="productType"
        rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
      >
        <Select placeholder="Chọn loại sản phẩm">
          <Option value="iPhone">iPhone</Option>
          <Option value="iPod">iPod</Option>
          <Option value="iPad">iPad</Option>
          <Option value="Mac">Mac Book</Option>
          <Option value="Watch">Watch</Option>
          <Option value="Airpod">Loa, tai nghe</Option>
          <Option value="Phụ kiện">Phụ kiện</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Dung lượng" name="capacities">
        <Select mode="tags" placeholder="VD: 64GB, 128GB, 256GB" />
      </Form.Item>
      {colors.map((color, index) => (
        <div
          key={color._id || index}
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
                customRequest={() => {}}
                onRemove={(file) =>
                  handleRemoveImage(index, file.url || file.preview)
                }
              >
                {color.fileList.length < 10 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
              {/* <div className="flex gap-2 flex-wrap">
                {color.existingImages.map((url, fileIndex) => (
                  <div key={fileIndex} className="relative">
                    <Image
                      src={url}
                      alt={`Color ${color.colorName} - Image ${fileIndex + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      type="text"
                      danger
                      className="absolute top-0 right-0 bg-white/50 hover:bg-white/80"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveImage(index, url)}
                    />
                  </div>
                ))}
              </div> */}
            </div>
          </Form.Item>
          {color._id && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveColor(index, color._id)}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              Xóa
            </Button>
          )}
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
