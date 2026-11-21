import { SlidersHorizontal, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import content from "@/data/content.json";

import FilterGenres from "./FilterGenres";
import FilterRating from "./FilterRating";
import FilterTrending from "./FilterTrending";

import type { CatalogFiltersProps } from "../types/CatalogFilters";

export default function CatalogFilters({
  selectedGenre,
  onGenreChange,
  selectedMinRating,
  selectedMaxRating,
  onRatingChange,
  selectedPeriod,
  onTrendChange,
  onReset,
}: CatalogFiltersProps) {
  const activeCount =
    (selectedGenre ? 1 : 0) +
    (selectedMinRating !== undefined ? 1 : 0) +
    (selectedPeriod ? 1 : 0);

  return (
    <aside className="w-full shrink-0 md:mt-10 md:w-72 lg:w-80">
      <div className="rounded-xl border border-border/30 bg-card/40 p-5 shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <SlidersHorizontal className="size-6 text-brand-light" />

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={content.filters.restoreFilters}
                  onClick={onReset}
                  className="text-muted-foreground transition-all duration-90 hover:scale-90 hover:bg-brand-primary/5 hover:text-brand-light hover:shadow-[0_0_4px_var(--color-brand-primary)]"
                >
                  <RotateCcw className="size-5" />
                </Button>
              }
            />

            <TooltipContent
              side="top"
              className="border border-border/40 bg-card text-foreground shadow-md"
            >
              {content.filters.restoreFilters}
            </TooltipContent>
          </Tooltip>
        </div>

        <p aria-live="polite" className="mb-3 text-sm text-text-secondary">
          {content.filters.activeFilters}: {activeCount}
        </p>

        <div className="grid grid-cols-3 items-start gap-2 md:grid-cols-1">
          <FilterGenres
            selectedGenres={selectedGenre ? [selectedGenre] : []}
            onChange={onGenreChange}
          />
          <FilterRating
            selectedMinRating={selectedMinRating}
            selectedMaxRating={selectedMaxRating}
            onChange={onRatingChange}
          />
          <FilterTrending
            selectedPeriod={selectedPeriod}
            onChange={onTrendChange}
          />
        </div>
      </div>
    </aside>
  );
}
