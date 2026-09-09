# BONDFIRE — Production Operations Runbook
*Version: 1.0.0 | Incident Management & Deployment Standard*

---

## 1. Local Development & Quickstart

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 16+ (or Supabase / Cloud SQL instance)
- Redis 7+ (for real-time WebSocket pub/sub)

### Starting the Services
```bash
# 1. Run Database Migrations
psql -U postgres -d bondfire_db -f database/schema.sql
psql -U postgres -d bondfire_db -f database/seed.sql

# 2. Start Backend API & WebSocket Server
cd backend
npm install
npm run dev

# 3. Serve Frontend Web Application
# In workspace root (port 3000 or 8080):
npx -y serve -s . -p 3000
```

---

## 2. Docker & Containerization Blueprint

### Production `Dockerfile` (Backend)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

---

## 3. Incident Management Playbooks

### Scenario 1: High Latency or Dropped WebSocket Connections
1. Check Redis memory pressure: `redis-cli info memory`.
2. Inspect Fastify active connection metrics: `curl http://localhost:4000/api/health`.
3. Auto-scale WebSocket gateway instances if concurrent room sessions exceed 2,000 per node.

### Scenario 2: Failed Print-on-Demand Webhooks
1. In the database, check `orders WHERE status = 'FAILED'`.
2. Review Gelato / Prodigi API webhook logs for shipping address validation errors.
3. Trigger idempotency retry via `/api/admin/orders/:id/retry-print`.
