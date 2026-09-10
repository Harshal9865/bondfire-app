// ==============================================================================
// WEBSOCKET CLIENT SERVICE (Real-Time Synchronous Engine)
// Handles auto-reconnection, heartbeat ping, and store state synchronization
// ==============================================================================

import { CONFIG } from '../config.js';
import { store } from '../state/store.js';
import { p2pMesh } from './webrtcService.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 10000;
    this.heartbeatInterval = null;
    this.isConnected = false;
    this.hasLoggedError = false;
    this.hasLoggedMeshMode = false;
    this.probeInFlight = false;
    // Opt-in verbose mesh logging only (prevents console spam in production mesh mode)
    this.debug = false;
    try {
      this.debug =
        (typeof localStorage !== 'undefined' && localStorage.getItem('BONDFIRE_DEBUG') === '1') ||
        (typeof window !== 'undefined' && window.location.search.includes('debug=1'));
    } catch (e) {
      this.debug = false;
    }
  }

  // Verify the backend is actually reachable before opening a socket.
  // `new WebSocket()` failures print native browser console errors that JS
  // cannot suppress, so a `/api/health` preflight keeps the console clean
  // when the app runs in static-only hosting (Vercel) or backend is down.
  async checkBackendHealth() {
    try {
      if (typeof fetch === 'undefined') return false;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${CONFIG.API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return false;
      const data = await res.json();
      return data && (data.status === 'healthy' || data.service === 'bondfire-api');
    } catch (e) {
      return false;
    }
  }

  enterMeshMode(reason) {
    if (!this.hasLoggedMeshMode) {
      this.hasLoggedMeshMode = true;
      console.log('⚡ Bondfire operating in resilient local mesh mode with WebRTC P2P fallback.');
      p2pMesh.initPeer(store.getState().activeRoom?.isHost ?? false);
    }
    if (this.debug && reason) console.debug(`[Mesh Mode] reason: ${reason}`);
  }

  async connect() {
    if (!CONFIG.WS_BASE_URL) {
      this.enterMeshMode('no WS_BASE_URL configured');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Avoid stacking parallel health probes on re-renders / hash changes
    if (this.probeInFlight) return;
    this.probeInFlight = true;

    try {
      const backendAlive = await this.checkBackendHealth();
      if (!backendAlive) {
        this.enterMeshMode('backend health check failed');
        return;
      }
      this.openSocket();
    } finally {
      this.probeInFlight = false;
    }
  }

  openSocket() {
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
        if (this.reconnectAttempts < 2) {
          this.scheduleReconnect();
        } else {
          this.enterMeshMode('websocket retries exhausted');
        }
      };

      this.socket.onerror = () => {
        if (!this.hasLoggedError) {
          this.hasLoggedError = true;
          console.info('ℹ️ WebSocket server offline; engaging peer-to-peer WebRTC mesh fallback.');
          p2pMesh.initPeer(store.getState().activeRoom?.isHost ?? false);
        }
      };
    } catch (e) {
      if (!this.hasLoggedError) {
        this.hasLoggedError = true;
        console.info('ℹ️ Running in resilient client-first mode with WebRTC P2P fallback.');
        p2pMesh.initPeer(store.getState().activeRoom?.isHost ?? false);
      }
    }
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
    } else {
      // In offline mode, forward through P2P WebRTC data channel if active
      if (p2pMesh.isConnected) {
        p2pMesh.send({ type, payload, timestamp: Date.now() });
      }
      // Verbose mesh dispatch logging is opt-in only (BONDFIRE_DEBUG=1 / ?debug=1)
      if (this.debug) console.debug(`[Mesh Mode] Dispatched ${type}:`, payload);
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
    if (!CONFIG.WS_BASE_URL) return;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

export const socketService = new WebSocketService();
