// Preços são guardados em CENTAVOS (Int) no banco. Aqui formatamos para Real.
export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
