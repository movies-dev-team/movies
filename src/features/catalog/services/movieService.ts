import { tmdbApi } from "../../../shared/services/tmdbApi";
import type { MoviesResponse, Genre } from "@/shared/types/movie";

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

export function getPopularMovies(): Promise<MoviesResponse> {
  return getData("movie/popular");
}

export function getMoviesByGenre(
  genreId: string,
  page: number = 1,
): Promise<MoviesResponse> {
  return getData("discover/movie", { with_genres: genreId }, page);
}

export async function getMovieGenres(): Promise<Genre[]> {
  const data = await getData("genre/movie/list");
  return data.genres;
}
