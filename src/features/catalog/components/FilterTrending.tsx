import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import type { FilterTrendingProps } from "../types/CatalogFilters";
import FilterSection from "./FilterSection";
import { getOptionClass } from "../utils/getOptionClass";
const trendOptions = [
  { labelKey: "day", value: "day" },
  { labelKey: "week", value: "week" },
] as const;

const FilterTrending = ({ selectedPeriod, onChange }: FilterTrendingProps) => {
  const selectedLabel = selectedPeriod
    ? content.filters.trendOptions[selectedPeriod]
    : null;

  return (
    <FilterSection
      icon={TrendingUp}
      title={content.filters.filterTrending}
      selectedLabel={selectedLabel}
    >
      {trendOptions.map((option) => {
        const isSelected = selectedPeriod === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? "" : option.value)}
            className={getOptionClass(isSelected)}
          >
            {content.filters.trendOptions[option.labelKey]}
          </Button>
        );
      })}
    </FilterSection>
  );
};

export default FilterTrending;
