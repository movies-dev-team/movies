import { useState, useEffect } from "react";
import { getPopularMovies, getMoviesByGenre } from "../services/movieService";

import type { Movie } from "@/shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import FilterGenres from "../components/FilterGenres";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    genre: "",
    minRating: undefined as number | undefined,
    maxRating: undefined as number | undefined,
    trend: "",
  });

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const data = filters.genre
          ? await getMoviesByGenre(filters.genre)
          : await getPopularMovies();

        setMovies(data.results);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [filters.genre]);

  return (
    <main className="p-4 md:p-6">
      
      <h1 className="mb-6 text-2xl font-bold">{content.catalog.title}</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <div className="rounded-xl border border-border-hover bg-gradient-panel p-3 shadow-medium">
            <div className="mb-3 flex items-center gap-2 border-b border-border-hover pb-3">
              <SlidersHorizontal className="size-5 text-brand-light" />
              <h2 className="text-lg font-semibold">
                {content.filters.filterTitle}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <FilterGenres
                selectedGenres={filters.genre ? [filters.genre] : []}
                onChange={(values) =>
                  setFilters((prev) => ({
                    ...prev,
                    genre: values[0] ?? "",
                  }))
                }
              />
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {loading ? (
            <p>{content.loading.generic}</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : movies.length === 0 ? (
            <p>{content.filters.filterError} </p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <li key={movie.id} className="min-w-0">
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
