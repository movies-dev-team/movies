import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPersonDetail } from "../services/personDetailService";
import type { PersonDetail } from "../types/personDetail"; 

export default function DirectorDetailPage() {

  const { id } = useParams();
  const directorId = Number(id);

  const [director, setDirector] = useState<PersonDetail | null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    let ignore = false;

    async function loadDirector() {
      setDirector(null);
      setLoading(true);
      setError(false);
    
      try {
        if (!Number.isInteger(directorId) || directorId <= 0) {
            setError(true);
            return;
          }

        const data = await getPersonDetail(directorId);
        console.log('Detalle de director:', data);

        if (!ignore) {
          setDirector(data);
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
    loadDirector();
    return () => {
      ignore = true;
    };
  },[directorId]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }
  if (error) {
    return <p>Error cargando datos...</p>
  } 
  if (!director) { 
    return <p>Director/a no encontrado/a</p>
  }

  return (
    <div>
      {director.profile_path && ( <img
        src={`https://image.tmdb.org/t/p/w300${director.profile_path}`}
        alt={`Foto de ${director.name}`}
        />
      )}
      <h1>
        {director.name}
      </h1>
      <p>{director.biography}</p> 
    </div>
  )
}