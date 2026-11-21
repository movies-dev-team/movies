import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FilterTrendingProps } from "../types/CatalogFilters";

const trendOptions = [
  { label: "Hoy", value: "day" },
  { label: "Esta semana", value: "week" },
] as const;

const FilterTrending = ({ selectedPeriod, onChange }: FilterTrendingProps) => {
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
          <TrendingUp className="size-6 shrink-0 text-brand-light" />
          Tendencia
        </span>

        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2.5 px-4 pb-4">
          {trendOptions.map((option) => {
            const isSelected = selectedPeriod === option.value;

            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={isSelected ? "default" : "secondary"}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isSelected) {
                    onChange("");
                  } else {
                    onChange(option.value);
                  }
                }}
                className={`h-auto min-h-10 w-full rounded-full border border-border/40 px-3 py-2 text-base shadow-none ${
                  isSelected
                    ? "bg-brand-primary text-white hover:bg-brand-primary"
                    : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default FilterTrending;
