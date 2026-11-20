
import { useEffect, useState } from "react";
import { Clapperboard } from "lucide-react";

import Filter from "@/shared/components/Filter";
import { getMovieGenres } from "../services/movieService";

import type { Genre } from "@/shared/types/movie";
import type { FilterGenresProps } from "../types/CatalogFilters";
import type { FilterOption } from "@/shared/types/filter";
import content from "@/data/content.json";

export default function FilterGenres({
  selectedGenres,
  onChange,
  onError,
}: FilterGenresProps) {
  const [genres, setGenres] = useState<FilterOption[]>([]);

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
        onError(error);
      }
    }

    loadGenres();
  }, [onError]);

  return (
    <Filter
      title={content.filters.filterGenres}
      icon={Clapperboard}
      options={genres}
      selectedValues={selectedGenres}
      onChange={onChange}
    />
  );
}
