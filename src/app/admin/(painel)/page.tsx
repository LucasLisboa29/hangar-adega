import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [totalProdutos, produtosEsgotados, totalPedidos, pedidosRecebidos, soma] =
    await Promise.all([
      prisma.produto.count(),
      prisma.produto.count({ where: { esgotado: true } }),
      prisma.pedido.count(),
      prisma.pedido.count({ where: { status: "RECEBIDO" } }),
      prisma.pedido.aggregate({ _sum: { totalCentavos: true } }),
    ]);

  const cards = [
    { label: "Produtos cadastrados", valor: String(totalProdutos), href: "/admin/produtos" },
    { label: "Produtos esgotados", valor: String(produtosEsgotados), href: "/admin/produtos" },
    { label: "Pedidos recebidos", valor: String(pedidosRecebidos), href: "/admin/pedidos" },
    { label: "Total de pedidos", valor: String(totalPedidos), href: "/admin/pedidos" },
    {
      label: "Faturamento (pedidos)",
      valor: formatBRL(soma._sum.totalCentavos ?? 0),
      href: "/admin/pedidos",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Visão geral</h1>
        <p className="text-sm text-muted-foreground">
          Resumo rápido da loja. Use o menu para gerenciar produtos e pedidos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">
              {c.valor}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
