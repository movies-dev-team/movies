export interface CatalogFiltersProps {
  selectedGenre: string;
  onGenreChange: (values: string[]) => void;
  onReset: () => void;
  onError: (error: unknown) => void;
}

export interface FilterGenresProps {
  selectedGenres: string[];
  onChange: (selectedGenres: string[]) => void;
  onError: (error: unknown) => void;
}
