#!/bin/sh
set -e

echo "[entrypoint] Waiting for database..."
i=0
until node -e "const{PrismaClient}=require('@prisma/client');new PrismaClient().\$queryRaw\`SELECT 1\`.then(()=>process.exit(0)).catch(()=>process.exit(1))" 2>/dev/null; do
  i=$((i+1))
  if [ $i -ge 30 ]; then
    echo "[entrypoint] Database wait timed out after 60s"
    exit 1
  fi
  echo "[entrypoint] DB not ready yet (attempt $i/30), retrying..."
  sleep 2
done
echo "[entrypoint] Database is ready."

echo "[entrypoint] Running migrations..."
prisma migrate deploy

echo "[entrypoint] Running seed..."
if node prisma/seed.js; then
  echo "[entrypoint] Seed completed successfully."
else
  echo "[entrypoint] Seed FAILED (exit $?). Continuing anyway."
fi

echo "[entrypoint] Starting application..."
exec node server.js
