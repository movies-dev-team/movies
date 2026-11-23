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

    await toggleFavorite(movieId);

    if (favorite) {
      toast(content.favorites.removed);
    } else {
      toast.success(content.favorites.added);
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
        favorite
          ? content.favorites.removeLabel
          : content.favorites.addLabel
      }
      aria-pressed={favorite}
      className="border-0 transition-transform duration-200 hover:scale-110"
    >
      <Heart
        className={`size-5 transition-all duration-200 ${
          favorite
            ? "fill-brand-primary text-brand-light stroke-0 drop-shadow-brand-glow"
            : "text-white"
        }`}
      />
    </Button>
  );
}