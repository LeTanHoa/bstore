import ProductDetailClient from "@/components/ProductDetailClient";
import axios from "axios";
import baseUrl from "@/config/baseUrl";
// Hàm generateMetadata
export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const res = await axios.get(`${baseUrl}/products/${id}`);
    const product = res.data;

    if (!product || !product.name) {
      return {
        title: "Sản phẩm không tồn tại | Tên Shop",
        description: "Không tìm thấy sản phẩm bạn yêu cầu.",
        robots: "noindex",
      };
    }

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
        title: `${product.name} - Tên Shop`,
        description: `Khám phá ${product.name} với giá ${product.price} VNĐ. Chất lượng đảm bảo, giao hàng tận nơi.`,
        images: [
          {
            url: `https://api-bstore-no35.vercel.app/uploads/${product.colors[0]?.images[0]}`,
            width: 800,
            height: 600,
            alt: `Hình ảnh ${product.name}`,
          },
        ],
        url: `https://shop-bstore.vercel.app/product/product/${id}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - B Store`,
        description: `Mua ${product.name} với giá ${product.price} VNĐ.`,
        images: [
          `https://api-bstore-no35.vercel.app/uploads/${product.colors[0]?.images[0]}`,
        ],
      },
      robots: "index, follow",
      alternates: {
        canonical: `https://yourdomain.com/product/${id}`,
      },
    };
  } catch (error) {
    console.error(
      "Lỗi khi lấy dữ liệu sản phẩm trong generateMetadata:",
      error
    );
    return {
      title: "Sản phẩm không tồn tại | Tên Shop",
      description: "Không tìm thấy sản phẩm bạn yêu cầu.",
      robots: "noindex",
    };
  }
}

export default function ProductDetail({ params }) {
  // Truyền params trực tiếp vào component client-side
  return <ProductDetailClient params={params} />;
}
