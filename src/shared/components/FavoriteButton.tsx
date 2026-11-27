import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import content from "@/data/content.json";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

interface FavoriteButtonProps {
  movieId: number;
}

export default function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, updatingIds } = useFavoritesContext();

  const favorite = isFavorite(movieId);
  const isUpdating = updatingIds.includes(movieId);

  async function handleToggleFavorite() {
    if (isUpdating) return;

    const message = favorite
      ? content.favorites.removed
      : content.favorites.added;

    const errorMessage = favorite
      ? content.favorites.removeError
      : content.favorites.addError;

    toast.success(message);

    try {
      await toggleFavorite(movieId);
    } catch {
      toast.error(errorMessage);
    }
  }

  return (
    <Button
      type="button"
      variant="glass"
      size="icon-sm"
      onClick={handleToggleFavorite}
      disabled={isUpdating}
      aria-label={
        favorite ? content.favorites.removeLabel : content.favorites.addLabel
      }
      aria-pressed={favorite}
      aria-busy={isUpdating}
      className="border-0 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
    >
      <Heart
        aria-hidden="true"
        className={`size-5 transition-all duration-200 ${
          favorite
            ? "fill-brand-primary text-brand-light stroke-0 drop-shadow-brand-glow"
            : "text-white"
        }`}
      />
    </Button>
  );
}
