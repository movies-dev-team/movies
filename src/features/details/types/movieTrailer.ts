export interface MovieTrailer {
  id: string;
  key: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  official: boolean;
  site: string;
  type: string;
}

export interface MovieTrailerResponse {
  id: number;
  results: MovieTrailer[];
}