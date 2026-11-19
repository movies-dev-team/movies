import type { PersonMovieCredit, PersonCrewCredit } from "../types/personDetail";
import {
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router";

interface FilmographyCardProps {
  film: PersonMovieCredit | PersonCrewCredit;
}

export default function FilmographyCard({ film }: FilmographyCardProps) {
  return (
    <Link to={`/app/movie/${film.id}`} className="group block h-full focus-visible:outline-none">
      <Card className="w-full h-full 
          overflow-hidden 
          group-focus-visible:outline-2 
          group-focus-visible:outline-brand-light"
      >
          {film.poster_path ? (<img
              className="w-full aspect-2/3 object-cover"
              src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
              alt={`Póster de la película ${film.title}`}
              />
            ) : 
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-card">
              <p className="px-3 text-center text-xs text-text-secondary">
                Imagen no disponible
              </p>
            </div>
          }
        <CardContent className="p-3">
          <CardTitle>
            {film.title}  {film.release_date && `(${film.release_date.slice(0, 4)})`}
          </CardTitle>
          {"character" in film && (
            <p>{film.character}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}