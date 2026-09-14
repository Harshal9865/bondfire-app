// ==============================================================================
// BONDFIRE ARCADE: NEVER HAVE I EVER MULTIPLAYER GAME
// Interactive 10-Finger Drop Arena with Room Campers & Custom Prompt Builder
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { NEVER_HAVE_I_EVER_DECKS, getRandomNhiePrompt } from '../data/neverHaveIEverData.js';

let currentPrompt = getRandomNhiePrompt('ALL');
let playerFingers = {}; // { playerId: number } (10 down to 0)
let roundHistory = [];
let activeCategory = 'ALL';
let nhieTimerInterval = null;

function initPlayerFingers() {
  const room = store.getState().activeRoom;
  const players = (room && room.players) ? room.players : [];
  players.forEach((p) => {
    if (playerFingers[p.id] === undefined) {
      playerFingers[p.id] = 10;
    }
  });
}

export function renderNeverHaveIEverGame() {
  initPlayerFingers();
  const state = store.getState();
  const room = state.activeRoom || {};
  const players = room.players || [];
  const currentUser = state.currentUser || {};
  const currentUserId = currentUser.id || 'p1';

  return `
    <div class="flex flex-col w-full max-w-[760px] mx-auto px-4 pt-6 pb-28 relative select-none z-20">
      
      <!-- Ambient Backdrops -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-duo-rose/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-72 right-10 w-80 h-80 bg-amber-gold/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Navigation & Return to Arcade Bar -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-xl mb-6">
        <button id="btn-nhie-back-arcade" class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-bright/70 hover:bg-surface-bright text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Arcade</span>
        </button>

        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-duo-rose animate-pulse"></span>
          <span class="text-[11px] font-mono font-bold text-duo-rose uppercase tracking-wider">Never Have I Ever · Live</span>
        </div>

        <button id="btn-nhie-custom-prompt" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sunset-coral/20 hover:bg-sunset-coral/30 border border-sunset-coral/40 text-sunset-coral text-xs font-bold transition-all active:scale-95">
          <span class="material-symbols-outlined text-[15px]">add_circle</span>
          <span class="hidden sm:inline">+ Custom Prompt</span>
          <span class="sm:hidden">+ New</span>
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <button class="nhie-cat-filter px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${activeCategory === 'ALL' ? 'bg-white text-dark font-black shadow-sm' : 'bg-surface border border-border text-gray-400 hover:text-white'}" data-cat="ALL">
          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">local_fire_department</span><span class="retro-pixel-badge text-[9.5px]">All Prompts</span></span>
        </button>
        <button class="nhie-cat-filter px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${activeCategory === 'CHAOS' ? 'bg-sunset-coral text-white font-black shadow-sm' : 'bg-surface border border-border text-gray-400 hover:text-white'}" data-cat="CHAOS">
          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">celebration</span><span class="retro-pixel-badge text-[9.5px]">Party Chaos</span></span>
        </button>
        <button class="nhie-cat-filter px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${activeCategory === 'DATING_CRUSHES' ? 'bg-duo-rose text-white font-black shadow-sm' : 'bg-surface border border-border text-gray-400 hover:text-white'}" data-cat="DATING_CRUSHES">
          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">favorite</span><span class="retro-pixel-badge text-[9.5px]">Dating & Crushes</span></span>
        </button>
        <button class="nhie-cat-filter px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${activeCategory === 'COLLEGE_HOSTEL' ? 'bg-amber-gold text-dark font-black shadow-sm' : 'bg-surface border border-border text-gray-400 hover:text-white'}" data-cat="COLLEGE_HOSTEL">
          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">school</span><span class="retro-pixel-badge text-[9.5px]">Hostel & College</span></span>
        </button>
      </div>

      <!-- MAIN PROMPT CARD -->
      <div class="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1E1B29] to-surface border-2 border-duo-rose/40 shadow-2xl mb-6 text-center overflow-hidden">
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-duo-rose/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-duo-rose/20 text-duo-rose border border-duo-rose/40">
            ${currentPrompt.category || 'Friendship'}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${currentPrompt.spice === 'SAVAGE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : currentPrompt.spice === 'SPICY' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40' : 'bg-mint-green/20 text-mint-green border border-mint-green/40'}">
            ${currentPrompt.spice || 'MILD'}
          </span>
        </div>

        <h3 class="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed max-w-xl mx-auto my-3">
          "${currentPrompt.text}"
        </h3>

        <p class="text-xs text-gray-400 mt-2 mb-4">If you've done this, drop a finger! Be honest — your squad is watching.</p>

        <!-- In-Game 15-Second Decision Shot Clock -->
        <div class="max-w-md mx-auto mb-5 p-2.5 rounded-2xl bg-[#0F131E]/80 border border-white/10 flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-duo-rose animate-pulse">timer</span>
              <span class="text-xs font-mono font-bold text-gray-300">Decision Shot Clock:</span>
              <span id="nhie-shot-clock-text" class="text-xs font-mono font-black text-duo-rose bg-duo-rose/15 px-2 py-0.5 rounded-full border border-duo-rose/30">15s</span>
            </div>
            <span id="nhie-timer-status" class="text-[10.5px] font-mono text-gray-400">Drop a finger or mark safe</span>
          </div>
          <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div id="nhie-timer-bar" class="h-full bg-gradient-to-r from-duo-rose to-amber-gold rounded-full transition-all duration-1000 ease-linear" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Player Actions: Drop Finger or Safe -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button id="btn-nhie-drop-finger" class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-duo-rose hover:bg-[#E84E88] text-white font-bold text-sm shadow-lg shadow-duo-rose/30 transition-all active:scale-95 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px]">pan_tool</span>
            <span class="retro-pixel-badge text-[10px]">I've Done This! (Drop Finger)</span>
          </button>

          <button id="btn-nhie-safe" class="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright border border-border text-gray-300 hover:text-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-mint-green">verified</span>
            <span class="retro-pixel-badge text-[10px]">I'm Safe</span>
          </button>

          <button id="btn-nhie-next-card" class="p-3.5 rounded-2xl bg-surface-bright hover:bg-surface-bright/80 text-amber-gold hover:text-white border border-border transition-all active:scale-95" title="Next Card">
            <span class="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      <!-- SQUAD FINGER LEADERBOARD (LIVE CAMPERS) -->
      <div class="p-5 rounded-2xl bg-surface border border-border shadow-xl">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-duo-rose text-[18px]">front_hand</span>
            <h4 class="font-display text-sm font-bold text-white uppercase tracking-wider">Campers Survivor Tally</h4>
          </div>
          <button id="btn-reset-fingers" class="text-[11px] font-mono text-gray-400 hover:text-amber-gold transition-colors">
            Reset 10 Fingers
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="nhie-player-grid">
          ${players.map((p) => {
            const fingers = playerFingers[p.id] !== undefined ? playerFingers[p.id] : 10;
            const isEliminated = fingers <= 0;
            const isSelf = p.id === currentUserId || p.name === (currentUser.displayName || 'Harshal');
            
            return `
              <div class="flex items-center justify-between p-3 rounded-xl ${isEliminated ? 'bg-red-500/10 border border-red-500/30 opacity-70' : 'bg-surface-bright/50 border border-border'} transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-duo-rose/20 to-amber-gold/20 border ${isEliminated ? 'border-red-500' : 'border-border'} flex items-center justify-center shrink-0 overflow-hidden">
                    ${p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('data:') || p.avatar.startsWith('/')) ? `<img src="${p.avatar}" class="w-full h-full object-cover rounded-full" alt="${p.name}"/>` : (p.avatar && p.avatar.match(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/u) ? p.avatar : '<span class="material-symbols-outlined text-gray-300 text-base">person</span>')}
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-white">${p.name}</span>
                      ${isSelf ? '<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-duo-rose/20 text-duo-rose font-bold">YOU</span>' : ''}
                      ${isEliminated ? '<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 font-bold">OUT</span>' : ''}
                    </div>
                    <!-- Visual Retro Stamina / Finger Health Meter -->
                    <div class="flex items-center gap-1 mt-1.5">
                      ${Array.from({ length: 10 }).map((_, i) => `
                        <span class="w-1.5 h-3.5 rounded-sm ${i < fingers ? 'bg-duo-rose shadow-sm shadow-duo-rose/50' : 'bg-gray-700/60'} transition-all inline-block"></span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <div class="flex flex-col items-end">
                  <span class="font-mono text-base font-black ${isEliminated ? 'text-red-400' : fingers <= 3 ? 'text-amber-gold' : 'text-mint-green'}">
                    ${fingers}/10
                  </span>
                  <button class="nhie-manual-drop text-[10px] text-gray-400 hover:text-duo-rose transition-colors mt-0.5 underline cursor-pointer" data-player-id="${p.id}">
                    -1 Finger
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- CUSTOM PROMPT MODAL (DYNAMIC USER CREATION) -->
      <div id="nhie-custom-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl relative">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-[22px]">edit_note</span>
              <h3 class="font-display text-lg font-bold text-white">Create Custom Prompt</h3>
            </div>
            <button id="btn-close-nhie-modal" class="text-gray-400 hover:text-white p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <p class="text-xs text-gray-300 mb-3">Call out your friends with an authentic inside joke or squad situation:</p>

          <textarea id="nhie-custom-input" rows="3" placeholder="e.g. Never have I ever said 'I'm reaching in 2 minutes' while still looking for my keys..." class="w-full p-3 rounded-xl bg-surface-bright border border-border text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-duo-rose mb-3 resize-none"></textarea>

          <div class="flex items-center gap-2 mb-4">
            <span class="text-xs text-gray-400 font-bold">Spice:</span>
            <select id="nhie-custom-spice" class="bg-surface-bright border border-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-duo-rose">
              <option value="MILD">Mild (Wholesome)</option>
              <option value="SPICY">Spicy (Awkward truth)</option>
              <option value="SAVAGE">Savage (Squad ruin)</option>
            </select>
          </div>

          <button id="btn-save-nhie-custom" class="w-full py-3 rounded-xl bg-duo-rose hover:bg-[#E84E88] text-white font-bold text-xs shadow-lg shadow-duo-rose/20 transition-all active:scale-95">
            Play This Prompt Now
          </button>
        </div>
      </div>

    </div>
  `;
}

export function bindNeverHaveIEverEvents() {
  if (nhieTimerInterval) {
    clearInterval(nhieTimerInterval);
    nhieTimerInterval = null;
  }

  // Active 15-Second Decision Shot Clock
  let nhieSecondsLeft = 15;
  const timerText = document.getElementById('nhie-shot-clock-text');
  const timerBar = document.getElementById('nhie-timer-bar');
  const timerStatus = document.getElementById('nhie-timer-status');

  nhieTimerInterval = setInterval(() => {
    nhieSecondsLeft--;
    if (nhieSecondsLeft < 0) nhieSecondsLeft = 0;

    if (timerText) timerText.textContent = `${nhieSecondsLeft}s`;
    if (timerBar) {
      const pct = Math.max(0, (nhieSecondsLeft / 15) * 100);
      timerBar.style.width = `${pct}%`;
      if (nhieSecondsLeft <= 5) {
        timerBar.className = 'h-full bg-red-500 rounded-full transition-all duration-1000 ease-linear animate-pulse';
      }
    }

    if (nhieSecondsLeft <= 5 && nhieSecondsLeft > 0) {
      audio.playTick();
      if (timerText) timerText.className = 'text-xs font-mono font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/40 animate-bounce';
    }

    if (nhieSecondsLeft <= 0) {
      clearInterval(nhieTimerInterval);
      nhieTimerInterval = null;
      audio.playBip();
      if (timerText) timerText.textContent = "TIME'S UP!";
      if (timerStatus) {
        timerStatus.textContent = 'All campers declared safe! Next prompt incoming...';
        timerStatus.className = 'text-[10.5px] font-mono font-bold text-mint-green';
      }
      setTimeout(() => {
        currentPrompt = getRandomNhiePrompt(activeCategory);
        reRender();
      }, 1500);
    }
  }, 1000);

  // 1. Back to Arcade
  const btnBack = document.getElementById('btn-nhie-back-arcade');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (nhieTimerInterval) clearInterval(nhieTimerInterval);
      audio.playClick();
      store.setView('ARCADE');
      window.location.hash = '#/ARCADE';
    });
  }

  // 2. Category Filter Buttons
  const catBtns = document.querySelectorAll('.nhie-cat-filter');
  catBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      activeCategory = btn.dataset.cat;
      currentPrompt = getRandomNhiePrompt(activeCategory);
      reRender();
    });
  });

  // 3. Drop Finger Button (Current User)
  const btnDrop = document.getElementById('btn-nhie-drop-finger');
  if (btnDrop) {
    btnDrop.addEventListener('click', () => {
      audio.playWrong(); // dramatic drop sound
      const currentUser = store.getState().currentUser || {};
      const currentUserId = currentUser.id || 'p1';
      
      if (playerFingers[currentUserId] !== undefined && playerFingers[currentUserId] > 0) {
        playerFingers[currentUserId]--;
      }
      
      // Auto-transition to next card with slight delay
      setTimeout(() => {
        currentPrompt = getRandomNhiePrompt(activeCategory);
        reRender();
      }, 500);
      
      reRender();
    });
  }

  // 4. Safe Button
  const btnSafe = document.getElementById('btn-nhie-safe');
  if (btnSafe) {
    btnSafe.addEventListener('click', () => {
      audio.playScoreUp();
      currentPrompt = getRandomNhiePrompt(activeCategory);
      reRender();
    });
  }

  // 5. Next Card
  const btnNext = document.getElementById('btn-nhie-next-card');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      audio.playClick();
      currentPrompt = getRandomNhiePrompt(activeCategory);
      reRender();
    });
  }

  // 6. Manual Drop Button on any player
  const manualDrops = document.querySelectorAll('.nhie-manual-drop');
  manualDrops.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playWrong();
      const pid = btn.dataset.playerId;
      if (playerFingers[pid] !== undefined && playerFingers[pid] > 0) {
        playerFingers[pid]--;
      }
      reRender();
    });
  });

  // 7. Reset Fingers
  const btnReset = document.getElementById('btn-reset-fingers');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      audio.playClick();
      Object.keys(playerFingers).forEach((k) => {
        playerFingers[k] = 10;
      });
      reRender();
    });
  }

  // 8. Custom Prompt Modal Handlers
  const modal = document.getElementById('nhie-custom-modal');
  const btnOpenModal = document.getElementById('btn-nhie-custom-prompt');
  const btnCloseModal = document.getElementById('btn-close-nhie-modal');
  const btnSaveCustom = document.getElementById('btn-save-nhie-custom');
  const inputCustom = document.getElementById('nhie-custom-input');
  const spiceSelect = document.getElementById('nhie-custom-spice');

  if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', () => {
      audio.playClick();
      modal.classList.remove('hidden');
      if (inputCustom) inputCustom.focus();
    });
  }

  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (btnSaveCustom && modal && inputCustom) {
    btnSaveCustom.addEventListener('click', () => {
      const text = inputCustom.value.trim();
      if (!text) return;
      
      audio.playScoreUp();
      currentPrompt = {
        id: `custom_${Date.now()}`,
        text: text.startsWith('Never have I ever') ? text : `Never have I ever ${text}`,
        category: 'Squad Inside Joke',
        spice: spiceSelect ? spiceSelect.value : 'SPICY'
      };
      
      modal.classList.add('hidden');
      inputCustom.value = '';
      reRender();
    });
  }
}

function reRender() {
  const mount = document.getElementById('app-mount');
  if (mount && store.getState().currentView === 'NHIE') {
    mount.innerHTML = renderNeverHaveIEverGame();
    bindNeverHaveIEverEvents();
  }
}
