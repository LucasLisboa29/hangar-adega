import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPedido, STATUS_PEDIDO } from "@/lib/admin/pedidos";
import { formatBRL } from "@/lib/format";
import { rotuloPagamento } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { atualizarStatus } from "@/app/admin/pedidos/actions";

export const dynamic = "force-dynamic";

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const pedido = await getPedido(Number(numero));
  if (!pedido) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar aos pedidos
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">
          Pedido #{pedido.numero}
        </h1>
        <p className="text-sm text-muted-foreground">
          {dataHora.format(pedido.criadoEm)}
        </p>
      </div>

      {/* Status */}
      <section className="rounded-xl border border-border bg-card p-4">
        <form action={atualizarStatus} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="numero" value={pedido.numero} />
          <div className="space-y-1.5">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={pedido.status}
              className="flex h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {Object.entries(STATUS_PEDIDO).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Atualizar status
          </Button>
        </form>
      </section>

      {/* Itens */}
      <section className="rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Qtd</th>
              <th className="px-4 py-3 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pedido.itens.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.nomeProduto}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.quantidade}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatBRL(item.precoCentavos * item.quantidade)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-border">
            <tr>
              <td colSpan={2} className="px-4 py-3 font-medium">
                Total
              </td>
              <td className="px-4 py-3 text-right font-heading text-lg font-bold text-primary">
                {formatBRL(pedido.totalCentavos)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Dados de entrega/pagamento */}
      <section className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <Campo titulo="Cliente" valor={pedido.clienteNome} />
        <Campo titulo="Telefone" valor={pedido.clienteTelefone} />
        <Campo titulo="Endereço" valor={pedido.enderecoEntrega} />
        <Campo
          titulo="Pagamento"
          valor={
            rotuloPagamento(pedido.formaPagamento) +
            (pedido.formaPagamento === "dinheiro" && pedido.trocoParaCentavos
              ? ` — troco para ${formatBRL(pedido.trocoParaCentavos)}`
              : "")
          }
        />
        {pedido.observacoes && (
          <Campo titulo="Observações" valor={pedido.observacoes} />
        )}
      </section>
    </div>
  );
}

function Campo({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {titulo}
      </p>
      <p className="mt-0.5 text-sm">{valor}</p>
    </div>
  );
}
