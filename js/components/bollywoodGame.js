// ==============================================================================
// BOLLYWOOD ANTAKSHARI & FILMI MASALA (Screen / Game Component)
// Authentic Indian party favorite:
// 1. Antakshari Letter Chains & Song Lyrics Completion
// 2. Iconic & Recent Bollywood Dialogue Decoder (Stree 2, Animal, Jawan, 12th Fail, etc.)
// 3. Material Symbol Visual Scene Riddles
// 4. Interactive Era Filters (Recent Hits 2020-2025, 2010s, 2000s, 90s & Retro Gold)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { BOLLYWOOD_QUESTIONS, BOLLYWOOD_ERAS, getQuizDeck } from '../data/bollywoodQuizData.js';

export { BOLLYWOOD_QUESTIONS, BOLLYWOOD_ERAS, getQuizDeck };

let confettiInstance = null;
let timerInterval = null;

let currentEra = 'ALL'; // 'ALL' | 'RECENT' | '2010s' | '2000s' | 'RETRO' | 'ANTAKSHARI_ONLY'
let activeDeck = getQuizDeck(currentEra, 10);

let gameState = {
  playMode: 'GROUP', // 'GROUP' | 'DUOS' | 'SOLO'
  currentIndex: 0,
  score: 0,
  scoreP1: 0,
  scoreP2: 0,
  streak: 0,
  timeLeft: 15,
  isAnswered: false,
  selectedOption: null,
  isComplete: false,
};

function resetGameState() {
  gameState = {
    playMode: gameState.playMode || store.getState().arcadePlayMode || 'GROUP',
    currentIndex: 0,
    score: 0,
    scoreP1: 0,
    scoreP2: 0,
    streak: 0,
    timeLeft: 15,
    isAnswered: false,
    selectedOption: null,
    isComplete: false,
  };
}

