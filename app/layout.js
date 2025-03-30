import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserProvider } from "@/hook/useUser";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export const metadata = {
  title: "B Store Việt Nam - Mua iPhone, MacBook, iPad chính hãng",
  description:
    "B Store Việt Nam - Cung cấp các sản phẩm chính hãng như iPhone, MacBook, iPad, AirPods, Apple Watch với giá tốt nhất.",
  keywords:
    "Apple, iPhone, MacBook, iPad, Apple Watch, AirPods, Apple Store, mua iPhone chính hãng",
  openGraph: {
    title: "B Store Việt Nam - Sản phẩm Apple chính hãng",
    description:
      "Mua sắm các sản phẩm Apple chính hãng với nhiều ưu đãi. Bảo hành 12 tháng, giao hàng nhanh chóng!",
    // url: "https://yourapplestore.com",
    siteName: "B Store Việt Nam",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/logo.png", // Favicon chính
    shortcut: "/logo.png",
    apple: "/logo.png", // Icon cho iOS
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Store Việt Nam - Mua iPhone, MacBook, iPad chính hãng",
    description:
      "Mua sắm các sản phẩm Apple chính hãng với giá tốt nhất. Bảo hành chính hãng, hỗ trợ trả góp 0%.",
    images: ["https://yourapplestore.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <UserProvider>
          <ToastContainer position="bottom-right" />
          <Providers>
            <div>
              <Header />
              <div className="overflow-x-hidden">{children}</div>
              <Footer />
            </div>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
