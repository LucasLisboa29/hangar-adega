# CLAUDE.md — Plataforma Hangar Bebidas

> Contexto-mestre do projeto, lido automaticamente a cada sessão. Mantenha curto e
> atualizado. A fonte da verdade dos documentos está nos `.md` referenciados abaixo;
> aqui fica o resumo e o **estado atual**.

## O que é

Plataforma de **vendas online própria** para a **Hangar Bebidas** (adega/conveniência
em Uberlândia–Araguari, "Desde 2009"), para **substituir** o cardápio digital genérico
que ela usa hoje (HeroDelivery — `hangarbebidas.herodelivery.com.br`).

A loja fica em ponto afastado, então **venda online e delivery são o canal central**.
O objetivo é uma loja com a **identidade da marca**, catálogo confiável, melhor UX de
compra e um **painel admin** para o dono ter controle — tudo construído **do zero**.

## Contexto importante

- Projeto é **iniciativa do Lucas** (estudante de Ciência da Computação): ainda **não há
  contrato/contato com o dono**. Por isso o MVP tem **duplo propósito**: produto real +
  **demo para conquistar o dono** como cliente.
- Vale mesmo se não vender: é **projeto de portfólio/currículo**.
- Desenvolvimento **solo, meio período**, sem prazo fixo (Lucas de férias da facul, mas
  trabalhando). Ritmo tranquilo.

## Stack (decidida)

- **Next.js + TypeScript** (loja + painel + API num projeto só)
- **Tailwind CSS** (+ shadcn/ui) — tema **dourado/preto** da Hangar
- **PostgreSQL** (Supabase ou Neon) + **Prisma**
- **Auth.js/NextAuth** ou auth do Supabase (só admin loga; cliente final **não** cria conta no MVP)
- **Supabase Storage / Cloudinary** (imagens)
- **Vercel** (deploy via Git)
- Pedido via **`wa.me`** (mensagem estruturada) — **sem gateway de pagamento no MVP**

## Decisões-chave

- **Sob medida** para a Hangar (não SaaS multi-loja — isso é futuro).
- **Pagamento online fora do MVP**: checkout via WhatsApp + pagamento na entrega.
- **Painel admin DENTRO do MVP**: versão funcional (não precisa estar perfeita), para o
  dono sentir que teria controle real (cadastrar produto, mexer preço, ver pedidos).
- **Cliente final não cria conta** no MVP.
- **Confirmação de maioridade (+18)** no checkout (bebida + tabaco).
- Construir **do zero** (decisão consciente vs. usar e-commerce pronto), pelo valor de currículo.

## Dados da loja (do site atual)

- Endereço: Avenida Minas Gerais 2625 · Tel: (34) 3512-1759
- Pedido mínimo: R$ 25,00 · Entrega: Uberlândia e Araguari
- Categorias: Palheiro, Energéticos, Isotônicos, Kids, Refrigerantes, Vinhos, Sucos,
  Licores, Cachaças, Cigarros…
- Prints do site atual em `Imagens do site atual/`

## Documentos do projeto

- [Visão e Escopo](visao-e-escopo.md) — objetivo, público, dentro/fora, riscos
- [Requisitos](requisitos.md) — funcionalidades (MoSCoW) + detalhe da stack
- [Roadmap](roadmap.md) — 5 fases até a demo
- [Quebra de Tarefas](quebra-de-tarefas.md) — **checklist; fonte da verdade do progresso**

## Estado atual do projeto

- **Fase atual:** 4 — Polimento & Demo **EM ANDAMENTO** 🚧 (Épico 3 já fechado). Primeira leva da
  Fase 4 feita (ver abaixo); ainda faltam itens que dependem do dono e revisão de UX/responsividade.
