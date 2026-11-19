import type { Movie } from "../types/movie";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/app/movie/${movie.id}`} className="block h-full">
      <Card className="w-full h-full overflow-hidden">
        <img
          className="w-full aspect-2/3 object-cover"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        <CardContent className="p-3">
          <CardTitle>{movie.title}</CardTitle>

          {movie.release_date.slice(0, 4)}

          <CardDescription>Sinopsis: {movie.overview}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
