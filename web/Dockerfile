# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package.json ONLY to avoid platform-specific lockfile issues
COPY package.json ./
COPY prisma ./prisma/

# Fresh install for Linux x64 - this is crucial for lightningcss and swc
RUN npm install --platform=linux --arch=x64
# Manually ensure the binary that is failing is present
RUN npm install lightningcss-linux-x64-gnu --platform=linux --arch=x64

# Copy source code
COPY . .

# Use .env.example for build time configuration
RUN cp .env.example .env

# Generate Prisma Client and build the application
RUN npx prisma generate
RUN npm run build

# Stage 2: Production image
FROM node:20-slim AS runner

# Install runtime dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set production environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Copy standalone build and static assets
# In standalone mode, Next.js server looks for .next/static and public folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Setup entrypoint, Prisma and environment
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
RUN npm install -g prisma

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
