// ==============================================================================
// CYBERPUNK SANCTUARY GATEWAY (100% English Cyberpunk Style)
// Ultra-luxury full-screen cinematic entrance portal with authentic 3D cyberpunk scene,
// glowing holographic Torii energy core, interactive soundscape, quick mode teleports,
// and smooth warp entry into Bondfire.
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export function renderGateScreen() {
  return `
    <div id="cyber-gate-screen" class="cyber-gate-universe select-none notranslate" translate="no">
      
      <!-- Authentic Cyberpunk Torii Paifang 3D Scene Backdrop -->
      <div class="absolute inset-0 bg-cover bg-center sm:bg-bottom bg-no-repeat pointer-events-none z-0" style="background-image: url('assets/cyber_gate_scene.jpg');"></div>
      
      <!-- Cinematic Atmospheric Darkness & Vignette Gradients -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/25 to-[#080B14]/85 pointer-events-none z-1"></div>

      <!-- Wet Floor Reflection Grid Overlay -->
      <div class="cyber-wet-floor pointer-events-none z-2">
        <div class="cyber-floor-grid"></div>
        <div class="cyber-ground-fog-layer"></div>
      </div>

      <!-- Floating Cyber Embers / Sparks -->
      <div class="cyber-embers-container pointer-events-none z-3">
        <div class="cyber-ember ember-1"></div>
        <div class="cyber-ember ember-2"></div>
        <div class="cyber-ember ember-3"></div>
        <div class="cyber-ember ember-4"></div>
        <div class="cyber-ember ember-5"></div>
      </div>

      <!-- Top HUD Bar -->
      <header class="w-full max-w-6xl mx-auto pt-4 sm:pt-6 px-4 sm:px-8 flex items-center justify-between z-30 notranslate" translate="no">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#0E121E]/80 border border-sunset-coral/50 flex items-center justify-center shadow-[0_0_12px_rgba(255,90,95,0.4)]">
            <span class="material-symbols-outlined text-[16px] text-sunset-coral animate-pulse">local_fire_department</span>
          </div>
          <div>
            <div class="text-[11px] font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span>BONDFIRE SANCTUARY</span>
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping"></span>
            </div>
            <div class="text-[9px] font-mono text-gray-400">NEURAL LINK // LATENCY 12MS</div>
          </div>
        </div>

        <!-- Quick Direct Skip Button -->
        <button id="btn-skip-gate" class="px-3.5 py-1.5 rounded-full bg-[#10131c]/80 hover:bg-[#181d2c] border border-gray-700/60 hover:border-sunset-coral/50 text-gray-300 hover:text-white text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm group shadow-lg" title="Skip directly to Campfire">
          <span>Enter Directly</span>
          <span class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">east</span>
        </button>
      </header>

      <!-- Centerpiece Hero: Atmospheric Gateway & Master Welcome Typography -->
      <main class="cyber-torii-frame w-full max-w-3xl mx-auto my-auto px-4 py-6 flex flex-col items-center justify-center text-center z-30 notranslate" translate="no">
        
        <!-- Category Pill (100% English Cyberpunk Style) -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10131c]/85 border border-sunset-coral/50 shadow-[0_0_20px_rgba(255,90,95,0.35)] mb-3 backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-ping"></span>
          <span class="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-sunset-coral uppercase">
            // CYBER SANCTUARY PORTAL :: PROTOCOL 01 //
          </span>
        </div>

        <!-- Master Welcome Neon Heading -->
        <h1 class="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(255,90,95,0.85)] leading-tight mb-2">
          WELCOME TO <span class="bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold bg-clip-text text-transparent">BONDFIRE</span>
        </h1>

        <!-- Elegant Cyberpunk Subtitle (100% English Cyberpunk Style) -->
        <p class="font-mono text-xs sm:text-sm text-gray-300 max-w-lg mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <span class="text-amber-gold font-bold">"STEP INTO THE CYBER CAMPFIRE — UNLOCK REAL MEMORIES"</span>
          <span class="block sm:inline text-gray-400 mt-1 sm:mt-0 sm:ml-2">Neural intimacy protocol active · Jack in to connect.</span>
        </p>

        <!-- Interactive Holographic Gateway Portal Core -->
        <div class="cyber-portal-core relative my-2 flex flex-col items-center justify-center" id="cyber-portal-core">
          
          <!-- Concentric Neon Energy Rings -->
          <div class="portal-energy-ring portal-ring-outer"></div>
          <div class="portal-energy-ring portal-ring-inner"></div>

          <!-- Master Glowing Call-to-Action Button (English Cyberpunk) -->
          <button id="btn-enter-gate" class="relative group overflow-hidden px-8 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-[#080B14] font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_40px_rgba(255,90,95,0.85)] hover:shadow-[0_0_65px_rgba(255,183,3,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer z-10">
            <span class="material-symbols-outlined text-[24px] group-hover:rotate-45 transition-transform duration-300">power_settings_new</span>
            <span>JACK IN // ENTER BONDFIRE</span>
            <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
          </button>
        </div>

        <!-- Quick Teleport Sanctuary Options (100% English Cyberpunk) -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 z-20">
          <!-- Duo Mode -->
          <button id="btn-gate-duo" class="gate-teleport-pill group px-4 py-2 rounded-xl bg-[#0E121E]/75 hover:bg-[#14192b]/90 border border-[#38BDF8]/40 hover:border-[#38BDF8] text-left transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:scale-[1.03] shadow-lg">
            <span class="text-base sm:text-lg">💖</span>
            <div>
              <div class="text-[11px] font-mono font-bold text-[#38BDF8] group-hover:text-white transition-colors">[ DUO SANCTUARY ]</div>
              <div class="text-[9px] font-mono text-gray-400">2-Player Synapse Link</div>
            </div>
          </button>

          <!-- Squad Mode -->
          <button id="btn-gate-squad" class="gate-teleport-pill group px-4 py-2 rounded-xl bg-[#0E121E]/75 hover:bg-[#14192b]/90 border border-sunset-coral/40 hover:border-sunset-coral text-left transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:scale-[1.03] shadow-lg">
            <span class="text-base sm:text-lg">🔥</span>
            <div>
              <div class="text-[11px] font-mono font-bold text-sunset-coral group-hover:text-white transition-colors">[ SQUAD POD ]</div>
              <div class="text-[9px] font-mono text-gray-400">4-Player Overdrive Campfire</div>
            </div>
          </button>

          <!-- Keepsakes / Stories -->
          <button id="btn-gate-vault" class="gate-teleport-pill group px-4 py-2 rounded-xl bg-[#0E121E]/75 hover:bg-[#14192b]/90 border border-amber-gold/40 hover:border-amber-gold text-left transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:scale-[1.03] shadow-lg">
            <span class="text-base sm:text-lg">⚡</span>
            <div>
              <div class="text-[11px] font-mono font-bold text-amber-gold group-hover:text-white transition-colors">[ MEMORY VAULT ]</div>
              <div class="text-[9px] font-mono text-gray-400">Archived Relics &amp; Keepsakes</div>
            </div>
          </button>
        </div>

      </main>

      <!-- Bottom Status Footer -->
      <footer class="w-full max-w-xl mx-auto pb-4 sm:pb-6 px-4 text-center z-30 notranslate" translate="no">
        <span class="text-[10px] text-gray-400 font-mono tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          BONDFIRE OS v6.0 // ENCRYPTED P2P LINK · 100% REAL HUMAN CONNECTION
        </span>
      </footer>

    </div>
  `;
}

