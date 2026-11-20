export interface CatalogFiltersProps {
  selectedGenre: string;
  onGenreChange: (values: string[]) => void;
  selectedMinRating?: number;
  selectedMaxRating?: number;
  onRatingChange: (min: number, max: number) => void;
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
