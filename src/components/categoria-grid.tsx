import Link from "next/link";
import {
  Beer,
  Wine,
  Martini,
  Zap,
  CupSoda,
  Citrus,
  Dumbbell,
  Droplets,
  Cigarette,
  ShoppingBasket,
  GlassWater,
  type LucideIcon,
} from "lucide-react";

import { getCategorias } from "@/lib/catalog";

// Ícone por categoria (slug → ícone lucide). Slug desconhecido cai no genérico.
const ICONE_POR_SLUG: Record<string, LucideIcon> = {
  cervejas: Beer,
  vinhos: Wine,
  destilados: Martini,
  energeticos: Zap,
  refrigerantes: CupSoda,
  sucos: Citrus,
  isotonicos: Dumbbell,
  aguas: Droplets,
  tabacaria: Cigarette,
  conveniencia: ShoppingBasket,
};

// Grade com TODAS as categorias visíveis na home (sem scroll lateral). Cada tile
// leva para a categoria filtrada (?categoria=slug). O id="grade-categorias" é o
// alvo do IntersectionObserver da barra sticky: enquanto esta grade está à vista,
// a barra de categorias fica escondida (evita navegação duplicada).
export async function GradeCategorias() {
  const categorias = await getCategorias();
  if (categorias.length === 0) return null;

  return (
    <section id="grade-categorias" className="mb-10 scroll-mt-24">
      <h2 className="mb-3 font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
        Categorias
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {categorias.map((cat) => {
          const Icone = ICONE_POR_SLUG[cat.slug] ?? GlassWater;
          return (
            <Link
              key={cat.id}
              href={`/?categoria=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <Icone className="size-7 text-primary" strokeWidth={1.5} />
              <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                {cat.nome}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
