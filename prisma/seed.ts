import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// O seed conecta direto (DIRECT_URL) como as migrations.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Subconjunto pequeno e real do catálogo da Hangar, só para validar o banco.
const CATEGORIAS = [
  {
    nome: "Energéticos",
    slug: "energeticos",
    ordem: 1,
    produtos: [
      { nome: "Red Bull 250ml", slug: "red-bull-250ml", precoCentavos: 990 },
      { nome: "Monster Energy 473ml", slug: "monster-energy-473ml", precoCentavos: 1090 },
    ],
  },
  {
    nome: "Refrigerantes",
    slug: "refrigerantes",
    ordem: 2,
    produtos: [
      { nome: "Coca-Cola 2L", slug: "coca-cola-2l", precoCentavos: 1090 },
      { nome: "Guaraná Antarctica 2L", slug: "guarana-antarctica-2l", precoCentavos: 890 },
    ],
  },
  {
    nome: "Cervejas",
    slug: "cervejas",
    ordem: 3,
    produtos: [
      { nome: "Heineken Long Neck 330ml", slug: "heineken-long-neck-330ml", precoCentavos: 690 },
      { nome: "Skol Lata 350ml", slug: "skol-lata-350ml", precoCentavos: 390, destaque: true },
    ],
  },
  {
    nome: "Vinhos",
    slug: "vinhos",
    ordem: 4,
    produtos: [
      { nome: "Vinho Tinto Pérgola Suave 1L", slug: "vinho-pergola-suave-1l", precoCentavos: 2490 },
    ],
  },
];

async function main() {
  console.log("🌱 Semeando banco da Hangar Bebidas...");

  for (const cat of CATEGORIAS) {
    const categoria = await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: { nome: cat.nome, ordem: cat.ordem },
      create: { nome: cat.nome, slug: cat.slug, ordem: cat.ordem },
    });

    for (const prod of cat.produtos) {
      await prisma.produto.upsert({
        where: { slug: prod.slug },
        update: {
          nome: prod.nome,
          precoCentavos: prod.precoCentavos,
          destaque: "destaque" in prod ? prod.destaque : false,
          categoriaId: categoria.id,
        },
        create: {
          nome: prod.nome,
          slug: prod.slug,
          precoCentavos: prod.precoCentavos,
          destaque: "destaque" in prod ? prod.destaque : false,
          categoriaId: categoria.id,
        },
      });
    }
  }

  // Configuração da loja (singleton de fato: 1 registro fixo).
  await prisma.configLoja.upsert({
    where: { id: "loja" },
    update: {},
    create: {
      id: "loja",
      nome: "Hangar Bebidas",
      telefone: "(34) 3512-1759",
      endereco: "Avenida Minas Gerais, 2625 — Araguari-MG",
      pedidoMinimoCentavos: 2500,
      areaEntrega: "Uberlândia e Araguari",
    },
  });

  const totalProdutos = await prisma.produto.count();
  const totalCategorias = await prisma.categoria.count();
  console.log(`✅ Seed concluído: ${totalCategorias} categorias, ${totalProdutos} produtos.`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
