"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

// Estado do carrinho — vive no cliente (Context + reducer) e persiste no
// localStorage. O preço guardado aqui é só um snapshot para a UI; o total real
// do pedido é recalculado no servidor na hora de finalizar (ver criarPedido).

export type CartItem = {
  id: string;
  slug: string;
  nome: string;
  precoCentavos: number;
  imagemUrl: string | null;
  quantidade: number;
};

// O que basta para adicionar um produto (a quantidade entra em cima).
export type CartProduto = Omit<CartItem, "quantidade">;

type Acao =
  | { tipo: "hidratar"; itens: CartItem[] }
  | { tipo: "adicionar"; produto: CartProduto; quantidade?: number }
  | { tipo: "definirQuantidade"; id: string; quantidade: number }
  | { tipo: "remover"; id: string }
  | { tipo: "limpar" };

const MAX_POR_ITEM = 99;

function reducer(estado: CartItem[], acao: Acao): CartItem[] {
  switch (acao.tipo) {
    case "hidratar":
      return acao.itens;

    case "adicionar": {
      const qtd = acao.quantidade ?? 1;
      const existente = estado.find((i) => i.id === acao.produto.id);
      if (existente) {
        return estado.map((i) =>
          i.id === acao.produto.id
            ? { ...i, quantidade: Math.min(i.quantidade + qtd, MAX_POR_ITEM) }
            : i
        );
      }
      return [
        ...estado,
        { ...acao.produto, quantidade: Math.min(qtd, MAX_POR_ITEM) },
      ];
    }

    case "definirQuantidade": {
      if (acao.quantidade <= 0) {
        return estado.filter((i) => i.id !== acao.id);
      }
      return estado.map((i) =>
        i.id === acao.id
          ? { ...i, quantidade: Math.min(acao.quantidade, MAX_POR_ITEM) }
          : i
      );
    }

    case "remover":
      return estado.filter((i) => i.id !== acao.id);

    case "limpar":
      return [];

    default:
      return estado;
  }
}

const STORAGE_KEY = "hangar.carrinho.v1";

type CartContextValue = {
  itens: CartItem[];
  quantidadeTotal: number;
  subtotalCentavos: number;
  /** true depois de ler o localStorage — evita "flash" de carrinho vazio. */
  hidratado: boolean;
  adicionar: (produto: CartProduto, quantidade?: number) => void;
  definirQuantidade: (id: string, quantidade: number) => void;
  remover: (id: string) => void;
  limpar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, dispatch] = useReducer(reducer, []);
  const [hidratado, setHidratado] = useState(false);

  // Hidrata do localStorage uma vez, no mount (só no cliente).
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      if (bruto) {
        const salvos = JSON.parse(bruto) as CartItem[];
        if (Array.isArray(salvos)) {
          dispatch({ tipo: "hidratar", itens: salvos });
        }
      }
    } catch {
      // localStorage indisponível / JSON inválido — começa vazio.
    }
    setHidratado(true);
  }, []);

  // Persiste a cada mudança (só depois de hidratar, p/ não sobrescrever com []).
  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {
      // sem espaço / modo privado — ignora.
    }
  }, [itens, hidratado]);

  const valor = useMemo<CartContextValue>(() => {
    const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);
    const subtotalCentavos = itens.reduce(
      (s, i) => s + i.precoCentavos * i.quantidade,
      0
    );
    return {
      itens,
      quantidadeTotal,
      subtotalCentavos,
      hidratado,
      adicionar: (produto, quantidade) =>
        dispatch({ tipo: "adicionar", produto, quantidade }),
      definirQuantidade: (id, quantidade) =>
        dispatch({ tipo: "definirQuantidade", id, quantidade }),
      remover: (id) => dispatch({ tipo: "remover", id }),
      limpar: () => dispatch({ tipo: "limpar" }),
    };
  }, [itens, hidratado]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart precisa estar dentro de <CartProvider>.");
  }
  return ctx;
}
