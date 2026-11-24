import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPersonDetail } from "../services/personDetailService";
import type { PersonDetail } from "../types/personDetail";
import FilmographyCard from "../components/FilmographyCard";
import { formatDate } from "@/shared/utils/formatDate";
import content from "@/data/content.json";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import ErrorMessage from "@/shared/components/ErrorMessage";

export default function ActorDetailPage() {

  const { id } = useParams();
  const actorId = Number(id);

  const [actor, setActor] = useState<PersonDetail | null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllMovies, setShowAllMovies] =useState(false);

  useEffect(() => {

    let ignore = false;

    async function loadActor() {
      setActor(null);
      setLoading(true);
      setError(null);
      setIsExpanded(false);
      setShowAllMovies(false);
    
      try {
        if (!Number.isInteger(actorId) || actorId <= 0) {
            setError(content.movieDetail.actorNotFound);
            return;
          }

        const data = await getPersonDetail(actorId);

        if (!ignore) {
          setActor(data);
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
    loadActor();
    return () => {
      ignore = true;
    };
  },[actorId]);

  if (loading) {
    return <p>{content.loading.generic}</p>;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  } 
  if (!actor) { 
    return <ErrorMessage message={content.movieDetail.actorNotFound} />;
  }

  const hasLongBiography = actor.biography.length > 300;
  const filmography = actor.movie_credits.cast;
  const hasFilmography = filmography.length > 0;
  const sortedFilmography = [...filmography].sort((a, b) => 
    b.release_date.localeCompare(a.release_date));
  const moviesPerProfile = 8
  const visibleFilmography = sortedFilmography.slice(0, moviesPerProfile);
  const movieList = showAllMovies ? sortedFilmography : visibleFilmography;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <section className="grid grid-cols-5 gap-4 md:grid-cols-3 md:gap-x-8 md:gap-y-4">
        <div className="col-span-2 md:col-span-1 md:row-span-2">
          {actor.profile_path && ( <img
            className="aspect-[2/3] w-full max-w-[160px] md:max-w-xs rounded-xl object-cover"
            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
            alt={`${content.movieDetail.pictureOf} ${actor.name}`}
            />
          )}
        </div>
        <div className="col-span-3 min-w-0 md:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {actor.name}
          </h1>
          <div className="mt-3 flex flex-col gap-2">
            {actor.birthday && (
            <p className="text-sm leading-5 text-text-secondary">
              {content.movieDetail.birthDate}:{" "} {formatDate(actor.birthday)}
            </p>
            )}
            {actor.place_of_birth && (
            <p className="text-sm leading-5 text-text-secondary">
              {content.movieDetail.birthPlace}:{" "} {actor.place_of_birth}
            </p>
            )}
          </div>  
        </div>
        <section 
          className="col-span-5 min-w-0 md:col-span-2" 
          aria-labelledby="biography-title">
          <h2
            id="biography-title" 
            className="mb-2 text-xl font-semibold md:text-2xl">
            {content.movieDetail.biography}
          </h2>
          <p className={`text-sm leading-7 text-text-secondary whitespace-pre-line md:text-base
            ${hasLongBiography && !isExpanded ? "max-h-40 overflow-hidden" : ""}`}
          >
            {actor.biography.trim() ? actor.biography : content.movieDetail.biographyNotAvailable}
          </p>
          {hasLongBiography && (
            <button
            type="button"
            aria-expanded={isExpanded}
            className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
            onClick={() => setIsExpanded((previous) => !previous)}
          >
           {isExpanded ? content.loading.readLess : content.loading.readMore}
          </button>)}
        </section>   
      </section>
      <section
        id="filmography"
        aria-labelledby="filmography-title"
        className="mt-4"
      >
        <h2 id="filmography-title" className="mb-5 text-xl font-semibold md:text-2xl">
          {content.movieDetail.filmography}
        </h2>
        <div className="grid grid-cols-2 auto-rows-fr gap-4 md:grid-cols-3 lg:grid-cols-4">
          {hasFilmography ? (
          movieList.map((film) => {
            return (
              <FilmographyCard
              key={film.id}
              film={film} />
            );
          })
        ): <p>{content.movieDetail.moviesNotAvailable}</p>}
        </div>
        {(sortedFilmography.length > moviesPerProfile) && (
          <button
            type="button"
            aria-expanded={showAllMovies}
            className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
            onClick={() => setShowAllMovies((previous) => !previous)}
          >
           {showAllMovies ? content.loading.loadLess : content.loading.loadMore}
          </button>)}
      </section> 
    </div>
  )
}





