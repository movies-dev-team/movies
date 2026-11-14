import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function DesignSystemPage() {
  return (
    <main className="min-h-dvh space-y-6 bg-background p-4 text-foreground">
      {/*---------------BOTONES---------------- */}
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
      {/*---------------CARD---------------- */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Card</h2>
          <p className="text-sm text-muted-foreground">Card component</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Card className="h-64 w-60" />
          <Card className="h-64 w-60" />
        </div>
      </section>
      //INPUT
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Input</h2>
          <p className="text-sm text-muted-foreground">Input component</p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <Input type="text" placeholder="Buscar películas..." />
        </div>
      </section>
      {/*---------------CHECKBOX---------------- */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Checkbox</h2>
          <p className="text-sm text-muted-foreground">
            Checkbox component · Estados y variantes
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border-hover hover:bg-surface-hover">
            <Checkbox defaultChecked />
            Acción
          </label>
        </div>
      </section>
      {/*---------------SKELETON---------------- */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Skeleton</h2>
          <p className="text-sm text-muted-foreground">
            Skeleton component · Estados de carga
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-64 w-60 rounded-xl" />
          <Skeleton className="h-64 w-60 rounded-xl" />
        </div>
      </section>
      {/*---------------TOAST---------------- */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Toast</h2>
          <p className="text-sm text-muted-foreground">
            Toast component · Notificaciones
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="soft"
            onClick={() => toast.success("Película añadida a favoritos")}
          >
            Success
          </Button>

          <Button
            variant="soft"
            onClick={() => toast.info("Tu lista se ha actualizado")}
          >
            Info
          </Button>

          <Button
            variant="soft"
            onClick={() =>
              toast.warning("Todavía no has puntuado esta película")
            }
          >
            Warning
          </Button>

          <Button
            variant="destructive"
            onClick={() => toast.error("No se ha podido guardar la película")}
          >
            Error
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              const id = toast.loading("Guardando puntuación...");

              setTimeout(() => {
                toast.success("Puntuación guardada correctamente", { id });
              }, 2000);
            }}
          >
            Loading
          </Button>
        </div>
      </section>
      {/*---------------DIALOG---------------- */}
      {/*---------------DIALOG----------------*/}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Dialog</h2>
          <p className="text-sm text-muted-foreground">
            Dialog component · Ventanas de confirmación
          </p>
        </div>

        <Dialog>
          <DialogTrigger render={<Button variant="secondary" />}>
            Abrir Dialog
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar de favoritos</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar esta película de tu lista
                de favoritos?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>
                Cancelar
              </DialogClose>

              <DialogClose render={<Button variant="destructive" />}>
                Eliminar
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}

export default DesignSystemPage;
