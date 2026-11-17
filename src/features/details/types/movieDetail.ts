import type { CastMember, CrewMember } from "./movieCredits";

export interface MovieDetail {
  id: number;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  original_language: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  }
}