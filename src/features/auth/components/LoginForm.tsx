import { useState } from "react"
import type { SubmitEvent } from "react"
import { Link, useNavigate } from "react-router"
import { loginUser } from "../services/authService"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await loginUser(email, password)
      navigate("/app")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-slate-950/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:ml-auto">

      <h2 className="mb-6 text-center text-3xl font-bold lg:text-left">
        Inicia sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 transition-colors focus-within:ring-2 focus-within:ring-purple-500">

            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                strokeWidth="1.8"
              />
              <path
                d="m3 7 9 6 9-6"
                strokeWidth="1.8"
              />
            </svg>

            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 transition-colors focus-within:ring-2 focus-within:ring-purple-500">

            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="11"
                rx="2"
                strokeWidth="1.8"
              />
              <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                strokeWidth="1.8"
              />
            </svg>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="min-w-0 flex-1 bg-transparent py-4 text-white outline-none placeholder:text-gray-300"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
              className="shrink-0 text-gray-300 transition hover:text-white"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c5 0 9 4 10 7a13 13 0 0 1-3.2 4.4" />
                  <path d="M6.2 6.2A13 13 0 0 0 2 12c1 3 5 7 10 7a10 10 0 0 0 4.2-.9" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-xl bg-linear-to-r from-purple-700 to-purple-600 py-4 text-lg font-bold text-white shadow-lg transition hover:from-purple-600 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-2 w-2 rounded-full bg-white/20" />
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-base text-gray-200">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="font-semibold text-purple-400 transition hover:text-purple-300"
        >
          Regístrate
        </Link>
      </p>

    </section>
  )
}

export default LoginForm