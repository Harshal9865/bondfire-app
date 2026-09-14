// ==============================================================================
// CYBERPUNK CHINESE NEON TORII / PAIFANG GATE ENTRY PORTAL
// Immersive full-screen entrance sanctuary with authentic 3D cyberpunk scene,
// interactive talisman string curtain, ceremonial dragon brazier, resonant wind gong,
// and cinematic warp entry sequence into Bondfire.
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

// Designer Talisman Runes for Paper Tags (isolated with notranslate)
const TALISMAN_RUNES = ['篝', '火', '契', '灵', '龙', '梦', '心', '缘', '幻', '光', '影', '永', '恒', '福', '禧', '界'];

export function renderGateScreen() {
  // Generate 16 vertical strings with rhythmic variations of designer charms
  const stringCount = 16;
  let stringsHtml = '';

  for (let i = 0; i < stringCount; i++) {
    const rune = TALISMAN_RUNES[i % TALISMAN_RUNES.length];
    const hasBiTop = i % 2 === 0;
    const hasFlameMid = i % 3 === 0;
    const hasBiBottom = (i + 1) % 2 === 0;

    stringsHtml += `
      <div class="cyber-gate-string" data-string-index="${i}">
        <!-- Thin Cord -->
        <div class="cyber-string-cord"></div>

        <!-- Designer Charm 1: Top Jade Bi Ring or Flame Bead -->
        ${hasBiTop ? '<div class="cyber-talisman-charm talisman-jade-bi" title="Jade Bi Charm"></div>' : '<div class="cyber-talisman-charm talisman-flame-bead" title="Cyber Flame Bead"></div>'}

        <!-- Designer Charm 2: Mid Taoist Cyber-Talisman Paper Tag (notranslate protected) -->
        <div class="cyber-talisman-charm talisman-paper-tag notranslate" translate="no" title="Cyber Talisman: ${rune}">
          <span class="notranslate select-none" translate="no">${rune}</span>
        </div>

        <!-- Designer Charm 3: Mid/Lower Flame Bead or Bi -->
        ${hasFlameMid ? '<div class="cyber-talisman-charm talisman-flame-bead" title="Amber Ember Bead"></div>' : ''}
        ${hasBiBottom ? '<div class="cyber-talisman-charm talisman-jade-bi" title="Dragon Jade Seal"></div>' : ''}

        <!-- Designer Charm 4: Weighted Brass Bell & Red Silk Tassel at End -->
        <div class="cyber-talisman-charm talisman-bell-tassel">
          <div class="talisman-bell-body"></div>
          <div class="talisman-red-tassel"></div>
        </div>
      </div>
    `;
  }

  return `
    <div id="cyber-gate-screen" class="cyber-gate-universe select-none notranslate" translate="no">
      
      <!-- Authentic Cyberpunk Torii Paifang 3D Scene Backdrop (Reference Images 1 & 2) -->
      <div class="absolute inset-0 bg-cover bg-center sm:bg-bottom bg-no-repeat pointer-events-none z-0" style="background-image: url('assets/cyber_gate_scene.jpg');"></div>
      
      <!-- Atmospheric Darkness & Vignette Gradients -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-[#0B0E17]/85 pointer-events-none z-1"></div>

      <!-- Wet Floor Reflection Grid Overlay -->
      <div class="cyber-wet-floor">
        <div class="cyber-floor-grid"></div>
        <div class="cyber-ground-fog-layer"></div>
      </div>

      <!-- Horizontal Cyber Wall: Left Side Vertical Holographic Signs -->
      <aside class="cyber-wall-left hidden lg:flex notranslate" translate="no">
        <div class="neon-chinese-sign neon-sign-red ml-6 mb-12 shadow-2xl">
          <span class="notranslate" translate="no">赛博·篝火</span>
        </div>
        <div class="neon-chinese-sign neon-sign-cyan ml-6 text-xs opacity-85">
          <span class="notranslate" translate="no">数码回忆</span>
        </div>
        <div class="cyber-pillar-tower ml-auto mr-2 opacity-60">
          <div class="cyber-pillar-roof"></div>
        </div>
      </aside>

      <!-- Horizontal Cyber Wall: Right Side Vertical Holographic Signs -->
      <aside class="cyber-wall-right hidden lg:flex notranslate" translate="no">
        <div class="cyber-pillar-tower mr-auto ml-2 opacity-60">
          <div class="cyber-pillar-roof"></div>
        </div>
        <div class="neon-chinese-sign neon-sign-cyan mr-6 mb-12 shadow-2xl">
          <span class="notranslate" translate="no">魂灵之契</span>
        </div>
        <div class="neon-chinese-sign neon-sign-gold mr-6 text-xs opacity-85">
          <span class="notranslate" translate="no">永恒光影</span>
        </div>
      </aside>

      <!-- Top Header Title: Animated Cyberpunk Welcome Neon Typography -->
      <header class="w-full max-w-3xl mx-auto pt-5 sm:pt-7 px-4 text-center z-30 flex flex-col items-center notranslate" translate="no">
        <!-- Holographic Cyber Seal Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10131c]/85 border border-sunset-coral/50 shadow-[0_0_18px_rgba(255,90,95,0.4)] mb-2 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span class="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-sunset-coral uppercase notranslate" translate="no">
            ⛩️ DIGITAL SANCTUARY GATE // 篝火传送门
          </span>
        </div>

        <!-- Master Animated Welcome Heading (User Request) -->
        <h1 class="font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase drop-shadow-[0_0_22px_rgba(255,90,95,0.9)] leading-tight notranslate" translate="no">
          WELCOME TO <span class="bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold bg-clip-text text-transparent underline decoration-sunset-coral/50 decoration-wavy">BONDFIRE</span>
        </h1>

        <!-- Cyberpunk Chinese Subtitle -->
        <p class="font-mono text-xs sm:text-sm text-gray-200 mt-1.5 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] notranslate" translate="no">
          <span class="text-amber-gold font-bold">「 踏入赛博篝火 · 开启真实回忆 」</span>
          <span class="text-gray-400 hidden sm:inline">— Brush strings to part the veil —</span>
        </p>
      </header>

      <!-- Centerpiece: Torii Portal Archway with Interactive Talisman String Curtain -->
      <section class="cyber-torii-frame w-full px-2 my-auto flex flex-col items-center justify-center" id="cyber-gate-portal-frame">
        
        <!-- Center Glowing Signboard over the gate portal -->
        <div class="relative mb-2 px-5 py-1.5 rounded-lg bg-[#0E121E]/95 border border-sunset-coral shadow-[0_0_20px_rgba(255,90,95,0.8)] z-30 flex items-center gap-2 notranslate" translate="no">
          <span class="text-sunset-coral font-bold text-xs sm:text-sm tracking-widest font-mono">⛩️ 篝火神殿 // BONDFIRE ⛩️</span>
        </div>

        <!-- Grand Portal Archway -->
        <div class="cyber-gate-portal-arch relative cursor-pointer group" id="gate-portal-arch" title="Click to Enter Bondfire">
          
          <!-- Luminous Void Background with Drifting Stars -->
          <div class="cyber-portal-void">
            <div class="cyber-portal-stars"></div>
          </div>

          <!-- THE INTERACTIVE STRING / BEAD CURTAIN (User Request) -->
          <div class="cyber-curtain-container" id="cyber-curtain-container">
            <!-- Brass Mounting Pole -->
            <div class="cyber-curtain-pole">
              <div class="cyber-curtain-pole-finial"></div>
              <div class="text-[9px] font-mono font-bold tracking-widest text-amber-gold uppercase opacity-90 notranslate" translate="no">
                · · · TALISMAN VEIL · · ·
              </div>
              <div class="cyber-curtain-pole-finial"></div>
            </div>

            <!-- Hanging Interactive Strings Stage -->
            <div class="cyber-strings-stage" id="cyber-strings-stage">
              ${stringsHtml}
            </div>
          </div>

          <!-- Interactive Item 1: Cyber Dragon Brazier (Left Base) -->
          <div class="cyber-dragon-brazier" id="gate-dragon-brazier" title="Dragon Cyber Brazier (Click to ignite)">
            <div class="brazier-cauldron">
              <div class="brazier-flame" id="brazier-flame-core"></div>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-black/70 border border-sunset-coral/40 text-[8px] font-mono text-sunset-coral uppercase tracking-wider notranslate" translate="no">
              龙火 🔥
            </div>
          </div>

          <!-- Interactive Item 2: Holographic Wind Gong (Right Base) -->
          <div class="cyber-wind-gong" id="gate-cyber-bell" title="Zen Wind Bell / Gong (Click to strike)">
            <div class="gong-disk" id="gong-disk-el">
              <div class="gong-ripple" id="gong-ripple-ring"></div>
              <span class="material-symbols-outlined text-[20px] text-amber-gold drop-shadow-[0_0_6px_#fff]">notifications_active</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-black/70 border border-amber-gold/40 text-[8px] font-mono text-amber-gold uppercase tracking-wider notranslate" translate="no">
              祈愿钟 🔔
            </div>
          </div>

        </div>

      </section>

      <!-- Bottom Enter Prompt & Action Bar -->
      <footer class="w-full max-w-lg mx-auto pb-5 sm:pb-7 px-4 text-center z-30 flex flex-col items-center notranslate" translate="no">
        <!-- Main Enter Button -->
        <button id="btn-enter-gate" class="relative group overflow-hidden px-7 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-[#0B0E17] font-black text-sm sm:text-base tracking-wide shadow-[0_0_35px_rgba(255,90,95,0.85)] hover:shadow-[0_0_55px_rgba(255,183,3,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer">
          <span class="material-symbols-outlined text-[22px] group-hover:rotate-45 transition-transform duration-300">vpn_key</span>
          <span class="notranslate" translate="no">踏入篝火 // ENTER BONDFIRE</span>
          <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <!-- Hint -->
        <span class="text-[11px] text-gray-300 font-mono mt-2 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] notranslate" translate="no">
          Click the gate, strings, brazier or enter button to proceed
        </span>
      </footer>

    </div>
  `;
}

