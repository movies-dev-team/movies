import type { MoviesResponse } from "@/features/catalog/types/movieService";
import type { MovieBackdrop } from "@/features/catalog/types/movieCarouselService";

import { getData } from "@/shared/services/tmdbService";

export function getNowPlayingMovies(): Promise<MoviesResponse> {
  return getData("movie/now_playing", { region: "ES" });
}

export async function getMovieBackdropImages(
  movieId: number,
): Promise<{ backdrops: MovieBackdrop[] }> {
  return getData(`movie/${movieId}/images`, {
    include_image_language: "es,null",
  });
}
