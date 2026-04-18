#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
# We can use a simple netcat or just let prisma fail and retry if we want,
# but for simplicity in this script, we'll assume the db is up after some time 
# or use the healthcheck in docker-compose.

# Run migrations
echo "Running migrations..."
prisma migrate deploy

echo "Seeding demo data..."
node prisma/seed.js

# Start the application
echo "Starting application..."
exec node server.js
