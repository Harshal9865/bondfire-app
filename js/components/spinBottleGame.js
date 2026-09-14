// ==============================================================================
// BONDFIRE MULTIPLAYER SPIN THE BOTTLE (js/components/spinBottleGame.js)
// Real physics bottle rotation with deceleration, landing on live room campers.
// Modal with Truth, Dare, and Custom Dare input!
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { getRandomTruth, getRandomDare } from '../data/truthOrDareData.js';

export function renderSpinBottleGame() {
  const state = store.getState();
  const currentPlayMode = state.arcadePlayMode || 'GROUP';
  const room = state.activeRoom || {};
  const currentHostName = (state.currentUser && state.currentUser.displayName) ? `${state.currentUser.displayName.split(' ')[0]} (You)` : 'You (Host)';
  const currentHostAvatar = (state.currentUser && state.currentUser.avatarUrl) ? state.currentUser.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host';

  let players = [];
  if (currentPlayMode === 'DUOS') {
    // 2 players directly facing each other
    players = [
      { id: state.currentUser?.id || 'p1', name: currentHostName, avatar: currentHostAvatar },
      { id: 'p2', name: 'Partner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Partner' }
    ];
  } else if (currentPlayMode === 'SOLO') {
    // Solo Challenge Sectors around the wheel
    players = [
      { id: 'c1', name: 'Deep Truth', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Truth' },
      { id: 'c2', name: 'Wild Dare', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dare' },
      { id: 'c3', name: 'Secret Confession', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Secret' },
      { id: 'c4', name: 'Voice Note', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Voice' },
      { id: 'c5', name: 'Retro Trivia', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Trivia' },
      { id: 'c6', name: 'Rapid Fire', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rapid' }
    ];
  } else {
    // Group mode
    players = (room.players && room.players.length >= 3)
      ? room.players
      : [
          { id: state.currentUser?.id || 'p1', name: currentHostName, avatar: currentHostAvatar },
          { id: 'p2', name: 'Riya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya' },
          { id: 'p3', name: 'Kabir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir' },
          { id: 'p4', name: 'Ananya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya' },
          { id: 'p5', name: 'Arjun', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' }
        ];
  }

  return `
    <div class="flex flex-col items-center justify-between w-full max-w-xl mx-auto px-4 py-6 select-none relative min-h-[85vh]">
      
      <!-- Top Title & Room Info -->
      <div class="w-full flex items-center justify-between mb-3">
        <div>
          <span class="retro-pixel-badge text-[9.5px] text-sunset-coral">Arcade Classics</span>
          <h2 class="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Spin the Bottle</span>
            <span class="material-symbols-outlined text-amber-gold text-[22px]">wine_bar</span>
          </h2>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-bottle-spice" class="px-3 py-1.5 rounded-full bg-surface border border-border hover:border-sunset-coral text-xs font-bold text-amber-gold flex items-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-sunset-coral text-[16px]">local_fire_department</span>
            <span id="spice-level-text" class="retro-pixel-badge text-[10px]">Spicy</span>
          </button>
          <button id="btn-exit-bottle" class="p-2 rounded-full bg-surface border border-border text-gray-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sunset-coral text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Bottle Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-bottle-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-sunset-coral text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (Circle)
          </button>
          <button class="btn-bottle-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (1v1)
          </button>
          <button class="btn-bottle-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo (Dare Wheel)
          </button>
        </div>
      </div>

      <!-- Mode Banner -->
      <div class="w-full mb-3 px-3 py-1.5 rounded-xl text-center text-xs font-mono ${currentPlayMode === 'DUOS' ? 'bg-duo-rose/10 text-duo-rose border border-duo-rose/30' : currentPlayMode === 'SOLO' ? 'bg-mint-green/10 text-mint-green border border-mint-green/30' : 'bg-surface border border-white/5 text-gray-400'}">
        ${currentPlayMode === 'DUOS' ? '👫 1v1 Intimate Face-off: The bottle spins back and forth strictly between You and your Partner.' : currentPlayMode === 'SOLO' ? '👤 Solo Dare Wheel: Spin to test your bravery against 6 spicy self-discovery dares.' : '👥 Squad Circle: Real party physics spinning across everyone in the campfire circle.'}
      </div>

      <!-- The Circle Arena -->
      <div class="relative w-72 h-72 sm:w-96 sm:h-96 my-auto flex items-center justify-center rounded-full border border-border/60 bg-gradient-to-b from-surface/80 to-surface-container/90 shadow-2xl shadow-black/80" id="bottle-arena">
        
        <!-- Center Ambient Glow -->
        <div class="absolute w-32 h-32 bg-sunset-coral/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- The 3D Glass Bottle (CSS/SVG) -->
        <div id="spinning-bottle" class="absolute w-12 sm:w-16 h-48 sm:h-64 cursor-pointer transition-transform duration-75 flex items-center justify-center z-20 group" style="transform: rotate(0deg); transform-origin: center center;">
          <svg viewBox="0 0 60 220" class="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter transition-all group-hover:brightness-125">
            <!-- Bottle Neck & Cap -->
            <rect x="24" y="5" width="12" height="18" rx="3" fill="#FFAE33" />
            <rect x="22" y="23" width="16" height="40" rx="4" fill="#2A6B48" />
            <!-- Bottle Shoulder & Body -->
            <path d="M 22 63 C 10 90, 8 110, 8 135 L 8 205 C 8 215, 15 220, 30 220 C 45 220, 52 215, 52 205 L 52 135 C 52 110, 50 90, 38 63 Z" fill="#1C4B33" stroke="#4DE082" stroke-width="2" />
            <!-- Vintage Label -->
            <rect x="14" y="110" width="32" height="60" rx="3" fill="#E8D5B5" />
            <text x="30" y="132" font-size="8" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#0B0E17" text-anchor="middle">BONDFIRE</text>
            <text x="30" y="145" font-size="6" font-family="monospace" fill="#C85A17" text-anchor="middle">TRUTH/DARE</text>
            <line x1="18" y1="152" x2="42" y2="152" stroke="#0B0E17" stroke-width="0.75" />
            <!-- Glass Highlights -->
            <path d="M 12 135 L 12 205" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" />
            <path d="M 25 30 L 25 55" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>

        <!-- Center Pivot Ring -->
        <div class="absolute w-8 h-8 rounded-full bg-white/10 border border-white/30 backdrop-blur-md pointer-events-none z-10"></div>

        <!-- Camper Avatars Positioned Around the Circle -->
        ${players.map((p, idx) => {
          const total = players.length;
          // In DUOS, position 0 at top (-90 deg), position 1 at bottom (+90 deg)
          const angle = (idx * (360 / total) - 90) * (Math.PI / 180);
          const radius = 135; // px distance from center on mobile
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return `
            <div 
              class="camper-seat absolute flex flex-col items-center justify-center transition-all duration-300 z-10" 
              data-player-index="${idx}"
              data-player-name="${p.name}"
              style="transform: translate(${x}px, ${y}px);"
            >
              <div class="camper-avatar-ring w-12 h-12 rounded-full p-0.5 border-2 ${currentPlayMode === 'DUOS' ? (idx === 0 ? 'border-amber-gold' : 'border-duo-rose') : 'border-border'} bg-surface shadow-lg transition-all">
                <img src="${p.avatar}" class="w-full h-full rounded-full object-cover bg-surface-bright" />
              </div>
              <span class="text-[10px] font-bold text-gray-300 font-mono mt-1 px-1.5 py-0.5 rounded bg-surface/90 border border-border truncate max-w-[80px]">
                ${p.name.split(' ')[0]}
              </span>
            </div>
          `;
        }).join('')}

      </div>

      <!-- Spin Controls & Instructions -->
      <div class="w-full max-w-sm flex flex-col items-center gap-3 mt-6">
        <p class="text-xs text-gray-400 font-mono text-center" id="bottle-status-text">
          ${currentPlayMode === 'DUOS' ? 'Tap spin to see who between You and Partner takes the challenge!' : currentPlayMode === 'SOLO' ? 'Tap spin to pick your daily solo truth or dare category!' : 'Tap the bottle or click below to give it a spin!'}
        </p>

        <button id="btn-spin-now" class="w-full py-4 rounded-full bg-gradient-to-r from-sunset-coral via-amber-gold to-sunset-coral text-canvas font-display text-base font-extrabold shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
          <span class="material-symbols-outlined text-[24px]">cyclone</span>
          <span>SPIN THE BOTTLE!</span>
        </button>
      </div>

      <!-- Truth or Dare Challenge Modal -->
      <div id="challenge-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl p-6 relative flex flex-col gap-4 animate-scaleUp">
          
          <!-- Victim Header -->
          <div class="text-center pb-3 border-b border-border/80">
            <span class="px-2.5 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral text-[10px] font-mono font-bold uppercase tracking-wider">The Bottle Has Chosen</span>
            <h3 class="font-display text-2xl font-bold text-white mt-1" id="victim-name">Player</h3>
            <p class="text-xs text-gray-400 mt-0.5">Pick your poison: Answer honestly or face the squad's dare</p>
          </div>

          <!-- Truth vs Dare Choice Buttons -->
          <div class="grid grid-cols-2 gap-3" id="choice-buttons-grid">
            <button id="btn-choose-truth" class="py-4 rounded-2xl bg-amber-gold/15 hover:bg-amber-gold/25 border border-amber-gold/40 text-amber-gold font-bold text-sm transition-all active:scale-95 flex flex-col items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[26px]">visibility_off</span>
              <span class="retro-pixel-badge text-[12px]">TRUTH</span>
            </button>

            <button id="btn-choose-dare" class="py-4 rounded-2xl bg-sunset-coral/15 hover:bg-sunset-coral/25 border border-sunset-coral/40 text-sunset-coral font-bold text-sm transition-all active:scale-95 flex flex-col items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[26px]">local_fire_department</span>
              <span class="retro-pixel-badge text-[12px]">DARE</span>
            </button>
          </div>

          <!-- Prompt Card Box (Revealed upon choice) -->
          <div id="challenge-prompt-box" class="p-4 rounded-2xl bg-[#0B141A] border border-border/80 hidden flex-col gap-2.5">
            <div class="flex items-center justify-between">
              <span id="prompt-badge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-white">Truth</span>
              <button id="btn-reroll-prompt" class="text-xs text-amber-gold hover:underline font-mono flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">refresh</span>
                <span>Reroll</span>
              </button>
            </div>
            <p id="prompt-text" class="text-sm sm:text-base text-white font-medium leading-relaxed font-mono">
              "What is the most embarrassing thing currently in your browser history?"
            </p>

            <!-- In-Game 30-Second Challenge Shot Clock -->
            <div class="mt-2 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-amber-gold animate-pulse">timer</span>
                  <span class="text-xs font-mono font-bold text-gray-300">Challenge Shot Clock:</span>
                  <span id="bottle-shot-clock-text" class="text-xs font-mono font-black text-amber-gold bg-amber-gold/15 px-2 py-0.5 rounded-full border border-amber-gold/30">30s</span>
                </div>
                <span id="bottle-timer-status" class="text-[10.5px] font-mono text-gray-400">Answer or face dare!</span>
              </div>
              <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div id="bottle-timer-bar" class="h-full bg-gradient-to-r from-sunset-coral via-amber-gold to-mint-green rounded-full transition-all duration-1000 ease-linear" style="width: 100%;"></div>
              </div>
            </div>
          </div>

          <!-- Or Type a Custom Dare Section -->
          <div class="pt-2 border-t border-border/60 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono text-gray-400 uppercase font-bold">Have a better idea?</span>
              <button id="toggle-custom-dare" class="text-[11px] text-sunset-coral hover:underline font-bold">
                + Type Custom Dare
              </button>
            </div>

            <div id="custom-dare-container" class="hidden flex gap-2">
              <input type="text" id="custom-dare-input" placeholder="e.g. Call your mom and say you're getting married" class="flex-1 bg-surface-bright border border-border rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-sunset-coral" />
              <button id="btn-send-custom-dare" class="px-4 py-2 rounded-xl bg-sunset-coral text-white font-bold text-xs shrink-0">
                Send
              </button>
            </div>
          </div>

          <!-- Done / Pass Buttons -->
          <div class="flex gap-2 pt-2">
            <button id="btn-close-challenge" class="flex-1 py-3 rounded-full bg-surface-bright border border-border text-gray-300 font-bold text-xs hover:text-white transition-colors flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">flag</span>
              <span>Pass / Chicken Out</span>
            </button>
            <button id="btn-done-challenge" class="flex-[2] py-3 rounded-full bg-mint-green text-canvas font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">task_alt</span>
              <span class="retro-pixel-badge text-[10px]">Completed! Next Spin</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `;
}

export function bindSpinBottleEvents() {
  const bottle = document.getElementById('spinning-bottle');
  const spinBtn = document.getElementById('btn-spin-now');
  const modal = document.getElementById('challenge-modal');
  const victimNameEl = document.getElementById('victim-name');
  const btnTruth = document.getElementById('btn-choose-truth');
  const btnDare = document.getElementById('btn-choose-dare');
  const promptBox = document.getElementById('challenge-prompt-box');
  const promptBadge = document.getElementById('prompt-badge');
  const promptText = document.getElementById('prompt-text');
  const btnReroll = document.getElementById('btn-reroll-prompt');
  const btnDone = document.getElementById('btn-done-challenge');
  const btnClose = document.getElementById('btn-close-challenge');
  const btnExit = document.getElementById('btn-exit-bottle');
  const toggleCustom = document.getElementById('toggle-custom-dare');
  const customContainer = document.getElementById('custom-dare-container');
  const customInput = document.getElementById('custom-dare-input');
  const btnSendCustom = document.getElementById('btn-send-custom-dare');
  const btnSpice = document.getElementById('btn-bottle-spice');
  const spiceText = document.getElementById('spice-level-text');

  let currentRotation = 0;
  let isSpinning = false;
  let currentSpice = 'SPICY'; // 'MILD' | 'SPICY' | 'SAVAGE'
  let lastType = 'TRUTH';

  const spices = ['MILD', 'SPICY', 'SAVAGE'];
  if (btnSpice) {
    btnSpice.addEventListener('click', () => {
      audio.playClick();
      const nextIdx = (spices.indexOf(currentSpice) + 1) % spices.length;
      currentSpice = spices[nextIdx];
      if (spiceText) spiceText.textContent = currentSpice;
    });
  }

  const seats = document.querySelectorAll('.camper-seat');
  const playerCount = seats.length || 5;

  function doSpin() {
    if (isSpinning) return;
    isSpinning = true;
    audio.playChime();

    // Random rotations: between 5 and 10 full spins + random target angle
    const targetCamperIndex = Math.floor(Math.random() * playerCount);
    const camperAngle = targetCamperIndex * (360 / playerCount);
    const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360;
    const finalAngle = currentRotation + extraSpins + (camperAngle - (currentRotation % 360));
    currentRotation = finalAngle;

    if (bottle) {
      bottle.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)';
      bottle.style.transform = `rotate(${finalAngle}deg)`;
    }

    // Tick audio effect during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      audio.playBip();
      tickCount++;
      if (tickCount > 12) clearInterval(tickInterval);
    }, 250);

    setTimeout(() => {
      isSpinning = false;
      audio.playChime();

      // Highlight winning seat
      seats.forEach((s) => {
        const ring = s.querySelector('.camper-avatar-ring');
        if (ring) ring.className = 'camper-avatar-ring w-12 h-12 rounded-full p-0.5 border-2 border-border bg-surface shadow-lg transition-all';
      });

      const winningSeat = document.querySelector(`.camper-seat[data-player-index="${targetCamperIndex}"]`);
      if (winningSeat) {
        const ring = winningSeat.querySelector('.camper-avatar-ring');
        if (ring) {
          ring.className = 'camper-avatar-ring w-14 h-14 rounded-full p-0.5 border-2 border-sunset-coral bg-surface shadow-glow-coral scale-110 transition-all';
        }
        const name = winningSeat.getAttribute('data-player-name') || 'Camper';
        if (victimNameEl) victimNameEl.textContent = name;
      }

      // Show challenge modal
      if (modal) {
        modal.classList.remove('hidden');
        if (promptBox) promptBox.classList.add('hidden');
      }
    }, 3600);
  }

  if (spinBtn) spinBtn.addEventListener('click', doSpin);
  if (bottle) bottle.addEventListener('click', doSpin);

  let challengeTimerId = null;
  let challengeSecondsLeft = 30;

  function stopChallengeTimer() {
    if (challengeTimerId) {
      clearInterval(challengeTimerId);
      challengeTimerId = null;
    }
  }

  function startChallengeTimer() {
    stopChallengeTimer();
    challengeSecondsLeft = 30;
    const timerText = document.getElementById('bottle-shot-clock-text');
    const timerBar = document.getElementById('bottle-timer-bar');
    const timerStatus = document.getElementById('bottle-timer-status');
    if (timerText) {
      timerText.textContent = '30s';
      timerText.className = 'text-xs font-mono font-black text-amber-gold bg-amber-gold/15 px-2 py-0.5 rounded-full border border-amber-gold/30';
    }
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.className = 'h-full bg-gradient-to-r from-sunset-coral via-amber-gold to-mint-green rounded-full transition-all duration-1000 ease-linear';
    }
    if (timerStatus) {
      timerStatus.textContent = 'Answer or face dare!';
      timerStatus.className = 'text-[10.5px] font-mono text-gray-400';
    }

    challengeTimerId = setInterval(() => {
      challengeSecondsLeft--;
      if (challengeSecondsLeft < 0) challengeSecondsLeft = 0;

      if (timerText) timerText.textContent = `${challengeSecondsLeft}s`;
      if (timerBar) {
        const pct = Math.max(0, (challengeSecondsLeft / 30) * 100);
        timerBar.style.width = `${pct}%`;
        if (challengeSecondsLeft <= 5) {
          timerBar.className = 'h-full bg-red-500 rounded-full transition-all duration-1000 ease-linear animate-pulse';
        }
      }

      if (challengeSecondsLeft <= 5 && challengeSecondsLeft > 0) {
        audio.playTick();
        if (timerText) timerText.className = 'text-xs font-mono font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/40 animate-bounce';
      }

      if (challengeSecondsLeft <= 0) {
        stopChallengeTimer();
        audio.playWrong();
        if (timerText) timerText.textContent = "TIME'S UP!";
        if (timerStatus) {
          timerStatus.textContent = "Time expired! Squad votes penalty!";
          timerStatus.className = 'text-[10.5px] font-mono font-bold text-red-400';
        }
      }
    }, 1000);
  }

  // Truth Pick
  if (btnTruth) {
    btnTruth.addEventListener('click', () => {
      audio.playClick();
      lastType = 'TRUTH';
      if (promptBadge) {
        promptBadge.textContent = 'TRUTH';
        promptBadge.className = 'px-2.5 py-0.5 rounded retro-pixel-badge text-[9.5px] bg-amber-gold/20 text-amber-gold border border-amber-gold/30';
      }
      if (promptText) promptText.textContent = `"${getRandomTruth(currentSpice)}"`;
      if (promptBox) promptBox.classList.remove('hidden');
      startChallengeTimer();
    });
  }

  // Dare Pick
  if (btnDare) {
    btnDare.addEventListener('click', () => {
      audio.playClick();
      lastType = 'DARE';
      if (promptBadge) {
        promptBadge.textContent = 'DARE';
        promptBadge.className = 'px-2.5 py-0.5 rounded retro-pixel-badge text-[9.5px] bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30';
      }
      if (promptText) promptText.textContent = `"${getRandomDare(currentSpice === 'SAVAGE' ? 'CHAOS' : currentSpice)}"`;
      if (promptBox) promptBox.classList.remove('hidden');
      startChallengeTimer();
    });
  }

  // Reroll
  if (btnReroll) {
    btnReroll.addEventListener('click', () => {
      audio.playBip();
      if (lastType === 'TRUTH') {
        promptText.textContent = `"${getRandomTruth(currentSpice)}"`;
      } else {
        promptText.textContent = `"${getRandomDare(currentSpice === 'SAVAGE' ? 'CHAOS' : currentSpice)}"`;
      }
      startChallengeTimer();
    });
  }

  // Toggle Custom Dare Input
  if (toggleCustom && customContainer) {
    toggleCustom.addEventListener('click', () => {
      customContainer.classList.toggle('hidden');
      if (customInput) customInput.focus();
    });
  }

  // Send Custom Dare
  if (btnSendCustom && customInput) {
    btnSendCustom.addEventListener('click', () => {
      const val = customInput.value.trim();
      if (!val) return;
      audio.playChime();
      lastType = 'DARE';
      if (promptBadge) {
        promptBadge.textContent = 'CUSTOM SQUAD DARE';
        promptBadge.className = 'retro-pixel-badge px-2 py-0.5 rounded text-[8px] bg-sunset-coral/30 text-sunset-coral';
      }
      if (promptText) promptText.textContent = `"${val}"`;
      if (promptBox) promptBox.classList.remove('hidden');
      customInput.value = '';
      customContainer.classList.add('hidden');
      startChallengeTimer();
    });
  }

  // Done or Close
  if (btnDone && modal) {
    btnDone.addEventListener('click', () => {
      stopChallengeTimer();
      audio.playChime();
      modal.classList.add('hidden');
    });
  }
  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      stopChallengeTimer();
      audio.playClick();
      modal.classList.add('hidden');
    });
  }

  // In-Game Play Mode Switcher
  document.querySelectorAll('.btn-bottle-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== store.getState().arcadePlayMode) {
        stopChallengeTimer();
        audio.playClick();
        store.setArcadePlayMode(mode);
        reRender();
      }
    });
  });

  // Exit back to Arcade or Lobby
  if (btnExit) {
    btnExit.addEventListener('click', () => {
      stopChallengeTimer();
      audio.playClick();
      store.setView('ARCADE');
    });
  }

  function reRender() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'SPIN_BOTTLE') {
      mount.innerHTML = renderSpinBottleGame();
      bindSpinBottleEvents();
    }
  }
}
