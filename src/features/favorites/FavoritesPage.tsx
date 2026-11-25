import { useEffect, useState } from "react";
import type { Movie } from "@/features/catalog/types/movieService";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useFavoritesContext } from "./hooks/useFavoritesContext";
import { getMovieById } from "@/features/catalog/services/movieService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import favoritesBanner from "@/assets/images/cinea-favoritos-banner2.webp";
import content from "@/data/content.json";

export default function FavoritesPage() {
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
  } = useFavoritesContext();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      if (favoritesLoading) return;

      if (favorites.length === 0) {
        setMovies([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await Promise.all(
          favorites.map((movieId) => getMovieById(movieId)),
        );

        if (active) {
          setMovies(data);
        }
      } catch (err) {
        if (active) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, [favorites, favoritesLoading]);

  return (
    <main className="w-full">
      <section className="relative mx-4 mt-6 flex min-h-52 items-start overflow-hidden rounded-2xl border border-purple-800/60 sm:min-h-80 md:min-h-96 lg:min-h-90 lg:items-center">
        <img
          src={favoritesBanner}
          alt={content.favorites.bannerAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#100019]/90 via-[#100019]/65 to-transparent lg:from-transparent lg:via-transparent" />

        <div className="relative z-10 flex max-w-3xl flex-col gap-3 px-6 pt-10 text-white sm:px-10 sm:pt-14 md:px-16 lg:gap-5 lg:px-24 lg:pt-0 lg:translate-y-20">
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-10 w-10 shrink-0 text-purple-400 drop-shadow-[0_0_8px_#a855f7] sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {content.favorites.pageTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className="min-w-0 p-4 md:p-6">
        {favoritesLoading || loading ? (
          <p role="status" aria-live="polite">
            {content.favorites.loading}
          </p>
        ) : favoritesError || error ? (
          <ErrorMessage message={favoritesError || error || ""} />
        ) : movies.length === 0 ? (
          <p>{content.favorites.empty}</p>
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
    </main>
  );
}
