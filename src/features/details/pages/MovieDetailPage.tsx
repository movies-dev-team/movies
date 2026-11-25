import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import MovieHeader from "../components/MovieHeader";
import MovieOverview from "../components/MovieOverview";
import MovieInfoCard from "../components/MovieInfoCard";
import MovieCast from "../components/MovieCast";
import MovieTrailer from "../components/MovieTrailer";
import ErrorMessage from "@/shared/components/ErrorMessage";
import type { MovieDetail } from "../types/movieDetail";
import { getMovieDetail } from "../services/movieDetailService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";
import content from "@/data/content.json";
import { ArrowLeft } from "lucide-react";

export default function MovieDetailPage() {

  const { id } = useParams();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    let ignore = false;

    async function loadMovies() {
      setMovie(null);
      setLoading(true);
      setError(null);

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
      <section className="grid grid-cols-5 gap-4 md:grid-cols-3 md:gap-x-8 md:gap-y-4">
        <MovieHeader movie={movie} />
        <MovieOverview key={movie.id} overview={movie.overview} />
      </section>
      <div className="mt-3">
        <MovieInfoCard movie={movie} />
      </div>
      <MovieCast actors={movie.credits.cast} movieId={movie.id} />
      <MovieTrailer movieId={movie.id} />
    </div> 
  )
}

