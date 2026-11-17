
import { useState, useEffect } from "react";
import { getPopularMovies } from "../services/movieService";
import type { Movie } from "../../../shared/types/movie";
import MovieCard from "@/shared/components/MovieCard";
import ErrorMessage from "@/shared/components/ErrorMessage";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPopularMovies();
        setMovies(data);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading) {
    return <p>{content.loading.generic}</p>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (movies.length === 0) {
    return <p>{content.errors.notFound}</p>;
  }

  return (
    <main>
      <section>
        <h1>{content.catalog.title}</h1>

        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
