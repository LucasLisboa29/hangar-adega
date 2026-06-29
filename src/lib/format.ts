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

// ── Ofertas ──────────────────────────────────────────────────────────────────
// Um produto está "em oferta" quando tem precoPromoCentavos preenchido E menor
// que o preço cheio. Estes helpers concentram essa regra (usada na vitrine, na
// página de produto e na revalidação do checkout) para não repetir a checagem.

type ComPreco = { precoCentavos: number; precoPromoCentavos?: number | null };

/** True se o produto tem uma oferta válida (promo > 0 e menor que o preço cheio). */
export function emOferta(p: ComPreco): boolean {
  return (
    p.precoPromoCentavos != null &&
    p.precoPromoCentavos > 0 &&
    p.precoPromoCentavos < p.precoCentavos
  );
}

/** Preço que vale agora em centavos: o promocional se em oferta, senão o cheio. */
export function precoEfetivoCentavos(p: ComPreco): number {
  return emOferta(p) ? (p.precoPromoCentavos as number) : p.precoCentavos;
}

/** Percentual de desconto arredondado (ex.: 23 para "-23%"); 0 se sem oferta. */
export function descontoPercentual(p: ComPreco): number {
  if (!emOferta(p)) return 0;
  return Math.round((1 - (p.precoPromoCentavos as number) / p.precoCentavos) * 100);
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
