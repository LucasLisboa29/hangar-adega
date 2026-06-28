import Link from "next/link";

import { listarPedidos, STATUS_PEDIDO } from "@/lib/admin/pedidos";
import { formatBRL } from "@/lib/format";
import { rotuloPagamento } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function PedidosAdminPage() {
  const pedidos = await listarPedidos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          {pedidos.length} pedido(s) recebido(s).
        </p>
      </div>

      {pedidos.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Nenhum pedido ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Itens</th>
                <th className="px-4 py-3 font-medium">Pagamento</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pedidos.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/pedidos/${p.numero}`}
                      className="text-primary hover:underline"
                    >
                      #{p.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dataHora.format(p.criadoEm)}
                  </td>
                  <td className="px-4 py-3">{p.clienteNome}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p._count.itens}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {rotuloPagamento(p.formaPagamento)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatBRL(p.totalCentavos)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{STATUS_PEDIDO[p.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
