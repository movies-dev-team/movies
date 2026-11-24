import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import content from "@/data/content.json";
import { useState } from "react";
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
  const filtersRef = useRef<HTMLDivElement>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        window.matchMedia("(max-width: 767px)").matches &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="w-full shrink-0 md:mt-10 md:w-72 lg:w-80">
      <div className="rounded-xl border border-border/30 bg-card/40 p-5 md:p-6 shadow-none">
        <div className="mb-1 flex items-center justify-between md:mb-4">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="size-6 text-brand-light" />
          </div>
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
        <div
          ref={filtersRef}
          className="grid grid-cols-3 items-start gap-2 md:grid-cols-1 md:gap-4"
        >
          <FilterGenres
            selectedGenres={selectedGenre ? [selectedGenre] : []}
            onChange={onGenreChange}
            isOpen={openFilter === "genre"}
            onToggle={() =>
              setOpenFilter(openFilter === "genre" ? null : "genre")
            }
          />

          <FilterRating
            selectedMinRating={selectedMinRating}
            selectedMaxRating={selectedMaxRating}
            onChange={onRatingChange}
            isOpen={openFilter === "rating"}
            onToggle={() =>
              setOpenFilter(openFilter === "rating" ? null : "rating")
            }
          />

          <FilterTrending
            selectedPeriod={selectedPeriod}
            onChange={onTrendChange}
            isOpen={openFilter === "trending"}
            onToggle={() =>
              setOpenFilter(openFilter === "trending" ? null : "trending")
            }
          />
        </div>
      </div>
    </aside>
  );
}
