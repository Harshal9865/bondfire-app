# ==============================================================================
# BACKEND MULTI-STAGE PRODUCTION DOCKERFILE
# Stage 1: Build TypeScript source | Stage 2: Minimal Node.js 20 runtime
# ==============================================================================

# STAGE 1: BUILDER
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker caching
COPY package*.json ./
RUN npm ci

# Copy TypeScript source and configurations
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript in /dist
RUN npm run build

# STAGE 2: RUNNER
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Create unprivileged user for security hardening
USER node

EXPOSE 4000

CMD ["node", "dist/server.js"]
