import type { Metadata } from "next";
import { Clock, MapPin, Phone, ShoppingBag, Truck } from "lucide-react";

import { getConfigLoja } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

export const metadata: Metadata = {
  title: "A loja",
  description:
    "Endereço, telefone, área de entrega e pedido mínimo da Hangar Bebidas em Araguari-MG.",
};

export default async function LojaPage() {
  const config = await getConfigLoja();

  const itens = [
    {
      icon: MapPin,
      titulo: "Endereço",
      valor: config?.endereco ?? "Avenida Minas Gerais, 2625 — Araguari-MG",
    },
    {
      icon: Phone,
      titulo: "Telefone",
      valor: config?.telefone ?? "(34) 3512-1759",
    },
    {
      icon: Truck,
      titulo: "Área de entrega",
      valor: config?.areaEntrega ?? "Uberlândia e Araguari",
    },
    {
      icon: ShoppingBag,
      titulo: "Pedido mínimo",
      valor: formatBRL(config?.pedidoMinimoCentavos ?? 2500),
    },
    {
      icon: Clock,
      titulo: "Funcionamento",
      valor: config?.aberta ? "Loja aberta para pedidos" : "Fechada no momento",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Desde 2009
      </span>
      <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-tight text-primary">
        A loja
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Adega e conveniência em ponto afastado — por isso o nosso forte é a
        venda online com entrega rápida.
      </p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        {itens.map(({ icon: Icon, titulo, valor }) => (
          <div
            key={titulo}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {titulo}
              </dt>
              <dd className="text-sm font-medium text-foreground">{valor}</dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-8 rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
        Venda de bebidas alcoólicas e tabaco proibida para menores de 18 anos. A
        confirmação de maioridade é solicitada na finalização do pedido.
      </p>
    </div>
  );
}
