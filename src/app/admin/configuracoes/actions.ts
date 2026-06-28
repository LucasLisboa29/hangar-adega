"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/auth/dal";
import { parseReaisParaCentavos } from "@/lib/format";

export type ConfigState = { erro?: string; ok?: boolean };

export async function salvarConfig(
  _state: ConfigState,
  formData: FormData
): Promise<ConfigState> {
  await verificarSessao();

  const nome = String(formData.get("nome") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const telefone = String(formData.get("telefone") ?? "").trim() || null;
  const endereco = String(formData.get("endereco") ?? "").trim() || null;
  const areaEntrega = String(formData.get("areaEntrega") ?? "").trim() || null;
  const aberta = formData.get("aberta") === "on";
  const minimoCentavos = parseReaisParaCentavos(
    String(formData.get("pedidoMinimo") ?? "")
  );

  if (!nome) return { erro: "Informe o nome da loja." };
  if (minimoCentavos === null) {
    return { erro: "Pedido mínimo inválido. Use o formato 25,00." };
  }

  const dados = {
    nome,
    whatsapp,
    telefone,
    endereco,
    areaEntrega,
    aberta,
    pedidoMinimoCentavos: minimoCentavos,
  };

  // ConfigLoja é um singleton (o seed cria 1 registro). Atualiza o existente;
  // se por algum motivo não houver, cria.
  const existente = await prisma.configLoja.findFirst();
  if (existente) {
    await prisma.configLoja.update({ where: { id: existente.id }, data: dados });
  } else {
    await prisma.configLoja.create({ data: dados });
  }

  // A config alimenta a página da loja, o rodapé/checkout (mínimo) e o WhatsApp.
  revalidatePath("/loja");
  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin/configuracoes");

  return { ok: true };
}
