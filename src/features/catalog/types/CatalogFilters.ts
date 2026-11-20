export interface CatalogFiltersProps {
  selectedGenre: string;
  onGenreChange: (values: string[]) => void;
  onReset: () => void;
}

export interface FilterGenresProps {
  selectedGenres: string[];
  onChange: (selectedGenres: string[]) => void;
}
