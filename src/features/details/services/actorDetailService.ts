import { tmdbApi } from '../../../shared/services/tmdbApi'
import type { ActorDetail } from '../types/actorDetail';


export async function getActorDetail(person_id: number): Promise<ActorDetail> {

  const response = await tmdbApi.get(`person/${person_id}`, {
    params :{
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      append_to_response:'movie_credits',
      language:'en-US',
    }
  }); 
    return response.data
}
