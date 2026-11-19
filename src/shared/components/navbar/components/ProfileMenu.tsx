import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
import content from "@/data/content.json";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logoutUser } from "@/features/auth/services/authService";

import profileActive from "../assets/icons/profileActive.svg";
import profileDefault from "../assets/icons/profileDefault.svg";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isProfileActive = location.pathname.startsWith("/app/profile");

  async function handleLogout() {
    try {
      setError("");
      setIsLoggingOut(true);

      await logoutUser();

      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al cerrar sesión",
      );
    } finally {
      setIsLoggingOut(false);
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
          <span className="flex w-fit flex-col items-center justify-center gap-y-0.5 rounded-lg px-3 py-1 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-surface-elevated md:flex-row md:gap-2">
            <img
              src={isProfileActive ? profileActive : profileDefault}
              alt=""
              className="size-5 md:size-6"
            />

            <span className="md:hidden">Perfil</span>

            <ChevronDown className="hidden size-4 md:block" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="end" sideOffset={8}>
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
        <p role="alert" className="max-w-40 text-center text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfileMenu;
