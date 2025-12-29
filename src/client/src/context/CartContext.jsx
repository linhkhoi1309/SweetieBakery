import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    //const saved = localStorage.getItem("cart");
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Lưu giỏ hàng vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    //localStorage.setItem("cart", JSON.stringify(cart));
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === product._id);

      // Lấy giá thực tế (ưu tiên giá khuyến mãi priceSale nếu có)
      const actualPrice =
        product.priceSale > 0 ? product.priceSale : product.price;

      // Chuẩn hóa ảnh: lấy ảnh đầu tiên từ mảng images (cấu trúc MongoDB)
      const displayImage =
        product.images && product.images.length > 0
          ? product.images[0].url
          : product.image;

      if (exist) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + qty, 10) }
            : i
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            price: actualPrice,
            image: displayImage,
            quantity: Math.min(qty, 10),
          },
        ];
      }
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: Math.min(Math.max(1, qty), 10) } : i
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    //localStorage.removeItem("cart");
    sessionStorage.removeItem("cart");
  };

  // 1. Tính tổng số lượng sản phẩm
  const totalItems = useMemo(
    () => cart.reduce((acc, cur) => acc + cur.quantity, 0),
    [cart]
  );

  // 2. Tính tổng tiền hàng (chưa trừ voucher, chưa cộng ship)
  const subTotal = useMemo(
    () => cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0),
    [cart]
  );

  const shippingFee = 30000;

  // 3. Tính toán số tiền được giảm dựa trên Coupon thực tế
  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;

    // Logic xử lý đặc biệt cho mã FREESHIP cũ (nếu bạn vẫn muốn dùng)
    if (appliedVoucher.code === "FREESHIP") return shippingFee;

    const { discountType, discountValue, maxDiscountAmount } = appliedVoucher;
    let amount = 0;

    if (discountType === "percent") {
      amount = (subTotal * discountValue) / 100;
      // Áp dụng giới hạn giảm tối đa (nếu có)
      if (maxDiscountAmount && amount > maxDiscountAmount) {
        amount = maxDiscountAmount;
      }
    } else if (discountType === "fixed") {
      // Giảm số tiền cố định (VD: 50.000đ)
      amount = discountValue;
    }

    // Tiền giảm không được vượt quá tổng giá trị đơn hàng
    return Math.min(amount, subTotal);
  }, [appliedVoucher, subTotal]);

  // 4. Tổng thanh toán cuối cùng
  const finalTotal = useMemo(() => {
    return subTotal + shippingFee - discount;
  }, [subTotal, shippingFee, discount]);

  const applyVoucher = (voucher) => setAppliedVoucher(voucher);
  const removeVoucher = () => setAppliedVoucher(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        subTotal,
        shippingFee,
        discount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
