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
      const exist = prev.find((i) => i.id === product.id);

      if (exist) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + qty, 10) }
            : i
        );
      } else return [...prev, { ...product, quantity: Math.min(qty, 10) }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(Math.max(1, qty), 10) } : i
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    localStorage.removeItem("cart");
  };

  const totalItems = useMemo(() =>
    cart.reduce((acc, cur) => acc + cur.quantity, 0)
  );

  const subTotal = useMemo(() =>
    cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
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
