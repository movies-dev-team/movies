import { SlidersHorizontal, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import content from "@/data/content.json";

import FilterGenres from "./FilterGenres";
import type { CatalogFiltersProps } from "../types/CatalogFilters";

export default function CatalogFilters({
  selectedGenre,
  onGenreChange,
  onReset,
}: CatalogFiltersProps) {
  return (
    <aside className="w-full shrink-0 md:mt-10 md:w-72 lg:w-80">
      <div className="rounded-xl border border-border/30 bg-card/40 p-5 shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <SlidersHorizontal className="size-6 text-brand-light" />

          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Restaurar filtros"
                onClick={onReset}
                className="text-muted-foreground transition-all duration-90 hover:scale-90 hover:bg-brand-primary/5 hover:text-brand-light hover:shadow-[0_0_4px_var(--color-brand-primary)]"
              >
                <RotateCcw className="size-5" />
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              className="border border-border/40 bg-card text-foreground shadow-md"
            >
              {content.filters.restoreFilters}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-3">
          <FilterGenres
            selectedGenres={selectedGenre ? [selectedGenre] : []}
            onChange={onGenreChange}
          />
        </div>
      </div>
    </aside>
  );
}