- **No ar:** https://hangar-adega.vercel.app (deploy contínuo a cada push na `main`)
- **Concluído na Fase 4 (primeira leva — sessão de 2026-06-28):** (1) **Seção de Destaques na home**:
  `getProdutosDestaque` em `src/lib/catalog.ts` + componente `<Destaques>` no topo de `(site)/page.tsx`
  (só quando não há filtro/busca; usa `produto.destaque`, máx. 8). (2) **SEO básico**: `metadataBase`,
  OpenGraph, `keywords` e `robots` na metadata raiz (`src/app/layout.tsx`); OpenGraph + `canonical` +
  imagem por produto no `generateMetadata` de `produto/[slug]` (favicon já existia em `src/app/favicon.ico`).
  (3) **Roteiro de apresentação pro dono** em `roteiro-apresentacao.md` (demo loja+painel, ganhos vs.
  HeroDelivery, FAQ). Verificado no preview (Destaques rendeiza, sem erro de console); `npm run build`
  limpo (SSG dos 33 produtos intacto). **Pendentes da Fase 4:** correção de preços, URL apresentável,
  e WhatsApp **do dono** (hoje está o nº de teste do Lucas — ver abaixo).
- **✅ Admin testado no mobile + WhatsApp de teste (sessão de 2026-06-29):** painel passado a 375px
  (login, visão geral, produtos lista+form, pedidos lista+detalhe, configurações). **Bug corrigido:**
  a `AdminNav` (`src/components/admin/admin-nav.tsx`) era `flex` sem wrap → os 5 itens estouravam a
  largura e davam scroll horizontal na página inteira no mobile; resolvido com `flex-wrap` (mobile) +
  `sm:flex-nowrap` (desktop segue coluna). As tabelas de produtos/pedidos usam `overflow-x-auto`
  (scroll lateral dentro da tabela) — controles acessíveis, padrão aceitável p/ a demo. **WhatsApp:**
  `ConfigLoja.whatsapp` setado pro **número de teste do Lucas `34999467562`** (`normalizarParaWaMe`
  prefixa o `55` → `5534999467562`) pra validar o fluxo de pedido fim-a-fim; **trocar pelo número do
  dono** quando houver contato (em `/admin/configuracoes`).
- **Concluído na Fase 4 (segunda leva — sessão de 2026-06-29):** (1) **Revisão de UX/responsividade**:
  fluxo da loja testado em mobile (375px) e desktop — home, produto, carrinho (drawer + stepper + aviso
  de mínimo), checkout (pagamento/troco/+18), /loja, 404; sem bug de layout nem erro de console. (Falta
  só passar o **admin no mobile**.) (2) **Imagens repensadas (decisão do Lucas):** o card e a página de
  produto agora usam **tile branco + `object-contain`** (estilo catálogo) em vez do fundo escuro com
  produto recortado "flutuando"; placeholder virou ícone cinza sutil no branco. As auto-imagens do Open
  Food Facts (qualidade ruim: mão segurando garrafa, artefatos de recorte) foram **descartadas** e a
  `imagemUrl` foi **zerada nos 33 produtos** (`npm run db:imagens:padronizar -- --limpar`) → produção
  mostra placeholder limpo em vez de imagem quebrada. **Novo pipeline de imagens** em
  `scripts/padronizar-imagens.ts` (`npm run db:imagens:padronizar`): NÃO remove fundo (fotos já vêm com
  fundo branco) — apenas apara a borda branca (`sharp.trim`), centraliza num canvas quadrado branco
  uniforme e sobe pro Supabase. O script antigo `produtos-imagens.ts` (fluxo transparente, remove fundo
  via ONNX) continua existindo mas foi aposentado. Verificado no preview + `npm run build` limpo.
- **✅ Fotos reais dos 33 produtos no ar (sessão de 2026-06-29):** o Lucas curou fotos de **fundo branco**
  de **todos os 33 produtos**, colocou em `imagens-fonte/` (gitignored, nome do arquivo = slug) e rodou
  `npm run db:imagens:padronizar` → as fotos foram padronizadas (quadrado branco uniforme) e subidas pro
  Supabase Storage, com a `imagemUrl` gravada nos 33. **A loja agora tem catálogo de fotos reais completo**
  (placeholder não aparece mais). O checklist em `imagens-fonte/README.md` (33/33) é a fonte do que foi
  subido; pra trocar/atualizar uma foto, é só repor o arquivo na pasta e rodar de novo (`upsert`) ou usar
  o upload do painel em `/admin/produtos`.
