import MovieRating from "@/shared/components/MovieRating";
import { useMovieRating } from "../services/hooks/useMovieRating";
import content from "@/data/content.json";

interface MovieRatingControlProps {
  movieId: number;
}

export default function MovieRatingControl({
  movieId,
}: MovieRatingControlProps) {
  const { rating, loading, saving, updateRating } = useMovieRating(movieId);

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-gray-300">
        {content.ratings.loading}
      </p>
    );
  }

  return (
    <div
      aria-busy={saving}
      className={saving ? "pointer-events-none opacity-60" : ""}
    >
      <MovieRating rating={rating} onChange={updateRating} />
    </div>
  );
}