export function renderBollywoodGame() {
  if (!activeDeck || activeDeck.length === 0) {
    activeDeck = getQuizDeck(currentEra, 10);
  }

  const currentPlayMode = store.getState().arcadePlayMode || gameState.playMode || 'GROUP';
  gameState.playMode = currentPlayMode;
  const current = activeDeck[gameState.currentIndex] || activeDeck[0];
  const isP1Turn = gameState.currentIndex % 2 === 0;

  return `
    <div class="min-h-screen bg-[#090C15] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[960px] mx-auto select-none" id="bollywood-root">
      
      <!-- Top Navigation Header -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#262B40]/70 flex-wrap gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase mb-2 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">movie</span>
            <span>INDIAN ARCADE // BOLLYWOOD ANTAKSHARI &amp; MASALA</span>
          </div>
          <h1 class="font-display text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Filmi Masala Relay</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-mono">
              ${gameState.currentIndex + 1} of ${activeDeck.length}
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Shot Clock (15s) -->
          <div class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141826] border ${gameState.timeLeft <= 5 ? 'border-rose-500 text-rose-400 animate-pulse' : 'border-[#2B3147] text-amber-gold'}">
            <span class="material-symbols-outlined text-[18px]">timer</span>
            <span class="text-lg font-mono font-black" id="bolly-timer-display">${gameState.timeLeft}s</span>
          </div>

          <a href="#/ARCADE" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Arcade Hub</span>
          </a>
        </div>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-rose-400 text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Antakshari Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-bolly-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-rose-500 text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (Squad Relay)
          </button>
          <button class="btn-bolly-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (1v1 Face-off)
          </button>
          <button class="btn-bolly-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo (15s Sprint)
          </button>
        </div>
      </div>

      ${currentPlayMode === 'DUOS' ? `
        <div class="p-3 rounded-2xl bg-[#1F1422] border border-duo-rose/40 flex items-center justify-between gap-3 text-xs font-mono mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${isP1Turn ? 'bg-amber-gold animate-ping' : 'bg-duo-rose animate-ping'}"></span>
            <span class="font-bold text-white">Active Turn: <strong class="${isP1Turn ? 'text-amber-gold' : 'text-duo-rose'}">${isP1Turn ? 'Player 1 (You)' : 'Player 2 (Partner)'}</strong></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-amber-gold font-bold">P1: ${gameState.scoreP1}</span>
            <span class="text-gray-500">|</span>
            <span class="text-duo-rose font-bold">P2: ${gameState.scoreP2}</span>
          </div>
        </div>
      ` : ''}

      <!-- Era & Category Filter Tabs -->
      <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        ${BOLLYWOOD_ERAS.map(e => {
          const isActive = currentEra === e.id;
          return `
            <button class="btn-era-filter px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isActive
                ? 'bg-rose-500 text-white shadow-glow-rose'
                : 'bg-[#141826] text-gray-400 hover:text-white border border-[#2B3147]'
            }" data-era="${e.id}">
              <span class="material-symbols-outlined text-[14px]">${e.icon}</span>
              <span>${e.label}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- GAME BOARD -->
      ${gameState.isComplete ? renderGameOver() : `
        <div class="p-6 sm:p-10 rounded-3xl bg-[#121522] border border-[#2B3147] shadow-2xl relative overflow-hidden">
          
          <!-- Category Pill, Era Tag & Streak Badge -->
          <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">
                  ${current.type === 'ANTAKSHARI' ? 'music_note' : current.type === 'VISUAL' ? 'theater_comedy' : 'format_quote'}
                </span>
                <span>${current.type === 'ANTAKSHARI' ? `ANTAKSHARI LETTER: "${current.letter}"` : current.type === 'VISUAL' ? 'VISUAL SCENE RIDDLE' : 'ICONIC DIALOGUE DECODE'}</span>
              </span>

              ${current.eraLabel ? `
                <span class="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase bg-amber-gold/15 text-amber-gold border border-amber-gold/30">
                  ${current.eraLabel}
                </span>
              ` : ''}
            </div>

            <span class="text-xs font-mono text-amber-gold font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-amber-gold">local_fire_department</span>
              <span>Streak: ${gameState.streak} | Score: ${gameState.score}</span>
            </span>
          </div>

          <!-- Question Clue Box -->
          <div class="text-center py-6 px-4 rounded-2xl bg-[#181C2B] border border-white/5 mb-8">
            ${current.icons ? `
              <div class="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                ${current.icons.map(ic => `
                  <div class="w-12 h-12 rounded-xl bg-surface-bright/80 border border-white/10 flex items-center justify-center text-sunset-coral shadow-inner">
                    <span class="material-symbols-outlined text-2xl sm:text-3xl">${ic}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="font-display font-black text-xl sm:text-3xl text-white tracking-tight leading-relaxed mb-3">
              ${current.prompt}
            </div>

            ${current.songSnippet ? `
              <div class="my-3 py-2 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs sm:text-sm inline-flex items-center gap-2 max-w-xl">
                <span class="material-symbols-outlined text-base text-rose-400">lyrics</span>
                <span class="italic font-bold">${current.songSnippet}</span>
              </div>
            ` : ''}

            <p class="text-xs font-mono text-gray-400 italic mt-2">
              Hint: ${current.hint}
            </p>
          </div>

          <!-- 4 Multiple Choice Options -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            ${current.options.map((opt, idx) => {
              let btnStyle = 'bg-[#181C2B] hover:bg-[#22283d] border-[#2B3147] text-white';
              if (gameState.isAnswered) {
                if (idx === current.correct) {
                  btnStyle = 'bg-mint-green/20 border-mint-green text-mint-green font-bold shadow-[0_0_15px_rgba(74,222,128,0.2)]';
                } else if (idx === gameState.selectedOption) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold';
                } else {
                  btnStyle = 'bg-[#181C2B] border-white/5 opacity-40';
                }
              }

              return `
                <button class="btn-bolly-option p-4 rounded-2xl border text-left text-sm sm:text-base font-sans transition-all flex items-center justify-between cursor-pointer ${btnStyle}" data-index="${idx}" ${gameState.isAnswered ? 'disabled' : ''}>
                  <span class="font-medium">${opt}</span>
                  <span class="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400 shrink-0 ml-2">${String.fromCharCode(65 + idx)}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Next Clue Button -->
          ${gameState.isAnswered ? `
            <div class="text-center pt-4 border-t border-white/10">
              <button id="btn-bolly-next" class="px-8 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                ${gameState.currentIndex + 1 >= activeDeck.length ? 'See Final Score ➔' : 'Next Clue ➔'}
              </button>
            </div>
          ` : ''}

        </div>
      `}

    </div>
  `;
}

function renderGameOver() {
  const isDuos = gameState.playMode === 'DUOS';
  const isSolo = gameState.playMode === 'SOLO';

  let verdictTitle = 'Filmi Shehenshah!';
  let verdictDesc = `You scored <strong class="text-amber-gold font-mono text-lg font-bold">${gameState.score}</strong> points across the Bollywood Antakshari &amp; Dialogue relay!`;

  if (isDuos) {
    const p1 = gameState.scoreP1;
    const p2 = gameState.scoreP2;
    if (p1 > p2) {
      verdictTitle = 'Player 1 Wins the Crown! 👑';
      verdictDesc = `Player 1 took the victory with <strong class="text-amber-gold font-mono">${p1} pts</strong> vs Player 2's <strong class="text-duo-rose font-mono">${p2} pts</strong>!`;
    } else if (p2 > p1) {
      verdictTitle = 'Player 2 Wins the Crown! 👑';
      verdictDesc = `Player 2 took the victory with <strong class="text-duo-rose font-mono">${p2} pts</strong> vs Player 1's <strong class="text-amber-gold font-mono">${p1} pts</strong>!`;
    } else {
      verdictTitle = 'Bollywood Tie! 🤝';
      verdictDesc = `Both Bollywood Shehenshahs tied at <strong class="text-amber-gold font-mono">${p1} pts</strong>!`;
    }
  } else if (isSolo) {
    verdictTitle = 'Solo Speed Shehenshah! ⚡';
    verdictDesc = `Solo 15s Sprint finished with <strong class="text-mint-green font-mono text-lg font-bold">${gameState.score} pts</strong>! True Bollywood encyclopedia knowledge.`;
  }

  return `
    <div class="p-8 sm:p-12 rounded-3xl bg-[#121522] border border-[#2B3147] text-center shadow-2xl max-w-lg mx-auto animate-fade-in">
      <div class="w-20 h-20 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40 flex items-center justify-center mx-auto mb-4 shadow-glow-amber">
        <span class="material-symbols-outlined text-4xl">military_tech</span>
      </div>

      <h2 class="font-display text-3xl font-black text-white mb-2">${verdictTitle}</h2>
      <p class="text-sm text-gray-300 font-sans mb-6">
        ${verdictDesc}
      </p>

      ${isDuos ? `
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="p-3.5 rounded-2xl bg-amber-gold/10 border border-amber-gold/30 text-center">
            <span class="text-xs font-mono text-gray-400 block mb-1">Player 1 (You)</span>
            <span class="text-xl font-mono font-black text-amber-gold">${gameState.scoreP1} pts</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-duo-rose/10 border border-duo-rose/30 text-center">
            <span class="text-xs font-mono text-gray-400 block mb-1">Player 2 (Partner)</span>
            <span class="text-xl font-mono font-black text-duo-rose">${gameState.scoreP2} pts</span>
          </div>
        </div>
      ` : ''}

      <div class="p-4 rounded-2xl bg-[#181C2B] border border-white/5 mb-6 text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-amber-gold text-base">local_fire_department</span>
        <span>Reward Earned: <strong class="text-amber-gold">+150 Campfire Sparks</strong> credited to your wallet!</span>
      </div>

      <div class="flex items-center justify-center gap-3 flex-wrap">
        <button id="btn-bolly-restart" class="px-6 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 cursor-pointer transition-all">
          Play Another Round
        </button>
        <a href="#/ARCADE" class="px-6 py-3 rounded-full bg-[#181C2B] hover:bg-[#22283d] text-white border border-[#2B3147] font-bold text-xs transition-all">
          Back to Arcade
        </a>
      </div>
    </div>
  `;
}

