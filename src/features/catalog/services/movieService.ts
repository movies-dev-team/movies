import { tmdbApi } from "../../../shared/services/tmdbApi";
import type {
  MoviesResponse,
  Movie,
  MovieBackdrop,
} from "@/shared/types/movie";

import type { CatalogFilterValues } from "../types/CatalogFilters";

async function getData(endpoint: string, params = {}, page: number = 1) {
  const response = await tmdbApi.get(endpoint, {
    params: {
      language: "es-ES",
      page,
      ...params,
    },
  });
  return response.data;
}

export function getTrendingMovies(
  period: "day" | "week",
): Promise<MoviesResponse> {
  return getData(`trending/movie/${period}`);
}

export async function getMovies(
  filters: CatalogFilterValues,
): Promise<MoviesResponse> {
  if (filters.trend) {
    const data = await getTrendingMovies(filters.trend);

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

  return getData("discover/movie", params);
}

export async function getMovieGenres(): Promise<
  { id: number; name: string }[]
> {
  const data = await getData("genre/movie/list");
  return data.genres;
}
export function getMovieById(movieId: number): Promise<Movie> {
  return getData(`movie/${movieId}`);
}

export function getNowPlayingMovies(): Promise<MoviesResponse> {
  return getData("movie/now_playing", { region: "ES" });
}

export async function getMovieBackdropImages(
  movieId: number,
): Promise<{ backdrops: MovieBackdrop[] }> {
  return getData(`movie/${movieId}/images`, {
    include_image_language: "es,null",
  });
}
