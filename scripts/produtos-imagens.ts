import "dotenv/config";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// IMPORTANTE: NÃO importar @imgly/background-removal-node aqui — o onnx dele
// conflita com o sharp no mesmo processo (Windows). A remoção de fundo roda
// num processo `node` filho (scripts/remove-bg-worker.mjs).
const execFileP = promisify(execFile);
const WORKER = path.join(import.meta.dirname, "remove-bg-worker.mjs");

/**
 * Pipeline de imagens dos produtos (Fase 1).
 *
 * Para cada produto: busca uma foto no Open Food Facts → remove o fundo
 * (PNG transparente) → padroniza num canvas quadrado com a mesma folga →
 * sobe no Supabase Storage e grava a `imagemUrl`.
 *
 *   npm run db:imagens -- --dry            (grava em public/produtos, sem Supabase)
 *   npm run db:imagens                     (sobe no Supabase Storage)
 *   npm run db:imagens -- --only=slug1,slug2
 *
 * Observação: na primeira execução a lib baixa o modelo ONNX (~80 MB).
 */

// ─────────────────────────── Config ───────────────────────────
const CANVAS = 800; // lado do canvas final (quadrado, igual aos cards)
const INNER = 620; // tamanho máximo do produto dentro do canvas (= folga uniforme)
const BUCKET = "produtos";
const UA = "HangarBebidas-Demo/0.1 (lucasalveslisboa1@gmail.com)";

// Correções manuais: force um código de barras (EAN), uma URL direta, ou pule.
// Preencha aqui depois de revisar o primeiro resultado.
const OVERRIDES: Record<
  string,
  { barcode?: string; imageUrl?: string; query?: string; skip?: boolean }
> = {
  // Fora do Open Food Facts por natureza (tabaco / não-alimentos) → placeholder.
  "cigarro-marlboro-box": { skip: true },
  "cigarro-lucky-strike": { skip: true },
  "palheiro-lambe-lambe": { skip: true },
  "carvao-vegetal-3kg": { skip: true },
  "gelo-em-cubos-2kg": { skip: true },
  // Match automático ruim no OFF → placeholder até ter imagem curada (EAN/manual).
  "agua-com-gas-crystal-500ml": { skip: true },
  "amendoim-japones-150g": { skip: true },
  "guarana-antarctica-2l": { skip: true },
  "heineken-long-neck-330ml": { skip: true },
  "corona-extra-330ml": { skip: true },
  "coca-cola-lata-350ml": { skip: true },
  // Falharam por rate-limit; recuperáveis com: npm run db:imagens -- --dry --only=<slug>
  // "espumante-salton-brut-750ml": {}, "vinho-quinta-do-morgado-1l": {}, "cachaca-51-965ml": {},
};

// ─────────────────────────── Args ───────────────────────────
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;

// ─────────────────────────── Clientes ───────────────────────────
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

// ─────────────────────────── Open Food Facts ───────────────────────────
type OffProduct = {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  countries_tags?: string[];
};

function normalizar(texto: string): string[] {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (t) =>
        t.length > 1 &&
        !["ml", "lata", "long", "neck", "box", "kg", "the"].includes(t) &&
        !/^\d+$/.test(t)
    );
}

