export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  original_language: string;
  genre_ids: number[];
  vote_average: number;
}

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}
export interface Genre {
  id: number;
  name: string;
}
