import { tmdbApi } from "@/shared/services/tmdbApi";
import type { MovieTrailer, MovieTrailerResponse } from "../types/movieTrailer";

export async function getMovieTrailer(movie_id: number): Promise<MovieTrailer | null> {

  const response = await tmdbApi.get<MovieTrailerResponse>(`movie/${movie_id}/videos`, {
    params: {
      language:'es-ES',
    }
  });

  const trailer = response.data.results.find((video) =>
    video.type === "Trailer" && 
    video.official === true && 
    video.site === "YouTube"
  )

  if(trailer) {
    return trailer;
  }

  const secondCall = await tmdbApi.get<MovieTrailerResponse>(`movie/${movie_id}/videos`, {
    params: {
      language:'en-US',
    }
  });

  const alternativeTrailer = secondCall.data.results.find((video) =>
    video.type === "Trailer" && 
    video.official === true && 
    video.site === "YouTube"
  )

  if(alternativeTrailer) {
    return alternativeTrailer;
  }

  return null; 
}






