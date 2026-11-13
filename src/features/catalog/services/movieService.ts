import { tmdbApi } from '../../../shared/services/tmdbApi'
import type { Movie } from '../../../shared/types/movie'

export async function getPopularMovies(): Promise<Movie[]> {

  const response = await tmdbApi.get('movie/popular', {
    params :{
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      language: 'en-US',
      page: 1
  }});

    return response.data.results
}

export async function getMovieDetail(id: number): Promise<Movie> {

  const response = await tmdbApi.get(`movie/${id}`, {
    params :{
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      append_to_response:'images, credits',
      language:'en-US',
      include_image_language:'en-US,null'
    }
  });
    return response.data
}