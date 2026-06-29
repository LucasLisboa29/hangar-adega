// Cálculo de "loja aberta/fechada agora" a partir da grade semanal de horários
// (ConfigLoja.horarios) combinada com o override manual (ConfigLoja.aberta).
//
// Tudo é calculado no fuso da loja (America/Sao_Paulo): o servidor da Vercel roda
// em UTC, então NÃO dá para usar getDay()/getHours() direto — usamos Intl para
// obter o dia da semana e a hora local corretos.

export const FUSO_LOJA = "America/Sao_Paulo";

/** Horário de um dia: fechado o dia todo, ou aberto de `abre` até `fecha` ("HH:MM"). */
export type DiaHorario = {
  fechado: boolean;
  abre: string; // "HH:MM"
  fecha: string; // "HH:MM" — se <= abre, considera que vira a madrugada do dia seguinte
};

/** Grade semanal com 7 posições: índice 0 = domingo … 6 = sábado. */
export type Horarios = [
  DiaHorario,
  DiaHorario,
  DiaHorario,
  DiaHorario,
  DiaHorario,
  DiaHorario,
  DiaHorario,
];

/** Rótulos dos dias (índice = getDay no fuso da loja). */
export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

/** Horário padrão usado quando ConfigLoja.horarios ainda não foi configurado. */
export const HORARIOS_PADRAO: Horarios = [
  { fechado: false, abre: "09:00", fecha: "22:00" }, // domingo
  { fechado: false, abre: "09:00", fecha: "23:00" }, // segunda
  { fechado: false, abre: "09:00", fecha: "23:00" }, // terça
  { fechado: false, abre: "09:00", fecha: "23:00" }, // quarta
  { fechado: false, abre: "09:00", fecha: "23:00" }, // quinta
  { fechado: false, abre: "09:00", fecha: "23:59" }, // sexta
  { fechado: false, abre: "09:00", fecha: "23:59" }, // sábado
];

const RE_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** "HH:MM" → minutos desde a meia-noite. Retorna null se inválido. */
function paraMinutos(hhmm: string): number | null {
  const m = RE_HORA.exec(hhmm);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** minutos desde a meia-noite → "HH:MM". */
export function minutosParaHora(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${String(h).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/** Normaliza um valor desconhecido (vindo do banco/form) em uma grade válida. */
export function parseHorarios(valor: unknown): Horarios {
  if (!Array.isArray(valor) || valor.length !== 7) return HORARIOS_PADRAO;

  const grade = valor.map((d, i): DiaHorario => {
    const padrao = HORARIOS_PADRAO[i];
    if (!d || typeof d !== "object") return padrao;
    const dia = d as Record<string, unknown>;
    const abre = typeof dia.abre === "string" && RE_HORA.test(dia.abre) ? dia.abre : padrao.abre;
    const fecha = typeof dia.fecha === "string" && RE_HORA.test(dia.fecha) ? dia.fecha : padrao.fecha;
    return { fechado: Boolean(dia.fechado), abre, fecha };
  });

  return grade as Horarios;
}

/** Dia da semana (0=domingo … 6=sábado) no fuso da loja. */
export function diaDaSemanaNaLoja(agora: Date = new Date()): number {
  return agoraNaLoja(agora).dia;
}

/** Dia da semana (0–6) e minutos do dia, no fuso da loja. */
function agoraNaLoja(agora: Date): { dia: number; minutos: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO_LOJA,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const partes = fmt.formatToParts(agora);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";

  const mapaDias: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dia = mapaDias[get("weekday")] ?? 0;
  // "24" pode aparecer à meia-noite em hour12:false; normaliza para 0.
  const hora = Number(get("hour")) % 24;
  const minuto = Number(get("minute"));
  return { dia, minutos: hora * 60 + minuto };
}

/** True se o minuto `agora` está dentro da faixa do dia, tratando virada de meia-noite. */
function dentroDaFaixa(dia: DiaHorario, agora: number): boolean {
  if (dia.fechado) return false;
  const abre = paraMinutos(dia.abre);
  const fecha = paraMinutos(dia.fecha);
  if (abre === null || fecha === null) return false;
  if (fecha > abre) return agora >= abre && agora < fecha; // mesmo dia
  // fecha <= abre → vira a madrugada: aberto da abertura até 23:59 deste dia.
  // (a parte após a meia-noite é checada como "ontem" no cálculo principal.)
  return agora >= abre;
}

export type StatusLoja = {
  /** Está aberta para pedidos AGORA (horário ∧ override manual). */
  aberta: boolean;
  /** Rótulo curto para o badge. */
  rotulo: "Aberta" | "Fechada";
  /** Detalhe contextual: "Fecha às 23:00" / "Abre Segunda às 09:00". */
  detalhe: string;
};

/**
 * Calcula o status atual da loja a partir da config e do horário do fuso.
 * `aberta` (override manual) desligado força "Fechada" independentemente da grade.
 */
export function calcularStatusLoja(
  config: { aberta?: boolean | null; horarios?: unknown } | null,
  agora: Date = new Date()
): StatusLoja {
  const horarios = parseHorarios(config?.horarios);
  const overrideManualLigado = config?.aberta ?? true;
  const { dia, minutos } = agoraNaLoja(agora);

  // Aberta hoje, OU aberta de madrugada por causa do horário de ONTEM (virada).
  const hoje = horarios[dia];
  const ontem = horarios[(dia + 6) % 7];
  const fechaOntem = paraMinutos(ontem.fecha);
  const abreOntem = paraMinutos(ontem.abre);
  const madrugadaDeOntem =
    !ontem.fechado &&
    fechaOntem !== null &&
    abreOntem !== null &&
    fechaOntem <= abreOntem &&
    minutos < fechaOntem;

  const dentroDoHorario = dentroDaFaixa(hoje, minutos) || madrugadaDeOntem;
  const aberta = overrideManualLigado && dentroDoHorario;

  if (aberta) {
    const fechaHoje = paraMinutos(hoje.fecha);
    const detalhe = madrugadaDeOntem
      ? `Fecha às ${ontem.fecha}`
      : fechaHoje !== null
        ? `Fecha às ${hoje.fecha}`
        : "Aberta agora";
    return { aberta: true, rotulo: "Aberta", detalhe };
  }

  // Fechada: procura a próxima abertura (hoje mais tarde ou nos próximos dias).
  const proxima = proximaAbertura(horarios, dia, minutos);
  const detalhe = proxima
    ? proxima.diasAFrente === 0
      ? `Abre hoje às ${proxima.abre}`
      : `Abre ${DIAS_SEMANA[proxima.diaSemana]} às ${proxima.abre}`
    : "Sem horário definido";

  return { aberta: false, rotulo: "Fechada", detalhe };
}

/** Próxima abertura a partir de (dia, minutos), olhando até 7 dias à frente. */
function proximaAbertura(
  horarios: Horarios,
  dia: number,
  minutos: number
): { diaSemana: number; diasAFrente: number; abre: string } | null {
  for (let i = 0; i < 8; i++) {
    const idx = (dia + i) % 7;
    const d = horarios[idx];
    if (d.fechado) continue;
    const abre = paraMinutos(d.abre);
    if (abre === null) continue;
    // No dia de hoje (i=0), só conta se a abertura ainda não passou.
    if (i === 0 && minutos >= abre) continue;
    return { diaSemana: idx, diasAFrente: i, abre: d.abre };
  }
  return null;
}
