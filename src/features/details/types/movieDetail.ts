import type { CastMember, CrewMember } from "./movieCredits";
import type { MovieGenre } from "@/features/catalog/types/movieService";

export interface MovieDetail {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  id: number;
  genres: MovieGenre[];
  original_language: string;
  original_title: string;
  title: string;
  overview: string;
  poster_path: string | null;
  origin_country: string[];
  production_companies: MovieProductionCompany[];
  release_date: string;
  runtime: number | null;
  vote_average: number;
}

export interface MovieProductionCompany {
  id: number;
  name: string;
}
