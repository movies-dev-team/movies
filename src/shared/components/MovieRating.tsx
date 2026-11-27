
import { useState } from "react";
import { Star } from "lucide-react";
import content from "@/data/content.json";

interface MovieRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

export default function MovieRating({ rating, onChange }: MovieRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-4">
      <div
        role="group"
        aria-label={content.ratings.groupLabel}
        className="flex items-center gap-0.5 md:gap-1"
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
              aria-label={content.ratings.starLabel.replace(
                "{value}",
                String(value),
              )}
              aria-pressed={rating === value}
              className="cursor-pointer transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
            >
              <Star
                className={`size-4 md:size-5 lg:size-6 transition-colors duration-150 ${
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
        {content.ratings.label}
      </span>
    </div>
  );
}
