import { Suspense } from "react";
import { SearchX, Star, Tag } from "lucide-react";

import { PriceFilter } from "@/components/price-filter";
import { ProductCard } from "@/components/product-card";
import {
  buscarProdutos,
  getCategoriasComProdutos,
  getProdutosDestaque,
  getProdutosEmOferta,
} from "@/lib/catalog";
import { parseReaisParaCentavos } from "@/lib/format";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    precoMin?: string;
    precoMax?: string;
  }>;
}) {
  const { q, categoria, precoMin, precoMax } = await searchParams;
  const termoBusca = q?.trim();
  const precoMinCentavos = precoMin ? parseReaisParaCentavos(precoMin) : null;
  const precoMaxCentavos = precoMax ? parseReaisParaCentavos(precoMax) : null;
  const filtrando = Boolean(
    termoBusca || categoria || precoMinCentavos != null || precoMaxCentavos != null
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Banner da marca: só na home (sem filtro/busca). Ao filtrar por
          categoria, a tela vai direto para os produtos. */}
      {!filtrando && (
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
      )}

      <div className="mb-6">
        <Suspense fallback={null}>
          <PriceFilter />
        </Suspense>
      </div>

      {filtrando ? (
        <ResultadosFiltrados
          q={termoBusca}
          categoriaSlug={categoria}
          precoMinCentavos={precoMinCentavos ?? undefined}
          precoMaxCentavos={precoMaxCentavos ?? undefined}
        />
      ) : (
        <>
          <Ofertas />
          <Destaques />
          <CatalogoPorCategoria />
        </>
      )}
    </div>
  );
}

async function Ofertas() {
  const produtos = await getProdutosEmOferta();

  if (produtos.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
        <Tag className="size-5 text-red-500" />
        Ofertas
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}

async function Destaques() {
  const produtos = await getProdutosDestaque();

  if (produtos.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-xl font-semibold uppercase tracking-tight text-foreground">
        <Star className="size-5 fill-primary text-primary" />
        Destaques
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
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
  precoMinCentavos,
  precoMaxCentavos,
}: {
  q?: string;
  categoriaSlug?: string;
  precoMinCentavos?: number;
  precoMaxCentavos?: number;
}) {
  const produtos = await buscarProdutos({
    q,
    categoriaSlug,
    precoMinCentavos,
    precoMaxCentavos,
  });

  if (produtos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum produto encontrado
          {q ? ` para “${q}”` : ""}
          {precoMinCentavos != null || precoMaxCentavos != null
            ? " nessa faixa de preço"
            : ""}
          .
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
