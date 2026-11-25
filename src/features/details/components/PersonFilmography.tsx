import { useState } from "react";
import FilmographyCard from "./FilmographyCard";
import type { PersonMovieCredit, PersonCrewCredit } from "../types/personDetail"
import content from "@/data/content.json";
import { MAX_MOVIES_PER_PROFILE } from "@/shared/constants/movieConstants";

interface PersonFilmographyProps {
  filmography: PersonMovieCredit[] | PersonCrewCredit[];
}

export default function PersonFilmography({filmography}: PersonFilmographyProps) {

  const [showAllMovies, setShowAllMovies] =useState(false);

  const hasFilmography = filmography.length > 0;
  const sortedFilmography = [...filmography].sort((a, b) => 
    b.release_date.localeCompare(a.release_date));
  const visibleFilmography = sortedFilmography.slice(0, MAX_MOVIES_PER_PROFILE );
  const movieList = showAllMovies ? sortedFilmography : visibleFilmography;

  return (
    <section
        id="filmography"
        aria-labelledby="filmography-title"
        className="mt-4"
    >
      <h2 id="filmography-title" className="mb-5 text-xl font-semibold md:text-2xl">
        {content.movieDetail.filmography}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(125px,150px))] auto-rows-fr gap-3">
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
      {(sortedFilmography.length > MAX_MOVIES_PER_PROFILE) && (
        <button
          type="button"
          aria-expanded={showAllMovies}
          className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
          onClick={() => setShowAllMovies((previous) => !previous)}
        >
         {showAllMovies ? content.loading.loadLess : content.loading.loadMore}
        </button>)}
    </section> 
  )
}




