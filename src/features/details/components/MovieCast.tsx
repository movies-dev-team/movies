import { Link } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import content from "@/data/content.json";
import { MAX_VISIBLE_CAST } from "@/shared/constants/movieConstants";
import { UserRound } from 'lucide-react';

interface MovieCastProps {
  actors: MovieDetail["credits"]["cast"];
  movieId: number;
}

export default function MovieCast({actors, movieId}: MovieCastProps) {

  return (
    <section className="mt-3">
        <h2 className="mb-1 text-xl font-semibold md:text-3xl">
          {content.movieDetail.cast}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
          {actors.slice(0, MAX_VISIBLE_CAST).map((actor) => {
            return (
              <div
                className="w-36 shrink-0 snap-start sm:w-40 lg:w-44"
                key={actor.id}
              >
                <Link
                  className="block"
                  to={`/app/actor/${actor.id}`}
                  state={{ fromMovieId: movieId }}
                >
                  {actor.profile_path ? (
                  <img
                    className="w-full aspect-2/3 object-cover rounded-lg"
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={`Foto de ${actor.name}`}
                  />
                  ) : (
                    <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg bg-card">
                      <UserRound
                        className="h-12 w-12 text-text-secondary"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-sm">
                    {actor.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {actor.character}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
    </section>
  )
}