"use client";

import { Check, Plus } from "lucide-react";

import { useCart, type CartProduto } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

// Botão "+" flutuante sobre a imagem do card. O card inteiro é um <Link>, então
// previnimos a navegação ao clicar aqui (preventDefault + stopPropagation).
export function QuickAddButton({ produto }: { produto: CartProduto }) {
  const { itens, hidratado, adicionar } = useCart();
  const noCarrinho = hidratado && itens.some((i) => i.id === produto.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        adicionar(produto);
      }}
      aria-label={noCarrinho ? `${produto.nome} no carrinho` : `Adicionar ${produto.nome} ao carrinho`}
      className={cn(
        "absolute bottom-2 right-2 z-10 flex size-9 items-center justify-center rounded-full shadow-md transition-all",
        "focus-visible:ring-3 focus-visible:ring-ring/50 outline-none active:translate-y-px",
        noCarrinho
          ? "bg-primary/90 text-primary-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105"
      )}
    >
      {noCarrinho ? <Check className="size-4" /> : <Plus className="size-5" />}
    </button>
  );
}
