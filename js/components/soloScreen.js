// ==============================================================================
// SOLO "TIME CAPSULE" COMPONENT (Screen 4)
// "On This Day" Audio Note Waveform, Daily Reflection Vault & Future Letters
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

let isAudioPlaying = false;
let audioPlayInterval = null;

export function renderSoloScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const firstName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Citizen';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const sparks = user?.sparks || 50;

  return `
    <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-6 pb-28 gap-5 relative select-none text-on-surface">
      <!-- Ambient Glows -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-amber-gold/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-96 -right-16 w-56 h-56 bg-sunset-coral/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Top Streak & User Header -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface-container border border-border/80 shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-amber-gold/20 flex items-center justify-center shrink-0 border border-amber-gold/30">
            <span class="material-symbols-outlined text-amber-gold text-[22px]">person</span>
          </div>
          <div class="flex flex-col min-w-0">
            <h2 class="font-headline-sm text-base sm:text-lg text-white truncate font-bold">${greeting}, ${firstName}</h2>
            <span class="font-caption text-xs text-gray-400 font-mono">PERSONAL TIME CAPSULE &amp; REFLECTION VAULT</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-bold shrink-0">
          <span>🔥</span>
          <span>12-DAY STREAK</span>
        </div>
      </div>

      <!-- Daily Quick Reflection Box -->
      <div class="p-4 sm:p-5 rounded-2xl bg-surface-container border border-border/80 shadow-lg flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-gold text-[20px]">edit_note</span>
            <h3 class="font-bold text-white text-sm">Today's One-Line Memory</h3>
          </div>
          <span class="text-[10px] uppercase font-mono font-bold text-mint-green bg-mint-green/10 border border-mint-green/30 px-2 py-0.5 rounded-full">+15 Sparks</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-2">
          <input type="text" id="daily-reflection-input" placeholder="What's one funny or peaceful thing that happened today?" class="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-border/70 focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none transition-colors" />
          <button type="button" id="btn-save-daily-reflection" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-gold to-sunset-coral hover:brightness-110 text-canvas font-bold text-xs shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>Save to Vault</span>
          </button>
        </div>
      </div>

      <!-- "On This Day" Resurfaced Memory Tile -->
      <div class="p-5 rounded-2xl bg-surface-container border border-border/80 shadow-xl flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-caption text-[11px] font-bold">🗓️ 3 YEARS AGO TODAY (SEPTEMBER 2023)</span>
          <span class="text-xs text-gray-400 font-mono">Private to You</span>
        </div>

        <div class="rounded-xl overflow-hidden h-52 relative border border-border/60">
          <div class="w-full h-full bg-gradient-to-br from-[#1c1828] to-[#0d101a] flex items-center justify-center relative">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#ffb703_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div class="flex flex-col items-center gap-2 z-10 text-center px-4">
              <span class="material-symbols-outlined text-amber-gold text-[48px] drop-shadow-md">cabin</span>
              <span class="font-mono text-[11px] uppercase tracking-wider text-amber-gold font-bold">Manali Vault Capsule #09</span>
            </div>
          </div>
          <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div class="font-display font-bold text-base text-white">The Mountain Cabin Morning</div>
            <div class="text-xs text-gray-300">Recorded in Manali · Sept 09, 2023</div>
          </div>
        </div>

        <!-- Audio Note Waveform Player -->
        <div class="bg-surface-container-lowest border border-border/70 rounded-full px-4 py-2 flex items-center gap-3">
          <button class="w-9 h-9 rounded-full bg-surface-bright hover:bg-amber-gold hover:text-canvas text-amber-gold flex items-center justify-center transition-all active:scale-95 shrink-0 shadow" id="btn-solo-audio-play" type="button">
            <span id="audio-play-icon" class="text-sm font-bold">▶</span>
          </button>
          
          <!-- Animated Waveform Bars -->
          <div class="flex items-center gap-[3px] flex-1 h-6" id="waveform-bars">
            ${Array.from({ length: 28 })
              .map(
                (_, i) => `
              <div class="waveform-bar flex-1 bg-amber-gold/70 rounded-sm transition-all duration-200" style="height: ${Math.sin(i * 0.45) * 10 + 12}px;"></div>
            `
              )
              .join('')}
          </div>

          <span class="text-xs font-mono font-bold text-gray-400 shrink-0" id="audio-timer">0:42s</span>
        </div>

        <!-- The Viral Bridge Card: Turn into Multiplayer Quiz -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-sunset-coral/15 via-amber-gold/10 to-transparent border border-sunset-coral/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div class="font-bold text-xs sm:text-sm text-white">Turn this memory into a 2-minute quiz for your friends!</div>
            <div class="text-xs text-gray-400 mt-0.5">Auto-formats question: &ldquo;Who woke up at 5 AM to watch the sunrise?&rdquo;</div>
          </div>
          <button class="px-4 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 shrink-0" id="btn-solo-to-pod" type="button">
            Send to Squad &rarr;
          </button>
        </div>
      </div>

      <!-- "Letter to Future Self" Capsule Module -->
      <div class="p-5 rounded-2xl bg-surface-container border border-border/80 shadow-xl flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-headline-sm text-base text-white font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-[20px]">mail</span>
              <span>Letters to Future Self</span>
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">Write something today that will remain sealed until your chosen milestone.</p>
          </div>
          <button class="px-3 py-1.5 rounded-full bg-surface-bright hover:bg-surface-container-high border border-border/80 text-xs font-bold text-white transition-colors active:scale-95 shrink-0" id="btn-open-letter-modal" type="button">
            + Write Letter
          </button>
        </div>

        <div id="sealed-capsules-list" class="flex flex-col gap-2.5">
          <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-border/70 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-2xl shrink-0">🔒</span>
              <div class="min-w-0">
                <div class="font-bold text-xs sm:text-sm text-white truncate">Capsule #4 · 30th Birthday Letter</div>
                <div class="text-xs text-amber-gold font-mono truncate">Unlocks on Dec 31, 2026 (112 days remaining)</div>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-surface-bright text-gray-400 text-[10px] font-bold uppercase font-mono shrink-0 border border-border/50">Sealed</span>
          </div>
        </div>
      </div>

      <!-- Write Future Letter Modal -->
      <div id="future-letter-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" style="display: none;">
        <div class="relative w-full max-w-lg bg-surface-container-low border border-amber-gold/40 rounded-3xl p-6 shadow-2xl text-on-surface flex flex-col gap-4">
          <div class="flex justify-between items-center pb-3 border-b border-border/80">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🔒</span>
              <h3 class="font-headline-sm text-base text-amber-gold font-bold">Seal a Letter to Future Self</h3>
            </div>
            <button class="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white" id="btn-close-letter-modal">✕</button>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Capsule Title</label>
            <input type="text" id="letter-title-input" placeholder="e.g. Note to Me in 2027" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-amber-gold" />
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Unlock Milestone</label>
            <select id="letter-unlock-select" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-amber-gold">
              <option value="6_months">6 Months from Today</option>
              <option value="1_year" selected>1 Year from Today</option>
              <option value="3_years">3 Years from Today</option>
              <option value="new_year">Next New Year</option>
            </select>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Your Letter (AES Encrypted at Rest)</label>
            <textarea id="letter-content-input" rows="4" placeholder="What are you hoping for? What made you laugh this week? Write without holding back..." class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-amber-gold resize-none"></textarea>
          </div>

          <button class="w-full py-3 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral hover:brightness-110 text-canvas font-bold text-xs shadow transition-transform active:scale-95 flex items-center justify-center gap-2" id="btn-confirm-seal-letter" type="button">
            <span>🔒</span>
            <span>Digitally Seal With Wax Stamp</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function showToast(msg, type = 'mint') {
  const mount = document.getElementById('toast-mount');
  if (mount) {
    mount.innerHTML = `<div class="toast toast-${type} show"><span>${msg}</span></div>`;
    setTimeout(() => {
      if (mount.innerHTML.includes(msg)) mount.innerHTML = '';
    }, 2800);
  }
}

export function bindSoloEvents() {
  // Daily Reflection Save Handler
  const reflectionInput = document.getElementById('daily-reflection-input');
  const saveReflectionBtn = document.getElementById('btn-save-daily-reflection');

  if (saveReflectionBtn && reflectionInput) {
    saveReflectionBtn.addEventListener('click', () => {
      const text = reflectionInput.value.trim();
      if (!text) {
        showToast('Please write a short reflection before saving ✨', 'amber');
        return;
      }

      audio.playCorrect();
      
      // Award sparks
      store.addSparks(15);

      // Save into vault
      const newMemory = {
        id: `mem_solo_${Date.now()}`,
        type: 'NOTE',
        title: 'Daily Reflection',
        snippet: text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: store.getState().currentUser?.name || 'You',
        tags: ['Solo', 'Daily Reflection', 'Private']
      };

      const currentMemories = store.getState().vaultMemories || [];
      store.setState({ vaultMemories: [newMemory, ...currentMemories] });

      showToast('✨ Daily reflection sealed into Vault (+15 Sparks)!', 'mint');
      reflectionInput.value = '';
    });
  }

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
      const content = contentInput?.value.trim();
      if (!content) {
        showToast('Please write your letter before sealing 🔒', 'amber');
        return;
      }
      audio.playCorrect();
      store.addSparks(25);

      // Append newly sealed capsule to the list
      const capsuleEl = document.createElement('div');
      capsuleEl.className = 'p-3.5 rounded-xl bg-surface-container-lowest border border-amber-gold/50 flex items-center justify-between gap-3 animate-fade-in';
      capsuleEl.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-2xl shrink-0">🔒</span>
          <div class="min-w-0">
            <div class="font-bold text-xs sm:text-sm text-white truncate">${title}</div>
            <div class="text-xs text-amber-gold font-mono truncate">Unlocks in 1 Year · Sealed with Wax Stamp</div>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-mint-green/20 text-mint-green border border-mint-green/30 text-[10px] font-bold uppercase font-mono shrink-0">Just Sealed ✓</span>
      `;
      listContainer.prepend(capsuleEl);

      showToast('Wax stamp applied! Letter sealed for 1 year (+25 Sparks) 🔒', 'mint');
      modal.style.display = 'none';
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
    });
  }
}

