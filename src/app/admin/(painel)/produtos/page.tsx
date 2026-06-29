import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { listarProdutosAdmin } from "@/lib/admin/produtos";
import { centavosParaInput, formatBRL, emOferta, descontoPercentual } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  alternarAtivo,
  alternarEsgotado,
  atualizarPreco,
  excluirProduto,
} from "@/app/admin/produtos/actions";

export const dynamic = "force-dynamic";

export default async function ProdutosAdminPage() {
  const produtos = await listarProdutosAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {produtos.length} produto(s) no catálogo.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="size-4" />
            Novo produto
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {produtos.map((p) => (
              <tr key={p.id} className="align-middle">
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.categoria.nome}
                </td>
                <td className="px-4 py-3">
                  {/* Edição rápida de preço */}
                  <form action={atualizarPreco} className="flex items-center gap-1.5">
                    <input type="hidden" name="id" value={p.id} />
                    <span className="text-muted-foreground">R$</span>
                    <Input
                      name="preco"
                      defaultValue={centavosParaInput(p.precoCentavos)}
                      inputMode="decimal"
                      className="h-7 w-20"
                      aria-label={`Preço de ${p.nome}`}
                    />
                    <Button type="submit" variant="outline" size="sm">
                      Salvar
                    </Button>
                  </form>
                  {emOferta(p) && (
                    <p className="mt-1 text-xs text-red-500">
                      Oferta: {formatBRL(p.precoPromoCentavos!)} (-
                      {descontoPercentual(p)}%)
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <form action={alternarAtivo}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button
                        type="submit"
                        size="xs"
                        variant={p.ativo ? "secondary" : "outline"}
                      >
                        {p.ativo ? "Ativo" : "Inativo"}
                      </Button>
                    </form>
                    <form action={alternarEsgotado}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button
                        type="submit"
                        size="xs"
                        variant={p.esgotado ? "destructive" : "outline"}
                      >
                        {p.esgotado ? "Esgotado" : "Em estoque"}
                      </Button>
                    </form>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="icon-sm">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        aria-label={`Editar ${p.nome}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={excluirProduto}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton
                        confirmMessage={`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Excluir ${p.nome}`}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </ConfirmButton>
                    </form>
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
