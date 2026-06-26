import { formatBRL } from "@/lib/format";

// Monta a mensagem estruturada do pedido e o link wa.me. O pedido é "fechado"
// pelo WhatsApp (sem gateway no MVP): o cliente cai numa conversa com a mensagem
// já preenchida e envia para a loja.

export type FormaPagamento = "dinheiro" | "cartao" | "pix";

const ROTULO_PAGAMENTO: Record<FormaPagamento, string> = {
  dinheiro: "Dinheiro",
  cartao: "Cartão (na entrega)",
  pix: "Pix (na entrega)",
};

export type ItemMensagem = {
  nome: string;
  quantidade: number;
  precoCentavos: number;
};

export type DadosMensagem = {
  numero: number;
  lojaNome: string;
  itens: ItemMensagem[];
  totalCentavos: number;
  clienteNome: string;
  clienteTelefone: string;
  enderecoEntrega: string;
  formaPagamento: FormaPagamento;
  trocoParaCentavos?: number | null;
  observacoes?: string | null;
};

/** Deixa o telefone no formato que o wa.me espera: só dígitos, com DDI 55. */
export function normalizarParaWaMe(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "");
  // Já tem DDI (55 + DDD + número = 12 ou 13 dígitos): usa como está.
  if (digitos.startsWith("55") && digitos.length >= 12) return digitos;
  // Número nacional (10 ou 11 dígitos): prefixa o 55.
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`;
  return digitos;
}

/** Monta o texto do pedido (markdown leve que o WhatsApp entende). */
export function montarMensagemPedido(d: DadosMensagem): string {
  const linhas: string[] = [];

  linhas.push(`*Pedido #${d.numero} — ${d.lojaNome}*`);
  linhas.push("");
  linhas.push("🛒 *Itens*");
  for (const item of d.itens) {
    linhas.push(
      `${item.quantidade}x ${item.nome} — ${formatBRL(
        item.precoCentavos * item.quantidade
      )}`
    );
  }
  linhas.push("");
  linhas.push(`*Total: ${formatBRL(d.totalCentavos)}*`);
  linhas.push("");

  linhas.push("👤 *Cliente*");
  linhas.push(d.clienteNome);
  linhas.push(d.clienteTelefone);
  linhas.push("");

  linhas.push("📍 *Entrega*");
  linhas.push(d.enderecoEntrega);
  linhas.push("");

  linhas.push("💳 *Pagamento*");
  let pagamento = ROTULO_PAGAMENTO[d.formaPagamento];
  if (d.formaPagamento === "dinheiro" && d.trocoParaCentavos) {
    pagamento += ` — troco para ${formatBRL(d.trocoParaCentavos)}`;
  }
  linhas.push(pagamento);

  if (d.observacoes?.trim()) {
    linhas.push("");
    linhas.push("📝 *Observações*");
    linhas.push(d.observacoes.trim());
  }

  return linhas.join("\n");
}

/** URL do wa.me com a mensagem já codificada. */
export function linkWhatsApp(numeroWa: string, texto: string): string {
  return `https://wa.me/${numeroWa}?text=${encodeURIComponent(texto)}`;
}
