
import { NavLink, useNavigate, useLocation } from "react-router"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import content from "@/data/content.json"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { logoutUser } from "@/features/auth/services/authService"

import logo from "@/assets/images/logo.svg"
import catalogActive from "./assets/icons/catalogActive.svg"
import catalogDefault from "./assets/icons/catalogDefault.svg"
import profileActive from "./assets/icons/profileActive.svg"
import profileDefault from "./assets/icons/profileDefault.svg"
import favoritesActive from "./assets/icons/favoritesActive.svg"
import favoritesDefault from "./assets/icons/favoritesDefault.svg"

interface NavigationLinkProps {
  to: string
  label: string
  activeIcon: string
  defaultIcon: string
  end?: boolean
}

const NavigationLink = ({
  to,
  label,
  activeIcon,
  defaultIcon,
  end = false,
}: NavigationLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex flex-1 flex-col items-center justify-center text-sm transition-colors md:flex-none md:text-base ${
          isActive ? "text-brand-light" : "text-text-secondary"
        }`
      }
    >
      {({ isActive }) => (
        <span
          className={`flex w-fit flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-surface-elevated md:flex-row md:gap-2 ${
            isActive ? "text-brand-light" : ""
          }`}
        >
          <img
            src={isActive ? activeIcon : defaultIcon}
            alt=""
            className="size-8 md:size-7"
          />

          <span>{label}</span>
        </span>
      )}
    </NavLink>
  )
}


const ProfileMenu = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isProfileActive = location.pathname.startsWith("/app/profile")

  async function handleLogout() {
      console.log("Ejecutando cierre de sesión")
    try {
      setError("")
      setIsLoggingOut(true)

      await logoutUser()

      navigate("/", { replace: true })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cerrar sesión"
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center md:flex-none">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={content.navigation.profile.information}
          className={`group flex flex-col items-center justify-center text-sm transition-colors md:text-base ${
            isProfileActive ? "text-brand-light" : "text-text-secondary"
          }`}
        >
          <span className="flex w-fit flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-surface-elevated md:flex-row md:gap-2">
            <img
              src={isProfileActive ? profileActive : profileDefault}
              alt=""
              className="size-7 md:size-6"
            />

            <span className="md:hidden">Perfil</span>

            <ChevronDown className="hidden size-4 md:block" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuItem
            className="cursor-pointer transition-colors hover:text-brand-soft focus:text-brand-soft"
            onClick={() => navigate("/app/profile")}
          >
            {content.navigation.profile.information}
          </DropdownMenuItem>

          <DropdownMenuItem
           disabled={isLoggingOut}
           onClick={handleLogout}
          className="cursor-pointer transition-colors hover:text-brand-soft focus:text-brand-soft"
          >
          {isLoggingOut
             ? "Cerrando sesión..."
           : content.navigation.profile.signOut}
</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <p
          role="alert"
          className="max-w-40 text-center text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  )
}


const Navbar = () => {
  return (
    <>

      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 md:hidden">
        <NavLink
          to="/app"
          aria-label={content.navigation.accessibility.brand}
        >
          <img
            src={logo}
            alt="CINÉA"
            className="h-9 w-auto"
          />
        </NavLink>
      </header>

      <nav
        aria-label={content.navigation.accessibility.main}
        className="hidden items-center justify-between border-b border-border bg-card px-6 py-3 md:flex"
      >
        <div className="flex items-center gap-6 lg:gap-10">
          <NavLink to="/app">
            <img
              src={logo}
              alt="CINÉA"
              className="h-9 w-auto"
            />
          </NavLink>

          <NavigationLink
            to="/app"
            end
            label={content.navigation.catalog}
            activeIcon={catalogActive}
            defaultIcon={catalogDefault}
          />

          <NavigationLink
            to="/app/favorites"
            label={content.navigation.favorites}
            activeIcon={favoritesActive}
            defaultIcon={favoritesDefault}
          />
        </div>

        <ProfileMenu />
      </nav>

      <nav
        aria-label={content.navigation.accessibility.main}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md md:hidden"
      >
        <div className="flex items-center justify-around">
          <NavigationLink
            to="/app"
            end
            label={content.navigation.catalog}
            activeIcon={catalogActive}
            defaultIcon={catalogDefault}
          />

          <NavigationLink
            to="/app/favorites"
            label={content.navigation.favorites}
            activeIcon={favoritesActive}
            defaultIcon={favoritesDefault}
          />

          <ProfileMenu />
        </div>
      </nav>
    </>
  )
}

export default Navbar