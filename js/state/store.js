// ==============================================================================
// REACTIVE STORE & SESSION RECOVERY MANAGER
// Guarantees zero lost game state on page refresh or tab re-opening
// ==============================================================================

import { CONFIG, generateRoomCode } from '../config.js';

class ReactiveStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadInitialState();

    // Listen for cross-tab storage synchronization
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === CONFIG.STORAGE_KEY_SESSION && e.newValue) {
          try {
            this.state = JSON.parse(e.newValue);
            this.notify();
          } catch (err) {
            console.error('Cross-tab sync error:', err);
          }
        }
      });
    }
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
    return [
      {
        id: 'node_1',
        category: 'QUOTES',
        title: '“Maine pehle hi bola tha”',
        contextSnippet: 'Aarav at 2:00 AM before train departure · Said with 100% smug confidence',
        eventDate: '2024-10-15',
        sentimentTag: 'FUNNY',
        status: 'APPROVED',
      },
      {
        id: 'node_2',
        category: 'FOOD',
        title: 'Biryani vs Pulao Group Chat Civil War',
        contextSnippet: '600-word heated thesis in WhatsApp · 22 voice notes exchanged',
        eventDate: '2024-08-12',
        sentimentTag: 'CHAOTIC',
        status: 'APPROVED',
      },
      {
        id: 'node_3',
        category: 'RUNNING_JOKES',
        title: 'The "5 Minutes Away" Legend',
        contextSnippet: 'Sarah texting "Just entering parking" while standing in bathroom towel',
        eventDate: '2024-11-04',
        sentimentTag: 'ROAST',
        status: 'APPROVED',
      },
      {
        id: 'node_4',
        category: 'PLACES',
        title: 'Anjuna Beach Shack 3 AM Sand Search',
        contextSnippet: '4 flashlights looking for Kabir scooter key that was in his own pocket',
        eventDate: '2024-10-16',
        sentimentTag: 'NOSTALGIC',
        status: 'APPROVED',
      },
      {
        id: 'node_5',
        category: 'SONGS',
        title: 'Ilahi Sing-Along in Rented Dzire',
        contextSnippet: 'Everyone hitting the high pitch completely out of tune',
        eventDate: '2024-10-17',
        sentimentTag: 'EMOTIONAL',
        status: 'PENDING_APPROVAL',
      },
    ];
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

  loadInitialState() {
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
            if (Array.isArray(parsed.activeRoom.players)) {
              const mockBotNames = new Set(['Liam', 'Sarah', 'Alex', 'Rohan', 'Zara', 'Devon', 'Nia']);
              parsed.activeRoom.players = parsed.activeRoom.players.filter(
                (p) => !p.isBot && !mockBotNames.has(p.name) && !p.name.includes('(Bot)')
              );
              if (parsed.activeRoom.players.length === 0) {
                const hostName = (parsed.currentUser && parsed.currentUser.displayName) ? `${parsed.currentUser.displayName.split(' ')[0]} (Host)` : 'Host (You)';
                const hostAvatar = (parsed.currentUser && parsed.currentUser.avatarUrl) ? parsed.currentUser.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost';
                parsed.activeRoom.players = [
                  { id: parsed.currentUser?.id || 'usr_host', name: hostName, role: 'HOST', isReady: true, avatar: hostAvatar }
                ];
              }
            }
          }
          if (Array.isArray(parsed.friendsList)) {
            parsed.friendsList = parsed.friendsList.filter((f) => !['Liam Vance', 'Sarah Chen', 'Alex Rivera', 'Rohan Verma'].includes(f.name));
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
          if (!parsed.vaultMemories) parsed.vaultMemories = [];
          if (!parsed.memoryGraphNodes) parsed.memoryGraphNodes = this.getDefaultMemoryGraphNodes();
          if (!parsed.weeklyMission) parsed.weeklyMission = this.getDefaultWeeklyMission();
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
  }

  joinRoomWithCode(roomCode) {
    if (!roomCode) return this.state.activeRoom;
    const cleanCode = roomCode.trim().toUpperCase();
    const user = this.state.currentUser;
    const isAlreadyHost = this.state.activeRoom?.isHost && this.state.activeRoom?.roomCode === cleanCode;

    const myId = user?.id || `usr_${Date.now()}`;
    const myName = (user && user.displayName && user.displayName !== 'Guest Citizen')
      ? user.displayName.split(' ')[0]
      : (isAlreadyHost ? 'Host (You)' : `Camper_${Math.floor(100 + Math.random() * 900)}`);
    const myAvatar = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myName)}`;

    const myPlayer = {
      id: myId,
      name: myName,
      role: isAlreadyHost ? 'HOST' : 'Player',
      isReady: true,
      avatar: myAvatar,
    };

    const currentPlayers = this.state.activeRoom?.players || [];
    let updatedPlayers;
    if (isAlreadyHost) {
      updatedPlayers = currentPlayers.length > 0 ? currentPlayers : [myPlayer];
    } else {
      updatedPlayers = [myPlayer];
    }

    const activeRoom = {
      ...this.state.activeRoom,
      roomCode: cleanCode,
      isHost: isAlreadyHost,
      players: updatedPlayers,
    };
    this.setState({ activeRoom });

    // Sync with Supabase Realtime across devices
    if (typeof window !== 'undefined') {
      import('../services/supabaseClient.js').then(({ syncRealtimeRoom }) => {
        syncRealtimeRoom(cleanCode, {
          id: myId,
          name: myName,
          avatar: myAvatar,
          isHost: isAlreadyHost,
        });
      }).catch((err) => console.warn('Realtime sync notice:', err));
    }

    return activeRoom;
  }

  createNewRoom(podName) {
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
      id: `fr_${Date.now()}`,
      name: friend.name || 'New Camper',
      username: cleanUsername,
      tag: `@${cleanUsername}`,
      status: (friend.status || 'ONLINE').toUpperCase(),
      currentRoom: friend.currentRoom || null,
      mutualGames: friend.mutualGames || 0,
      role: friend.role || 'Camper',
      lastActive: 'Just now',
      giftedToday: false,
      sparks: friend.sparks || 50,
      avatarUrl: avatar,
      avatar: avatar,
      ...friend,
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

  persist() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONFIG.STORAGE_KEY_SESSION, JSON.stringify(this.state));
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
