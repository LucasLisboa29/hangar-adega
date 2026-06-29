"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

type Categoria = { id: string; nome: string; slug: string };

// Navegação de categorias (?categoria=slug). Vive na barra sticky do layout, então
// lê a categoria ativa da URL (client) e se esconde nas telas de finalização —
// onde navegar por categoria não faz sentido. "Todos" limpa o filtro.
export function CategoryPills({ categorias }: { categorias: Categoria[] }) {
  const pathname = usePathname();
  const activeSlug = useSearchParams().get("categoria") ?? undefined;

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
      <nav
        aria-label="Categorias"
        className="mx-auto flex max-w-6xl flex-nowrap gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
    </div>
  );
}
