import "dotenv/config";
import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Padroniza as fotos CURADAS dos produtos (fundo branco, alta qualidade) e as
 * sobe pro Supabase Storage, gravando a `imagemUrl`.
 *
 * Fluxo: você coloca as fotos em `imagens-fonte/` com o nome do arquivo IGUAL
 * ao slug do produto — ex.: `vinho-pergola-suave-1l.jpg`. Cada foto é aparada
 * (tira a borda branca em volta), redimensionada e centralizada num canvas
 * quadrado BRANCO com folga uniforme → webp. Assim todas ficam no mesmo padrão
 * de catálogo, combinando com o tile branco do card.
 *
 *   npm run db:imagens:padronizar -- --dry      (grava em public/produtos p/ pré-visualizar)
 *   npm run db:imagens:padronizar               (sobe no Supabase + grava a imagemUrl)
 *   npm run db:imagens:padronizar -- --limpar   (zera a imagemUrl de TODOS os produtos)
 *
 * Diferente de `produtos-imagens.ts` (Fase 1, fluxo antigo), aqui NÃO se remove
 * o fundo: as fotos já vêm com fundo branco, então só padronizamos o enquadramento.
 */

const CANVAS = 800; // lado do canvas quadrado final
const INNER = 640; // tamanho máximo do produto dentro do canvas (= folga uniforme)
const BUCKET = "produtos";
const WHITE = { r: 255, g: 255, b: 255 };
const SRC_DIR = path.join(process.cwd(), "imagens-fonte");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const LIMPAR = args.includes("--limpar");

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  }),
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase =
  !DRY && SUPABASE_URL && SERVICE_KEY
    ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
    : null;

/** Apara a borda branca, ajusta ao tamanho interno e centraliza num quadrado branco. */
async function padronizar(origem: Buffer): Promise<Buffer> {
  const recorte = await sharp(origem)
    .flatten({ background: WHITE }) // achata eventual transparência sobre branco
    .trim({ background: "#ffffff", threshold: 15 }) // remove a moldura branca
    .resize(INNER, INNER, { fit: "inside", withoutEnlargement: false })
    .png() // intermediário sem perda antes do composite
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((CANVAS - recorte.info.width) / 2);
  const top = Math.round((CANVAS - recorte.info.height) / 2);

  return sharp({
    create: { width: CANVAS, height: CANVAS, channels: 3, background: WHITE },
  })
    .composite([{ input: recorte.data, left, top }])
    .webp({ quality: 90 })
    .toBuffer();
}

async function salvar(slug: string, webp: Buffer): Promise<string> {
  if (DRY || !supabase) {
    const dir = path.join(process.cwd(), "public", "produtos");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${slug}.webp`), webp);
    return `/produtos/${slug}.webp`;
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${slug}.webp`, webp, { contentType: "image/webp", upsert: true });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(`${slug}.webp`).data
    .publicUrl;
}

async function main() {
  // --limpar: zera todas as imagens (pra recomeçar com as fotos curadas).
  if (LIMPAR) {
    const { count } = await prisma.produto.updateMany({
      data: { imagemUrl: null },
    });
    console.log(`🧹 imagemUrl zerada em ${count} produto(s).`);
    return;
  }

  if (!DRY && (!SUPABASE_URL || !SERVICE_KEY)) {
    console.error(
      "⚠️  Sem credenciais do Supabase. Rode com --dry, ou preencha " +
        "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env."
    );
    process.exit(1);
  }

  let arquivos: string[];
  try {
    arquivos = (await readdir(SRC_DIR)).filter((f) =>
      EXTS.has(path.extname(f).toLowerCase())
    );
  } catch {
    console.error(
      `⚠️  Pasta não encontrada: ${SRC_DIR}\n` +
        "   Crie a pasta 'imagens-fonte/' e coloque as fotos com o nome = slug do produto."
    );
    process.exit(1);
  }

  if (!supabase && !DRY) {
    console.error("⚠️  Storage não configurado. Rode com --dry para pré-visualizar.");
    process.exit(1);
  }

  if (supabase) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && !/exists/i.test(error.message)) throw error;
  }

  console.log(
    `🖼️  ${arquivos.length} foto(s) em imagens-fonte/${DRY ? " (modo --dry)" : " → Supabase"}...\n`
  );

  let ok = 0;
  const semProduto: string[] = [];

  for (const arquivo of arquivos) {
    const slug = path.basename(arquivo, path.extname(arquivo));
    const produto = await prisma.produto.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!produto) {
      console.log(`  ❓ ${slug} — nenhum produto com esse slug`);
      semProduto.push(slug);
      continue;
    }

    try {
      const origem = await readFile(path.join(SRC_DIR, arquivo));
      const webp = await padronizar(origem);
      const urlFinal = await salvar(slug, webp);
      await prisma.produto.update({
        where: { id: produto.id },
        data: { imagemUrl: urlFinal },
      });
      ok++;
      console.log(`  ✅ ${slug}`);
    } catch (e) {
      console.log(`  ❌ ${slug} — ${(e as Error).message}`);
    }
  }

  console.log(`\n✨ Concluído: ${ok} foto(s) padronizada(s).`);
  if (semProduto.length) {
    console.log(
      `⚠️  Sem produto correspondente (confira o nome do arquivo = slug): ${semProduto.join(", ")}`
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
