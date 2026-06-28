import { prisma } from "@/lib/prisma";

// Queries do admin para produtos. Diferente de src/lib/catalog.ts (que filtra
// `ativo: true` para a vitrine), aqui listamos TUDO — inclusive inativos/esgotados.

export async function listarProdutosAdmin() {
  return prisma.produto.findMany({
    orderBy: [{ categoria: { ordem: "asc" } }, { nome: "asc" }],
    include: { categoria: { select: { nome: true } } },
  });
}

export async function getProdutoAdmin(id: string) {
  return prisma.produto.findUnique({
    where: { id },
    include: { categoria: { select: { nome: true } } },
  });
}

export async function listarCategorias() {
  return prisma.categoria.findMany({
    orderBy: { ordem: "asc" },
    select: { id: true, nome: true },
  });
}
