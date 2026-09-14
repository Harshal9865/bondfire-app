// ==============================================================================
// REACTIVE STORE & SESSION RECOVERY MANAGER
// Guarantees zero lost game state on page refresh or tab re-opening
// ==============================================================================

import { CONFIG, generateRoomCode } from '../config.js';

class ReactiveStore {
  constructor() {
    this.listeners = new Set();
    this.emptyRoomTimeout = null;
    this.emptyTimeoutMs = 2 * 60 * 1000; // 2 minutes (120,000 ms)
    this.state = this.loadInitialState();

    // Check if loaded room was left empty and resume 2-minute deletion countdown
    if (this.state.activeRoom?.emptySince && (!this.state.activeRoom.players || this.state.activeRoom.players.length === 0)) {
      const remainingMs = Math.max(100, (this.state.activeRoom.scheduledDeletionAt || (this.state.activeRoom.emptySince + this.emptyTimeoutMs)) - Date.now());
      this.handleEmptyRoomDetected(remainingMs);
    }

    // Listen for cross-tab storage synchronization
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === CONFIG.STORAGE_KEY_SESSION && e.newValue) {
          try {
            this.state = JSON.parse(e.newValue);
            this.applySettingsEffects();
            this.notify();
          } catch (err) {
            console.error('Cross-tab sync error:', err);
          }
        } else if (e.key === CONFIG.STORAGE_KEY_SETTINGS && e.newValue) {
          try {
            const newSettings = JSON.parse(e.newValue);
            this.state = { ...this.state, settings: { ...this.getDefaultSettings(), ...newSettings } };
            this.applySettingsEffects();
            this.notify();
          } catch (err) {
            console.error('Cross-tab settings sync error:', err);
          }
        }
      });
    }

    this.applySettingsEffects();
  }

  getDefaultGuestUser() {
    return {
      id: `guest_${Date.now()}`,
      displayName: 'Guest Citizen',
      email: '',
      avatarUrl: '',
      isLoggedIn: false,
      isHost: false,
      tier: 'FREE',
      sparks: 50,
      joinedDate: 'Today',
      stats: {
        gamesHosted: 0,
        memoriesArchived: 0,
        yearbooksPrinted: 0,
        roastsWon: 0,
      },
      privacy: {
        piiRedaction: true,
        privateVault: false,
        faceBlur: false,
      },
      pods: [],
    };
  }

  getDefaultFriendsList() {
    return [];
  }

  getDefaultSquadsList() {
    return [];
  }

  getDefaultFriendRequests() {
    return {
      incoming: [],
      outgoing: [],
    };
  }

  getDefaultMemoryGraphNodes() {
    return [];
  }

  getDefaultWeeklyMission() {
    return {
      weekNumber: 42,
      title: 'Upload 1 Photo or Screenshot from this week',
      subtitle: 'Unlock next Friday’s Squad Night game deck instantly!',
      submissionType: 'PHOTO',
      isCompleted: false,
    };
  }

  getDefaultSettings() {
    return {
      masterVolume: 80, // 0 - 100
      sfxEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
      cyberGlowIntensity: 'FULL', // 'FULL' | 'BALANCED' | 'MINIMAL'
      reducedMotion: false,
      keepScreenAwake: false,
      themeAccent: 'AMBER_GOLD', // 'AMBER_GOLD' | 'SUNSET_CORAL' | 'MINT_GREEN' | 'CYBER_NEON' | 'VIOLET_DREAM'
      defaultShotClock: 20, // 15 | 20 | 30 | 45
      autoAdvanceRounds: true,
      humorSensitivity: 'FRIENDLY_ROAST', // 'FAMILY_SAFE' | 'FRIENDLY_ROAST' | 'SAVAGE_ROAST'
      profanityFilter: false,
      ephemeralRoomMode: false,
      piiRedaction: true,
      language: 'en-US', // 'en-US' | 'hi-IN' | 'hinglish'
    };
  }

  getDefaultAlbumMemories() {
    return [];
  }

  loadInitialState() {
    let savedSettings = null;
    if (typeof localStorage !== 'undefined') {
      try {
        const rawSettings = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
        if (rawSettings) savedSettings = JSON.parse(rawSettings);
      } catch (_) {}
    }

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SESSION);
        if (saved) {
          const parsed = JSON.parse(saved);
          // If legacy hardcoded prototype user exists, reset to clean guest state
          if (parsed.currentUser && (parsed.currentUser.email === 'maya@bondfire.app' || parsed.currentUser.displayName === 'Maya Lin')) {
            parsed.currentUser = this.getDefaultGuestUser();
          }
          if (parsed.activeRoom) {
            if (parsed.activeRoom.roomCode === 'FIRE' || !parsed.activeRoom.roomCode) {
              parsed.activeRoom.roomCode = generateRoomCode();
            }
            if (!parsed.activeRoom.selectedGameMode) {
              parsed.activeRoom.selectedGameMode = 'OUR_LORE';
            }
            if (!parsed.activeRoom.roomTemplate) {
              parsed.activeRoom.roomTemplate = 'SQUAD_NIGHT';
            }
            if (!parsed.activeRoom.humorTone) {
              parsed.activeRoom.humorTone = 'FRIENDLY_ROAST';
            }
            if (!parsed.activeRoom.language) {
              parsed.activeRoom.language = 'hi-IN';
            }
            const emptySince = parsed.activeRoom.emptySince;
            const scheduledDeletionAt = parsed.activeRoom.scheduledDeletionAt;
            const isExpired = (emptySince && Date.now() - emptySince >= 120000) ||
                              (scheduledDeletionAt && Date.now() >= scheduledDeletionAt);
            if (isExpired) {
              parsed.activeRoom = {
                roomCode: generateRoomCode(),
                podName: 'My Squad Room',
                roomTemplate: 'SQUAD_NIGHT',
                humorTone: 'FRIENDLY_ROAST',
                language: 'hi-IN',
                isHost: true,
                selectedGameMode: 'RED_FLAG_COURT',
                players: [
                  { id: parsed.currentUser?.id || 'usr_host', name: (parsed.currentUser && parsed.currentUser.displayName) ? `${parsed.currentUser.displayName.split(' ')[0]} (Host)` : 'Host (You)', role: 'HOST', isReady: true, avatar: (parsed.currentUser && parsed.currentUser.avatarUrl) ? parsed.currentUser.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost' },
                ],
                emptySince: null,
                scheduledDeletionAt: null,
              };
            } else if (Array.isArray(parsed.activeRoom.players)) {
              const mockBotNames = new Set(['Liam', 'Sarah', 'Alex', 'Rohan', 'Zara', 'Devon', 'Nia']);
              parsed.activeRoom.players = parsed.activeRoom.players.filter(
                (p) => !p.isBot && !mockBotNames.has(p.name) && !p.name.includes('(Bot)')
              );
              // If not in the middle of an empty-room deletion countdown and players array is 0, initialize host
              if (parsed.activeRoom.players.length === 0 && !parsed.activeRoom.emptySince) {
                const hostName = (parsed.currentUser && parsed.currentUser.displayName) ? `${parsed.currentUser.displayName.split(' ')[0]} (Host)` : 'Host (You)';
                const hostAvatar = (parsed.currentUser && parsed.currentUser.avatarUrl) ? parsed.currentUser.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost';
                parsed.activeRoom.players = [
                  { id: parsed.currentUser?.id || 'usr_host', name: hostName, role: 'HOST', isReady: true, avatar: hostAvatar }
                ];
              }
            }
          }
          if (Array.isArray(parsed.friendsList)) {
            const mockBotNames = new Set([
              'Devon Vance', 'Ananya Sharma', 'Liam Vance', 'Sarah Chen', 'Alex Rivera', 'Rohan Verma',
              'Devon', 'Ananya', 'Liam', 'Sarah', 'Alex', 'Rohan', 'Zara', 'Nia'
            ]);
            parsed.friendsList = parsed.friendsList.filter((f) => 
              !f.isBot && 
              f.role !== 'Bot' &&
              !mockBotNames.has(f.name) && 
              f.username !== 'devon_v' && 
              f.username !== 'ananya_s' &&
              !(typeof f.avatarUrl === 'string' && f.avatarUrl.includes('bottts')) &&
              !(typeof f.avatar === 'string' && f.avatar.includes('bottts'))
            );
          }
          if (Array.isArray(parsed.squadsList)) {
            parsed.squadsList = parsed.squadsList.filter((s) => !['The Goa Trip Crew', 'College Roomies 2024', 'Midnight Date Night'].includes(s.name));
          }
          if (Array.isArray(parsed.vaultMemories)) {
            parsed.vaultMemories = parsed.vaultMemories.filter(
              (m) => !['Liam', 'Sarah', 'Alex', 'Rohan', 'Sam'].includes(m.author)
            );
          }
          if (!parsed.friendsList) parsed.friendsList = [];
          if (!parsed.squadsList) parsed.squadsList = [];
          if (!parsed.friendRequests || Array.isArray(parsed.friendRequests) || !parsed.friendRequests.incoming) {
            parsed.friendRequests = { incoming: [], outgoing: [] };
          }
          if (!parsed.customGameDeck) parsed.customGameDeck = [];
          if (!parsed.vaultMemories) {
            parsed.vaultMemories = [];
          } else {
            parsed.vaultMemories = parsed.vaultMemories.filter((m) => !['s_lore_1', 's_lore_2', 's_lore_3'].includes(m.id));
          }
          if (!parsed.memoryGraphNodes) parsed.memoryGraphNodes = this.getDefaultMemoryGraphNodes();
          if (!parsed.weeklyMission) parsed.weeklyMission = this.getDefaultWeeklyMission();
          if (typeof parsed.userSparks !== 'number') parsed.userSparks = 750;
          if (!Array.isArray(parsed.unlockedPerks)) parsed.unlockedPerks = ['cyber_flame_plasma'];
          if (!Array.isArray(parsed.albumMemories)) {
            parsed.albumMemories = [];
          } else {
            parsed.albumMemories = parsed.albumMemories.filter((m) => !['mem_1', 'mem_2', 'mem_3', 'mem_4'].includes(m.id));
          }
          parsed.settings = { ...this.getDefaultSettings(), ...(parsed.settings || {}), ...(savedSettings || {}) };
          return parsed;
        }
      } catch (e) {
        console.warn('Corrupt session in storage, resetting...');
      }
    }

    return {
      currentView: 'HERO',
      activeMode: 'PODS', // 'SOLO' | 'US' | 'PODS'
      soundEnabled: true,
      currentUser: this.getDefaultGuestUser(),
      userSparks: 750,
      unlockedPerks: ['cyber_flame_plasma'],
      orderHistory: [],
      albumMemories: this.getDefaultAlbumMemories(),
      friendsList: [],
      squadsList: [],
      friendRequests: { incoming: [], outgoing: [] },
      memoryGraphNodes: this.getDefaultMemoryGraphNodes(),
      weeklyMission: this.getDefaultWeeklyMission(),
      activeRoom: {
        roomCode: generateRoomCode(),
        podName: 'My Squad Room',
        roomTemplate: 'SQUAD_NIGHT',
        humorTone: 'FRIENDLY_ROAST',
        language: 'hi-IN',
        isHost: true,
        selectedGameMode: 'RED_FLAG_COURT',
        players: [
          { id: 'usr_host', name: 'Host (You)', role: 'HOST', isReady: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost' },
        ],
      },
      activeGame: {
        sessionId: 'game_goa_01',
        roundIndex: 1,
        totalRounds: 5,
        score: 1420,
        selectedOption: null,
        isAnswerRevealed: false,
        timeRemaining: 20,
      },
      customGameDeck: [],
      vaultMemories: [],
      podChatMessages: [],
      duoWhisperNotes: [],
      duoVoiceNotes: [],
      settings: { ...this.getDefaultSettings(), ...(savedSettings || {}) },
    };
  }

  getState() {
    return this.state;
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.persist();
    this.notify();
  }

  setUserTier(tier) {
    const currentUser = { ...this.state.currentUser, tier };
    this.setState({ currentUser });
  }

  updateRoomName(name) {
    if (!name) return;
    const activeRoom = { ...this.state.activeRoom, podName: name };
    this.setState({ activeRoom });
  }

  addRoomPlayer(name, avatar = null) {
    if (!name || !name.trim()) return;
    this.cancelEmptyRoomTimer();
    const activeRoom = { ...this.state.activeRoom };
    if (!activeRoom.players) activeRoom.players = [];
    const trimmed = name.trim();
    const newPlayer = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: trimmed,
      role: 'PLAYER',
      isReady: true,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmed)}`,
    };
    activeRoom.players = [...activeRoom.players, newPlayer];
    this.setState({ activeRoom });
    return newPlayer;
  }

  removeRoomPlayer(playerId) {
    const currentPlayers = this.state.activeRoom.players || [];
    const filtered = currentPlayers.filter((p) => p.id !== playerId);
    const activeRoom = {
      ...this.state.activeRoom,
      players: filtered,
    };
    this.setState({ activeRoom });
    if (filtered.length === 0) {
      this.handleEmptyRoomDetected();
    }
  }

  setEmptyRoomTimeout(ms) {
    this.emptyTimeoutMs = ms;
  }

  handleEmptyRoomDetected(customTimeoutMs = null) {
    if (this.emptyRoomTimeout) {
      clearTimeout(this.emptyRoomTimeout);
      this.emptyRoomTimeout = null;
    }
    const timeout = typeof customTimeoutMs === 'number' ? customTimeoutMs : this.emptyTimeoutMs;
    const now = Date.now();
    const scheduledDeletionAt = now + timeout;

    const activeRoom = {
      ...this.state.activeRoom,
      emptySince: this.state.activeRoom?.emptySince || now,
      scheduledDeletionAt,
    };
    this.setState({ activeRoom });

    this.emptyRoomTimeout = setTimeout(() => {
      this.deleteActiveRoom('EMPTY_TIMEOUT_EXPIRED');
    }, timeout);

    if (this.emptyRoomTimeout && this.emptyRoomTimeout.unref) {
      this.emptyRoomTimeout.unref();
    }
  }

  cancelEmptyRoomTimer() {
    if (this.emptyRoomTimeout) {
      clearTimeout(this.emptyRoomTimeout);
      this.emptyRoomTimeout = null;
    }
    if (this.state.activeRoom && (this.state.activeRoom.emptySince || this.state.activeRoom.scheduledDeletionAt)) {
      const activeRoom = {
        ...this.state.activeRoom,
        emptySince: null,
        scheduledDeletionAt: null,
      };
      this.setState({ activeRoom });
    }
  }

  deleteActiveRoom(reason = 'ROOM_DELETED') {
    if (this.emptyRoomTimeout) {
      clearTimeout(this.emptyRoomTimeout);
      this.emptyRoomTimeout = null;
    }
    const oldCode = this.state.activeRoom?.roomCode;
    const newCode = generateRoomCode();
    const user = this.state.currentUser;
    const hostName = (user && user.displayName) ? `${user.displayName.split(' ')[0]} (Host)` : 'Host (You)';
    const hostAvatar = (user && user.avatarUrl) ? user.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost';

    const activeRoom = {
      roomCode: newCode,
      podName: 'My Squad Room',
      roomTemplate: 'SQUAD_NIGHT',
      humorTone: 'FRIENDLY_ROAST',
      language: 'hi-IN',
      isHost: true,
      selectedGameMode: 'RED_FLAG_COURT',
      players: [
        { id: user?.id || 'usr_host', name: hostName, role: 'HOST', isReady: true, avatar: hostAvatar },
      ],
      emptySince: null,
      scheduledDeletionAt: null,
    };
    this.setState({ activeRoom });

    if (typeof window !== 'undefined') {
      if (typeof window.showToast === 'function') {
        window.showToast('Room auto-deleted: No members present for 2 minutes.', 'info');
      }
      if (oldCode) {
        try {
          fetch(`/api/rooms/${encodeURIComponent(oldCode)}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user?.id || 'usr_host' }),
          }).catch(() => {});
        } catch (_) {}
      }
    }
  }

  leaveRoom() {
    this.cancelEmptyRoomTimer();
    const currentCode = this.state.activeRoom?.roomCode;
    const user = this.state.currentUser;
    const userId = user?.id || 'usr_host';
    const currentPlayers = this.state.activeRoom?.players || [];
    const remaining = currentPlayers.filter((p) => p.id !== userId);

    if (typeof window !== 'undefined' && currentCode) {
      try {
        fetch(`/api/rooms/${encodeURIComponent(currentCode)}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }).catch(() => {});
      } catch (_) {}
    }

    const activeRoom = {
      ...this.state.activeRoom,
      players: remaining,
    };
    this.setState({ activeRoom });

    if (remaining.length === 0) {
      this.handleEmptyRoomDetected();
    }
    return activeRoom;
  }

  addCustomRoomCard(card) {
    const customList = this.state.customGameDeck || [];
    const newCard = {
      id: `custom_${Date.now()}`,
      round: customList.length + 1,
      title: card.title || 'Custom Squad Card',
      prompt: card.prompt || card.title,
      quote: card.quote || card.prompt,
      author: card.author || 'Squad Anonymous',
      timestamp: 'Custom Entry',
      isPlayable: true,
      options: card.options || ['Option A', 'Option B', 'Option C', 'Option D'],
    };
    this.setState({ customGameDeck: [newCard, ...customList] });
    return newCard;
  }

  updateUserProfile(updates) {
    const currentUser = { ...this.state.currentUser, ...updates };
    this.setState({ currentUser });
  }

  getSettings() {
    return this.state.settings || this.getDefaultSettings();
  }

  updateSettings(partial) {
    if (!partial || typeof partial !== 'object') return this.state.settings;
    const newSettings = { ...(this.state.settings || this.getDefaultSettings()), ...partial };
    this.state = { ...this.state, settings: newSettings };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
      }
    } catch (_) {}
    this.persist();
    this.applySettingsEffects();
    this.notify();
    return newSettings;
  }

  resetSettingsToDefault() {
    const defaultSettings = this.getDefaultSettings();
    return this.updateSettings(defaultSettings);
  }

  applySettingsEffects() {
    if (typeof document === 'undefined' || !this.state.settings) return;
    try {
      const s = this.state.settings;
      const body = document.body;
      if (body) {
        body.classList.toggle('reduce-motion', !!s.reducedMotion);
        body.setAttribute('data-glow-intensity', s.cyberGlowIntensity || 'FULL');
        body.setAttribute('data-theme-accent', s.themeAccent || 'AMBER_GOLD');
      }
      if (typeof window !== 'undefined' && window.__bondfireAudio) {
        window.__bondfireAudio.setMasterVolume(s.masterVolume);
      }
      if (typeof window !== 'undefined' && window.__bondfireWakeLock) {
        if (s.keepScreenAwake) {
          window.__bondfireWakeLock.request();
        } else {
          window.__bondfireWakeLock.release();
        }
      }
    } catch (e) {
      console.warn('Could not apply settings effects:', e);
    }
  }

  exportUserData() {
    const exportData = {
      exportVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
      app: 'Bondfire Social Memory Engine',
      user: this.state.currentUser,
      settings: this.state.settings,
      stats: this.state.currentUser?.stats,
      friends: this.state.friendsList,
      squads: this.state.squadsList,
      vaultMemories: this.state.vaultMemories,
      customDeck: this.state.customGameDeck,
      albumMemories: this.state.albumMemories,
    };

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `bondfire-data-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export download error:', err);
      }
    }
    return exportData;
  }

  clearUserCache() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CONFIG.STORAGE_KEY_SESSION);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (_) {}

    const cleanGuest = this.getDefaultGuestUser();
    this.state = {
      ...this.state,
      currentUser: cleanGuest,
      activeRoom: {
        roomCode: generateRoomCode(),
        podName: 'My Squad Room',
        roomTemplate: 'SQUAD_NIGHT',
        humorTone: 'FRIENDLY_ROAST',
        language: 'hi-IN',
        isHost: true,
        selectedGameMode: 'RED_FLAG_COURT',
        players: [
          { id: cleanGuest.id, name: 'Host (You)', role: 'HOST', isReady: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost' },
        ],
      },
      friendsList: [],
      squadsList: [],
      friendRequests: { incoming: [], outgoing: [] },
      customGameDeck: [],
      vaultMemories: [],
      albumMemories: [],
      currentView: 'HOME',
    };
    this.persist();
    this.notify();
    return true;
  }

  setSparks(sparks) {
    const currentUser = { ...this.state.currentUser, sparks };
    this.setState({ currentUser });
  }

  setRoomCode(roomCode) {
    const activeRoom = { ...this.state.activeRoom, roomCode };
    this.setState({ activeRoom });
  }

  setRoomPlayers(players) {
    if (!Array.isArray(players)) return;
    const activeRoom = { ...this.state.activeRoom, players };
    this.setState({ activeRoom });
    if (players.length === 0) {
      this.handleEmptyRoomDetected();
    } else {
      this.cancelEmptyRoomTimer();
    }
  }

  joinRoomWithCode(roomCode, isDuo = false) {
    if (!roomCode) return this.state.activeRoom;
    this.cancelEmptyRoomTimer();
    const cleanCode = roomCode.trim().toUpperCase();
    const user = this.state.currentUser;
    const isAlreadyHost = this.state.activeRoom?.isHost && this.state.activeRoom?.roomCode === cleanCode;

    const myId = user?.id || `usr_${Date.now()}`;
    const myName = (user && user.displayName && user.displayName !== 'Guest Citizen')
      ? user.displayName.split(' ')[0]
      : (isAlreadyHost ? (isDuo ? 'You' : 'Host (You)') : `Camper_${Math.floor(100 + Math.random() * 900)}`);
    const myAvatar = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myName)}`;

    const myPlayer = {
      id: myId,
      name: myName,
      role: isAlreadyHost ? 'HOST' : (isDuo ? 'PARTNER' : 'Player'),
      isReady: true,
      avatar: myAvatar,
    };

    const currentPlayers = this.state.activeRoom?.players || [];
    let updatedPlayers;
    if (isAlreadyHost) {
      updatedPlayers = currentPlayers.length > 0 ? currentPlayers : [myPlayer];
    } else if (isDuo) {
      // Find or create the host placeholder so the partner sees both slots immediately
      const host = currentPlayers.find((p) => p.role === 'HOST') || {
        id: 'usr_host',
        name: 'Host',
        role: 'HOST',
        isReady: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host',
      };
      updatedPlayers = [host, myPlayer];
    } else {
      // For Squad, append if not already in list
      const existing = currentPlayers.filter((p) => p.id !== myId && p.name.toLowerCase() !== myName.toLowerCase());
      updatedPlayers = [...existing, myPlayer];
      if (updatedPlayers.length === 1 && !updatedPlayers.some((p) => p.role === 'HOST')) {
        updatedPlayers.unshift({
          id: 'usr_host',
          name: 'Host',
          role: 'HOST',
          isReady: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host',
        });
      }
    }

    const activeRoom = {
      ...this.state.activeRoom,
      roomCode: cleanCode,
      mode: isDuo ? 'US' : (this.state.activeRoom?.mode || 'PODS'),
      roomType: isDuo ? 'DUO' : (this.state.activeRoom?.roomType || 'SQUAD'),
      isHost: isAlreadyHost,
      sessionStarted: false,
      players: updatedPlayers,
    };
    this.setState({ activeRoom, currentMode: isDuo ? 'US' : (this.state.currentMode || 'PODS') });

    // Sync with Supabase Realtime across devices and broadcast join event
    if (typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ syncRealtimeRoom, broadcastRoomAction }) => {
        syncRealtimeRoom(cleanCode, {
          id: myId,
          name: myName,
          avatar: myAvatar,
          isHost: isAlreadyHost,
          role: myPlayer.role,
          mode: isDuo ? 'US' : 'PODS',
        });
        broadcastRoomAction(isDuo ? 'PARTNER_JOINED' : 'CAMPER_JOINED', {
          player: myPlayer,
          roomCode: cleanCode,
        });
      }).catch((err) => console.warn('Realtime sync notice:', err));
    }

    return activeRoom;
  }

  addPodChatMessage(msg, shouldBroadcast = true) {
    const user = this.state.currentUser;
    const authorName = msg.senderName || (user && user.displayName ? user.displayName.split(' ')[0] : 'Camper');
    const avatar = msg.avatar || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
    const newMsg = {
      id: msg.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: msg.senderId || user?.id || `usr_${Date.now()}`,
      senderName: authorName,
      text: msg.text || '',
      timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar,
    };

    const currentList = this.state.podChatMessages || [];
    this.setState({ podChatMessages: [...currentList, newMsg] });

    if (shouldBroadcast && typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ broadcastRoomAction }) => {
        broadcastRoomAction('POD_CHAT_MESSAGE', { message: newMsg });
      }).catch((e) => console.warn(e));
    }
    return newMsg;
  }

  addDuoWhisperNote(note, shouldBroadcast = true) {
    const user = this.state.currentUser;
    const authorName = note.author || (user && user.displayName ? user.displayName.split(' ')[0] : 'Partner');
    const newNote = {
      id: note.id || `wh_${Date.now()}`,
      author: authorName,
      text: note.text || '',
      timestamp: note.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unsealed: false,
    };

    const currentNotes = this.state.duoWhisperNotes || [];
    this.setState({ duoWhisperNotes: [...currentNotes, newNote] });

    this.addCustomMemory({
      title: `Secret Whisper Note from ${authorName}`,
      quote: note.text,
      type: 'WHISPER',
      category: 'LOVE',
    });

    if (shouldBroadcast && typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ broadcastRoomAction }) => {
        broadcastRoomAction('WHISPER_NOTE_SENT', { note: newNote });
      }).catch((e) => console.warn(e));
    }
    return newNote;
  }

  addDuoVoiceNote(vn, shouldBroadcast = true) {
    const user = this.state.currentUser;
    const authorName = vn.author || (user && user.displayName ? user.displayName.split(' ')[0] : 'Partner');
    const newVn = {
      id: vn.id || `vn_${Date.now()}`,
      author: authorName,
      audioUrl: vn.audioUrl || '',
      duration: vn.duration || '0:15',
      timestamp: vn.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentVns = this.state.duoVoiceNotes || [];
    this.setState({ duoVoiceNotes: [...currentVns, newVn] });

    this.addCustomMemory({
      title: `Voice Note from ${authorName} (${newVn.duration})`,
      quote: `[Voice Note: ${newVn.duration}] - Recorded during Date Night`,
      type: 'AUDIO',
      category: 'LOVE',
    });

    if (shouldBroadcast && typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ broadcastRoomAction }) => {
        broadcastRoomAction('VOICE_NOTE_SENT', { voiceNote: newVn });
      }).catch((e) => console.warn(e));
    }
    return newVn;
  }

  unsealDuoWhisperNote(noteId) {
    const notes = (this.state.duoWhisperNotes || []).map((n) => {
      if (n.id === noteId) {
        return { ...n, unsealed: true };
      }
      return n;
    });
    this.setState({ duoWhisperNotes: notes });
  }

  createDuoRoom(customName) {
    this.cancelEmptyRoomTimer();
    const roomCode = generateRoomCode();
    const user = this.state.currentUser;
    const hostName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
    const hostAvatar = (user && user.avatarUrl) ? user.avatarUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(hostName)}`;
    const activeRoom = {
      roomCode,
      mode: 'US',
      roomType: 'DUO',
      podName: customName || `${hostName}'s Duo Room ❤️`,
      isHost: true,
      sessionStarted: false,
      players: [
        { id: user?.id || `usr_host_${Date.now()}`, name: hostName, role: 'HOST', isReady: true, avatar: hostAvatar },
      ],
      emptySince: null,
      scheduledDeletionAt: null,
    };
    this.setState({ activeRoom, currentMode: 'US' });

    // Sync newly created duo room with Supabase Realtime
    if (typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ syncRealtimeRoom }) => {
        syncRealtimeRoom(roomCode, {
          id: user?.id || 'usr_host',
          name: hostName,
          avatar: hostAvatar,
          isHost: true,
          mode: 'US',
        });
      }).catch((err) => console.warn('Realtime sync notice:', err));
    }
    return activeRoom;
  }

  leaveDuoRoom() {
    this.cancelEmptyRoomTimer();
    this.setState({
      activeRoom: {
        roomCode: generateRoomCode(),
        podName: 'My Squad Room',
        roomTemplate: 'SQUAD_NIGHT',
        humorTone: 'FRIENDLY_ROAST',
        language: 'hi-IN',
        isHost: true,
        selectedGameMode: 'RED_FLAG_COURT',
        players: [
          { id: 'usr_host', name: 'Host (You)', role: 'HOST', isReady: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost' },
        ],
        emptySince: null,
        scheduledDeletionAt: null,
      },
      currentMode: 'US',
    });
  }

  createNewRoom(podName) {
    this.cancelEmptyRoomTimer();
    const roomCode = generateRoomCode();
    const user = this.state.currentUser;
    const hostName = (user && user.isLoggedIn && user.displayName) ? `${user.displayName.split(' ')[0]} (Host)` : 'Host (You)';
    const hostAvatar = (user && user.avatarUrl) ? user.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost';
    const activeRoom = {
      roomCode,
      podName: podName || `${(user && user.displayName) ? user.displayName.split(' ')[0] : 'Campfire'}'s Squad Pod 🔥`,
      isHost: true,
      selectedGameMode: this.state.activeRoom?.selectedGameMode || 'RED_FLAG_COURT',
      players: [
        { id: user?.id || 'usr_host', name: hostName, role: 'HOST', isReady: true, avatar: hostAvatar },
      ],
      emptySince: null,
      scheduledDeletionAt: null,
    };
    this.setState({ activeRoom });

    // Sync newly created room with Supabase Realtime
    if (typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ syncRealtimeRoom }) => {
        syncRealtimeRoom(roomCode, {
          id: user?.id || 'usr_host',
          name: hostName,
          avatar: hostAvatar,
          isHost: true,
        });
      }).catch((err) => console.warn('Realtime sync notice:', err));
    }

    return activeRoom;
  }

  removeCamper(playerId) {
    const activeRoom = { ...this.state.activeRoom };
    if (activeRoom.players) {
      activeRoom.players = activeRoom.players.filter((p) => p.id !== playerId);
    }
    this.setState({ activeRoom });
    if (!activeRoom.players || activeRoom.players.length === 0) {
      this.handleEmptyRoomDetected();
    }
  }

  setGameMode(gameMode) {
    const activeRoom = { ...this.state.activeRoom, selectedGameMode: gameMode };
    this.setState({ activeRoom });
  }

  logoutUser() {
    this.setState({ currentUser: this.getDefaultGuestUser() });
  }

  setMode(mode) {
    this.setState({ activeMode: mode });
    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-mode', mode);
    }
  }

  setView(view) {
    this.setState({ currentView: view });
    if (typeof window !== 'undefined' && window.location) {
      window.location.hash = `#/${view.toLowerCase()}`;
    }
  }

  toggleSound() {
    this.setState({ soundEnabled: !this.state.soundEnabled });
  }

  addFriend(friend) {
    const cleanUsername = (friend.username || friend.name || 'camper').toLowerCase().replace(/\s+/g, '_').replace('@', '');
    const avatar = friend.avatarUrl || friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(friend.name || 'Camper')}`;
    const newFriend = {
      ...friend,
      id: friend.id || `fr_${Date.now()}`,
      name: friend.name || 'New Camper',
      username: friend.username || cleanUsername,
      tag: friend.tag || `@${cleanUsername}`,
      status: (friend.status || 'ONLINE').toUpperCase(),
      currentRoom: friend.currentRoom || null,
      mutualGames: friend.mutualGames || 0,
      role: friend.role || 'Camper',
      lastActive: friend.lastActive || 'Just now',
      giftedToday: friend.giftedToday || false,
      sparks: friend.sparks || 50,
      avatarUrl: avatar,
      avatar: avatar,
    };
    const friendsList = [newFriend, ...(this.state.friendsList || [])];
    this.setState({ friendsList });
    return newFriend;
  }

  removeFriend(friendId) {
    const friendsList = (this.state.friendsList || []).filter((f) => f.id !== friendId);
    this.setState({ friendsList });
  }

  sendFriendRequest(targetUsername) {
    const newRequest = {
      id: `req_${Date.now()}`,
      toUsername: targetUsername,
      status: 'pending',
      timestamp: 'Just now',
    };
    const outgoing = [newRequest, ...(this.state.friendRequests?.outgoing || [])];
    this.setState({
      friendRequests: {
        ...(this.state.friendRequests || { incoming: [], outgoing: [] }),
        outgoing,
      },
    });
    return newRequest;
  }

  acceptFriendRequest(requestId) {
    const incoming = (this.state.friendRequests?.incoming || []).filter((r) => r.id !== requestId);
    const req = (this.state.friendRequests?.incoming || []).find((r) => r.id === requestId);
    if (req) {
      const cleanUsername = (req.fromUsername || req.fromName || 'camper').toLowerCase().replace(/\s+/g, '_').replace('@', '');
      const avatar = req.fromAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.fromName)}`;
      const newFriend = {
        id: `fr_${Date.now()}`,
        name: req.fromName,
        username: cleanUsername,
        tag: `@${cleanUsername}`,
        status: 'ONLINE',
        currentRoom: null,
        avatarUrl: avatar,
        avatar: avatar,
        sparks: 100,
        mutualGames: 1,
        role: 'Camper',
        lastActive: 'Just now',
      };
      this.setState({
        friendsList: [newFriend, ...(this.state.friendsList || [])],
        friendRequests: {
          ...(this.state.friendRequests || { incoming: [], outgoing: [] }),
          incoming,
        },
      });
      return newFriend;
    }
  }

  declineFriendRequest(requestId) {
    const incoming = (this.state.friendRequests?.incoming || []).filter((r) => r.id !== requestId);
    this.setState({
      friendRequests: {
        ...(this.state.friendRequests || { incoming: [], outgoing: [] }),
        incoming,
      },
    });
  }

  sendSparkGift(friendId) {
    let giftedFriend = null;
    const friendsList = (this.state.friendsList || []).map((f) => {
      if (f.id === friendId) {
        giftedFriend = {
          ...f,
          sparks: (f.sparks || 0) + 20,
          giftedToday: true,
        };
        return giftedFriend;
      }
      return f;
    });
    const currentSparks = this.state.currentUser?.sparks || 120;
    const currentUser = { ...this.state.currentUser, sparks: currentSparks + 5 };
    this.setState({ friendsList, currentUser });
    return giftedFriend;
  }

  createSquad(squad) {
    const newSquad = {
      id: `sq_${Date.now()}`,
      membersCount: 1,
      members: ['usr_host'],
      deckName: 'Custom Squad Deck',
      activeRoomCode: null,
      unreadMemories: 0,
      isPinned: false,
      ...squad,
    };
    const squadsList = [newSquad, ...(this.state.squadsList || [])];
    this.setState({ squadsList });
    return newSquad;
  }

  addCustomMemory(memory) {
    const newMem = {
      id: `mem_${Date.now()}`,
      timestamp: 'Today',
      isPlayable: true,
      ...memory,
    };
    const vaultMemories = [newMem, ...(this.state.vaultMemories || [])];

    // Inject into customGameDeck for playable live party rounds
    const authorName = memory.author || this.state.currentUser?.displayName || 'Host';
    const activePlayers = (this.state.activeRoom?.players || []).map((p) => ({
      name: p.name,
      role: p.role || 'Camper',
      avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`,
    }));
    const options = activePlayers.length > 0 ? activePlayers : [
      { name: authorName, role: 'Memory Author', avatar: this.state.currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}` },
    ];

    const newGameCard = {
      id: newMem.id,
      round: (this.state.customGameDeck?.length || 0) + 1,
      timestamp: 'Today · Pod Ingestion',
      quote: memory.quote || memory.title || '“No context needed, you know what you did.”',
      correctAnswer: authorName,
      options,
      context: `Inside Joke: ${memory.title || 'Private Pod Moment'}`,
    };
    const customGameDeck = [newGameCard, ...(this.state.customGameDeck || [])];
    this.setState({ vaultMemories, customGameDeck });
    return newMem;
  }

  deleteCustomMemory(id) {
    const vaultMemories = (this.state.vaultMemories || []).filter((m) => m.id !== id);
    const customGameDeck = (this.state.customGameDeck || []).filter((c) => c.id !== id);
    const duoWhisperNotes = (this.state.duoWhisperNotes || []).filter((w) => w.id !== id);
    const duoVoiceNotes = (this.state.duoVoiceNotes || []).filter((v) => v.id !== id);
    this.setState({ vaultMemories, customGameDeck, duoWhisperNotes, duoVoiceNotes });
  }

  // Sparks & Store Economy Methods
  claimDailySparks() {
    const currentSparks = this.state.userSparks || 0;
    const newSparks = currentSparks + 100;
    this.setState({
      userSparks: newSparks,
      lastDailyClaim: Date.now(),
    });
    return newSparks;
  }

  spendSparks(amount, reason = 'Store Purchase') {
    const currentSparks = this.state.userSparks || 0;
    if (currentSparks < amount) return false;
    const newSparks = currentSparks - amount;
    this.setState({ userSparks: newSparks });
    return true;
  }

  unlockPerk(perkId, perkName, sparksCost = 0) {
    if (sparksCost > 0) {
      const ok = this.spendSparks(sparksCost, `Unlocked ${perkName}`);
      if (!ok) return false;
    }
    const unlockedPerks = Array.from(new Set([...(this.state.unlockedPerks || []), perkId]));
    this.setState({ unlockedPerks });
    return true;
  }

  recordStoreOrder(order) {
    const newOrder = {
      id: order.id || `BF-ORDER-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingNumber: `BF-TRACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
      ...order,
    };
    const orderHistory = [newOrder, ...(this.state.orderHistory || [])];
    this.setState({ orderHistory });
    return newOrder;
  }

  // Real Photo Album Studio Methods
  addAlbumMemory(memory) {
    const newMemory = {
      id: `album_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      author: memory.author || this.state.currentUser?.displayName || 'Host (You)',
      camperTags: memory.camperTags || ['Host (You)'],
      stickers: memory.stickers || ['🔥'],
      likes: 0,
      theme: memory.theme || 'POLAROID_WARM',
      ...memory,
    };
    const albumMemories = [newMemory, ...(this.state.albumMemories || [])];
    this.setState({ albumMemories });
    return newMemory;
  }

  deleteAlbumMemory(memoryId) {
    const albumMemories = (this.state.albumMemories || []).filter((m) => m.id !== memoryId);
    this.setState({ albumMemories });
    return albumMemories;
  }

  addAlbumMemorySticker(memoryId, sticker) {
    const albumMemories = (this.state.albumMemories || []).map((m) => {
      if (m.id === memoryId) {
        const stickers = [...(m.stickers || []), sticker];
        return { ...m, stickers };
      }
      return m;
    });
    this.setState({ albumMemories });
    return albumMemories;
  }

  likeAlbumMemory(memoryId) {
    const albumMemories = (this.state.albumMemories || []).map((m) => {
      if (m.id === memoryId) {
        return { ...m, likes: (m.likes || 0) + 1 };
      }
      return m;
    });
    this.setState({ albumMemories });
    return albumMemories;
  }

  createAlbumFromUploads({ albumTitle = 'Our Campfire Album', theme = 'POLAROID_WARM', photos = [], camperTags = [] }) {
    const author = this.state.currentUser?.displayName || 'Host (You)';
    const newMemories = photos.map((photo, idx) => ({
      id: `album_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
      title: photo.title || `${albumTitle} #${idx + 1}`,
      caption: photo.caption || '',
      date: photo.date || new Date().toISOString().split('T')[0],
      author: photo.author || author,
      camperTags: photo.camperTags || (camperTags.length ? camperTags : [author]),
      imageUrl: typeof photo === 'string' ? photo : (photo.imageUrl || photo.dataUrl),
      theme: photo.theme || theme,
      stickers: ['🔥'],
      likes: 0
    }));

    const albumMemories = [...newMemories, ...(this.state.albumMemories || [])];
    this.setState({
      albumTitle,
      albumTheme: theme,
      albumMemories
    });
    return albumMemories;
  }

  updateAlbumMemory(memoryId, updates) {
    const albumMemories = (this.state.albumMemories || []).map((m) => {
      if (m.id === memoryId) {
        return { ...m, ...updates };
      }
      return m;
    });
    this.setState({ albumMemories });
    return albumMemories;
  }

  clearAlbum() {
    this.setState({ albumMemories: [], albumTitle: null });
  }

  persist() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONFIG.STORAGE_KEY_SESSION, JSON.stringify(this.state));
        if (this.state.settings) {
          localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(this.state.settings));
        }
      }
    } catch (e) {
      console.warn('Unable to persist session to localStorage', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    }
  }
}

export const store = new ReactiveStore();
