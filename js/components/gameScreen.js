// ==============================================================================
// LIVE MULTI-GAMEPLAY COMPONENT (Screen 2)
// Supports Deep, Engaging Squad Games:
// 1. ⚖️ The Red Flag Courtroom (Trial of Shame & Roast Sentences)
// 2. 🕵️ Anonymous Confession Vault (Whose Dark Secret?)
// 3. 🎯 Hot Seat Roulette (Deep & Unfiltered)
// 4. 🎭 Most Likely To... Savage Edition
// 5. 🎙️ Inside Joke Mystery Deck
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { GAME_MODES, getDeckForMode } from '../data/partyGameDecks.js';
import { initKineticWordReveal, initLiveVoteBars, init3DCardFlip } from './cardRevealInteraction.js';
import { generateDynamicGameDeck } from '../services/geminiService.js';
import { p2pMesh } from '../services/webrtcService.js';
import { renderSpotifyJukebox, bindSpotifyEvents, playSongOnSpotify } from './spotifyPlayer.js';
import { broadcastRoomAction, syncRealtimeRoom } from '../services/supabaseClient.js';

let timerInterval = null;
let confettiInstance = null;

function resolveActiveDeck(state, selectedModeId) {
  // Prioritize Gemini AI dynamic synthesized deck if present
  if (state.activeGame?.dynamicDeck && state.activeGame.dynamicDeck.length > 0) {
    return state.activeGame.dynamicDeck;
  }

  const defaultDeck = getDeckForMode(selectedModeId);
  const customList = state.customGameDeck || [];
  const roomCampers = state.activeRoom?.players || state.activeRoom?.campers || [];
  const camperNames = roomCampers.map((c) => c.name).filter(Boolean);
  const currentUserName = state.currentUser?.displayName ? state.currentUser.displayName.split(' ')[0] : 'Host (You)';

  // Dynamic roster of participants (real players only)
  const dynamicRoster = camperNames.length > 0 ? camperNames : [currentUserName];

  const adaptDeckToCampers = (deck) => {
    const participants = dynamicRoster.length > 0 ? dynamicRoster : [currentUserName];
    return deck.map((card, idx) => {
      const targetCamper = participants[idx % participants.length];
      const suspects = [...participants];
      const actualAuthor = suspects.includes(targetCamper) ? targetCamper : suspects[0];
      const options = suspects.map((name) => ({
        name,
        role: name === currentUserName ? 'Host' : 'Player',
      }));

      const sanitizeText = (str) => {
        if (!str || typeof str !== 'string') return str;
        return str.replace(/\b(The Group Chat Ghost|The Perpetual Latecomer|The Aux Dictator|The Stealth Exit Strategist|Organizer|Navigator|Storyteller|DJ)\b/g, targetCamper);
      };

      return {
        ...card,
        defendant: targetCamper,
        seatTarget: targetCamper,
        suspects: suspects,
        candidates: suspects,
        actualAuthor,
        correctAnswer: actualAuthor,
        options: options.length > 0 ? options : [{ name: currentUserName, role: 'Player' }],
        details: sanitizeText(card.details),
        exhibitSnippet: sanitizeText(card.exhibitSnippet),
        confessionContext: sanitizeText(card.confessionContext),
      };
    });
  };

  const mappedCustom = customList.map((card, idx) => {
    const author = card.author || currentUserName;
    const suspects = [...new Set([author, ...dynamicRoster])];

    return {
      round: idx + 1,
      caseNumber: `CASE #${900 + idx}`,
      defendant: author,
      charge: card.title || 'Secret Mystery',
      details: card.quote || 'Custom memory dropped into deck',
      exhibitTitle: 'Exhibit A: Real Chat Quote',
      exhibitSnippet: card.quote || '“...”',
      defensePlea: '“I have no excuse, you caught me.”',
      guiltyRoasts: ['Must buy next round of snacks for the squad', 'Must change nickname to Clown of the Week'],
      confessionId: `CONFESSION #${900 + idx}`,
      secretText: card.quote || card.title,
      submittedAt: 'Custom Vault Memory',
      shockRating: 'CUSTOM DROP',
      suspects,
      actualAuthor: author,
      confessionContext: card.quote || card.title,
      seatTarget: author,
      theme: 'CUSTOM DROP',
      question: card.quote || card.title,
      promptHint: card.title || 'Be completely honest',
      ratings: [
        { id: 'HONEST', label: '100% Brutal Truth', color: 'mint-green', icon: 'verified', xp: 350 },
        { id: 'CAP', label: 'Sugarcoated Cap', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
        { id: 'GRENADE', label: 'Unhinged Emotional Grenade', color: 'amber-gold', icon: 'bomb', xp: 500 },
      ],
      category: 'CUSTOM DROP',
      scenario: card.quote || card.title,
      candidates: suspects,
      crownTitle: card.title || 'The Mystery Agent',
      timestamp: 'Just now',
      quote: card.quote || card.title,
      correctAnswer: author,
      options: suspects.map((name) => ({ name, role: name === currentUserName ? 'Host' : 'Camper' })),
      context: card.title || 'Custom squad memory',
    };
  });

  const adaptedDefault = adaptDeckToCampers(defaultDeck);
  return customList.length === 0 ? adaptedDefault : [...mappedCustom, ...adaptedDefault];
}

export function renderGameScreen() {
  const state = store.getState();
  const game = state.activeGame || {
    roundIndex: 1,
    totalRounds: 4,
    score: 0,
    timeRemaining: 20,
    selectedOption: null,
    isAnswerRevealed: false,
  };

  const selectedModeId = state.activeRoom?.selectedGameMode || 'RED_FLAG_COURT';
  const modeMeta = GAME_MODES.find((m) => m.id === selectedModeId) || GAME_MODES[0];
  const activeDeck = resolveActiveDeck(state, selectedModeId);
  const totalRounds = activeDeck.length;
  const currentCard = activeDeck[(game.roundIndex - 1) % activeDeck.length];

  const user = state.currentUser;
  const currentUserName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
  const userAvatar = (user && user.avatarUrl) ? user.avatarUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUserName)}`;

  return `
    <div class="relative w-full max-w-[640px] mx-auto px-4 pt-6 pb-24 select-none text-on-surface">
      <!-- Ambient Backdrops -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-sunset-coral/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-80 right-2 w-64 h-64 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Top Status HUD -->
      <div class="flex items-center justify-between gap-2 w-full pt-1 pb-3">
        <!-- Left: Round Indicator -->
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm border border-border/50">
          <span class="material-symbols-outlined text-secondary text-[16px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
          <span class="font-label-md text-label-md tracking-wider text-secondary font-bold">ROUND ${game.roundIndex}/${totalRounds}</span>
        </div>

        <!-- Center: Split-Flap Countdown Timer -->
        <div class="split-flap-container shadow-glow-amber" title="Mechanical Split-Flap Countdown">
          <span class="text-[12px] mr-1">⏱️</span>
          <div class="split-flap-digit" id="game-flap-m">0</div>
          <span class="font-mono text-amber-gold font-bold">:</span>
          <div class="split-flap-digit" id="game-flap-s1">${Math.floor(game.timeRemaining / 10)}</div>
          <div class="split-flap-digit" id="game-flap-s2">${game.timeRemaining % 10}</div>
          <span class="text-[10px] font-mono text-gray-400 ml-1">left</span>
        </div>

        <!-- Right: Pod Score -->
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm border border-border/50">
          <span class="material-symbols-outlined text-secondary text-[16px]" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
          <span class="font-label-md text-label-md text-on-surface"><span id="game-score-display" class="tabular-nums font-bold">${game.score}</span> <span class="text-secondary font-semibold">PTS</span></span>
        </div>
      </div>

      <!-- Category & Game Mode Switcher Pill & Host Soundboard Suite -->
      <div class="flex flex-wrap items-center justify-center gap-2 my-1.5">
        <button id="btn-game-switch-mode" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-sunset-coral/40 shadow-[0_0_12px_rgba(255,90,95,0.18)] hover:brightness-110 active:scale-95 transition-all cursor-pointer">
          <span class="material-symbols-outlined text-base text-amber-gold">${modeMeta.icon || 'videogame_asset'}</span>
          <span class="font-label-md text-label-md tracking-wider text-primary-container uppercase font-bold">${modeMeta.name}</span>
          <span class="text-surface-variant text-[10px]">•</span>
          <span class="font-label-md text-caption uppercase tracking-wider text-amber-gold font-bold">Switch Mode</span>
          <span class="material-symbols-outlined text-[14px] text-amber-gold">tune</span>
        </button>

        <!-- Gemini AI Dynamic Synthesis Pill -->
        <button id="btn-gemini-ai-refresh" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-amber-gold/50 text-amber-gold text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm hover:bg-amber-gold/20" title="Synthesize Brand New Cards with Gemini AI">
          <span class="material-symbols-outlined text-[15px] text-amber-gold">auto_awesome</span>
          <span>AI Remix Deck</span>
        </button>

        <!-- TV Presentation Mode Cast Button -->
        <button id="btn-cast-tv-mode" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border hover:border-mint-green/60 text-mint-green text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm" title="Launch TV Living Room Display Mode">
          <span class="material-symbols-outlined text-[15px]">tv</span>
          <span>TV Mode</span>
        </button>

        <!-- Host Soundboard Toggle -->
        <button id="btn-toggle-soundboard" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border hover:border-amber-gold/60 text-amber-gold text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm" title="Host Comedy Soundboard">
          <span class="material-symbols-outlined text-[15px]">volume_up</span>
          <span>FX Soundboard</span>
        </button>

        <!-- Squad Live Voice Chat Mic Toggle -->
        <button id="btn-game-voice-mic" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border hover:border-mint-green/60 text-gray-300 text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm" title="Toggle Squad Live Mic">
          <span class="material-symbols-outlined text-[15px] text-mint-green" id="game-voice-mic-icon">mic_off</span>
          <span id="game-voice-mic-text">Squad Mic</span>
        </button>

        <!-- Spotify Squad Jukebox Toggle -->
        <button id="btn-game-open-spotify" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border hover:border-[#1DB954]/60 text-[#1DB954] text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm" title="Spotify Squad Jukebox">
          <span class="material-symbols-outlined text-[15px]">graphic_eq</span>
          <span>Jukebox</span>
        </button>
      </div>

      <!-- Host Soundboard Drawer (Collapsible) -->
      <div id="host-soundboard-drawer" class="w-full bg-surface-container-high/95 border border-amber-gold/40 rounded-2xl p-3 my-2 shadow-xl flex flex-col gap-2" style="display: none;">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-amber-gold text-[16px]">spatial_audio_off</span>
            <span class="text-xs font-bold text-amber-gold uppercase tracking-wider">Host Soundboard (Live FX)</span>
          </div>
          <span class="text-[10px] text-gray-400 font-mono">Zero-Latency Web Audio</span>
        </div>
        <div class="grid grid-cols-5 gap-1.5 text-center">
          <button class="btn-sfx p-2 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-xs font-bold text-red-400 flex flex-col items-center gap-0.5 border border-red-500/20" data-sfx="wrong">
            <span class="material-symbols-outlined text-sm text-red-400">notifications_active</span>
            <span class="text-[10px] font-mono truncate">Buzzer</span>
          </button>
          <button class="btn-sfx p-2 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-xs font-bold text-amber-gold flex flex-col items-center gap-0.5 border border-amber-gold/20" data-sfx="airhorn">
            <span class="material-symbols-outlined text-sm text-amber-gold">campaign</span>
            <span class="text-[10px] font-mono truncate">Airhorn</span>
          </button>
          <button class="btn-sfx p-2 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-xs font-bold text-mint-green flex flex-col items-center gap-0.5 border border-mint-green/20" data-sfx="rimshot">
            <span class="material-symbols-outlined text-sm text-mint-green">music_note</span>
            <span class="text-[10px] font-mono truncate">Rimshot</span>
          </button>
          <button class="btn-sfx p-2 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-xs font-bold text-secondary flex flex-col items-center gap-0.5 border border-secondary/20" data-sfx="cheer">
            <span class="material-symbols-outlined text-sm text-secondary">celebration</span>
            <span class="text-[10px] font-mono truncate">Cheer</span>
          </button>
          <button class="btn-sfx p-2 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-xs font-bold text-gray-400 flex flex-col items-center gap-0.5 border border-border" data-sfx="crickets">
            <span class="material-symbols-outlined text-sm text-gray-400">volume_off</span>
            <span class="text-[10px] font-mono truncate">Silence</span>
          </button>
        </div>
      </div>

      <!-- DYNAMIC GAME MODE VIEWPORTS -->
      ${renderActiveGameModeViewport(selectedModeId, currentCard, game, currentUserName, userAvatar)}

      <!-- Bottom Quick-Roast Interactive Reactions Console -->
      <div class="w-full mt-4 p-3.5 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-border/70 shadow-xl flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-1.5 w-full">
          <span class="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold shrink-0">Live Reactions:</span>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="reaction-container">
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-icon="sentiment_very_satisfied" data-color="#FFB703" type="button">
              <span class="material-symbols-outlined text-sm text-amber-gold">sentiment_very_satisfied</span>
              <span class="font-label-md text-caption text-on-surface count font-mono">14</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-icon="mood_bad" data-color="#F72585" type="button">
              <span class="material-symbols-outlined text-sm text-rose-glow">mood_bad</span>
              <span class="font-label-md text-caption text-on-surface count font-mono">28</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-icon="flag" data-color="#FF5A5F" type="button">
              <span class="material-symbols-outlined text-sm text-primary">flag</span>
              <span class="font-label-md text-caption text-primary count font-mono">9</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-icon="movie" data-color="#06D6A0" type="button">
              <span class="material-symbols-outlined text-sm text-secondary">movie</span>
              <span class="font-label-md text-caption text-secondary count font-mono">12</span>
            </button>
          </div>
          <!-- Quick Buzzer / Send Reaction Pin & Private Panic Button -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button id="btn-panic-soften" class="px-2.5 py-1.5 rounded-full bg-surface-container-high border border-sunset-coral/40 hover:bg-sunset-coral/20 text-sunset-coral font-label-md text-caption font-bold flex items-center gap-1 transition-all active:scale-95" title="Private Panic Button: anonymously swap this card if uncomfortable">
              <span class="material-symbols-outlined text-[15px]">security</span>
              <span class="hidden sm:inline">Soften</span>
            </button>
            <button id="btn-reveal-now" class="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-caption font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <span>Reveal Now</span>
              <span class="material-symbols-outlined text-xs">bolt</span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-surface-variant/30 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-secondary text-[15px]">auto_stories</span>
            <span class="font-caption text-caption text-on-surface-variant">
              Auto-archiving highlights into <span class="text-secondary font-semibold">2026 Photobook</span>
            </span>
          </div>
          <span class="font-caption text-caption text-tertiary font-bold tracking-wide font-mono">+250 XP</span>
        </div>
      </div>

      <!-- In-Game Mode Switcher Modal -->
      <div id="game-mode-modal" class="fixed inset-0 bg-canvas/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="max-w-lg w-full rounded-2xl bg-surface-container p-5 sm:p-6 border border-border shadow-2xl">
          <div class="flex justify-between items-center pb-3 mb-4 border-b border-border/80">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-2xl text-amber-gold">bolt</span>
              <div>
                <h3 class="font-headline-sm text-base sm:text-lg text-white font-bold">Switch Party Game</h3>
                <p class="text-xs text-on-surface-variant">Change the mode instantly for the whole squad</p>
              </div>
            </div>
            <button class="w-8 h-8 rounded-full bg-surface-bright hover:bg-surface-container-high flex items-center justify-center text-white" id="btn-close-game-mode-modal"><span class="material-symbols-outlined text-sm">close</span></button>
          </div>

          <div class="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            ${GAME_MODES.map((mode) => {
              const isCurrent = mode.id === selectedModeId;
              return `
                <button class="btn-select-game-mode text-left p-3.5 rounded-xl border ${isCurrent ? 'bg-primary-container/15 border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest/80 border-border/70 hover:border-border hover:bg-surface-container-high'} transition-all active:scale-[0.99] flex items-start gap-3 group cursor-pointer" data-mode="${mode.id}">
                  <span class="material-symbols-outlined text-2xl shrink-0 mt-0.5 text-amber-gold">${mode.icon || 'sports_esports'}</span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="font-headline-sm text-sm font-bold text-white group-hover:text-sunset-coral transition-colors">${mode.name}</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${isCurrent ? 'bg-sunset-coral text-canvas' : 'bg-surface-container-high text-gray-400'}">${mode.badgeText}</span>
                    </div>
                    <p class="text-xs text-amber-gold/90 font-medium mb-1">${mode.tagline}</p>
                    <p class="text-[11px] text-gray-400 leading-relaxed">${mode.description}</p>
                  </div>
                  <div class="shrink-0 mt-1">
                    <span class="material-symbols-outlined text-[18px] ${isCurrent ? 'text-sunset-coral' : 'text-gray-600'}">${isCurrent ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// VIEWPORT DISPATCHER: Renders specific game card layout
// ------------------------------------------------------------------------------
function renderActiveGameModeViewport(modeId, card, game, currentUserName, userAvatar) {
  switch (modeId) {
    case 'OUR_LORE':
      return renderOurLoreView(card, game, currentUserName);
    case 'WHO_SAID_THIS':
      return renderWhoSaidThisView(card, game, currentUserName);
    case 'REEL_COURT':
      return renderReelCourtView(card, game, currentUserName);
    case 'EMOJI_CINEMA':
      return renderEmojiCinemaView(card, game, currentUserName);
    case 'RED_FLAG_COURT':
      return renderRedFlagCourtView(card, game, currentUserName);
    case 'CONFESSION_VAULT':
      return renderConfessionVaultView(card, game, currentUserName);
    case 'HOT_SEAT_ROULETTE':
      return renderHotSeatView(card, game, currentUserName);
    case 'MOST_LIKELY_TO':
      return renderMostLikelyToView(card, game, currentUserName);
    case 'INSIDE_JOKE_VAULT':
    default:
      return renderInsideJokeView(card, game, currentUserName, userAvatar);
  }
}

// ==============================================================================
// 2.0 INDIAN CULTURE VIEWPORT RENDERERS
// ==============================================================================

// A. OUR LORE VIEW
function renderOurLoreView(card, game, currentUserName) {
  const options = card.options || [
    'Left inside the rented scooter',
    'Dropped in the beach shack sand',
    'Accidentally thrown in the trash bag',
    'Still with Kabir in Mumbai'
  ];
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden" id="lore-card">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-sunset-coral/20 text-sunset-coral text-[10px] font-mono font-bold tracking-widest uppercase">OUR LORE · ROUND ${card.round || 1}</span>
          <span class="text-xs text-gray-400 font-mono">${card.exhibitDate || 'October 2024'}</span>
        </div>
        <span class="retro-pixel-badge px-2 py-0.5 rounded-full bg-amber-gold/15 text-amber-gold text-[9px] border border-amber-gold/30 inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px]">history_edu</span>
          <span>GROUP CANON</span>
        </span>
      </div>

      <div class="my-4">
        <h3 class="font-headline-sm text-lg font-bold text-white mb-1.5">${card.title || 'The Goa Trip That Was Supposed to Be Relaxing'}</h3>
        <p class="text-xs text-gray-300 leading-relaxed font-mono">${card.prompt || 'What was the EXACT sequence of events on Night 2 when the Airbnb key vanished?'}</p>
      </div>

      ${card.coverImage ? `
        <div class="mb-4 rounded-xl overflow-hidden border border-border/60 h-36 w-full relative">
          <img src="${card.coverImage}" class="w-full h-full object-cover" alt="Exhibit Photo" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span class="text-[10px] font-mono text-white/90 inline-flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px] text-mint-green">verified</span>
              <span>Verified Squad Exhibit Photo</span>
            </span>
          </div>
        </div>
      ` : ''}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3" id="game-option-grid">
        ${options.map((opt, idx) => {
          const optText = typeof opt === 'string' ? opt : (opt.text || opt.name);
          const isSelected = game.selectedOption === optText;
          return `
            <button class="game-opt-btn p-3.5 rounded-xl border ${isSelected ? 'bg-sunset-coral text-white border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest border-border/80 text-gray-200 hover:border-sunset-coral/50'} text-left text-xs font-bold transition-all active:scale-98 cursor-pointer flex items-start gap-2.5" data-option="${optText}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <span class="w-5 h-5 rounded-full bg-surface-bright flex items-center justify-center text-[10px] font-mono shrink-0 ${isSelected ? 'text-sunset-coral bg-white' : 'text-gray-400'}">${String.fromCharCode(65 + idx)}</span>
              <span class="leading-snug">${optText}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Lore Reveal & Official Canon Seal -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-sunset-coral/40 shadow-xl" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center gap-2 text-sunset-coral font-bold text-sm mb-2">
          <span class="retro-pixel-badge inline-flex items-center gap-1.5 text-xs text-sunset-coral">
            <span class="material-symbols-outlined text-sm">auto_stories</span>
            <span>THE SQUAD HAS SPOKEN:</span>
          </span>
        </div>
        <div class="p-3 rounded-lg bg-surface border border-border text-xs text-amber-gold font-mono leading-relaxed mb-3">
          ${card.officialCanon || 'Kabir had the key the whole time while the rest of the squad searched the beach with phone torches.'}
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-mint-green font-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">verified</span>
            Added to 2026 Group Memory Graph
          </span>
          <button id="btn-next-round" class="px-5 py-2 rounded-full bg-sunset-coral text-white font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
            <span>Next Lore</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// B. WHO SAID THIS VIEW
function renderWhoSaidThisView(card, game, currentUserName) {
  const roomCampers = (store.getState().activeRoom?.players || []).map((p) => p.name).filter(Boolean);
  const suspects = card.suspects && card.suspects.length > 0 ? card.suspects : (roomCampers.length > 0 ? roomCampers : [currentUserName]);
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden" id="who-said-card">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="retro-pixel-badge px-2.5 py-0.5 rounded bg-amber-gold/20 text-amber-gold text-[9px] tracking-widest uppercase">WHO SAID THIS? · CHAT EXPOSE</span>
        <span class="inline-flex items-center gap-1 text-xs text-sunset-coral font-bold font-mono">
          <span class="material-symbols-outlined text-sm">chat</span>
          <span>UNFILTERED QUOTE</span>
        </span>
      </div>

      <!-- Chat Bubble Exhibit -->
      <div class="my-4 p-5 rounded-2xl bg-[#0B141A] border border-[#202C33] shadow-inner relative">
        <div class="text-[10px] font-mono text-gray-400 mb-1.5 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-mint-green"></span>
          <span>${card.context || 'WhatsApp Group Chat · 10:45 PM'}</span>
        </div>
        <p class="font-display text-base sm:text-lg text-white font-bold leading-relaxed">
          ${card.quote || '“Maine pehle hi bola tha ki plan cancel hoga, ab sab mujhe biryani khilao.”'}
        </p>
      </div>

      <div class="text-center my-3">
        <h4 class="font-display text-sm font-bold text-white">Spot the friend who sent this message:</h4>
      </div>

      <!-- Suspects Grid -->
      <div class="grid grid-cols-2 gap-2.5 mb-3" id="game-option-grid">
        ${suspects.map((suspect) => {
          const isSelected = game.selectedOption === suspect;
          return `
            <button class="game-opt-btn p-3 rounded-xl border ${isSelected ? 'bg-amber-gold text-canvas border-amber-gold shadow-sm font-bold' : 'bg-surface-container-lowest border-border/80 text-gray-200 hover:border-amber-gold/50'} flex items-center gap-2.5 text-left text-xs font-bold transition-all active:scale-98 cursor-pointer" data-option="${suspect}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(suspect)}" class="w-8 h-8 rounded-lg bg-surface-bright shrink-0" />
              <span class="truncate">${suspect}</span>
            </button>
          `;
        })}
      </div>

      <!-- Reveal Banner -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-amber-gold/40 shadow-xl" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center gap-2 text-amber-gold font-bold text-sm mb-1.5">
          <span>EXPOSED: It was ${card.correctSuspect || suspects[0] || currentUserName}!</span>
        </div>
        <p class="text-xs text-gray-300 font-mono mb-3">${card.revealedSnippet || `${card.correctSuspect || suspects[0] || currentUserName} was caught live in the chat.`}</p>
        <div class="flex justify-end">
          <button id="btn-next-round" class="px-5 py-2 rounded-full bg-amber-gold text-canvas font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1">
            <span>Next Quote</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// C. REEL COURT VIEW
function renderReelCourtView(card, game, currentUserName) {
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden" id="reel-court-card">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="retro-pixel-badge px-2.5 py-0.5 rounded bg-mint-green/20 text-mint-green text-[9px] tracking-widest uppercase inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">movie</span>
          <span>THE REEL COURTROOM</span>
        </span>
        <span class="text-xs text-amber-gold font-bold font-mono">EXHIBIT A HEARING</span>
      </div>

      <div class="my-4">
        <h3 class="font-headline-sm text-base font-bold text-white mb-1 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-sm text-sunset-coral">gavel</span>
          <span>${card.caseTitle || 'The 7-Minute Voice Note Felony'}</span>
        </h3>
        <p class="text-xs text-gray-300 font-mono">${card.charge || 'Sending a podcast episode instead of typing “Reach safely”'}</p>
      </div>

      <div class="p-3 rounded-xl bg-[#0B141A] border border-[#202C33] text-xs font-mono text-gray-300 mb-4">
        <div class="text-[10px] text-amber-gold font-bold mb-1">DEFENSE PLEA:</div>
        ${card.plea || '“My emotional nuance cannot be captured by mere alphabets.”'}
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <button class="game-opt-btn p-3 rounded-xl border ${game.selectedOption === 'GUILTY' ? 'bg-sunset-coral text-white border-sunset-coral' : 'bg-surface-container-lowest border-border'} font-bold text-xs" data-option="GUILTY" ${game.isAnswerRevealed ? 'disabled' : ''}>
          <span class="inline-flex items-center gap-1.5 justify-center"><span class="material-symbols-outlined text-sm">gavel</span><span>100% GUILTY</span></span>
        </button>
        <button class="game-opt-btn p-3 rounded-xl border ${game.selectedOption === 'RELATABLE' ? 'bg-mint-green text-canvas border-mint-green' : 'bg-surface-container-lowest border-border'} font-bold text-xs" data-option="RELATABLE" ${game.isAnswerRevealed ? 'disabled' : ''}>
          <span class="inline-flex items-center gap-1.5 justify-center"><span class="material-symbols-outlined text-sm">sentiment_satisfied</span><span>RELATABLE (PASS)</span></span>
        </button>
      </div>

      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-mint-green/40 shadow-xl" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="text-mint-green font-bold text-sm mb-2 font-mono">VERDICT: SENTENCE PRONOUNCED!</div>
        <p class="text-xs text-gray-300 mb-3">${(card.punishments && card.punishments[0]) || 'Must buy cutting chai for the squad.'}</p>
        <div class="flex justify-end">
          <button id="btn-next-round" class="px-5 py-2 rounded-full bg-mint-green text-canvas font-bold text-xs font-mono">Next Case</button>
        </div>
      </div>
    </div>
  `;
}

// D. EMOJI CINEMA VIEW
function renderEmojiCinemaView(card, game, currentUserName) {
  const options = card.options || ['Dilwale Dulhania Le Jayenge', 'Jab We Met', 'Chennai Express', 'Gadar'];
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden" id="emoji-cinema-card">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="retro-pixel-badge px-2.5 py-0.5 rounded bg-amber-gold/20 text-amber-gold text-[9px] tracking-widest uppercase inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">theaters</span>
          <span>CINEMA PUZZLE</span>
        </span>
        <span class="text-xs text-white font-mono">BOLLYWOOD GUESS</span>
      </div>

      <div class="my-6 text-center">
        <div class="flex items-center justify-center gap-3 mb-4 flex-wrap">
          ${(card.icons || ['train', 'air', 'directions_run', 'man', 'handshake', 'local_florist']).map(icon => `
            <div class="w-11 h-11 rounded-xl bg-surface-container-high border border-amber-gold/40 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl text-amber-gold">${icon}</span>
            </div>
          `).join('')}
        </div>
        <h4 class="font-display text-sm font-bold text-white">${card.prompt || 'Guess the iconic Bollywood film from the vector clue sequence:'}</h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3" id="game-option-grid">
        ${options.map((opt, idx) => {
          const isSelected = game.selectedOption === opt;
          return `
            <button class="game-opt-btn p-3.5 rounded-xl border ${isSelected ? 'bg-amber-gold text-canvas border-amber-gold font-bold' : 'bg-surface-container-lowest border-border text-gray-200 hover:border-amber-gold/50'} text-left text-xs font-bold transition-all active:scale-98 cursor-pointer" data-option="${opt}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              ${opt}
            </button>
          `;
        })}
      </div>

      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-amber-gold/40 shadow-xl" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="text-amber-gold font-bold text-sm mb-1.5">BOLLYWOOD CANON: ${options[card.correctIndex || 0]}!</div>
        <p class="text-xs text-gray-300 italic font-serif mb-3">${card.iconicDialogue || '“Ja Simran ja, jee le apni zindagi!”'}</p>
        <div class="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/50">
          <button class="btn-play-cinema-spotify inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/60 text-[#1DB954] font-bold text-xs hover:bg-[#1DB954]/30 transition-all cursor-pointer" data-movie="${options[card.correctIndex || 0]}">
            <span class="material-symbols-outlined text-sm">queue_music</span>
            <span>Listen on Spotify</span>
          </button>
          <button id="btn-next-round" class="px-5 py-2 rounded-full bg-amber-gold text-canvas font-bold text-xs">Next Scene</button>
        </div>
      </div>
    </div>
  `;
}

// 1. THE RED FLAG COURTROOM VIEW
function renderRedFlagCourtView(card, game, currentUserName) {
  const isGuiltyChosen = game.selectedOption === 'GUILTY';
  const isAcquittedChosen = game.selectedOption === 'ACQUITTED';

  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden" id="court-card">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-sunset-coral/20 text-sunset-coral text-[10px] font-mono font-bold tracking-widest uppercase">${card.caseNumber}</span>
          <span class="text-xs text-gray-400">Supreme Court of Bondfire</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold text-amber-gold font-mono">
          <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-sm text-amber-gold">gavel</span><span>JURY TRIAL</span></span>
        </div>
      </div>

      <!-- Defendant Banner -->
      <div class="my-4 p-4 rounded-xl bg-surface-container-lowest border border-border/60 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-high border-2 border-sunset-coral shadow shrink-0">
            <img class="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(card.defendant)}" alt="${card.defendant}" />
          </div>
          <div>
            <div class="text-[10px] font-mono uppercase text-sunset-coral font-bold tracking-wider">DEFENDANT AT THE STAND</div>
            <h3 class="font-headline-sm text-lg font-bold text-white">${card.defendant}</h3>
          </div>
        </div>
        <span class="retro-pixel-badge px-3 py-1 rounded-full bg-surface-container-high text-[9px] text-gray-300 border border-border/50">ON TRIAL</span>
      </div>

      <!-- The Charge -->
      <div class="mb-3">
        <div class="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider mb-1">THE CHARGE:</div>
        <div class="p-3.5 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30">
          <div class="font-headline-sm text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-coral-red">warning</span>
            <span>${card.charge}</span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed">${card.details}</p>
        </div>
      </div>

      <!-- Exhibit A Evidence -->
      <div class="mb-3 p-3.5 rounded-xl bg-[#0B141A] border border-[#202C33]">
        <div class="text-[10px] font-mono text-amber-gold uppercase font-bold mb-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-[13px]">attach_file</span>
          <span>${card.exhibitTitle}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-surface-container-lowest/80 text-xs font-mono text-gray-300 italic border border-border/40">
          ${card.exhibitSnippet}
        </div>
      </div>

      <!-- Defense Plea -->
      <div class="mb-4 p-3 rounded-xl bg-surface-container-lowest border border-border/60">
        <div class="text-[10px] font-mono text-gray-400 uppercase font-bold mb-1">DEFENDANT'S DESPERATE PLEA:</div>
        <p class="text-xs italic text-gray-200 leading-relaxed">${card.defensePlea}</p>
      </div>

      <!-- Active Juror Foreperson Tag -->
      <div class="mb-3 p-2.5 rounded-xl bg-surface-container-lowest border border-border/60 flex items-center justify-between">
        <span class="text-xs text-gray-400 font-mono">Foreperson Juror:</span>
        <button class="game-opt-btn px-3 py-1 rounded-lg bg-surface-bright border border-sunset-coral/40 text-xs font-bold text-white flex items-center gap-1.5" data-option="${currentUserName}" type="button">
          <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
          <span>${currentUserName} (You)</span>
        </button>
      </div>

      <!-- Interactive Jury Verdict Buttons -->
      <div class="grid grid-cols-2 gap-3 mb-2" id="court-verdict-grid">
        <button class="game-opt-btn p-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 border ${isGuiltyChosen ? 'bg-sunset-coral text-white border-sunset-coral shadow-glow-coral' : 'bg-surface-container-high hover:bg-sunset-coral/20 border-border text-white'}" data-option="GUILTY" ${game.isAnswerRevealed ? 'disabled' : ''}>
          <span class="inline-flex items-center gap-1.5"><span class="material-symbols-outlined text-base">gavel</span><span>GUILTY (ROAST 'EM)</span></span>
        </button>
        <button class="game-opt-btn p-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 border ${isAcquittedChosen ? 'bg-mint-green text-canvas border-mint-green shadow-sm' : 'bg-surface-container-high hover:bg-mint-green/20 border-border text-white'}" data-option="ACQUITTED" ${game.isAnswerRevealed ? 'disabled' : ''}>
          <span class="inline-flex items-center gap-1.5"><span class="material-symbols-outlined text-base">sentiment_satisfied</span><span>ACQUITTED (PITY PASS)</span></span>
        </button>
      </div>

      <!-- Verdict Reveal & Sentencing Roasts -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-amber-gold/50 shadow-xl" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center justify-center gap-2 text-amber-gold font-headline-sm text-base font-bold mb-2 font-arcade">
          <span class="inline-flex items-center gap-1.5"><span class="material-symbols-outlined text-base">gavel</span><span>JURY VERDICT: 100% GUILTY!</span></span>
        </div>
        <div class="text-xs text-gray-300 text-center mb-3">
          The court sentences <strong>${card.defendant}</strong> to choose one of the following public punishments:
        </div>
        <div class="space-y-2 mb-4">
          ${card.guiltyRoasts.map((roast, idx) => `
            <div class="p-2.5 rounded-lg bg-surface-container border border-border/70 text-xs text-gray-200 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-sunset-coral/20 text-sunset-coral font-bold text-[10px] flex items-center justify-center shrink-0">#${idx + 1}</span>
              <span>${roast}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-center">
          <button id="btn-next-round" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-sm shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
            <span>NEXT CASE</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 2. ANONYMOUS CONFESSION VAULT VIEW
function renderConfessionVaultView(card, game) {
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="px-2.5 py-0.5 rounded bg-amber-gold/20 text-amber-gold text-[10px] font-mono font-bold tracking-widest">${card.confessionId}</span>
        <span class="text-xs font-bold text-sunset-coral">${card.shockRating}</span>
      </div>

      <!-- Anonymous Secret Parchment -->
      <div class="my-4 p-5 rounded-xl bg-[#14120E] border border-amber-gold/30 shadow-inner relative">
        <div class="absolute top-2 right-2 text-amber-gold/20 text-4xl select-none font-serif">“</div>
        <p class="font-body-md text-sm sm:text-base text-amber-gold/90 leading-relaxed font-mono">
          ${card.secretText}
        </p>
        <div class="mt-3 pt-2 border-t border-amber-gold/20 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>${card.submittedAt}</span>
          <span class="text-mint-green inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">lock</span>
            <span>Encrypted Vault Drop</span>
          </span>
        </div>
      </div>

      <div class="text-center my-3">
        <h3 class="font-headline-sm text-sm sm:text-base font-bold text-white">Who in this room committed this atrocity?</h3>
        <p class="text-xs text-gray-400 font-mono">Lock in your suspect before time expires</p>
      </div>

      <!-- Suspect Grid -->
      <div class="grid grid-cols-2 gap-2.5 mb-2" id="game-option-grid">
        ${card.suspects.map((suspect) => {
          const isSelected = game.selectedOption === suspect;
          return `
            <button class="game-opt-btn p-3 rounded-xl border ${isSelected ? 'bg-primary-container/20 border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest border-border/80'} flex items-center gap-3 text-left transition-all active:scale-98 cursor-pointer" data-option="${suspect}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-high shrink-0 border border-border">
                <img class="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(suspect)}" alt="${suspect}" />
              </div>
              <div class="min-w-0 flex-1">
                <span class="font-label-lg text-sm text-white block truncate font-bold">${suspect}</span>
                <span class="text-[10px] text-gray-400 block font-mono">${isSelected ? 'LOCKED IN' : 'SUSPECT'}</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Reveal Result -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-tertiary/60 shadow-xl text-center" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center justify-center gap-2 text-tertiary font-headline-sm text-base font-bold mb-1 font-arcade">
          <span class="inline-flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">visibility</span>
            <span>CULPRIT REVEALED: ${card.actualAuthor}!</span>
          </span>
        </div>
        <p class="text-xs text-gray-300 italic mb-4 font-mono">
          ${card.confessionContext}
        </p>
        <button id="btn-next-round" class="px-6 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 font-mono">
          <span>NEXT CONFESSION</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// 3. HOT SEAT ROULETTE VIEW
function renderHotSeatView(card, game) {
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border-2 border-sunset-coral/50 overflow-hidden shadow-glow-coral">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="retro-pixel-badge px-2.5 py-0.5 rounded bg-duo-rose/20 text-duo-rose text-[9px] tracking-widest">${card.theme}</span>
        <span class="text-xs font-bold text-amber-gold flex items-center gap-1 font-mono">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          HOT SEAT ACTIVE
        </span>
      </div>

      <!-- Spotlight Player Card -->
      <div class="my-4 p-4 rounded-xl bg-gradient-to-r from-sunset-coral/15 to-amber-gold/15 border border-sunset-coral/40 flex items-center gap-4">
        <div class="relative">
          <div class="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-high border-2 border-sunset-coral shadow-lg">
            <img class="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(card.seatTarget)}" alt="${card.seatTarget}" />
          </div>
          <span class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-sunset-coral text-white flex items-center justify-center shadow">
            <span class="material-symbols-outlined text-xs">local_fire_department</span>
          </span>
        </div>
        <div>
          <div class="text-[10px] font-mono uppercase text-sunset-coral font-bold">SPOTLIGHT CAMPER</div>
          <h3 class="font-headline-sm text-lg sm:text-xl font-extrabold text-white">${card.seatTarget} on the Hot Seat</h3>
        </div>
      </div>

      <!-- Deep Unfiltered Question -->
      <div class="my-4 p-4 rounded-xl bg-surface-container-lowest border border-border/70 text-center">
        <p class="font-display text-base sm:text-lg font-bold text-white leading-snug">
          ${card.question}
        </p>
        <p class="text-xs text-amber-gold/80 mt-2 italic font-mono">
          Rules: ${card.promptHint}
        </p>
      </div>

      <div class="text-center mb-2">
        <span class="text-[11px] font-mono text-gray-400 uppercase font-bold">Squad Lie Detector / Truth Rating:</span>
      </div>

      <!-- 3 Truth Ratings -->
      <div class="grid grid-cols-3 gap-2 mb-3" id="game-option-grid">
        ${card.ratings.map((r) => {
          const isSelected = game.selectedOption === r.id;
          return `
            <button class="game-opt-btn p-2.5 rounded-xl border ${isSelected ? 'bg-primary-container/20 border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest border-border/70'} flex flex-col items-center text-center transition-all active:scale-95 cursor-pointer" data-option="${r.id}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <span class="material-symbols-outlined text-[20px] text-amber-gold mb-1">${r.icon}</span>
              <span class="font-bold text-xs text-white leading-tight font-mono">${r.label}</span>
              <span class="text-[10px] text-tertiary font-bold mt-1 font-mono">+${r.xp} XP</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Reveal Banner -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-mint-green/60 shadow-xl text-center" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="text-mint-green font-headline-sm text-base font-bold mb-1 font-arcade">
          <span class="inline-flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-mint-green">auto_awesome</span>
            <span>VULNERABILITY REWARD GRANTED! (+350 Sparks)</span>
          </span>
        </div>
        <p class="text-xs text-gray-300 mb-3 font-mono">Hot seat truth verified by the squad. Archived in the 2026 Yearbook.</p>
        <button id="btn-next-round" class="px-6 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 font-mono">
          <span>NEXT HOT SEAT</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// 4. MOST LIKELY TO... SAVAGE EDITION VIEW
function renderMostLikelyToView(card, game) {
  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-2xl border border-border/80 overflow-hidden">
      <div class="flex items-center justify-between pb-3 border-b border-border/70">
        <span class="retro-pixel-badge px-2.5 py-0.5 rounded bg-mint-green/20 text-mint-green text-[9px] tracking-widest">${card.category}</span>
        <span class="text-xs font-bold text-sunset-coral flex items-center gap-1 font-mono">
          <span class="material-symbols-outlined text-[14px]">bolt</span> RAPID FIRE POINTING
        </span>
      </div>

      <!-- The Scenario -->
      <div class="my-5 p-5 rounded-2xl bg-surface-container-lowest border border-border/80 text-center shadow-inner">
        <span class="text-xs font-mono text-gray-400 uppercase font-bold block mb-2 font-arcade">SCENARIO:</span>
        <h3 class="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
          ${card.scenario}
        </h3>
      </div>

      <div class="text-center mb-3">
        <span class="text-xs text-gray-400 font-bold font-mono">Everyone vote simultaneously! Who is getting crowned?</span>
      </div>

      <!-- Candidate Selection Grid -->
      <div class="grid grid-cols-2 gap-3 mb-3" id="game-option-grid">
        ${card.candidates.map((cand) => {
          const isSelected = game.selectedOption === cand;
          return `
            <button class="game-opt-btn p-3.5 rounded-xl border ${isSelected ? 'bg-primary-container/20 border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest border-border/80'} flex items-center gap-3 text-left transition-all active:scale-98 cursor-pointer" data-option="${cand}" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-high shrink-0 border border-border">
                <img class="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cand)}" alt="${cand}" />
              </div>
              <div class="min-w-0 flex-1">
                <span class="font-label-lg text-sm text-white block truncate font-bold">${cand}</span>
                <span class="text-[10px] text-amber-gold block font-mono">${isSelected ? 'POINTED' : 'VOTE'}</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Reveal Banner -->
      <div id="game-reveal-banner" class="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-amber-gold/60 shadow-xl text-center" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="text-amber-gold font-headline-sm text-base font-bold mb-1 font-arcade">
          <span class="inline-flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">hotel_class</span>
            <span>CROWN AWARDED: ${card.crownTitle}!</span>
          </span>
        </div>
        <p class="text-xs text-gray-300 mb-3 font-mono">Majority consensus reached! Badge stamped to player dossier.</p>
        <button id="btn-next-round" class="px-6 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 font-mono">
          <span>NEXT SCENARIO</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// 5. INSIDE JOKE MYSTERY DECK VIEW (Upgraded classic)
function renderInsideJokeView(card, game, currentUserName, userAvatar) {
  const options = card.options.map((opt) => {
    if (opt.name === currentUserName) {
      return { ...opt, avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(opt.name)}` };
    }
    return { ...opt, avatar: opt.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(opt.name)}` };
  });

  return `
    <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-xl border border-border/80 overflow-hidden" id="live-memory-card">
      <div class="flex items-center justify-between pb-3 pt-1 border-b border-surface-variant/40">
        <div class="flex items-center gap-1.5 text-on-surface-variant">
          <span class="material-symbols-outlined text-[15px] text-on-surface-variant">schedule</span>
          <span class="font-label-md text-caption uppercase tracking-wider">${card.timestamp}</span>
        </div>
        <div class="flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface-container-lowest text-tertiary">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
          <span class="font-caption text-caption uppercase font-semibold">Verified Chat</span>
        </div>
      </div>

      <!-- Preserved Message Bubble -->
      <div class="mt-3.5 mb-3 p-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest shadow-inner relative cursor-pointer hover:border-sunset-coral/40 border border-transparent transition-colors" id="chat-quote-bubble" title="Click to view WhatsApp screenshot">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-[13px] font-bold text-on-surface-variant">
            ?
          </div>
          <div class="flex flex-col flex-1">
            <span class="font-caption text-caption text-on-surface-variant pb-0.5">Mystery Sender</span>
            <p class="font-body-md text-body-md text-on-surface leading-relaxed italic">
              “${card.quote}”
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 mb-3">
        <span class="text-xs text-gray-400">Who sent this without context?</span>
        <button class="material-symbols-outlined text-surface-variant text-[18px] hover:text-white transition-colors" id="btn-share-quote">share</button>
      </div>

      <!-- 4 Options Grid -->
      <div class="grid grid-cols-2 gap-2.5 my-2" id="game-option-grid">
        ${options.map((opt) => {
          const isSelected = game.selectedOption === opt.name;
          return `
            <button class="game-opt-btn group relative flex items-center gap-3 p-3 rounded-xl ${isSelected ? 'bg-primary-container/15 shadow-[0_0_20px_rgba(255,90,95,0.35)] border border-primary-container' : 'bg-surface-container-lowest border border-border/80'} text-left transition-all active:scale-[0.98] focus:outline-none hover:bg-surface-container-high shadow-md" data-option="${opt.name}" type="button" ${game.isAnswerRevealed ? 'disabled' : ''}>
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-variant shrink-0 relative">
                <img class="w-full h-full object-cover" alt="${opt.name}" src="${opt.avatar}" />
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="font-label-lg text-label-lg text-on-surface truncate ${isSelected ? 'font-bold' : ''}">${opt.name}</span>
                <span class="font-caption text-caption ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'} truncate font-mono">
                  ${isSelected ? 'LOCKED' : opt.role}
                </span>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Reveal Result -->
      <div id="game-reveal-banner" class="my-3 p-4 rounded-2xl bg-surface-container-lowest border border-tertiary/60 shadow-xl text-center" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center justify-center gap-2 text-tertiary font-headline-sm text-headline-sm font-bold mb-1">
          <span class="material-symbols-outlined text-[24px]">verified</span>
          <span>Correct Answer: ${card.correctAnswer}!</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-3">
          ${card.context}
        </p>
        <button id="btn-next-round" class="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2">
          <span>NEXT ROUND</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <!-- WhatsApp Modal -->
      <div id="quote-lightbox-modal" class="fixed inset-0 bg-canvas/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="relative max-w-md w-full rounded-2xl bg-surface-container p-5 border border-border shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-border">
            <span class="font-label-md text-caption text-amber-gold uppercase font-bold tracking-wider">Authentic Chat Screenshot</span>
            <button id="btn-close-lightbox" class="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-white hover:bg-surface-variant"><span class="material-symbols-outlined text-sm">close</span></button>
          </div>
          <div class="my-4 p-4 rounded-xl bg-[#0B141A] border border-[#202C33]">
            <div class="text-[11px] text-[#8696A0] mb-2">${card.timestamp}</div>
            <div class="bg-[#005C4B] text-[#E9EDEF] p-3.5 rounded-xl rounded-tr-none text-sm leading-relaxed max-w-[85%] ml-auto shadow">
              ${card.quote}
              <div class="text-[10px] text-[#A0C2B6] text-right mt-1.5">2:43 AM ✓✓</div>
            </div>
          </div>
          <p class="text-xs text-center text-gray-400">Encrypted WhatsApp chat memory verified by Pod Vault.</p>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// EVENT BINDINGS FOR GAME SCREEN
// ------------------------------------------------------------------------------
export function bindGameEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  const state = store.getState();
  const game = state.activeGame;
  const selectedModeId = state.activeRoom?.selectedGameMode || 'RED_FLAG_COURT';
  const activeDeck = resolveActiveDeck(state, selectedModeId);
  const currentCard = activeDeck[(game.roundIndex - 1) % activeDeck.length];

  // Shot clock logic with Split-Flap animation
  const flapS1 = document.getElementById('game-flap-s1');
  const flapS2 = document.getElementById('game-flap-s2');
  let seconds = game.timeRemaining;

  if (timerInterval) clearInterval(timerInterval);

  if (!game.isAnswerRevealed) {
    timerInterval = setInterval(() => {
      seconds--;
      if (seconds < 0) seconds = 0;

      const s1Val = Math.floor(seconds / 10).toString();
      const s2Val = (seconds % 10).toString();

      if (flapS2 && flapS2.textContent !== s2Val) {
        flapS2.classList.remove('split-flap-flip');
        void flapS2.offsetWidth;
        flapS2.textContent = s2Val;
        flapS2.classList.add('split-flap-flip');
      }

      if (flapS1 && flapS1.textContent !== s1Val) {
        flapS1.classList.remove('split-flap-flip');
        void flapS1.offsetWidth;
        flapS1.textContent = s1Val;
        flapS1.classList.add('split-flap-flip');
      }

      if (seconds <= 5 && seconds > 0) {
        audio.playTick();
      }

      if (seconds <= 0) {
        clearInterval(timerInterval);
        handleReveal();
      }
    }, 1000);
  }

  // Option selection
  const handleOptionSelect = (btn) => {
    if (!btn || btn.disabled) return;
    audio.playClick();
    const chosen = btn.dataset.option;

    store.setState({
      activeGame: { ...store.getState().activeGame, selectedOption: chosen },
    });
    broadcastRoomAction('SELECT_OPTION', { option: chosen, isAnswerRevealed: false });
    store.setView('GAME');
  };

  const optionGrid = document.getElementById('game-option-grid');
  if (optionGrid) {
    optionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.game-opt-btn');
      if (btn) handleOptionSelect(btn);
    });
  }

  const verdictGrid = document.getElementById('court-verdict-grid');
  if (verdictGrid) {
    verdictGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.game-opt-btn');
      if (btn) handleOptionSelect(btn);
    });
  }

  // Reveal Function
  const handleReveal = () => {
    if (timerInterval) clearInterval(timerInterval);
    const currentGame = store.getState().activeGame;
    if (currentGame.isAnswerRevealed) return;

    audio.playCorrect();
    confettiInstance.burst(60);

    const addedPoints = Math.max(250, 1000 - (20 - seconds) * 35);

    store.setState({
      activeGame: {
        ...currentGame,
        score: currentGame.score + addedPoints,
        isAnswerRevealed: true,
      },
    });

    broadcastRoomAction('SELECT_OPTION', { option: currentGame.selectedOption, isAnswerRevealed: true });

    const revealBanner = document.getElementById('game-reveal-banner');
    if (revealBanner) {
      revealBanner.style.display = 'block';
      // Trigger card flip
      const activeCard = document.querySelector('#live-memory-card, #court-card, #game-option-grid');
      if (activeCard && activeCard.id !== 'game-option-grid') {
        init3DCardFlip(activeCard.id);
      }
      
      // Trigger kinetic text reveal
      const revealText = revealBanner.querySelector('.font-headline-sm');
      if (revealText) {
        if (!revealText.id) revealText.id = 'reveal-text-' + Date.now();
        initKineticWordReveal(revealText.id);
      }
    }

    const revealBtn = document.getElementById('btn-reveal-now');
    if (revealBtn) revealBtn.disabled = true;

    // Highlight options
    const optionBtns = document.querySelectorAll('.game-opt-btn');
    optionBtns.forEach((btn) => (btn.disabled = true));
  };

  const revealBtn = document.getElementById('btn-reveal-now');
  if (revealBtn) {
    revealBtn.addEventListener('click', handleReveal);
  }

  // Next Round Button
  const nextBtn = document.getElementById('btn-next-round');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playClick();
      const currentGame = store.getState().activeGame;
      const totalRounds = activeDeck.length;

      if (currentGame.roundIndex >= totalRounds) {
        broadcastRoomAction('START_GAME', { gameMode: 'YEARBOOK' });
        store.setView('YEARBOOK');
      } else {
        const nextRound = currentGame.roundIndex + 1;
        broadcastRoomAction('NEXT_ROUND', { roundIndex: nextRound });
        store.setState({
          activeGame: {
            ...currentGame,
            roundIndex: nextRound,
            selectedOption: null,
            isAnswerRevealed: false,
            timeRemaining: 20,
          },
        });
        store.setView('GAME');
      }
    });
  }

  // In-Game Mode Switcher Modal
  const switchModeBtn = document.getElementById('btn-game-switch-mode');
  const gameModeModal = document.getElementById('game-mode-modal');
  const closeGameModeBtn = document.getElementById('btn-close-game-mode-modal');

  if (switchModeBtn && gameModeModal) {
    switchModeBtn.addEventListener('click', () => {
      audio.playClick();
      gameModeModal.style.display = 'flex';
    });
  }

  if (closeGameModeBtn && gameModeModal) {
    closeGameModeBtn.addEventListener('click', () => {
      audio.playClick();
      gameModeModal.style.display = 'none';
    });
  }

  const modeBtns = document.querySelectorAll('.btn-select-game-mode');
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const newMode = btn.dataset.mode;
      store.setGameMode(newMode);
      store.setState({
        activeGame: {
          ...store.getState().activeGame,
          roundIndex: 1,
          selectedOption: null,
          isAnswerRevealed: false,
          timeRemaining: 20,
        },
      });
      if (gameModeModal) gameModeModal.style.display = 'none';
      store.setView('GAME');
    });
  });

  // Floating Emoji Reactions
  const reactionBtns = document.querySelectorAll('.reaction-btn');
  reactionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const countSpan = btn.querySelector('.count');
      if (countSpan) {
        const num = parseInt(countSpan.textContent, 10);
        countSpan.textContent = isNaN(num) ? 1 : num + 1;
      }
      btn.classList.add('bg-primary-container/20');
      setTimeout(() => btn.classList.remove('bg-primary-container/20'), 400);

      // Create floating vector icon particle
      const floater = document.createElement('div');
      const icon = btn.dataset.icon || 'sentiment_very_satisfied';
      const color = btn.dataset.color || '#FFB703';
      floater.innerHTML = `<span class="material-symbols-outlined text-2xl drop-shadow-[0_0_8px_currentColor]">${icon}</span>`;
      floater.style.position = 'fixed';
      floater.style.left = `${Math.random() * 50 + 25}vw`;
      floater.style.bottom = '140px';
      floater.style.color = color;
      floater.style.zIndex = '999';
      floater.style.pointerEvents = 'none';
      floater.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(floater);

      requestAnimationFrame(() => {
        floater.style.transform = 'translateY(-180px) scale(1.6)';
        floater.style.opacity = '0';
      });

      setTimeout(() => floater.remove(), 1200);
    });
  });

  // WhatsApp Lightbox Modal (For inside joke deck)
  const quoteBubble = document.getElementById('chat-quote-bubble');
  const lightboxModal = document.getElementById('quote-lightbox-modal');
  const closeLightboxBtn = document.getElementById('btn-close-lightbox');

  if (quoteBubble && lightboxModal) {
    quoteBubble.addEventListener('click', () => {
      audio.playClick();
      lightboxModal.style.display = 'flex';
    });
  }

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      audio.playClick();
      lightboxModal.style.display = 'none';
    });
  }

  // Host Soundboard Drawer Toggle & SFX triggers
  const toggleSoundboardBtn = document.getElementById('btn-toggle-soundboard');
  const soundboardDrawer = document.getElementById('host-soundboard-drawer');
  if (toggleSoundboardBtn && soundboardDrawer) {
    toggleSoundboardBtn.addEventListener('click', () => {
      audio.playClick();
      const isHidden = soundboardDrawer.style.display === 'none';
      soundboardDrawer.style.display = isHidden ? 'flex' : 'none';
    });
  }

  const sfxBtns = document.querySelectorAll('.btn-sfx');
  sfxBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sfx = btn.dataset.sfx;
      if (sfx === 'wrong') audio.playWrongBuzzer();
      else if (sfx === 'airhorn') audio.playAirhorn();
      else if (sfx === 'rimshot') audio.playRimshot();
      else if (sfx === 'cheer') audio.playCrowdCheer();
      else if (sfx === 'crickets') audio.playCrickets();
    });
  });

  // Cast to TV Presentation Mode
  const castTvBtn = document.getElementById('btn-cast-tv-mode');
  if (castTvBtn) {
    castTvBtn.addEventListener('click', () => {
      audio.playChime();
      store.setView('TV_MODE');
    });
  }

  // Gemini AI Remix Deck Button
  const btnAiRefresh = document.getElementById('btn-gemini-ai-refresh');
  if (btnAiRefresh) {
    btnAiRefresh.addEventListener('click', async () => {
      audio.playChime();
      const st = store.getState();
      const players = st.activeRoom?.players || st.activeRoom?.campers || [];
      const playerNames = players.map((p) => p.name).filter(Boolean);
      btnAiRefresh.disabled = true;
      btnAiRefresh.innerHTML = '<span class="material-symbols-outlined text-xs animate-spin">sync</span><span>Remixing...</span>';

      try {
        const freshDeck = await generateDynamicGameDeck(selectedModeId, playerNames);
        if (freshDeck && freshDeck.length > 0) {
          store.setState({
            activeGame: {
              ...st.activeGame,
              dynamicDeck: freshDeck,
              roundIndex: 1,
              totalRounds: freshDeck.length,
              selectedOption: null,
              isAnswerRevealed: false,
              timeRemaining: 20,
            },
          });
          store.setView('GAME');
          return;
        }
      } catch (err) {
        console.warn('Remix error:', err);
      }
      btnAiRefresh.disabled = false;
      btnAiRefresh.innerHTML = '<span class="material-symbols-outlined text-[15px] text-amber-gold">auto_awesome</span><span>AI Remix Deck</span>';
    });
  }

  // Private Panic Button (Soften Card)
  const btnPanic = document.getElementById('btn-panic-soften');
  if (btnPanic) {
    btnPanic.addEventListener('click', () => {
      audio.playBip();
      btnPanic.innerHTML = '<span class="material-symbols-outlined text-xs text-mint-green">check_circle</span><span class="text-mint-green font-mono">Softened</span>';
      setTimeout(() => {
        const st = store.getState();
        const nextRound = (st.activeGame.roundIndex % (st.activeGame.totalRounds || 4)) + 1;
        store.setState({
          activeGame: {
            ...st.activeGame,
            roundIndex: nextRound,
            selectedOption: null,
            isAnswerRevealed: false,
            timeRemaining: 20,
          },
        });
        store.notify();
      }, 400);
    });
  }

  // Squad Live Voice Mic in Game
  const btnGameVoiceMic = document.getElementById('btn-game-voice-mic');
  const gameMicIcon = document.getElementById('game-voice-mic-icon');
  const gameMicText = document.getElementById('game-voice-mic-text');

  function updateGameMicUi() {
    if (!btnGameVoiceMic || !gameMicIcon || !gameMicText) return;
    if (!p2pMesh.isVoiceActive()) {
      gameMicIcon.textContent = 'mic_off';
      gameMicIcon.className = 'material-symbols-outlined text-[15px] text-gray-400';
      gameMicText.textContent = 'Squad Mic';
      btnGameVoiceMic.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border hover:border-mint-green/60 text-gray-300 text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm';
    } else if (p2pMesh.isMuted) {
      gameMicIcon.textContent = 'mic_off';
      gameMicIcon.className = 'material-symbols-outlined text-[15px] text-red-400';
      gameMicText.textContent = 'Muted';
      btnGameVoiceMic.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/50 text-red-300 text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm';
    } else {
      gameMicIcon.textContent = 'mic';
      gameMicIcon.className = 'material-symbols-outlined text-[15px] text-mint-green animate-pulse';
      gameMicText.textContent = 'Live Mic';
      btnGameVoiceMic.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint-green/10 border border-mint-green/60 text-mint-green text-caption font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm shadow-mint-green/20';
    }
  }

  updateGameMicUi();

  if (btnGameVoiceMic) {
    btnGameVoiceMic.addEventListener('click', async () => {
      audio.playClick();
      if (!p2pMesh.isVoiceActive()) {
        btnGameVoiceMic.classList.add('animate-pulse');
        const ok = await p2pMesh.startVoiceStream();
        if (!ok) {
          gameMicText.textContent = 'Mic Blocked';
          const toastMount = document.getElementById('toast-mount');
          if (toastMount) {
            toastMount.innerHTML = '<div class="toast toast-coral show"><span class="material-symbols-outlined text-sm mr-1 text-sunset-coral">mic_off</span><span>Microphone access blocked. Click the lock icon in your URL bar to allow.</span></div>';
            setTimeout(() => (toastMount.innerHTML = ''), 4000);
          }
        }
      } else {
        p2pMesh.toggleMute();
      }
      updateGameMicUi();
    });
  }

  // Spotify Squad Jukebox Toggle in Game
  const btnGameOpenSpotify = document.getElementById('btn-game-open-spotify');
  if (btnGameOpenSpotify) {
    btnGameOpenSpotify.addEventListener('click', () => {
      audio.playClick();
      const popup = document.getElementById('spotify-jukebox-modal');
      if (popup) {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Cinema Bollywood Spotify button
  const cinemaSpotifyBtns = document.querySelectorAll('.btn-play-cinema-spotify');
  cinemaSpotifyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const movie = btn.dataset.movie || 'Bollywood Classics';
      playSongOnSpotify(`${movie} bollywood songs`);
    });
  });

  // Bind Spotify Jukebox events
  bindSpotifyEvents();
}
