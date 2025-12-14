import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating, showRating = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={index}
          className="size-4.5 text-yellow-400 fill-yellow-400"
          strokeWidth={1}
        />
      ))}

      {hasHalf && (
        <div className="relative size-4.5">
          <Star
            className="absolute size-4.5 text-gray-300 fill-gray-300"
            strokeWidth={1}
          />
          <StarHalf
            className="absolute size-4.5 [clip-path:inset(0_50%_0_0)] text-yellow-400 fill-yellow-400"
            strokeWidth={1}
          />
        </div>
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={index}
          className="size-4.5 text-gray-300 fill-gray-300"
          strokeWidth={1}
        />
      ))}

      {showRating && (
        <span className="ml-2 text-muted-foreground">({rating} đánh giá)</span>
      )}
    </div>
  );
};

export default StarRating;
