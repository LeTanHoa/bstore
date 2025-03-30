"use client";
import Image from "next/image";
import tiktok from "../public/tiktok.svg";
import youtube from "../public/youtube.svg";
import zalo from "../public/zalo.svg";
import facebook from "../public/facebook.svg";
import zalopay from "../public/zalopay.svg";
import momo from "../public/momo.svg";
import vnpay from "../public/vnpay.svg";
import atm from "../public/atm.svg";
import mastercard from "../public/mastercard.svg";
import visa from "../public/visa.svg";
import { usePathname } from "next/navigation";
import logo from "./../public/logotrang.png";

const Footer = () => {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        ""
      ) : (
        <footer className="bg-gray-900  text-white py-8 px-4">
          <div className="max-w-7xl mx-auto ">
            <Image src={logo} alt="" className="mb-5" width={100} height={100} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Cột 1: Kết nối FPT */}

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  KẾT NỐI VỚI FPT SHOP
                </h3>
                <div className="flex space-x-3">
                  <Image src={facebook} alt="Facebook" width={38} height={38} />
                  <Image src={zalo} alt="Zalo" width={38} height={38} />
                  <Image src={youtube} alt="YouTube" width={38} height={38} />
                  <Image src={tiktok} alt="TikTok" width={38} height={38} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  TỔNG ĐÀI MIỄN PHÍ
                </h3>
                <p>
                  📞 <strong>1800.6601</strong> (Nhánh 1)
                </p>
                <p>
                  📞 <strong>1800.6616</strong> (8h00 - 22h00)
                </p>
                <p className="font-bold text-red-500">Gặp chuyên gia ngay!</p>
              </div>

              {/* Cột 2: Về chúng tôi */}
              <div>
                <h3 className="text-lg font-semibold mb-3">VỀ CHÚNG TÔI</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Giới thiệu về công ty</li>
                  <li>Quy chế hoạt động</li>
                  <li>Dự án Doanh nghiệp</li>
                  <li>Tin tức khuyến mại</li>
                  <li>Giới thiệu máy đổi trả</li>
                </ul>
              </div>

              {/* Cột 3: Chính sách */}
              <div>
                <h3 className="text-lg font-semibold mb-3">CHÍNH SÁCH</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Chính sách bảo hành</li>
                  <li>Chính sách đổi trả</li>
                  <li>Chính sách bảo mật</li>
                  <li>Chính sách trả góp</li>
                  <li>Chính sách giao hàng & lắp đặt</li>
                </ul>
              </div>

              {/* Cột 4: Hỗ trợ thanh toán */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  HỖ TRỢ THANH TOÁN
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Image src={visa} alt="Visa" width={50} height="auto" />
                  <Image
                    src={vnpay}
                    alt="Mastercard"
                    width={50}
                    height="auto"
                  />
                  <Image src={momo} alt="JCB" width={50} height="auto" />
                  <Image src={zalopay} alt="JCB" width={50} height="auto" />
                  <Image src={atm} alt="JCB" width={50} height="auto" />
                  <Image src={mastercard} alt="Amex" width={50} height="auto" />
                </div>
              </div>
            </div>

            {/* Dòng phân cách */}
            <hr className="border-gray-700 my-6" />

            {/* Dòng cuối */}
            <div className="text-center text-gray-400">
              WEBSITE CỦA FPT RETAIL | Cửa hàng uỷ quyền bởi Apple:{" "}
              <span className="font-bold text-white">F.Studio</span> | Trung tâm
              bảo hành: <span className="font-bold text-white">F.Care</span> |
              Chuỗi nhà thuốc:{" "}
              <span className="font-bold text-white">Nhà thuốc Long Châu</span>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
