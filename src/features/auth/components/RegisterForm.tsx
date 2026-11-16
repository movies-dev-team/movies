import { useState } from "react"
import type { SubmitEvent } from "react"
import { registerUser } from "../services/authService"

function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await registerUser(email, password)
      setMessage("Usuario registrado correctamente")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error al registrarse"
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>

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
        minLength={6}
        required
      />

      <button type="submit">Registrarse</button>

      {message && <p>{message}</p>}
    </form>
  )
}

export default RegisterForm