import { tmdbApi } from "../shared/services/tmdbApi";

export async function getPopularMovies() {

  const response = await tmdbApi.get('movie/popular', {
    params :{
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      language: 'es-ES',
      page: 1
  }});

    return response.data.results
}