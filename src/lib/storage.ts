import "server-only";

import { createClient } from "@supabase/supabase-js";

// Upload de imagem de produto pro Supabase Storage (bucket público "produtos").
// Mesmo padrão do scripts/produtos-imagens.ts: client com service role (só no
// servidor — a chave NUNCA vai pro cliente). Retorna a URL pública.

const BUCKET = "produtos";

export type ResultadoUpload =
  | { ok: true; url: string }
  | { ok: false; erro: string };

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function uploadImagemProduto(
  file: File,
  slug: string
): Promise<ResultadoUpload> {
  const supabase = getClient();
  if (!supabase) {
    return {
      ok: false,
      erro: "Storage não configurado (faltam variáveis do Supabase no servidor).",
    };
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const caminho = `${slug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    return { ok: false, erro: `Falha no upload: ${error.message}` };
  }

  const url = supabase.storage.from(BUCKET).getPublicUrl(caminho).data
    .publicUrl;
  return { ok: true, url };
}
