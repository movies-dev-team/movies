import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router";
import { getPersonDetail } from "../services/personDetailService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import PersonHeader from "../components/PersonHeader";
import PersonBiography from "../components/PersonBiography";
import PersonFilmography from "../components/PersonFilmography";
import ErrorMessage from "@/shared/components/ErrorMessage";
import type { PersonDetail } from "../types/personDetail";
import content from "@/data/content.json";
import { ArrowLeft } from 'lucide-react';

export default function DirectorDetailPage() {

  const { id } = useParams();
  const directorId = Number(id);

  const [director, setDirector] = useState<PersonDetail | null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const fromMovieId = location.state?.fromMovieId;
  const backTo = typeof fromMovieId === "number" &&
  Number.isInteger(fromMovieId) &&
  fromMovieId > 0
    ? `/app/movie/${fromMovieId}`
    : "/app";

  useEffect(() => {

    let ignore = false;

    async function loadDirector() {
      setDirector(null);
      setLoading(true);
      setError(null);
    
      try {
        if (!Number.isInteger(directorId) || directorId <= 0) {
            setError(content.movieDetail.directorNotFound);
            return;
        }

        const data = await getPersonDetail(directorId);

        if (!ignore) {
          setDirector(data);
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
    loadDirector();
    return () => {
      ignore = true;
    };
  },[directorId]);

  if (loading) {
    return <p>{content.loading.generic}</p>;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  } 
  if (!director) { 
    return <ErrorMessage message={content.movieDetail.directorNotFound} />;
  }

  const filmography = director.movie_credits.crew.filter((credit) => (
    credit.job === "Director"))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <Link
        to={backTo}
        className="mb-4 inline-flex items-center gap-2
          text-sm font-medium text-brand-light
          transition-colors hover:text-white
          focus-visible:outline-2
          focus-visible:outline-brand-light"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backTo === "/app"
          ? content.navigation.backToCatalog
          : content.navigation.backToMovieDetail}
      </Link>
      <section className="grid grid-cols-5 gap-4 md:grid-cols-3 md:gap-x-8 md:gap-y-4">
        <PersonHeader person={director} />
        <PersonBiography biography={director.biography} key={director.id} />
      </section>
      <PersonFilmography filmography={filmography} key={director.id} />
    </div>
  )
}