import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";

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
    return <p>Loading movie...</p>;
  }
  if (error) {
    return <p>Error loading movie...</p>
  } 
  if (!movie) { 
    return <p>Movie not found</p>
  }

  return (
    <div>
      <h1>{movie.original_title}</h1>
      {movie.poster_path && <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={`Poster of ${movie.original_title}`}
      />}
      <p>Release year: {movie.release_date.slice(0, 4)}</p>
      <h2>Overview: {movie.overview}</h2>
    </div> 
  )
}

