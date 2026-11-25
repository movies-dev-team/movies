/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AuthRoute from "@/features/auth/components/AuthRoute";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const CatalogPage = lazy(() => import("@/features/catalog/pages/CatalogPage"));
const FavoritesPage = lazy(() => import("@/features/favorites/FavoritesPage"));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));

const MovieDetailPage = lazy(
  () => import("@/features/details/pages/MovieDetailPage"),
);
const ActorDetailPage = lazy(
  () => import("@/features/details/pages/ActorDetailPage"),
);
const DirectorDetailPage = lazy(
  () => import("@/features/details/pages/DirectorDetailPage"),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthRoute,
    children: [
      {
        Component: AuthLayout,
        children: [
          { index: true, Component: LoginPage },
          { path: "register", Component: RegisterPage },
        ],
      },
    ],
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
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
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

export default router;