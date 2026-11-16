import { tmdbApi } from "../../../shared/services/tmdbApi";
import type { Movie } from "../../../shared/types/movie";

export async function getPopularMovies(): Promise<Movie[]> {
  const response = await tmdbApi.get("movie/popular", {
    params: {
      language: "es",
      page: 1,
    },
  });

  return response.data.results;
}