- **⚙️ Deploy/infra da Fase 3 — TUDO RESOLVIDO (sessão de 2026-06-28):** o painel admin agora roda
  em produção. (1) **Deploys estavam quebrando em silêncio há 3 dias:** o `DATABASE_URL` na **Vercel**
  estava com credencial **desatualizada** (a senha do Postgres mudou no Supabase; o `.env` local foi
  atualizado, a Vercel não) → o build falhava no SSG de `/produto/[slug]` com `P1000` (auth failed).
  O site no ar estava congelado no `9f04172` (Fase 0). Corrigido colando o `DATABASE_URL`/`DIRECT_URL`
  certos na Vercel. (2) **Env vars do admin setadas na Vercel:** `SESSION_SECRET` (login no ar ✅),
  `SUPABASE_SERVICE_ROLE_KEY` e **`NEXT_PUBLIC_SUPABASE_URL`** (essa faltava — sem ela `getClient()` em
  `storage.ts` devolvia null → "Storage não configurado"). (3) **Bucket `produtos` criado** (público)
  no Supabase Storage — antes nunca existira (pipeline da Fase 1 rodou só `--dry`); sem ele o upload
  dava `Bucket not found`. **Upload de imagem do admin testado e funcionando em produção.**
- **Concluído na Fase 3 (categorias + config — leva final):** **CRUD de categorias**
  (`/admin/categorias`: lista com ordem editável inline + toggle ativa; criar/editar via form
  compartilhado com slug auto; excluir **bloqueado** quando a categoria tem produtos — trava na
  UI e na action). **Configurações da loja** (`/admin/configuracoes`): edita o singleton
  `ConfigLoja` (nome, **WhatsApp**, telefone, endereço, pedido mínimo, área, aberta) e revalida
  `/loja` + `/checkout` — **é por aqui que o dono põe o número real do WhatsApp**. Queries em
  `src/lib/admin/categorias.ts`; actions em `src/app/admin/{categorias,configuracoes}/actions.ts`.
  Verificado no preview (criar/excluir categoria, reflexo nas pills da home, salvar config com
  mínimo refletindo no checkout); `npm run build` limpo.
- **Concluído na Fase 3 (fatia fundacional):** **auth própria** (escolhida com o Lucas, vs
  NextAuth/Supabase Auth) — cookie de sessão assinado com `jose` (`src/lib/auth/session.ts`),
  senha com `scrypt` do node:crypto (`auth/password.ts`), DAL `verificarSessao`/`getAdminAtual`
  (`auth/dal.ts`, defesa real) e `src/proxy.ts` (middleware do Next 16, verificação otimista do
  cookie). `npm run admin:criar` (`scripts/criar-admin.ts`) semeia o `UsuarioAdmin` a partir de
  `ADMIN_EMAIL`/`ADMIN_PASSWORD` do `.env`. **Loja pública movida para route group `(site)`** e
  o painel para `(painel)` (URLs não mudaram) para o admin não herdar header/footer da loja;
  layout raiz agora só tem `<html>/<body>`. **Painel** (`/admin`): login (`/admin/login`),
  visão geral com contagens, **CRUD de produtos** (lista com todos os produtos, criar/editar via
  form compartilhado, excluir com confirmação, toggles ativo/esgotado, edição rápida de preço) e
  **pedidos** (lista + detalhe + mudar `status`). Actions em `src/app/admin/*/actions.ts` (todas
  chamam `verificarSessao` e `revalidatePath` da vitrine); queries em `src/lib/admin/*`; upload em
  `src/lib/storage.ts`. Helpers `slugify`/`parseReaisParaCentavos`/`centavosParaInput` em `format.ts`.
  Sem migration (modelos já existiam). Verificado fim-a-fim no preview (gate, login, CRUD, revalidate
  na home, pedido criado→listado→status mudado, logout); `npm run build` limpo (SSG dos produtos intacto).
