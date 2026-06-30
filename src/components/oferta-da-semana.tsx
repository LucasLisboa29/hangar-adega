import Image from "next/image";
import Link from "next/link";
import { Wine } from "lucide-react";

import { getProdutosEmOferta } from "@/lib/catalog";
import {
  formatBRL,
  precoEfetivoCentavos,
  descontoPercentual,
} from "@/lib/format";

// Banner de destaque da home: puxa o produto em oferta de MAIOR desconto. Se não
// houver nenhuma oferta cadastrada, não renderiza nada (a home segue normal).
export async function OfertaDaSemana() {
  const ofertas = await getProdutosEmOferta();
  if (ofertas.length === 0) return null;

  const produto = [...ofertas].sort(
    (a, b) => descontoPercentual(b) - descontoPercentual(a)
  )[0];
  const precoEfetivo = precoEfetivoCentavos(produto);

  return (
    <section className="mb-10">
      <Link
        href={`/produto/${produto.slug}`}
        className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-accent/60 to-card p-5 transition-colors hover:border-primary/60 sm:gap-6 sm:p-6"
      >
        <div className="flex-1">
          <span className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Oferta da semana · -{descontoPercentual(produto)}%
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight text-primary sm:text-3xl">
            {produto.nome}
          </h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold text-foreground">
              {formatBRL(precoEfetivo)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatBRL(produto.precoCentavos)}
            </span>
          </div>
          <span className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
            Aproveitar
          </span>
        </div>

        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-white sm:size-36">
          {produto.imagemUrl ? (
            <Image
              src={produto.imagemUrl}
              alt={produto.nome}
              fill
              sizes="144px"
              className="object-contain p-2 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Wine className="size-12 text-black/15" strokeWidth={1.25} />
            </div>
          )}
        </div>
      </Link>
    </section>
  );
}
