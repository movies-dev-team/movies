import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

function DesignSystemPage() {
  return (
    <main className="min-h-dvh space-y-6 bg-background p-4 text-foreground">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">CINÉA Design System</h1>
        <p className="text-sm text-muted-foreground">Button variants</p>
      </header>

      <section className="flex flex-col items-start gap-4">
  <div className="flex items-center gap-4">
    <Button variant="default">Iniciar sesión</Button>
    <span className="text-sm text-muted-foreground">
      Acción principal
    </span>
  </div>

  <div className="flex items-center gap-4">
    <Button variant="secondary">Secondary</Button>
    <span className="text-sm text-muted-foreground">
      Cancelar o volver
    </span>
  </div>

  <div className="flex items-center gap-4">
    <Button variant="ghost">Ghost</Button>
    <span className="text-sm text-muted-foreground">
      Menús, enlaces y acciones discretas
    </span>
  </div>

  <div className="flex items-center gap-4">
    <Button variant="soft">Soft</Button>
    <span className="text-sm text-muted-foreground">
      Elementos activos o seleccionados
    </span>
  </div>

  <div className="flex items-center gap-4">
    <Button variant="glass">
      <Heart />
      Glass
    </Button>
    <span className="text-sm text-muted-foreground">
      Botones sobre imágenes y pósteres
    </span>
  </div>

  <div className="flex items-center gap-4">
    <Button variant="destructive">Destructive</Button>
    <span className="text-sm text-muted-foreground">
      Eliminar o cerrar sesión
    </span>
  </div>
</section>
    </main>
  );
}

export default DesignSystemPage;
