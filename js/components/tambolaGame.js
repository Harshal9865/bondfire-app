// ==============================================================================
// DESI TAMBOLA / INDIAN HOUSIE (तंबोला - The Iconic Desi Party Game)
// 100% Authentic Indian chit & number party game for squads and party rooms.
// Features:
// 1. 1–90 Token Caller Machine with authentic Hindi & English rhyming calls
// 2. Interactive 3x9 Tambola Ticket generator with tap-to-stamp daubers
// 3. Real-time winning claims: Jaldi 5 (Early 5), Corners, Top/Mid/Bottom Lines, Full House
// 4. Live board tracking grid (1-90) & royal fanfare celebrations!
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

// Authentic Tambola Rhymes & Nicknames
const TAMBOLA_NICKNAMES = {
  1: "Kelly's Eye · Ek Number!",
  2: "Kaala Kauwa · Two Little Ducks",
  3: "Goodness Me · Teen Tigada",
  4: "Knock at the Door · Char Yaar",
  5: "Fingers in a Hand · Panch Pandav",
  6: "In a Fix · Chhakka",
  7: "Lucky Seven · Saat Sur",
  8: "One Fat Lady · Aath Aath",
  9: "Doctor's Orders · Navaratna",
  10: "A Bad Egg · Das Ka Dum",
  11: "Two Beautiful Legs · Ek Aur Ek Gyarah",
  12: "One Dozen · Barah Singha",
  13: "Unlucky for Some · Tera Mera Pyar",
  14: "Valentine Day · Chhoti Diwali",
  15: "Yet to be Done · Independence Day",
  16: "Sweet Sixteen · Sone Pe Suhaga",
  17: "Dancing Queen · Khatra",
  18: "Voting Age · Baap Re Baap",
  20: "Blind Twenty · Bees Saal Baad",
  21: "Royal Salute · Ekkees Topon Ki Salami",
  22: "Two Little Ducks · Joda No. 2",
  25: "Silver Jubilee · Silver Dhamaka",
  30: "Flirty Thirty · Tees Maar Khan",
  40: "Life Begins at 40 · Chalis Chor",
  50: "Golden Half Century · Pachaas Pura",
  60: "Five Dozen · Saath Saal",
  69: "Ulta Pulta · Any Way Up",
  75: "Diamond Jubilee · Heera Panna",
  77: "Double Lucky · Sunset Strip",
  88: "Two Fat Ladies · Moti Jodi",
  90: "Top of the House · Aakhri Number!"
};

function getNickname(num) {
  if (TAMBOLA_NICKNAMES[num]) return TAMBOLA_NICKNAMES[num];
  if (num < 10) return `Single Digit Number ${num}`;
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return `${tens} and ${ones} · Number ${num}`;
}

// Generate authentic 3x9 Tambola Ticket (15 numbers, 5 per row)
function generateTambolaTicket() {
  const ticket = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null]
  ];

  // Column ranges: Col 0 (1-9), Col 1 (10-19), ..., Col 8 (80-90)
  const colRanges = [
    [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];

  // Each row has 5 random columns filled
  for (let r = 0; r < 3; r++) {
    const colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 5).sort((a, b) => a - b);
    colIndices.forEach((c) => {
      const [min, max] = colRanges[c];
      let val;
      do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (
        ticket[0][c]?.num === val ||
        ticket[1][c]?.num === val ||
        ticket[2][c]?.num === val
      );
      ticket[r][c] = { num: val, marked: false };
    });
  }

  // Sort columns vertically for authentic ticket readability
  for (let c = 0; c < 9; c++) {
    const vals = [];
    for (let r = 0; r < 3; r++) {
      if (ticket[r][c]) vals.push(ticket[r][c].num);
    }
    vals.sort((a, b) => a - b);
    let vIdx = 0;
    for (let r = 0; r < 3; r++) {
      if (ticket[r][c]) {
        ticket[r][c].num = vals[vIdx++];
      }
    }
  }

  return ticket;
}

