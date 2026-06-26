// Constantes da loja usadas no cliente (carrinho/checkout). O valor autoritativo
// do pedido mínimo vem de ConfigLoja no banco; estes são fallbacks/placeholders.

/** Pedido mínimo padrão (R$ 25,00). Só para o aviso no drawer — o checkout
 * revalida contra ConfigLoja.pedidoMinimoCentavos no servidor. */
export const PEDIDO_MINIMO_CENTAVOS = 2500;

// TODO(whatsapp): número de WhatsApp PLACEHOLDER. Trocar pelo número real do dono
// da Hangar (preencher ConfigLoja.whatsapp) — é o canal que recebe os pedidos.
// Até lá, o link do wa.me abre num contato inexistente, o que é esperado.
export const WHATSAPP_PLACEHOLDER = "5534000000000";