- **✅ Upload de imagem do admin:** RESOLVIDO. `SUPABASE_SERVICE_ROLE_KEY` preenchida no `.env` local
  e na Vercel; bucket `produtos` público criado no Supabase Storage. Funciona local e em produção.
- **✅ `SESSION_SECRET`:** RESOLVIDO. Setada na Vercel (Production+Preview); login do admin no ar funciona.
- **Concluído na Fase 2:** carrinho client-side (`CartProvider` — Context+reducer, persistido em
  `localStorage` `hangar.carrinho.v1`); adicionar pela página do produto (`AddToCartButton` vira
  stepper) e pelo "+" nos cards (`QuickAddButton`); **drawer** do carrinho (`ui/sheet.tsx` sobre
  radix `Dialog`) com badge no header, stepper, remover, subtotal e aviso de pedido mínimo;
  página `/checkout` (forma de pagamento Dinheiro/Cartão/Pix + troco condicional, observações,
  **+18 obrigatório**); Server Action `criarPedido` (`src/app/actions/checkout.ts`) que
  **revalida preços/total no servidor** (cliente não decide valor), checa mínimo/+18, cria
  `Pedido`+`ItemPedido` e devolve `{ numero, whatsappUrl }`; tela `/pedido/[numero]`; mensagem
  estruturada do WhatsApp em `src/lib/whatsapp.ts` (`montarMensagemPedido`/`linkWhatsApp`).
  Migration `add_pagamento_pedido` (campos nullable `formaPagamento`/`trocoParaCentavos`).
  Verificado fim-a-fim no preview + pedido confirmado no banco; `npm run build` limpo (SSG intacto).
- **⚠️ WhatsApp ainda é PLACEHOLDER** (`WHATSAPP_PLACEHOLDER` em `src/lib/loja.ts`;
  `ConfigLoja.whatsapp` vazio): o pedido salva, mas a mensagem cai em contato inexistente.
  Trocar pelo número real do dono é a pendência que "fecha a venda" (memória do projeto).
  **Agora dá pra setar pela UI:** `/admin/configuracoes` grava `ConfigLoja.whatsapp` — basta
  preencher quando houver o número do dono (não precisa mais mexer no banco/código).
- **Concluído na Fase 1:** layout da marca (`SiteHeader` sticky com busca + `SiteFooter`),
  tema dourado/preto aplicado globalmente (dark); home com produtos agrupados por categoria;
  `ProductCard` (placeholder de taça quando sem foto, badges Destaque/Esgotado); página de
  produto `/produto/[slug]` (SSG via `generateStaticParams` + `generateMetadata`); filtro por
  categoria (pills `?categoria=`) e busca (form GET `?q=`); página `/loja`; `not-found`.
  Catálogo semeado com 10 categorias / 33 produtos. Build limpo, verificado no preview.
- **Camada de dados:** `src/lib/catalog.ts` (queries Prisma em Server Components) e
  `src/lib/format.ts` (`formatBRL`). Componentes novos em `src/components/`.
- **Stack confirmada nas versões reais:** Next 16.2.9, React 19.2.4, Tailwind v4,
  Prisma 7.8 (usa **driver adapters** — `@prisma/adapter-pg`; URL via `prisma.config.ts`,
  não mais no schema). Banco escolhido: **Supabase**.
- **Banco conectado:** Supabase (projeto sa-east-1) com migration `init` aplicada e seed
  rodado (10 categorias, 33 produtos). Runtime usa pooled `:6543`, migrations usam `:5432`.
