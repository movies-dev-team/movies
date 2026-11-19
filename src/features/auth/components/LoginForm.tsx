import { useState } from "react"
import type { SubmitEvent } from "react"
import { Link, useNavigate } from "react-router"
import { loginUser } from "../services/authService"
import {validateEmail,validatePassword,} from "./authValidation"

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

    const emailError = validateEmail(email)

    if (emailError) {
      setError(emailError)
      return
    }

    const passwordError = validatePassword(password)

    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)

    try {
      await loginUser(email.trim(), password)
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
    <section className="mx-auto w-full max-w-90 rounded-2xl border border-white/15 bg-slate-950/80 px-5 py-4 shadow-2xl backdrop-blur-xl lg:ml-auto lg:max-w-md lg:p-8">

      <h2 className="mb-3 text-center text-xl font-bold lg:mb-6 lg:text-left lg:text-3xl">
        Inicia sesión
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-2.5 lg:space-y-4"
      >

        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>

          <div className="flex h-10 items-center gap-2.5 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500 lg:h-14 lg:rounded-xl lg:px-4">

            <svg
              className="h-4 w-4 shrink-0 lg:h-5 lg:w-5"
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
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300 lg:text-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>

          <div className="flex h-10 items-center gap-2.5 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500 lg:h-14 lg:rounded-xl lg:px-4">

            <svg
              className="h-4 w-4 shrink-0 lg:h-5 lg:w-5"
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
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300 lg:text-base"
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
                  className="h-4 w-4 lg:h-5 lg:w-5"
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
                  className="h-4 w-4 lg:h-5 lg:w-5"
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
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-11 w-full rounded-lg bg-linear-to-r from-purple-700 to-purple-600 text-sm font-bold text-white shadow-lg transition hover:from-purple-600 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60 lg:mt-4 lg:h-14 lg:rounded-xl lg:text-lg"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

      </form>

      <div className="my-4 flex items-center gap-3 lg:my-8">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-xs text-gray-200 lg:text-base">
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