// State
let gameState = {
  playMode: 'GROUP', // 'GROUP' | 'DUOS' | 'SOLO'
  activeDuoTicket: 'P1', // 'P1' | 'P2' for duos mode
  ticketP2: null,
  calledNumbers: [],
  currentNumber: null,
  isAutoCalling: false,
  autoCallInterval: null,
  ticket: null,
  claims: {
    JALDI_5: { name: 'Jaldi 5 (Early Five)', claimedBy: null, points: 200 },
    CORNERS: { name: 'Four Corners', claimedBy: null, points: 250 },
    TOP_LINE: { name: 'Top Line', claimedBy: null, points: 300 },
    MID_LINE: { name: 'Middle Line', claimedBy: null, points: 300 },
    BOT_LINE: { name: 'Bottom Line', claimedBy: null, points: 300 },
    FULL_HOUSE: { name: 'Full House (Bogey!)', claimedBy: null, points: 1000 }
  }
};

function initTambolaGame() {
  if (gameState.autoCallInterval) {
    clearInterval(gameState.autoCallInterval);
    gameState.autoCallInterval = null;
  }
  const currentMode = gameState.playMode || store.getState().arcadePlayMode || 'GROUP';
  gameState.playMode = currentMode;
  gameState.calledNumbers = [];
  gameState.currentNumber = null;
  gameState.isAutoCalling = false;
  gameState.ticket = generateTambolaTicket();
  gameState.ticketP2 = generateTambolaTicket();
  gameState.activeDuoTicket = 'P1';
  Object.keys(gameState.claims).forEach(k => {
    gameState.claims[k].claimedBy = null;
  });
}

