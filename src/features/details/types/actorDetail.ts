export interface ActorDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  imdb_id: string | null;
  known_for_department: string;
}