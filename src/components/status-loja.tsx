"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { StatusLoja } from "@/lib/horario";

/**
 * Badge "Aberta/Fechada agora" — bolinha + rótulo, com o detalhe (ex.: "Fecha às
 * 23:00") no title e, opcionalmente, ao lado. Apresentacional: recebe o status
 * já calculado. Usado tanto pelo <StatusLojaLive> (header) quanto direto na /loja.
 */
export function StatusLojaBadge({
  status,
  comDetalhe = false,
  className,
}: {
  status: StatusLoja;
  comDetalhe?: boolean;
  className?: string;
}) {
  return (
    <span
      title={status.detalhe}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        status.aberta ? "text-emerald-400" : "text-muted-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          status.aberta ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/60"
        )}
      />
      {status.rotulo}
      {comDetalhe && (
        <span className="font-normal text-muted-foreground">· {status.detalhe}</span>
      )}
    </span>
  );
}

/**
 * Versão "ao vivo" para o header: como as páginas da loja são estáticas (SSG) e o
 * status depende da hora atual, ele é buscado no cliente em /api/loja/status e
 * revalidado a cada minuto — assim a virada aberta↔fechada aparece sem redeploy.
 */
export function StatusLojaLive({ comDetalhe = false }: { comDetalhe?: boolean }) {
  const [status, setStatus] = useState<StatusLoja | null>(null);

  useEffect(() => {
    let ativo = true;
    const buscar = async () => {
      try {
        const res = await fetch("/api/loja/status", { cache: "no-store" });
        if (!res.ok) return;
        const dados = (await res.json()) as StatusLoja;
        if (ativo) setStatus(dados);
      } catch {
        // silencioso: se falhar, o badge fica no placeholder neutro
      }
    };
    buscar();
    const id = setInterval(buscar, 60_000); // 1 min
    return () => {
      ativo = false;
      clearInterval(id);
    };
  }, []);

  // Placeholder neutro enquanto carrega (evita flash de "Fechada" no SSR).
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span aria-hidden className="size-2 rounded-full bg-muted-foreground/40" />
        Loja
      </span>
    );
  }

  return <StatusLojaBadge status={status} comDetalhe={comDetalhe} />;
}
