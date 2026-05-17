import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL nao definida. Configure .env, .env.local ou variavel de ambiente antes de iniciar o servidor.'
    )
  }
  return new PrismaClient({ log: ['error', 'warn'] })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
