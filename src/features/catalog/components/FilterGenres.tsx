import { useEffect, useState } from "react";
import { Clapperboard } from "lucide-react";
import { getMovieGenres } from "../services/movieService";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import type { MovieGenre } from "@/features/catalog/types/movieService";
import type { FilterGenresProps, FilterOption } from "../types/CatalogFilters";
import content from "@/data/content.json";
import { getOptionClass } from "../utils/getOptionClass";
import FilterSection from "./FilterSection";

export default function FilterGenres({
  selectedGenres,
  onChange,
  isOpen,
  onToggle,
}: FilterGenresProps) {
  const [genres, setGenres] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data: MovieGenre[] = await getMovieGenres();

        const options = data.map((genre) => ({
          label: genre.name,
          value: String(genre.id),
        }));

        setGenres(options);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  function handleChange(optionValue: string) {
    const isSelected = selectedGenres.includes(optionValue);
    onChange(isSelected ? [] : [optionValue]);
  }

  const selectedLabel = genres.find(
    (genre) => genre.value === selectedGenres[0],
  )?.label;

  return (
    <FilterSection
      icon={Clapperboard}
      title={content.filters.filterGenres}
      selectedLabel={selectedLabel}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {loading ? (
        <p role="status" className="col-span-2 text-base text-muted-foreground">
          {content.filters.genresLoading}
        </p>
      ) : genres.length === 0 ? (
        <div className="col-span-2">
          <ErrorMessage message={error ?? content.filters.genresEmpty} />
        </div>
      ) : (
        genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.value);

          return (
            <Button
              key={genre.value}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "secondary"}
              aria-pressed={isSelected}
              onClick={() => handleChange(genre.value)}
              className={getOptionClass(isSelected)}
            >
              {genre.label}
            </Button>
          );
        })
      )}
    </FilterSection>
  );
}
