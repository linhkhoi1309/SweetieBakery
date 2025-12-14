import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/features/products/ProductCard";

const WishlistPage = () => {
  const { totalWishlistItems, wishlist } = useWishlist();

  if (totalWishlistItems === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Wishlist trống
            </h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Bạn chưa lưu sản phẩm nào. Hãy thêm sản phẩm yêu thích vào đây
              nhé!
            </p>

            <Link
              to="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F7B5D5] px-8 text-sm font-semibold text-white shadow transition-colors hover:bg-[#F7B5D5]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B5D5]"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Wishlist</h1>
        <p className="text-muted-foreground">
          Bạn có {totalWishlistItems} sản phẩm trong wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
