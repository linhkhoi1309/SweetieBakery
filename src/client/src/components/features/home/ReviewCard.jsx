import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar";

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.avatar} alt={review.customerName} />
            <AvatarFallback>{review.customerName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                {review.customerName}
              </h4>

              {/* Logic hiển thị sao */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Nội dung đánh giá */}
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
              {review.comment}
            </p>

            {/* Ngày tháng */}
            <p className="text-xs text-gray-400">
              {new Date(review.date).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
