import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";
import content from "@/data/content.json";
import { MAX_VISIBLE_GENRES, MAX_VISIBLE_CAST } from '../../../shared/constants/movieConstants'
import { Star, UserRound } from 'lucide-react'
import MovieTrailer from "../components/MovieTrailer";

export default function MovieDetailPage() {

  const { id } = useParams();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
 
  useEffect(() => {

    let ignore = false;

    async function loadMovies() {
      setMovie(null);
      setLoading(true);
      setError(false);
      setIsExpanded(false);

      try {
        if (!Number.isInteger(movieId) || movieId <= 0) {
          setError(true);
          return;
        }

        const data = await getMovieDetail(movieId);
        console.log('Detalle:', data)
        
        if (!ignore) {
          setMovie(data);
        }    
      } catch (error) {
        if (!ignore) {
          setError(true);
          console.error(error);
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
    return <p>Cargando película...</p>;
  }
  if (error) {
    return <p>Error cargando película...</p>
  } 
  if (!movie) { 
    return <p>Película no encontrada</p>
  }

  const actors = movie.credits.cast;
  const director = movie.credits.crew.find(
    (crew) => crew.job === "Director");
  const runtime = movie.runtime ?? 0;
  const hours = Math.floor((runtime) / 60 );
  const minutes = runtime % 60;
  const hasLongOverview = movie.overview.length > 300;
  
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      {/* Movie header */}
      <section className="grid grid-cols-5 gap-4 lg:grid-cols-12 lg:gap-8">
        {/* Poster */}
        <div className="col-span-2 lg:col-span-3">
          {movie.poster_path && <img
            className="aspect-[2/3] w-full rounded-xl object-cover"
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={`Póster de la película ${movie.original_title}`}
          />}
        </div>
        {/* Main info */}
        <div className="col-span-3 min-w-0 lg:col-span-6">
          <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-4xl">
            {movie.title}
          </h1>  
          {(Boolean(movie.release_date) || runtime > 0) && (
            <p>
              {movie.release_date && movie.release_date.slice(0, 4)}
              {movie.release_date && runtime > 0 && " · "}
              {runtime > 0 && `${hours} h ${minutes} min`}
            </p>
          )}
          {movie.vote_average > 0 ? (
            <div className="flex items-center gap-2">
              <Star
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
              <p>{movie.vote_average.toFixed(1)}
                <span className="text-text-secondary"> / 10</span>
              </p>
            </div>
          ) : ( <p>{content.movieDetail.noRating}</p> 
          )}
          {movie.genres.length > 0 && (
            <p className="mt-2 text-sm text-text-secondary">
              {movie.genres.slice(0, MAX_VISIBLE_GENRES).map((genre) => genre.name).join(" · ")}
            </p>
          )}
        </div>
        {/* Ficha técnica */}
        <div className="col-span-5 lg:col-span-3">
          <p>
            {content.movieDetail.director}: {director? 
            (<Link to={`/app/director/${director.id}`}>
              {director.name}
            </Link>) : content.movieDetail.unknownDirector}
          </p>
          {movie.production_companies.length > 0 && (
            <p>
              {content.movieDetail.productionCompanies}:{" "}
              {movie.production_companies.map((company) => company.name).join(" · ")}
            </p>
          )}
          {movie.origin_country.length > 0  && (
            <p>
              {content.movieDetail.originCountry}: {" "}
              {movie.origin_country.map((country) => {
                const countryNames = new Intl.DisplayNames(["es"], {type: "region",});
                return countryNames.of(country) ?? country;
              }).join(" · ")
              }
            </p>
          )}
        </div> 
      </section>
      <section
        className="mt-8" 
        aria-labelledby="synopsis-title"
      >
        <h2
          className="mb-4 text-xl font-semibold"
          id="synopsis-title">
            {content.movieDetail.overview}
        </h2>
        <p
          className={`text-sm leading-relaxed mt-4 
            ${hasLongOverview && !isExpanded? "max-h-40 overflow-hidden" : ""}`}
          >
          {movie.overview}
        </p>
        {hasLongOverview && (
            <button
            type="button"
            aria-expanded={isExpanded}
            className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
            onClick={() => setIsExpanded((previous) => !previous)}
          >
           {isExpanded ? content.movieDetail.readLess : content.movieDetail.readMore}
          </button>)}
      </section>
      <section className="mt-8">
        <h2>{content.movieDetail.cast}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
          {actors.slice(0, MAX_VISIBLE_CAST).map((actor) => {
            return (
              <div
                className="w-36 shrink-0 snap-start sm:w-40 lg:w-44"
                key={actor.id}>
                <Link
                  className="block"
                  to={`/app/actor/${actor.id}`}>
                  {actor.profile_path ? (
                  <img
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={`Foto de ${actor.name}`}
                  />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-card">
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
                    {content.movieDetail.character}: {actor.character}
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

