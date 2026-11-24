import { getData } from "@/shared/services/tmdbService";
import type { MoviesResponse } from "../types/movieService";

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<MoviesResponse> {
  return getData(
    "search/movie",
    {
      query,
      include_adult: false,
    },
    page,
  );
}
