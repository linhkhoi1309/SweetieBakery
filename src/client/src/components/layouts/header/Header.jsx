import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  UserCircle,
  ShoppingBag,
  Shield,
  ChevronDown,
} from "lucide-react";

import { Button } from "../../ui/Button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar.jsx";
import { Badge } from "../../ui/Badge.jsx";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/Sheet.jsx";

import logoImage from "../../../assets/logo.png";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useCart } from "../../../context/CartContext.jsx";
import { useWishlist } from "../../../context/WishlistContext.jsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/products", label: "Sản Phẩm" },
    //{ href: "/promotions", label: "Ưu Đãi" },
    { href: "/about", label: "Về Chúng Tôi" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2 hover:cursor-pointer">
              <img
                src={logoImage}
                alt="SweetieBakery"
                className="w-[104px] h-[84px]"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors hover:text-[#F7B5D5] ${
                  location.pathname === link.href
                    ? "text-[#F7B5D5]"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#F7B5D5] text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <ChevronDown className="absolute -bottom-1 right-0 h-3 w-3 text-[#F7B5D5] pointer-events-none" />

                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <div className="flex flex-col space-y-1 px-4 py-3 bg-[#FFF0D9]/30">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <div className="border-t border-gray-200"></div>
                      <div className="py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF0D9]/50 transition-colors"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate("/user/profile");
                          }}
                        >
                          Tài khoản của tôi
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF0D9]/50 transition-colors"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate("/user/profile");
                          }}
                        >
                          Đơn hàng
                        </button>
                        {user.role === "admin" && (
                          <>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF0D9]/50 transition-colors"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                navigate("/admin");
                              }}
                            >
                              🔐 Admin Panel
                            </button>
                          </>
                        )}
                      </div>
                      <div className="border-t border-gray-200"></div>
                      <div className="py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/login")}
                  className="relative hover:cursor-pointer"
                >
                  <User className="h-5 w-5" />
                </Button>
                <span className="hidden sm:inline-block text-sm text-muted-foreground">
                  <Button
                    variant="link"
                    className="text-[#F7B5D5] p-0 h-auto hover:cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </Button>
                </span>
              </div>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:cursor-pointer"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
              {totalWishlistItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#F7B5D5]">
                  {totalWishlistItems}
                </Badge>
              )}
            </Button>

            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#F7B5D5]">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg transition-colors hover:text-[#F7B5D5] ${
                        location.pathname === link.href
                          ? "text-[#F7B5D5]"
                          : "text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
