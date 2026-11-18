import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPersonDetail } from "../services/personDetailService";
import type { PersonDetail } from "../types/personDetail"; 


export default function ActorDetailPage() {

  const { id } = useParams();
  const actorId = Number(id);

  const [actor, setActor] = useState<PersonDetail | null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    let ignore = false;

    async function loadActor() {
      setActor(null);
      setLoading(true);
      setError(false);
    
      try {
        if (!Number.isInteger(actorId) || actorId <= 0) {
            setError(true);
            return;
          }

        const data = await getPersonDetail(actorId);
        console.log('Detalle de actor:', data);

        if (!ignore) {
          setActor(data);
        }  

      } catch (error) {
        if (!ignore) {
          setError(true);
          console.error(error);
        }    
      } finally {
        if(!ignore) {
          setLoading(false);
        }
      }
    }
    loadActor();
    return () => {
      ignore = true;
    };
  },[actorId]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }
  if (error) {
    return <p>Error cargando datos...</p>
  } 
  if (!actor) { 
    return <p>Actor/Actriz no encontrado/a</p>
  }

  return (
    <div>
      {actor.profile_path && ( <img
        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
        alt={`Foto de ${actor.name}`}
        />
      )}
      <h1>
        {actor.name}
      </h1>
      <p>{actor.biography}</p> 
    </div>
  )
}



