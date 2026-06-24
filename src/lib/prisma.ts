import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 usa driver adapters. Em runtime conectamos via DATABASE_URL
// (conexão pooled do Supabase). As migrations usam DIRECT_URL (ver prisma.config.ts).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Singleton: evita criar várias conexões no hot-reload do Next em desenvolvimento.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
