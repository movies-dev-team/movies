import { useEffect, useState } from "react";
import { Clapperboard } from "lucide-react";

import Filter from "@/shared/components/Filter";
import { getMovieGenres } from "../services/movieService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import type { Genre } from "@/shared/types/movie";
import type { FilterGenresProps } from "../types/CatalogFilters";
import type { FilterOption } from "@/shared/types/filter";
import content from "@/data/content.json";

export default function FilterGenres({
  selectedGenres,
  onChange,
}: FilterGenresProps) {
  const [genres, setGenres] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data: Genre[] = await getMovieGenres();

        const options = data.map((genre) => ({
          label: genre.name,
          value: String(genre.id),
        }));

        setGenres(options);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  return (
    <Filter
      title={content.filters.filterGenres}
      icon={Clapperboard}
      options={genres}
      selectedValues={selectedGenres}
      onChange={onChange}
      loading={loading}
      emptyMessage={
        error ??
        (genres.length === 0 ? "No hay géneros disponibles." : undefined)
      }
    />
  );
}
