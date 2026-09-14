// ==============================================================================
// BONDFIRE SHOWS COMPONENT (Mode 3: "I want to discover and participate")
// Short Video Interactive Feed, Creator Live Rooms & Watch-and-Play Cards
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { WATCH_PLAY_CARDS } from '../data/watchPlayCardsData.js';
import { renderWatchPlayCard, bindWatchPlayCardEvents } from './watchPlayCard.js';
import { WatchPartyPlayer } from './watchPartyPlayer.js';

let activeCardsState = [...WATCH_PLAY_CARDS];
let activeFilter = 'ALL'; // 'ALL' | 'REEL_COURT' | 'LYRICS' | 'ENDINGS'
let watchPartyInstance = null;

export function renderShowsScreen() {
  const state = store.getState();
  const currentPlayMode = state.arcadePlayMode || 'GROUP';
  const user = state.currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Guest';

  const filteredCards = activeCardsState.filter((card) => {
    if (activeFilter === 'REEL_COURT') return card.cardType === 'REEL_COURT';
    if (activeFilter === 'LYRICS') return card.cardType === 'COMPLETE_THE_LYRIC';
    if (activeFilter === 'ENDINGS') return card.cardType === 'GUESS_THE_ENDING';
    return true;
  });

  return `
    <div class="flex flex-col w-full max-w-4xl mx-auto px-4 py-6 pb-32 select-none text-on-surface relative">
      
      <!-- Atmospheric Ambient Glows -->
      <div class="absolute top-10 left-1/3 -translate-x-1/2 w-96 h-96 bg-sunset-coral/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-80 right-10 w-80 h-80 bg-amber-gold/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Header & Creator Live Bar -->
      <div class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-border shadow-2xl mb-4 relative overflow-hidden">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-sunset-coral animate-ping"></span>
            <span class="text-xs font-mono font-bold text-sunset-coral uppercase tracking-wider">Mode 3 · Bondfire Shows</span>
          </div>
          <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Watch &amp; Play Stream Stage</h1>
          <p class="text-xs sm:text-sm text-gray-300 mt-1">
            Watch together in real-time. Drop reactions, trigger Pause &amp; Predict, or paste any YouTube video.
          </p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <button id="btn-create-creator-show" class="flex-1 md:flex-none px-5 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">videocam</span>
            <span>Host Live Room</span>
          </button>
        </div>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sunset-coral text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Stream Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-shows-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-sunset-coral text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (Squad Cinema)
          </button>
          <button class="btn-shows-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (Date Lounge)
          </button>
          <button class="btn-shows-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo (Personal Cinema)
          </button>
        </div>
      </div>

      <!-- Mode Banner Indicator -->
      <div class="w-full mb-4 px-3 py-1.5 rounded-xl text-center text-xs font-mono ${currentPlayMode === 'DUOS' ? 'bg-duo-rose/10 text-duo-rose border border-duo-rose/30' : currentPlayMode === 'SOLO' ? 'bg-mint-green/10 text-mint-green border border-mint-green/30' : 'bg-surface border border-white/5 text-gray-400'}">
        ${currentPlayMode === 'DUOS' ? '👫 Duos Date Lounge: Intimate 2-player stream session with synchronized timestamps & private reactions.' : currentPlayMode === 'SOLO' ? '👤 Solo Cinema: Distraction-free personal screen for creators, reviews, and study chill.' : '👥 Squad Cinema: Real-time living room stream with squad reaction rain and Pause & Predict!'}
      </div>

      <!-- Live Synchronized Watch Party Player Container -->
      <div id="live-watch-party-container" class="mb-8"></div>

      <!-- Scheduled Creator Shows Marquee Banner -->
      <div class="mb-6 p-4 rounded-2xl bg-surface-bright border border-border/80 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-gold/20 text-amber-gold flex items-center justify-center font-bold text-lg">
            <span class="material-symbols-outlined text-amber-gold text-xl">mic</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono font-bold uppercase bg-white/10 px-2 py-0.5 rounded text-gray-200">Every Friday · 9 PM IST</span>
              <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
            </div>
            <h4 class="font-bold text-xs sm:text-sm text-white mt-0.5">“Guess the Punchline: Live Stand-Up Special”</h4>
          </div>
        </div>

        <button class="px-3.5 py-1.5 rounded-full bg-surface border border-border hover:border-amber-gold text-amber-gold font-bold text-xs transition-colors shrink-0">
          Remind Me
        </button>
      </div>

      <!-- Filter Tabs Strip -->
      <div class="flex items-center justify-between gap-2 border-b border-border/70 pb-3 mb-6 flex-wrap">
        <div class="flex items-center gap-2">
          ${[
            { id: 'ALL', label: 'All Interactive Cards', icon: 'grid_view' },
            { id: 'REEL_COURT', label: 'Reel Courtroom', icon: 'gavel' },
            { id: 'LYRICS', label: 'Antakshari Lyrics', icon: 'music_note' },
            { id: 'ENDINGS', label: 'Guess the Ending', icon: 'movie' }
          ].map((tab) => `
            <button class="btn-shows-filter flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === tab.id ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral shadow-sm' : 'text-gray-400 hover:text-white bg-surface-bright border border-border'}" data-filter="${tab.id}">
              <span class="material-symbols-outlined text-sm">${tab.icon}</span>
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </div>

        <span class="text-xs font-mono text-gray-400">
          ${filteredCards.length} Interactive Episodes
        </span>
      </div>

      <!-- Watch-and-Play Cards Feed Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="watch-play-feed-container">
        ${filteredCards.map((card) => renderWatchPlayCard(card)).join('')}
      </div>

    </div>
  `;
}

export function bindShowsEvents() {
  const streamContainer = document.getElementById('live-watch-party-container');
  if (streamContainer) {
    watchPartyInstance = new WatchPartyPlayer('live-watch-party-container');
  }

  const container = document.getElementById('watch-play-feed-container');
  if (container) {
    bindWatchPlayCardEvents(container, (cardId, optId) => {
      // Handle user vote callback
      activeCardsState = activeCardsState.map((card) => {
        if (card.id === cardId) {
          return { ...card, userVote: optId };
        }
        return card;
      });
      // Re-render feed
      const parent = container.parentElement;
      if (parent) {
        parent.innerHTML = renderShowsScreen();
        bindShowsEvents();
      }
    });
  }

  // Filter clicks
  document.querySelectorAll('.btn-shows-filter').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      activeFilter = filter;
      audio.playClick();
      const appMount = document.getElementById('app-mount');
      if (appMount) {
        appMount.innerHTML = renderShowsScreen();
        bindShowsEvents();
      }
    });
  });

  // In-Game Stream Mode Switcher
  document.querySelectorAll('.btn-shows-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== store.getState().arcadePlayMode) {
        audio.playClick();
        store.setArcadePlayMode(mode);
        const appMount = document.getElementById('app-mount');
        if (appMount) {
          appMount.innerHTML = renderShowsScreen();
          bindShowsEvents();
        }
      }
    });
  });

  // Host Live Room button -> jumps to Lobby
  const btnHostLive = document.getElementById('btn-create-creator-show');
  if (btnHostLive) {
    btnHostLive.addEventListener('click', () => {
      audio.playChime();
      const room = { ...store.getState().activeRoom, roomTemplate: 'WATCH_PARTY' };
      store.setState({ activeRoom: room, currentView: 'ROOMS' });
      window.location.hash = '#/ROOMS';
    });
  }
}
