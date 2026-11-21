import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CatalogPage from "@/features/catalog/pages/CatalogPage";
import FavoritesPage from "@/features/favorites/FavoritesPage";
import ProfilePage from "@/features/profile/ProfilePage";

import MovieDetailPage from "@/features/details/pages/MovieDetailPage";
import ActorDetailPage from "@/features/details/pages/ActorDetailPage";
import DirectorDetailPage from "@/features/details/pages/DirectorDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: CatalogPage },
      { path: "favorites", Component: FavoritesPage },
      { path: "profile", Component: ProfilePage },

      { path: "movie/:id", Component: MovieDetailPage },
      { path: "actor/:id", Component: ActorDetailPage },
      { path: "director/:id", Component: DirectorDetailPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

export default router;
