import { tmdbApi } from '../../../shared/services/tmdbApi'
import type { PersonDetail } from '../types/personDetail'; 


export async function getPersonDetail(person_id: number): Promise<PersonDetail> {

  const response = await tmdbApi.get<PersonDetail>(`person/${person_id}`, {
    params :{
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      append_to_response:'movie_credits',
      language:'es-ES',
    }
  }); 
    return response.data
}
