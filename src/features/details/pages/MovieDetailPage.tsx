import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";
import content from "@/data/content.json";
import { MAX_VISIBLE_GENRES, MAX_VISIBLE_CAST } from '../../../shared/constants/movieConstants'
import { Star } from 'lucide-react'

export default function MovieDetailPage() {

  const { id } = useParams();
  const movieId = Number(id);

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
    (crew) => crew.job === "Director");
  const runtime = movie.runtime ?? 0;
  const hours = Math.floor((runtime) / 60 );
  const minutes = runtime % 60;
  
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <section className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          {movie.poster_path && <img
            className="aspect-[2/3] w-full rounded-xl object-cover"
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={`Póster de la película ${movie.original_title}`}
          />}
        </div>
        <div className="col-span-3 min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-4xl">
            {movie.title}
          </h1>  
          {(Boolean(movie.release_date) || runtime > 0) && (
            <p>
              {movie.release_date && movie.release_date.slice(0, 4)}
              {movie.release_date && runtime > 0 && " · "}
              {runtime > 0 && `${hours} h ${minutes} min`}
            </p>
          )}
          {movie.vote_average > 0 ? (
            <div className="flex items-center gap-2">
              <Star
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
              <p>{movie.vote_average.toFixed(1)}
                <span className="text-text-secondary"> / 10</span>
              </p>
            </div>
          ) : ( <p>{content.movieDetail.noRating}</p> 
          )}
          {movie.genres.length > 0 && (
            <p className="mt-2 text-sm text-text-secondary">
              {movie.genres.slice(0, MAX_VISIBLE_GENRES).map((genre) => genre.name).join(" · ")}
            </p>
          )}
        </div> 
      </section>
      <section aria-labelledby="synopsis-title">
        <h2 id="synopsis-title">
          {content.movieDetail.synopsis}
        </h2>
        <p>
          {movie.overview}
        </p>
      </section>
      <p>Director:
        {director? 
        (<Link to={`/app/director/${director.id}`}>
          {director.name}
        </Link>) : "Desconocido"}
      </p>
      <h2>Reparto: </h2>
        {actors.slice(0, MAX_VISIBLE_CAST).map((actor) => {
          return (
            <div key={actor.id}>
              <Link to={`/app/actor/${actor.id}`}>
                {actor.profile_path && ( 
                <img
                  src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                  alt={`Foto de ${actor.name}`}
                />
                )}
                <p>{actor.name}</p>
                <p>Personaje: {actor.character}</p>
              </Link>
            </div>
          );
        })}
    </div> 
  )
}

