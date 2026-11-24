import { UserRound, Heart } from "lucide-react"
import { useProfile } from "./hooks/useProfile"
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext"
import content from "@/data/content.json"
import { Link } from "react-router"

export default function ProfilePage() {
  const { profile, loading, error } = useProfile()

  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
  } = useFavoritesContext()

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        {content.navigation.profile.information}
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">
          {content.profile.loading}
        </p>
      ) : error ? (
        <p role="alert" className="text-center text-red-400">
          {error}
        </p>
      ) : (
        <div className="rounded-2xl border border-purple-500/20 bg-slate-950/80 p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-500/10">
            <UserRound className="h-12 w-12 text-purple-400" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            {profile?.username ?? content.profile.usernameUnavailable}
          </h2>

          <p className="mt-2 break-all text-sm text-gray-400 sm:text-base">
            {profile?.email ?? content.profile.emailUnavailable}
          </p>

          <div className="my-6 h-px w-full bg-white/10" />

          <div className="flex flex-col items-center gap-2">
            <Heart className="h-7 w-7 text-purple-400" />

            {favoritesLoading ? (
              <p className="text-sm text-gray-400">
                {content.favorites.loading}
              </p>
            ) : favoritesError ? (
              <p role="alert" className="text-sm text-red-400">
                {content.favorites.loadError}
              </p>
            ) : (
              <span className="text-4xl font-bold text-white">
                {favorites.length}
              </span>
            )}

            <Link
                to="/app/favorites"
                className="text-sm text-gray-300 transition-colors hover:text-purple-400 hover:underline sm:text-base">
                {content.profile.favoritesCount}
              </Link>
          </div>
        </div>
      )}
    </section>
  )
}