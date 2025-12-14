import { ShoppingCart, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(
      isInWishlist(product.id) ? "Đã xóa khỏi wishlist" : "Đã thêm vào wishlist"
    );
  };

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{product.discount}%
          </Badge>
        )}
        {product.stock < 10 && !product.discount && (
          <Badge className="absolute top-2 left-2 bg-destructive">
            Sắp hết
          </Badge>
        )}
        {product.stock < 10 && product.discount && (
          <Badge className="absolute top-12 left-2 bg-destructive">
            Sắp hết
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={` absolute top-2 right-2 bg-white/90 hover:bg-white ${
            isInWishlist(product.id) ? "text-red-500" : "text-gray-500"
          }`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-6 w-6 ${isInWishlist ? "fill-current" : ""}`} />
        </Button>
      </div>

      <div className="px-6 [&:last-child]:pb-6 p-4">
        <h3 className="mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            ({product.rating})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {product.discount && product.discount > 0 ? (
            <>
              <p className="text-[#F7B5D5] text-lg" style={{ fontWeight: 600 }}>
                {Math.round(
                  product.price * (1 - product.discount / 100)
                ).toLocaleString("vi-VN")}
                đ
              </p>
              <p className="text-gray-400 text-sm line-through">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
            </>
          ) : (
            <p className="text-[#F7B5D5] text-lg" style={{ fontWeight: 600 }}>
              {product.price.toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center px-6 pb-6 [.border-t]:pt-6 p-4 pt-0">
        <Button
          className="w-full text-white font-medium bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 hover:cursor-pointer"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
