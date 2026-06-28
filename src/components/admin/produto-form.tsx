"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salvarProduto, type ProdutoState } from "@/app/admin/produtos/actions";
import { centavosParaInput } from "@/lib/format";

type Categoria = { id: string; nome: string };

type ProdutoEdicao = {
  id: string;
  nome: string;
  descricao: string | null;
  precoCentavos: number;
  categoriaId: string;
  imagemUrl: string | null;
  ativo: boolean;
  esgotado: boolean;
  destaque: boolean;
};

const estadoInicial: ProdutoState = {};

export function ProdutoForm({
  categorias,
  produto,
}: {
  categorias: Categoria[];
  produto?: ProdutoEdicao;
}) {
  const [state, action, pending] = useActionState(salvarProduto, estadoInicial);
  const edicao = Boolean(produto);

  return (
    <form action={action} className="max-w-xl space-y-5">
      {produto && <input type="hidden" name="id" value={produto.id} />}

      <div className="space-y-1.5">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome
        </label>
        <Input id="nome" name="nome" defaultValue={produto?.nome} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="preco" className="text-sm font-medium">
            Preço (R$)
          </label>
          <Input
            id="preco"
            name="preco"
            inputMode="decimal"
            placeholder="19,90"
            defaultValue={
              produto ? centavosParaInput(produto.precoCentavos) : ""
            }
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoriaId" className="text-sm font-medium">
            Categoria
          </label>
          <select
            id="categoriaId"
            name="categoriaId"
            defaultValue={produto?.categoriaId ?? ""}
            required
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              Selecione…
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="descricao" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          defaultValue={produto?.descricao ?? ""}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="imagem" className="text-sm font-medium">
          Imagem {edicao && "(deixe em branco para manter a atual)"}
        </label>
        {produto?.imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            className="mb-2 size-20 rounded-lg border border-border object-contain"
          />
        )}
        <Input id="imagem" name="imagem" type="file" accept="image/*" />
      </div>

      <fieldset className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={produto ? produto.ativo : true}
            className="size-4 accent-primary"
          />
          Ativo (aparece na loja)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="esgotado"
            defaultChecked={produto?.esgotado ?? false}
            className="size-4 accent-primary"
          />
          Esgotado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={produto?.destaque ?? false}
            className="size-4 accent-primary"
          />
          Destaque
        </label>
      </fieldset>

      {state?.erro && <p className="text-sm text-destructive">{state.erro}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : edicao ? "Salvar alterações" : "Criar produto"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/produtos">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
