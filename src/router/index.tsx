import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CatalogPage from "@/features/catalog/pages/CatalogPage";
import FavoritesPage from "@/features/favorites/FavoritesPage";
import ProfilePage from "@/features/profile/ProfilePage";

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
      { path: "favorite", Component: FavoritesPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);

export default router;
