import { useState } from "react";
import { Star } from "lucide-react";

interface MovieRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

export default function MovieRating({ rating, onChange }: MovieRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {Array.from({ length: 10 }, (_, index) => {
          const value = index + 1;
          const active = value <= (hoverRating || rating);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              onMouseEnter={() => setHoverRating(value)}
              aria-label={`Puntuar con ${value} de 10`}
              aria-pressed={rating === value}
              className="cursor-pointer transition-transform duration-150 hover:scale-110"
            >
              <Star
                className={`size-6 transition-colors duration-150 ${
                  active
                    ? "fill-[#9634F5] text-[#9634F5]"
                    : "fill-transparent text-[#49316F]"
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="whitespace-nowrap text-sm text-gray-300">
        Tu puntuación
      </span>
    </div>
  );
}