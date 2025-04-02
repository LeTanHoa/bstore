/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Thêm domain của Cloudinary
    remotePatterns: [
      {
        protocol: "https", // Cloudinary dùng HTTPS
        hostname: "res.cloudinary.com",
        pathname: "/dahm7mli8/**", // Cloud name của bạn là dahm7mli8
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api-bstore-no35.vercel.app",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
