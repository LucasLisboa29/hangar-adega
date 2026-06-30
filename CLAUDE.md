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

- **🔧 Modo atual — REFINAMENTO DIRIGIDO PELO LUCAS (desde 2026-06-29):** com o app estruturado
  (Fases 0–5, leva inicial), o Lucas entrou na etapa combinada desde o começo: **ele testa o app
  pronto e pede ajustes** (acrescentar, mover, mudar design/UX). Trabalhar **por etapas, uma de cada
  vez**, e **ao final de cada uma perguntar se ele quer mais**. Pedido de tela/design → **gerar mockup
  antes de codar**. Decisão final de UX é dele. **1ª leva (home, em andamento):** (1) mais complexidade
  na home (não só vitrine agrupada); (2) subtítulo "ADEGA & CONVENIÊNCIA · ARAGUARI-MG" **só na home**
  (categorias mostram só produtos); (3) filtro de preço **escondido** (abre sob demanda, não fica
  aparente); (4) **nav de categorias sticky** ao rolar (trocar categoria sem voltar ao topo).
  **Layout da home decidido (após 4 mockups):** blend banner "Oferta da semana" + grade com TODAS as
  categorias visíveis (sem scroll lateral) + trilhas (Mais vendidos/Ofertas/Destaques) + catálogo.
  Detalhes em `[[home-redesign-objetivos]]` (memória).
  - **✅ Etapa 1 FEITA (subtítulo só na home + nav sticky):** o header + a `<CategoryPills>` agora
    vivem num **wrapper `sticky top-0 z-40` no `(site)/layout.tsx`** (pinados juntos — sem número
    mágico de offset). `CategoryPills` virou **client** (lê `?categoria` via `useSearchParams`,
    esconde-se em `/checkout` e `/pedido` via `usePathname`); `SiteHeader` perdeu o `sticky` próprio.
    O hero/subtítulo da marca na home só renderiza quando `!filtrando`. O layout busca `getCategorias`
    (verificado: **SSG de `/produto/[slug]` segue intacto**). Verificado no preview (sticky ao rolar,
    hero some na categoria, nav some no checkout); build limpo.
  - **✅ Etapa 2 FEITA (filtro de preço escondido):** a `<PriceFilter>` saiu da home (`(site)/page.tsx`)
    e foi pra dentro do `CategoryPills`. Um botão **"Filtros"** (ícone `SlidersHorizontal`) fica fixo na
    ponta direita da barra sticky (fora do scroll horizontal das pills — `nav` é `flex-1`, botão é
    `shrink-0`); ao clicar abre/fecha um **painel** logo abaixo da barra (`id="painel-filtros"`,
    `border-t`/`bg-card/40`) que renderiza a `<PriceFilter>`. Estado aberto/fechado vive em `useState`
    no `CategoryPills`; **abre automático** quando já há `precoMin`/`precoMax` na URL (lazy init via
    `useSearchParams`), e o botão ganha realce dourado (`bg-primary/10`) quando aberto OU com filtro
    ativo. Label do submit virou "Aplicar". Verificado no preview (abre/fecha, auto-abre em
    `?precoMax=5` com 6 produtos pelo preço efetivo, hero some ao filtrar, sem erro de console); build
    limpo (SSG dos 33 produtos intacto).
  - **➡️ PRÓXIMAS ETAPAS (retomar aqui):** **Etapa 3** — grade com todas as categorias visíveis na home
    (tiles com ícone; precisa de um mapa categoria→ícone lucide). **Etapa 4** — banner "Oferta da
    semana" (puxa de `getProdutosEmOferta`) + trilha "Mais vendidos" (proxy via itens mais pedidos /
    fallback Destaques).
- **Fase atual:** 5 — Backlog / pós-validação **EM ANDAMENTO** 🚧 (Fases 0–4 fechadas; demo no ar e
  testada). O Lucas está pegando itens do backlog que **não dependem do dono** (valor de portfólio).
  **Itens dependentes do dono seguem pendentes** (não bloqueiam a demo): **preços reais** (hoje
  estimados — decisão do Lucas de manter), **número real do WhatsApp** (hoje o nº de teste do Lucas) e
  **URL/domínio próprio** (hoje `hangar-adega.vercel.app`, decisão de manter).
