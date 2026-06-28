import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Hash de senha do admin com scrypt (nativo do Node — sem dependência externa).
// Guardamos no formato "scrypt$<salt hex>$<derived hex>" para ser auto-descritivo
// e permitir comparação em tempo constante (timingSafeEqual) na verificação.

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(senha, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verificarSenha(
  senha: string,
  hashGuardado: string
): Promise<boolean> {
  const partes = hashGuardado.split("$");
  if (partes.length !== 3 || partes[0] !== "scrypt") return false;

  const salt = Buffer.from(partes[1], "hex");
  const esperado = Buffer.from(partes[2], "hex");
  const derived = (await scryptAsync(senha, salt, KEYLEN)) as Buffer;

  // Comprimentos diferentes fariam timingSafeEqual lançar — guarda antes.
  if (derived.length !== esperado.length) return false;
  return timingSafeEqual(derived, esperado);
}
