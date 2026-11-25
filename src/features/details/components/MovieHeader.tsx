import MovieRatingControl from "./MovieRatingControl";
import content from "@/data/content.json";
import { Card } from "@/components/ui/card";
import FavoriteButton from "@/shared/components/FavoriteButton";
import { Star } from "lucide-react";
import { MAX_VISIBLE_GENRES } from "@/shared/constants/movieConstants";
import type { MovieDetail } from "../types/movieDetail";

interface MovieHeaderProps {
movie: MovieDetail;
}

export default function MovieHeader({movie}: MovieHeaderProps) {

  const runtime = movie.runtime ?? 0;
  const hours = Math.floor((runtime) / 60 );
  const minutes = runtime % 60;

  return (
    <>
      <Card className="relative col-span-2 w-full min-w-0 max-w-[160px] gap-0 overflow-hidden p-0 self-start md:col-span-1 md:row-span-2 md:max-w-xs">
        {movie.poster_path && (
        <img
          className="aspect-2/3 w-full rounded-xl object-cover"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={`Póster de la película ${movie.original_title}`}
        />
        )}
        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton movieId={movie.id} />
        </div>
      </Card>
      <div className="col-span-3 min-w-0 md:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-4xl">
              {movie.title}
          </h1>
        </div> 
        {runtime > 0 && (
          <p>
            {hours}h {minutes}min
          </p>
        )}
        {movie.vote_average > 0 ? ( 
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          <p>{movie.vote_average.toFixed(1)}
            <span className="text-text-secondary"> 
              / 10
            </span>
          </p>
        </div>
        ) : ( <p>{content.movieDetail.noRating}</p> 
        )}
        {movie.genres.length > 0 && (
          <p className="mt-2 text-sm text-text-secondary">
            {movie.genres.slice(0, MAX_VISIBLE_GENRES).map((genre) => genre.name).join(" · ")}
          </p>
        )}
        <div className="mt-4">
          <MovieRatingControl movieId={movie.id} />
        </div>
      </div>
    </>
  )
}