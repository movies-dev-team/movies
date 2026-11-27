import type {
  PersonMovieCredit,
  PersonCrewCredit,
} from "../types/personDetail";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import content from "@/data/content.json";

interface FilmographyCardProps {
  film: PersonMovieCredit | PersonCrewCredit;
}

export default function FilmographyCard({ film }: FilmographyCardProps) {
  return (
    <Link
      to={`/app/movie/${film.id}`}
      className="block h-full rounded-xl 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        focus-visible:outline-brand-light"
    >
      <Card
        className="relative h-full w-full gap-0 overflow-hidden p-0 
        transition-transform 
        duration-200 
        hover:-translate-y-0.5 
        hover:brightness-110"
      >
        {film.poster_path ? (
          <img
            className="w-full aspect-2/3 object-cover"
            src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
            alt={`${content.movieDetail.posterOf} ${film.title}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-2/3 w-full items-center justify-center bg-card">
            <p className="px-3 text-center text-xs text-text-secondary">
              {content.movieDetail.imageNotAvailable}
            </p>
          </div>
        )}
        <CardContent className="p-3">
          <CardTitle className="line-clamp-2">
            {film.title}{" "}
            {film.release_date && `(${film.release_date.slice(0, 4)})`}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
