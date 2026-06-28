import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Proxy (era "middleware" antes do Next 16): verificação OTIMISTA da sessão do
// admin. Roda antes da requisição e só lê/valida o cookie — a checagem real fica
// na DAL (verificarSessao) de cada page/action. Aqui só fazemos o redirect rápido.
//
// Não importamos src/lib/auth/session.ts porque ele é "server-only" (usa
// next/headers). O nome do cookie precisa bater com COOKIE_SESSAO de lá.
const COOKIE_SESSAO = "hangar.admin.sessao";

async function sessaoValida(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const segredo = process.env.SESSION_SECRET;
  if (!segredo) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(segredo),
      { algorithms: ["HS256"] }
    );
    return typeof payload.adminId === "string";
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ehLogin = pathname === "/admin/login";
  const token = req.cookies.get(COOKIE_SESSAO)?.value;
  const autenticado = await sessaoValida(token);

  // Sem sessão tentando entrar no painel → manda pro login.
  if (!autenticado && !ehLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Já logado e indo pro login → manda pro painel.
  if (autenticado && ehLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
