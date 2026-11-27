import type { Movie } from "../../features/catalog/types/movieService";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router";
import MovieRatingAPI from "./MovieRatingAPI";
import FavoriteButton from "@/shared/components/FavoriteButton";
import content from "@/data/content.json";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card className="relative w-full h-full gap-0 p-0 hover:-translate-y-0.5 hover:brightness-110">
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton movieId={movie.id} />
      </div>
      <Link to={`/app/movie/${movie.id}`} className="block">
        {movie.poster_path ? (
          <img
            className="w-full aspect-3/4 object-cover"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex w-full aspect-3/4 items-center justify-center bg-muted text-sm text-muted-foreground">
            {content.movieCard.no_image}
          </div>
        )}
      </Link>

      <CardContent className="p-4">
        <CardTitle className="min-h-12 line-clamp-2 text-base font-semibold leading-snug">
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
