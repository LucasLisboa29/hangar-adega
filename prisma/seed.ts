import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// O seed conecta direto (DIRECT_URL) como as migrations.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

type ProdutoSeed = {
  nome: string;
  slug: string;
  precoCentavos: number;
  descricao?: string;
  destaque?: boolean;
  esgotado?: boolean;
};

type CategoriaSeed = {
  nome: string;
  slug: string;
  ordem: number;
  produtos: ProdutoSeed[];
};

// Subconjunto real e plausível do catálogo de uma adega de Araguari/Uberlândia.
// Preços em CENTAVOS. Serve para a vitrine parecer convincente na demo.
const CATEGORIAS: CategoriaSeed[] = [
  {
    nome: "Cervejas",
    slug: "cervejas",
    ordem: 1,
    produtos: [
      { nome: "Heineken Long Neck 330ml", slug: "heineken-long-neck-330ml", precoCentavos: 690, destaque: true, descricao: "Cerveja puro malte holandesa, leve e refrescante. Garrafa long neck 330ml." },
      { nome: "Skol Lata 350ml", slug: "skol-lata-350ml", precoCentavos: 390, destaque: true, descricao: "A cerveja que desce redondo. Lata 350ml gelada." },
      { nome: "Brahma Duplo Malte Lata 350ml", slug: "brahma-duplo-malte-350ml", precoCentavos: 450, descricao: "Pilsen encorpada de duplo malte. Lata 350ml." },
      { nome: "Cerveja Original 600ml", slug: "cerveja-original-600ml", precoCentavos: 990, descricao: "Pilsen puro malte em garrafa de 600ml." },
      { nome: "Corona Extra 330ml", slug: "corona-extra-330ml", precoCentavos: 790, descricao: "Lager mexicana suave. Garrafa 330ml — peça com limão." },
      { nome: "Stella Artois Lata 350ml", slug: "stella-artois-lata-350ml", precoCentavos: 520, descricao: "Lager belga premium. Lata 350ml." },
    ],
  },
  {
    nome: "Vinhos",
    slug: "vinhos",
    ordem: 2,
    produtos: [
      { nome: "Vinho Tinto Pérgola Suave 1L", slug: "vinho-pergola-suave-1l", precoCentavos: 2490, descricao: "Vinho de mesa tinto suave, frutado e fácil de beber. 1 litro." },
      { nome: "Vinho Quinta do Morgado Suave 1L", slug: "vinho-quinta-do-morgado-1l", precoCentavos: 1990, descricao: "Tinto suave brasileiro, leve e adocicado. 1 litro." },
      { nome: "Espumante Salton Brut 750ml", slug: "espumante-salton-brut-750ml", precoCentavos: 4590, destaque: true, descricao: "Espumante brasileiro brut, perlage fina. 750ml para comemorar." },
    ],
  },
  {
    nome: "Destilados",
    slug: "destilados",
    ordem: 3,
    produtos: [
      { nome: "Whisky Johnnie Walker Red Label 1L", slug: "whisky-red-label-1l", precoCentavos: 8990, destaque: true, descricao: "Blended scotch whisky clássico. Garrafa de 1 litro." },
      { nome: "Vodka Smirnoff 998ml", slug: "vodka-smirnoff-998ml", precoCentavos: 3490, descricao: "Vodka triplo destilada. 998ml." },
      { nome: "Gin Tanqueray London Dry 750ml", slug: "gin-tanqueray-750ml", precoCentavos: 11990, descricao: "Gin London Dry premium para o seu drink. 750ml." },
      { nome: "Cachaça 51 965ml", slug: "cachaca-51-965ml", precoCentavos: 1690, descricao: "Aguardente de cana clássica. 965ml." },
      { nome: "Cachaça Velho Barreiro 910ml", slug: "cachaca-velho-barreiro-910ml", precoCentavos: 1490, descricao: "Cachaça mineira tradicional. 910ml." },
    ],
  },
  {
    nome: "Energéticos",
    slug: "energeticos",
    ordem: 4,
    produtos: [
      { nome: "Red Bull 250ml", slug: "red-bull-250ml", precoCentavos: 990, descricao: "Energético clássico. Lata 250ml." },
      { nome: "Monster Energy 473ml", slug: "monster-energy-473ml", precoCentavos: 1090, descricao: "Energético em lata grande de 473ml." },
      { nome: "Red Bull Tropical 250ml", slug: "red-bull-tropical-250ml", precoCentavos: 990, descricao: "Edição tropical com sabor de frutas. Lata 250ml." },
    ],
  },
  {
    nome: "Refrigerantes",
    slug: "refrigerantes",
    ordem: 5,
    produtos: [
      { nome: "Coca-Cola 2L", slug: "coca-cola-2l", precoCentavos: 1090, descricao: "Refrigerante de cola. Garrafa 2 litros." },
      { nome: "Guaraná Antarctica 2L", slug: "guarana-antarctica-2l", precoCentavos: 890, descricao: "Guaraná brasileiro. Garrafa 2 litros." },
      { nome: "Coca-Cola Lata 350ml", slug: "coca-cola-lata-350ml", precoCentavos: 450, descricao: "Refrigerante de cola gelado. Lata 350ml." },
      { nome: "Sprite Limão 2L", slug: "sprite-limao-2l", precoCentavos: 890, descricao: "Refrigerante de limão. Garrafa 2 litros." },
    ],
  },
  {
    nome: "Sucos",
    slug: "sucos",
    ordem: 6,
    produtos: [
      { nome: "Suco Del Valle Uva 1L", slug: "suco-del-valle-uva-1l", precoCentavos: 890, descricao: "Néctar de uva. Caixa 1 litro." },
      { nome: "Suco Natural One Laranja 900ml", slug: "suco-natural-one-laranja-900ml", precoCentavos: 1490, descricao: "Suco integral de laranja, sem açúcar. 900ml." },
    ],
  },
  {
    nome: "Isotônicos",
    slug: "isotonicos",
    ordem: 7,
    produtos: [
      { nome: "Gatorade Maracujá 500ml", slug: "gatorade-maracuja-500ml", precoCentavos: 690, descricao: "Repositor hidroeletrolítico sabor maracujá. 500ml." },
      { nome: "Powerade Mountain Blast 500ml", slug: "powerade-mountain-blast-500ml", precoCentavos: 650, descricao: "Isotônico sabor frutas. 500ml." },
    ],
  },
  {
    nome: "Águas",
    slug: "aguas",
    ordem: 8,
    produtos: [
      { nome: "Água Mineral Crystal 1,5L", slug: "agua-crystal-15l", precoCentavos: 350, descricao: "Água mineral sem gás. Garrafa 1,5 litro." },
      { nome: "Água com Gás Crystal 500ml", slug: "agua-com-gas-crystal-500ml", precoCentavos: 290, descricao: "Água mineral gaseificada. 500ml." },
    ],
  },
  {
    nome: "Tabacaria",
    slug: "tabacaria",
    ordem: 9,
    produtos: [
      { nome: "Cigarro Marlboro Box", slug: "cigarro-marlboro-box", precoCentavos: 1290, descricao: "Maço com 20 unidades. Venda proibida para menores de 18 anos." },
      { nome: "Cigarro Lucky Strike", slug: "cigarro-lucky-strike", precoCentavos: 1190, descricao: "Maço com 20 unidades. Venda proibida para menores de 18 anos." },
      { nome: "Palheiro Lambe-Lambe", slug: "palheiro-lambe-lambe", precoCentavos: 800, esgotado: true, descricao: "Cigarro de palha artesanal. Venda proibida para menores de 18 anos." },
    ],
  },
  {
    nome: "Conveniência",
    slug: "conveniencia",
    ordem: 10,
    produtos: [
      { nome: "Gelo em Cubos 2kg", slug: "gelo-em-cubos-2kg", precoCentavos: 1200, descricao: "Pacote de gelo em cubos. 2kg." },
      { nome: "Carvão Vegetal 3kg", slug: "carvao-vegetal-3kg", precoCentavos: 1990, descricao: "Carvão para churrasco. Saco de 3kg." },
      { nome: "Amendoim Japonês 150g", slug: "amendoim-japones-150g", precoCentavos: 790, descricao: "Petisco crocante para acompanhar a cerveja. 150g." },
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
      const dados = {
        nome: prod.nome,
        precoCentavos: prod.precoCentavos,
        descricao: prod.descricao ?? null,
        destaque: prod.destaque ?? false,
        esgotado: prod.esgotado ?? false,
        categoriaId: categoria.id,
      };
      await prisma.produto.upsert({
        where: { slug: prod.slug },
        update: dados,
        create: { slug: prod.slug, ...dados },
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
