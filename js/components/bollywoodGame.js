// ==============================================================================
// BOLLYWOOD ANTAKSHARI & FILMI MASALA (Screen / Game Component)
// Authentic Indian party favorite:
// 1. Antakshari Letter Relay with 15s shot clock
// 2. Iconic Bollywood Dialogue Decoder
// 3. Emoji Movie Riddles
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;
let timerInterval = null;

const BOLLYWOOD_QUESTIONS = [
  {
    type: 'DIALOGUE',
    prompt: '“Mogambo khush hua!”',
    options: ['Mr. India (Amrish Puri)', 'Sholay (Amjad Khan)', 'Don (Amitabh Bachchan)', 'Gunda (Mukesh Rishi)'],
    correct: 0,
    hint: 'Iconic 1987 sci-fi superhero classic with the invisible watch.'
  },
  {
    type: 'VISUAL',
    prompt: 'Sunglasses · Backpack · Midnight Train · Snow Peaks',
    icons: ['travel_explore', 'backpack', 'train', 'landscape'],
    options: ['Yeh Jawaani Hai Deewani', 'Zindagi Na Milegi Dobara', 'Jab We Met', 'Dil Chahta Hai'],
    correct: 0,
    hint: 'Bunny, Naina, Avi & Aditi on a spontaneous Manali trekking trip.'
  },
  {
    type: 'ANTAKSHARI',
    letter: 'M',
    prompt: 'Song starting with "M" from the 90s Golden Era:',
    options: ['Mehndi Laga Ke Rakhna', 'Chaiyya Chaiyya', 'Tujhe Dekha Toh', 'Tum Hi Ho'],
    correct: 0,
    hint: 'The wedding anthem of Bollywood from DDLJ.'
  },
  {
    type: 'DIALOGUE',
    prompt: '“Kitne aadmi the?”',
    options: ['Gabbar Singh (Sholay)', 'Kancha Cheena (Agneepath)', 'Crime Master Gogo', 'Bhallaladeva'],
    correct: 0,
    hint: 'Spoken on the rocky hills of Ramgarh.'
  },
  {
    type: 'VISUAL',
    prompt: 'Acoustic Guitar · Heavy Rain · Concert Mic · Lost Romance',
    icons: ['music_note', 'rainy', 'mic', 'heart_broken'],
    options: ['Aashiqui 2', 'Rockstar', 'Ae Dil Hai Mushkil', 'Kabir Singh'],
    correct: 0,
    hint: 'Rahul Jaykar and Aarohi under the jacket in Mumbai rain.'
  },
  {
    type: 'DIALOGUE',
    prompt: '“Parampara. Pratishtha. Anushasan.”',
    options: ['Gurukul Principal (Mohabbatein)', 'Virus (3 Idiots)', 'K3G (Yash Raichand)', 'Baghban'],
    correct: 0,
    hint: 'Narayan Shankar commanding Gurukul.'
  },
  {
    type: 'ANTAKSHARI',
    letter: 'P',
    prompt: 'Song starting with "P" - Romantic Evergreen Classic:',
    options: ['Pal Pal Dil Ke Paas', 'Kal Ho Naa Ho', 'Kabira', 'Kun Faya Kun'],
    correct: 0,
    hint: 'Kishore Kumar magic for Dharmendra.'
  }
];

let gameState = {
  currentIndex: 0,
  score: 0,
  streak: 0,
  timeLeft: 15,
  isAnswered: false,
  selectedOption: null,
  isComplete: false
};

