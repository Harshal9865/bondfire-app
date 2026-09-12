// ==============================================================================
// TV HOST PRESENTATION MODE COMPONENT (16:9 Living Room Screen)
// Optimized for casting to large TVs, monitors, and projectors via AirPlay/Chromecast
// Features large high-contrast typography, live QR corner buzzer, and countdown timer ring
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { INSIDE_JOKE_DECK } from '../data/partyGameDecks.js';

export function renderTvModeScreen() {
  const state = store.getState();
  const room = state.activeRoom;
  const game = state.activeGame;
  const hostUser = state.currentUser;
  const hostName = (hostUser && hostUser.isLoggedIn && hostUser.displayName) ? hostUser.displayName.split(' ')[0] : 'Host';

  const deck = INSIDE_JOKE_DECK || [];
  const currentCard = deck[(game.roundIndex - 1) % deck.length] || deck[0];

  return `
    <div class="fixed inset-0 z-50 bg-[#07090E] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans">
      <!-- Ambient Cinematic Ember Glow -->
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sunset-coral/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-amber-gold/15 rounded-full blur-[140px] pointer-events-none"></div>

      <!-- TV Top Bar: Brand, Room Code, Live Status, Exit Button -->
      <header class="flex items-center justify-between z-10">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunset-coral to-amber-gold p-[2px] shadow-glow-coral flex items-center justify-center">
              <div class="w-full h-full bg-[#07090E] rounded-[14px] flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] text-amber-gold">local_fire_department</span>
              </div>
            </div>
            <div>
              <h1 class="font-display text-2xl font-black tracking-tight text-white flex items-center gap-2">
                BONDFIRE <span class="px-2 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral text-xs font-mono tracking-widest uppercase">TV STAGE</span>
              </h1>
              <p class="text-xs text-gray-400 font-medium">Pod: ${room.podName} · Host: ${hostName}</p>
            </div>
          </div>
        </div>

        <!-- Center: Round Indicator & Shot Clock -->
        <div class="flex items-center gap-6">
          <div class="px-5 py-2 rounded-full bg-surface-bright/80 border border-border flex items-center gap-2 shadow-lg">
            <span class="material-symbols-outlined text-sunset-coral text-[20px]">local_fire_department</span>
            <span class="font-display font-bold text-sm text-white uppercase tracking-wider">ROUND ${game.roundIndex} OF 5</span>
          </div>

          <div class="flex items-center gap-2 px-5 py-2 rounded-full bg-surface-bright/80 border border-amber-gold/40 shadow-glow-amber">
            <span class="material-symbols-outlined text-amber-gold text-[20px] animate-spin">schedule</span>
            <span class="font-mono text-xl font-bold text-amber-gold" id="tv-timer">${game.timeRemaining}s</span>
          </div>
        </div>

        <!-- Right: Exit TV Mode & Fullscreen -->
        <div class="flex items-center gap-3">
          <button id="btn-toggle-fullscreen" class="px-4 py-2.5 rounded-full bg-surface-bright hover:bg-surface-raised border border-border text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5" title="Toggle True Fullscreen">
            <span class="material-symbols-outlined text-[18px]">fullscreen</span>
            <span>Fullscreen</span>
          </button>
          <button id="btn-exit-tv-mode" class="px-4 py-2.5 rounded-full bg-surface-bright hover:bg-surface-raised border border-border text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5" title="Exit TV Mode">
            <span class="material-symbols-outlined text-[18px]">close</span>
            <span>Exit Stage</span>
          </button>
        </div>
      </header>

      <!-- Main Central Question Arena (Hero Scale) -->
      <main class="flex-1 flex flex-col items-center justify-center my-6 max-w-5xl mx-auto w-full z-10 text-center">
        <!-- Question Badge -->
        <div class="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunset-coral/15 border border-sunset-coral/40 text-sunset-coral font-bold text-xs uppercase tracking-widest">
          <span class="retro-pixel-badge flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">psychology</span> WHO SAID THIS IN THE GROUP CHAT?</span>
        </div>

        <!-- Giant Dialogue Display Card -->
        <div class="w-full bg-[#10131c]/90 backdrop-blur-2xl border-2 border-border/90 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-8">
          <div class="text-xs font-mono text-gray-400 mb-3 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-duo-rose">chat</span>
            <span>${currentCard.context || 'Real Group Chat Archive'}</span>
          </div>

          <blockquote class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight italic max-w-4xl mx-auto">
            “${currentCard.quote}”
          </blockquote>

          <div class="mt-6 flex items-center justify-center gap-4 text-xs font-mono text-amber-gold/90">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-coral-red text-sm">local_fire_department</span> 8 Reactions</span>
            <span>•</span>
            <span class="text-mint-green font-bold flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span> Buzzers Active</span>
          </div>
        </div>

        <!-- Option Cards for the TV audience -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          ${(currentCard.options || (state.activeRoom?.players || []).map((p) => p.name)).map((opt, idx) => `
            <div class="p-4 rounded-2xl bg-surface-card border border-border flex items-center gap-3 text-left shadow-lg">
              <div class="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center font-bold text-sm text-sunset-coral border border-border">
                0${idx + 1}
              </div>
              <div class="min-w-0">
                <div class="font-display font-bold text-base text-white truncate">${opt}</div>
                <div class="text-[11px] text-gray-400 font-mono">Buzzer #${idx + 1}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>

      <!-- TV Bottom HUD: QR Code to Join, Players Answered Bar, Host Soundboard -->
      <footer class="flex items-center justify-between z-10 pt-4 border-t border-border/80">
        <!-- Join on Phone with QR / Code -->
        <div class="flex items-center gap-4 bg-surface-bright/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border">
          <div class="w-14 h-14 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow">
            <div class="font-room-code font-black text-black text-xs text-center leading-tight">
              SCAN<br/>OR JOIN<br/><span class="text-sunset-coral font-extrabold">${room.roomCode}</span>
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400">Join on your phone:</div>
            <div class="font-display text-xl font-bold text-white tracking-wider flex items-center gap-2">
              <span>bondfire.app</span>
              <span class="px-2 py-0.5 rounded bg-amber-gold/20 text-amber-gold font-room-code text-sm">#${room.roomCode}</span>
            </div>
          </div>
        </div>

        <!-- TV Live Soundboard Trigger -->
        <div class="flex items-center gap-2">
          <button class="tv-sfx-btn px-3 py-2 rounded-xl bg-surface-bright hover:bg-surface-raised text-red-400 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-red-500/20" data-sfx="wrong">
            <span class="material-symbols-outlined text-sm">notifications_active</span>
            <span class="font-mono">Buzzer</span>
          </button>
          <button class="tv-sfx-btn px-3 py-2 rounded-xl bg-surface-bright hover:bg-surface-raised text-amber-gold font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-amber-gold/20" data-sfx="airhorn">
            <span class="material-symbols-outlined text-sm">campaign</span>
            <span class="font-mono">Airhorn</span>
          </button>
          <button class="tv-sfx-btn px-3 py-2 rounded-xl bg-surface-bright hover:bg-surface-raised text-mint-green font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-mint-green/20" data-sfx="rimshot">
            <span class="material-symbols-outlined text-sm">music_note</span>
            <span class="font-mono">Rimshot</span>
          </button>
          <button class="tv-sfx-btn px-3 py-2 rounded-xl bg-surface-bright hover:bg-surface-raised text-secondary font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-secondary/20" data-sfx="cheer">
            <span class="material-symbols-outlined text-sm">celebration</span>
            <span class="font-mono">Applause</span>
          </button>
        </div>

        <!-- Live Score & Camper Roster Pill -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-xs text-gray-400 font-medium">${room.players.length} Campers Active</div>
            <div class="font-display text-lg font-bold text-amber-gold">${game.score} Total PTS</div>
          </div>
          <div class="flex items-center -space-x-2">
            ${room.players.slice(0, 4).map((p) => `
              <div class="w-8 h-8 rounded-full border-2 border-[#07090E] overflow-hidden bg-surface-bright" title="${p.name}">
                <img src="${p.avatar}" alt="${p.name}" class="w-full h-full object-cover" />
              </div>
            `).join('')}
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function bindTvModeEvents() {
  const exitBtn = document.getElementById('btn-exit-tv-mode');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('GAME');
    });
  }

  const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      audio.playClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // TV Soundboard Buttons
  const sfxBtns = document.querySelectorAll('.tv-sfx-btn');
  sfxBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sfx = btn.dataset.sfx;
      if (sfx === 'wrong') audio.playWrongBuzzer();
      else if (sfx === 'airhorn') audio.playAirhorn();
      else if (sfx === 'rimshot') audio.playRimshot();
      else if (sfx === 'cheer') audio.playCrowdCheer();
    });
  });

  // Countdown timer simulation for TV Stage
  let seconds = store.getState().activeGame.timeRemaining || 20;
  const timerElem = document.getElementById('tv-timer');
  const timerInterval = setInterval(() => {
    seconds--;
    if (timerElem) timerElem.textContent = `${Math.max(0, seconds)}s`;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      audio.playCorrect();
    }
  }, 1000);
}
