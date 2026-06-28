"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salvarConfig, type ConfigState } from "@/app/admin/configuracoes/actions";
import { centavosParaInput } from "@/lib/format";

type Config = {
  nome: string;
  whatsapp: string | null;
  telefone: string | null;
  endereco: string | null;
  areaEntrega: string | null;
  pedidoMinimoCentavos: number;
  aberta: boolean;
};

const estadoInicial: ConfigState = {};

export function ConfigForm({ config }: { config: Config }) {
  const [state, action, pending] = useActionState(salvarConfig, estadoInicial);

  return (
    <form action={action} className="max-w-xl space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome da loja
        </label>
        <Input id="nome" name="nome" defaultValue={config.nome} required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="whatsapp" className="text-sm font-medium">
          WhatsApp (recebe os pedidos)
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          placeholder="(34) 99999-9999"
          defaultValue={config.whatsapp ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          É o número para onde o checkout manda o pedido. Pode ser com ou sem DDI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="telefone" className="text-sm font-medium">
            Telefone fixo
          </label>
          <Input
            id="telefone"
            name="telefone"
            defaultValue={config.telefone ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pedidoMinimo" className="text-sm font-medium">
            Pedido mínimo (R$)
          </label>
          <Input
            id="pedidoMinimo"
            name="pedidoMinimo"
            inputMode="decimal"
            placeholder="25,00"
            defaultValue={centavosParaInput(config.pedidoMinimoCentavos)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="endereco" className="text-sm font-medium">
          Endereço
        </label>
        <Input
          id="endereco"
          name="endereco"
          defaultValue={config.endereco ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="areaEntrega" className="text-sm font-medium">
          Área de entrega
        </label>
        <Input
          id="areaEntrega"
          name="areaEntrega"
          defaultValue={config.areaEntrega ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="aberta"
          defaultChecked={config.aberta}
          className="size-4 accent-primary"
        />
        Loja aberta (aceitando pedidos)
      </label>

      {state?.erro && <p className="text-sm text-destructive">{state.erro}</p>}
      {state?.ok && (
        <p className="text-sm text-primary">Configurações salvas com sucesso.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Salvar configurações"}
      </Button>
    </form>
  );
}
