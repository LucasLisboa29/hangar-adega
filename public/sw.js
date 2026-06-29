// Service worker da Hangar Bebidas — propositalmente minimalista.
//
// Estratégia: NÃO cacheia assets/HTML do app (evita servir versão velha após
// deploy). Só guarda uma página offline própria (HTML inline, sem depender de
// chunks do Next) e a usa como fallback quando uma NAVEGAÇÃO falha (sem rede).
// Tudo o mais passa direto para a rede.

const CACHE = "hangar-v1";
const OFFLINE_URL = "/offline.html";

const OFFLINE_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sem conexão · Hangar Bebidas</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #141414; color: #f5f5f5;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    text-align: center; padding: 24px;
  }
  .h { font-weight: 800; font-size: 64px; color: #d6ad42; letter-spacing: 2px; }
  h1 { font-size: 20px; margin: 16px 0 8px; }
  p { color: #a3a3a3; max-width: 28rem; line-height: 1.5; }
  button {
    margin-top: 20px; padding: 10px 20px; border: 0; border-radius: 10px;
    background: #d6ad42; color: #141414; font-weight: 600; font-size: 15px; cursor: pointer;
  }
</style>
</head>
<body>
  <div>
    <div class="h">H</div>
    <h1>Você está sem conexão</h1>
    <p>Não foi possível carregar a Hangar Bebidas agora. Verifique sua internet e tente de novo.</p>
    <button onclick="location.reload()">Tentar de novo</button>
  </div>
</body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.put(
        OFFLINE_URL,
        new Response(OFFLINE_HTML, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove caches de versões antigas.
      const chaves = await caches.keys();
      await Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Só navegações (abrir/recarregar páginas). O resto passa direto para a rede.
  if (req.mode !== "navigate") return;

  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch {
        const cache = await caches.open(CACHE);
        const offline = await cache.match(OFFLINE_URL);
        return offline ?? Response.error();
      }
    })()
  );
});
