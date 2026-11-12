import { useState, useEffect } from 'react'
import { getPopularMovies } from './features/movieService'
import type { Movie } from './features/movie'
import './App.css'

function App() {

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
      <section id="center">
        <h1>Movies</h1>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.poster_path && ( <img 
                src={
                  `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
                alt={movie.title}
              />
              )}
              <p>Title: {movie.title}</p>
              <p>Year: {movie.release_date.slice(0, 4)}</p>
              <p>Overview: {movie.overview}</p>
            </li>
           ))}
        </ul>
      </section>
  )
}

export default App

 

