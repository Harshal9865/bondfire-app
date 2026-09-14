// ==============================================================================
// WEBSOCKET ROOM COORDINATOR
// Sub-50ms Synchronized Multiplayer State & Live Tally Broadcast
// ==============================================================================

import { WebSocket } from 'ws';
import { WSMessage } from '../types';
import { PodService } from '../services/podService';
import { GameEngine } from '../services/gameEngine';

interface ConnectedClient {
  socket: WebSocket;
  userId: string;
  roomCode: string;
  displayName: string;
}

export class RoomSocketManager {
  private static clientsByRoom = new Map<string, Set<ConnectedClient>>();

  /**
   * Registers a client connection to a room
   */
  public static handleConnection(socket: WebSocket): void {
    let currentClient: ConnectedClient | null = null;

    socket.on('message', async (rawData: string) => {
      try {
        const msg: WSMessage<any> = JSON.parse(rawData);

        switch (msg.type) {
          case 'CLIENT_JOIN_ROOM': {
            const { roomCode, userId, displayName } = msg.payload;
            currentClient = { socket, userId, roomCode: roomCode.toUpperCase(), displayName };

            if (!this.clientsByRoom.has(currentClient.roomCode)) {
              this.clientsByRoom.set(currentClient.roomCode, new Set());
            }
            this.clientsByRoom.get(currentClient.roomCode)!.add(currentClient);

            // Register in PodService
            const pod = PodService.joinPod(currentClient.roomCode, userId, displayName);

            // Broadcast updated room state
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_ROOM_STATE',
              payload: { pod },
              timestamp: Date.now(),
            });
            break;
          }

          case 'CLIENT_TOGGLE_READY': {
            if (!currentClient) return;
            PodService.togglePlayerReady(currentClient.roomCode, currentClient.userId);
            const pod = PodService.getPodByRoomCode(currentClient.roomCode);

            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_PLAYER_READY_CHANGED',
              payload: { pod, userId: currentClient.userId },
              timestamp: Date.now(),
            });
            break;
          }

          case 'CLIENT_HOST_START_GAME': {
            if (!currentClient) return;
            const pod = PodService.getPodByRoomCode(currentClient.roomCode);
            if (!pod) return;

            const session = GameEngine.startSession(pod.id, currentClient.userId);
            const activeRound = GameEngine.getActiveRound(session.id);

            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_ROUND_STARTED',
              payload: { session, activeRound },
              timestamp: Date.now(),
            });
            break;
          }

          case 'CLIENT_CAST_VOTE': {
            if (!currentClient) return;
            const { roundId, selectedOption, responseTimeMs } = msg.payload;
            const result = GameEngine.castVote(roundId, currentClient.userId, selectedOption, responseTimeMs);

            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_VOTE_RECORDED',
              payload: {
                userId: currentClient.userId,
                displayName: currentClient.displayName,
                points: result.points,
                isCorrect: result.isCorrect,
              },
              timestamp: Date.now(),
            });
            break;
          }

          case 'CLIENT_HOST_NEXT_ROUND': {
            if (!currentClient) return;
            const { sessionId } = msg.payload;
            const { session, isGameOver } = GameEngine.nextRound(sessionId);

            if (isGameOver) {
              const scores = GameEngine.getSessionScores(sessionId);
              this.broadcastToRoom(currentClient.roomCode, {
                type: 'SERVER_GAME_OVER',
                payload: { session, scores },
                timestamp: Date.now(),
              });
            } else if (session) {
              const activeRound = GameEngine.getActiveRound(session.id);
              this.broadcastToRoom(currentClient.roomCode, {
                type: 'SERVER_ROUND_STARTED',
                payload: { session, activeRound },
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'CLIENT_EMOJI_REACTION': {
            if (!currentClient) return;
            const { emoji } = msg.payload;
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_EMOJI_BURST',
              payload: { emoji, fromUser: currentClient.displayName },
              timestamp: Date.now(),
            });
            break;
          }

          // 2.0 SHOW RUNNER ADVANCE
          case 'CLIENT_SHOW_RUNNER_ADVANCE': {
            if (!currentClient) return;
            const { sessionId, nextStep } = msg.payload;
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_SHOW_RUNNER_STEP',
              payload: { sessionId, step: nextStep },
              timestamp: Date.now(),
            });
            break;
          }

          // 2.0 PRIVATE PANIC BUTTON TRIGGER (ANONYMOUS PROMPT REPLACEMENT)
          case 'CLIENT_TRIGGER_PANIC_BUTTON': {
            if (!currentClient) return;
            const { roomSessionId, flagType, promptId, tone } = msg.payload;
            const { HumorEngineService } = await import('../services/humorEngine');
            const result = HumorEngineService.flagPrompt(
              roomSessionId,
              currentClient.userId,
              flagType || 'TOO_PERSONAL',
              promptId,
              tone
            );

            // Broadcast replacement prompt to room anonymously (never reveals who flagged it)
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_PROMPT_SWAPPED',
              payload: {
                reason: 'A camper requested a softer card',
                substitutePrompt: result.substitutePrompt,
              },
              timestamp: Date.now(),
            });
            break;
          }

          // 2.0 LIVE SOUNDBOARD BLAST
          case 'CLIENT_SOUNDBOARD_TRIGGER': {
            if (!currentClient) return;
            const { soundCue } = msg.payload; // 'buzzer' | 'fanfare' | 'drumroll' | 'crickets'
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_SOUNDBOARD_PLAY',
              payload: { soundCue, triggeredBy: currentClient.displayName },
              timestamp: Date.now(),
            });
            break;
          }

          // 2.0 WATCH-AND-PLAY SYNCHRONIZED PAUSE
          case 'CLIENT_WATCH_PLAY_SYNC': {
            if (!currentClient) return;
            const { cardId, currentTime, isPaused } = msg.payload;
            this.broadcastToRoom(currentClient.roomCode, {
              type: 'SERVER_WATCH_PLAY_SYNCED',
              payload: { cardId, currentTime, isPaused },
              timestamp: Date.now(),
            });
            break;
          }
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    socket.on('close', () => {
      if (currentClient) {
        const roomSet = this.clientsByRoom.get(currentClient.roomCode);
        if (roomSet) {
          roomSet.delete(currentClient);
          if (roomSet.size === 0) {
            this.clientsByRoom.delete(currentClient.roomCode);
          }
        }
      }
    });
  }

  /**
   * Broadcasts a JSON message to all clients connected to a room
   */
  public static broadcastToRoom(roomCode: string, message: WSMessage<any>): void {
    const clients = this.clientsByRoom.get(roomCode.toUpperCase());
    if (!clients) return;

    const payloadStr = JSON.stringify(message);
    for (const client of clients) {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(payloadStr);
      }
    }
  }
}
