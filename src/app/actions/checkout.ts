"use server";

import { prisma } from "@/lib/prisma";
import { PEDIDO_MINIMO_CENTAVOS, WHATSAPP_PLACEHOLDER } from "@/lib/loja";
import {
  linkWhatsApp,
  montarMensagemPedido,
  normalizarParaWaMe,
  type FormaPagamento,
} from "@/lib/whatsapp";

// Finaliza o pedido. Server Action é alcançável por POST direto (não só pela UI),
// então TUDO é revalidado aqui: preços vêm do banco, total é recalculado, o
// mínimo e a maioridade são checados no servidor. O cliente nunca define valores.

export type ItemCheckout = { id: string; quantidade: number };

export type CheckoutInput = {
  itens: ItemCheckout[];
  clienteNome: string;
  clienteTelefone: string;
  enderecoEntrega: string;
  formaPagamento: FormaPagamento;
  trocoParaCentavos?: number | null;
  observacoes?: string | null;
  maiorDeIdade: boolean;
};

export type CheckoutResult =
  | { ok: true; numero: number; whatsappUrl: string }
  | { ok: false; erro: string };

const FORMAS_VALIDAS: FormaPagamento[] = ["dinheiro", "cartao", "pix"];

export async function criarPedido(
  input: CheckoutInput
): Promise<CheckoutResult> {
  // ── Validações básicas ───────────────────────────────────────────────
  if (!input.maiorDeIdade) {
    return { ok: false, erro: "É preciso confirmar que você tem 18 anos ou mais." };
  }

  const nome = input.clienteNome?.trim() ?? "";
  const telefone = input.clienteTelefone?.trim() ?? "";
  const endereco = input.enderecoEntrega?.trim() ?? "";
  if (!nome || !telefone || !endereco) {
    return { ok: false, erro: "Preencha nome, telefone e endereço de entrega." };
  }
  if (!FORMAS_VALIDAS.includes(input.formaPagamento)) {
    return { ok: false, erro: "Forma de pagamento inválida." };
  }
  if (!Array.isArray(input.itens) || input.itens.length === 0) {
    return { ok: false, erro: "Seu carrinho está vazio." };
  }

  // ── Revalida itens contra o banco (preço/nome autoritativos) ─────────
  const ids = [...new Set(input.itens.map((i) => i.id))];
  const produtos = await prisma.produto.findMany({
    where: { id: { in: ids }, ativo: true, esgotado: false },
  });
  const porId = new Map(produtos.map((p) => [p.id, p]));

  const itensPedido = input.itens
    .map((i) => {
      const produto = porId.get(i.id);
      if (!produto) return null;
      const quantidade = Math.min(Math.max(Math.trunc(i.quantidade), 1), 99);
      return {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        precoCentavos: produto.precoCentavos,
        quantidade,
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  if (itensPedido.length === 0) {
    return {
      ok: false,
      erro: "Os itens do carrinho não estão mais disponíveis. Revise e tente de novo.",
    };
  }

  const totalCentavos = itensPedido.reduce(
    (s, i) => s + i.precoCentavos * i.quantidade,
    0
  );

  // ── Config da loja (mínimo, whatsapp, nome) ──────────────────────────
  const config = await prisma.configLoja.findFirst();
  const minimo = config?.pedidoMinimoCentavos ?? PEDIDO_MINIMO_CENTAVOS;
  if (totalCentavos < minimo) {
    return {
      ok: false,
      erro: `O pedido mínimo é de ${(minimo / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}.`,
    };
  }

  // Troco só faz sentido em dinheiro.
  const trocoParaCentavos =
    input.formaPagamento === "dinheiro" && input.trocoParaCentavos
      ? Math.trunc(input.trocoParaCentavos)
      : null;
  const observacoes = input.observacoes?.trim() || null;

  // ── Cria o pedido + itens ────────────────────────────────────────────
  const pedido = await prisma.pedido.create({
    data: {
      clienteNome: nome,
      clienteTelefone: telefone,
      enderecoEntrega: endereco,
      observacoes,
      formaPagamento: input.formaPagamento,
      trocoParaCentavos,
      totalCentavos,
      itens: { create: itensPedido },
    },
  });

  // ── Monta a mensagem e o link do WhatsApp ────────────────────────────
  const numeroWa = normalizarParaWaMe(config?.whatsapp || WHATSAPP_PLACEHOLDER);
  const texto = montarMensagemPedido({
    numero: pedido.numero,
    lojaNome: config?.nome ?? "Hangar Bebidas",
    itens: itensPedido.map((i) => ({
      nome: i.nomeProduto,
      quantidade: i.quantidade,
      precoCentavos: i.precoCentavos,
    })),
    totalCentavos,
    clienteNome: nome,
    clienteTelefone: telefone,
    enderecoEntrega: endereco,
    formaPagamento: input.formaPagamento,
    trocoParaCentavos,
    observacoes,
  });

  return {
    ok: true,
    numero: pedido.numero,
    whatsappUrl: linkWhatsApp(numeroWa, texto),
  };
}
