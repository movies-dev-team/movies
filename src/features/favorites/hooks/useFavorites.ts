import { useEffect, useState } from "react"
import { getFavorites, addFavorite, removeFavorite } from "../services/favoritesService"

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<number[]>([])

  useEffect(() => {
    let active = true

    async function loadFavorites() {
      try {
        const data = await getFavorites()

        if (active) {
          setFavorites(data.map((favorite) => favorite.movie_id))
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar favoritos")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadFavorites()

    return () => {
      active = false
    }
  }, [])

  function isFavorite(movieId: number) {
    return favorites.includes(movieId)
  }

  async function toggleFavorite(movieId: number) {
    if (loading || updatingIds.includes(movieId)) return

    setUpdatingIds((prev) => [...prev, movieId])
    setError(null)

    try {
      if (isFavorite(movieId)) {
        await removeFavorite(movieId)
        setFavorites((prev) => prev.filter((id) => id !== movieId))
      } else {
        await addFavorite(movieId)
        setFavorites((prev) => [...prev, movieId])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar favoritos")
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== movieId))
    }
  }

  return {
    favorites,
    loading,
    error,
    updatingIds,
    isFavorite,
    toggleFavorite,
  }
}