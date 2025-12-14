import { createContext, useContext, useState, useEffect, useMemo } from "react";

const WishlistContext = createContext();

// Hook để sử dụng context
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // 1. Khởi tạo state từ LocalStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Lưu vào LocalStorage mỗi khi wishlist thay đổi
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 3. Hàm Toggle: Nếu có rồi thì xóa, chưa có thì thêm
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);

      if (exists) {
        // Logic Remove: Lọc bỏ sản phẩm ra khỏi mảng
        return prev.filter((i) => i.id !== product.id);
      } else {
        // Logic Add: Thêm sản phẩm vào mảng
        return [...prev, product];
      }
    });
  };

  // 4. Hàm xóa cụ thể (Dùng cho nút "Xóa" ở trang Wishlist page)
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  // 5. Hàm kiểm tra xem sản phẩm có trong wishlist không (Để làm sáng trái tim)
  const isInWishlist = (id) => {
    return wishlist.some((i) => i.id === id);
  };

  // 6. Tính tổng số sản phẩm trong wishlist (để hiện badge số lượng)
  const totalWishlistItems = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        totalWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