- **Repositório:** github.com/LucasLisboa29/hangar-adega (branch `main`).
- **Imagens dos produtos:** pipeline em `scripts/produtos-imagens.ts` (`npm run db:imagens`):
  busca no Open Food Facts → remove o fundo (onnx num **processo `node` isolado** —
  `remove-bg-worker.mjs`, porque onnx+sharp conflitam no Windows) → padroniza num canvas
  quadrado → webp transparente que "flutua" no card dourado/preto. **19 produtos com foto
  real** (modo `--dry`, gravadas em `public/produtos/`, gitignored); o resto fica no
  placeholder de taça. Match ruim/tabaco/não-alimentos estão marcados `skip` no `OVERRIDES`.
  `next.config.ts` já tem `remotePatterns` do Supabase e `.env` tem a `NEXT_PUBLIC_SUPABASE_URL`.
- **⚠️ Antes de fazer deploy da Fase 1:** dev e prod usam o MESMO banco Supabase, e o `--dry`
  gravou caminhos LOCAIS (`/produtos/...`) na `imagemUrl` de 19 produtos. Esses arquivos NÃO
  vão pro Vercel → rodar o upload real (`npm run db:imagens`, sem `--dry`, com
  `SUPABASE_SERVICE_ROLE_KEY` + bucket público "produtos") ANTES de publicar, senão o site no
  ar fica com imagens quebradas.
- **Pendências conhecidas:** curadoria das ~14 fotos faltantes (EAN/manual) e upload pro
  Supabase Storage; WhatsApp placeholder (acima). O painel já lista/gerencia produtos e pedidos.
  **(Resolvido:** `SUPABASE_SERVICE_ROLE_KEY` agora preenchida e bucket `produtos` criado — o
  upload de imagem do admin funciona. As 19 fotos do `--dry` ainda apontam pra caminhos LOCAIS
  `/produtos/...` (bloco acima): agora que o bucket existe, dá pra rodar `npm run db:imagens` sem
  `--dry` p/ subir de verdade — tarefa da Fase 4.)

### Para retomar na próxima sessão (Fase 4 — Polimento & Demo)

1. **Subir o ambiente:** `npm install` → `npm run dev` → http://localhost:3000 (`.env` já conecta ao Supabase).
   Admin: `/admin/login` (rodar `npm run admin:criar` se precisar (re)criar o usuário; lê `ADMIN_*` do `.env`).
2. **Épico 3 está fechado.** Próxima é a **Fase 4** (ver [quebra-de-tarefas.md](quebra-de-tarefas.md)):
   mais produtos reais + fotos, seção de destaques na home, revisão de UX/responsividade, SEO
   básico/favicon, teste do fluxo no celular, URL apresentável e roteiro de apresentação pro dono.
3. **Pendências que valem fechar antes da demo:**
   - **WhatsApp real:** quando houver o número do dono, é só preencher em `/admin/configuracoes`.
   - **Fotos reais dos produtos:** rodar `npm run db:imagens` (sem `--dry`) p/ subir as 19 fotos pro
     bucket `produtos` (hoje a `imagemUrl` aponta pra caminhos locais que não existem no Vercel) +
     curar as ~14 faltantes.
   - **(✅ Deploy/env já resolvido):** `SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`,
     `NEXT_PUBLIC_SUPABASE_URL` e `DATABASE_URL` corretos na Vercel; bucket `produtos` criado.
4. **Lembrete da stack:** Next 16 / Tailwind v4 / Prisma 7 têm breaking changes — antes de
   escrever código, consultar os guias em `node_modules/next/dist/docs/` (ver [AGENTS.md](AGENTS.md)).
   **Importante:** depois de `prisma migrate dev`, rode `npx prisma generate` e reinicie o dev
   server, senão o client em memória fica sem os campos novos (mordeu na Fase 2).
   **Gotcha do route group:** as duas formas de submit no admin convivem com o `<form action={sair}>`
   do header — ao automatizar, mire o botão pelo seletor do form certo (não o primeiro da página).

> **Como manter atualizado:** marque o progresso real nos checkboxes de
> `quebra-de-tarefas.md` (`[ ]` → `[~]` em andamento → `[x]` feito) e atualize só o bloco
> **"Estado atual do projeto"** acima a cada sessão. Não duplique a lista de tarefas aqui.
