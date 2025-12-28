import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import { http } from "../../libs/http";

import { MOCK_FEATURED_PRODUCTS as products } from "../../data/mockHomePageData";
import { MOCK_REVIEWS as reviews } from "../../data/mockHomePageData";

import { Button } from "../../components/ui/Button";

import ProductNotFound from "../../components/features/products/details/ProductNotFound";
import StarRating from "../../components/features/products/StarRating";
import QuantitySelector from "../../components/features/products/details/QuantitySelector";
import ProductTabs from "../../components/features/products/details/ProductTabs";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        // Gọi đồng thời thông tin sản phẩm và đánh giá
        const [productRes, reviewsRes] = await Promise.all([
          http.get(`/products/${productId}`),
          http.get(`/reviews/product/${productId}`),
        ]);
        // const reviews_res = await reviews.filter(
        //   (r) => r.productId == productId
        // );

        // Cập nhật dữ liệu dựa trên cấu trúc Response thông thường { success, data }
        setProduct(productRes.data.product || productRes.data.data);
        setProductReviews(
          reviewsRes.data.data.filter((r) => r.status === "approved")
        );
      } catch (err) {
        console.error("Fail to load data: ", err.message);
        setError(
          err.response?.data?.message || "Không thể tải dữ liệu sản phẩm."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) {
    return <ProductNotFound />;
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      await http.post(`/reviews/product/${productId}`, {
        rating,
        comment: reviewText,
      });
      toast.success("Đánh giá của bạn đã được gửi và đang chờ phê duyệt!");
      setReviewText("");
      setRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#F7B5D5] mb-4" />
        <p className="text-muted-foreground">Đang tải thông tin bánh...</p>
      </div>
    );
  }

  if (error || !product) {
    return <ProductNotFound message={error} />;
  }

  // Kiểm tra giá khuyến mãi
  const hasDiscount =
    product.priceSale > 0 && product.priceSale < product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 border">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-[#F7B5D5] shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              ({product.numReviews} nhận xét)
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-medium border border-red-200">
                Chỉ còn {product.stock} bánh
              </span>
            )}
            {product.stock === 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium border border-gray-200">
                Hết hàng
              </span>
            )}
          </div>

          {/* Hiển thị giá: Ưu tiên priceSale nếu có */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-bold text-[#F7B5D5]">
              {(hasDiscount ? product.priceSale : product.price).toLocaleString(
                "vi-VN"
              )}
              đ
            </p>
            {hasDiscount && (
              <p className="text-xl text-muted-foreground line-through">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
            )}
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              maxStock={product.stock}
            />
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 text-white font-bold"
              size="lg"
              disabled={product.stock === 0}
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleWishlist(product)}
              className={
                isInWishlist(product._id) ? "text-red-500 border-red-500" : ""
              }
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist(product._id) ? "fill-current" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <ProductTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
        productReviews={productReviews}
        handleSubmitReview={handleSubmitReview}
        rating={rating}
        setRating={setRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
      />
    </div>
  );
};

export default ProductDetailPage;
