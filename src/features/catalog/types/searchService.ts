import { getData } from "@/shared/services/tmdbService";
import type { MoviesResponse } from "../types/movieService";

export function searchMovies(
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



export interface MovieSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}