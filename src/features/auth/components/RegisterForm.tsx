import { useState } from "react"
import type { SubmitEvent } from "react"
import { Link, useNavigate } from "react-router"
import { registerUser } from "../services/authService"
import { validateEmail, validatePassword, validateConfirmPassword } from "./authValidation"

function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Introduce un nombre de usuario")
      return
    }

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

    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    )

    if (confirmPasswordError) {
      setError(confirmPasswordError)
      return
    }

    setIsLoading(true)

    try {
      const { session } = await registerUser(email.trim(), password)

      if (!session) {
        setError("No se ha podido iniciar sesión después del registro")
        return
      }

      navigate("/app", { replace: true })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al registrarse"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <section className="mx-auto w-full max-w-90 rounded-2xl border border-white/20 bg-slate-950/80 px-5 py-5 shadow-2xl backdrop-blur-xl sm:max-w-md sm:px-6 lg:ml-auto lg:max-w-md lg:p-8">
     <h2 className="mb-4 text-center text-xl font-bold text-white sm:text-2xl lg:mb-6 lg:text-left lg:text-3xl">
        Crea tu cuenta
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-2.5"
      >

        <div className="flex h-11 items-center gap-3 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500">
          <svg
            className="h-5 w-5 shrink-0 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
          </svg>

          <label htmlFor="register-username" className="sr-only">
            Nombre de usuario
          </label>

          <input
            id="register-username"
            type="text"
            placeholder="Nombre de usuario"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex h-11 items-center gap-3 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500">
          <svg
            className="h-5 w-5 shrink-0 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>

          <label htmlFor="register-email" className="sr-only">
            Correo electrónico
          </label>

          <input
            id="register-email"
            type="email"
            placeholder="Correo electrónico"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex h-11 items-center gap-3 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500">
          <svg
            className="h-5 w-5 shrink-0 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>

          <label htmlFor="register-password" className="sr-only">
            Contraseña
          </label>

          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="shrink-0 text-gray-300 transition hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {showPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c5 0 9 4 10 7a13 13 0 0 1-3.2 4.4" />
                  <path d="M6.2 6.2A13 13 0 0 0 2 12c1 3 5 7 10 7a10 10 0 0 0 4.2-.9" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="flex h-11 items-center gap-3 rounded-lg bg-white/10 px-3 focus-within:ring-2 focus-within:ring-purple-500">
          <svg
            className="h-5 w-5 shrink-0 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>

          <label htmlFor="confirm-password" className="sr-only">
            Confirmar contraseña
          </label>

          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-300"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Ocultar confirmación de contraseña"
                : "Mostrar confirmación de contraseña"
            }
            aria-pressed={showConfirmPassword}
            className="shrink-0 text-gray-300 transition hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {showConfirmPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c5 0 9 4 10 7a13 13 0 0 1-3.2 4.4" />
                  <path d="M6.2 6.2A13 13 0 0 0 2 12c1 3 5 7 10 7a10 10 0 0 0 4.2-.9" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 h-12 w-full rounded-lg bg-linear-to-r from-purple-700 to-purple-600 text-sm font-bold text-white shadow-lg transition hover:from-purple-600 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <p className="text-center text-xs text-gray-200 sm:text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/"
          className="font-semibold text-purple-400 transition hover:text-purple-300"
        >
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterForm