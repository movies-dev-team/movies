import { createContext } from "react"
import type { useFavorites } from "../hooks/useFavorites"

export type FavoritesContextType = ReturnType<typeof useFavorites>

export const FavoritesContext = createContext<FavoritesContextType | null>(null)