export function bindGateScreenEvents() {
  const container = document.getElementById('cyber-gate-screen');
  const portalArch = document.getElementById('gate-portal-arch');
  const enterBtn = document.getElementById('btn-enter-gate');
  const curtainContainer = document.getElementById('cyber-curtain-container');
  const stringsStage = document.getElementById('cyber-strings-stage');
  const dragonBrazier = document.getElementById('gate-dragon-brazier');
  const flameCore = document.getElementById('brazier-flame-core');
  const windGong = document.getElementById('gate-cyber-bell');
  const gongRipple = document.getElementById('gong-ripple-ring');

  if (!container) return;

  // Temporarily hide the floating Jukebox container on the gate screen to prevent any overlap
  const jukebox = document.getElementById('spotify-jukebox-container');
  if (jukebox) {
    jukebox.classList.add('hidden');
  }

  // Track if entering sequence has been triggered
  let hasEntered = false;

  const triggerEnterSequence = () => {
    if (hasEntered) return;
    hasEntered = true;

    // 1. Play futuristic warp sound effect
    audio.playGateWarp();

    // 2. Add visual warp sequence classes
    container.classList.add('is-entering');

    // 3. Restore jukebox visibility for the rest of the application
    if (jukebox) {
      jukebox.classList.remove('hidden');
    }

    // 4. Mark session flag so navigating between games won't re-trap user
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem('bondfire_gate_entered', 'true');
      } catch (_) {}
    }

    // 5. Smoothly transition to HOME view
    setTimeout(() => {
      store.setState({ currentView: 'HOME' });
      if (typeof window !== 'undefined') {
        window.location.hash = '#/HOME';
      }
    }, 750);
  };

  // Bind Enter triggers
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnterSequence();
    });
  }

  if (portalArch) {
    portalArch.addEventListener('click', (e) => {
      // Don't trigger if clicked on child interactive objects directly
      if (e.target.closest('#gate-dragon-brazier') || e.target.closest('#gate-cyber-bell')) {
        return;
      }
      triggerEnterSequence();
    });
  }

  // ============================================================================
  // INTERACTIVE STRING / BEAD CURTAIN PHYSICS
  // Swaying and harmonic chimes on cursor brush or touch drag
  // ============================================================================
  if (curtainContainer && stringsStage) {
    const stringElements = Array.from(stringsStage.querySelectorAll('.cyber-gate-string'));

    let lastSoundTime = 0;

    const handlePointerMove = (clientX, clientY) => {
      stringElements.forEach((strEl, index) => {
        const rect = strEl.getBoundingClientRect();
        const strCenterX = rect.left + rect.width / 2;
        const dx = clientX - strCenterX;
        const dist = Math.abs(dx);

        // Within interaction threshold (38px)
        if (dist < 38) {
          const pushDir = dx > 0 ? -1 : 1;
          const force = (1 - dist / 38);
          const angle = pushDir * force * 24;

          strEl.style.transform = `rotate(${angle}deg) scale(1.05)`;
          strEl.classList.add('is-brushed');

          // Play crystal pentatonic chime (throttled to avoid cacophony)
          const now = Date.now();
          if (now - lastSoundTime > 80) {
            lastSoundTime = now;
            audio.playTalismanChime(index);
          }
        } else {
          strEl.style.transform = 'rotate(0deg) scale(1)';
          strEl.classList.remove('is-brushed');
        }
      });
    };

    const resetStrings = () => {
      stringElements.forEach((strEl) => {
        strEl.style.transform = 'rotate(0deg) scale(1)';
        strEl.classList.remove('is-brushed');
      });
    };

    curtainContainer.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    curtainContainer.addEventListener('mouseleave', () => {
      resetStrings();
    });

    // Touch support for Mobile & Tablet screens
    curtainContainer.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    curtainContainer.addEventListener('touchend', () => {
      resetStrings();
    });
  }

  // ============================================================================
  // INTERACTIVE ITEM 1: DRAGON CYBER BRAZIER
  // Cycles flame colors and triggers digital spark chime
  // ============================================================================
  if (dragonBrazier) {
    const flameThemes = [
      { name: 'Coral Fire', bg: 'radial-gradient(circle at 50% 80%, #ffffff 0%, #ffb703 40%, #ff5a5f 80%, transparent 100%)', shadow: '#ff5a5f' },
      { name: 'Dragon Emerald', bg: 'radial-gradient(circle at 50% 80%, #ffffff 0%, #34d399 40%, #059669 80%, transparent 100%)', shadow: '#34d399' },
      { name: 'Phoenix Gold', bg: 'radial-gradient(circle at 50% 80%, #ffffff 0%, #fde047 40%, #ea580c 80%, transparent 100%)', shadow: '#fde047' },
      { name: 'Void Violet', bg: 'radial-gradient(circle at 50% 80%, #ffffff 0%, #f472b6 40%, #8b5cf6 80%, transparent 100%)', shadow: '#f472b6' }
    ];
    let themeIndex = 0;

    dragonBrazier.addEventListener('click', (e) => {
      e.stopPropagation();
      themeIndex = (themeIndex + 1) % flameThemes.length;
      const theme = flameThemes[themeIndex];

      if (flameCore) {
        flameCore.style.background = theme.bg;
        flameCore.style.filter = `drop-shadow(0 0 16px ${theme.shadow})`;
      }

      // Spark sound
      audio.playSuccess();
    });
  }

  // ============================================================================
  // INTERACTIVE ITEM 2: HOLOGRAPHIC WIND GONG
  // Strikes gong, plays deep Tibetan resonant bell, and triggers shockwave ring
  // ============================================================================
  if (windGong) {
    windGong.addEventListener('click', (e) => {
      e.stopPropagation();

      // 1. Play deep zen gong acoustic chime
      audio.playZenGong();

      // 2. Trigger expanding shockwave ripple animation
      if (gongRipple) {
        gongRipple.classList.remove('is-struck');
        // Force reflow
        void gongRipple.offsetWidth;
        gongRipple.classList.add('is-struck');
      }
    });
  }
}
