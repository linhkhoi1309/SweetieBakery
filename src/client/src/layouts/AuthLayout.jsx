import { Outlet } from "react-router-dom";
import fullBackground from "../assets/fullBackground.jpeg";
import logo from "../assets/logo.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen h-screen relative overflow-hidden">
      {/* 1. BACKGROUND FULL SCREEN */}
      <div className="absolute inset-0">
        <img
          src={fullBackground}
          alt="Sweetie Bakery Background Authentication"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. LOGO CỐ ĐỊNH Ở TRÊN CÙNG GIỮA */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-20">
        <img
          src={logo}
          alt="Sweetie Bakery Logo"
          className="h-45 object-contain"
        />
      </div>

      {/* 3. CONTAINER CHÍNH CHỨA FORM (OUTLET) */}
      <div
        className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-10 
                      flex flex-col items-center justify-center overflow-y-auto"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
