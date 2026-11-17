import type { Movie } from '../types/movie'
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';

interface MovieCardProps {
 movie: Movie;
}

export default function MovieCard({movie}: MovieCardProps) {
  return (
    <Link to={`/app/movie/${movie.id}`}>
      <Card className="w-64">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          />
        <CardContent>
        <CardTitle>{movie.title}</CardTitle>
          {movie.release_date.slice(0, 4)}
        <CardDescription>
          Sinopsis: {movie.overview}
        </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}