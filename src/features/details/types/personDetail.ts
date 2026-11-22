export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  imdb_id: string | null;
  known_for_department: string;
  movie_credits: {
    cast: PersonMovieCredit[];
    crew: PersonCrewCredit[];
  }
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
}

export interface PersonCrewCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  job: string;
  department: string;
}