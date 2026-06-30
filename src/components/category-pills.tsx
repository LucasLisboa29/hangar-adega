"use client";

import { useEffect, useRef, useState } from "react";
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

  // Altura real da barra (medida) para animar height em px ao surgir/sumir — mais
  // confiável entre navegadores que animar grid-template-rows. `animar` só liga
  // depois do 1º frame, pra a barra não deslizar no carregamento da página.
  const conteudoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(0);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const el = conteudoRef.current;
    if (!el) return;
    const medir = () => setAltura(el.scrollHeight);
    medir();
    // ResizeObserver mantém a altura certa quando o painel de filtros abre/fecha.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    const raf = requestAnimationFrame(() => setAnimar(true));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname, query]);

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

  // Aba estilo "underline": sem fundo cheio; a ativa é marcada por um sublinhado
  // dourado. Padding inferior curto (pb-1.5) deixa a listra perto do nome e enxuga
  // a parte de baixo da barra. Os 2px de borda ficam reservados também na inativa
  // (transparente) para não dar pulo de layout ao trocar de aba.
  const tab = (active: boolean) =>
    cn(
      "shrink-0 border-b-2 pt-3 pb-1.5 text-sm transition-colors",
      active
        ? "border-primary font-semibold text-primary"
        : "border-transparent font-medium text-muted-foreground hover:text-foreground"
    );

  return (
    // Surge/some ao rolar animando a altura em px (medida) + fade. Animar height em
    // px é confiável em qualquer navegador (mais que grid-template-rows). O header
    // não tem mais borda inferior: barra + header são um bloco preto contínuo.
    <div
      aria-hidden={!visivel}
      style={{ height: visivel ? altura : 0 }}
      className={cn(
        "overflow-hidden",
        animar && "transition-[height,opacity] duration-300 ease-in-out",
        visivel ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div ref={conteudoRef}>
        <div className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-6xl items-stretch px-4">
            <nav
              aria-label="Categorias"
              className="flex flex-1 flex-nowrap items-stretch gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <Link href="/" className={tab(!activeSlug)}>
                Todos
              </Link>
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?categoria=${cat.slug}`}
                  className={tab(activeSlug === cat.slug)}
                >
                  {cat.nome}
                </Link>
              ))}
            </nav>

            {/* Divisória fininha: separa o "Filtros" das categorias sem a caixa preta. */}
            <div aria-hidden className="my-2 ml-2.5 mr-3 w-px self-stretch bg-border" />

            <button
              type="button"
              onClick={() => setFiltrosAbertos((v) => !v)}
              aria-expanded={filtrosAbertos}
              aria-controls="painel-filtros"
              className={cn(
                "flex shrink-0 items-center gap-1.5 pt-3 pb-1.5 text-sm transition-colors",
                filtrosAbertos || precoAtivo
                  ? "font-semibold text-primary"
                  : "font-medium text-primary/90 hover:text-primary"
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
      </div>
    </div>
  );
}
