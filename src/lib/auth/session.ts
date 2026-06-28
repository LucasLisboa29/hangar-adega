import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Sessão do admin: cookie httpOnly assinado com jose (HS256). Stateless — o
// payload carrega só o id do UsuarioAdmin. Validade de 7 dias.

export const COOKIE_SESSAO = "hangar.admin.sessao";
const DURACAO_MS = 7 * 24 * 60 * 60 * 1000;

type SessaoPayload = { adminId: string };

function getChave(): Uint8Array {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo) {
    throw new Error("SESSION_SECRET não definido no ambiente.");
  }
  return new TextEncoder().encode(segredo);
}

export async function encrypt(payload: SessaoPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getChave());
}

export async function decrypt(
  token: string | undefined
): Promise<SessaoPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getChave(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.adminId !== "string") return null;
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}

export async function criarSessao(adminId: string): Promise<void> {
  const expiraEm = new Date(Date.now() + DURACAO_MS);
  const token = await encrypt({ adminId });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiraEm,
    path: "/",
  });
}

export async function lerSessao(): Promise<SessaoPayload | null> {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(COOKIE_SESSAO)?.value);
}

export async function encerrarSessao(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_SESSAO);
}
