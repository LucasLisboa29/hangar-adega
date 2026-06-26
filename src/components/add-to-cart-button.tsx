"use client";

import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { useCart, type CartProduto } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

// Botão de adicionar da página de produto. Já no carrinho, vira um stepper de
// quantidade para o cliente ajustar sem sair da página.
export function AddToCartButton({
  produto,
  disabled,
}: {
  produto: CartProduto;
  disabled?: boolean;
}) {
  const { itens, hidratado, adicionar, definirQuantidade } = useCart();
  const noCarrinho = itens.find((i) => i.id === produto.id);

  // Antes de hidratar não sabemos o estado real do carrinho — mostra o botão
  // padrão (evita "flash" de stepper incorreto).
  if (hidratado && noCarrinho) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/5 p-2">
          <div className="flex items-center rounded-lg border border-border bg-background">
            <button
              type="button"
              onClick={() =>
                definirQuantidade(produto.id, noCarrinho.quantidade - 1)
              }
              aria-label="Diminuir quantidade"
              className="flex size-9 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center font-medium tabular-nums">
              {noCarrinho.quantidade}
            </span>
            <button
              type="button"
              onClick={() =>
                definirQuantidade(produto.id, noCarrinho.quantidade + 1)
              }
              aria-label="Aumentar quantidade"
              className="flex size-9 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 pr-1 text-sm font-medium text-primary">
            <Check className="size-4" />
            No carrinho
          </span>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full font-semibold"
      disabled={disabled}
      onClick={() => adicionar(produto)}
    >
      <ShoppingCart />
      Adicionar ao carrinho
    </Button>
  );
}
