// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["localhost"], // Thêm localhost vào danh sách được phép
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8080", // Đảm bảo đúng cổng API đang chạy
//         pathname: "/uploads/**", // Định nghĩa đường dẫn ảnh
//       },
//     ],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-bstore-no35.vercel.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
