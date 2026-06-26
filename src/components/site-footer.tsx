import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { getConfigLoja } from "@/lib/catalog";

export async function SiteFooter() {
  const config = await getConfigLoja();

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between">
        <div className="space-y-1">
          <span className="font-heading text-xl font-bold uppercase tracking-tight text-primary">
            Hangar Bebidas
          </span>
          <p className="max-w-xs text-sm text-muted-foreground">
            Adega e conveniência com entrega em {config?.areaEntrega ?? "Uberlândia e Araguari"}. Desde 2009.
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {config?.endereco && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {config.endereco}
            </p>
          )}
          {config?.telefone && (
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              {config.telefone}
            </p>
          )}
          <Link
            href="/loja"
            className="inline-block pt-1 font-medium text-foreground underline-offset-4 hover:underline"
          >
            Informações da loja →
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Hangar Bebidas · Bebida alcoólica — venda proibida para menores de 18 anos.
      </div>
    </footer>
  );
}
