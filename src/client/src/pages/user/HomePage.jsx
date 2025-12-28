import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { http } from "../../libs/http.js";

import FeaturedProducts from "../../components/features/home/FeaturedProducts";
import HeroSection from "../../components/features/home/HeroSection";
import Promotions from "../../components/features/home/Promotions.jsx";
import ReviewCard from "../../components/features/home/ReviewCard.jsx";

import { Button } from "../../components/ui/Button";

import {
  MOCK_FEATURED_PRODUCTS,
  MOCK_REVIEWS,
} from "../../data/mockHomePageData.js";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, couponsRes] = await Promise.all([
          http.get("/products"),
          http.get("/coupons/public"),
        ]);

        if (productsRes.data.success) {
          setFeaturedProducts(productsRes.data.products.slice(0, 6));
        }

        if (couponsRes.data.success) {
          setPromotions(couponsRes.data.data);
        }

        const res_reviews = MOCK_REVIEWS.slice(0, 4);
        setReviews(res_reviews.slice(0, 4) || []);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã: ${code}`);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <>
          {/* Featured Products */}
          <FeaturedProducts featuredProducts={featuredProducts} />

          {/* Promotions */}
          <Promotions
            promotions={promotions}
            copiedCode={copiedCode}
            onClickCopyCode={handleCopyCode}
          />

          {/* Reviews */}
          <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-2">Khách Hàng Nói Gì</h2>
              <p className="text-muted-foreground">
                Những đánh giá chân thực từ khách hàng của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id || review.id} review={review} />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-linear-to-r from-[#F7B5D5] to-[#FFF0D9] py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl mb-4 text-white">
                Sẵn Sàng Đặt Bánh Ngay?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Giao hàng nhanh chóng, bánh luôn tươi ngon. Đặt hàng ngay để
                nhận ưu đãi!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#F7B5D5] hover:bg-white/80 hover:cursor-pointer"
                onClick={() => (window.location.href = "/products")}
              >
                Khám phá menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
