import { useEffect, useState } from "react";
import type { Movie } from "@/shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useFavoritesContext } from "./hooks/useFavoritesContext";
import { getMovieById } from "@/features/catalog/services/movieService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

export default function FavoritesPage() {
  const { favorites, loading: favoritesLoading, error: favoritesError } =
    useFavoritesContext();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      if (favoritesLoading) return;

      if (favorites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await Promise.all(
          favorites.map((movieId) => getMovieById(movieId))
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
    <main className="p-4 md:p-6">
      <section className="min-w-0">
        <h1 className="mb-6 text-2xl">Mis películas favoritas</h1>

        {favoritesLoading || loading ? (
          <p>Cargando favoritos...</p>
        ) : favoritesError || error ? (
          <ErrorMessage message={favoritesError || error || ""} />
        ) : movies.length === 0 ? (
          <p>Todavía no has añadido ninguna película a favoritos.</p>
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