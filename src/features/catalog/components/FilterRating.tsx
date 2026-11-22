import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import FilterSection from "./FilterSection";
import type { FilterRatingProps } from "../types/CatalogFilters";

const ratingOptions = [
  { labelKey: "excellent", min: 8, max: 10, activeBars: 5 },
  { labelKey: "good", min: 6, max: 7.9, activeBars: 3 },
  { labelKey: "regular", min: 4, max: 5.9, activeBars: 2 },
  { labelKey: "low", min: 0, max: 3.9, activeBars: 1 },
] as const;

export default function FilterRating({
  selectedMinRating,
  selectedMaxRating,
  onChange,
  isOpen,
  onToggle,
}: FilterRatingProps) {
  const selectedOption = ratingOptions.find(
    (option) =>
      option.min === selectedMinRating && option.max === selectedMaxRating,
  );

  return (
    <FilterSection
      icon={Star}
      title={content.filters.filterRating}
      selectedLabel={
        selectedOption
          ? content.filters.ratingOptions[selectedOption.labelKey]
          : null
      }
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {ratingOptions.map((option) => {
        const isSelected =
          selectedMinRating === option.min && selectedMaxRating === option.max;

        return (
          <Button
            key={option.labelKey}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            aria-pressed={isSelected}
            onClick={() =>
              isSelected
                ? onChange(undefined, undefined)
                : onChange(option.min, option.max)
            }
            className={`h-auto min-h-20 w-full flex-col gap-2 rounded-xl border border-border/40 px-3 py-2 shadow-none ${
              isSelected
                ? "border-brand-light bg-brand-primary text-white hover:bg-brand-primary"
                : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <span className="text-xs">
              {content.filters.ratingOptions[option.labelKey]}
            </span>

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
    </FilterSection>
  );
}
