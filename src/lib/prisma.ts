import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
// Force recreate client to pick up schema changes (v2)
globalForPrisma.prisma = undefined;

// Prefer an explicit DATABASE_URL (local dev / migrations). In production on
// ECS the DB credentials come from the RDS-managed Secrets Manager secret,
// injected as DB_USERNAME/DB_PASSWORD, and the URL is assembled here so
// automatic password rotation is picked up on each new task start.
function getConnectionString(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const user = encodeURIComponent(process.env.DB_USERNAME ?? '')
  const password = encodeURIComponent(process.env.DB_PASSWORD ?? '')
  const host = process.env.DB_HOST ?? ''
  const port = process.env.DB_PORT ?? '5432'
  const name = process.env.DB_NAME ?? ''
  return `postgresql://${user}:${password}@${host}:${port}/${name}?sslmode=no-verify`
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ connectionString: getConnectionString() })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({ connectionString: getConnectionString() })
    const adapter = new PrismaPg(pool)
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
// Trigger reload to pick up new schema changes (v4)
