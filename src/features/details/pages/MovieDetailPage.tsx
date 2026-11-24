import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";
import MovieTrailer from "../components/MovieTrailer";
import content from "@/data/content.json";
import { MAX_VISIBLE_GENRES, MAX_VISIBLE_CAST } from '../../../shared/constants/movieConstants'
import { Star, UserRound, ArrowLeft } from 'lucide-react'
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import ErrorMessage from "@/shared/components/ErrorMessage";
import FavoriteButton from "@/shared/components/FavoriteButton";
import MovieRatingControl from "../components/MovieRatingControl";
import MovieInfoCard from "../components/MovieInfoCard";
import { Card } from "@/components/ui/card";


export default function MovieDetailPage() {

  const { id } = useParams();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
 
  useEffect(() => {

    let ignore = false;

    async function loadMovies() {
      setMovie(null);
      setLoading(true);
      setError(null);
      setIsExpanded(false);

      try {
        if (!Number.isInteger(movieId) || movieId <= 0) {
          setError(content.errors.notFound);
          return;
        }

        const data = await getMovieDetail(movieId);
        
        if (!ignore) {
          setMovie(data);
        }    
      } catch (error) {
        if (!ignore) {
          setError(getApiErrorMessage(error));
        }    
      } finally {
        if(!ignore) {
          setLoading(false);
        }
      }
    }
    loadMovies();
    return () => {
      ignore = true;
    };
  },[movieId]);

  if (loading) {
    return <p>{content.loading.movie}</p>;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  } 
  if (!movie) { 
    return <ErrorMessage message={content.errors.notFound} />;
  }

  const actors = movie.credits.cast;
  const runtime = movie.runtime ?? 0;
  const hours = Math.floor((runtime) / 60 );
  const minutes = runtime % 60;
  const hasLongOverview = movie.overview.length > 150;
  
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <Link
        to="/app"
        className="mb-4 inline-flex items-center gap-2
          text-sm font-medium text-brand-light
          transition-colors hover:text-white
          focus-visible:outline-2
          focus-visible:outline-brand-light"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {content.navigation.backToCatalog}
      </Link>
      <section className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 md:grid-cols-2 md:gap-6">
        <Card className="relative w-full min-w-0 gap-0 overflow-hidden p-0">
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
        <div className="min-w-0">
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
      </section>
      <section className="mt-4" aria-labelledby="overview-title">
        <h2 className="mb-1 text-xl font-semibold md:text-3xl" id="overview-title">
          {content.movieDetail.overview}
        </h2>
        <p className={`text-sm leading-relaxed
          ${hasLongOverview && !isExpanded? "max-h-40 overflow-hidden" : ""}`}
        >
          {movie.overview}
        </p>
        {hasLongOverview && (
        <button
        type="button"
        aria-expanded={isExpanded}
        className="mt-1 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
        onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? content.loading.readLess : content.loading.readMore}
        </button>)}
      </section>
      <div className="mt-3">
        <MovieInfoCard movie={movie} />
      </div>
      <section className="mt-3">
        <h2 className="mb-1 text-xl font-semibold md:text-3xl">
          {content.movieDetail.cast}</h2>
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
                  state={{ fromMovieId: movie.id }}
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
      <MovieTrailer movieId={movieId} />
    </div> 
  )
}

