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
