import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../../ui/Button";

import logoImage from "../../../assets/logo.png";

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  // Don't show footer in admin pages
  if (isAdmin) {
    return null;
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    toast.success("Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận tin.");
    e.target.reset();
  };

  return (
    <footer className="bg-[#FFF0D9] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <img
                src={logoImage}
                alt="SweetieBakery"
                className="w-[104px] h-[84px]"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Mang đến những chiếc bánh ngọt ngào, thơm ngon và đầy yêu thương
              cho mỗi gia đình Việt.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4">Về Chúng Tôi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="mb-4">Chính Sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-[#F7B5D5] transition-colors"
                >
                  Chính sách giao hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4">Đăng Ký Nhận Tin</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                required
                className="bg-white flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base outline-none file:inline-flex hover:bg-[#F7B5D5]/90 md:text-sm"
              />
              <Button
                type="submit"
                className="w-full text-white font-semibold text-md bg-[#F7B5D5] hover:bg-[#F7B5D5]/90"
              >
                Đăng ký
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#F7B5D5]/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SweetieBakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
