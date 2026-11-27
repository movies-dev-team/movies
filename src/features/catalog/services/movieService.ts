import type {
  MoviesResponse,
  Movie,
} from "@/features/catalog/types/movieService";
import type { CatalogFilterValues } from "../types/CatalogFilters";
import { getData } from "@/shared/services/tmdbService";

export async function getMovieGenres(): Promise<
  { id: number; name: string }[]
> {
  const data = await getData("genre/movie/list");
  return data.genres;
}

export function getTrendingMovies(
  period: "day" | "week",
  page: number = 1,
): Promise<MoviesResponse> {
  return getData(`trending/movie/${period}`, {}, page);
}

export function getMovieById(movieId: number): Promise<Movie> {
  return getData(`movie/${movieId}`);
}

function getMovieFilterParams(
  filters: CatalogFilterValues,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    sort_by: "popularity.desc",
    "vote_count.gte": 100,
  };

  if (filters.genre) {
    params.with_genres = filters.genre;
  }

  if (filters.minRating !== undefined && filters.maxRating !== undefined) {
    params["vote_average.gte"] = filters.minRating;
    params["vote_average.lte"] = filters.maxRating;
  }

  return params;
}

export async function getMovies(
  filters: CatalogFilterValues,
  page: number = 1,
): Promise<MoviesResponse> {
  if (filters.trend) {
    const data = await getTrendingMovies(filters.trend, page);

    const filteredMovies = data.results.filter((movie) => {
      const matchesGenre =
        !filters.genre || movie.genre_ids.includes(Number(filters.genre));

      const matchesRating =
        filters.minRating === undefined ||
        filters.maxRating === undefined ||
        (movie.vote_average >= filters.minRating &&
          movie.vote_average <= filters.maxRating);

      return matchesGenre && matchesRating;
    });

    return { ...data, results: filteredMovies };
  }

  const params = getMovieFilterParams(filters);

  return getData("discover/movie", params, page);
}
