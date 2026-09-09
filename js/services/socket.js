// ==============================================================================
// WEBSOCKET CLIENT SERVICE (Real-Time Synchronous Engine)
// Handles auto-reconnection, heartbeat ping, and store state synchronization
// ==============================================================================

import { CONFIG } from '../config.js';
import { store } from '../state/store.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 10000;
    this.heartbeatInterval = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(CONFIG.WS_BASE_URL);

      this.socket.onopen = () => {
        console.log('⚡ Connected to Bondfire Real-Time WebSocket Gateway');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();

        // Join active room if one is stored
        const currentRoom = store.getState().activeRoom;
        const currentUser = store.getState().currentUser;
        if (currentRoom && currentRoom.roomCode) {
          this.send('CLIENT_JOIN_ROOM', {
            roomCode: currentRoom.roomCode,
            userId: currentUser.id,
            displayName: currentUser.displayName,
          });
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (err) {
          console.error('Error parsing incoming WebSocket packet:', err);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.warn('WebSocket warning (server may be offline, operating in resilient local mode):', err);
      };
    } catch (e) {
      console.warn('Unable to establish WebSocket, running in resilient client mode:', e);
    }
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
    } else {
      // In offline mode, simulate server response locally
      console.log(`[Offline Mode] Dispatched ${type}:`, payload);
    }
  }

  handleServerMessage(msg) {
    console.log(`[WS Event] ${msg.type}:`, msg.payload);

    switch (msg.type) {
      case 'SERVER_ROOM_STATE':
        if (msg.payload.pod) {
          const current = store.getState().activeRoom;
          store.setState({
            activeRoom: { ...current, ...msg.payload.pod },
          });
        }
        break;

      case 'SERVER_PLAYER_READY_CHANGED':
        if (msg.payload.pod) {
          const current = store.getState().activeRoom;
          store.setState({
            activeRoom: { ...current, players: msg.payload.pod.activeMembers },
          });
        }
        break;

      case 'SERVER_ROUND_STARTED':
        store.setState({
          activeGame: {
            ...store.getState().activeGame,
            roundIndex: msg.payload.session.currentRoundIndex,
            totalRounds: msg.payload.session.totalRounds,
            selectedOption: null,
            isAnswerRevealed: false,
            timeRemaining: 20,
          },
        });
        store.setView('GAME');
        break;

      case 'SERVER_EMOJI_BURST':
        // Trigger floating emoji reaction
        break;
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
      }
    }, 25000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

export const socketService = new WebSocketService();
