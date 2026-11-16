import { useState } from "react"
import type { SubmitEvent } from "react"
import { Link, useNavigate } from "react-router"
import { loginUser } from "../services/authService"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    try {
      await loginUser(email, password)
      navigate("/app")
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      )
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        {error && <p>{error}</p>}
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </main>
  )
}

export default LoginPage