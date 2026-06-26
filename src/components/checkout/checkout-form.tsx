"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarPedido } from "@/app/actions/checkout";
import { formatBRL } from "@/lib/format";
import type { FormaPagamento } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const FORMAS: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: "dinheiro", rotulo: "Dinheiro" },
  { valor: "cartao", rotulo: "Cartão" },
  { valor: "pix", rotulo: "Pix" },
];

/** "50,00" / "50" / "R$ 50" → centavos (ou null se vazio/ inválido). */
function reaisParaCentavos(valor: string): number | null {
  const limpo = valor.replace(/[^\d,.-]/g, "").replace(",", ".");
  if (!limpo) return null;
  const n = Number.parseFloat(limpo);
  if (Number.isNaN(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function CheckoutForm({
  pedidoMinimoCentavos,
  areaEntrega,
}: {
  pedidoMinimoCentavos: number;
  areaEntrega: string | null;
}) {
  const router = useRouter();
  const { itens, subtotalCentavos, hidratado, limpar } = useCart();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [forma, setForma] = useState<FormaPagamento>("dinheiro");
  const [troco, setTroco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);

  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const abaixoDoMinimo = subtotalCentavos < pedidoMinimoCentavos;

  // Carrinho vazio (e já hidratado): não dá pra finalizar.
  if (hidratado && itens.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card py-16 text-center">
        <ShoppingBag className="size-12 text-muted-foreground/40" strokeWidth={1.25} />
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        <Button asChild>
          <Link href="/">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  async function aoFinalizar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!maiorDeIdade) {
      setErro("Confirme que você tem 18 anos ou mais para continuar.");
      return;
    }
    if (!nome.trim() || !telefone.trim() || !endereco.trim()) {
      setErro("Preencha nome, telefone e endereço de entrega.");
      return;
    }
    if (abaixoDoMinimo) {
      setErro(`O pedido mínimo é de ${formatBRL(pedidoMinimoCentavos)}.`);
      return;
    }

    setEnviando(true);
    try {
      const resultado = await criarPedido({
        itens: itens.map((i) => ({ id: i.id, quantidade: i.quantidade })),
        clienteNome: nome,
        clienteTelefone: telefone,
        enderecoEntrega: endereco,
        formaPagamento: forma,
        trocoParaCentavos:
          forma === "dinheiro" ? reaisParaCentavos(troco) : null,
        observacoes,
        maiorDeIdade,
      });

      if (!resultado.ok) {
        setErro(resultado.erro);
        setEnviando(false);
        return;
      }

      // Abre o WhatsApp (best-effort) e vai pra confirmação, que também
      // oferece o link caso o navegador bloqueie o popup.
      window.open(resultado.whatsappUrl, "_blank");
      limpar();
      router.push(`/pedido/${resultado.numero}`);
    } catch {
      setErro("Não foi possível enviar o pedido. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoFinalizar} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* ── Campos ─────────────────────────────────────────────── */}
      <div className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="mb-1 font-heading text-lg font-semibold text-foreground">
            Seus dados
          </legend>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Nome completo</span>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como te chamamos na entrega"
              autoComplete="name"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Telefone / WhatsApp</span>
            <Input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(34) 99999-9999"
              type="tel"
              autoComplete="tel"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Endereço de entrega</span>
            <Input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro e complemento"
              autoComplete="street-address"
              required
            />
            {areaEntrega && (
              <span className="text-xs text-muted-foreground">
                Entregamos em {areaEntrega}.
              </span>
            )}
          </label>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-1 font-heading text-lg font-semibold text-foreground">
            Pagamento na entrega
          </legend>

          <div className="grid grid-cols-3 gap-2">
            {FORMAS.map((f) => (
              <button
                key={f.valor}
                type="button"
                onClick={() => setForma(f.valor)}
                aria-pressed={forma === f.valor}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 outline-none",
                  forma === f.valor
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f.rotulo}
              </button>
            ))}
          </div>

          {forma === "dinheiro" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">
                Troco para quanto?{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </span>
              <Input
                value={troco}
                onChange={(e) => setTroco(e.target.value)}
                placeholder="Ex.: 50,00"
                inputMode="decimal"
              />
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="mb-1 font-heading text-lg font-semibold text-foreground">
            Observações
          </legend>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ponto de referência, gelo à parte, etc. (opcional)"
            rows={3}
            className={cn(
              "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          />
        </fieldset>
      </div>

      {/* ── Resumo + finalizar ─────────────────────────────────── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Resumo
          </h2>

          <ul className="space-y-2 text-sm">
            {itens.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {i.quantidade}x
                  </span>{" "}
                  {i.nome}
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
              {formatBRL(subtotalCentavos)}
            </span>
          </div>

          {abaixoDoMinimo && (
            <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
              Pedido mínimo de {formatBRL(pedidoMinimoCentavos)}.
            </p>
          )}

          {/* +18 obrigatório */}
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={maiorDeIdade}
              onChange={(e) => setMaiorDeIdade(e.target.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span className="text-muted-foreground">
              Declaro ter <span className="font-medium text-foreground">18 anos ou mais</span>.
              A venda de bebidas alcoólicas e tabaco é proibida para menores.
            </span>
          </label>

          {erro && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {erro}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold"
            disabled={enviando || abaixoDoMinimo}
          >
            {enviando ? (
              <>
                <Loader2 className="animate-spin" />
                Enviando…
              </>
            ) : (
              "Enviar pedido pelo WhatsApp"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Você vai conferir o pedido no WhatsApp antes de confirmar.
          </p>
        </div>
      </aside>
    </form>
  );
}
