import { useContext } from "react"
import { FavoritesContext } from "../context/FavoritesContext"

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error("useFavoritesContext debe utilizarse dentro de FavoritesProvider")
  }

  return context
}