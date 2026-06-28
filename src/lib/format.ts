// Preços são guardados em CENTAVOS (Int) no banco. Aqui formatamos para Real.
export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Centavos → string editável em campo de texto ("1990" → "19,90").
export function centavosParaInput(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

/**
 * Converte um preço digitado em reais ("19,90", "19.90", "R$ 19,90", "1990")
 * para centavos. Retorna null se não for um número válido.
 */
export function parseReaisParaCentavos(valor: string): number | null {
  const limpo = valor
    .trim()
    .replace(/r\$/i, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!limpo) return null;
  const reais = Number(limpo);
  if (!Number.isFinite(reais) || reais < 0) return null;
  return Math.round(reais * 100);
}

/** Gera um slug a partir de um texto (acentos removidos, kebab-case). */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
