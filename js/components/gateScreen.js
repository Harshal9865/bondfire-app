// ==============================================================================
// CYBERPUNK CHINESE NEON TORII / PAIFANG GATE ENTRY PORTAL
// Immersive full-screen entrance sanctuary with interactive talisman string curtain,
// ceremonial dragon brazier, resonant wind gong, and cinematic warp entry.
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

// Designer Talisman Runes for Paper Tags
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

        <!-- Designer Charm 2: Mid Taoist Cyber-Talisman Paper Tag -->
        <div class="cyber-talisman-charm talisman-paper-tag" title="Cyber Talisman: ${rune}">
          <span>${rune}</span>
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
    <div id="cyber-gate-screen" class="cyber-gate-universe select-none">
      
      <!-- Top Ambient Cyber Starfield / Scanline Layer -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,95,0.18)_0%,_rgba(11,14,25,0.92)_60%,_#05070d_100%)] pointer-events-none z-0"></div>
      
      <!-- Horizontal Cyber Wall: Left Side with Blue Neon Pagoda Pillar & Vertical Signs -->
      <aside class="cyber-wall-left hidden sm:flex">
        <!-- Vertical Holographic Chinese Neon Sign -->
        <div class="neon-chinese-sign neon-sign-red ml-4 sm:ml-6 mb-16 shadow-2xl">
          <span>赛博·篝火</span>
        </div>
        <div class="neon-chinese-sign neon-sign-cyan ml-4 sm:ml-6 text-xs opacity-80">
          <span>数码回忆</span>
        </div>

        <!-- Flanking Pagoda Lantern Tower (Reference Image 2) -->
        <div class="cyber-pillar-tower ml-auto mr-2">
          <div class="cyber-pillar-roof"></div>
          <div class="cyber-pillar-shaft">
            <div class="cyber-pillar-glow-ring"></div>
            <div class="cyber-pillar-glow-ring"></div>
            <div class="cyber-pillar-glow-ring"></div>
          </div>
        </div>
      </aside>

      <!-- Horizontal Cyber Wall: Right Side with Blue Neon Pagoda Pillar & Vertical Signs -->
      <aside class="cyber-wall-right hidden sm:flex">
        <!-- Flanking Pagoda Lantern Tower (Reference Image 2) -->
        <div class="cyber-pillar-tower mr-auto ml-2">
          <div class="cyber-pillar-roof"></div>
          <div class="cyber-pillar-shaft">
            <div class="cyber-pillar-glow-ring"></div>
            <div class="cyber-pillar-glow-ring"></div>
            <div class="cyber-pillar-glow-ring"></div>
          </div>
        </div>

        <!-- Vertical Holographic Chinese Neon Sign -->
        <div class="neon-chinese-sign neon-sign-cyan mr-4 sm:mr-6 mb-16 shadow-2xl">
          <span>魂灵之契</span>
        </div>
        <div class="neon-chinese-sign neon-sign-gold mr-4 sm:mr-6 text-xs opacity-80">
          <span>永恒光影</span>
        </div>
      </aside>

      <!-- Wet Reflective Stone Floor with Animated Ground Mist / Fog -->
      <div class="cyber-wet-floor">
        <div class="cyber-floor-grid"></div>
        <div class="cyber-ground-fog-layer"></div>
      </div>

      <!-- Top Header Title: Animated Cyberpunk Welcome Neon Typography -->
      <header class="w-full max-w-4xl mx-auto pt-6 sm:pt-8 md:pt-10 px-4 text-center z-30 flex flex-col items-center">
        <!-- Holographic Cyber Seal Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a29]/90 border border-sunset-coral/50 shadow-[0_0_15px_rgba(255,90,95,0.4)] mb-3">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span class="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-sunset-coral uppercase">
            ⛩️ DIGITAL SANCTUARY GATE // 篝火传送门
          </span>
        </div>

        <!-- Master Animated Welcome Heading (User Request) -->
        <h1 class="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(255,90,95,0.85)] leading-tight">
          WELCOME TO <span class="bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold bg-clip-text text-transparent underline decoration-sunset-coral/50 decoration-wavy">BONDFIRE</span>
        </h1>

        <!-- Cyberpunk Chinese Subtitle -->
        <p class="font-mono text-xs sm:text-sm text-gray-300 mt-2 flex items-center justify-center gap-2">
          <span class="text-amber-gold">「 踏入赛博篝火 · 开启真实回忆 」</span>
          <span class="text-gray-500 hidden sm:inline">— Touch strings to part the veil —</span>
        </p>
      </header>

      <!-- Centerpiece: Grand Cyberpunk Torii / Paifang Gate (Reference Images 1 & 2) -->
      <section class="cyber-torii-frame w-full px-2 my-auto" id="cyber-gate-portal-frame">
        
        <!-- Multi-tier Sweeping Pagoda Roof (Top Tier) -->
        <div class="cyber-roof-tier-top mx-auto relative flex justify-center items-end">
          <svg viewBox="0 0 500 60" class="w-full h-full overflow-visible" fill="none">
            <!-- Sweeping curved roof ridge -->
            <path d="M 10 50 Q 150 15 250 12 Q 350 15 490 50" stroke="#ff5a5f" stroke-width="4" filter="drop-shadow(0 0 10px #ff5a5f)" stroke-linecap="round"/>
            <path d="M 40 46 Q 160 22 250 18 Q 340 22 460 46" stroke="#ffb703" stroke-width="2" opacity="0.85"/>
            <!-- Flying Eaves Dragon Tips -->
            <path d="M 10 50 C -10 40 5 15 25 15" stroke="#ff5a5f" stroke-width="3" filter="drop-shadow(0 0 8px #ff5a5f)"/>
            <path d="M 490 50 C 510 40 495 15 475 15" stroke="#ff5a5f" stroke-width="3" filter="drop-shadow(0 0 8px #ff5a5f)"/>
          </svg>
        </div>

        <!-- Multi-tier Sweeping Pagoda Roof (Main Middle Tier with Dougong brackets) -->
        <div class="cyber-roof-tier-main mx-auto relative flex justify-center items-end">
          <svg viewBox="0 0 700 70" class="w-full h-full overflow-visible" fill="none">
            <!-- Main wide sweeping curved roof ridge -->
            <path d="M 10 58 Q 200 12 350 10 Q 500 12 690 58" stroke="#ff5a5f" stroke-width="5" filter="drop-shadow(0 0 14px #ff5a5f)" stroke-linecap="round"/>
            <path d="M 50 52 Q 220 20 350 16 Q 480 20 650 52" stroke="#ffdea9" stroke-width="2.5" opacity="0.9"/>
            <!-- Sweeping Eaves Up-turns -->
            <path d="M 10 58 C -15 45 5 10 35 12" stroke="#ff5a5f" stroke-width="4" filter="drop-shadow(0 0 10px #ff5a5f)"/>
            <path d="M 690 58 C 715 45 695 10 665 12" stroke="#ff5a5f" stroke-width="4" filter="drop-shadow(0 0 10px #ff5a5f)"/>
            <!-- Central Pagoda Crest / Jewel -->
            <circle cx="350" cy="8" r="8" fill="#ffb703" filter="drop-shadow(0 0 10px #ffb703)"/>
          </svg>
        </div>

        <!-- Center Glowing Signboard -->
        <div class="relative -mt-3 mb-1 px-5 py-1.5 rounded-lg bg-[#0E121E]/95 border-2 border-sunset-coral shadow-[0_0_20px_rgba(255,90,95,0.8)] z-30 flex items-center gap-2">
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
              <div class="text-[9px] font-mono font-bold tracking-widest text-amber-gold uppercase opacity-80">
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
            <div class="mt-1 px-1.5 py-0.5 rounded bg-black/60 border border-sunset-coral/40 text-[8px] font-mono text-sunset-coral uppercase tracking-wider">
              龙火 🔥
            </div>
          </div>

          <!-- Interactive Item 2: Holographic Wind Gong (Right Base) -->
          <div class="cyber-wind-gong" id="gate-cyber-bell" title="Zen Wind Bell / Gong (Click to strike)">
            <div class="gong-disk" id="gong-disk-el">
              <div class="gong-ripple" id="gong-ripple-ring"></div>
              <span class="material-symbols-outlined text-[20px] text-amber-gold drop-shadow-[0_0_6px_#fff]">notifications_active</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-black/60 border border-amber-gold/40 text-[8px] font-mono text-amber-gold uppercase tracking-wider">
              祈愿钟 🔔
            </div>
          </div>

        </div>

      </section>

      <!-- Bottom Enter Prompt & Action Bar -->
      <footer class="w-full max-w-lg mx-auto pb-6 sm:pb-8 px-4 text-center z-30 flex flex-col items-center">
        <!-- Main Enter Button -->
        <button id="btn-enter-gate" class="relative group overflow-hidden px-7 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-[#0B0E17] font-black text-sm sm:text-base tracking-wide shadow-[0_0_35px_rgba(255,90,95,0.75)] hover:shadow-[0_0_55px_rgba(255,183,3,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer">
          <span class="material-symbols-outlined text-[22px] group-hover:rotate-45 transition-transform duration-300">vpn_key</span>
          <span>踏入篝火 // ENTER BONDFIRE</span>
          <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <!-- Hint -->
        <span class="text-[11px] text-gray-400 font-mono mt-2 tracking-wide">
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

  // Track if entering sequence has been triggered
  let hasEntered = false;

  const triggerEnterSequence = () => {
    if (hasEntered) return;
    hasEntered = true;

    // 1. Play futuristic warp sound effect
    audio.playGateWarp();

    // 2. Add visual warp sequence classes
    container.classList.add('is-entering');

    // 3. Mark session flag so navigating between games won't re-trap user
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem('bondfire_gate_entered', 'true');
      } catch (_) {}
    }

    // 4. Smoothly transition to HOME view
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