export function bindGateScreenEvents() {
  const container = document.getElementById('cyber-gate-screen');
  const enterBtn = document.getElementById('btn-enter-gate');
  const skipBtn = document.getElementById('btn-skip-gate');
  const duoBtn = document.getElementById('btn-gate-duo');
  const squadBtn = document.getElementById('btn-gate-squad');
  const vaultBtn = document.getElementById('btn-gate-vault');

  if (!container) return;

  // Temporarily hide the floating Jukebox container on the gate screen
  const jukebox = document.getElementById('spotify-jukebox-container');
  if (jukebox) {
    jukebox.classList.add('hidden');
  }

  let hasEntered = false;

  const triggerEnterSequence = (targetHash = '#/HOME', targetView = 'HOME') => {
    if (hasEntered) return;
    hasEntered = true;

    // 1. Play futuristic warp sound effect
    audio.playGateWarp();

    // 2. Add visual warp sequence class
    container.classList.add('is-entering');

    // 3. Restore jukebox visibility
    if (jukebox) {
      jukebox.classList.remove('hidden');
    }

    // 4. Mark session flag
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem('bondfire_gate_entered', 'true');
      } catch (_) {}
    }

    // 5. Smoothly transition
    setTimeout(() => {
      store.setState({ currentView: targetView });
      if (typeof window !== 'undefined') {
        window.location.hash = targetHash;
      }
    }, 600);
  };

  // Bind main enter button
  if (enterBtn) {
    enterBtn.addEventListener('mouseenter', () => audio.playTalismanChime(4));
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/HOME', 'HOME');
    });
  }

  // Bind quick skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/HOME', 'HOME');
    });
  }

  // Bind quick teleport mode pills
  if (duoBtn) {
    duoBtn.addEventListener('mouseenter', () => audio.playTalismanChime(1));
    duoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/ROOMS', 'ROOMS');
    });
  }

  if (squadBtn) {
    squadBtn.addEventListener('mouseenter', () => audio.playTalismanChime(2));
    squadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/ROOMS', 'ROOMS');
    });
  }

  if (vaultBtn) {
    vaultBtn.addEventListener('mouseenter', () => audio.playTalismanChime(3));
    vaultBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/HOME', 'HOME');
    });
  }
}
