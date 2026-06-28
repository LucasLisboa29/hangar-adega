"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/auth/dal";
import { StatusPedido } from "@/generated/prisma/enums";

const STATUS_VALIDOS = Object.values(StatusPedido) as string[];

export async function atualizarStatus(formData: FormData): Promise<void> {
  await verificarSessao();

  const numero = Number(formData.get("numero"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(numero) || !STATUS_VALIDOS.includes(status)) return;

  await prisma.pedido.update({
    where: { numero },
    data: { status: status as StatusPedido },
  });

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${numero}`);
}
