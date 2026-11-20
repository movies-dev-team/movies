import { useState, useEffect, useCallback } from "react";
import { getPopularMovies, getMoviesByGenre } from "../services/movieService";

import type { Movie } from "@/shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import CatalogFilters from "../components/CatalogFilters";
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

  const handleFilterError = useCallback((error: unknown) => {
    toast.error(getApiErrorMessage(error));
  }, []);

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
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [filters.genre]);

  const handleReset = () => {
    setFilters({
      genre: "",
      minRating: undefined,
      maxRating: undefined,
      trend: "",
    });
  };

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <CatalogFilters
          selectedGenre={filters.genre}
          onGenreChange={(values) =>
            setFilters((prev) => ({
              ...prev,
              genre: values[0] ?? "",
            }))
          }
          onReset={handleReset}
          onError={handleFilterError}
        />

        <section className="min-w-0 flex-1">
          <h1 className="mb-3 text-xl">{content.catalog.title}</h1>

          {loading ? (
            <p>{content.loading.generic}</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : movies.length === 0 ? (
            <p>{content.filters.filterError}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
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
