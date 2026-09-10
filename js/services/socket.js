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
  }

  connect() {
    if (!CONFIG.WS_BASE_URL) {
      if (!this.hasLoggedMeshMode) {
        this.hasLoggedMeshMode = true;
        console.log('⚡ Bondfire operating in resilient local mesh mode with WebRTC P2P fallback.');
        p2pMesh.initPeer(store.getState().activeRoom?.isHost ?? false);
      }
      return;
    }

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
        if (this.reconnectAttempts < 2) {
          this.scheduleReconnect();
        } else if (!this.hasLoggedMeshMode) {
          this.hasLoggedMeshMode = true;
          console.log('⚡ Bondfire operating in resilient local mesh mode.');
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
      console.log(`[Mesh Mode] Dispatched ${type}:`, payload);
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
