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

    // Live Squad Voice Mesh State
    this.localAudioStream = null;
    this.isVoiceActive = false;
    this.isMuted = false;
    this.isDeafened = false;
    this.remoteAudioElements = new Map();
    this.speakingListeners = new Set();
    this.voiceStateListeners = new Set();
    this.audioContext = null;
    this.analyser = null;
    this.vadInterval = null;
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

      // Handle incoming remote audio stream from peer campers
      this.peerConnection.ontrack = (event) => {
        console.log('🎙️ Incoming squad peer audio track received!');
        if (event.streams && event.streams[0]) {
          this.attachRemoteAudioStream(event.streams[0]);
        }
      };

      // Add existing local microphone track if voice was already activated
      if (this.localAudioStream) {
        this.localAudioStream.getAudioTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localAudioStream);
        });
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
          avatar: data.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user.displayName || 'P2P')}`,
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
    } else if (data.type === 'P2P_VOICE_SPEAKING') {
      this.notifySpeaking(data.userId, data.userName, data.isSpeaking);
    } else if (data.type === 'P2P_VOICE_MUTE') {
      console.log(`🎙️ [P2P Voice] Camper ${data.userName} mute status: ${data.isMuted}`);
    }
  }

  // Voice Controls & Activity Detection
  async startVoiceStream() {
    if (this.isVoiceActive) return true;
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.localAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });

        this.isVoiceActive = true;
        this.isMuted = false;

        // If peer connection exists, add tracks
        if (this.peerConnection) {
          this.localAudioStream.getAudioTracks().forEach((track) => {
            this.peerConnection.addTrack(track, this.localAudioStream);
          });
        }

        this.setupVoiceActivityDetection();
        this.notifyVoiceState();
        return true;
      }
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      return false;
    }
    return false;
  }

  stopVoiceStream() {
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach((t) => t.stop());
      this.localAudioStream = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch {}
      this.audioContext = null;
    }
    this.isVoiceActive = false;
    this.notifyVoiceState();
  }

  toggleMute() {
    if (!this.localAudioStream) return false;
    this.isMuted = !this.isMuted;
    this.localAudioStream.getAudioTracks().forEach((track) => {
      track.enabled = !this.isMuted;
    });

    const user = store.getState().currentUser;
    this.send({
      type: 'P2P_VOICE_MUTE',
      userId: user?.id,
      userName: user?.displayName || 'Camper',
      isMuted: this.isMuted,
    });

    this.notifyVoiceState();
    return this.isMuted;
  }

  toggleDeafen() {
    this.isDeafened = !this.isDeafened;
    this.remoteAudioElements.forEach((audioEl) => {
      audioEl.muted = this.isDeafened;
    });
    this.notifyVoiceState();
    return this.isDeafened;
  }

  setupVoiceActivityDetection() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass || !this.localAudioStream) return;

      this.audioContext = new AudioContextClass();
      const source = this.audioContext.createMediaStreamSource(this.localAudioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let wasSpeaking = false;

      this.vadInterval = setInterval(() => {
        if (!this.isVoiceActive || this.isMuted) {
          if (wasSpeaking) {
            wasSpeaking = false;
            this.broadcastSpeaking(false);
          }
          return;
        }

        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const isSpeakingNow = average > 25;

        if (isSpeakingNow !== wasSpeaking) {
          wasSpeaking = isSpeakingNow;
          this.broadcastSpeaking(wasSpeaking);
        }
      }, 120);
    } catch (err) {
      console.warn('Voice Activity Detection notice:', err);
    }
  }

  broadcastSpeaking(isSpeaking) {
    const user = store.getState().currentUser;
    const userName = user?.displayName || 'You';
    const userId = user?.id || 'usr_self';

    this.notifySpeaking(userId, userName, isSpeaking);

    this.send({
      type: 'P2P_VOICE_SPEAKING',
      userId,
      userName,
      isSpeaking,
    });
  }

  attachRemoteAudioStream(stream) {
    let audioEl = document.getElementById('webrtc-remote-audio');
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'webrtc-remote-audio';
      audioEl.autoplay = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.muted = this.isDeafened;
    audioEl.play().catch((err) => console.warn('Autoplay audio allowed after user gesture:', err));
  }

  onSpeaking(listener) {
    this.speakingListeners.add(listener);
    return () => this.speakingListeners.delete(listener);
  }

  notifySpeaking(userId, userName, isSpeaking) {
    for (const listener of this.speakingListeners) {
      try {
        listener({ userId, userName, isSpeaking });
      } catch (err) {
        console.error('Error in speaking listener:', err);
      }
    }
  }

  onVoiceState(listener) {
    this.voiceStateListeners.add(listener);
    return () => this.voiceStateListeners.delete(listener);
  }

  notifyVoiceState() {
    for (const listener of this.voiceStateListeners) {
      try {
        listener({
          isVoiceActive: this.isVoiceActive,
          isMuted: this.isMuted,
          isDeafened: this.isDeafened,
        });
      } catch (err) {
        console.error('Error in voice state listener:', err);
      }
    }
  }

  onMessage(cb) {
    this.onMessageCallback = cb;
  }

  close() {
    this.stopVoiceStream();
    if (this.dataChannel) this.dataChannel.close();
    if (this.peerConnection) this.peerConnection.close();
    this.isConnected = false;
  }
}

export const p2pMesh = new P2PWebRTCService();
