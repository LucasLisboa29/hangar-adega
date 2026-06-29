import Image from "next/image";
import Link from "next/link";
import { Wine } from "lucide-react";

import { QuickAddButton } from "@/components/quick-add-button";
import { Badge } from "@/components/ui/badge";
import {
  formatBRL,
  emOferta,
  precoEfetivoCentavos,
  descontoPercentual,
} from "@/lib/format";
import { cn } from "@/lib/utils";

// Campos mínimos que o card precisa — assim aceita tanto o retorno do
// catálogo agrupado quanto o da busca (que inclui a categoria).
type ProdutoCard = {
  id: string;
  slug: string;
  nome: string;
  precoCentavos: number;
  precoPromoCentavos: number | null;
  imagemUrl: string | null;
  esgotado: boolean;
  destaque: boolean;
};

export function ProductCard({ produto }: { produto: ProdutoCard }) {
  const oferta = emOferta(produto);
  const precoEfetivo = precoEfetivoCentavos(produto);

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors",
        "hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
      )}
    >
      {/* Imagem em tile branco (estilo catálogo); placeholder claro quando sem foto */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Wine
              className="size-12 text-black/15 transition-transform group-hover:scale-110"
              strokeWidth={1.25}
            />
          </div>
        )}

        {!produto.esgotado && (oferta || produto.destaque) && (
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {oferta && (
              <Badge className="border-transparent bg-red-600 text-white">
                -{descontoPercentual(produto)}%
              </Badge>
            )}
            {produto.destaque && <Badge>Destaque</Badge>}
          </div>
        )}
        {produto.esgotado && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Badge variant="secondary">Esgotado</Badge>
          </div>
        )}

        {!produto.esgotado && (
          <QuickAddButton
            produto={{
              id: produto.id,
              slug: produto.slug,
              nome: produto.nome,
              precoCentavos: precoEfetivo,
              imagemUrl: produto.imagemUrl,
            }}
          />
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {produto.nome}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <p className="font-heading text-lg font-semibold text-primary">
            {formatBRL(precoEfetivo)}
          </p>
          {oferta && (
            <p className="text-xs text-muted-foreground line-through">
              {formatBRL(produto.precoCentavos)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
