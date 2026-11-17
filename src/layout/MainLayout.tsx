import { Outlet } from "react-router";
import Navbar from "@/shared/components/navbar/Navbar";
import Footer from "@/shared/components/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
