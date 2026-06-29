import { prisma } from "@/lib/prisma";

// Camada de acesso ao catálogo. Tudo roda em Server Components (Next 16),
// então as queries Prisma ficam no servidor e nunca vazam pro bundle do cliente.

/** Categorias ativas, em ordem, cada uma com seus produtos ativos. */
export async function getCategoriasComProdutos() {
  return prisma.categoria.findMany({
    where: { ativa: true },
    orderBy: { ordem: "asc" },
    include: {
      produtos: {
        where: { ativo: true },
        orderBy: [{ esgotado: "asc" }, { nome: "asc" }],
      },
    },
  });
}

/** Produtos em destaque (ativos, não esgotados) para a vitrine da home. */
export async function getProdutosDestaque(limite = 8) {
  return prisma.produto.findMany({
    where: { ativo: true, esgotado: false, destaque: true },
    orderBy: { nome: "asc" },
    take: limite,
    include: { categoria: { select: { nome: true, slug: true } } },
  });
}

/** Só as categorias ativas (para a navegação/filtro). */
export async function getCategorias() {
  return prisma.categoria.findMany({
    where: { ativa: true },
    orderBy: { ordem: "asc" },
    select: { id: true, nome: true, slug: true },
  });
}

/**
 * Produtos filtrados por busca textual e/ou categoria.
 * Usado quando há `?q=` ou `?categoria=` na home (lista achatada).
 */
export async function buscarProdutos(params: {
  q?: string;
  categoriaSlug?: string;
}) {
  const { q, categoriaSlug } = params;
  return prisma.produto.findMany({
    where: {
      ativo: true,
      ...(categoriaSlug ? { categoria: { slug: categoriaSlug } } : {}),
      ...(q
        ? { nome: { contains: q, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ esgotado: "asc" }, { nome: "asc" }],
    include: { categoria: { select: { nome: true, slug: true } } },
  });
}

/** Um produto pelo slug, com a categoria (para a página de produto). */
export async function getProdutoPorSlug(slug: string) {
  return prisma.produto.findUnique({
    where: { slug },
    include: { categoria: { select: { nome: true, slug: true } } },
  });
}

/** Slugs de todos os produtos ativos (para gerar as páginas estáticas). */
export async function getSlugsDeProdutos() {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    select: { slug: true },
  });
  return produtos.map((p) => p.slug);
}

/** Configuração singleton da loja (endereço, telefone, mínimo, etc.). */
export async function getConfigLoja() {
  return prisma.configLoja.findFirst();
}

/** Um pedido pelo número (para a tela de confirmação), com seus itens. */
export async function getPedidoPorNumero(numero: number) {
  return prisma.pedido.findUnique({
    where: { numero },
    include: { itens: true },
  });
}
