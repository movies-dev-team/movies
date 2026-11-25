import { NavLink } from "react-router";
import content from "@/data/content.json";

import NavigationLink from "./NavigationLink";
import ProfileMenu from "./ProfileMenu";

import logo from "@/assets/images/logo.svg";
import catalogActive from "../assets/icons/catalogActive.svg";
import catalogDefault from "../assets/icons/catalogDefault.svg";
import favoritesActive from "../assets/icons/favoritesActive.svg";
import favoritesDefault from "../assets/icons/favoritesDefault.svg";
import imgNavBar from "../assets/images/imgNavBar.webp";

const DesktopNavbar = () => {
  return (
    <nav
      aria-label={content.navigation.accessibility.main}
      className="sticky top-0 z-50 isolate hidden items-center justify-between overflow-hidden border-b border-border bg-card px-6 py-2.5 md:flex"
    >
      <img
        src={imgNavBar}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-[125%] w-full translate-y-2 object-cover object-center opacity-30"
      />

      <div className="relative z-10 flex w-full items-center justify-between translate-y-1">
        <div className="flex items-center gap-6 lg:gap-10">
          <NavLink to="/app">
            <img src={logo} alt="CINÉA" className="h-11 w-auto" />
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
      </div>
    </nav>
  );
};

export default DesktopNavbar;
