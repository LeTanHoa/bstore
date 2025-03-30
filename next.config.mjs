/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api-bstore-no35.vercel.app"], // Thêm localhost vào danh sách được phép
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-bstore-no35.vercel.app",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
