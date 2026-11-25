
import { Outlet } from "react-router";
import Navbar from "@/shared/components/navbar/Navbar";
import Footer from "@/shared/components/Footer";
import { FavoritesProvider } from "@/features/favorites/context/FavoritesProvider";

const MainLayout = () => {
  return (
    <FavoritesProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />

        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>

        <Footer />
      </div>
    </FavoritesProvider>
  );
};

export default MainLayout;