- **✅ Fase 5 — Indicador de loja aberta/fechada por horário (sessão de 2026-06-29):** primeiro item do
  backlog da Fase 5. (1) **Modelo:** novo campo `ConfigLoja.horarios` (`Json?`, migration
  `add_horarios_loja`) com a grade semanal (7 dias, 0=domingo…6=sábado, cada um `{fechado, abre, fecha}`
  "HH:MM"); o `aberta` (bool) virou **override manual** (kill-switch p/ feriado). Status final =
  `aberta ∧ dentro do horário`. (2) **Lib `src/lib/horario.ts`:** `calcularStatusLoja(config, agora?)`
  calcula tudo no **fuso America/Sao_Paulo** via `Intl` (servidor da Vercel roda em UTC — não dá pra usar
  `getDay()` direto), trata **virada de meia-noite** (fecha ≤ abre = madrugada do dia seguinte) e calcula a
  **próxima abertura** ("Abre Terça às 09:00"). `HORARIOS_PADRAO` cobre quando o campo é null.
  (3) **Badge no header:** as páginas da loja são **SSG** (home, `/produto/[slug]` por SEO), e o status
  depende da hora — então o badge é **client-side** (`<StatusLojaLive>` em `src/components/status-loja.tsx`)
  buscando `/api/loja/status` (route handler `force-dynamic`) e revalidando a cada 1 min. Isso mantém o
  SSG intacto e o badge sempre "ao vivo" (vira aberta↔fechada sem redeploy). (4) **`/loja`:** card de
  funcionamento com a grade da semana + dia de hoje destacado + badge (renderizado no servidor, página já
  era dinâmica). (5) **Admin:** editor dos 7 dias (inputs `type="time"` + checkbox "Fechado") no
  `config-form.tsx`; `actions.ts` lê `dia-{i}-{fechado,abre,fecha}` e normaliza via `parseHorarios`.
  Verificado: badge "Aberta · Fecha às 23:00" no header, card na `/loja`, lib unit-testada (aberta/fechada/
  próxima abertura/override/madrugada), `npm run build` limpo (SSG dos 33 produtos intacto). **Gotcha:**
  `prisma migrate dev` NÃO regenerou o client no output custom (`src/generated/prisma`) — precisou de
  `npx prisma generate` à parte antes do build enxergar `ConfigLoja.horarios`.
- **✅ Fase 5 — Promoções / produto em oferta (sessão de 2026-06-29):** segundo item do backlog.
  (1) **Modelo:** novo campo `Produto.precoPromoCentavos` (`Int?`, migration `add_preco_promo`).
  Regra de oferta centralizada em `src/lib/format.ts` (`emOferta`, `precoEfetivoCentavos`,
  `descontoPercentual`): em oferta quando a promo está preenchida E é menor que o preço cheio.
  (2) **Vitrine:** selo vermelho "-N%" + preço cheio riscado nos cards (`product-card.tsx`) e na
  página de produto; nova seção **"Ofertas"** na home (`getProdutosEmOferta` — filtra promo < preço
  em JS porque o Prisma não compara duas colunas no `where`). (3) **Carrinho/checkout:** o card e a
  página passam o **preço efetivo** ao carrinho; o `criarPedido` (que já revalida tudo no servidor)
  agora usa `precoEfetivoCentavos` do produto do banco → a oferta é honrada e **à prova de
  adulteração** (o cliente só manda id+quantidade). (4) **Admin:** campo "Preço em oferta" no
  `produto-form.tsx` (opcional; valida promo < preço na action, em branco = sem oferta) + indicador
  de oferta na lista de produtos. Verificado no preview (home/produto/carrinho com a promo, subtotal
  com preço de oferta, sem erro de console); `npm run build` limpo (SSG dos 33 produtos intacto).
  **Há uma oferta de teste (-30%) na Heineken** semeada p/ demo — remover/ajustar em `/admin/produtos`.
