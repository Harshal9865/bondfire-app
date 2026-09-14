// ==============================================================================
// CYBERPUNK SANCTUARY GATEWAY (100% English Cyberpunk Style)
// Ultra-luxury full-screen cinematic entrance portal with authentic 3D cyberpunk scene,
// retro Cyberpunk Digital Watch / Neon LED Dot-Matrix Ticker, Crazy 3D Tilt
// Holographic Cards, glowing Torii energy core, and smooth dimensional warp entry.
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export function renderGateScreen() {
  return `
    <div id="cyber-gate-screen" class="cyber-gate-universe select-none notranslate" translate="no">
      
      <!-- Authentic Cyberpunk Torii Paifang 3D Scene Backdrop -->
      <div class="absolute inset-0 bg-cover bg-center sm:bg-bottom bg-no-repeat pointer-events-none z-0" style="background-image: url('assets/cyber_gate_scene.jpg');"></div>
      
      <!-- Cinematic Atmospheric Darkness & Vignette Gradients -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/30 to-[#080B14]/85 pointer-events-none z-1"></div>

      <!-- Wet Floor Reflection Grid Overlay -->
      <div class="cyber-wet-floor pointer-events-none z-2">
        <div class="cyber-floor-grid"></div>
        <div class="cyber-ground-fog-layer"></div>
      </div>

      <!-- Floating Cyber Embers / Sparks -->
      <div class="cyber-embers-container pointer-events-none z-3" id="gate-embers-mount">
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

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Overdrive Surge Control -->
          <button id="btn-gate-overdrive" class="px-3 py-1.5 rounded-full bg-[#10131c]/80 hover:bg-[#1f2538] border border-amber-gold/40 hover:border-amber-gold text-amber-gold hover:text-white text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm shadow-md" title="Surge Quantum Energy">
            <span class="material-symbols-outlined text-[14px] animate-spin">bolt</span>
            <span class="hidden sm:inline">OVERDRIVE</span>
          </button>

          <!-- Quick Direct Skip Button -->
          <button id="btn-skip-gate" class="px-3.5 py-1.5 rounded-full bg-[#10131c]/80 hover:bg-[#181d2c] border border-gray-700/60 hover:border-sunset-coral/50 text-gray-300 hover:text-white text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm group shadow-lg" title="Skip directly to Campfire">
            <span>Enter Directly</span>
            <span class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">east</span>
          </button>
        </div>
      </header>

      <!-- Centerpiece Hero: Atmospheric Gateway & Master Welcome Typography -->
      <main class="cyber-torii-frame w-full max-w-4xl mx-auto my-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-center text-center z-30 notranslate" translate="no">
        
        <!-- Category Pill (100% English Cyberpunk Style) -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10131c]/85 border border-sunset-coral/50 shadow-[0_0_20px_rgba(255,90,95,0.35)] mb-2 backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-ping"></span>
          <span class="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-sunset-coral uppercase">
            // CYBER SANCTUARY PORTAL :: PROTOCOL 01 //
          </span>
        </div>

        <!-- Master Welcome Neon Heading -->
        <h1 class="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(255,90,95,0.85)] leading-tight mb-2">
          WELCOME TO <span class="bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold bg-clip-text text-transparent">BONDFIRE</span>
        </h1>

        <!-- Elegant Cyberpunk Subtitle -->
        <p class="font-mono text-xs sm:text-sm text-gray-300 max-w-lg mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <span class="text-amber-gold font-bold">"STEP INTO THE CYBER CAMPFIRE — UNLOCK REAL MEMORIES"</span>
        </p>

        <!-- Interactive Holographic Gateway Portal Core -->
        <div class="cyber-portal-core relative my-1 flex flex-col items-center justify-center" id="cyber-portal-core">
          
          <!-- Concentric Neon Energy Rings -->
          <div class="portal-energy-ring portal-ring-outer" id="portal-ring-outer"></div>
          <div class="portal-energy-ring portal-ring-inner" id="portal-ring-inner"></div>

          <!-- Master Glowing Call-to-Action Button (English Cyberpunk) -->
          <button id="btn-enter-gate" class="relative group overflow-hidden px-8 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-[#080B14] font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_40px_rgba(255,90,95,0.85)] hover:shadow-[0_0_65px_rgba(255,183,3,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer z-10">
            <span class="material-symbols-outlined text-[24px] group-hover:rotate-45 transition-transform duration-300">power_settings_new</span>
            <span>JACK IN // ENTER BONDFIRE</span>
            <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
          </button>
        </div>

        <!-- CRAZY 3D TILT HOLOGRAPHIC DESTINATION CARDS -->
        <div class="mt-8 w-full">
          <div class="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-3 flex items-center justify-center gap-2">
            <span class="h-px w-8 bg-gray-700"></span>
            <span>DIRECT WARP DESTINATIONS // LIVE SECTORS</span>
            <span class="h-px w-8 bg-gray-700"></span>
          </div>

          <div class="cyber-card-grid">
            
            <!-- CARD 1: DUO SANCTUARY -->
            <div id="btn-gate-duo" class="cyber-tilt-card gate-teleport-pill group" data-card="duo">
              <div class="cyber-card-foil"></div>
              <div class="cyber-card-corner-tl"></div>
              <div class="cyber-card-corner-br"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xl">💖</span>
                <span class="inline-flex items-center gap-1 text-[8.5px] font-mono text-mint-green">
                  <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-ping"></span>
                  <span>28 ONLINE</span>
                </span>
              </div>
              <div class="text-xs font-mono font-black text-[#38BDF8] group-hover:text-white transition-colors uppercase truncate">[ DUO SANCTUARY ]</div>
              <div class="text-[9.5px] font-mono text-gray-400 mt-0.5">2-Player Synapse Link</div>
              <div class="mt-2 text-[8px] font-mono text-gray-500 flex justify-between border-t border-white/5 pt-1">
                <span>INTIMACY 99%</span>
                <span>WARP ➔</span>
              </div>
            </div>

            <!-- CARD 2: SQUAD POD -->
            <div id="btn-gate-squad" class="cyber-tilt-card gate-teleport-pill group" data-card="squad">
              <div class="cyber-card-foil"></div>
              <div class="cyber-card-corner-tl"></div>
              <div class="cyber-card-corner-br"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xl">🔥</span>
                <span class="inline-flex items-center gap-1 text-[8.5px] font-mono text-sunset-coral">
                  <span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-ping"></span>
                  <span>94 ONLINE</span>
                </span>
              </div>
              <div class="text-xs font-mono font-black text-sunset-coral group-hover:text-white transition-colors uppercase truncate">[ SQUAD POD ]</div>
              <div class="text-[9.5px] font-mono text-gray-400 mt-0.5">4-Player Overdrive</div>
              <div class="mt-2 text-[8px] font-mono text-gray-500 flex justify-between border-t border-white/5 pt-1">
                <span>HEARTH 100%</span>
                <span>WARP ➔</span>
              </div>
            </div>

            <!-- CARD 3: DESI ARCADIA (NEW INDIAN PARTY GAMES) -->
            <div id="btn-gate-desi" class="cyber-tilt-card gate-teleport-pill group" data-card="desi">
              <div class="cyber-card-foil"></div>
              <div class="cyber-card-corner-tl"></div>
              <div class="cyber-card-corner-br"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xl">👑</span>
                <span class="inline-flex items-center gap-1 text-[8.5px] font-mono text-amber-gold">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-gold animate-ping"></span>
                  <span>52 PLAYING</span>
                </span>
              </div>
              <div class="text-xs font-mono font-black text-amber-gold group-hover:text-white transition-colors uppercase truncate">[ DESI ARCADIA ]</div>
              <div class="text-[9.5px] font-mono text-gray-400 mt-0.5">Raja Mantri &amp; Filmi</div>
              <div class="mt-2 text-[8px] font-mono text-gray-500 flex justify-between border-t border-white/5 pt-1">
                <span>ROYAL HEIST</span>
                <span>WARP ➔</span>
              </div>
            </div>

            <!-- CARD 4: MEMORY VAULT & REAL PHOTO ALBUM -->
            <div id="btn-gate-vault" class="cyber-tilt-card gate-teleport-pill group" data-card="vault">
              <div class="cyber-card-foil"></div>
              <div class="cyber-card-corner-tl"></div>
              <div class="cyber-card-corner-br"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xl">⚡</span>
                <span class="inline-flex items-center gap-1 text-[8.5px] font-mono text-[#C084FC]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping"></span>
                  <span>140 SAVED</span>
                </span>
              </div>
              <div class="text-xs font-mono font-black text-[#C084FC] group-hover:text-white transition-colors uppercase truncate">[ MEMORY VAULT ]</div>
              <div class="text-[9.5px] font-mono text-gray-400 mt-0.5">Real Layflat Album</div>
              <div class="mt-2 text-[8px] font-mono text-gray-500 flex justify-between border-t border-white/5 pt-1">
                <span>STUDIO 4K</span>
                <span>WARP ➔</span>
              </div>
            </div>

          </div>
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
  const desiBtn = document.getElementById('btn-gate-desi');
  const vaultBtn = document.getElementById('btn-gate-vault');
  const overdriveBtn = document.getElementById('btn-gate-overdrive');

  if (!container) return;

  // Temporarily hide the floating Jukebox container on the gate screen
  const jukebox = document.getElementById('spotify-jukebox-container');
  if (jukebox) {
    jukebox.classList.add('hidden');
  }

  // Crazy 3D Tilt Card Interaction
  const tiltCards = container.querySelectorAll('.cyber-tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
      card.style.setProperty('--foil-x', `${(x / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--foil-y', `${(y / rect.height * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Overdrive Quantum Energy Pulse
  if (overdriveBtn) {
    let surgeCount = 0;
    overdriveBtn.addEventListener('click', () => {
      surgeCount++;
      audio.playLedTick();
      audio.playChime();

      const themes = [
        { outer: '#ff5a5f', inner: '#ffb703' },
        { outer: '#38bdf8', inner: '#f72585' },
        { outer: '#4ade80', inner: '#38bdf8' },
        { outer: '#c084fc', inner: '#ff5a5f' }
      ];
      const theme = themes[surgeCount % themes.length];
      const ringOuter = document.getElementById('portal-ring-outer');
      const ringInner = document.getElementById('portal-ring-inner');

      if (ringOuter) ringOuter.style.borderColor = theme.outer;
      if (ringInner) ringInner.style.borderColor = theme.inner;

      // Spawn rapid embers
      const embersMount = document.getElementById('gate-embers-mount');
      if (embersMount) {
        for (let i = 0; i < 4; i++) {
          const spark = document.createElement('div');
          spark.className = 'cyber-ember';
          spark.style.left = `${Math.random() * 80 + 10}%`;
          spark.style.width = '6px';
          spark.style.height = '6px';
          spark.style.background = theme.inner;
          spark.style.boxShadow = `0 0 14px ${theme.inner}`;
          spark.style.animationDuration = '4s';
          embersMount.appendChild(spark);
          setTimeout(() => spark.remove(), 4000);
        }
      }
    });
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

  // Bind quick teleport mode pills / 3D cards
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

  if (desiBtn) {
    desiBtn.addEventListener('mouseenter', () => audio.playRoyalFanfare());
    desiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/ARCADE', 'ARCADE');
    });
  }

  if (vaultBtn) {
    vaultBtn.addEventListener('mouseenter', () => audio.playTalismanChime(3));
    vaultBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence('#/YEARBOOK', 'YEARBOOK');
    });
  }
}
