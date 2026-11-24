import { Link } from "react-router";
import type { MovieDetail } from "../types/movieDetail";
import { formatDate } from "@/shared/utils/formatDate";
import content from "@/data/content.json";
import { UserRound, CalendarDays, Clapperboard, Globe, Languages } from "lucide-react";

interface MovieInfoCardProps {
  movie: MovieDetail;
}

export default function MovieInfoCard({movie}: MovieInfoCardProps) {

  const director = movie.credits.crew.find(
  (crew) => crew.job === "Director");

  const languageNames = new Intl.DisplayNames(["es"], {
    type: "language",});

  return (
    <div className="rounded-xl border border-brand-light/40 bg-card px-3 py-1 text-sm leading-relaxed">
      <div className="grid grid-cols-[24px_1fr_1.4fr] items-start gap-3 border-b border-brand-light/20 py-2">
        <UserRound className="h-5 w-5 text-brand-light" aria-hidden="true" />
        <span className="font-medium">
          {content.movieDetail.director}
        </span>
        <div>
        {director ? (
          <Link
            className="font-medium text-brand-light transition-colors hover:text-white
            underline 
            underline-offset-4  
            focus-visible:outline-2 
            focus-visible:outline-brand-light"
            to={`/app/director/${director.id}`}
          >
            {director.name}
          </Link>) : content.movieDetail.unknownDirector}
        </div>
      </div>
      {movie.release_date && (
        <div className="grid grid-cols-[24px_1fr_1.4fr] items-start gap-3 border-b border-brand-light/20 py-2">
          <CalendarDays className="h-5 w-5 text-brand-light" aria-hidden="true"/>
          <span className="font-medium">
            {content.movieDetail.releaseDate}
          </span>
          <div>
            {formatDate(movie.release_date)}
          </div>
        </div>
      )}
      {movie.production_companies.length > 0 && (
        <div className="grid grid-cols-[24px_1fr_1.4fr] items-start gap-3 border-b border-brand-light/20 py-2">
          <Clapperboard className="h-5 w-5 text-brand-light" aria-hidden="true"/>
          <span className="font-medium">
            {content.movieDetail.productionCompanies}
          </span>
          <div>
            {movie.production_companies.map((company) => company.name).join(" · ")}
          </div>
        </div>
      )}
      {movie.original_language && (
        <div className="grid grid-cols-[24px_1fr_1.4fr] items-start gap-3 border-b border-brand-light/20 py-2">
          <Languages className="h-5 w-5 text-brand-light" aria-hidden="true"/>
          <span className="font-medium">
            {content.movieDetail.originalLanguage}
          </span>
          <div>
            {languageNames.of(movie.original_language) ?? movie.original_language}
          </div>
        </div>
      )}
      {movie.origin_country.length > 0  && (
        <div className="grid grid-cols-[24px_1fr_1.4fr] items-start gap-3 py-2">
          <Globe className="h-5 w-5 text-brand-light" aria-hidden="true"/>
          <span className="font-medium">
            {content.movieDetail.originCountry}
          </span>
          <div>
          {movie.origin_country.map((country) => {
            const countryNames = new Intl.DisplayNames(["es"], {type: "region",});
            return countryNames.of(country) ?? country;}).join(" · ")
          }
          </div>
        </div>
      )}
    </div> 
  )
}