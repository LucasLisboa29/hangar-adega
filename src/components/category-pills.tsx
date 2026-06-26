import Link from "next/link";

import { cn } from "@/lib/utils";

type Categoria = { id: string; nome: string; slug: string };

// Filtro por categoria via querystring (?categoria=slug). "Todos" limpa o filtro.
export function CategoryPills({
  categorias,
  activeSlug,
}: {
  categorias: Categoria[];
  activeSlug?: string;
}) {
  const pill = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
    );

  return (
    <nav
      aria-label="Categorias"
      className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
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
  );
}
