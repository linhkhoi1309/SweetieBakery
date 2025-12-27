import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === product._id);

      // Lấy giá thực tế (ưu tiên priceSale nếu > 0)
      const actualPrice =
        product.priceSale > 0 ? product.priceSale : product.price;

      // Lấy ảnh đầu tiên từ mảng images
      const displayImage =
        product.images && product.images.length > 0
          ? product.images[0].url
          : product.image; // fallback nếu đã có trường image sẵn

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
            price: actualPrice, // Lưu giá tại thời điểm thêm vào giỏ
            image: displayImage, // Lưu URL ảnh vào trường image để dễ gọi ở CartPage
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
    localStorage.removeItem("cart");
  };

  const totalItems = useMemo(
    () => cart.reduce((acc, cur) => acc + cur.quantity, 0),
    [cart]
  );

  const subTotal = useMemo(
    () => cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0),
    [cart]
  );

  const applyVoucher = (voucher) => {
    setAppliedVoucher(voucher);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = 30000;

  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === "FREESHIP") {
      discount = shippingFee;
    } else {
      discount = subtotal * appliedVoucher.discount;
    }
  }

  const finalTotal =
    subtotal +
    (appliedVoucher?.code === "FREESHIP" ? 0 : shippingFee) -
    discount;

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