/** Termo de busca enxuto: tira volume/embalagem que zeram os resultados no OFF. */
function montarQuery(nome: string): string {
  return nome
    .replace(/\b\d+([.,]\d+)?\s*(ml|l|cl|kg|g|un|unidades)\b/gi, " ")
    .replace(/\b(long neck|lata|garrafa|pet|caixa|box)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pontua um candidato pela sobreposição de palavras com o nome do produto. */
function pontuar(nomeProduto: string, cand: OffProduct): number {
  const alvo = new Set(normalizar(nomeProduto));
  const tokens = normalizar(`${cand.product_name ?? ""} ${cand.brands ?? ""}`);
  const matched = tokens.filter((t) => alvo.has(t)).length;
  if (matched === 0) return 0;
  const extras = tokens.filter((t) => !alvo.has(t)).length;
  let score = matched - 0.05 * extras; // penaliza candidato cheio de palavra estranha
  if (cand.countries_tags?.includes("en:brazil")) score += 0.5;
  return score;
}

/** GET no OFF com retry: o endpoint de busca rate-limita devolvendo HTML/429. */
async function fetchOffJson<T>(url: string, tentativas = 4): Promise<T | null> {
  for (let i = 0; i < tentativas; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const ct = res.headers.get("content-type") ?? "";
    if (res.ok && ct.includes("json")) return (await res.json()) as T;
    // rate-limited (HTML) ou 429 → espera progressiva e tenta de novo
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  return null;
}

async function buscarImagemUrl(nome: string, query?: string): Promise<string | null> {
  const termo = query ?? montarQuery(nome);
  const url =
    "https://world.openfoodfacts.org/cgi/search.pl?" +
    new URLSearchParams({
      search_terms: termo,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "12",
      fields: "product_name,brands,image_front_url,image_url,countries_tags",
    });

  const data = await fetchOffJson<{ products?: OffProduct[] }>(url);
  if (!data) return null;

  const candidatos = (data.products ?? []).filter(
    (p) => p.image_front_url || p.image_url
  );
  if (candidatos.length === 0) return null;

  candidatos.sort((a, b) => pontuar(nome, b) - pontuar(nome, a));
  const melhor = candidatos[0];
  if (pontuar(nome, melhor) < 1) return null; // sem nenhuma palavra em comum → não arrisca
  return melhor.image_front_url ?? melhor.image_url ?? null;
}

async function buscarPorBarcode(barcode: string): Promise<string | null> {
  const data = await fetchOffJson<{ product?: OffProduct }>(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=image_front_url,image_url`
  );
  return data?.product?.image_front_url ?? data?.product?.image_url ?? null;
}

// ─────────────────────────── Processamento ───────────────────────────
async function removerFundo(pngInput: Buffer): Promise<Buffer> {
  // Roda o onnx num processo isolado (ver remove-bg-worker.mjs).
  const base = path.join(os.tmpdir(), `hangar-bg-${process.pid}-${Date.now()}`);
  const inPath = `${base}-in.png`;
  const outPath = `${base}-out.png`;
  try {
    await writeFile(inPath, pngInput);
    await execFileP("node", [WORKER, inPath, outPath, "medium"]);
    return await readFile(outPath);
  } finally {
    await rm(inPath, { force: true });
    await rm(outPath, { force: true });
  }
}

async function padronizar(origem: Uint8Array): Promise<Buffer> {
  // 1) normaliza pra PNG (valida o arquivo e evita "Unsupported format")
  const pngInput = await sharp(Buffer.from(origem)).png().toBuffer();

  // 2) remove o fundo (processo isolado) → PNG com transparência
  const semFundo = await removerFundo(pngInput);

  // 3) apara o vazio em volta e redimensiona pro tamanho interno padrão
  const recorte = await sharp(semFundo)
    .trim()
    .resize(INNER, INNER, { fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  // 4) centraliza no canvas quadrado transparente (folga uniforme)
  const left = Math.round((CANVAS - recorte.info.width) / 2);
  const top = Math.round((CANVAS - recorte.info.height) / 2);

  return sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: recorte.data, left, top }])
    .webp({ quality: 90 })
    .toBuffer();
}

async function ensureBucket() {
  if (!supabase) return;
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (error && !/exists/i.test(error.message)) throw error;
}

async function salvar(slug: string, webp: Buffer): Promise<string> {
  if (DRY) {
    const dir = path.join(process.cwd(), "public", "produtos");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${slug}.webp`), webp);
    return `/produtos/${slug}.webp`;
  }
  if (!supabase) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env (ou rode com --dry)."
    );
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${slug}.webp`, webp, { contentType: "image/webp", upsert: true });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(`${slug}.webp`).data
    .publicUrl;
}

// ─────────────────────────── Main ───────────────────────────
async function main() {
  if (!DRY && (!SUPABASE_URL || !SERVICE_KEY)) {
    console.error(
      "⚠️  Sem credenciais do Supabase Storage. Rode com --dry para gravar em public/produtos, " +
        "ou preencha NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env."
    );
    process.exit(1);
  }

  await ensureBucket();

  const produtos = await prisma.produto.findMany({
    where: ONLY ? { slug: { in: ONLY } } : {},
    select: { id: true, slug: true, nome: true },
    orderBy: { nome: "asc" },
  });

  console.log(
    `🖼️  Processando ${produtos.length} produto(s)${DRY ? " (modo --dry: public/produtos)" : " → Supabase Storage"}...\n`
  );

  const semImagem: string[] = [];
  let ok = 0;

  for (const p of produtos) {
    const ov = OVERRIDES[p.slug] ?? {};
    if (ov.skip) {
      console.log(`  ⏭️  ${p.slug} (pulado)`);
      continue;
    }

    try {
      let imagemUrl = ov.imageUrl ?? null;
      if (!imagemUrl && ov.barcode) imagemUrl = await buscarPorBarcode(ov.barcode);
      if (!imagemUrl) imagemUrl = await buscarImagemUrl(p.nome, ov.query);

      if (!imagemUrl) {
        console.log(`  ❓ ${p.slug} — sem foto no Open Food Facts`);
        semImagem.push(p.slug);
        continue;
      }

      const res = await fetch(imagemUrl, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      if (!(res.headers.get("content-type") ?? "").startsWith("image/")) {
        throw new Error("resposta não é imagem");
      }
      const origem = new Uint8Array(await res.arrayBuffer());

      const webp = await padronizar(origem);
      const urlFinal = await salvar(p.slug, webp);

      await prisma.produto.update({
        where: { id: p.id },
        data: { imagemUrl: urlFinal },
      });

      ok++;
      console.log(`  ✅ ${p.slug}`);
    } catch (e) {
      console.log(`  ❌ ${p.slug} — ${(e as Error).message}`);
      semImagem.push(p.slug);
    }

    await new Promise((r) => setTimeout(r, 1500)); // gentileza com a API do OFF (rate-limit)
  }

  console.log(`\n✨ Concluído: ${ok} com imagem.`);
  if (semImagem.length) {
    console.log(
      `⚠️  Sem imagem (${semImagem.length}) — ajuste no OVERRIDES e rode com --only=:\n   ${semImagem.join(", ")}`
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
