// ==============================================================================
// SOLO "TIME CAPSULE" COMPONENT (Screen 4)
// "On This Day" Audio Note Waveform, Sealed Letters, and 1-Tap Viral Bridge
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

let isAudioPlaying = false;
let audioPlayInterval = null;

export function renderSoloScreen() {
  const user = store.getState().currentUser;
  const firstName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Citizen';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return `
    <section class="app-container" style="padding-top: var(--space-md); padding-bottom: var(--space-3xl); max-width: 680px;">
      <!-- Top Streak & Greeting -->
      <div class="glass-card glass-frosted" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); border-color: var(--accent-amber);">
        <div>
          <h2 style="font-size: var(--text-lg); margin-bottom: 2px;">${greeting}, ${firstName}</h2>
          <div style="font-size: var(--text-xs); color: var(--text-muted);">Personal Time Capsule & Reflection Vault</div>
        </div>
        <div>
          <span class="badge badge-amber" style="font-size: var(--text-xs);">🔥 12-DAY STREAK</span>
        </div>
      </div>

      <!-- "On This Day" Resurfaced Memory Tile -->
      <div class="glass-card" style="margin-bottom: var(--space-lg); border-color: var(--border-medium); padding: var(--space-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
          <span class="badge badge-amber">🗓️ 3 YEARS AGO TODAY (SEPTEMBER 2023)</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">Private to You</span>
        </div>

        <div style="border-radius: var(--radius-sm); overflow: hidden; height: 240px; margin-bottom: var(--space-md); position: relative;">
          <div style="width: 100%; height: 100%; background: radial-gradient(circle at 70% 30%, rgba(255, 183, 3, 0.35), transparent 60%), linear-gradient(135deg, #181528 0%, #0d0f1a 100%); display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="position: absolute; inset: 0; opacity: 0.15; background-image: radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 16px 16px;"></div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 1;">
              <span class="material-symbols-outlined" style="font-size: 56px; color: var(--accent-amber); opacity: 0.9;">cabin</span>
              <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-amber);">Manali Vault Capsule #09</span>
            </div>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-md); background: linear-gradient(0deg, rgba(0,0,0,0.8), transparent);">
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); color: #FFF;">The Mountain Cabin Morning</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary);">Recorded in Manali · Sept 09, 2023</div>
          </div>
        </div>

        <!-- Audio Note Waveform Player -->
        <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); padding: 8px 16px; display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
          <button class="btn btn-secondary btn-sm" id="btn-solo-audio-play" style="border-radius: 50%; width: 36px; height: 36px; padding: 0;">
            <span id="audio-play-icon">▶</span>
          </button>
          
          <!-- Animated Waveform Bars -->
          <div style="display: flex; align-items: center; gap: 3px; flex: 1; height: 24px;" id="waveform-bars">
            ${Array.from({ length: 32 })
              .map(
                (_, i) => `
              <div class="waveform-bar" style="flex: 1; background-color: var(--accent-amber); border-radius: 2px; height: ${Math.sin(i * 0.4) * 12 + 14}px; opacity: 0.7; transition: height 0.2s;"></div>
            `
              )
              .join('')}
          </div>

          <span style="font-size: var(--text-xs); font-family: var(--font-display); font-weight: 700; color: var(--text-muted);" id="audio-timer">0:42s</span>
        </div>

        <!-- The Viral Bridge Card: Turn into Multiplayer Quiz -->
        <div style="background: linear-gradient(135deg, rgba(255, 90, 95, 0.12), rgba(255, 183, 3, 0.08)); border: 1px solid var(--accent-coral); border-radius: var(--radius-sm); padding: var(--space-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
          <div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm); color: #FFFFFF;">
              Turn this memory into a 2-minute quiz for your friends!
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted);">
              Auto-formats question: "Who woke up at 5 AM to watch the sunrise?"
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-solo-to-pod">
            SEND TO GOA SQUAD ➔
          </button>
        </div>
      </div>

      <!-- "Letter to Future Self" Capsule Module -->
      <div class="glass-card" style="margin-bottom: var(--space-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs); flex-wrap: wrap; gap: var(--space-xs);">
          <h3 style="font-size: var(--text-base);">✉️ Letters to Future Self</h3>
          <button class="btn btn-secondary btn-sm" id="btn-open-letter-modal">
            <span>+</span> WRITE NEW LETTER
          </button>
        </div>
        <p style="font-size: var(--text-xs); margin-bottom: var(--space-md);">
          Write something today that will remain sealed with a digital countdown lock until a future milestone.
        </p>

        <div id="sealed-capsules-list" style="display: flex; flex-direction: column; gap: var(--space-sm);">
          <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 24px;">🔒</span>
              <div>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm);">Capsule #4 · 30th Birthday Letter</div>
                <div style="font-size: var(--text-xs); color: var(--accent-amber);">Unlocks on Dec 31, 2026 (112 days remaining)</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" disabled style="opacity: 0.6;">SEALED</button>
          </div>
        </div>
      </div>

      <!-- Write Future Letter Modal -->
      <div id="future-letter-modal" style="display: none; position: fixed; inset: 0; background: rgba(11, 14, 23, 0.85); backdrop-filter: blur(16px); z-index: 999; align-items: center; justify-content: center; padding: var(--space-md);">
        <div class="glass-card" style="max-width: 520px; width: 100%; border-color: var(--accent-amber); box-shadow: 0 20px 50px rgba(0,0,0,0.8); animation: toastIn 0.3s var(--ease-spring);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <h3 style="font-size: var(--text-lg); color: var(--accent-amber);">🔒 Seal a Letter to Future Self</h3>
            <button class="btn btn-ghost btn-sm" id="btn-close-letter-modal" style="padding: 0 8px;">✕</button>
          </div>

          <div style="margin-bottom: var(--space-md);">
            <label style="display: block; font-size: var(--text-xs); font-family: var(--font-display); font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">CAPSULE TITLE</label>
            <input type="text" id="letter-title-input" placeholder="e.g. Note to Me in 2027" class="input-field" />
          </div>

          <div style="margin-bottom: var(--space-md);">
            <label style="display: block; font-size: var(--text-xs); font-family: var(--font-display); font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">UNLOCK MILESTONE</label>
            <select id="letter-unlock-select" class="input-field">
              <option value="1_year">1 Year from Today (September 2027)</option>
              <option value="3_years">3 Years from Today (September 2029)</option>
              <option value="next_new_year">Next New Year (Jan 1, 2027)</option>
              <option value="wedding_anniversary">Next Anniversary</option>
            </select>
          </div>

          <div style="margin-bottom: var(--space-lg);">
            <label style="display: block; font-size: var(--text-xs); font-family: var(--font-display); font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">YOUR LETTER (ENCRYPTED AT REST)</label>
            <textarea id="letter-content-input" rows="4" placeholder="What are you hoping for? What made you laugh this week? Write without holding back..." class="input-field" style="padding: var(--space-sm); resize: vertical;"></textarea>
          </div>

          <button class="btn btn-secondary btn-lg" id="btn-confirm-seal-letter" style="width: 100%;">
            <span>🔒</span> DIGITALLY SEAL WITH WAX STAMP
          </button>
        </div>
      </div>
    </section>
  `;
}

export function bindSoloEvents() {
  // Audio Waveform Play / Pause
  const playBtn = document.getElementById('btn-solo-audio-play');
  const playIcon = document.getElementById('audio-play-icon');
  const bars = document.querySelectorAll('.waveform-bar');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      audio.playClick();
      isAudioPlaying = !isAudioPlaying;

      if (isAudioPlaying) {
        playIcon.textContent = '⏸';
        audioPlayInterval = setInterval(() => {
          bars.forEach((bar) => {
            bar.style.height = `${Math.floor(Math.random() * 18 + 6)}px`;
          });
        }, 150);
      } else {
        playIcon.textContent = '▶';
        clearInterval(audioPlayInterval);
      }
    });
  }

  // Viral Bridge -> Go to Pod Lobby
  const bridgeBtn = document.getElementById('btn-solo-to-pod');
  if (bridgeBtn) {
    bridgeBtn.addEventListener('click', () => {
      audio.playCorrect();
      store.setMode('PODS');
      store.setView('LOBBY');
    });
  }

  // Future Letter Modal Logic
  const openModalBtn = document.getElementById('btn-open-letter-modal');
  const closeModalBtn = document.getElementById('btn-close-letter-modal');
  const modal = document.getElementById('future-letter-modal');
  const confirmSealBtn = document.getElementById('btn-confirm-seal-letter');
  const titleInput = document.getElementById('letter-title-input');
  const contentInput = document.getElementById('letter-content-input');
  const listContainer = document.getElementById('sealed-capsules-list');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      audio.playClick();
      modal.style.display = 'flex';
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      audio.playClick();
      modal.style.display = 'none';
    });
  }

  if (confirmSealBtn && modal && listContainer) {
    confirmSealBtn.addEventListener('click', () => {
      const title = titleInput?.value.trim() || 'Sealed Note to Self';
      audio.playCorrect();

      // Append newly sealed capsule to the list
      const capsuleEl = document.createElement('div');
      capsuleEl.style.cssText =
        'background-color: var(--bg-canvas); border: 1px solid var(--accent-amber); border-radius: var(--radius-sm); padding: var(--space-md); display: flex; justify-content: space-between; align-items: center; animation: toastIn 0.3s var(--ease-spring);';
      capsuleEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">🔒</span>
          <div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm);">${title}</div>
            <div style="font-size: var(--text-xs); color: var(--accent-amber);">Unlocks in 1 Year · Sealed with Wax Stamp</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" disabled style="opacity: 0.8; color: var(--accent-mint); border-color: var(--accent-mint);">JUST SEALED ✓</button>
      `;
      listContainer.prepend(capsuleEl);

      modal.style.display = 'none';
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
    });
  }
}
