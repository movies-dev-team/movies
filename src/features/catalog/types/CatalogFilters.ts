import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface CatalogFilterValues {
  genre: string;
  minRating?: number;
  maxRating?: number;
  trend: "day" | "week" | "";
}

export interface CatalogFiltersProps {
  selectedGenre: string;
  onGenreChange: (values: string[]) => void;
  selectedMinRating?: number;
  selectedMaxRating?: number;
  onRatingChange: (min?: number, max?: number) => void;
  selectedPeriod: "day" | "week" | "";
  onTrendChange: (period: "day" | "week" | "") => void;
  onReset: () => void;
}

export interface FilterGenresProps {
  selectedGenres: string[];
  onChange: (selectedGenres: string[]) => void;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterTrendingProps {
  selectedPeriod: "day" | "week" | "";
  onChange: (period: "day" | "week" | "") => void;
}

export interface FilterRatingProps {
  selectedMinRating?: number;
  selectedMaxRating?: number;
  onChange: (min?: number, max?: number) => void;
}

export interface FilterSectionProps {
  icon: LucideIcon;
  title: string;
  selectedLabel?: string | null;
  children: ReactNode;
}
