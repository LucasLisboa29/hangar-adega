import { prisma } from "@/lib/prisma";

// Queries do admin para categorias. Traz a contagem de produtos de cada uma
// (usada para mostrar o tamanho e para bloquear exclusão de categoria não-vazia).

export async function listarCategoriasAdmin() {
  return prisma.categoria.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { produtos: true } } },
  });
}

export async function getCategoriaAdmin(id: string) {
  return prisma.categoria.findUnique({ where: { id } });
}
