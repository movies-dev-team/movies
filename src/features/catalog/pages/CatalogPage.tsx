import { useState, useEffect } from "react";
import { getPopularMovies, getMoviesByGenre } from "../services/movieService";

import type { Movie } from "@/shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import FilterGenres from "../components/FilterGenres";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <aside className="w-full shrink-0 md:mt-10 md:w-60">
          <div className="rounded-xl border border-border/30 bg-card/40 p-4 shadow-none">
            <div className="mb-4 flex items-center gap-2 justify-between">
              <SlidersHorizontal className="size-5 text-brand-light " />

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Restaurar filtros"
                    className="text-muted-foreground transition-all duration-90 hover:scale-90 hover:bg-brand-primary/5 hover:text-brand-light hover:shadow-[0_0_4px_var(--color-brand-primary)]"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="border border-border/40 bg-card text-foreground shadow-md"
                >
                  Restaurar filtros
                </TooltipContent>
              </Tooltip>
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
          <h1 className="mb-3 text-xl ">{content.catalog.title}</h1>

          {loading ? (
            <p>{content.loading.generic}</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : movies.length === 0 ? (
            <p>{content.filters.filterError} </p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
