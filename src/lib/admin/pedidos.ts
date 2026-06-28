import { prisma } from "@/lib/prisma";
import type { StatusPedido } from "@/generated/prisma/enums";

// Rótulos amigáveis e ordem dos status do pedido (enum StatusPedido no schema).
export const STATUS_PEDIDO: Record<StatusPedido, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export async function listarPedidos() {
  return prisma.pedido.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true,
      numero: true,
      clienteNome: true,
      totalCentavos: true,
      formaPagamento: true,
      status: true,
      criadoEm: true,
      _count: { select: { itens: true } },
    },
  });
}

export async function getPedido(numero: number) {
  return prisma.pedido.findUnique({
    where: { numero },
    include: { itens: true },
  });
}
