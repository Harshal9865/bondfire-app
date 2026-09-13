// ==============================================================================
// BONDFIRE ROOM OS: ROOM LOBBY (js/components/lobby.js)
// Fixed Room Templates, Humor Consent Settings, 1-Tap WhatsApp Invite & Audience Grid
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { GAME_MODES } from '../data/partyGameDecks.js';
import { OUR_LORE_DECK } from '../data/indianCultureDecks.js';
import { generateDynamicGameDeck } from '../services/geminiService.js';
import { p2pMesh } from '../services/webrtcService.js';
import { renderSpotifyJukebox, bindSpotifyEvents } from './spotifyPlayer.js';
import { syncRealtimeRoom, broadcastRoomAction } from '../services/supabaseClient.js';

export const ROOM_TEMPLATES = [
  {
    id: 'SQUAD_NIGHT',
    name: 'Squad Night',
    icon: 'local_fire_department',
    tagline: 'Friends, roasts, inside jokes & questionable decisions',
    defaultGame: 'OUR_LORE',
    defaultTone: 'FRIENDLY_ROAST',
    duration: '20 mins',
    badge: 'MOST POPULAR'
  },
  {
    id: 'COUPLE_DATE',
    name: 'Couple Date Night',
    icon: 'favorite',
    tagline: 'Our firsts, reaction predictions & gentle intimacy',
    defaultGame: 'OUR_LORE',
    defaultTone: 'ROMANTIC',
    duration: '15 mins',
    badge: 'INTIMATE'
  },
  {
    id: 'FAMILY_ADDA',
    name: 'Family Game Night',
    icon: 'local_cafe',
    tagline: 'Wholesome Antakshari, festival memories & relative trivia',
    defaultGame: 'EMOJI_CINEMA',
    defaultTone: 'FAMILY_SAFE',
    duration: '25 mins',
    badge: '100% SAFE'
  },
  {
    id: 'COLLEGE_HOSTEL',
    name: 'Hostel Night',
    icon: 'local_pizza',
    tagline: 'Maggi incidents, 3 AM philosophy & roommate exposes',
    defaultGame: 'WHO_SAID_THIS',
    defaultTone: 'SAVAGE_ROAST',
    duration: '20 mins',
    badge: 'CHAOTIC'
  },
  {
    id: 'WEDDING_HOUSE',
    name: 'Wedding House',
    icon: 'celebration',
    tagline: 'Sangeet choreography, gossip & cousin rivalries',
    defaultGame: 'MOST_LIKELY_TO',
    defaultTone: 'LIGHT_TEASING',
    duration: '30 mins',
    badge: 'CELEBRATION'
  },
  {
    id: 'WATCH_PARTY',
    name: 'Watch & Play',
    icon: 'movie',
    tagline: 'Interactive 20s Reels with pause-and-predict rounds',
    defaultGame: 'REEL_COURT',
    defaultTone: 'FRIENDLY_ROAST',
    duration: '15 mins',
    badge: 'INTERACTIVE'
  }
];

