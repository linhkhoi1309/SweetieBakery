import { Link, Outlet } from "react-router-dom";
import fullBackground from "../assets/fullBackground.jpeg";
import logo from "../assets/logo.png";

const AuthLayout = () => {
  return (
    // Container chính:
    // - mobile: justify-center (căn giữa)
    // - desktop (lg): justify-end (căn phải)
    <div className="min-h-screen w-full relative flex items-center justify-center lg:justify-end overflow-hidden">
      {/* 1. BACKGROUND FULL SCREEN */}
      <div className="absolute inset-0 z-0">
        <img
          src={fullBackground}
          alt="Sweetie Bakery Background"
          className="w-full h-full object-cover"
        />
        {/* Lớp phủ tối màu nhẹ để làm nổi bật Form */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 2. LOGO */}
      {/* Logo nằm góc trên cùng bên TRÁI (hoặc phải tùy bạn, thường là trái đẹp hơn) */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex w-full justify-center lg:p-8">
        <Link to="/">
          <img
            src={logo}
            alt="Sweetie Bakery Logo"
            className="h-24 md:h-36 object-contain drop-shadow-lg"
          />
        </Link>
      </div>

      {/* 3. CONTAINER CHỨA FORM (OUTLET) */}
      <div className="relative z-10 w-full max-w-lg p-4 lg:mr-20 xl:mr-32 animate-in fade-in slide-in-from-right-8 duration-700">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
