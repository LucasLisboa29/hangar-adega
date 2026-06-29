# Quebra de Tarefas — Nova Plataforma da Hangar Bebidas

> Decomposição do projeto em tarefas acionáveis, agrupadas por épico (= fase do roadmap).
> Marque com `[x]` o que estiver concluído. Esforço: **P** (pequeno) / **M** (médio) / **G** (grande).
> Status: **rascunho v1** · Data: 23/06/2026

**Legenda de progresso:** `[ ]` a fazer · `[~]` em andamento · `[x]` concluído

---

## Épico 0 — Fundação (Fase 0)

- [x] Criar repositório Git (GitHub) e definir README inicial · P — _repo: github.com/LucasLisboa29/hangar-adega_
- [x] Inicializar projeto **Next.js + TypeScript** · P — _Next.js 16 + Turbopack_
- [x] Configurar **Tailwind CSS** + base de componentes (ex.: shadcn/ui) · P — _Tailwind v4 + shadcn/ui (radix)_
- [x] Definir paleta/identidade base (dourado/preto), fontes e logo da Hangar · M — _tema dourado/preto; fontes Inter + Oswald (falta aplicar a logo)_
- [x] Criar conta e provisionar **PostgreSQL** (Supabase) · P — _projeto "LucasLisboa29 hangar", região sa-east-1_
- [x] Configurar **Prisma** e conexão com o banco · M — _Prisma 7 + driver adapter `@prisma/adapter-pg`; singleton em `src/lib/prisma.ts`_
- [x] Modelar entidades: `Categoria`, `Produto`, `Pedido`, `ItemPedido`, `UsuarioAdmin`, `ConfigLoja` · M
- [x] Rodar primeira **migration** e seed mínimo de teste · P — _migration `init` aplicada; seed com 4 categorias/7 produtos_
- [x] Configurar deploy automático na **Vercel** (CI via Git) · M — _hangar-adega.vercel.app; redeploy a cada push na main_
- [x] Variáveis de ambiente (.env) e segredos no provedor · P — _`.env` local + env vars na Vercel_
- [x] **Marco:** app no ar (deploy contínuo) + banco conectado ✅ — _https://hangar-adega.vercel.app_

## Épico 1 — Vitrine / Catálogo (Fase 1)

- [x] Layout base do site (header, footer, navegação) responsivo · M — _SiteHeader (sticky + busca) + SiteFooter_
- [x] Aplicar identidade visual da Hangar ao layout · M — _tema dourado/preto global (dark), fontes Oswald/Inter_
- [x] Home com listagem de produtos agrupados por categoria · M — _seções por categoria via `getCategoriasComProdutos`_
- [x] Componente de card de produto (foto, nome, preço) · P — _`ProductCard` com badges Destaque/Esgotado_
- [x] Página de produto (imagem maior, descrição, preço, botão adicionar) · M — _`/produto/[slug]` SSG; botão é seam da Fase 2_
- [x] Navegação/filtro por categoria (melhor que scroll horizontal) · M — _pills `?categoria=slug` (`CategoryPills`)_
- [x] Busca por nome do produto · M — _form GET `?q=` + `buscarProdutos` (contains insensitive)_
- [x] Página "Informações da loja" (endereço, telefone, horário, mínimo, área) · P — _`/loja` lê `ConfigLoja`_
- [x] Lazy-load / otimização de imagens dos produtos · P — _`next/image` (fill+sizes, lazy nativo); `remotePatterns` do Supabase configurado_
- [x] Pipeline de imagens padronizadas (recorte + canvas) · M — _`scripts/produtos-imagens.ts`: Open Food Facts → remove fundo (onnx em processo isolado) → canvas quadrado → webp transparente; 19 produtos com foto, resto placeholder (curadoria/upload Supabase pendentes)_
- [x] Popular catálogo com subconjunto **real** de produtos para parecer convincente · M — _seed: 10 categorias / 33 produtos_
- [x] **Marco:** loja navegável e bonita no celular — _verificado no preview (mobile + desktop)_

## Épico 2 — Carrinho & Checkout (Fase 2)

- [x] Estado do carrinho (adicionar, remover, quantidade) · M — _`CartProvider` (Context + reducer); `AddToCartButton` (stepper) + `QuickAddButton` ("+" no card)_
- [x] Persistência do carrinho (localStorage ou sessão) · P — _localStorage `hangar.carrinho.v1` (hidrata no mount); verificado após reload_
- [x] Tela/painel do carrinho com subtotal e total · M — _drawer (`Sheet` sobre radix `Dialog`) com badge no header, stepper e remover_
- [x] Regra de **pedido mínimo** (bloqueio + aviso de quanto falta) · P — _aviso "faltam R$ X"; "Finalizar" bloqueado abaixo do mínimo (drawer + checkout); revalidado no servidor_
- [x] Tela de checkout: dados de entrega + forma de pagamento (na entrega) · M — _`/checkout`; forma (Dinheiro/Cartão/Pix) + troco condicional_
- [x] Confirmação de **maioridade (+18)** antes de finalizar · P — _checkbox obrigatório (client + server)_
- [x] Montar mensagem estruturada do pedido e abrir **WhatsApp** (`wa.me`) · M — _`montarMensagemPedido`/`linkWhatsApp`; nº placeholder (trocar pelo do dono)_
- [x] Salvar pedido no banco (para o admin listar depois) · M — _Server Action `criarPedido` revalida preços/total no servidor; cria `Pedido`+`ItemPedido`; tela `/pedido/[numero]`_
- [x] Validações de formulário (campos obrigatórios, área de entrega) · P — _campos obrigatórios + +18 + mínimo; revalidação autoritativa na action_
- [x] **Marco:** cliente fecha um pedido fim a fim pelo celular — _verificado fim-a-fim no preview + pedido confirmado no banco_

