import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FilterRatingProps {
  selectedMinRating?: number;
  selectedMaxRating?: number;
  onChange: (min?: number, max?: number) => void;
}

const ratingOptions = [
  { label: "Excelente", min: 8, max: 10, activeBars: 5 },
  { label: "Buena", min: 6, max: 8, activeBars: 3 },
  { label: "Regular", min: 4, max: 6, activeBars: 2 },
  { label: "Baja", min: 0, max: 4, activeBars: 1 },
];

export default function FilterRating({
  selectedMinRating,
  selectedMaxRating,
  onChange,
}: FilterRatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      size="sm"
      className="gap-0 border border-border/40 bg-transparent py-1 shadow-none hover:border-brand-light hover:shadow-none"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-3 py-3 text-base font-semibold transition-colors hover:text-brand-light"
      >
        <span className="flex items-center gap-2">
          <Star className="size-6 shrink-0 text-brand-light" />
          Puntuación
        </span>

        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2.5 px-4 pb-4">
          {ratingOptions.map((option) => {
            const isSelected =
              selectedMinRating === option.min &&
              selectedMaxRating === option.max;

            return (
              <Button
                key={option.label}
                type="button"
                size="sm"
                variant={isSelected ? "default" : "secondary"}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isSelected) {
                    onChange(undefined, undefined);
                  } else {
                    onChange(option.min, option.max);
                  }
                }}
                className={`h-auto min-h-20 w-full flex-col gap-2 rounded-xl border border-border/40 px-3 py-2 shadow-none ${
                  isSelected
                    ? "border-brand-light bg-brand-primary text-white hover:bg-brand-primary"
                    : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <span className="text-xs">{option.label}</span>

                <div className="flex items-end justify-center gap-1">
                  {[4, 7, 10, 13, 16].map((height, index) => (
                    <span
                      key={index}
                      className={`w-1.5 rounded-t-sm ${
                        index < option.activeBars
                          ? "bg-brand-light"
                          : "bg-muted-foreground/40"
                      }`}
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>

                <span className="w-full text-center text-xs">
                  {option.min} - {option.max}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