export function renderTambolaGame() {
  const storeMode = store.getState().arcadePlayMode || 'GROUP';
  if (!gameState.ticket || gameState.playMode !== storeMode) {
    gameState.playMode = storeMode;
    initTambolaGame();
  }

  const currentPlayMode = gameState.playMode || 'GROUP';
  const currentNum = gameState.currentNumber;
  const nickname = currentNum ? getNickname(currentNum) : 'Waiting to draw first lucky coin...';
  const totalCalled = gameState.calledNumbers.length;
  const remaining = 90 - totalCalled;

  return `
    <div class="min-h-screen bg-[#090C15] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[1280px] mx-auto select-none" id="tambola-root">
      
      <!-- Top Header -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#262B40]/70 flex-wrap gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06D6A0]/15 border border-[#06D6A0]/30 text-[#06D6A0] text-xs font-mono font-bold uppercase mb-2">
            <span class="material-symbols-outlined text-[16px]">casino</span>
            <span>DESI ARCADIA SPOTLIGHT // तंबोला · HOUSIE</span>
          </div>
          <h1 class="font-display text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Desi Tambola Housie</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-mono">
              ${totalCalled}/90 Drawn
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-tambola-new-ticket" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-400 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">confirmation_number</span>
            <span>New Ticket</span>
          </button>

          <a href="#/ARCADE" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Arcade Hub</span>
          </a>
        </div>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#06D6A0] text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Housie Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-tambola-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-[#06D6A0] text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (Party Room)
          </button>
          <button class="btn-tambola-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (1v1 Ticket Clash)
          </button>
          <button class="btn-tambola-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo (Speed Caller)
          </button>
        </div>
      </div>

      ${currentPlayMode === 'SOLO' ? `
        <div class="p-3 rounded-2xl bg-[#0E1524] border border-[#06D6A0]/30 flex items-center justify-between gap-3 text-xs font-mono mb-4">
          <div class="flex items-center gap-2 text-amber-gold font-bold">
            <span class="material-symbols-outlined text-base">timer</span>
            <span>Speed Goal: Claim Jaldi 5 in under 25 calls!</span>
          </div>
          <div class="text-gray-300">Drawn So Far: <strong class="text-white font-bold">${totalCalled}</strong> / 90</div>
        </div>
      ` : currentPlayMode === 'DUOS' ? `
        <div class="p-3 rounded-2xl bg-[#1A1224] border border-duo-rose/30 flex items-center justify-between gap-3 text-xs font-mono mb-4">
          <div class="flex items-center gap-2 text-duo-rose font-bold">
            <span class="material-symbols-outlined text-base">people</span>
            <span>1v1 Ticket Clash: First camper to hit Jaldi 5 wins the duel!</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button class="btn-duo-switch btn-switch-ticket px-2.5 py-1 rounded-lg text-xs font-bold ${gameState.activeDuoTicket === 'P1' ? 'bg-sunset-coral text-white' : 'bg-surface-bright text-gray-300'}" data-ticket="P1">Ticket 1 (You)</button>
            <button class="btn-duo-switch btn-switch-ticket px-2.5 py-1 rounded-lg text-xs font-bold ${gameState.activeDuoTicket === 'P2' ? 'bg-duo-rose text-white' : 'bg-surface-bright text-gray-300'}" data-ticket="P2">Ticket 2 (Partner)</button>
          </div>
        </div>
      ` : ''}

      <!-- MAIN STAGE -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Caller Stage & Interactive Ticket -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Caller Machine Spotlight Banner -->
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121A28] via-[#152336] to-[#121A28] border-2 border-[#06D6A0]/40 shadow-2xl relative overflow-hidden text-center">
            <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-[#06D6A0]/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="text-[11px] font-mono tracking-widest text-[#06D6A0] uppercase font-bold mb-3 flex items-center justify-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#06D6A0] animate-ping"></span>
              <span>LUCKY TOKEN CALLER // DRAWN ${totalCalled} OF 90</span>
            </div>

            <!-- Giant Number Sphere -->
            <div class="my-4 flex flex-col items-center justify-center">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#06D6A0] via-[#38BDF8] to-amber-gold p-1 shadow-[0_0_40px_rgba(6,214,160,0.45)] animate-pulse flex items-center justify-center">
                <div class="w-full h-full rounded-full bg-[#0B0E17] flex flex-col items-center justify-center text-white">
                  <span class="font-display font-black text-4xl sm:text-5xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                    ${currentNum || '--'}
                  </span>
                  <span class="text-[9px] font-mono text-[#06D6A0] uppercase font-bold tracking-wider mt-0.5">
                    ${currentNum ? 'LUCKY COIN' : 'READY'}
                  </span>
                </div>
              </div>

              <!-- Rhyme Nickname Banner -->
              <div class="mt-4 px-4 py-2 rounded-xl bg-black/40 border border-white/10 max-w-md">
                <p class="text-sm sm:text-base font-display font-bold text-amber-gold italic">
                  "${nickname}"
                </p>
              </div>
            </div>

            <!-- Caller Action Controls -->
            <div class="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <button id="btn-draw-number" class="px-7 py-3 rounded-full bg-gradient-to-r from-[#06D6A0] to-amber-gold text-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-[#06D6A0]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 ${remaining === 0 ? 'opacity-50 pointer-events-none' : ''}">
                <span class="material-symbols-outlined text-[18px]">casino</span>
                <span>Draw Next Token</span>
              </button>

              <button id="btn-toggle-auto" class="px-5 py-3 rounded-full bg-[#1A2338] hover:bg-[#25324F] border border-[#06D6A0]/40 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">${gameState.isAutoCalling ? 'pause' : 'play_arrow'}</span>
                <span>${gameState.isAutoCalling ? 'Pause Auto (4s)' : 'Auto Call'}</span>
              </button>
            </div>
          </div>

          <!-- YOUR INTERACTIVE 3x9 TAMBOLA TICKET -->
          <div class="p-5 sm:p-7 rounded-3xl bg-[#121522] border-2 border-amber-gold/40 shadow-2xl relative">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-gold text-xl">confirmation_number</span>
                <h3 class="font-display text-lg font-bold text-white">Your Official Tambola Ticket</h3>
              </div>
              <span class="text-[10px] font-mono text-gray-400">
                Tap numbers to mark · 15 Total
              </span>
            </div>

            <!-- 3x9 Ticket Grid -->
            <div class="grid grid-rows-3 gap-2 bg-[#0A0D18] p-2.5 sm:p-3.5 rounded-2xl border border-white/10 overflow-x-auto">
              ${((currentPlayMode === 'DUOS' && gameState.activeDuoTicket === 'P2') ? gameState.ticketP2 : gameState.ticket).map((row, rIdx) => `
                <div class="grid grid-cols-9 gap-1.5 sm:gap-2">
                  ${row.map((cell, cIdx) => {
                    if (!cell) {
                      return `<div class="h-12 sm:h-14 rounded-xl bg-[#121626]/50 border border-white/5"></div>`;
                    }
                    const isCalled = gameState.calledNumbers.includes(cell.num);
                    const isMarked = cell.marked;

                    return `
                      <button class="btn-ticket-cell h-12 sm:h-14 rounded-xl font-display font-black text-sm sm:text-base transition-all flex flex-col items-center justify-center relative cursor-pointer active:scale-95 ${
                        isMarked
                          ? 'bg-gradient-to-br from-[#06D6A0] to-emerald-600 text-dark shadow-[0_0_15px_rgba(6,214,160,0.5)] border-2 border-white'
                          : isCalled
                          ? 'bg-amber-gold/20 text-amber-gold border-2 border-amber-gold/70 animate-pulse hover:bg-amber-gold/30'
                          : 'bg-[#181D30] text-gray-200 border border-white/10 hover:border-gray-500'
                      }" data-row="${rIdx}" data-col="${cIdx}" data-num="${cell.num}">
                        <span>${cell.num}</span>
                        ${isMarked ? `<span class="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1"></span>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>

            <!-- Quick Ticket Status -->
            <div class="mt-4 flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>Marked: <strong class="text-[#06D6A0] font-bold">${getMarkedCount()}</strong> / 15 Numbers</span>
              <span class="text-amber-gold">Tap to daub with chip ink</span>
            </div>
          </div>

          <!-- CLAIMS BAR (JALDI 5, CORNERS, LINES, FULL HOUSE) -->
          <div class="p-5 rounded-3xl bg-[#121522] border border-[#2B3147]">
            <div class="text-xs font-mono font-bold text-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-amber-gold">verified</span>
              <span>Claim Prize When Ready (Verified Against Caller)</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              ${Object.entries(gameState.claims).map(([key, claim]) => {
                const isClaimed = !!claim.claimedBy;

                return `
                  <button class="btn-claim-prize p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer active:scale-95 ${
                    isClaimed
                      ? 'bg-white/5 border-white/10 opacity-60 pointer-events-none'
                      : 'bg-surface hover:bg-surface-bright border-border hover:border-[#06D6A0]'
                  }" data-claim="${key}">
                    <div class="flex items-center justify-between text-xs font-bold ${isClaimed ? 'text-gray-400 line-through' : 'text-white'}">
                      <span>${claim.name}</span>
                      <span class="material-symbols-outlined text-[14px] text-[#06D6A0]">${isClaimed ? 'check_circle' : 'bolt'}</span>
                    </div>
                    <div class="text-[10px] font-mono text-amber-gold font-bold">
                      ${isClaimed ? `Claimed by ${claim.claimedBy}` : `+${claim.points} Points`}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Right Col: 1-90 Master Board Grid -->
        <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#06D6A0] text-xl">grid_on</span>
                <h3 class="font-display text-base font-bold text-white">Master Board (1–90)</h3>
              </div>
              <span class="text-[10px] font-mono text-gray-400">${totalCalled} Called</span>
            </div>

            <!-- 10x9 Full Board Matrix -->
            <div class="grid grid-cols-10 gap-1 sm:gap-1.5 max-h-[460px] overflow-y-auto pr-1">
              ${Array.from({ length: 90 }, (_, i) => i + 1).map((n) => {
                const isCalled = gameState.calledNumbers.includes(n);
                const isCurrent = gameState.currentNumber === n;

                return `
                  <div class="w-full aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-gold text-dark font-black shadow-[0_0_12px_rgba(255,183,3,0.8)] scale-110 z-10'
                      : isCalled
                      ? 'bg-[#06D6A0]/25 text-[#06D6A0] border border-[#06D6A0]/50'
                      : 'bg-[#181C2B] text-gray-500'
                  }">
                    ${n}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Desi Tambola Rules Summary -->
          <div class="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-gray-400 space-y-1">
            <div class="text-[#06D6A0] font-bold uppercase">Quick Rules:</div>
            <div>• Jaldi 5: First camper to strike any 5 numbers.</div>
            <div>• Corners: 4 outer corner numbers on your ticket.</div>
            <div>• Full House: All 15 numbers struck out!</div>
          </div>
        <!-- Tambola Toast Notification -->
        <div id="tambola-toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-surface-bright border border-amber-gold/50 shadow-2xl text-xs font-bold text-white flex items-center gap-2 opacity-0 pointer-events-none transition-all duration-300">
          <span id="tambola-toast-icon" class="material-symbols-outlined text-amber-gold text-[18px]">celebration</span>
          <span id="tambola-toast-msg">Claim Approved!</span>
        </div>

      </div>

    </div>
  `;
}

function getMarkedCount() {
  if (!gameState.ticket) return 0;
  let cnt = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      if (gameState.ticket[r][c]?.marked) cnt++;
    }
  }
  return cnt;
}

export function bindTambolaEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Draw Next Number
  const drawBtn = document.getElementById('btn-draw-number');
  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      audio.playClick();
      drawNextNumber();
    });
  }

  // Toggle Auto Call
  const autoBtn = document.getElementById('btn-toggle-auto');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      audio.playClick();
      if (gameState.isAutoCalling) {
        clearInterval(gameState.autoCallInterval);
        gameState.autoCallInterval = null;
        gameState.isAutoCalling = false;
      } else {
        gameState.isAutoCalling = true;
        drawNextNumber();
        gameState.autoCallInterval = setInterval(() => {
          if (gameState.calledNumbers.length >= 90) {
            clearInterval(gameState.autoCallInterval);
            gameState.isAutoCalling = false;
            reRender();
          } else {
            drawNextNumber();
          }
        }, 4000);
      }
      reRender();
    });
  }

  // Mode Switcher
  document.querySelectorAll('.btn-tambola-mode').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== gameState.playMode) {
        audio.playClick();
        gameState.playMode = mode;
        store.setArcadePlayMode(mode);
        initTambolaGame();
        reRender();
      }
    });
  });

  // Duos Ticket Switch
  document.querySelectorAll('.btn-duo-switch').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const t = btn.getAttribute('data-ticket');
      if (t && t !== gameState.activeDuoTicket) {
        audio.playClick();
        gameState.activeDuoTicket = t;
        reRender();
      }
    });
  });

  // New Ticket
  const newTicketBtn = document.getElementById('btn-tambola-new-ticket');
  if (newTicketBtn) {
    newTicketBtn.addEventListener('click', () => {
      audio.playClick();
      if (gameState.playMode === 'DUOS' && gameState.activeDuoTicket === 'P2') {
        gameState.ticketP2 = generateTambolaTicket();
      } else {
        gameState.ticket = generateTambolaTicket();
      }
      reRender();
    });
  }

  // Reset Game
  const resetBtn = document.getElementById('btn-tambola-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      audio.playClick();
      initTambolaGame();
      reRender();
    });
  }

  // Ticket Cell Dauber Tap
  const ticketCells = document.querySelectorAll('.btn-ticket-cell');
  ticketCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const curTicket = (gameState.playMode === 'DUOS' && gameState.activeDuoTicket === 'P2') ? gameState.ticketP2 : gameState.ticket;
      const cellData = curTicket && curTicket[r] ? curTicket[r][c] : null;
      if (cellData) {
        cellData.marked = !cellData.marked;
        audio.playCameraSnap();
        reRender();
      }
    });
  });

  // Claim Prize Buttons
  const claimBtns = document.querySelectorAll('.btn-claim-prize');
  claimBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const claimKey = btn.dataset.claim;
      verifyAndAwardClaim(claimKey);
    });
  });

  function drawNextNumber() {
    if (gameState.calledNumbers.length >= 90) return;
    const available = [];
    for (let i = 1; i <= 90; i++) {
      if (!gameState.calledNumbers.includes(i)) available.push(i);
    }
    if (available.length === 0) return;

    const next = available[Math.floor(Math.random() * available.length)];
    gameState.calledNumbers.push(next);
    gameState.currentNumber = next;
    audio.playLedTick();
    reRender();
  }

  function verifyAndAwardClaim(claimKey) {
    const claim = gameState.claims[claimKey];
    if (!claim || claim.claimedBy) return;

    const ticket = (gameState.playMode === 'DUOS' && gameState.activeDuoTicket === 'P2') ? gameState.ticketP2 : gameState.ticket;
    const called = new Set(gameState.calledNumbers);
    let isValid = false;

    // Helper: is a marked cell actually called?
    const isCellValid = (r, c) => ticket[r][c] && ticket[r][c].marked && called.has(ticket[r][c].num);

    if (claimKey === 'JALDI_5') {
      let validCount = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 9; c++) {
          if (isCellValid(r, c)) validCount++;
        }
      }
      isValid = validCount >= 5;
    } else if (claimKey === 'TOP_LINE') {
      let lineCount = 0;
      for (let c = 0; c < 9; c++) {
        if (ticket[0][c]) {
          if (isCellValid(0, c)) lineCount++;
        }
      }
      isValid = lineCount === 5;
    } else if (claimKey === 'MID_LINE') {
      let lineCount = 0;
      for (let c = 0; c < 9; c++) {
        if (ticket[1][c]) {
          if (isCellValid(1, c)) lineCount++;
        }
      }
      isValid = lineCount === 5;
    } else if (claimKey === 'BOT_LINE') {
      let lineCount = 0;
      for (let c = 0; c < 9; c++) {
        if (ticket[2][c]) {
          if (isCellValid(2, c)) lineCount++;
        }
      }
      isValid = lineCount === 5;
    } else if (claimKey === 'CORNERS') {
      // Find 4 outer corner numbers
      const firstRowNums = ticket[0].filter(Boolean);
      const lastRowNums = ticket[2].filter(Boolean);
      if (firstRowNums.length >= 2 && lastRowNums.length >= 2) {
        const c1 = firstRowNums[0];
        const c2 = firstRowNums[firstRowNums.length - 1];
        const c3 = lastRowNums[0];
        const c4 = lastRowNums[lastRowNums.length - 1];
        isValid = (c1.marked && called.has(c1.num)) &&
                  (c2.marked && called.has(c2.num)) &&
                  (c3.marked && called.has(c3.num)) &&
                  (c4.marked && called.has(c4.num));
      }
    } else if (claimKey === 'FULL_HOUSE') {
      let markedValid = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 9; c++) {
          if (ticket[r][c] && isCellValid(r, c)) markedValid++;
        }
      }
      isValid = markedValid === 15;
    }

    if (isValid) {
      const state = store.getState();
      const userName = state.currentUser?.displayName?.split(' ')[0] || 'You';
      claim.claimedBy = userName;
      audio.playRoyalFanfare();
      confettiInstance.burst(60, 1);
      showTambolaToast(`Claim Approved for ${claim.name}! +${claim.points} Points awarded!`, true);
    } else {
      audio.playWrongBuzzer();
      showTambolaToast(`Bogus Claim! All marked numbers for ${claim.name} must be called on the board!`, false);
    }
    reRender();
  }

  function showTambolaToast(msg, isSuccess) {
    const toast = document.getElementById('tambola-toast');
    const toastMsg = document.getElementById('tambola-toast-msg');
    const toastIcon = document.getElementById('tambola-toast-icon');
    if (toast && toastMsg && toastIcon) {
      toastMsg.textContent = msg;
      toastIcon.textContent = isSuccess ? 'celebration' : 'warning';
      toastIcon.className = `material-symbols-outlined text-[18px] ${isSuccess ? 'text-amber-gold' : 'text-sunset-coral'}`;
      toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-surface-bright border ${isSuccess ? 'border-amber-gold/60 text-white' : 'border-sunset-coral/60 text-sunset-coral'} shadow-2xl text-xs font-bold flex items-center gap-2 transition-all duration-300 opacity-100`;
      setTimeout(() => {
        toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-surface-bright border shadow-2xl text-xs font-bold flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none';
      }, 3200);
    }
  }

  function reRender() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'TAMBOLA') {
      mount.innerHTML = renderTambolaGame();
      bindTambolaEvents();
    }
  }
}
