
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
import content from "@/data/content.json";
import MovieRatingAPI from "./MovieRatingAPI";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="relative w-full h-full gap-0 p-0 hover:-translate-y-0.5 hover:brightness-110">
      <Button
        type="button"
        variant="glass"
        size="icon-sm"
        onClick={() => {
          const newFavoriteState = !isFavorite;

          setIsFavorite(newFavoriteState);

          if (newFavoriteState) {
            toast.success(content.favorites.added);
          } else {
            toast(content.favorites.removed);
          }
        }}
        aria-label={
          isFavorite
            ? content.favorites.removeLabel
            : content.favorites.addLabel
        }
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
          className="w-full aspect-3/4 object-cover"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>

      <CardContent className="p-4">
        <CardTitle className="text-base font-semibold leading-snug">
          {movie.title}
        </CardTitle>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-base text-muted-foreground">
            {movie.release_date.slice(0, 4)}
          </span>

          <MovieRatingAPI rating={movie.vote_average} />
        </div>

        <CardDescription className="mt-3 line-clamp-3 text-base leading-relaxed">
          Sinopsis: {movie.overview}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
