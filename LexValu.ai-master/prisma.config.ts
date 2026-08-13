import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    // Use DATABASE_URL when set (e.g. targeting RDS for schema push);
    // otherwise fall back to the local dev database.
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:root@localhost:5432/lex_value?schema=public",
  },
})
