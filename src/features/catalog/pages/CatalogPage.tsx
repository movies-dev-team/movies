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
import { toast } from "sonner";

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

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
        setPage(1);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [filters]);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      setError(null);

      const nextPage = page + 1;
      const data = await getMovies(filters, nextPage);

      if (data.results.length === 0) {
        toast.info(content.loading.noMoreMovies);
        return;
      }

      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoadingMore(false);
    }
  };

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
            <>
              <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                {movies.map((movie) => (
                  <li key={movie.id} className="min-w-0">
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-6 cursor-pointer text-sm font-semibold text-brand-light hover:underline disabled:opacity-50"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore
                  ? content.loading.loadingMore
                  : content.loading.loadMore}
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