export function bindBollywoodEvents() {
  if (typeof window !== 'undefined' && !confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Clear previous timer
  if (timerInterval) clearInterval(timerInterval);

  if (!gameState.isAnswered && !gameState.isComplete) {
    timerInterval = setInterval(() => {
      gameState.timeLeft--;
      const display = document.getElementById('bolly-timer-display');
      if (display) display.textContent = `${gameState.timeLeft}s`;

      if (gameState.timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(-1); // Timed out
      }
    }, 1000);
  }

  // In-Game Play Mode Switcher
  document.querySelectorAll('.btn-bolly-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== gameState.playMode) {
        audio.playClick();
        store.setArcadePlayMode(mode);
        gameState.playMode = mode;
        activeDeck = getQuizDeck(currentEra, 10);
        resetGameState();
        reRender();
      }
    });
  });

  // Era Filter Tabs
  document.querySelectorAll('.btn-era-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const era = btn.getAttribute('data-era');
      if (era && era !== currentEra) {
        audio.playClick();
        currentEra = era;
        activeDeck = getQuizDeck(currentEra, 10);
        resetGameState();
        reRender();
      }
    });
  });

  // Option Click
  const optionBtns = document.querySelectorAll('.btn-bolly-option');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = parseInt(btn.dataset.index, 10);
      handleAnswer(selected);
    });
  });

  function handleAnswer(selected) {
    if (timerInterval) clearInterval(timerInterval);
    gameState.isAnswered = true;
    gameState.selectedOption = selected;

    const current = activeDeck[gameState.currentIndex];
    if (current && selected === current.correct) {
      audio.playChime();
      const pts = 100 + gameState.timeLeft * 5;
      gameState.score += pts;
      if (gameState.playMode === 'DUOS') {
        if (gameState.currentIndex % 2 === 0) {
          gameState.scoreP1 += pts;
        } else {
          gameState.scoreP2 += pts;
        }
      }
      gameState.streak++;
      if (confettiInstance) confettiInstance.burst(40, 1);
    } else {
      audio.playClick();
      gameState.streak = 0;
    }

    reRender();
  }

  // Next Clue
  const nextBtn = document.getElementById('btn-bolly-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playClick();
      if (gameState.currentIndex + 1 >= activeDeck.length) {
        gameState.isComplete = true;
        // Award sparks
        store.claimDailySparks();
      } else {
        gameState.currentIndex++;
        gameState.timeLeft = 15;
        gameState.isAnswered = false;
        gameState.selectedOption = null;
      }
      reRender();
    });
  }

  // Restart Round
  const restartBtn = document.getElementById('btn-bolly-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      audio.playClick();
      activeDeck = getQuizDeck(currentEra, 10);
      resetGameState();
      reRender();
    });
  }

  function reRender() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'BOLLYWOOD') {
      mount.innerHTML = renderBollywoodGame();
      bindBollywoodEvents();
    }
  }
}
