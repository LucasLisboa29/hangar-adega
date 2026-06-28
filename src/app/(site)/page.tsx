import { SearchX } from "lucide-react";

import { CategoryPills } from "@/components/category-pills";
import { ProductCard } from "@/components/product-card";
import {
  buscarProdutos,
  getCategorias,
  getCategoriasComProdutos,
} from "@/lib/catalog";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;
  const termoBusca = q?.trim();
  const filtrando = Boolean(termoBusca || categoria);

  const categorias = await getCategorias();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Banner curto da marca */}
      <section className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-accent/60 to-card px-6 py-8 sm:px-10 sm:py-10">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Adega & conveniência · Araguari-MG
        </span>
        <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tight text-primary sm:text-4xl">
          Sua bebida gelada, entregue rápido
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
          Cervejas, vinhos, destilados, energéticos e conveniência com entrega
          em Uberlândia e Araguari. Pedido mínimo de R$ 25,00.
        </p>
      </section>

      <div className="mb-6">
        <CategoryPills categorias={categorias} activeSlug={categoria} />
      </div>

      {filtrando ? (
        <ResultadosFiltrados q={termoBusca} categoriaSlug={categoria} />
      ) : (
        <CatalogoPorCategoria />
      )}
    </div>
  );
}

async function CatalogoPorCategoria() {
  const categorias = await getCategoriasComProdutos();

  return (
    <div className="space-y-10">
      {categorias.map((cat) =>
        cat.produtos.length === 0 ? null : (
          <section key={cat.id} id={cat.slug} className="scroll-mt-24">
            <h2 className="mb-3 font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
              {cat.nome}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {cat.produtos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}

async function ResultadosFiltrados({
  q,
  categoriaSlug,
}: {
  q?: string;
  categoriaSlug?: string;
}) {
  const produtos = await buscarProdutos({ q, categoriaSlug });

  if (produtos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum produto encontrado
          {q ? ` para “${q}”` : ""}.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-sm text-muted-foreground">
        {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
        {q ? ` para “${q}”` : ""}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
