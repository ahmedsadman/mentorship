#!/bin/bash

while ! nc -z "$DB_HOST" "$DB_PORT"; do
    echo "Waiting for DB to be available..."
    sleep 2
done

echo "Starting server..."
bun run db::migrate
echo Migration complete


if [ "$NODE_ENV" = "production" ]; then
    bun run src/index.ts
else
    bun run dev
fi
