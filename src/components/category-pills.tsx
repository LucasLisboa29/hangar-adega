"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { PriceFilter } from "@/components/price-filter";
import { cn } from "@/lib/utils";

type Categoria = { id: string; nome: string; slug: string };

// Navegação de categorias (?categoria=slug). Vive na barra sticky do layout, então
// lê a categoria ativa da URL (client) e se esconde nas telas de finalização —
// onde navegar por categoria não faz sentido. "Todos" limpa o filtro. O botão
// "Filtros" abre/fecha um painel de faixa de preço logo abaixo da barra (escondido
// por padrão); abre automático quando já há um filtro de preço ativo na URL.
export function CategoryPills({ categorias }: { categorias: Categoria[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeSlug = params.get("categoria") ?? undefined;
  const precoAtivo = Boolean(params.get("precoMin") || params.get("precoMax"));
  const [filtrosAbertos, setFiltrosAbertos] = useState(precoAtivo);

  if (pathname.startsWith("/checkout") || pathname.startsWith("/pedido")) {
    return null;
  }

  const pill = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
    );

  return (
    <div className="border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4">
        <nav
          aria-label="Categorias"
          className="flex flex-1 flex-nowrap gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link href="/" className={pill(!activeSlug)}>
            Todos
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/?categoria=${cat.slug}`}
              className={pill(activeSlug === cat.slug)}
            >
              {cat.nome}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setFiltrosAbertos((v) => !v)}
          aria-expanded={filtrosAbertos}
          aria-controls="painel-filtros"
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            filtrosAbertos || precoAtivo
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </button>
      </div>

      {filtrosAbertos && (
        <div id="painel-filtros" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <PriceFilter />
          </div>
        </div>
      )}
    </div>
  );
}
