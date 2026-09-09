// ==============================================================================
// CAMPFIRE S'MORE REFLEX MINI-GAME
// Real-time marshmallow toasting reflex game with chiptune audio & Sparks rewards
// ==============================================================================

import { store } from '../state/store.js';
import { chiptune } from '../visuals/chiptuneSynth.js';

let heatInterval = null;
let heatLevel = 0;
let isToasting = false;
let score = 0;
let streak = 0;

export function renderPixelSmoreGame() {
  return `
    <div class="glass-card" style="border-color: var(--accent-coral); margin-bottom: var(--space-xl);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-sm);">
        <div>
          <span class="badge badge-live" style="font-size: 10px;">RETRO MINI-GAME 2</span>
          <h3 style="font-size: var(--text-lg); margin-top: 4px;">🍢 Campfire S'more Reflex Toss</h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            Toast your marshmallow over the embers. Pull at the Golden Zone (70-85%) for maximum Sparks!
          </p>
        </div>
        <div style="text-align: right;">
          <span style="font-family: var(--font-display); font-weight: 800; font-size: var(--text-lg); color: var(--accent-amber);" class="tabular-nums" id="smore-score-display">
            ${score} <span style="font-size: 10px;">Sparks</span>
          </span>
          <div style="font-size: 10px; color: var(--accent-mint);" id="smore-streak-display">Streak: ${streak}x 🔥</div>
        </div>
      </div>

      <!-- Toasting Visual Arena -->
      <div style="background: #0B0E17; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: var(--space-lg); text-align: center; margin-bottom: var(--space-md); position: relative; overflow: hidden;">
        <!-- Marshmallow Graphic -->
        <div id="smore-graphic" style="font-size: 54px; margin-bottom: var(--space-sm); transition: transform 0.15s, filter 0.2s;">
          🍢
        </div>

        <!-- Heat Meter Bar -->
        <div style="max-width: 320px; margin: 0 auto 12px auto;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: var(--font-display); font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">
            <span>RAW</span>
            <span style="color: var(--accent-mint);">✨ GOLDEN (70-85%)</span>
            <span style="color: var(--accent-coral);">BURNT</span>
          </div>
          <div style="height: 14px; background: var(--bg-surface-2); border-radius: var(--radius-pill); overflow: hidden; position: relative; border: 1px solid var(--border-subtle);">
            <!-- Golden Zone Indicator -->
            <div style="position: absolute; left: 70%; width: 15%; height: 100%; background: rgba(74, 222, 128, 0.3); border-left: 1px dashed var(--accent-mint); border-right: 1px dashed var(--accent-mint);"></div>
            <!-- Progress Bar -->
            <div id="smore-heat-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #FFFFFF, var(--accent-amber), var(--accent-coral), #3E2723); transition: width 0.05s linear;"></div>
          </div>
        </div>

        <!-- Status / Feedback -->
        <div id="smore-status" style="min-height: 24px; font-family: var(--font-display); font-size: var(--text-sm); font-weight: 700; color: var(--text-secondary);">
          Tap "HOLD OVER FIRE" to start toasting!
        </div>
      </div>

      <!-- Controls -->
      <div style="display: flex; gap: var(--space-xs); justify-content: center;">
        <button class="btn btn-secondary btn-lg" id="btn-smore-action" style="flex: 1; max-width: 280px;">
          🔥 HOLD OVER FIRE
        </button>
      </div>
    </div>
  `;
}

export function bindPixelSmoreEvents() {
  const actionBtn = document.getElementById('btn-smore-action');
  const heatBar = document.getElementById('smore-heat-bar');
  const statusEl = document.getElementById('smore-status');
  const graphicEl = document.getElementById('smore-graphic');
  const scoreDisplay = document.getElementById('smore-score-display');
  const streakDisplay = document.getElementById('smore-streak-display');

  if (!actionBtn) return;

  const handleSmoreAction = (e) => {
    if (e && e.type === 'touchstart') {
      e.preventDefault();
    }

    if (!isToasting) {
      // Start toasting
      isToasting = true;
      heatLevel = 0;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      actionBtn.innerHTML = '🍢 PULL & TOSS NOW!';
      actionBtn.classList.remove('btn-secondary');
      actionBtn.classList.add('btn-primary');
      if (statusEl) statusEl.textContent = 'Toasting over embers... Watch the meter!';
      chiptune.playSizzle();

      if (heatInterval) clearInterval(heatInterval);
      heatInterval = setInterval(() => {
        heatLevel += 1.8;
        if (heatBar) heatBar.style.width = `${Math.min(100, heatLevel)}%`;

        if (heatLevel >= 100) {
          // Burnt out!
          clearInterval(heatInterval);
          isToasting = false;
          streak = 0;
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 40, 80]);
          chiptune.playRoastBuzzer();
          if (graphicEl) graphicEl.style.filter = 'brightness(0.3) saturate(0)';
          if (statusEl) statusEl.innerHTML = '<span style="color: var(--accent-coral);">💀 BURNT TO A CRISP! You waited too long. (0 Sparks)</span>';
          resetActionBtn();
        }
      }, 50);
    } else {
      // Pull marshmallow
      clearInterval(heatInterval);
      isToasting = false;

      if (heatLevel >= 70 && heatLevel <= 85) {
        // Golden Zone Success!
        streak++;
        const addedSparks = 100 * streak;
        score += addedSparks;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([40, 30, 80]);
        chiptune.playCoin();
        if (graphicEl) graphicEl.style.filter = 'drop-shadow(0 0 15px #FFB703)';
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: var(--accent-mint);">✨ PERFECT GOLDEN BROWN! Tossed to squad! (+${addedSparks} Sparks)</span>`;
        }
      } else if (heatLevel < 70) {
        // Too raw
        streak = 0;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
        chiptune.playJump();
        if (graphicEl) graphicEl.style.filter = 'none';
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: var(--accent-amber);">Raw marshmallow! Pulled too early at ${Math.round(heatLevel)}%. (0 Sparks)</span>`;
        }
      }

      if (scoreDisplay) scoreDisplay.innerHTML = `${score} <span style="font-size: 10px;">Sparks</span>`;
      if (streakDisplay) streakDisplay.textContent = `Streak: ${streak}x 🔥`;

      resetActionBtn();
    }
  };

  actionBtn.addEventListener('click', handleSmoreAction);
  actionBtn.addEventListener('touchstart', handleSmoreAction, { passive: false });

  const resetActionBtn = () => {
    actionBtn.innerHTML = '🔥 TOAST ANOTHER S\'MORE';
    actionBtn.classList.remove('btn-primary');
    actionBtn.classList.add('btn-secondary');
  };
}
