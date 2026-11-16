import { useState, useEffect } from 'react'
import { getPopularMovies } from '../services/movieService'
import type { Movie } from '../../../shared/types/movie'
import MovieCard from '@/shared/components/MovieCard'

export default function CatalogPage() {

  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getPopularMovies();
        setMovies(data);
        console.log('Películas recibidas:', data)
      } catch (error) {
        console.error(error);
      }
    }
      loadMovies();
  }, []);

  return (
    <div>
      <h1>Movies</h1>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.poster_path && ( 
              <MovieCard
                movie={movie}
               />
              )}
            </li>
           ))}
        </ul>
    </div>
  )
}