import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex flex-wrap items-center gap-6 border-b border-border bg-card p-4">
      <NavLink to="/app">Catálogo</NavLink>

      <NavLink to="/app/favorite">Favoritos</NavLink>

      <NavLink to="/app/profile">Perfil</NavLink>
    </nav>
  );
};

export default Navbar;
