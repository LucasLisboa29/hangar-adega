import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { listarCategoriasAdmin } from "@/lib/admin/categorias";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  alternarAtiva,
  atualizarOrdem,
  excluirCategoria,
} from "@/app/admin/categorias/actions";

export const dynamic = "force-dynamic";

export default async function CategoriasAdminPage() {
  const categorias = await listarCategoriasAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            {categorias.length} categoria(s). A ordem define a sequência na loja.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/novo">
            <Plus className="size-4" />
            Nova categoria
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Ordem</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Produtos</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categorias.map((c) => (
              <tr key={c.id} className="align-middle">
                <td className="px-4 py-3">
                  {/* Edição rápida de ordem */}
                  <form action={atualizarOrdem} className="flex items-center gap-1.5">
                    <input type="hidden" name="id" value={c.id} />
                    <Input
                      name="ordem"
                      type="number"
                      min={0}
                      defaultValue={c.ordem}
                      className="h-7 w-16"
                      aria-label={`Ordem de ${c.nome}`}
                    />
                    <Button type="submit" variant="outline" size="sm">
                      OK
                    </Button>
                  </form>
                </td>
                <td className="px-4 py-3 font-medium">{c.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c._count.produtos}
                </td>
                <td className="px-4 py-3">
                  <form action={alternarAtiva}>
                    <input type="hidden" name="id" value={c.id} />
                    <Button
                      type="submit"
                      size="xs"
                      variant={c.ativa ? "secondary" : "outline"}
                    >
                      {c.ativa ? "Ativa" : "Inativa"}
                    </Button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="icon-sm">
                      <Link
                        href={`/admin/categorias/${c.id}`}
                        aria-label={`Editar ${c.nome}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    {c._count.produtos > 0 ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled
                        title="Não dá para excluir uma categoria com produtos. Mova ou exclua os produtos antes."
                      >
                        <Trash2 className="size-4 opacity-40" />
                      </Button>
                    ) : (
                      <form action={excluirCategoria}>
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmButton
                          confirmMessage={`Excluir a categoria "${c.nome}"?`}
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Excluir ${c.nome}`}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