export function renderBollywoodGame() {
  const current = BOLLYWOOD_QUESTIONS[gameState.currentIndex];

  return `
    <div class="min-h-screen bg-[#090C15] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[960px] mx-auto select-none" id="bollywood-root">
      
      <!-- Header -->
      <div class="flex items-center justify-between pb-6 mb-8 border-b border-[#262B40]/70 flex-wrap gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase mb-2">
            <span class="material-symbols-outlined text-[16px]">movie</span>
            <span>INDIAN ARCADE // BOLLYWOOD ANTAKSHARI &amp; MASALA</span>
          </div>
          <h1 class="font-display text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Filmi Masala Relay</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-mono">
              ${gameState.currentIndex + 1} of ${BOLLYWOOD_QUESTIONS.length}
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <!-- Shot Clock -->
          <div class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141826] border ${gameState.timeLeft <= 5 ? 'border-rose-500 text-rose-400 animate-pulse' : 'border-[#2B3147] text-amber-gold'}">
            <span class="material-symbols-outlined text-[18px]">timer</span>
            <span class="text-lg font-mono font-black" id="bolly-timer-display">${gameState.timeLeft}s</span>
          </div>

          <a href="#/ARCADE" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Arcade Hub</span>
          </a>
        </div>
      </div>

      <!-- GAME BOARD -->
      ${gameState.isComplete ? renderGameOver() : `
        <div class="p-6 sm:p-10 rounded-3xl bg-[#121522] border border-[#2B3147] shadow-2xl relative overflow-hidden">
          
          <!-- Category & Streak Badge -->
          <div class="flex items-center justify-between mb-6">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30">
              ${current.type === 'ANTAKSHARI' ? `ANTAKSHARI LETTER: "${current.letter}"` : current.type === 'VISUAL' ? 'VISUAL SCENE RIDDLE' : 'ICONIC DIALOGUE DECODE'}
            </span>

            <span class="text-xs font-mono text-amber-gold font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-amber-gold">local_fire_department</span>
              <span>Streak: ${gameState.streak} | Score: ${gameState.score}</span>
            </span>
          </div>

          <!-- Prompt Question Box -->
          <div class="text-center py-6 px-4 rounded-2xl bg-[#181C2B] border border-white/5 mb-8">
            ${current.icons ? `
              <div class="flex items-center justify-center gap-4 mb-3">
                ${current.icons.map(ic => `<span class="material-symbols-outlined text-3xl sm:text-4xl text-sunset-coral">${ic}</span>`).join('')}
              </div>
            ` : ''}
            <div class="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-relaxed mb-3">
              ${current.prompt}
            </div>
            <p class="text-xs font-mono text-gray-400 italic">
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
                  <span>${opt}</span>
                  <span class="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400">${String.fromCharCode(65 + idx)}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Next Question Button -->
          ${gameState.isAnswered ? `
            <div class="text-center pt-4 border-t border-white/10">
              <button id="btn-bolly-next" class="px-8 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                ${gameState.currentIndex + 1 >= BOLLYWOOD_QUESTIONS.length ? 'See Final Score ➔' : 'Next Clue ➔'}
              </button>
            </div>
          ` : ''}

        </div>
      `}

    </div>
  `;
}

function renderGameOver() {
  return `
    <div class="p-10 rounded-3xl bg-[#121522] border border-[#2B3147] text-center shadow-2xl max-w-lg mx-auto">
      <div class="w-20 h-20 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40 flex items-center justify-center mx-auto mb-4">
        <span class="material-symbols-outlined text-4xl">military_tech</span>
      </div>

      <h2 class="font-display text-3xl font-black text-white mb-2">Filmi Shehenshah!</h2>
      <p class="text-sm text-gray-300 font-sans mb-6">
        You scored <strong class="text-amber-gold">${gameState.score}</strong> points across the Bollywood Antakshari &amp; Dialogue relay!
      </p>

      <div class="p-4 rounded-2xl bg-[#181C2B] border border-white/5 mb-6 text-xs font-mono text-gray-400">
        Reward Earned: <strong class="text-amber-gold">+150 Campfire Sparks</strong> added to your store wallet!
      </div>

      <div class="flex items-center justify-center gap-3">
        <button id="btn-bolly-restart" class="px-6 py-3 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer">
          Play Again
        </button>
        <a href="#/ARCADE" class="px-6 py-3 rounded-xl bg-[#181C2B] text-white border border-[#2B3147] font-bold text-xs">
          Back to Arcade
        </a>
      </div>
    </div>
  `;
}

export function bindBollywoodEvents() {
  if (!confettiInstance) {
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

    const current = BOLLYWOOD_QUESTIONS[gameState.currentIndex];
    if (selected === current.correct) {
      audio.playChime();
      gameState.score += 100 + gameState.timeLeft * 5;
      gameState.streak++;
      confettiInstance.burst(40, 1);
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
      if (gameState.currentIndex + 1 >= BOLLYWOOD_QUESTIONS.length) {
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

  // Restart
  const restartBtn = document.getElementById('btn-bolly-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      audio.playClick();
      gameState = {
        currentIndex: 0,
        score: 0,
        streak: 0,
        timeLeft: 15,
        isAnswered: false,
        selectedOption: null,
        isComplete: false
      };
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
