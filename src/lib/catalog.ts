import { prisma } from "@/lib/prisma";
import { precoEfetivoCentavos } from "@/lib/format";

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

/** Produtos em oferta (ativos, não esgotados, com promo válida) para a home. */
export async function getProdutosEmOferta(limite = 8) {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true, esgotado: false, precoPromoCentavos: { not: null } },
    orderBy: { nome: "asc" },
    include: { categoria: { select: { nome: true, slug: true } } },
  });
  // O Prisma não compara duas colunas no `where`; garante promo < preço aqui.
  return produtos
    .filter((p) => p.precoPromoCentavos! < p.precoCentavos)
    .slice(0, limite);
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
  precoMinCentavos?: number;
  precoMaxCentavos?: number;
}) {
  const { q, categoriaSlug, precoMinCentavos, precoMaxCentavos } = params;
  const produtos = await prisma.produto.findMany({
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

  // Faixa de preço aplicada sobre o preço EFETIVO (oferta quando houver) — é o
  // que o cliente paga. Feito em JS porque o Prisma não computa COALESCE no where.
  if (precoMinCentavos == null && precoMaxCentavos == null) return produtos;
  return produtos.filter((p) => {
    const preco = precoEfetivoCentavos(p);
    if (precoMinCentavos != null && preco < precoMinCentavos) return false;
    if (precoMaxCentavos != null && preco > precoMaxCentavos) return false;
    return true;
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
