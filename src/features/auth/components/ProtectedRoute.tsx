import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import content from "@/data/content.json";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let authChanged = false;

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        authChanged = true;
        setIsAuthenticated(!!session);
        setHasError(false);
      },
    );

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted || authChanged) return;

        if (error) {
          setHasError(true);
          return;
        }

        setIsAuthenticated(!!session);
      })
      .catch(() => {
        if (isMounted && !authChanged) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (hasError) {
    return <p role="alert">{content.auth.validation.sessionError}</p>;
  }

  if (isAuthenticated === null) {
    return <p>{content.auth.validation.isAuthenticated}</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
