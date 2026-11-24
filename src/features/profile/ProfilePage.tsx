import { UserRound, Heart } from "lucide-react"

export default function ProfilePage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        Mi perfil
      </h1>

      <div className="rounded-2xl border border-purple-500/20 bg-slate-950/80 p-8 text-center shadow-xl">

        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-500/10">
          <UserRound className="h-12 w-12 text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Cinefilo123
        </h2>

        <p className="mt-2 break-all text-sm text-gray-400 sm:text-base">
          usuario@email.com
        </p>

        <div className="my-6 h-px w-full bg-white/10" />

        <div className="flex flex-col items-center gap-2">
          <Heart className="h-7 w-7 text-purple-400" />

          <span className="text-4xl font-bold text-white">
            12
          </span>

          <p className="text-sm text-gray-300 sm:text-base">
            Películas favoritas
          </p>
        </div>

      </div>
    </section>
  )
}