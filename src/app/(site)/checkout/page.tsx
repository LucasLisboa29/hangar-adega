import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getConfigLoja } from "@/lib/catalog";
import { PEDIDO_MINIMO_CENTAVOS } from "@/lib/loja";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description: "Revise seu pedido e finalize pelo WhatsApp.",
};

export default async function CheckoutPage() {
  const config = await getConfigLoja();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Continuar comprando
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Finalizar pedido
      </h1>

      <CheckoutForm
        pedidoMinimoCentavos={
          config?.pedidoMinimoCentavos ?? PEDIDO_MINIMO_CENTAVOS
        }
        areaEntrega={config?.areaEntrega ?? null}
      />
    </div>
  );
}
