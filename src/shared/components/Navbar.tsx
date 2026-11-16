import { NavLink } from "react-router"
import { useState } from "react"
import { logoutUser } from "@/features/auth/services/authService"

const Navbar = () => {
  const [error, setError] = useState("")

  async function handleLogout() {
    try {
      setError("")
      await logoutUser()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al cerrar sesión"
      )
    }
  }

  return (
    <nav className="flex flex-wrap items-center gap-6 border-b border-border bg-card p-4">
      <NavLink to="/app">Catálogo</NavLink>

      <NavLink to="/app/favorite">Favoritos</NavLink>

      <NavLink to="/app/profile">Perfil</NavLink>

      <button
        type="button"
        onClick={handleLogout}
        className="ml-auto cursor-pointer"
      >
        Cerrar sesión
      </button>

      {error && <p role="alert">{error}</p>}
    </nav>
  )
}

export default Navbar