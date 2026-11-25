import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Movie } from "@/features/catalog/types/movieService";
import type { MovieBackdrop } from "@/features/catalog/types/movieCarouselService";

import { getImageUrl } from "@/shared/utils/getImageUrl";
import content from "@/data/content.json";

import {
  getNowPlayingMovies,
  getMovieBackdropImages,
} from "@/features/catalog/services/movieCarouselService";

const MAX_SLIDES = 5;

export default function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      try {
        const data = await getNowPlayingMovies();

        const moviesWithBackdrop = data.results
          .filter((movie) => movie.backdrop_path)
          .slice(0, MAX_SLIDES);

        const checkedMovies = await Promise.all(
          moviesWithBackdrop.map(async (movie) => {
            try {
              const images = await getMovieBackdropImages(movie.id);
              const highResolutionBackdrop = images.backdrops
                .filter((image: MovieBackdrop) => image.width >= 1280)
                .sort((a, b) => b.width - a.width)[0];

              if (highResolutionBackdrop) {
                return {
                  ...movie,
                  backdrop_path: highResolutionBackdrop.file_path,
                };
              }

              return movie;
            } catch {
              return movie;
            }
          }),
        );

        if (!cancelled) {
          setMovies(checkedMovies);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error cargando películas:", error);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const movie = movies[currentIndex];

  function previousMovie() {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  }

  function nextMovie() {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={content.carousel.regionLabel}
      className="relative mb-8 h-64 overflow-hidden rounded-2xl border border-brand-primary/50 md:h-80 lg:h-480px"
    >
      <img
        key={movie.id}
        src={getImageUrl(movie.backdrop_path!, "original")}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-[center_35%] animate-[slide-in_700ms_ease-out]"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent md:bg-linear-to-r md:from-black/70 md:via-black/20 md:to-transparent" />

      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col justify-end px-20 pb-12 md:justify-center md:px-24 md:pb-0">
        <h2 className="mb-2 text-xl font-bold text-white md:text-3xl lg:text-4xl">
          {movie.title}
        </h2>

        <p className="mb-4 line-clamp-2 text-sm text-white/90 md:text-base">
          {movie.overview}
        </p>

        <Link
          to={`/app/movie/${movie.id}`}
          aria-label={`${content.carousel.viewDetails}: ${movie.title}`}
          className="w-fit rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {content.carousel.viewDetails}
        </Link>
      </div>

      {movies.length > 1 && (
        <button
          type="button"
          onClick={previousMovie}
          aria-label={content.carousel.previous}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-brand-primary/70 p-1.5 text-white hover:bg-brand-primary md:left-4 md:p-2"
        >
          <ChevronLeft className="size-5 md:size-6" />
        </button>
      )}

      {movies.length > 1 && (
        <button
          type="button"
          onClick={nextMovie}
          aria-label={content.carousel.next}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-brand-primary/70 p-1.5 text-white hover:bg-brand-primary md:right-4 md:p-2"
        >
          <ChevronRight className="size-5 md:size-6" />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {movies.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={content.carousel.slideLabel
              .replace("{current}", String(index + 1))
              .replace("{total}", String(movies.length))}
            aria-current={currentIndex === index ? "true" : undefined}
            className={`size-2 rounded-full transition ${
              currentIndex === index ? "bg-brand-primary" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