- **✅ Fase 5 — Filtro por faixa de preço (sessão de 2026-06-29):** terceiro item do backlog. Novo
  componente `src/components/price-filter.tsx` (`<PriceFilter>`): form **GET** para `/` com inputs
  `precoMin`/`precoMax` (em reais) + hidden `q`/`categoria` (preserva busca/categoria ao aplicar) +
  link "Limpar". A home lê os params, converte com `parseReaisParaCentavos` e inclui no estado
  `filtrando`. `buscarProdutos` ganhou `precoMin/MaxCentavos` e filtra pelo **preço efetivo**
  (`precoEfetivoCentavos` — oferta incluída) **em JS** (o Prisma não computa COALESCE no `where`; ex.:
  Heineken base R$6,90 aparece em "até R$5" pelo efetivo R$4,83). Verificado no preview (faixa isolada,
  combinada com categoria, vazio tratado como ausente, sem erro de console); `npm run build` limpo.
- **✅ Fase 5 — PWA / "adicionar à tela inicial" (sessão de 2026-06-29):** quarto item do backlog.
  (1) **Manifest:** `src/app/manifest.ts` (Next gera `/manifest.webmanifest` e linka sozinho) —
  standalone, tema `#141414`, ícones. (2) **Ícones:** gerados com `sharp` (script descartável) —
  "H" dourado vetorial em fundo preto, em `public/icons/` (192, 512 e maskable 512); apple-touch-icon
  aponta pro 192. **Sem logo do dono** ainda, então é placeholder da marca. (3) **Metadata raiz**
  (`layout.tsx`): `export const viewport` com `themeColor` + `appleWebApp` + `icons`. (4) **Service
  worker** (`public/sw.js`) **conservador de propósito**: NÃO cacheia assets/HTML (evita servir versão
  velha pós-deploy) — só guarda uma página **offline inline** (HTML próprio, sem depender de chunks do
  Next) e a usa como fallback quando uma navegação falha; resto passa direto pra rede. Registrado por
  `<PwaRegister>` (`src/components/pwa-register.tsx`, client) incluído no `layout.tsx`. Verificado no
  preview (manifest 200, ícones 200, SW ativo escopo `/`, offline cacheado, sem erro de console);
  `npm run build` limpo. **Gotcha (mesma classe do Prisma):** ao criar um arquivo NOVO referenciado por
  um módulo já editado, o Turbopack do dev server pode ficar com "Module not found" em cache — precisou
  **reiniciar o dev server** (o `npm run build` em processo separado já resolvia).
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

### Para retomar na próxima sessão (Fase 5 — Backlog / pós-validação)

1. **Subir o ambiente:** `npm install` → `npm run dev` → http://localhost:3000 (`.env` já conecta ao Supabase).
   Admin: `/admin/login` (rodar `npm run admin:criar` se precisar (re)criar o usuário; lê `ADMIN_*` do `.env`).
2. **Fases 0–4 fechadas.** A **demo está no ar e testada no celular**. A próxima é a **Fase 5**
   (backlog/pós-validação — ver lista em [quebra-de-tarefas.md](quebra-de-tarefas.md)): combos/"leve junto",
   promoções, filtro por faixa de preço, indicador de loja aberta/fechada por horário, pagamento online
   (Pix/cartão via gateway), conta do cliente + histórico, PWA, importação de catálogo por planilha,
   domínio próprio + LGPD, e (estratégico) evoluir pra SaaS multi-loja. **Escolher com o Lucas o que
   priorizar** — várias dessas idealmente entram após validação com o dono, mas valem como portfólio.
3. **Pendências que dependem do dono (não bloqueiam a demo):** número real do WhatsApp e preços reais
   (hoje nº de teste do Lucas + preços estimados, ambos editáveis em `/admin/configuracoes` e no admin),
   logo em alta, domínio próprio.
4. **Lembrete da stack:** Next 16 / Tailwind v4 / Prisma 7 têm breaking changes — antes de
   escrever código, consultar os guias em `node_modules/next/dist/docs/` (ver [AGENTS.md](AGENTS.md)).
   **Importante:** depois de `prisma migrate dev`, rode `npx prisma generate` e reinicie o dev
   server, senão o client em memória fica sem os campos novos (mordeu na Fase 2).
   **Gotcha do route group:** as duas formas de submit no admin convivem com o `<form action={sair}>`
   do header — ao automatizar, mire o botão pelo seletor do form certo (não o primeiro da página).

> **Como manter atualizado:** marque o progresso real nos checkboxes de
> `quebra-de-tarefas.md` (`[ ]` → `[~]` em andamento → `[x]` feito) e atualize só o bloco
> **"Estado atual do projeto"** acima a cada sessão. Não duplique a lista de tarefas aqui.
