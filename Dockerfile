# ── builder ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma/ ./prisma/

# Generate Prisma client so TypeScript has the types during compilation
RUN npx prisma generate

COPY src/ ./src/

RUN npm run build

# ── runner ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/

# Install all deps (including prisma CLI for generate)
RUN npm ci

# Generate Prisma client for Alpine linux-musl — must run in the final stage
# so the native binary matches the runner's architecture
RUN npx prisma generate

# Prune dev deps after generate
RUN npm prune --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
