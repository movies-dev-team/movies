import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";


export default function MovieDetailPage() {

  const { id } = useParams();
  const movieId = 1368337;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
 
  useEffect(() => {

    let ignore = false;

    async function loadMovies() {
      setMovie(null);
      setLoading(true);
      setError(false);

      try {
        if (!Number.isInteger(movieId) || movieId <= 0) {
          setError(true);
          return;
        }

        const data = await getMovieDetail(movieId);
        console.log('Detalle:', data)
        console.log("Overview recibido:", data.overview);
        
        if (!ignore) {
          setMovie(data);
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

    loadMovies();

    return () => {
      ignore = true;
    };
  },[movieId]);

  if (loading) {
    return <p>Cargando película...</p>;
  }
  if (error) {
    return <p>Error cargando película...</p>
  } 
  if (!movie) { 
    return <p>Película no encontrada</p>
  }

  const actors = movie.credits.cast;
  const director = movie.credits.crew.find(
    (crew) => crew.job === "Director"
  )

  return (
    <div>
      <h1>{movie.original_title}</h1>
      {movie.poster_path && <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={`Poster of ${movie.original_title}`}
      />}
      <p>{movie.release_date.slice(0, 4)}</p>
      <h2>{movie.overview}</h2>
      <p>
        Director: {director?.name ?? "Desconocido"}
      </p>
      <h2>Reparto: </h2>
        {actors.slice(0, 3).map((actor) => {
          return (
            <div key={actor.id}>
              {actor.profile_path && (
                <img
                src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                alt={`Foto de ${actor.name}`}
                />
              )}
              <p>{actor.name}</p>
              <p>Personaje: {actor.character}</p>
            </div>
          );
        })}
    </div> 
  )
}

