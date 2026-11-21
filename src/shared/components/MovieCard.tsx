import type { Movie } from "../types/movie";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import content from "@/data/content.json";
import MovieRatingAPI from "./MovieRatingAPI";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isFavorite, toggleFavorite, updatingIds } = useFavoritesContext();

  const favorite = isFavorite(movie.id);
  const isUpdating = updatingIds.includes(movie.id);

  async function handleToggleFavorite() {
    if (isUpdating) return;

    await toggleFavorite(movie.id);

    if (favorite) {
      toast(content.favorites.removed);
    } else {
      toast.success(content.favorites.added);
    }
  }

  return (
    <Card className="relative w-full h-full gap-0 p-0 hover:-translate-y-0.5 hover:brightness-110">
      <Button
        type="button"
        variant="glass"
        size="icon-sm"
        onClick={handleToggleFavorite}
        disabled={isUpdating}
        aria-label={
          favorite
            ? content.favorites.removeLabel
            : content.favorites.addLabel
        }
        aria-pressed={favorite}
        className="absolute right-2 top-2 z-10 border-0 transition-transform duration-200 hover:scale-110"
      >
        <Heart
          className={`size-5 transition-all duration-200 ${
            favorite
              ? "fill-brand-primary text-brand-light stroke-0 drop-shadow-brand-glow"
              : "text-white"
          }`}
        />
      </Button>

      <Link to={`/app/movie/${movie.id}`} className="block">
        <img
          className="w-full aspect-3/4 object-cover"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : undefined
          }
          alt={movie.title}
        />
      </Link>

      <CardContent className="p-4">
        <CardTitle className="text-base font-semibold leading-snug">
          {movie.title}
        </CardTitle>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-base text-muted-foreground">
            {movie.release_date?.slice(0, 4)}
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