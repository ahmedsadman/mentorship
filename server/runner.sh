#!/bin/bash

while ! nc -z "$DB_HOST" "$DB_PORT"; do
    echo "Waiting for DB to be available..."
    sleep 2
done

echo "Starting server..."
bun run db::migrate
echo Done...Test PR
bun run src/index.ts
