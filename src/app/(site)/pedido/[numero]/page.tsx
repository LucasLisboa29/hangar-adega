import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getConfigLoja, getPedidoPorNumero } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";
import { WHATSAPP_PLACEHOLDER } from "@/lib/loja";
import {
  linkWhatsApp,
  montarMensagemPedido,
  normalizarParaWaMe,
  type FormaPagamento,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pedido recebido",
  robots: { index: false },
};

export default async function PedidoConfirmadoPage({
  params,
}: PageProps<"/pedido/[numero]">) {
  const { numero } = await params;
  const n = Number.parseInt(numero, 10);
  if (Number.isNaN(n)) notFound();

  const [pedido, config] = await Promise.all([
    getPedidoPorNumero(n),
    getConfigLoja(),
  ]);
  if (!pedido) notFound();

  // Reconstrói o link do WhatsApp a partir do pedido salvo (assim a página de
  // confirmação funciona mesmo se o popup tiver sido bloqueado no checkout).
  const forma = (pedido.formaPagamento as FormaPagamento) ?? "dinheiro";
  const numeroWa = normalizarParaWaMe(config?.whatsapp || WHATSAPP_PLACEHOLDER);
  const texto = montarMensagemPedido({
    numero: pedido.numero,
    lojaNome: config?.nome ?? "Hangar Bebidas",
    itens: pedido.itens.map((i) => ({
      nome: i.nomeProduto,
      quantidade: i.quantidade,
      precoCentavos: i.precoCentavos,
    })),
    totalCentavos: pedido.totalCentavos,
    clienteNome: pedido.clienteNome,
    clienteTelefone: pedido.clienteTelefone,
    enderecoEntrega: pedido.enderecoEntrega,
    formaPagamento: forma,
    trocoParaCentavos: pedido.trocoParaCentavos,
    observacoes: pedido.observacoes,
  });
  const whatsappUrl = linkWhatsApp(numeroWa, texto);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-14 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Pedido #{pedido.numero} recebido!
        </h1>
        <p className="text-sm text-muted-foreground">
          Falta só <span className="font-medium text-foreground">enviar pelo WhatsApp</span> para
          a loja confirmar. Se a janela não abriu sozinha, use o botão abaixo.
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
        <ul className="space-y-2 text-sm">
          {pedido.itens.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="min-w-0 text-muted-foreground">
                <span className="font-medium text-foreground">
                  {i.quantidade}x
                </span>{" "}
                {i.nomeProduto}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatBRL(i.precoCentavos * i.quantidade)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-heading text-xl font-bold text-primary tabular-nums">
            {formatBRL(pedido.totalCentavos)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button asChild size="lg" className="w-full font-semibold">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            Enviar pedido pelo WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Voltar para a loja</Link>
        </Button>
      </div>
    </div>
  );
}
