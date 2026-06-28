import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSenha } from "../src/lib/auth/password";

// Cria (ou atualiza a senha de) o usuário admin do painel a partir das variáveis
// ADMIN_EMAIL / ADMIN_PASSWORD do .env. Conecta direto (DIRECT_URL) como o seed.
// Rodar com: npm run admin:criar

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;

  if (!email || !senha) {
    throw new Error(
      "Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar este script."
    );
  }
  if (senha.length < 6) {
    throw new Error("ADMIN_PASSWORD deve ter pelo menos 6 caracteres.");
  }

  const senhaHash = await hashSenha(senha);
  const admin = await prisma.usuarioAdmin.upsert({
    where: { email },
    update: { senhaHash },
    create: { email, senhaHash, nome: "Administrador" },
  });

  console.log(`✅ Admin pronto: ${admin.email} (id ${admin.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao criar admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
