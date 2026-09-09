// ==============================================================================
// THE PIXEL CAMPFIRE GLADE & RETRO ARCADE COMPONENT (Creative Feature)
// 16-Bit Animated Campsite, 8-Bit Roast Theatre, Graffiti Wall & S'more Mini-Games
// ==============================================================================

import { store } from '../state/store.js';
import { chiptune } from '../visuals/chiptuneSynth.js';
import { PixelGladeEngine } from '../visuals/pixelEngine.js';
import { renderPixelGraffiti, bindPixelGraffitiEvents } from './pixelGraffiti.js';
import { renderPixelSmoreGame, bindPixelSmoreEvents } from './pixelSmoreGame.js';

let gladeEngine = null;

export function renderPixelGladeScreen() {
  const state = store.getState();
  const room = state.activeRoom;

  return `
    <section class="app-container" style="padding-top: var(--space-md); padding-bottom: var(--space-3xl); max-width: 860px;">
      <!-- Glade Top Header -->
      <div class="glass-card glass-frosted" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); border-color: var(--accent-amber); flex-wrap: wrap; gap: var(--space-xs);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">🏕️</span>
            <h2 style="font-size: var(--text-xl);">The Pixel Campfire Glade</h2>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted);">
            16-Bit Retro Gathering Space for <strong>${room.podName}</strong>
          </div>
        </div>
        <div style="display: flex; gap: var(--space-xs); align-items: center;">
          <button class="btn btn-ghost btn-sm" id="btn-glade-speak" title="Trigger character dialogue">
            <span>💬</span> ROAST THEATRE
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-glade-fanfare" title="Play 8-bit fanfare">
            <span>🎺</span> 8-BIT TUNE
          </button>
        </div>
      </div>

      <!-- 16-Bit Interactive Pixel Glade Canvas Stage -->
      <div class="glass-card" style="padding: 0; overflow: hidden; margin-bottom: var(--space-xl); border-color: var(--border-medium); box-shadow: 0 15px 40px rgba(0,0,0,0.8); position: relative;">
        <!-- Canvas Element -->
        <canvas id="pixel-glade-canvas" style="width: 100%; height: 360px; display: block;"></canvas>

        <!-- Overlay Instructions Tag -->
        <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none;">
          <span class="badge" style="background: rgba(11, 14, 23, 0.75); border: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 10px;">
            🎮 Click any pixel character to hear their unhinged quote
          </span>
          <span class="badge badge-amber" style="font-size: 10px;">
            🔥 16-Bit Bondfire Active
          </span>
        </div>
      </div>

      <!-- Mini-Game 1: Collaborative 32x32 Pixel Graffiti Wall -->
      ${renderPixelGraffiti()}

      <!-- Mini-Game 2: Campfire S'more Reflex Toss -->
      ${renderPixelSmoreGame()}

      <!-- Bottom Nav Bridge -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
        <button class="btn btn-ghost btn-sm" id="btn-glade-to-lobby">
          <span>👥</span> BACK TO POD LOBBY
        </button>
        <button class="btn btn-primary btn-sm" id="btn-glade-to-game">
          <span>🎮</span> PLAY SQUAD TRIVIA NOW ➔
        </button>
      </div>
    </section>
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

  // Play Trivia
  const gameBtn = document.getElementById('btn-glade-to-game');
  if (gameBtn) {
    gameBtn.addEventListener('click', () => {
      chiptune.playCoin();
      store.setView('GAME');
    });
  }
}
