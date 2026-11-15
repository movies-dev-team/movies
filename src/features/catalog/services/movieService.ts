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

