"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  salvarCategoria,
  type CategoriaState,
} from "@/app/admin/categorias/actions";

type CategoriaEdicao = {
  id: string;
  nome: string;
  ordem: number;
  ativa: boolean;
};

const estadoInicial: CategoriaState = {};

export function CategoriaForm({ categoria }: { categoria?: CategoriaEdicao }) {
  const [state, action, pending] = useActionState(
    salvarCategoria,
    estadoInicial
  );
  const edicao = Boolean(categoria);

  return (
    <form action={action} className="max-w-md space-y-5">
      {categoria && <input type="hidden" name="id" value={categoria.id} />}

      <div className="space-y-1.5">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome
        </label>
        <Input id="nome" name="nome" defaultValue={categoria?.nome} required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ordem" className="text-sm font-medium">
          Ordem
        </label>
        <Input
          id="ordem"
          name="ordem"
          type="number"
          min={0}
          defaultValue={categoria?.ordem ?? 0}
          className="w-24"
        />
        <p className="text-xs text-muted-foreground">
          Menor número aparece primeiro na loja.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ativa"
          defaultChecked={categoria ? categoria.ativa : true}
          className="size-4 accent-primary"
        />
        Ativa (aparece na loja)
      </label>

      {state?.erro && <p className="text-sm text-destructive">{state.erro}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Salvando…"
            : edicao
              ? "Salvar alterações"
              : "Criar categoria"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/categorias">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
