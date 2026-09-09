// ==============================================================================
// CAMPFIRE S'MORE REFLEX MINI-GAME (Refined & Enhanced)
// Real-time multi-stage marshmallow toasting reflex game with chiptune audio,
// sweet-spot precision gauge, combo streak multiplier, and real Sparks payouts
// ==============================================================================

import { store } from '../state/store.js';
import { chiptune } from '../visuals/chiptuneSynth.js';

let heatInterval = null;
let heatLevel = 0;
let isToasting = false;
let sessionScore = 0;
let sessionStreak = 0;
let bestStreak = 0;

export function renderPixelSmoreGame() {
  const user = store.getState().currentUser;
  const currentSparks = user?.sparks || 0;

  return `
    <div class="relative w-full rounded-2xl bg-surface-container p-4 sm:p-6 shadow-xl border border-border/80 mb-6 select-none">
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border/60">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
            <span class="material-symbols-outlined text-[20px]">local_fire_department</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base sm:text-lg text-on-surface font-bold">Campfire S'more Roaster</h3>
              <span class="px-2 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30 text-[10px] font-mono font-bold">ARCADE</span>
            </div>
            <p class="text-xs text-on-surface-variant">Hold marshmallow over embers. Pull inside the Golden Zone (70-85%) for Sparks!</p>
          </div>
        </div>

        <!-- Score & Multiplier HUD -->
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-xl bg-surface-container-high border border-border/70 text-right">
            <div class="text-[10px] uppercase font-mono text-gray-400 font-bold">Earned Sparks</div>
            <div class="font-display text-sm sm:text-base font-extrabold text-amber-gold tabular-nums" id="smore-score-display">
              +${sessionScore} <span class="text-[10px] font-normal text-gray-400">PTS</span>
            </div>
          </div>
          <div class="px-3 py-1.5 rounded-xl bg-surface-container-high border border-border/70 text-right">
            <div class="text-[10px] uppercase font-mono text-gray-400 font-bold">Combo Streak</div>
            <div class="font-display text-sm sm:text-base font-extrabold text-mint-green tabular-nums" id="smore-streak-display">
              ${sessionStreak}x 🔥
            </div>
          </div>
        </div>
      </div>

      <!-- Toasting Arena -->
      <div class="mt-4 p-5 sm:p-7 rounded-2xl bg-surface-container-lowest/90 border border-border/70 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        <!-- Ember Glow Backdrop -->
        <div id="smore-fire-glow" class="absolute inset-0 bg-gradient-to-t from-sunset-coral/10 via-amber-gold/5 to-transparent pointer-events-none transition-opacity duration-300 opacity-30"></div>

        <!-- Animated Marshmallow Graphic -->
        <div class="relative z-10 flex flex-col items-center justify-center my-2">
          <div id="smore-graphic" class="text-6xl sm:text-7xl transition-all duration-150 transform hover:scale-105">
            🍢
          </div>
          <div id="smore-stage-tag" class="mt-2 px-3 py-0.5 rounded-full bg-surface-container text-[11px] font-mono font-bold text-gray-400 border border-border/50">
            RAW (0%)
          </div>
        </div>

        <!-- Precision Heat Gauge -->
        <div class="w-full max-w-sm mt-3 relative z-10">
          <div class="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400 mb-1.5">
            <span class="text-gray-400">RAW (0%)</span>
            <span class="text-mint-green flex items-center gap-1 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-ping"></span>
              GOLDEN ZONE (70-85%)
            </span>
            <span class="text-sunset-coral">BURNT (100%)</span>
          </div>

          <!-- Gauge Bar Container -->
          <div class="h-4 w-full bg-surface-container rounded-full overflow-hidden relative border border-border/80 p-0.5 shadow-inner">
            <!-- Golden Target Range Marker (70% - 85%) -->
            <div class="absolute top-0 bottom-0 left-[70%] w-[15%] bg-mint-green/25 border-x border-mint-green/60 z-10"></div>

            <!-- Active Heat Fill -->
            <div id="smore-heat-bar" class="h-full rounded-full transition-all duration-75 ease-linear" style="width: 0%; background: linear-gradient(90deg, #FFFFFF 0%, #FFB703 65%, #4ADE80 75%, #FF5A5F 90%, #3E2723 100%);"></div>
          </div>
        </div>

        <!-- Status / Coaching Prompt -->
        <div id="smore-status" class="mt-4 min-h-[24px] font-display text-xs sm:text-sm font-bold text-gray-300 text-center relative z-10">
          Click "HOLD OVER EMBERS" to start toasting!
        </div>
      </div>

      <!-- Action Button Controls -->
      <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button id="btn-smore-action" class="w-full sm:w-80 py-3.5 px-6 rounded-full bg-surface-bright hover:bg-surface-container-high text-white font-bold text-sm sm:text-base border border-border/80 shadow-lg hover:border-amber-gold/50 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[20px] text-amber-gold">local_fire_department</span>
          <span id="smore-btn-text">HOLD OVER EMBERS</span>
        </button>
      </div>
    </div>
  `;
}

