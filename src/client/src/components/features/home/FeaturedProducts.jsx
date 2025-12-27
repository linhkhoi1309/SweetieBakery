import { Button } from "../../../components/ui/Button";

import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "../products/ProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-[#F7B5D5]" />
            <h2 className="text-3xl">Sản Phẩm Nổi Bật</h2>
          </div>
          <p className="text-muted-foreground">
            Những sản phẩm được yêu thích nhất
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-[#F7B5D5]"
          onClick={() => (window.location.href = "/products")}
        >
          Xem tất cả
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
