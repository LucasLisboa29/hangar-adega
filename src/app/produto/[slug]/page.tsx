import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wine } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { getProdutoPorSlug, getSlugsDeProdutos } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

// Gera as páginas de produto estaticamente a partir do catálogo.
export async function generateStaticParams() {
  const slugs = await getSlugsDeProdutos();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProdutoPorSlug(slug);
  if (!produto) return { title: "Produto não encontrado" };

  return {
    title: produto.nome,
    description:
      produto.descricao ??
      `${produto.nome} — ${produto.categoria.nome} na Hangar Bebidas.`,
  };
}

export default async function ProdutoPage({
  params,
}: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const produto = await getProdutoPorSlug(slug);

  if (!produto || !produto.ativo) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link
        href={`/?categoria=${produto.categoria.slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {produto.categoria.nome}
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent to-card">
          {produto.imagemUrl ? (
            <Image
              src={produto.imagemUrl}
              alt={produto.nome}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Wine className="size-24 text-primary/25" strokeWidth={1} />
            </div>
          )}
          {produto.esgotado && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
              <Badge variant="secondary" className="text-sm">
                Esgotado
              </Badge>
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex flex-col">
          <Badge variant="outline" className="mb-3">
            {produto.categoria.nome}
          </Badge>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {produto.nome}
          </h1>

          <p className="mt-3 font-heading text-3xl font-bold text-primary">
            {formatBRL(produto.precoCentavos)}
          </p>

          {produto.descricao && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {produto.descricao}
            </p>
          )}

          <div className="mt-auto pt-8">
            <AddToCartButton
              produto={{
                id: produto.id,
                slug: produto.slug,
                nome: produto.nome,
                precoCentavos: produto.precoCentavos,
                imagemUrl: produto.imagemUrl,
              }}
              disabled={produto.esgotado}
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Pagamento na entrega · Pedido mínimo de R$ 25,00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
