import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getMovieRating, saveMovieRating } from "../ratingsService";

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
          toast.error("Error al cargar tu puntuación");
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
      toast.success("Puntuación guardada");
    } catch  (error) {
  console.error("Error al guardar rating:", error);
      toast.error("Error al guardar la puntuación");
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