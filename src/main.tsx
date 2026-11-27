import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./router";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider delay={0}>
      <Suspense fallback={<div className="min-h-dvh" />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  </StrictMode>,
);
