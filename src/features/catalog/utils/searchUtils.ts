import type { Movie } from "../types/movieService";
import type { CatalogFilterValues } from "../types/CatalogFilters";

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

export function filterSearchResults(
  movies: Movie[],
  filters: CatalogFilterValues,
): Movie[] {
  return movies.filter((movie) => {
    const matchesGenre =
      !filters.genre ||
      movie.genre_ids.includes(Number(filters.genre));

    const matchesRating =
      (filters.minRating === undefined ||
        movie.vote_average >= filters.minRating) &&
      (filters.maxRating === undefined ||
        movie.vote_average <= filters.maxRating);

    return matchesGenre && matchesRating;
  });
}