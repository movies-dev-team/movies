import { NavLink } from "react-router";
import content from "@/data/content.json";

import logo from "@/assets/images/logo.svg";
import catalogActive from "./assets/icons/catalogActive.svg";
import catalogDefault from "./assets/icons/catalogDefault.svg";
import profileActive from "./assets/icons/profileActive.svg";
import profileDefault from "./assets/icons/profileDefault.svg";
import favoritesActive from "@/assets/icons/favoritesActive.svg";
import favoritesDefault from "@/assets/icons/favoritesDefault.svg";

const Navbar = () => {
  return (
    <>
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 md:hidden">
        <NavLink to="/app" aria-label={content.navigation.accessibility.brand}>
          <img src={logo} alt="CINÉA" className="h-9 w-auto" />
        </NavLink>
      </header>

      {/* Desktop and tablet navigation */}
      <nav
        aria-label={content.navigation.accessibility.main}
        className="hidden items-center justify-between border-b border-border bg-card px-6 py-3 md:flex"
      >
        <div className="flex items-center gap-6 lg:gap-10">
          <NavLink to="/app">
            <img src={logo} alt="CINÉA" className="h-9 w-auto" />
          </NavLink>

          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 transition-colors ${
                isActive
                  ? "text-brand-light"
                  : "text-text-secondary hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? catalogActive : catalogDefault}
                  alt=""
                  className="size-5"
                />
                {content.navigation.catalog}
              </>
            )}
          </NavLink>

          <NavLink
            to="/app/favorites"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 transition-colors ${
                isActive
                  ? "text-brand-light"
                  : "text-text-secondary hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? favoritesActive : favoritesDefault}
                  alt=""
                  className="size-5"
                />
                {content.navigation.favorites}
              </>
            )}
          </NavLink>
        </div>

        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-2 transition-colors ${
              isActive
                ? "text-brand-light"
                : "text-text-secondary hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? profileActive : profileDefault}
                alt=""
                className="size-5"
              />
              {content.navigation.profile}
            </>
          )}
        </NavLink>
      </nav>

      {/* Mobile bottom navigation */}
      <nav
        aria-label={content.navigation.accessibility.main}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md md:hidden"
      >
        <div className="flex items-center justify-around">
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? "text-brand-light" : "text-text-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? catalogActive : catalogDefault}
                  alt=""
                  className="size-6"
                />
                {content.navigation.catalog}
              </>
            )}
          </NavLink>

          <NavLink
            to="/app/favorites"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? "text-brand-light" : "text-text-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? favoritesActive : favoritesDefault}
                  alt=""
                  className="size-6"
                />
                {content.navigation.favorites}
              </>
            )}
          </NavLink>

          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? "text-brand-light" : "text-text-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? profileActive : profileDefault}
                  alt=""
                  className="size-6"
                />
                {content.navigation.profile}
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
