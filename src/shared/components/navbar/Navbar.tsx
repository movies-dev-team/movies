import { NavLink } from "react-router";
import content from "@/data/content.json";

import DesktopNavbar from "./components/DesktopNavbar";
import NavigationLink from "./components/NavigationLink";
import ProfileMenu from "./components/ProfileMenu";

import logo from "@/assets/images/logo.svg";
import catalogActive from "./assets/icons/catalogActive.svg";
import catalogDefault from "./assets/icons/catalogDefault.svg";
import favoritesActive from "./assets/icons/favoritesActive.svg";
import favoritesDefault from "./assets/icons/favoritesDefault.svg";
import imgNavBar from "./assets/images/imgNavBar.webp";

const Navbar = () => {
  return (
    <>
      {/* Top mobile navbar */}
      <header className="relative isolate flex items-center justify-between overflow-hidden border-b border-border bg-card px-5 py-2 md:hidden">
        
        <img
          src={imgNavBar}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[2.5] translate-y-3 object-cover object-center opacity-30 md:scale-100"
        />

        {/* Header content */}
        <NavLink
          to="/app"
          aria-label={content.navigation.accessibility.brand}
          className="relative z-10 translate-y-1"
        >
          <img src={logo} alt="CINÉA" className="h-9 w-auto" />
        </NavLink>
      </header>

           <DesktopNavbar />

      {/* Bottom mobile navbar */}
      <nav
        aria-label={content.navigation.accessibility.main}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-3 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md md:hidden"
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
  );
};

export default Navbar;