export function renderLobby() {
  const state = store.getState();
  const room = state.activeRoom;
  const user = state.currentUser;
  const hostName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Host';
  const currentTemplate = ROOM_TEMPLATES.find((t) => t.id === (room.roomTemplate || 'SQUAD_NIGHT')) || ROOM_TEMPLATES[0];

  return `
    <div class="flex flex-col w-full max-w-[680px] mx-auto px-4 pt-6 pb-32 relative select-none z-20">
      
      <!-- Ambient Glows -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sunset-coral/5 rounded-full blur-[110px] pointer-events-none -z-10"></div>
      <div class="absolute top-80 right-0 w-80 h-80 bg-amber-gold/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Header & Room Code Bar (Editable Room Name) -->
      <div class="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border shadow-xl mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
            <span class="text-[11px] font-mono font-bold text-mint-green uppercase tracking-wider">Bondfire Room OS Live</span>
          </div>
          <div class="flex items-center gap-2">
            <h2 class="font-display text-2xl font-bold text-white tracking-tight" id="display-room-name">${room.podName || "Our Squad Room"}</h2>
            <button id="btn-rename-room" class="p-1 rounded text-gray-400 hover:text-amber-gold transition-colors" title="Rename Room">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">Host: <span class="text-white font-bold">${hostName}</span> · ${room.players.length} Campers in Room</p>
        </div>
        
        <button id="btn-copy-code" class="group flex flex-col items-end cursor-pointer bg-surface-bright/70 hover:bg-surface-bright p-2.5 rounded-xl border border-border/80 transition-all">
          <span class="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Room Passcode</span>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xl font-black text-amber-gold tracking-widest">${room.roomCode}</span>
            <span class="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-sunset-coral">content_copy</span>
          </div>
        </button>
      </div>

      <!-- Quick Social Sharing: 1-Tap WhatsApp & QR -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <a id="btn-whatsapp-share" href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Join our private Bondfire room tonight! Room Code: ${room.roomCode} -> ${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}#/ROOMS?code=${room.roomCode}`)}" target="_blank" class="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 hover:bg-[#25D366]/25 text-[#25D366] font-bold text-xs transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">chat</span>
          <span>1-Tap WhatsApp Invite</span>
        </a>

        <button id="slot-invite-player" class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface border border-border hover:border-sunset-coral text-gray-200 font-bold text-xs transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px] text-sunset-coral">qr_code_scanner</span>
          <span>Show Room QR Code</span>
        </button>
      </div>

      <!-- ARCADE MULTIPLAYER: SPIN THE BOTTLE HERO BANNER -->
      <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-sunset-coral/20 via-surface to-amber-gold/20 border border-sunset-coral/40 shadow-xl flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral shrink-0 shadow-sm">
            <span class="material-symbols-outlined text-2xl text-sunset-coral">wine_bar</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="retro-pixel-badge px-2 py-0.5 rounded text-[8px] bg-sunset-coral/30 text-sunset-coral">Arcade Multiplayer</span>
              <span class="text-xs text-mint-green font-mono font-bold">${room.players.length} Players Ready</span>
            </div>
            <h4 class="font-display text-sm sm:text-base font-bold text-white mt-0.5">Spin the Bottle (Truth or Dare)</h4>
            <p class="text-[11px] text-gray-300">Realistic physics bottle spinner pointing at real players in the room.</p>
          </div>
        </div>

        <button id="btn-launch-spin-bottle" class="shrink-0 px-4 py-2.5 rounded-full bg-sunset-coral hover:bg-[#FF7064] text-white font-bold text-xs shadow-glow-coral transition-all active:scale-95 flex items-center gap-1.5">
          <span>Play</span>
          <span class="material-symbols-outlined text-[16px]">play_arrow</span>
        </button>
      </div>

      <!-- Room OS Template Selector (Fixed Templates) -->
      <div class="mb-6 p-5 rounded-2xl bg-surface border border-border shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <div>
            <span class="text-[10px] font-mono font-bold text-sunset-coral uppercase tracking-wider">Step 1 · Room Template</span>
            <h3 class="font-display text-base font-bold text-white">Choose Game Format</h3>
          </div>
          <span class="text-xs text-amber-gold font-bold font-mono">${currentTemplate.duration}</span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5" id="template-picker-grid">
          ${ROOM_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === (room.roomTemplate || 'SQUAD_NIGHT');
            return `
              <button class="btn-select-template p-3 rounded-xl border text-left transition-all relative overflow-hidden ${isSelected ? 'bg-sunset-coral/15 border-sunset-coral shadow-glow-coral' : 'bg-surface-bright/50 border-border/70 hover:border-gray-500'}" data-template="${tmpl.id}">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-xs text-white truncate flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-amber-gold">${tmpl.icon || 'star'}</span><span>${tmpl.name}</span></span>
                  ${isSelected ? `<span class="w-2 h-2 rounded-full bg-sunset-coral"></span>` : ''}
                </div>
                <p class="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">${tmpl.tagline}</p>
                <div class="mt-2 flex items-center gap-1">
                  <span class="retro-pixel-badge px-1.5 py-0.5 rounded text-[8px] bg-white/10 text-gray-300">${tmpl.badge}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Room Personalization: Language & Humor Tone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Language Selector -->
        <div class="p-4 rounded-2xl bg-surface border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">translate</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Language Flavor</span>
          </div>
          <div class="flex items-center gap-1.5">
            ${[
              { code: 'hi-IN', label: 'Hinglish (Desi)' },
              { code: 'hi', label: 'Hindi (हिंदी)' },
              { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
              { code: 'en', label: 'English' }
            ].map((lang) => {
              const isActive = (room.language || 'hi-IN') === lang.code;
              return `
                <button class="btn-select-language flex-1 py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${isActive ? 'bg-amber-gold/20 border-amber-gold text-amber-gold' : 'bg-surface-bright border-border/70 text-gray-400 hover:text-white'}" data-lang="${lang.code}">
                  ${lang.label}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Humor Consent Tone -->
        <div class="p-4 rounded-2xl bg-surface border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-[16px] text-sunset-coral">sentiment_very_satisfied</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Roast & Humor Tone</span>
          </div>
          <div class="flex items-center gap-1.5">
            ${[
              { tone: 'FAMILY_SAFE', label: 'Family Safe' },
              { tone: 'FRIENDLY_ROAST', label: 'Friendly' },
              { tone: 'SAVAGE_ROAST', label: 'Savage' },
              { tone: 'ROMANTIC', label: 'Romantic' }
            ].map((item) => {
              const isActive = (room.humorTone || 'FRIENDLY_ROAST') === item.tone;
              return `
                <button class="btn-select-humor flex-1 py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${isActive ? 'bg-sunset-coral/20 border-sunset-coral text-sunset-coral' : 'bg-surface-bright border-border/70 text-gray-400 hover:text-white'}" data-tone="${item.tone}">
                  ${item.label}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Squad Live Voice Lounge Bar (WebRTC) -->
      <div class="mb-6 p-4 rounded-2xl bg-surface-container-low border border-[#06D6A0]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#06D6A0]/10 border border-[#06D6A0]/30 flex items-center justify-center text-[#06D6A0] shrink-0">
            <span class="material-symbols-outlined text-[20px]">graphic_eq</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white uppercase font-mono">Squad Voice Lounge</span>
              <span id="voice-connection-badge" class="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[9px] font-mono font-bold">READY TO CONNECT</span>
            </div>
            <p class="text-[11px] text-gray-400 font-mono mt-0.5" id="voice-status-desc">Zero-latency live squad mic powered by WebRTC</p>
          </div>
        </div>

        <!-- Voice Action Buttons -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="btn-toggle-voice-connect" class="px-3.5 py-1.5 rounded-full bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-black text-xs font-bold font-mono transition-all active:scale-95 flex items-center gap-1.5 shadow-glow-mint">
            <span class="material-symbols-outlined text-sm">mic</span>
            <span id="btn-voice-connect-label">Connect Mic</span>
          </button>
          <button id="btn-toggle-mic-mute" class="p-2 rounded-full bg-surface-bright border border-border text-gray-300 hover:text-white transition-colors" title="Mute Microphone" style="display: none;">
            <span class="material-symbols-outlined text-sm" id="icon-mic-mute">mic</span>
          </button>
          <button id="btn-toggle-deafen" class="p-2 rounded-full bg-surface-bright border border-border text-gray-300 hover:text-white transition-colors" title="Deafen Squad Audio" style="display: none;">
            <span class="material-symbols-outlined text-sm" id="icon-deafen">volume_up</span>
          </button>
        </div>
      </div>

      <!-- Campers Joined (Audience Grid) -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-display text-base font-bold text-white">The Room Campers (${room.players.length}/8)</h3>
          <span class="text-xs text-mint-green font-mono font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
            Synced
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-3" id="lobby-player-grid">
          ${room.players.map((p) => {
            const isHost = p.role === 'HOST';
            const isCurrentUser = isHost || p.name === 'Host (You)';
            const displayName = isCurrentUser ? (user && user.isLoggedIn && user.displayName ? `${user.displayName.split(' ')[0]} (Host)` : 'You (Host)') : p.name;
            const avatar = isCurrentUser && user && user.avatarUrl ? user.avatarUrl : (p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`);

            return `
              <div class="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                <div class="relative">
                  <img src="${avatar}" class="w-10 h-10 rounded-lg bg-surface-bright object-cover" />
                  ${isHost ? `<div class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-gold text-canvas flex items-center justify-center shadow-sm"><span class="material-symbols-outlined text-[11px] font-bold">hotel_class</span></div>` : ''}
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-xs font-bold text-white truncate">${displayName}</span>
                  <span class="retro-pixel-badge text-[8.5px] ${p.isReady ? 'text-mint-green' : 'text-gray-500'}">${p.isReady ? 'Ready' : 'Joining...'}</span>
                </div>
              </div>
            `;
          }).join('')}

          <!-- Dynamic Add Camper Slot -->
          <button id="btn-add-camper-slot" class="flex items-center gap-3 p-3 rounded-xl bg-surface border border-dashed border-border/80 hover:bg-surface-bright hover:border-sunset-coral/50 transition-colors text-left group">
            <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border group-hover:border-sunset-coral/50 transition-colors">
              <span class="material-symbols-outlined text-gray-400 group-hover:text-sunset-coral transition-colors">person_add</span>
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">+ Add Friend</span>
              <span class="text-[9px] text-gray-500">Add to Room</span>
            </div>
          </button>
        </div>

        <!-- Add Custom Inside Joke / Card Button -->
        <div class="mt-3">
          <button id="btn-open-custom-card-modal" class="w-full py-2.5 px-4 rounded-xl bg-surface-bright border border-border hover:border-amber-gold/50 text-xs font-bold text-gray-300 hover:text-amber-gold transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">note_add</span>
            <span>+ Add Your Own Inside Joke / Custom Card</span>
          </button>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="fixed bottom-0 left-0 w-full bg-canvas/90 backdrop-blur-xl border-t border-border p-4 z-40">
        <div class="max-w-[680px] mx-auto flex gap-3">
          <button id="btn-lobby-vault" class="flex-1 py-3.5 rounded-full bg-surface-bright border border-border text-white font-bold text-xs shadow-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-gold">inventory_2</span>
            <span>Memory Vault</span>
          </button>
          
          <button id="start-game-btn" class="flex-[2] py-3.5 rounded-full bg-sunset-coral hover:bg-[#FF7064] text-white font-bold text-sm shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-2">
            <span>Start Game</span>
            <span class="material-symbols-outlined text-[20px]">play_arrow</span>
          </button>
        </div>
      </div>

      <!-- Invite QR Modal -->
      <div id="invite-modal" class="fixed inset-0 bg-canvas/90 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 text-center">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-display font-bold text-lg text-white">Join Room QR Code</h3>
            <button id="btn-close-invite-modal" class="text-gray-400 hover:text-white flex items-center justify-center p-1"><span class="material-symbols-outlined text-lg">close</span></button>
          </div>
          <div class="p-4 bg-white rounded-xl mb-4 flex items-center justify-center">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}#/ROOMS?code=${room.roomCode}`)}" class="w-44 h-44" alt="Room QR Code" />
          </div>
          <p class="text-xs text-gray-400 font-mono mb-2">Scan with camera to jump in without login</p>
          <span class="font-mono text-2xl font-black text-amber-gold tracking-widest">${room.roomCode}</span>
        </div>
      </div>

      <!-- Add Camper Modal -->
      <div id="add-camper-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 text-left flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="font-display font-bold text-lg text-white">Add a Friend to Room</h3>
            <button id="btn-close-camper-modal" class="text-gray-400 hover:text-white flex items-center justify-center p-1"><span class="material-symbols-outlined text-lg">close</span></button>
          </div>
          <div>
            <label class="text-xs text-gray-400 font-mono uppercase block mb-1.5">Friend's Name</label>
            <input type="text" id="input-camper-name" placeholder="e.g. Enter friend's name" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright border border-border text-white text-xs focus:outline-none focus:border-sunset-coral" />
          </div>
          <button id="btn-confirm-add-camper" class="w-full py-3 rounded-full bg-sunset-coral text-white font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all">
            Add to Room
          </button>
        </div>
      </div>

      <!-- Add Custom Inside Joke / Card Modal -->
      <div id="custom-card-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-md bg-surface rounded-2xl border border-border p-6 text-left flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="font-display font-bold text-lg text-white">Add Custom Squad Card</h3>
            <button id="btn-close-custom-card-modal" class="text-gray-400 hover:text-white flex items-center justify-center p-1"><span class="material-symbols-outlined text-lg">close</span></button>
          </div>
          <div>
            <label class="text-xs text-gray-400 font-mono uppercase block mb-1.5">Card Title / Situation</label>
            <input type="text" id="input-custom-card-title" placeholder="e.g. The 3 AM Maggi Incident" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright border border-border text-white text-xs focus:outline-none focus:border-sunset-coral mb-3" />
            <label class="text-xs text-gray-400 font-mono uppercase block mb-1.5">Quote or What Happened?</label>
            <textarea id="input-custom-card-quote" rows="3" placeholder="e.g. 'I didn't steal the fries, they just fell into my mouth'" class="w-full px-3.5 py-2 rounded-xl bg-surface-bright border border-border text-white text-xs focus:outline-none focus:border-sunset-coral"></textarea>
          </div>
          <button id="btn-confirm-custom-card" class="w-full py-3 rounded-full bg-amber-gold text-canvas font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all">
            Save Card to Active Deck
          </button>
        </div>
      </div>

      <!-- Floating Squad Spotify Jukebox -->
      ${renderSpotifyJukebox()}

    </div>
  `;
}

export function bindLobbyEvents() {
  const btnStart = document.getElementById('start-game-btn');
  const btnCopy = document.getElementById('btn-copy-code');
  const btnVault = document.getElementById('btn-lobby-vault');
  const slotInvite = document.getElementById('slot-invite-player');
  const modalInvite = document.getElementById('invite-modal');
  const btnCloseInvite = document.getElementById('btn-close-invite-modal');

  // Start Show Runner -> synthesizes Gemini AI deck and transitions to #GAME
  if (btnStart) {
    btnStart.addEventListener('click', async () => {
      audio.playChime();
      const state = store.getState();
      const players = state.activeRoom?.players || state.activeRoom?.campers || [];
      const playerNames = players.map((p) => p.name).filter(Boolean);
      const selectedMode = state.activeRoom?.selectedGameMode || 'OUR_LORE';

      btnStart.disabled = true;
      btnStart.innerHTML = `
        <span class="material-symbols-outlined text-base animate-spin">sync</span>
        <span class="retro-pixel-badge text-xs">AI SYNTHESIZING CUSTOM DECK...</span>
      `;

      try {
        const dynamicDeck = await generateDynamicGameDeck(selectedMode, playerNames);
        if (dynamicDeck && dynamicDeck.length > 0) {
          store.setState({
            activeGame: {
              ...state.activeGame,
              roundIndex: 1,
              totalRounds: dynamicDeck.length,
              dynamicDeck: dynamicDeck,
              selectedOption: null,
              isAnswerRevealed: false,
              timeRemaining: 20,
            },
            currentView: 'GAME',
          });
          broadcastRoomAction('START_GAME', { gameMode: store.getState().activeRoom.selectedGameMode });
          window.location.hash = '#/GAME';
          return;
        }
      } catch (err) {
        console.warn('AI generation note, using standard deck:', err);
      }

      store.setState({ currentView: 'GAME' });
      broadcastRoomAction('START_GAME', { gameMode: store.getState().activeRoom.selectedGameMode });
      window.location.hash = '#/GAME';
    });
  }

  // Copy Room Code & Link
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const code = store.getState().activeRoom.roomCode;
      const shareUrl = `${window.location.origin}${window.location.pathname}#/ROOMS?code=${code}`;
      navigator.clipboard.writeText(shareUrl);
      audio.playBip();
      const codeText = btnCopy.querySelector('.font-mono');
      if (codeText) {
        const orig = codeText.innerText;
        codeText.innerText = 'LINK COPIED!';
        setTimeout(() => (codeText.innerText = orig), 1500);
      }
      const toastMount = document.getElementById('toast-mount');
      if (toastMount) {
        toastMount.innerHTML = `<div class="toast toast-mint show"><span class="material-symbols-outlined text-sm mr-1 text-mint-green">link</span><span>Room invite link copied! Open on laptop to join immediately.</span></div>`;
        setTimeout(() => (toastMount.innerHTML = ''), 3500);
      }
    });
  }

  // Open Vault
  if (btnVault) {
    btnVault.addEventListener('click', () => {
      audio.playClick();
      store.setState({ currentView: 'MEMORIES' });
      window.location.hash = '#/MEMORIES';
    });
  }

  // QR Modal
  if (slotInvite && modalInvite) {
    slotInvite.addEventListener('click', () => {
      audio.playClick();
      modalInvite.classList.remove('hidden');
    });
  }
  if (btnCloseInvite && modalInvite) {
    btnCloseInvite.addEventListener('click', () => {
      modalInvite.classList.add('hidden');
    });
  }

  // Template Picker clicks
  document.querySelectorAll('.btn-select-template').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const tmplId = target.getAttribute('data-template');
      const tmpl = ROOM_TEMPLATES.find((t) => t.id === tmplId);
      if (!tmpl) return;

      audio.playClick();
      const room = { ...store.getState().activeRoom, roomTemplate: tmplId, humorTone: tmpl.defaultTone };
      store.setState({ activeRoom: room });
      store.notify();
    });
  });

  // Language clicks
  document.querySelectorAll('.btn-select-language').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const lang = e.currentTarget.getAttribute('data-lang');
      audio.playClick();
      const room = { ...store.getState().activeRoom, language: lang };
      store.setState({ activeRoom: room });
      store.notify();
    });
  });

  // Humor Tone clicks
  document.querySelectorAll('.btn-select-humor').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tone = e.currentTarget.getAttribute('data-tone');
      audio.playClick();
      const room = { ...store.getState().activeRoom, humorTone: tone };
      store.setState({ activeRoom: room });
      store.notify();
    });
  });

  // Launch Spin the Bottle Arcade Game
  const btnBottle = document.getElementById('btn-launch-spin-bottle');
  if (btnBottle) {
    btnBottle.addEventListener('click', () => {
      audio.playChime();
      store.setState({ currentView: 'BOTTLE' });
      window.location.hash = '#/BOTTLE';
    });
  }

  // Rename Room in place
  const btnRename = document.getElementById('btn-rename-room');
  if (btnRename) {
    btnRename.addEventListener('click', () => {
      const current = store.getState().activeRoom.podName || '';
      const newName = prompt('Enter your squad room name:', current);
      if (newName && newName.trim()) {
        audio.playClick();
        store.updateRoomName(newName.trim());
        store.notify();
      }
    });
  }

  // Add Camper Modal Controls
  const btnOpenCamper = document.getElementById('btn-add-camper-slot');
  const modalCamper = document.getElementById('add-camper-modal');
  const btnCloseCamper = document.getElementById('btn-close-camper-modal');
  const btnConfirmCamper = document.getElementById('btn-confirm-add-camper');
  const inputCamper = document.getElementById('input-camper-name');

  if (btnOpenCamper && modalCamper) {
    btnOpenCamper.addEventListener('click', () => {
      audio.playClick();
      modalCamper.classList.remove('hidden');
      if (inputCamper) inputCamper.focus();
    });
  }
  if (btnCloseCamper && modalCamper) {
    btnCloseCamper.addEventListener('click', () => modalCamper.classList.add('hidden'));
  }
  if (btnConfirmCamper && inputCamper) {
    btnConfirmCamper.addEventListener('click', () => {
      const name = inputCamper.value.trim();
      if (!name) return;
      audio.playChime();
      store.addRoomPlayer(name);
      modalCamper.classList.add('hidden');
      inputCamper.value = '';
      store.notify();
    });
  }

  // Add Custom Squad Card Modal Controls
  const btnOpenCustomCard = document.getElementById('btn-open-custom-card-modal');
  const modalCustomCard = document.getElementById('custom-card-modal');
  const btnCloseCustomCard = document.getElementById('btn-close-custom-card-modal');
  const btnConfirmCustomCard = document.getElementById('btn-confirm-custom-card');
  const inputCardTitle = document.getElementById('input-custom-card-title');
  const inputCardQuote = document.getElementById('input-custom-card-quote');

  if (btnOpenCustomCard && modalCustomCard) {
    btnOpenCustomCard.addEventListener('click', () => {
      audio.playClick();
      modalCustomCard.classList.remove('hidden');
      if (inputCardTitle) inputCardTitle.focus();
    });
  }
  if (btnCloseCustomCard && modalCustomCard) {
    btnCloseCustomCard.addEventListener('click', () => modalCustomCard.classList.add('hidden'));
  }
  if (btnConfirmCustomCard && inputCardTitle && inputCardQuote) {
    btnConfirmCustomCard.addEventListener('click', () => {
      const title = inputCardTitle.value.trim();
      const quote = inputCardQuote.value.trim();
      if (!title) return;
      audio.playChime();
      store.addCustomRoomCard({ title, quote: quote || title });
      modalCustomCard.classList.add('hidden');
      inputCardTitle.value = '';
      inputCardQuote.value = '';
      alert('Custom Squad Card added to your active deck!');
      store.notify();
    });
  }

  // --- SQUAD LIVE VOICE LOUNGE (WebRTC) ---
  const btnVoiceConnect = document.getElementById('btn-toggle-voice-connect');
  const btnVoiceLabel = document.getElementById('btn-voice-connect-label');
  const btnMicMute = document.getElementById('btn-toggle-mic-mute');
  const btnDeafen = document.getElementById('btn-toggle-deafen');
  const voiceBadge = document.getElementById('voice-connection-badge');
  const voiceDesc = document.getElementById('voice-status-desc');
  const iconMicMute = document.getElementById('icon-mic-mute');
  const iconDeafen = document.getElementById('icon-deafen');

  if (btnVoiceConnect) {
    btnVoiceConnect.addEventListener('click', async () => {
      audio.playClick();
      if (!p2pMesh.isVoiceActive) {
        btnVoiceLabel.textContent = 'Connecting...';
        const ok = await p2pMesh.startVoiceStream();
        if (ok) {
          audio.playCorrect();
          btnVoiceLabel.textContent = 'Disconnect';
          btnVoiceConnect.className = 'px-3.5 py-1.5 rounded-full bg-sunset-coral hover:bg-sunset-coral/90 text-white text-xs font-bold font-mono transition-all active:scale-95 flex items-center gap-1.5';
          if (voiceBadge) {
            voiceBadge.textContent = 'LIVE TALKING';
            voiceBadge.className = 'px-2 py-0.5 rounded-full bg-mint-green/20 text-mint-green text-[9px] font-mono font-bold animate-pulse';
          }
          if (voiceDesc) voiceDesc.textContent = 'Open mic active • Speaking campers glow green';
          if (btnMicMute) btnMicMute.style.display = 'inline-flex';
          if (btnDeafen) btnDeafen.style.display = 'inline-flex';
        } else {
          btnVoiceLabel.textContent = 'Mic Blocked';
          if (voiceDesc) voiceDesc.textContent = 'Please allow microphone access in your browser settings';
        }
      } else {
        p2pMesh.stopVoiceStream();
        btnVoiceLabel.textContent = 'Connect Mic';
        btnVoiceConnect.className = 'px-3.5 py-1.5 rounded-full bg-[#06D6A0] hover:bg-[#06D6A0]/90 text-black text-xs font-bold font-mono transition-all active:scale-95 flex items-center gap-1.5 shadow-glow-mint';
        if (voiceBadge) {
          voiceBadge.textContent = 'DISCONNECTED';
          voiceBadge.className = 'px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-[9px] font-mono font-bold';
        }
        if (voiceDesc) voiceDesc.textContent = 'Zero-latency live squad mic powered by WebRTC';
        if (btnMicMute) btnMicMute.style.display = 'none';
        if (btnDeafen) btnDeafen.style.display = 'none';
      }
    });
  }

  if (btnMicMute) {
    btnMicMute.addEventListener('click', () => {
      audio.playClick();
      const isMuted = p2pMesh.toggleMute();
      if (iconMicMute) {
        iconMicMute.textContent = isMuted ? 'mic_off' : 'mic';
        btnMicMute.className = `p-2 rounded-full border transition-colors ${isMuted ? 'bg-sunset-coral/20 border-sunset-coral text-sunset-coral' : 'bg-surface-bright border-border text-gray-300'}`;
      }
    });
  }

  if (btnDeafen) {
    btnDeafen.addEventListener('click', () => {
      audio.playClick();
      const isDeafened = p2pMesh.toggleDeafen();
      if (iconDeafen) {
        iconDeafen.textContent = isDeafened ? 'volume_off' : 'volume_up';
        btnDeafen.className = `p-2 rounded-full border transition-colors ${isDeafened ? 'bg-amber-gold/20 border-amber-gold text-amber-gold' : 'bg-surface-bright border-border text-gray-300'}`;
      }
    });
  }

  // Live speaking listener for avatar glow
  p2pMesh.onSpeaking(({ userId, isSpeaking }) => {
    const avatarEl = document.querySelector(`[data-player-id="${userId}"]`) || document.querySelector('#lobby-player-grid .relative');
    if (avatarEl) {
      if (isSpeaking) {
        avatarEl.classList.add('ring-2', 'ring-mint-green', 'shadow-glow-mint');
      } else {
        avatarEl.classList.remove('ring-2', 'ring-mint-green', 'shadow-glow-mint');
      }
    }
  });

  // --- SPOTIFY SQUAD JUKEBOX EVENTS ---
  bindSpotifyEvents();

  // --- SUPABASE REALTIME SYNC (Mobile + Laptop Presence) ---
  const currRoom = store.getState().activeRoom;
  const currUser = store.getState().currentUser;
  if (currRoom && currRoom.roomCode) {
    syncRealtimeRoom(currRoom.roomCode, {
      id: currUser?.id,
      name: currUser?.displayName ? currUser.displayName.split(' ')[0] : 'Camper',
      avatar: currUser?.avatarUrl,
      isHost: currRoom.isHost,
    });
  }
}
