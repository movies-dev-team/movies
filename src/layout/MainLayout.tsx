import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"
import Navbar from "@/shared/components/navbar/Navbar"
import Footer from "@/shared/components/Footer"
import { supabase } from "@/lib/supabaseClient"
import { FavoritesProvider } from "@/features/favorites/context/FavoritesProvider"

const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (isAuthenticated === null) {
    return <p>Comprobando sesión...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

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
  )
}

export default MainLayout