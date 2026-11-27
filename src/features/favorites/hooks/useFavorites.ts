import { useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../services/favoritesService";
import content from "@/data/content.json";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        const data = await getFavorites();

        if (active) {
          setFavorites(data.map((favorite) => favorite.movie_id));
        }
      } catch {
        if (active) {
          setError(content.favorites.loadError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  function isFavorite(movieId: number) {
    return favorites.includes(movieId);
  }

  async function toggleFavorite(movieId: number): Promise<boolean> {
    if (loading || updatingIds.includes(movieId)) return false;

    setUpdatingIds((prev) => [...prev, movieId]);
    setError(null);

    const wasFavorite = isFavorite(movieId);

    try {
      if (wasFavorite) {
        await removeFavorite(movieId);
        setFavorites((prev) => prev.filter((id) => id !== movieId));
      } else {
        await addFavorite(movieId);
        setFavorites((prev) => [...prev, movieId]);
      }

      return true;
    } catch {
      setError(
        wasFavorite
          ? content.favorites.removeError
          : content.favorites.addError
      );

      return false;
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== movieId));
    }
  }

  return {
    favorites,
    loading,
    error,
    updatingIds,
    isFavorite,
    toggleFavorite,
  };
}