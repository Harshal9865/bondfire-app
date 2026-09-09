// ==============================================================================
// BONDFIRE BACKEND API SERVER (Fastify + WebSockets + Security Middleware)
// ==============================================================================

import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyWebsocket from '@fastify/websocket';

import { env } from './config/env';
import { PodService } from './services/podService';
import { GameEngine } from './services/gameEngine';
import { RoomSocketManager } from './websocket/roomSocket';

const app = fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function bootstrap() {
  // 1. Security Headers (Helmet)
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false, // Managed by client reverse proxy
  });

  // 2. CORS Handling
  await app.register(fastifyCors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // 3. Rate Limiting
  await app.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
  });

  // 4. WebSocket Engine
  await app.register(fastifyWebsocket);

  app.get('/ws', { websocket: true }, (connection) => {
    RoomSocketManager.handleConnection(connection.socket);
  });

  // ============================================================================
  // REST API ROUTES
  // ============================================================================

  // Health Check
  app.get('/api/health', async () => ({
    status: 'healthy',
    service: 'bondfire-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));

  // Create Pod (POST /api/pods)
  app.post<{ Body: { name: string; type: 'SOLO' | 'COUPLE' | 'SQUAD'; hostName: string; avatarUrl?: string } }>(
    '/api/pods',
    async (req, reply) => {
      const { name, type, hostName, avatarUrl } = req.body;
      if (!name || !hostName) {
        return reply.status(400).send({ error: 'Name and HostName are required' });
      }

      const hostUserId = `usr_${Date.now()}`;
      const pod = PodService.createPod(name, type || 'SQUAD', hostUserId, hostName, avatarUrl);
      return reply.status(201).send({ pod, hostUserId });
    }
  );

  // Get Pod by Room Code (GET /api/pods/:code)
  app.get<{ Params: { code: string } }>('/api/pods/:code', async (req, reply) => {
    const pod = PodService.getPodByRoomCode(req.params.code);
    if (!pod) {
      return reply.status(404).send({ error: 'Room code not found or expired' });
    }
    return { pod };
  });

  // Join Pod via REST (POST /api/pods/:code/join)
  app.post<{ Params: { code: string }; Body: { displayName: string; avatarUrl?: string } }>(
    '/api/pods/:code/join',
    async (req, reply) => {
      const { displayName, avatarUrl } = req.body;
      const guestUserId = `usr_guest_${Date.now()}`;
      const pod = PodService.joinPod(req.params.code, guestUserId, displayName, avatarUrl);
      if (!pod) {
        return reply.status(404).send({ error: 'Room not found' });
      }
      return { pod, userId: guestUserId };
    }
  );

  // Seed / Mock Game Deck (POST /api/game/start)
  app.post<{ Body: { podId: string; hostUserId: string } }>('/api/game/start', async (req, reply) => {
    const { podId, hostUserId } = req.body;
    const session = GameEngine.startSession(podId, hostUserId);
    const activeRound = GameEngine.getActiveRound(session.id);
    return { session, activeRound };
  });

  // Start Server
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`🔥 Bondfire Backend Server listening on http://${env.HOST}:${env.PORT}`);
    console.log(`⚡ WebSocket stream available at ws://${env.HOST}:${env.PORT}/ws`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
