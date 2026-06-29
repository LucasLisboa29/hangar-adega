import { NextResponse } from "next/server";

import { getConfigLoja } from "@/lib/catalog";
import { calcularStatusLoja } from "@/lib/horario";

// Endpoint leve consumido pelo badge "aberta/fechada" do header. Depende da hora
// atual, então nunca é cacheado (as páginas da loja seguem estáticas; só este
// endpoint é dinâmico).
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfigLoja();
  const status = calcularStatusLoja(config);
  return NextResponse.json(status);
}
