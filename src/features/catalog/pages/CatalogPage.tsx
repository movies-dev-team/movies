import { useState, useEffect } from "react";
import type { Movie } from "@/shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import type { CatalogFilterValues } from "../types/CatalogFilters";
import CatalogFilters from "../components/CatalogFilters";
import { getMovies } from "../services/movieService";
import MovieCarousel from "../components/MovieCarousel";

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CatalogFilterValues>({
    genre: "",
    minRating: undefined,
    maxRating: undefined,
    trend: "",
  });

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMovies(filters);

        setMovies(data.results);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [filters]);
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
      <MovieCarousel />
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <CatalogFilters
          selectedGenre={filters.genre}
          onGenreChange={(values) =>
            setFilters((prev) => ({
              ...prev,
              genre: values[0] ?? "",
            }))
          }
          selectedMinRating={filters.minRating}
          selectedMaxRating={filters.maxRating}
          onRatingChange={(min, max) =>
            setFilters((prev) => ({
              ...prev,
              minRating: min,
              maxRating: max,
            }))
          }
          selectedPeriod={filters.trend}
          onTrendChange={(period) =>
            setFilters((prev) => ({
              ...prev,
              trend: period,
            }))
          }
          onReset={handleReset}
        />

        <section className="min-w-0 flex-1">
          <h1 className="mb-3 text-xl md:text-2xl">{content.catalog.title}</h1>

          {loading ? (
            <p>{content.loading.generic}</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : movies.length === 0 ? (
            <p role="status">{content.filters.noResults}</p>
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
