"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, Wine } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatBRL } from "@/lib/format";
import { PEDIDO_MINIMO_CENTAVOS } from "@/lib/loja";

// Ícone de sacola no header (com badge) que abre o drawer do carrinho.
export function CartDrawer() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const {
    itens,
    quantidadeTotal,
    subtotalCentavos,
    hidratado,
    definirQuantidade,
    remover,
  } = useCart();

  const vazio = itens.length === 0;
  const faltaParaMinimo = PEDIDO_MINIMO_CENTAVOS - subtotalCentavos;
  const atingiuMinimo = subtotalCentavos >= PEDIDO_MINIMO_CENTAVOS;

  function irParaCheckout() {
    setAberto(false);
    router.push("/checkout");
  }

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Carrinho com ${quantidadeTotal} ${
            quantidadeTotal === 1 ? "item" : "itens"
          }`}
        >
          <ShoppingBag className="size-5" />
          {hidratado && quantidadeTotal > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground tabular-nums">
              {quantidadeTotal > 99 ? "99+" : quantidadeTotal}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Seu carrinho
            {quantidadeTotal > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {vazio ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </p>
            <SheetClose asChild>
              <Button variant="outline" size="sm">
                Continuar comprando
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {itens.map((item) => (
                <li key={item.id} className="flex gap-3 px-5 py-4">
                  {/* Miniatura */}
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-accent to-card">
                    {item.imagemUrl ? (
                      <Image
                        src={item.imagemUrl}
                        alt={item.nome}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Wine className="size-6 text-primary/30" strokeWidth={1.25} />
                      </div>
                    )}
                  </div>

                  {/* Dados + controles */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                        {item.nome}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remover(item.id)}
                        aria-label={`Remover ${item.nome}`}
                        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      {/* Stepper de quantidade */}
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            definirQuantidade(item.id, item.quantidade - 1)
                          }
                          aria-label="Diminuir quantidade"
                          className="flex size-7 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            definirQuantidade(item.id, item.quantidade + 1)
                          }
                          aria-label="Aumentar quantidade"
                          className="flex size-7 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <span className="font-heading text-sm font-semibold text-primary tabular-nums">
                        {formatBRL(item.precoCentavos * item.quantidade)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg font-bold text-foreground tabular-nums">
                  {formatBRL(subtotalCentavos)}
                </span>
              </div>

              {!atingiuMinimo && (
                <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
                  Faltam{" "}
                  <span className="font-semibold text-foreground">
                    {formatBRL(faltaParaMinimo)}
                  </span>{" "}
                  para o pedido mínimo de {formatBRL(PEDIDO_MINIMO_CENTAVOS)}.
                </p>
              )}

              <Button
                size="lg"
                className="w-full font-semibold"
                disabled={!atingiuMinimo}
                onClick={irParaCheckout}
              >
                Finalizar pedido
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
