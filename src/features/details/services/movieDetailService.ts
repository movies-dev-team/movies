import { tmdbApi } from '../../../shared/services/tmdbApi'
import type { MovieDetail } from '../types/movieDetail';


export async function getMovieDetail(id: number): Promise<MovieDetail> {

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