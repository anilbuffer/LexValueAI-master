#!/bin/sh
set -e

# Assemble DATABASE_URL from the injected DB_* vars (RDS-managed secret) so the
# Prisma CLI can reach RDS. Password is URL-encoded to stay connection-safe.
if [ -z "$DATABASE_URL" ] && [ -n "$DB_HOST" ]; then
  DATABASE_URL="$(node -e 'const e=encodeURIComponent;const p=process.env;console.log(`postgresql://${e(p.DB_USERNAME||"")}:${e(p.DB_PASSWORD||"")}@${p.DB_HOST}:${p.DB_PORT||"5432"}/${p.DB_NAME}?sslmode=no-verify`)')"
  export DATABASE_URL
fi

echo "[entrypoint] Syncing database schema..."
PRISMA_BIN="$(node -e 'const path=require("path");const pkg=require("prisma/package.json");const bin=typeof pkg.bin==="string"?pkg.bin:pkg.bin.prisma;console.log(path.join(path.dirname(require.resolve("prisma/package.json")),bin))')"
node "$PRISMA_BIN" db push --accept-data-loss



echo "[entrypoint] Starting Next.js server..."
exec "$@"
