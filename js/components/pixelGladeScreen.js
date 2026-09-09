// ==============================================================================
// THE PIXEL CAMPFIRE GLADE & RETRO ARCADE COMPONENT (Creative Feature)
// 16-Bit Animated Campsite, 8-Bit Roast Theatre, Graffiti Wall & S'more Mini-Games
// Matches Google Stitch Warm Analog Cyber Design System
// ==============================================================================

import { store } from '../state/store.js';
import { chiptune } from '../visuals/chiptuneSynth.js';
import { PixelGladeEngine } from '../visuals/pixelEngine.js';
import { renderPixelGraffiti, bindPixelGraffitiEvents } from './pixelGraffiti.js';
import { renderPixelSmoreGame, bindPixelSmoreEvents } from './pixelSmoreGame.js';

let gladeEngine = null;

export function renderPixelGladeScreen() {
  const state = store.getState();
  const room = state.activeRoom || {};

  return `
    <div class="relative w-full max-w-[880px] mx-auto px-4 pt-6 pb-24 select-none text-on-surface">
      <!-- Ambient Glow Orbs -->
      <div class="absolute top-12 left-1/4 w-80 h-44 bg-sunset-coral/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-80 right-4 w-72 h-72 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Glade Top Header Card -->
      <div class="relative overflow-hidden bg-surface-container rounded-2xl p-4 sm:p-5 shadow-xl border border-border/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose p-[1.5px] shadow-glow-coral flex items-center justify-center shrink-0">
            <div class="w-full h-full bg-canvas rounded-[10px] flex items-center justify-center">
              <span class="text-xl">🏕️</span>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-headline-md text-lg sm:text-xl font-bold tracking-tight text-white">The Pixel Campfire Glade</h2>
              <span class="px-2 py-0.5 rounded-full bg-mint-green/20 text-mint-green border border-mint-green/30 text-[10px] font-mono font-bold">16-BIT ARCADE</span>
            </div>
            <p class="text-xs text-on-surface-variant">
              Retro Gathering Space for <strong class="text-amber-gold">${room.podName || 'Campfire Squad'}</strong>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button id="btn-glade-speak" class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-border/70 text-xs font-bold text-gray-200 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm" title="Trigger character dialogue">
            <span class="material-symbols-outlined text-[16px] text-sunset-coral">forum</span>
            <span>ROAST THEATRE</span>
          </button>
          <button id="btn-glade-fanfare" class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-amber-gold/15 hover:bg-amber-gold/25 border border-amber-gold/30 text-xs font-bold text-amber-gold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm" title="Play 8-bit fanfare">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">music_note</span>
            <span>8-BIT FANFARE</span>
          </button>
        </div>
      </div>

      <!-- 16-Bit Interactive Pixel Glade Canvas Stage -->
      <div class="relative w-full rounded-2xl bg-[#0B0E17] border-2 border-border shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden mb-6">
        <canvas id="pixel-glade-canvas" class="w-full h-[340px] sm:h-[380px] block cursor-pointer"></canvas>

        <!-- Overlay Instructions Tag -->
        <div class="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none text-xs">
          <span class="px-3 py-1 rounded-full bg-[#0B0E17]/85 backdrop-blur-md border border-border/50 text-[11px] font-mono text-gray-400 flex items-center gap-1.5 shadow">
            <span class="material-symbols-outlined text-[14px] text-amber-gold">touch_app</span>
            <span>Click any camper to trigger speech</span>
          </span>
          <span class="px-3 py-1 rounded-full bg-sunset-coral/20 border border-sunset-coral/40 text-[11px] font-mono font-bold text-sunset-coral flex items-center gap-1 shadow">
            <span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-ping"></span>
            <span>16-Bit Embers Live</span>
          </span>
        </div>
      </div>

      <!-- Mini-Game 1: Collaborative 32x32 Pixel Graffiti Wall -->
      ${renderPixelGraffiti()}

      <!-- Mini-Game 2: Campfire S'more Roaster -->
      ${renderPixelSmoreGame()}

      <!-- Bottom Nav Bridge -->
      <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
        <button id="btn-glade-to-lobby" class="px-5 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-bright border border-border/70 text-xs sm:text-sm font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-md">
          <span class="material-symbols-outlined text-[18px]">group</span>
          <span>BACK TO POD LOBBY</span>
        </button>
        <button id="btn-glade-to-game" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs sm:text-sm shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
          <span>ENTER PARTY GAMES</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

export function bindPixelGladeEvents() {
  // Initialize or restart 16-bit pixel engine
  if (gladeEngine) gladeEngine.stop();
  gladeEngine = new PixelGladeEngine('pixel-glade-canvas');

  // Bind sub-components
  bindPixelGraffitiEvents();
  bindPixelSmoreEvents();

  // Roast Theatre button triggers a speech bubble and audio blip
  const speakBtn = document.getElementById('btn-glade-speak');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      chiptune.playJump();
      if (gladeEngine) gladeEngine.triggerRandomSpeech();
    });
  }

  // 8-Bit Fanfare Tune
  const fanfareBtn = document.getElementById('btn-glade-fanfare');
  if (fanfareBtn) {
    fanfareBtn.addEventListener('click', () => {
      chiptune.playFanfare();
    });
  }

  // Back to Lobby
  const lobbyBtn = document.getElementById('btn-glade-to-lobby');
  if (lobbyBtn) {
    lobbyBtn.addEventListener('click', () => {
      chiptune.playJump();
      store.setView('LOBBY');
    });
  }

  // Play Party Games
  const gameBtn = document.getElementById('btn-glade-to-game');
  if (gameBtn) {
    gameBtn.addEventListener('click', () => {
      chiptune.playCoin();
      store.setView('GAME');
    });
  }
}
