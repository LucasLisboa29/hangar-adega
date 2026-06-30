"use client";

import { useEffect, useState } from "react";
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
//
// Na home a barra fica ESCONDIDA enquanto a grade de categorias (#grade-categorias)
// está à vista — quem navega ali é a grade, então mostrar a barra junto seria
// navegação duplicada. Quando a grade rola pra cima e some, a barra aparece e passa
// a acompanhar o scroll. Nas telas sem grade (categoria/busca/produto) a barra
// aparece normalmente desde o topo.
export function CategoryPills({ categorias }: { categorias: Categoria[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.toString();
  const activeSlug = params.get("categoria") ?? undefined;
  const precoAtivo = Boolean(params.get("precoMin") || params.get("precoMax"));
  const [filtrosAbertos, setFiltrosAbertos] = useState(precoAtivo);

  // Estado inicial sem flash: a grade só existe na home sem filtro/busca; lá a
  // barra nasce escondida. Nas demais telas nasce visível.
  const gradePresenteAgora =
    pathname === "/" &&
    !params.get("q") &&
    !activeSlug &&
    !precoAtivo;
  const [visivel, setVisivel] = useState(!gradePresenteAgora);

  useEffect(() => {
    const grade = document.getElementById("grade-categorias");
    if (!grade) {
      // Sem grade (categoria/busca/produto): barra visível desde o topo.
      setVisivel(true);
      return;
    }
    // Tem grade (home): a barra aparece quando a grade desliza acima do header
    // sticky (deixa de ser navegação visível). Listener de scroll porque o
    // IntersectionObserver não dispara de forma confiável no preview headless.
    const avaliar = () => {
      const header = document.querySelector("header");
      const offset = header ? header.getBoundingClientRect().height : 0;
      setVisivel(grade.getBoundingClientRect().bottom <= offset);
    };
    avaliar();
    window.addEventListener("scroll", avaliar, { passive: true });
    window.addEventListener("resize", avaliar);
    return () => {
      window.removeEventListener("scroll", avaliar);
      window.removeEventListener("resize", avaliar);
    };
  }, [pathname, query]);

  if (pathname.startsWith("/checkout") || pathname.startsWith("/pedido")) {
    return null;
  }

  if (!visivel) {
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
