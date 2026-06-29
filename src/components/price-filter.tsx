"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Filtro por faixa de preço via GET (?precoMin=&precoMax=, em reais). Como é um
// <form> nativo, funciona sem JS; o "use client" serve para preencher os valores
// atuais e preservar q/categoria (hidden) ao aplicar o filtro de preço.
export function PriceFilter() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const categoria = params.get("categoria") ?? "";
  const precoMin = params.get("precoMin") ?? "";
  const precoMax = params.get("precoMax") ?? "";
  const ativo = Boolean(precoMin || precoMax);

  return (
    <form
      action="/"
      className="flex flex-wrap items-end gap-2"
      aria-label="Filtrar por preço"
    >
      {/* Preserva busca/categoria ao aplicar o filtro de preço. */}
      {q && <input type="hidden" name="q" value={q} />}
      {categoria && <input type="hidden" name="categoria" value={categoria} />}

      <div className="space-y-1">
        <label htmlFor="precoMin" className="text-xs text-muted-foreground">
          Preço de (R$)
        </label>
        <Input
          id="precoMin"
          name="precoMin"
          inputMode="decimal"
          placeholder="0"
          defaultValue={precoMin}
          className="h-9 w-24"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="precoMax" className="text-xs text-muted-foreground">
          até (R$)
        </label>
        <Input
          id="precoMax"
          name="precoMax"
          inputMode="decimal"
          placeholder="sem limite"
          defaultValue={precoMax}
          className="h-9 w-28"
        />
      </div>

      <Button type="submit" variant="outline" size="sm" className="h-9">
        Filtrar
      </Button>

      {ativo && (
        <Button asChild variant="ghost" size="sm" className="h-9">
          <Link
            href={
              categoria
                ? `/?categoria=${categoria}`
                : q
                  ? `/?q=${encodeURIComponent(q)}`
                  : "/"
            }
          >
            Limpar
          </Link>
        </Button>
      )}
    </form>
  );
}
