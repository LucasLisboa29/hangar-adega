import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="dark flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-24 text-center text-foreground">
      <span className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Desde 2009 · Araguari-MG
      </span>

      <h1 className="font-heading text-6xl font-bold uppercase tracking-tight text-gold sm:text-7xl">
        Hangar Bebidas
      </h1>

      <p className="max-w-md text-lg text-muted-foreground">
        Adega e conveniência com entrega em Uberlândia e Araguari. Nossa nova
        loja online está decolando. 🛫
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="font-semibold">
          Ver catálogo
        </Button>
        <Button size="lg" variant="outline">
          Informações da loja
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Em construção · Fase 0 — Fundação
      </p>
    </div>
  );
}
