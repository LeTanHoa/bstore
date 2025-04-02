import ProductDetailClient from "@/components/ProductDetailClient";
import axios from "axios";
import baseUrl from "@/config/baseUrl";

// Thêm hàm xử lý URL Cloudinary
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Nếu đã là URL đầy đủ
  if (imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Tạo URL Cloudinary đầy đủ
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/dahm7mli8/image/upload/';
  const cleanImagePath = imageUrl.replace(/^\/+/, '');
  return `${cloudinaryBaseUrl}${cleanImagePath}`;
};

// Hàm generateMetadata
export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const res = await axios.get(`${baseUrl}/products/${id}`);
    const product = res.data;

    if (!product || !product.name) {
      return {
        title: "Sản phẩm không tồn tại | B Store",
        description: "Không tìm thấy sản phẩm bạn yêu cầu.",
        robots: "noindex",
      };
    }

    // Xử lý URL ảnh cho metadata
    const productImage = getValidImageUrl(product.colors[0]?.images[0]);
    const fallbackImage = 'https://res.cloudinary.com/dahm7mli8/image/upload/default-product.jpg'; // Thêm ảnh mặc định

    return {
      title: `${product.name} - Giá ${product.price} VNĐ | B Store`,
      description: `Mua ${product.name} chính hãng với giá ${
        product.price
      } VNĐ. ${product.description.slice(
        0,
        150
      )}... Giao hàng nhanh toàn quốc, đổi trả dễ dàng.`,
      keywords: `${product.name}, ${product.productType}, giá ${product.price}, mua ${product.name} chính hãng, shop uy tín`,
      openGraph: {
        title: `${product.name} - B Store`,
        description: `Khám phá ${product.name} với giá ${product.price} VNĐ. Chất lượng đảm bảo, giao hàng tận nơi.`,
        images: [
          {
            url: productImage || fallbackImage,
            width: 800,
            height: 600,
            alt: `Hình ảnh ${product.name}`,
          },
        ],
        url: `https://shop-bstore.vercel.app/product/${id}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - B Store`,
        description: `Mua ${product.name} với giá ${product.price} VNĐ.`,
        images: [productImage || fallbackImage],
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: `https://shop-bstore.vercel.app/product/${id}`,
      },
    };
  } catch (error) {
    console.error(
      "Lỗi khi lấy dữ liệu sản phẩm trong generateMetadata:",
      error
    );
    return {
      title: "Sản phẩm không tồn tại | B Store",
      description: "Không tìm thấy sản phẩm bạn yêu cầu.",
      robots: "noindex",
    };
  }
}

export default function ProductDetail({ params }) {
  // Truyền params trực tiếp vào component client-side
  return <ProductDetailClient params={params} />;
}
