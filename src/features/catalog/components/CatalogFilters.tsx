
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    <aside className="w-full shrink-0 md:mt-0 md:w-full">
      <div className="rounded-xl border border-border/30 bg-card/40 p-5 shadow-none md:p-6">
        <div className="mb-4 hidden items-center justify-between md:flex">
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
                  className="text-muted-foreground hover:text-brand-light"
                >
                  <RotateCcw className="size-5" />
                </Button>
              }
            />
            <TooltipContent>
              {content.filters.restoreFilters}
            </TooltipContent>
          </Tooltip>
        </div>

        <div
          ref={filtersRef}
          className="flex items-center gap-2 md:flex-col md:items-stretch md:gap-4"
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

          <div className="md:hidden">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={content.filters.restoreFilters}
                    onClick={onReset}
                    className="text-muted-foreground hover:text-brand-light"
                  >
                    <RotateCcw className="size-5" />
                  </Button>
                }
              />
              <TooltipContent>
                {content.filters.restoreFilters}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
}
