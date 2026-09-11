// ==============================================================================
// PEER-TO-PEER WEBRTC FALLBACK SERVICE
// Connects clients directly via WebRTC DataChannel using free public STUN servers
// Allows real-time multiplayer without requiring a dedicated cloud WebSocket gateway
// ==============================================================================

import { store } from '../state/store.js';

export const FREE_STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];

export class P2PWebRTCService {
  constructor() {
    this.peerConnection = null;
    this.dataChannel = null;
    this.isInitiator = false;
    this.isConnected = false;
    this.onMessageCallback = null;
  }

  // Initialize P2P connection
  initPeer(isInitiator = false) {
    if (typeof window === 'undefined' || !window.RTCPeerConnection) {
      console.warn('WebRTC not supported in this browser environment');
      return null;
    }

    this.isInitiator = isInitiator;
    try {
      this.peerConnection = new RTCPeerConnection({ iceServers: FREE_STUN_SERVERS });

      if (this.isInitiator) {
        // Create data channel as room host
        this.dataChannel = this.peerConnection.createDataChannel('bondfire_mesh', {
          ordered: true,
        });
        this.setupDataChannel(this.dataChannel);
      } else {
        // Listen for incoming data channel as camper guest
        this.peerConnection.ondatachannel = (event) => {
          this.dataChannel = event.channel;
          this.setupDataChannel(this.dataChannel);
        };
      }

      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('⚡ P2P WebRTC ICE State:', this.peerConnection?.iceConnectionState);
        if (this.peerConnection?.iceConnectionState === 'connected') {
          this.isConnected = true;
        } else if (this.peerConnection?.iceConnectionState === 'disconnected' || this.peerConnection?.iceConnectionState === 'failed') {
          this.isConnected = false;
        }
      };

      return this.peerConnection;
    } catch (err) {
      console.warn('⚠️ WebRTC Peer initialization warning (non-fatal):', err);
      return null;
    }
  }

  setupDataChannel(channel) {
    channel.onopen = () => {
      console.log('🔥 P2P WebRTC Direct Mesh DataChannel OPEN!');
      this.isConnected = true;
      // Send handshake
      this.send({
        type: 'P2P_HANDSHAKE',
        user: store.getState().currentUser,
        timestamp: Date.now(),
      });
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[P2P Received]', data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
        this.handleMeshEvent(data);
      } catch (err) {
        console.error('Error parsing P2P packet:', err);
      }
    };

    channel.onclose = () => {
      console.log('P2P DataChannel Closed');
      this.isConnected = false;
    };
  }

  send(payload) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
      return true;
    }
    return false;
  }

  handleMeshEvent(data) {
    if (data.type === 'P2P_HANDSHAKE' && data.user) {
      // Add peer to active room roster if not already present
      const room = store.getState().activeRoom;
      const exists = room.players.some((p) => p.name === data.user.displayName || p.id === data.user.id);
      if (!exists) {
        const newPlayer = {
          id: data.user.id || `peer_${Date.now()}`,
          name: data.user.displayName || 'P2P Camper',
          role: 'PLAYER',
          isReady: true,
          avatar: data.user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.user.displayName || 'P2P')}`,
        };
        store.setState({
          activeRoom: {
            ...room,
            players: [...room.players, newPlayer],
          },
        });
      }
    } else if (data.type === 'P2P_SUBMIT_VOTE') {
      // Propagate live vote across mesh
      const game = store.getState().activeGame;
      store.setState({
        activeGame: {
          ...game,
          score: (game.score || 0) + (data.points || 150),
        },
      });
    }
  }

  onMessage(cb) {
    this.onMessageCallback = cb;
  }

  close() {
    if (this.dataChannel) this.dataChannel.close();
    if (this.peerConnection) this.peerConnection.close();
    this.isConnected = false;
  }
}

export const p2pMesh = new P2PWebRTCService();
