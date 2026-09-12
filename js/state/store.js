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
    const liveCode = generateRoomCode();
    return [
      {
        id: 'fr_1',
        name: 'Liam Vance',
        username: 'liam_v',
        status: 'IN_GAME', // 'IN_GAME' | 'ONLINE' | 'OFFLINE'
        currentRoom: liveCode,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Liam',
        sparks: 620,
        mutualGames: 14,
        role: 'Campfire Guitarist',
        lastActive: 'Playing Now',
      },
      {
        id: 'fr_2',
        name: 'Sarah Chen',
        username: 'sarah_c',
        status: 'ONLINE',
        currentRoom: null,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
        sparks: 480,
        mutualGames: 9,
        role: 'Trivia Legend',
        lastActive: 'Active 2m ago',
      },
      {
        id: 'fr_3',
        name: 'Alex Rivera',
        username: 'alex_r',
        status: 'ONLINE',
        currentRoom: null,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
        sparks: 530,
        mutualGames: 11,
        role: 'Late Night Owl',
        lastActive: 'Active 5m ago',
      },
      {
        id: 'fr_4',
        name: 'Rohan Verma',
        username: 'rohan_v',
        status: 'OFFLINE',
        currentRoom: null,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan',
        sparks: 310,
        mutualGames: 6,
        role: 'Foodie Captain',
        lastActive: 'Yesterday',
      },
    ];
  }

  getDefaultSquadsList() {
    return [
      {
        id: 'sq_1',
        name: 'The Goa Trip Crew',
        emoji: '🏖️',
        membersCount: 5,
        members: ['fr_1', 'fr_2', 'fr_3', 'fr_4'],
        deckName: 'Inside Joke Mystery Deck',
        activeRoomCode: generateRoomCode(),
        unreadMemories: 2,
        isPinned: true,
      },
      {
        id: 'sq_2',
        name: 'College Roomies 2024',
        emoji: '🍕',
        membersCount: 4,
        members: ['fr_1', 'fr_3'],
        deckName: 'Late Night Dorm Quotes',
        activeRoomCode: null,
        unreadMemories: 0,
        isPinned: false,
      },
      {
        id: 'sq_3',
        name: 'Midnight Date Night',
        emoji: '💖',
        membersCount: 2,
        members: ['fr_2'],
        deckName: 'Us Mode Love Capsule',
        activeRoomCode: null,
        unreadMemories: 1,
        isPinned: false,
      },
    ];
  }

  getDefaultFriendRequests() {
    return {
      incoming: [
        {
          id: 'req_1',
          name: 'Ananya Sharma',
          fromName: 'Ananya Sharma',
          username: 'ananya_s',
          fromUsername: 'ananya_s',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
          fromAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
          time: '15m ago',
          mutualFriends: 3,
        },
        {
          id: 'req_2',
          name: 'Devon Vance',
          fromName: 'Devon Vance',
          username: 'devon_v',
          fromUsername: 'devon_v',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devon',
          fromAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devon',
          time: '2h ago',
          mutualFriends: 2,
        },
      ],
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
              parsed.activeRoom.players = parsed.activeRoom.players.map((p) => {
                if (p.name === 'Maya') {
                  return { ...p, name: 'Host (You)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BondfireHost' };
                }
                if (p.avatar && p.avatar.includes('unsplash.com')) {
                  return { ...p, avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(p.name)}` };
                }
                return p;
              });
            }
          }
          if (!parsed.friendsList) parsed.friendsList = this.getDefaultFriendsList();
          if (!parsed.squadsList) parsed.squadsList = this.getDefaultSquadsList();
          if (!parsed.friendRequests || Array.isArray(parsed.friendRequests) || !parsed.friendRequests.incoming) {
            parsed.friendRequests = this.getDefaultFriendRequests();
          }
          if (!parsed.customGameDeck) parsed.customGameDeck = [];
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
      friendsList: this.getDefaultFriendsList(),
      squadsList: this.getDefaultSquadsList(),
      friendRequests: this.getDefaultFriendRequests(),
      memoryGraphNodes: this.getDefaultMemoryGraphNodes(),
      weeklyMission: this.getDefaultWeeklyMission(),
      activeRoom: {
        roomCode: generateRoomCode(),
        podName: 'The Ahmedabad Squad 🏖️',
        roomTemplate: 'SQUAD_NIGHT',
        humorTone: 'FRIENDLY_ROAST',
        language: 'hi-IN',
        isHost: true,
        selectedGameMode: 'OUR_LORE',
        players: [
          { id: 'usr_host', name: 'Host (You)', role: 'HOST', isReady: true, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BondfireHost' },
          { id: 'usr_2', name: 'Liam', role: 'PLAYER', isReady: true, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Liam' },
          { id: 'usr_3', name: 'Sarah', role: 'PLAYER', isReady: true, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah' },
          { id: 'usr_4', name: 'Alex', role: 'PLAYER', isReady: true, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex' },
          { id: 'usr_5', name: 'Rohan', role: 'PLAYER', isReady: false, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan' },
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
      vaultMemories: [
        {
          id: 'mem_1',
          type: 'CHAT_SCREENSHOT',
          title: 'The 2 AM Samosa Breakdown',
          quote: 'If I eat one more samosa I am legally changing my name to potato and moving into the fridge.',
          author: 'Liam',
          timestamp: 'Oct 14, 2019',
          isPlayable: true,
        },
        {
          id: 'mem_2',
          type: 'PHOTO',
          title: 'Lost in Anjuna Forest',
          quote: 'Guys the Google Maps lady is crying. She has no idea where we are.',
          author: 'Alex',
          timestamp: 'Aug 18, 2022',
          isPlayable: true,
        },
        {
          id: 'mem_3',
          type: 'VOICE_NOTE',
          title: 'Manali Rain Voice Note',
          quote: 'Listen to the rain in Manali... absolute peace.',
          author: 'Sam',
          timestamp: 'Sep 09, 2023',
          isPlayable: true,
        },
      ],
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

  addRoomPlayer(name, avatar) {
    if (!name) return;
    const currentPlayers = this.state.activeRoom.players || [];
    const newPlayer = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: name.trim(),
      role: 'PLAYER',
      isReady: true,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    };
    const activeRoom = {
      ...this.state.activeRoom,
      players: [...currentPlayers, newPlayer],
    };
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

  createNewRoom(podName) {
    const roomCode = generateRoomCode();
    const user = this.state.currentUser;
    const hostName = (user && user.isLoggedIn && user.displayName) ? `${user.displayName.split(' ')[0]} (Host)` : 'Host (You)';
    const hostAvatar = (user && user.avatarUrl) ? user.avatarUrl : 'https://api.dicebear.com/7.x/bottts/svg?seed=BondfireHost';
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
    return activeRoom;
  }

  addBotCamper() {
    const activeRoom = { ...this.state.activeRoom };
    if (!activeRoom.players) activeRoom.players = [];
    if (activeRoom.players.length >= 8) return null;
    const botNames = ['Liam', 'Sarah', 'Alex', 'Rohan', 'Zara', 'Devon', 'Nia'];
    const existingNames = new Set(activeRoom.players.map((p) => p.name.replace(/ \(Bot\)$/, '')));
    const available = botNames.filter((n) => !existingNames.has(n));
    const nextName = available[0] || `Camper ${activeRoom.players.length + 1}`;
    const newPlayer = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `${nextName} (Bot)`,
      role: 'PLAYER',
      isReady: true,
      isBot: true,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nextName)}`,
    };
    activeRoom.players = [...activeRoom.players, newPlayer];
    this.setState({ activeRoom });
    return newPlayer;
  }

  removeCamper(playerId) {
    const activeRoom = { ...this.state.activeRoom };
    if (activeRoom.players) {
      activeRoom.players = activeRoom.players.filter((p) => p.id !== playerId);
      this.setState({ activeRoom });
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
    const avatar = friend.avatarUrl || friend.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(friend.name || 'Camper')}`;
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
      const avatar = req.fromAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(req.fromName)}`;
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
    const newGameCard = {
      round: (this.state.customGameDeck?.length || 0) + 1,
      timestamp: 'Today · Pod Ingestion',
      quote: memory.quote || memory.title || '“No context needed, you know what you did.”',
      correctAnswer: authorName,
      options: [
        { name: authorName, role: 'Memory Author', avatar: this.state.currentUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}` },
        { name: 'Sarah', role: 'Board Game Host', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDySvCa7Hc5xAULiWC4iNdKkkcDRSbOWNZ81f_W0uhYgGu9-jGyhudyaIo5ZWOt0v0rl9d3yWndIZbie4X8vPISEqJwcU93S0OwvvtGsiISqoRTpEceomCg-di_2I5BF9jeZepBVKx_0RoNxq6d7TJDUEj9bJd62XseRoL3n3cfqEcQazhb_IZM5sLgsaJwmTTmdcBEgjK5aos5_QDeTEMdpm1WcKNEwSMuKY5WhMT2viHUCE8tXX3IGA' },
        { name: 'Liam', role: 'Campfire Guitarist', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmwuDdkf2JKU_FNP18beYeY54Rz_EbBHfwxAwsyn4tS1T3U5YNgmSC1WPW_6TUur3NpEhH3bq2d5N5NPRonMsPcP8OiiyyCqosSaMmTH5uUB8mSK_CcZoo6IniUTD5Frt9TZCNZZLLeKRENQGHoapodjHvYqod50pXY1xl6XN6H3cNt0A5CZbVGOAYrDOdOs7NWbQ-AfTAxR5fzZUBftESRetw_934QcPVBQpoADdzgKbZA3-VkQmkkw' },
        { name: 'Alex', role: 'Late Night Owl', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATy2qu59ulmLgSkSbicSnc3Ux_P-5__PswfNDRTh4DCxvBC1Nt1879TnM1QtXDWyeCpzydz2vOpowwsb8yYQuvBQX8PprAAInIKvHwvRtKLoRY1mcKCkd-kVKfp8R0fAwqm4fll2Lxu1GJajGsHHwLGc0u53pqH_L_TV13Ayr9SmhKglYLeUMfzPIiaWuIKJA1BHnwTZu27vluYLBYgzCWLh5l592qWfBdolQbA-WGufMWzSmFKKvRXA' }
      ],
      context: `Inside Joke: ${memory.title || 'Private Pod Moment'}`
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
