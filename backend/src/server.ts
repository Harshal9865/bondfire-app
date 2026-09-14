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

  // Create Room (POST /api/rooms/start)
  app.post<{ Body: { name: string; template: string; hostName: string; avatarUrl?: string } }>(
    '/api/rooms/start',
    async (req, reply) => {
      const { name, template, hostName, avatarUrl } = req.body;
      if (!name || !hostName) {
        return reply.status(400).send({ error: 'Name and HostName are required' });
      }

      const hostUserId = `usr_${Date.now()}`;
      // In a full DB implementation, this would create a pod associated with a group
      const pod = PodService.createPod(name, template || 'SQUAD', hostUserId, hostName, avatarUrl);
      return reply.status(201).send({ room: pod, hostUserId });
    }
  );

  // Get Room by Code (GET /api/rooms/:code)
  app.get<{ Params: { code: string } }>('/api/rooms/:code', async (req, reply) => {
    const pod = PodService.getPodByRoomCode(req.params.code);
    if (!pod) {
      return reply.status(404).send({ error: 'Room code not found or expired' });
    }
    return { room: pod };
  });

  // Join Room via REST (POST /api/rooms/join)
  app.post<{ Body: { code: string; displayName: string; avatarUrl?: string } }>(
    '/api/rooms/join',
    async (req, reply) => {
      const { code, displayName, avatarUrl } = req.body;
      if (!code || !displayName) {
        return reply.status(400).send({ error: 'Room code and DisplayName are required' });
      }
      const guestUserId = `usr_guest_${Date.now()}`;
      const pod = PodService.joinPod(code, guestUserId, displayName, avatarUrl);
      if (!pod) {
        return reply.status(404).send({ error: 'Room not found' });
      }
      return { room: pod, userId: guestUserId };
    }
  );

  // Get Group Lore & Memory Graph (GET /api/groups/:id/lore)
  app.get<{ Params: { id: string } }>('/api/groups/:id/lore', async (req, reply) => {
    return { 
      groupId: req.params.id,
      lore: [
        { title: 'The Goa Trip That Was Supposed to Be Relaxing', date: '2025-10-15', moments: ['Lost keys at beach shack', 'Kabir ordered 14 rotis'] },
        { title: 'Hostel Room 304 Maggi Incident', date: '2025-12-31', moments: ['Kettle blew up at 3 AM', 'Smuggled through security'] }
      ],
      nodes: [
        { id: 'node_1', category: 'QUOTES', title: 'Maine pehle hi bola tha', contextSnippet: 'Aarav at 2:00 AM before train departure', status: 'APPROVED' },
        { id: 'node_2', category: 'FOOD', title: 'Biryani vs Pulao World War', contextSnippet: '3 hour heated debate in group chat', status: 'APPROVED' },
        { id: 'node_3', category: 'RUNNING_JOKES', title: '5 Mins Away Guy', contextSnippet: 'Still drying hair in towel', status: 'APPROVED' }
      ]
    };
  });

  // 2.0 ROOM OS: Start Hosted Show Runner Session (POST /api/rooms/show-runner/start)
  app.post<{ Body: { roomCode: string; hostUserId: string; template?: string; humorTone?: string; language?: string } }>(
    '/api/rooms/show-runner/start',
    async (req, reply) => {
      const { roomCode, hostUserId, template, humorTone, language } = req.body;
      const { ShowRunnerService } = await import('./services/showRunner');
      const session = ShowRunnerService.startSession(
        roomCode,
        hostUserId,
        (template as any) || 'SQUAD_NIGHT',
        (humorTone as any) || 'FRIENDLY_ROAST',
        language || 'hi-IN'
      );
      return { session, currentStep: session.steps[0] };
    }
  );

  // 2.0 ROOM OS: Advance Show Runner Step (POST /api/rooms/show-runner/advance)
  app.post<{ Body: { sessionId: string } }>('/api/rooms/show-runner/advance', async (req, reply) => {
    const { sessionId } = req.body;
    const { ShowRunnerService } = await import('./services/showRunner');
    const result = ShowRunnerService.advanceStep(sessionId);
    if (!result.session) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return result;
  });

  // 2.0 HUMOR CONSENT: Anonymous Panic Button (POST /api/humor/flag)
  app.post<{ Body: { roomSessionId: string; playerUserId: string; flagType: string; promptId: string; tone?: string } }>(
    '/api/humor/flag',
    async (req, reply) => {
      const { roomSessionId, playerUserId, flagType, promptId, tone } = req.body;
      const { HumorEngineService } = await import('./services/humorEngine');
      const result = HumorEngineService.flagPrompt(
        roomSessionId,
        playerUserId,
        (flagType as any) || 'TOO_PERSONAL',
        promptId,
        (tone as any) || 'FRIENDLY_ROAST'
      );
      return result;
    }
  );

  // 2.0 WATCH-AND-PLAY FEED (GET /api/watch-play/feed)
  app.get('/api/watch-play/feed', async () => {
    return {
      cards: [
        {
          id: 'wp_1',
          cardType: 'REEL_COURT',
          title: 'The "5 Minutes Away" Hearing',
          creatorName: 'Rohan Joshi & Friends',
          creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-sitting-on-a-curb-and-talking-41584-large.mp4',
          pauseTimestampSeconds: 8.5,
          promptQuestion: 'Defendant sent: "Bas signal pe hoon!". Where is she actually?',
          options: [
            { id: 'opt_1', label: 'Still in bed scrolling Reels', isCorrect: true },
            { id: 'opt_2', label: 'In an Uber on expressway', isCorrect: false },
            { id: 'opt_3', label: 'Looking for missing shoes', isCorrect: false },
            { id: 'opt_4', label: 'Genuinely at the signal', isCorrect: false }
          ],
          likesCount: 1420
        },
        {
          id: 'wp_2',
          cardType: 'COMPLETE_THE_LYRIC',
          title: 'Late Night Road Trip Antakshari',
          creatorName: 'Campfire Music Squad',
          creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CampfireMusic',
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-people-singing-in-a-car-42777-large.mp4',
          pauseTimestampSeconds: 12.0,
          promptQuestion: 'Complete the next iconic line from Ilahi (YJHD):',
          options: [
            { id: 'opt_1', label: 'Mera safar, le chal mujhe wahan', isCorrect: false },
            { id: 'opt_2', label: 'Shaamein malang si, raatein surmayi', isCorrect: true },
            { id: 'opt_3', label: 'Badalon ke aage ek naya aasmaan', isCorrect: false },
            { id: 'opt_4', label: 'Subah ki dhoop mein rang doon zameen', isCorrect: false }
          ],
          likesCount: 2890
        }
      ]
    };
  });

  // Start Session / Mock Game Deck (POST /api/rooms/session/start)
  app.post<{ Body: { roomId: string; hostUserId: string } }>('/api/rooms/session/start', async (req, reply) => {
    const { roomId, hostUserId } = req.body;
    const session = GameEngine.startSession(roomId, hostUserId);
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
