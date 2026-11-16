import { NavLink } from "react-router";
import content from "@/data/content.json";

const Navbar = () => {
  return (
    <nav className="flex flex-wrap items-center gap-6 border-b border-border bg-card p-4">
      <NavLink to="/app">{content.navigation.catalog}</NavLink>

      <NavLink to="/app/favorite">{content.navigation.favorites}</NavLink>

      <NavLink to="/app/profile">{content.navigation.profile}</NavLink>
    </nav>
  );
};

export default Navbar;
