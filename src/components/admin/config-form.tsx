"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salvarConfig, type ConfigState } from "@/app/admin/configuracoes/actions";
import { centavosParaInput } from "@/lib/format";
import { DIAS_SEMANA, type Horarios } from "@/lib/horario";

type Config = {
  nome: string;
  whatsapp: string | null;
  telefone: string | null;
  endereco: string | null;
  areaEntrega: string | null;
  pedidoMinimoCentavos: number;
  aberta: boolean;
  horarios: Horarios;
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

      <fieldset className="space-y-2 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-medium">Horário de funcionamento</legend>
        <p className="text-xs text-muted-foreground">
          Define quando o site mostra a loja como <strong>Aberta</strong> ou{" "}
          <strong>Fechada</strong> (fuso de Brasília). Marque o dia como fechado, ou
          informe abertura e fechamento. Para virar a madrugada, use um fechamento
          menor que a abertura (ex.: abre 18:00, fecha 02:00).
        </p>
        <div className="space-y-2">
          {config.horarios.map((dia, i) => (
            <div key={DIAS_SEMANA[i]} className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-sm text-muted-foreground">
                {DIAS_SEMANA[i]}
              </span>
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  name={`dia-${i}-fechado`}
                  defaultChecked={dia.fechado}
                  className="size-4 accent-primary"
                />
                Fechado
              </label>
              <Input
                type="time"
                name={`dia-${i}-abre`}
                defaultValue={dia.abre}
                aria-label={`${DIAS_SEMANA[i]} — abre`}
                className="w-32"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="time"
                name={`dia-${i}-fecha`}
                defaultValue={dia.fecha}
                aria-label={`${DIAS_SEMANA[i]} — fecha`}
                className="w-32"
              />
            </div>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="aberta"
          defaultChecked={config.aberta}
          className="size-4 accent-primary"
        />
        Loja operando (desmarque para forçar “Fechada”, ex.: feriado)
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