## Épico 3 — Painel Admin (Fase 3)

- [x] **Login** protegido do admin (Auth.js/NextAuth ou auth do Supabase) · M — _sessão própria com `jose` (cookie JWT assinado) + senha com `scrypt` (node:crypto); `proxy.ts` (otimista) + DAL `verificarSessao` (real); `npm run admin:criar` semeia o `UsuarioAdmin`_
- [x] Layout do painel (área autenticada, navegação) · M — _route group `(painel)`: header + nav (Visão geral/Produtos/Pedidos) + Sair; loja pública movida para `(site)` para não herdar a moldura_
- [x] Listagem de produtos no admin · P — _tabela com todos os produtos (incl. inativos/esgotados)_
- [x] Criar/editar produto (nome, preço, descrição, categoria) · M — _form compartilhado novo/editar; slug auto no cadastro, preservado na edição; revalida a vitrine_
- [~] **Upload de imagem** do produto (Supabase Storage/Cloudinary) · M — _fiado e funcionando (bucket "produtos", padrão do script de imagens); falta só preencher `SUPABASE_SERVICE_ROLE_KEY` no `.env`/Vercel (vazia hoje — pendência da Fase 1). Sem a chave, o form mostra erro limpo em vez de quebrar_
- [x] Excluir produto · P — _com confirmação_
- [x] Marcar produto **ativo/esgotado** · P — _toggles na lista_
- [x] **Edição rápida de preço** · P — _input inline na lista_
- [x] CRUD de **categorias** · M — _lista (ordem editável inline + toggle ativa), criar/editar (form compartilhado, slug auto), excluir bloqueado se houver produtos; revalida a vitrine_
- [x] **Listagem de pedidos** recebidos (data, itens, total, cliente) · M — _lista + detalhe + mudar status (enum `StatusPedido`)_
- [x] Configurações da loja (horário, mínimo, área) · M — _`/admin/configuracoes` edita o singleton `ConfigLoja` (nome, **WhatsApp**, telefone, endereço, pedido mínimo, área, aberta); reflete em `/loja` e no checkout_
- [x] **Marco:** dono cadastra/edita produto e vê pedidos sem depender de ninguém — _alcançado (produtos, categorias, pedidos e config da loja pelo painel); upload de imagem depende da service key_

## Épico 4 — Polimento & Demo (Fase 4)

- [~] Cadastrar mais produtos reais (corrigir fotos faltando e preços R$ 0,00 do site atual) · M
  — _**fotos:** ✅ os 33 produtos agora têm **foto real de fundo branco** no tile branco (catálogo).
  Auto-imagens do Open Food Facts descartadas; Lucas curou as fotos em `imagens-fonte/` e subiu via
  `npm run db:imagens:padronizar` (`scripts/padronizar-imagens.ts`). **Pendente ainda:** revisar preços
  e, se for o caso, cadastrar produtos extras._
- [x] Seção de destaques na home · P — _`getProdutosDestaque` + `<Destaques>` no topo da home (só sem filtro); usa `produto.destaque`_
- [x] Revisão geral de UX/UI e responsividade · M — _passada em mobile (375px) e desktop: home, produto, /loja, 404; sem bug de layout nem erro de console_
- [x] SEO básico (títulos, meta tags por produto/categoria), favicon · P — _`metadataBase`+OpenGraph+keywords+robots na raiz; OG/canonical/imagem por produto; favicon já existia_
- [x] Teste manual do fluxo completo (loja + admin) no celular · P — _loja (home→produto→carrinho→checkout→+18)
  e **admin** (login, visão geral, produtos lista+form, pedidos lista+detalhe, categorias, configurações)
  testados a 375px. Bug corrigido: a nav do admin causava scroll horizontal → `flex-wrap` em `admin-nav.tsx`_
- [~] Ajustar domínio provisório / URL apresentável · P — _`hangar-adega.vercel.app` mantida por ora
  (decisão do Lucas); domínio próprio fica pra quando houver contato com o dono_
- [x] Escrever **roteiro de apresentação** pro dono (ganhos vs. HeroDelivery) · P — _[roteiro-apresentacao.md](roteiro-apresentacao.md)_
- [x] **Marco:** DEMO no ar, pronta para apresentar ao dono da Hangar — _loja + admin no ar, responsivos,
  testados no celular (2026-06-29), com pedido fim-a-fim funcionando (WhatsApp de teste do Lucas)_

---

## Backlog / Ideias futuras (Fase 5 — pós-validação)

- Combos / "leve junto" e sugestões de itens relacionados
- Promoções e marcação de produto em oferta
- Filtro por faixa de preço
- [x] Indicador de loja aberta/fechada conforme horário — grade semanal em
  `ConfigLoja.horarios` (fuso America/Sao_Paulo, com virada de meia-noite),
  badge "ao vivo" no header (via `/api/loja/status`), card de horários na `/loja`
  e editor dos 7 dias no admin (`/admin/configuracoes`)
- Pagamento online (Pix/cartão via gateway)
- Conta do cliente + histórico + "repetir último pedido"
- PWA ("adicionar à tela inicial")
- Importação de catálogo por planilha
- Domínio próprio definitivo + política de privacidade/LGPD formal
- (Estratégico) Evoluir para SaaS multi-loja, atendendo outras adegas

---

## Dados/insumos a coletar do dono (quando houver contato)

- Logo da Hangar em alta resolução + cores oficiais
- Fotos reais dos produtos (ou autorização para usar/recriar)
- Catálogo atualizado com preços corretos
- Número de WhatsApp oficial para receber pedidos
- Confirmação de área de entrega e taxas (se houver)
