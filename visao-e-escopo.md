# Visão e Escopo — Nova Plataforma de Vendas Online da Hangar Bebidas

> Documento de alinhamento inicial. Define o "porquê" e os limites do projeto.
> Status: **rascunho v1** · Autor: Lucas · Data: 23/06/2026

## Objetivo

Construir uma **plataforma de vendas online própria** para a Hangar Bebidas
(adega/conveniência em Uberlândia–Araguari), substituindo o cardápio digital
genérico que ela usa hoje (HeroDelivery). A nova plataforma deve **vender mais e
melhor** — com identidade visual da marca, catálogo confiável e uma experiência
de compra e delivery superior — servindo, ao mesmo tempo, como **demonstração
concreta para conquistar o dono como cliente**.

## Problema / Oportunidade

A Hangar fica em um ponto afastado, sem fluxo de rua relevante, então **a venda
online e o delivery são o canal central** do negócio. Hoje, porém, ela depende de
um template alugado (HeroDelivery) com vários problemas:

- **Sem identidade** — visual branco e padrão, idêntico a qualquer loja da
  plataforma; a marca forte da Hangar ("Desde 2009", logo dourado/preto) se perde.
- **Catálogo com falhas** — produtos sem foto (ícone de garrafa cinza) e **erros de
  preço** (ex.: Baly Cereja Zero 1L a R$ 0,00).
- **Experiência fraca** — sem página de produto, sem descrições, busca básica, sem
  combos/promoções/sugestões; navegação só por scroll de categorias.
- **Checkout pobre** — finaliza jogando o número no WhatsApp, sem pagamento online
  nem acompanhamento de pedido real.
- **Dependência total** — a loja não controla preço, layout, dados nem SEO; tudo
  fica refém da plataforma terceirizada.

**Oportunidade:** entregar uma plataforma própria, com a cara da Hangar, que
corrija essas falhas e transforme o site no principal vendedor da loja — e usar isso
como porta de entrada para uma possível prestação de serviço/produto.

## Público-alvo

**Cliente do negócio (quem decide a contratação):**
- *Dono da Hangar Bebidas* — quer mais pedidos, menos trabalho manual e controle
  sobre a própria loja, sem depender de um terceiro.

**Usuários finais (quem compra):**
- *Cliente recorrente do bairro / com afinidade* — já conhece a loja, quer pedir
  rápido pelo celular, repetir pedidos e receber em casa.
- *Cliente de delivery em Uberlândia/Araguari* — busca bebida gelada com entrega
  rápida; decide muito pela foto, preço claro e facilidade de pagar.
- *Comprador de conveniência/ocasião* — churrasco, festa, "acabou a bebida";
  valoriza combos, sugestões e poucos cliques até finalizar.

**Operador (dia a dia):**
- *Atendente / dono no balcão* — precisa cadastrar produto, ajustar preço e estoque,
  e gerenciar os pedidos que chegam, de forma simples.

## Proposta de valor

- **Marca em primeiro lugar** — a loja com a identidade da Hangar, não um template
  branco genérico.
- **Catálogo confiável e vendedor** — fotos reais, descrições, preços corretos,
  categorias bem organizadas, busca e filtros que funcionam.
- **Compra sem fricção** — carrinho fluido, combos e sugestões ("leve junto"),
  destaques e promoções, checkout claro com pagamento online e/ou WhatsApp.
- **Operação no controle do dono** — painel para gerenciar produtos, preços, estoque
  e pedidos sem depender de terceiros.
- **Presença digital própria** — domínio, SEO e dados da loja nas mãos dela.

## Escopo (dentro) — MVP

Foco em um MVP que já seja **demonstrável para o dono** e utilizável por clientes reais:

- **Vitrine/catálogo** — produtos por categoria, com foto, nome, preço e descrição.
- **Busca e filtros** — por nome e por categoria (e idealmente por faixa de preço).
- **Página de produto** — detalhe com imagem maior, descrição e botão de adicionar.
- **Carrinho e checkout** — adicionar/remover, ajustar quantidade, ver total, aplicar
  pedido mínimo; finalizar com dados de entrega.
- **Pedido por WhatsApp** — geração de pedido estruturado enviado ao WhatsApp da loja
  (paridade com o fluxo atual, porém mais organizado) como caminho garantido.
- **Painel administrativo (operação)** — CRUD de produtos/categorias, edição de preço
  e disponibilidade, e listagem dos pedidos recebidos.
- **Identidade visual da Hangar** — tema dourado/preto, logo, tom de "premium e
  entrega rápida".
- **Informações da loja** — endereço, telefone, horário de funcionamento, pedido
  mínimo, área de entrega (Uberlândia/Araguari).
- **Responsivo / mobile-first** — a maioria dos clientes acessa pelo celular.

## Fora de escopo (por enquanto)

- **SaaS multi-loja** — atender outras adegas além da Hangar (foco agora é sob medida).
- **Pagamento online integrado (gateway)** — Pix/cartão automático fica como fase
  posterior; o MVP pode validar com WhatsApp + pagamento na entrega.
- **App nativo (iOS/Android)** — começamos como web app responsivo/PWA.
- **Logística de entrega própria** (rastreamento de entregador em tempo real,
  roteirização).
- **Programa de fidelidade, cupons avançados e recomendação por IA.**
- **Integração com ERP/sistema de estoque existente da loja** (a confirmar se há).

## Premissas

- O projeto começa **como iniciativa do Lucas**, sem contrato fechado — logo, o MVP
  precisa ser bom o bastante para servir de **pitch/demonstração** ao dono.
- Os **dados de produtos** (nomes, preços, categorias) podem ser extraídos/recriados
  a partir do cardápio atual; **fotos** podem precisar ser refeitas/coletadas.
- O delivery continua sendo **operado pela própria loja** (a plataforma organiza o
  pedido, não substitui a entrega).
- Stack e arquitetura serão **recomendadas por mim** no documento de requisitos,
  priorizando algo moderno, de baixo custo e adequado a um estudante de CC
  desenvolvendo sozinho.
- Orçamento inicial enxuto (hospedagem de baixo custo / camada gratuita sempre que
  possível).

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Dono não se interessar / já estar satisfeito com a HeroDelivery | Alto | Construir um MVP/demo impressionante e levar uma proposta com ganhos claros (marca, controle, conversão) antes de investir muito |
| Venda de bebida alcoólica e cigarro exige verificação de idade / regras legais | Médio | Incluir aviso e confirmação de maioridade no fluxo; tratar termos legais antes de ir ao ar |
| Coletar fotos e dados corretos de todo o catálogo dá trabalho | Médio | Começar com um subconjunto de categorias para a demo; padronizar processo de cadastro |
| Pagamento online (gateway) adiciona complexidade e taxas | Médio | Manter fora do MVP; validar primeiro com WhatsApp + pagamento na entrega |
| Escopo crescer demais (virar SaaS, app nativo) e travar a entrega | Médio | Manter o foco no MVP sob medida; registrar ideias em "fora de escopo" |
| Projeto solo sem prazo definido perder ritmo | Médio | Roadmap com fases curtas e uma meta clara: ter a demo pronta para apresentar ao dono |
| Dependência de dados/identidade da loja (logo em alta resolução, etc.) | Baixo | Listar cedo o que precisa do dono; ter fallback (recriar identidade aproximada para a demo) |
