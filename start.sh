#!/bin/sh

echo "Starting application..."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set"
    exit 1
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma db push --accept-data-loss || echo "Warning: Could not apply migrations"

echo "Starting nginx..."
nginx -g "daemon off;" &

echo "Starting Next.js server..."
exec node server.js
