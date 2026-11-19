import type { Movie } from "../types/movie";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="relative w-full h-full overflow-hidden gap-0 p-0">
      <Button
        type="button"
        variant="glass"
        size="icon-sm"
        onClick={() => setIsFavorite((prev) => !prev)}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        aria-pressed={isFavorite}
        className="absolute right-2 top-2 z-10 border-0 transition-transform duration-200 hover:scale-110"
      >
        <Heart
          className={`size-5 transition-all duration-200 ${
            isFavorite
              ? "fill-brand-primary text-brand-light stroke-0 drop-shadow-brand-glow"
              : "text-white"
          }`}
        />
      </Button>

      <Link to={`/app/movie/${movie.id}`} className="block">
        <img
          className="w-full aspect-2/3 object-cover"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>

      <CardContent className="p-3">
        <CardTitle>{movie.title}</CardTitle>

        {movie.release_date.slice(0, 4)}

        <CardDescription>Sinopsis: {movie.overview}</CardDescription>
      </CardContent>
    </Card>
  );
}
