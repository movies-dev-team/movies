import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPersonDetail } from "../services/personDetailService";
import type { PersonDetail } from "../types/personDetail";

import FilmographyCard from "../components/FilmographyCard";


function formatDate(date: string | null): string {
  if (!date) return ""
  const parsedDate = new Date(date);
  
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.format(parsedDate);
}

export default function DirectorDetailPage() {

  const { id } = useParams();
  const directorId = Number(id);

  const [director, setDirector] = useState<PersonDetail | null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllMovies, setShowAllMovies] =useState(false);

  useEffect(() => {

    let ignore = false;

    async function loadDirector() {
      setDirector(null);
      setLoading(true);
      setError(false);
      setIsExpanded(false);
      setShowAllMovies(false);
    
      try {
        if (!Number.isInteger(directorId) || directorId <= 0) {
            setError(true);
            return;
        }

        const data = await getPersonDetail(directorId);

        if (!ignore) {
          setDirector(data);
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
    loadDirector();
    return () => {
      ignore = true;
    };
  },[directorId]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }
  if (error) {
    return <p>Error cargando datos...</p>
  } 
  if (!director) { 
    return <p>Director/a no encontrado/a</p>
  }

  const hasLongBiography = director.biography.length > 300;
  const filmography = director.movie_credits.crew.filter((credit) => (
    credit.job === "Director"))
  const hasFilmography = filmography.length > 0;
  const sortedFilmography = [...filmography].sort((a, b) => 
    b.release_date.localeCompare(a.release_date));
  const moviesPerProfile = 8;
  const visibleFilmography = sortedFilmography.slice(0, moviesPerProfile);
  const movieList = showAllMovies ? sortedFilmography : visibleFilmography;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <section className="grid grid-cols-5 gap-4 md:grid-cols-3 md:gap-x-8 md:gap-y-4">
        <div className="col-span-2 md:col-span-1 md:row-span-2">
          {director.profile_path && ( <img
            className="aspect-[2/3] w-full max-w-[160px] md:max-w-xs rounded-xl object-cover"
            src={`https://image.tmdb.org/t/p/w300${director.profile_path}`}
            alt={`Foto de ${director.name}`}
            />
          )}
        </div>
        <div className="col-span-3 min-w-0 md:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {director.name}
          </h1>
          <div className="mt-3 flex flex-col gap-2">
            {director.birthday && (
            <p className="text-sm leading-5 text-text-secondary">
              Nacimiento:{" "}
              <time dateTime={director.birthday}>
                {formatDate(director.birthday)}
              </time>
            </p>
            )}
            {director.place_of_birth && (
            <p className="text-sm leading-5 text-text-secondary">
              Lugar: {director.place_of_birth}
            </p>
            )}
          </div>  
        </div>
        <section 
          className="col-span-5 min-w-0 md:col-span-2"
          aria-labelledby="biography-title"
        >
          <h2 className="mb-2 text-xl font-semibold">
          Biografía
          </h2>
          <p className={`text-sm leading-7 text-text-secondary whitespace-pre-line md:text-base
            ${hasLongBiography && !isExpanded ? "max-h-40 overflow-hidden" : ""}`}
          >
            {director.biography.trim() ? director.biography : "Biografía no disponible"}
          </p>
          {hasLongBiography && (
            <button
            type="button"
            aria-expanded={isExpanded}
            className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
            onClick={() => setIsExpanded((previous) => !previous)}
          >
           {isExpanded ? "Leer menos" : "Leer más..."}
          </button>)}
        </section>   
      </section>
      <section
        id="filmography"
        aria-labelledby="filmography-title"
        className="mt-10"
      >
        <h2 
          id="filmography-title" 
          className="mb-5 text-2xl font-bold">
          Filmografía
        </h2>
        <div className="grid grid-cols-2 auto-rows-fr gap-4 md:grid-cols-3 lg:grid-cols-4">
          {hasFilmography ? (
          movieList.map((film) => {
            return (
              <FilmographyCard
                key={film.id}
                film={film} 
              />
            );
          })
        ): <p>No hay películas disponibles</p>}
        </div>
        {(sortedFilmography.length > moviesPerProfile) && (
          <button
            type="button"
            aria-expanded={showAllMovies}
            className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
            onClick={() => setShowAllMovies((previous) => !previous)}
          >
           {showAllMovies ? "Ver menos" : "Ver más..."}
          </button>)}
      </section> 
    </main>
  )
}