export function bindPixelSmoreEvents() {
  const actionBtn = document.getElementById('btn-smore-action');
  const btnText = document.getElementById('smore-btn-text');
  const heatBar = document.getElementById('smore-heat-bar');
  const statusEl = document.getElementById('smore-status');
  const graphicEl = document.getElementById('smore-graphic');
  const stageTag = document.getElementById('smore-stage-tag');
  const fireGlow = document.getElementById('smore-fire-glow');
  const scoreDisplay = document.getElementById('smore-score-display');
  const streakDisplay = document.getElementById('smore-streak-display');

  if (!actionBtn) return;

  const resetBtn = () => {
    actionBtn.className = 'w-full sm:w-80 py-3.5 px-6 rounded-full bg-surface-bright hover:bg-surface-container-high text-white font-bold text-sm sm:text-base border border-border/80 shadow-lg hover:border-amber-gold/50 active:scale-95 transition-all flex items-center justify-center gap-2';
    if (btnText) btnText.textContent = 'TOAST AGAIN';
    if (fireGlow) fireGlow.style.opacity = '0.3';
  };

  const handleAction = (e) => {
    if (e && e.type === 'touchstart') e.preventDefault();

    if (!isToasting) {
      // Begin toasting
      isToasting = true;
      heatLevel = 0;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);

      actionBtn.className = 'w-full sm:w-80 py-3.5 px-6 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-sm sm:text-base shadow-glow-coral active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse';
      if (btnText) btnText.textContent = '🍢 PULL & TOSS NOW!';
      if (statusEl) statusEl.innerHTML = '<span class="text-amber-gold">Toasting over hot embers... Watch for the Golden Zone!</span>';
      if (fireGlow) fireGlow.style.opacity = '0.8';
      if (graphicEl) graphicEl.style.filter = 'none';

      chiptune.playSizzle();

      if (heatInterval) clearInterval(heatInterval);
      heatInterval = setInterval(() => {
        heatLevel += 1.8;
        const currentPct = Math.min(100, Math.round(heatLevel));

        if (heatBar) heatBar.style.width = `${currentPct}%`;

        // Update stages
        if (heatLevel < 45) {
          if (stageTag) {
            stageTag.textContent = `RAW (${currentPct}%)`;
            stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-surface-container text-[11px] font-mono font-bold text-gray-400 border border-border/50';
          }
          if (graphicEl) graphicEl.textContent = '🍢';
        } else if (heatLevel < 70) {
          if (stageTag) {
            stageTag.textContent = `WARMING UP (${currentPct}%)`;
            stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-amber-gold/15 text-[11px] font-mono font-bold text-amber-gold border border-amber-gold/30';
          }
          if (graphicEl) graphicEl.textContent = '🍞';
        } else if (heatLevel <= 85) {
          if (stageTag) {
            stageTag.textContent = `✨ GOLDEN ZONE! (${currentPct}%)`;
            stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-mint-green/20 text-[11px] font-mono font-bold text-mint-green border border-mint-green/50 animate-bounce';
          }
          if (graphicEl) {
            graphicEl.textContent = '🧇';
            graphicEl.style.filter = 'drop-shadow(0 0 15px #FFB703)';
          }
        } else if (heatLevel < 95) {
          if (stageTag) {
            stageTag.textContent = `⚠️ OVERHEATING! (${currentPct}%)`;
            stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-sunset-coral/20 text-[11px] font-mono font-bold text-sunset-coral border border-sunset-coral/50 animate-pulse';
          }
          if (graphicEl) {
            graphicEl.textContent = '🔥';
            graphicEl.style.filter = 'drop-shadow(0 0 15px #FF5A5F)';
          }
        } else {
          // 100% BURNT
          clearInterval(heatInterval);
          isToasting = false;
          sessionStreak = 0;
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 40, 80]);
          chiptune.playRoastBuzzer();

          if (stageTag) {
            stageTag.textContent = '💀 BURNT ASH (100%)';
            stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-red-900/40 text-[11px] font-mono font-bold text-red-400 border border-red-500/50';
          }
          if (graphicEl) {
            graphicEl.textContent = '🪨';
            graphicEl.style.filter = 'brightness(0.3) saturate(0)';
          }
          if (statusEl) {
            statusEl.innerHTML = '<span class="text-sunset-coral">💀 BURNT TO A CRISP! You pulled too late. Combo reset to 0.</span>';
          }
          if (streakDisplay) streakDisplay.textContent = '0x 🔥';
          resetBtn();
        }
      }, 50);
    } else {
      // Pull marshmallow
      clearInterval(heatInterval);
      isToasting = false;

      if (heatLevel >= 70 && heatLevel <= 85) {
        // GOLDEN ZONE WIN!
        sessionStreak++;
        if (sessionStreak > bestStreak) bestStreak = sessionStreak;

        const points = 100 * sessionStreak;
        sessionScore += points;

        // Reward real Sparks to user account in store!
        const currentSparks = store.getState().currentUser?.sparks || 0;
        store.setSparks(currentSparks + points);

        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([40, 30, 80]);
        chiptune.playCoin();

        if (graphicEl) {
          graphicEl.textContent = '✨🍢✨';
          graphicEl.style.filter = 'drop-shadow(0 0 20px #FFB703)';
        }
        if (stageTag) {
          stageTag.textContent = `PERFECT ROAST (${Math.round(heatLevel)}%)`;
          stageTag.className = 'mt-2 px-3 py-0.5 rounded-full bg-mint-green/20 text-[11px] font-mono font-bold text-mint-green border border-mint-green/50';
        }
        if (statusEl) {
          statusEl.innerHTML = `<span class="text-mint-green font-bold">✨ MASTER CHEF TIER! Perfect golden caramel (+${points} Sparks deposited!)</span>`;
        }
      } else if (heatLevel < 70) {
        // Pulled too early
        sessionStreak = 0;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
        chiptune.playJump();

        if (statusEl) {
          statusEl.innerHTML = `<span class="text-amber-gold">Cold & doughy! Pulled too early at ${Math.round(heatLevel)}%. (0 Sparks)</span>`;
        }
      } else {
        // Overcooked
        sessionStreak = 0;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(60);
        chiptune.playRoastBuzzer();

        if (statusEl) {
          statusEl.innerHTML = `<span class="text-sunset-coral">Charred edges! Pulled too late at ${Math.round(heatLevel)}%. (0 Sparks)</span>`;
        }
      }

      if (scoreDisplay) scoreDisplay.innerHTML = `+${sessionScore} <span class="text-[10px] font-normal text-gray-400">PTS</span>`;
      if (streakDisplay) streakDisplay.textContent = `${sessionStreak}x 🔥`;
      resetBtn();
    }
  };

  actionBtn.addEventListener('click', handleAction);
}
