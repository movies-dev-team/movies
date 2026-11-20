import { Star } from "lucide-react";

interface MovieRatingAPIProps {
  rating: number;
}

const MovieRatingAPI = ({ rating }: MovieRatingAPIProps) => {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="size-3.5 fill-brand-light text-brand-light" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );
};

export default MovieRatingAPI;
