import type { Movie } from "../types/movieService";

export function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function validateSearch(value: string): boolean {
  return value.length > 0;
}

export function filterMoviesByTitle(movies: Movie[], query: string): Movie[] {
  const normalizedQuery = normalizeSearch(query);

  return movies.filter((movie) =>
    normalizeSearch(movie.title).includes(normalizedQuery),
  );
}
