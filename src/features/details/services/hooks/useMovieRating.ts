import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getMovieRating, saveMovieRating } from "../ratingsService";
import content from "@/data/content.json"

export function useMovieRating(movieId: number) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let ignore = false;

    async function loadRating() {
      setLoading(true);

      try {
        const savedRating = await getMovieRating(movieId);

        if (!ignore) {
          setRating(savedRating);
        }
      } catch {
        if (!ignore) {
          toast.error(content.ratings.loadError)
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadRating();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  async function updateRating(newRating: number) {
    if (savingRef.current || loading) return;

    savingRef.current = true;
    setSaving(true);

    try {
      await saveMovieRating(movieId, newRating);

      setRating(newRating);
      toast.success(content.ratings.saved)
    } catch  {
      toast.error(content.ratings.saveError)
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return {
    rating,
    loading,
    saving,
    updateRating,
  };
}