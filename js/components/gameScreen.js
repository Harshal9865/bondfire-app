// ==============================================================================
// LIVE GAMEPLAY COMPONENT (Screen 2)
// "Who Said This in 2019?" Multiplayer Roast Round matching Google Stitch specifications
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let timerInterval = null;
let confettiInstance = null;

const GAME_DECK = [
  {
    round: 1,
    timestamp: 'Oct 14, 2019 · 2:43 AM',
    quote: 'If I eat one more samosa I am legally changing my name to potato and moving into the fridge.',
    correctAnswer: 'Rohan',
    options: [
      { name: 'Maya', role: 'Camp Veteran', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5xZpaCN4ZaDBdFPkL5bMGAVbtuhvK4Qhk-v7xPPviMOQclsqKAQFsIKMIcBxLd4-2Uk-90g2nKTxRTCpa_vp3mq8muh9ZhAbReuLvt8qrVT-YZyysLpR_KnyDvCtZx7UnQ6pLbPTmenCeN4BvXUIk_vF0_LtMhVo59yoExNiGlIUBX3DHt2E6qo8vaVyWIE1uatILqPBeCI3l5lFrY36nzCwnF18RCGQrC6laAx84Tr5D_ohOOe77FQ' },
      { name: 'Rohan', role: 'Foodie Captain', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxOF6eH3YLYfxKLR143grynKCP1HZTNf8m3vOIRWZirlgPfDmYZr0CjQOd6_rQcpz2wQWYhgMtThVwuJO9FuvC8LvGPEhS8gO18ifwgwpsX5zf4_x_LP-9oUvZdjS7AG_hNCVah-H8Ls2b8yQ2umk6EQWAWwDFUHgS-SJV6HhfJIq_gihQ0j5ahyytTd3Fehaqqmif38Y0efACWzlh8qzEvft2NAdJqP7jE6Gm58eTuPyjdwLbhdHL0g' },
      { name: 'Alex', role: 'Late Night Owl', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATy2qu59ulmLgSkSbicSnc3Ux_P-5__PswfNDRTh4DCxvBC1Nt1879TnM1QtXDWyeCpzydz2vOpowwsb8yYQuvBQX8PprAAInIKvHwvRtKLoRY1mcKCkd-kVKfp8R0fAwqm4fll2Lxu1GJajGsHHwLGc0u53pqH_L_TV13Ayr9SmhKglYLeUMfzPIiaWuIKJA1BHnwTZu27vluYLBYgzCWLh5l592qWfBdolQbA-WGufMWzSmFKKvRXA' },
      { name: 'Sarah', role: 'Board Game Host', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDySvCa7Hc5xAULiWC4iNdKkkcDRSbOWNZ81f_W0uhYgGu9-jGyhudyaIo5ZWOt0v0rl9d3yWndIZbie4X8vPISEqJwcU93S0OwvvtGsiISqoRTpEceomCg-di_2I5BF9jeZepBVKx_0RoNxq6d7TJDUEj9bJd62XseRoL3n3cfqEcQazhb_IZM5sLgsaJwmTTmdcBEgjK5aos5_QDeTEMdpm1WcKNEwSMuKY5WhMT2viHUCE8tXX3IGA' }
    ],
    context: 'Sent during semester final exams at 2:43 AM'
  },
  {
    round: 2,
    timestamp: 'July 14, 2019 · 2:41 AM',
    quote: 'If anyone orders another Hawaiian pizza tonight I am literally revoking my Netflix password for all 5 of you.',
    correctAnswer: 'Liam',
    options: [
      { name: 'Maya', role: 'Camp Veteran', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5xZpaCN4ZaDBdFPkL5bMGAVbtuhvK4Qhk-v7xPPviMOQclsqKAQFsIKMIcBxLd4-2Uk-90g2nKTxRTCpa_vp3mq8muh9ZhAbReuLvt8qrVT-YZyysLpR_KnyDvCtZx7UnQ6pLbPTmenCeN4BvXUIk_vF0_LtMhVo59yoExNiGlIUBX3DHt2E6qo8vaVyWIE1uatILqPBeCI3l5lFrY36nzCwnF18RCGQrC6laAx84Tr5D_ohOOe77FQ' },
      { name: 'Liam', role: 'Campfire Guitarist', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmwuDdkf2JKU_FNP18beYeY54Rz_EbBHfwxAwsyn4tS1T3U5YNgmSC1WPW_6TUur3NpEhH3bq2d5N5NPRonMsPcP8OiiyyCqosSaMmTH5uUB8mSK_CcZoo6IniUTD5Frt9TZCNZZLLeKRENQGHoapodjHvYqod50pXY1xl6XN6H3cNt0A5CZbVGOAYrDOdOs7NWbQ-AfTAxR5fzZUBftESRetw_934QcPVBQpoADdzgKbZA3-VkQmkkw' },
      { name: 'Sarah', role: 'Trivia Legend', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDySvCa7Hc5xAULiWC4iNdKkkcDRSbOWNZ81f_W0uhYgGu9-jGyhudyaIo5ZWOt0v0rl9d3yWndIZbie4X8vPISEqJwcU93S0OwvvtGsiISqoRTpEceomCg-di_2I5BF9jeZepBVKx_0RoNxq6d7TJDUEj9bJd62XseRoL3n3cfqEcQazhb_IZM5sLgsaJwmTTmdcBEgjK5aos5_QDeTEMdpm1WcKNEwSMuKY5WhMT2viHUCE8tXX3IGA' },
      { name: 'Alex', role: 'Late Night Owl', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATy2qu59ulmLgSkSbicSnc3Ux_P-5__PswfNDRTh4DCxvBC1Nt1879TnM1QtXDWyeCpzydz2vOpowwsb8yYQuvBQX8PprAAInIKvHwvRtKLoRY1mcKCkd-kVKfp8R0fAwqm4fll2Lxu1GJajGsHHwLGc0u53pqH_L_TV13Ayr9SmhKglYLeUMfzPIiaWuIKJA1BHnwTZu27vluYLBYgzCWLh5l592qWfBdolQbA-WGufMWzSmFKKvRXA' }
    ],
    context: 'Austin Airbnb trip 2:41 AM late night pizza delivery dispute'
  }
];

export function renderGameScreen() {
  const state = store.getState();
  const game = state.activeGame;
  const activeDeck = [...(state.customGameDeck || []), ...GAME_DECK];
  const currentCard = activeDeck[(game.roundIndex - 1) % activeDeck.length];
  const user = state.currentUser;
  const currentUserName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
  const userAvatar = (user && user.avatarUrl) ? user.avatarUrl : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUserName)}`;
  const cardOptions = currentCard.options.map((opt) => {
    if (opt.name === 'Maya') {
      return {
        ...opt,
        name: currentUserName,
        avatar: userAvatar,
      };
    }
    return opt;
  });

  return `
    <div class="relative w-full max-w-[620px] mx-auto px-4 pt-6 pb-20 select-none text-on-surface">
      <!-- Top Status HUD -->
      <div class="flex items-center justify-between gap-2 w-full pt-1 pb-3">
        <!-- Left Pill: Round Indicator -->
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm border border-border/50">
          <span class="material-symbols-outlined text-secondary text-[16px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
          <span class="font-label-md text-label-md tracking-wider text-secondary font-bold">ROUND ${game.roundIndex}/${game.totalRounds}</span>
        </div>

        <!-- Center: Radial Countdown Timer -->
        <div class="relative flex items-center justify-center w-14 h-14">
          <svg class="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
            <circle class="stroke-surface-variant fill-none" cx="24" cy="24" r="19" stroke-width="3"></circle>
            <circle class="stroke-secondary fill-none transition-all duration-300" cx="24" cy="24" id="timer-ring" r="19" stroke-dasharray="119.38" stroke-dashoffset="35" stroke-linecap="round" stroke-width="3.5"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="font-room-code text-headline-sm text-secondary font-bold leading-none tracking-tight" id="shot-clock-text">${game.timeRemaining}<span class="text-[11px] font-normal tracking-normal text-secondary/80">s</span></span>
          </div>
        </div>

        <!-- Right Pill: Pod Score -->
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm border border-border/50">
          <span class="material-symbols-outlined text-secondary text-[16px]" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
          <span class="font-label-md text-label-md text-on-surface"><span id="game-score-display" class="tabular-nums font-bold">${game.score}</span> <span class="text-secondary font-semibold">PTS</span></span>
        </div>
      </div>

      <!-- Category & Game Mode Badge -->
      <div class="flex items-center justify-center my-1.5">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-low border border-sunset-coral/30 shadow-[0_0_12px_rgba(255,90,95,0.18)]">
          <span class="material-symbols-outlined text-primary-container text-[14px]">whatshot</span>
          <span class="font-label-md text-label-md tracking-wider text-primary-container uppercase font-bold">Inside Joke Mystery Deck</span>
          <span class="text-surface-variant text-[10px]">•</span>
          <span class="font-label-md text-caption uppercase tracking-wider text-on-surface-variant">Squad Mode</span>
        </div>
      </div>

      <!-- The Memory Card (Centerpiece Artifact) -->
      <div class="relative w-full my-3.5 rounded-2xl bg-surface-container p-5 shadow-xl border border-border/80 overflow-hidden" id="live-memory-card">
        <!-- Top Skeuomorphic Tape Pin Accent -->
        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-surface-bright/70 backdrop-blur-md rounded-b-sm rotate-1 shadow-inner flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-background/60 shadow-sm"></div>
        </div>

        <!-- CRT & Warm Analog Radial Glow Decor -->
        <div class="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-primary-container/10 via-transparent to-transparent pointer-events-none"></div>

        <!-- Metadata Header Bar -->
        <div class="flex items-center justify-between pb-3 pt-1 border-b border-surface-variant/40">
          <div class="flex items-center gap-1.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[15px] text-on-surface-variant">schedule</span>
            <span class="font-label-md text-caption uppercase tracking-wider">${currentCard.timestamp}</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface-container-lowest text-tertiary">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
            <span class="font-caption text-caption uppercase font-semibold">Live Deck</span>
          </div>
        </div>

        <!-- Preserved Message Bubble (Tap to inspect) -->
        <div class="mt-3.5 mb-3 p-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest shadow-inner relative cursor-pointer hover:border-sunset-coral/40 border border-transparent transition-colors" id="chat-quote-bubble" title="Click to view raw WhatsApp screenshot">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-[13px] font-bold text-on-surface-variant">
              ?
            </div>
            <div class="flex flex-col flex-1">
              <span class="font-caption text-caption text-on-surface-variant pb-0.5">Mystery Sender</span>
              <p class="font-body-md text-body-md text-on-surface leading-relaxed italic">
                “${currentCard.quote}”
              </p>
            </div>
          </div>
        </div>

        <!-- Card Footer Tags -->
        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-caption font-body-sm text-on-surface">
              <span class="text-sm">😂</span> 12 Laughs
            </span>
            <span class="inline-flex items-center gap-1 text-on-surface-variant font-caption text-caption">
              <span class="material-symbols-outlined text-[13px] text-tertiary">lock</span> Verified Archive
            </span>
          </div>
          <button class="material-symbols-outlined text-surface-variant text-[18px] hover:text-white transition-colors" id="btn-share-quote">share</button>
        </div>
      </div>

      <!-- Question Prompt & Live Squad Status -->
      <div class="flex flex-col gap-1.5 px-1 my-2">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Who sent this without context?
          </h2>
        </div>

        <!-- Live Vote Progress & Micro Avatars -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-1.5">
              <div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold text-on-secondary-container shadow-sm">RK</div>
              <div class="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary shadow-sm">${currentUserName.substring(0, 2).toUpperCase()}</div>
              <div class="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-[10px] font-bold text-on-tertiary shadow-sm">AL</div>
              <div class="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center text-[10px] font-bold text-on-surface shadow-sm">SH</div>
              <div class="w-6 h-6 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-secondary shadow-sm">DV</div>
            </div>
            <span class="font-caption text-caption text-on-surface-variant">5 of 6 locked in</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span class="font-caption text-caption text-secondary font-medium">Liam choosing...</span>
          </div>
        </div>
      </div>

      <!-- 4-Option Tap Grid (2x2 Chunky Interactive Cards) -->
      <div class="grid grid-cols-2 gap-2.5 my-3" id="game-option-grid">
        ${cardOptions
          .map((opt, idx) => {
            const isSelected = game.selectedOption === opt.name;
            return `
              <button class="game-opt-btn group relative flex items-center gap-3 p-3 rounded-xl ${isSelected ? 'bg-primary-container/15 shadow-[0_0_20px_rgba(255,90,95,0.35)] border border-primary-container' : 'bg-surface-container border border-border/80'} text-left transition-all active:scale-[0.98] focus:outline-none hover:bg-surface-container-high shadow-md" data-option="${opt.name}" type="button" ${game.isAnswerRevealed ? 'disabled' : ''}>
                ${isSelected ? `<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-container/20 to-transparent pointer-events-none"></div>` : ''}
                <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-variant shrink-0 relative">
                  <img class="w-full h-full object-cover" alt="${opt.name}" src="${opt.avatar}" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(opt.name)}'" />
                  ${isSelected ? `<div class="absolute inset-0 bg-primary-container/20"></div>` : ''}
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <span class="font-label-lg text-label-lg text-on-surface truncate ${isSelected ? 'font-bold' : ''}">${opt.name}</span>
                  <span class="font-caption text-caption ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'} truncate">
                    ${isSelected ? 'LOCKED 🔒' : opt.role}
                  </span>
                </div>
                <div class="w-6 h-6 rounded-full ${isSelected ? 'bg-primary-container text-on-primary' : 'text-surface-variant'} flex items-center justify-center ml-auto">
                  <span class="material-symbols-outlined text-[16px]">${isSelected ? 'check' : 'radio_button_unchecked'}</span>
                </div>
              </button>
            `;
          })
          .join('')}
      </div>

      <!-- Answer Reveal Result Banner -->
      <div id="game-reveal-banner" class="my-3 p-4 rounded-2xl bg-surface-container border border-tertiary/60 shadow-xl text-center" style="display: ${game.isAnswerRevealed ? 'block' : 'none'};">
        <div class="flex items-center justify-center gap-2 text-tertiary font-headline-sm text-headline-sm font-bold mb-1">
          <span class="material-symbols-outlined text-[24px]">verified</span>
          <span>Correct Answer: ${currentCard.correctAnswer}!</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-3">
          ${currentCard.context}
        </p>
        <button id="btn-next-round" class="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2">
          <span>NEXT ROUND</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <!-- Bottom Quick-Roast Interactive Console -->
      <div class="w-full mt-2 p-3.5 rounded-2xl bg-surface-container/85 backdrop-blur-xl border border-border/70 shadow-xl flex flex-col gap-2.5">
        <!-- Live Squad Reactions Bar -->
        <div class="flex items-center justify-between gap-1.5 w-full">
          <span class="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold shrink-0">Roast:</span>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="reaction-container">
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-emoji="😂" type="button">
              <span class="text-sm">😂</span>
              <span class="font-label-md text-caption text-on-surface count">14</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-emoji="💀" type="button">
              <span class="text-sm">💀</span>
              <span class="font-label-md text-caption text-on-surface count">28</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-emoji="🔥" type="button">
              <span class="text-sm">🔥</span>
              <span class="font-label-md text-caption text-secondary count">9</span>
            </button>
            <button class="reaction-btn flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high active:scale-90 hover:bg-surface-variant transition-transform shadow-sm" data-emoji="🚩" type="button">
              <span class="text-sm">🚩</span>
              <span class="font-label-md text-caption text-primary count">4</span>
            </button>
          </div>
          <!-- Quick Buzzer / Send Reaction Pin -->
          <button id="btn-reveal-now" class="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-caption font-bold hover:brightness-110 active:scale-95 transition-all shrink-0" ${game.isAnswerRevealed ? 'disabled' : ''}>
            Reveal Now ⚡
          </button>
        </div>

        <!-- Archival / Pod Yearbook Notice -->
        <div class="flex items-center justify-between pt-1 border-t border-surface-variant/30 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-secondary text-[15px]">auto_stories</span>
            <span class="font-caption text-caption text-on-surface-variant">
              Pod Yearbook: Archived in the <span class="text-secondary font-semibold">2026 Yearbook</span> 📖
            </span>
          </div>
          <span class="font-caption text-caption text-tertiary font-bold tracking-wide">+150 XP</span>
        </div>
      </div>

      <!-- Raw WhatsApp Lightbox Modal -->
      <div id="quote-lightbox-modal" class="fixed inset-0 bg-canvas/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="relative max-w-md w-full rounded-2xl bg-surface-container p-5 border border-border shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-border">
            <span class="font-label-md text-caption text-amber-gold uppercase font-bold tracking-wider">Authentic Chat Screenshot</span>
            <button id="btn-close-lightbox" class="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-white hover:bg-surface-variant">✕</button>
          </div>
          <div class="my-4 p-4 rounded-xl bg-[#0B141A] border border-[#202C33]">
            <div class="text-[11px] text-[#8696A0] mb-2">${currentCard.timestamp}</div>
            <div class="bg-[#005C4B] text-[#E9EDEF] p-3.5 rounded-xl rounded-tr-none text-sm leading-relaxed max-w-[85%] ml-auto shadow">
              ${currentCard.quote}
              <div class="text-[10px] text-[#A0C2B6] text-right mt-1.5">2:43 AM ✓✓</div>
            </div>
          </div>
          <p class="text-xs text-center text-gray-400">Encrypted WhatsApp chat memory verified by Pod Vault.</p>
        </div>
      </div>
    </div>
  `;
}

export function bindGameEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  const state = store.getState();
  const game = state.activeGame;
  const currentCard = GAME_DECK[(game.roundIndex - 1) % GAME_DECK.length];

  // Shot clock logic
  const clockText = document.getElementById('shot-clock-text');
  const timerRing = document.getElementById('timer-ring');
  let seconds = game.timeRemaining;

  if (timerInterval) clearInterval(timerInterval);

  if (!game.isAnswerRevealed) {
    timerInterval = setInterval(() => {
      seconds--;
      if (clockText) clockText.innerHTML = `${seconds}<span class="text-[11px] font-normal tracking-normal text-secondary/80">s</span>`;
      if (timerRing) {
        // Circumference for r=19 is 2 * PI * 19 ≈ 119.38
        const offset = 119.38 - (119.38 * seconds) / 20;
        timerRing.style.strokeDashoffset = offset;
        if (seconds <= 5) {
          audio.playTick();
          timerRing.classList.remove('stroke-secondary');
          timerRing.classList.add('stroke-primary-container');
        }
      }

      if (seconds <= 0) {
        clearInterval(timerInterval);
        handleReveal();
      }
    }, 1000);
  }

  // Option selection
  const optionGrid = document.getElementById('game-option-grid');
  if (optionGrid) {
    optionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.game-opt-btn');
      if (!btn || btn.disabled) return;

      audio.playClick();
      const chosen = btn.dataset.option;

      store.setState({
        activeGame: { ...store.getState().activeGame, selectedOption: chosen },
      });
      store.setView('GAME');
    });
  }

  // Reveal Function
  const handleReveal = () => {
    if (timerInterval) clearInterval(timerInterval);
    const currentGame = store.getState().activeGame;
    if (currentGame.isAnswerRevealed) return;

    const isCorrect = currentGame.selectedOption === currentCard.correctAnswer;
    const addedPoints = isCorrect ? Math.max(200, 1000 - (20 - seconds) * 35) : 0;

    if (isCorrect) {
      audio.playCorrect();
      confettiInstance.burst(50);
    } else {
      audio.playTick();
    }

    store.setState({
      activeGame: {
        ...currentGame,
        score: currentGame.score + addedPoints,
        isAnswerRevealed: true,
      },
    });

    const revealBanner = document.getElementById('game-reveal-banner');
    if (revealBanner) revealBanner.style.display = 'block';

    const revealBtn = document.getElementById('btn-reveal-now');
    if (revealBtn) revealBtn.disabled = true;

    // Highlight options
    const optionBtns = document.querySelectorAll('.game-opt-btn');
    optionBtns.forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.option === currentCard.correctAnswer) {
        btn.classList.remove('bg-surface-container');
        btn.classList.add('bg-mint-green/20', 'border-mint-green');
      } else if (btn.dataset.option === currentGame.selectedOption) {
        btn.classList.remove('bg-surface-container');
        btn.classList.add('bg-sunset-coral/20', 'border-sunset-coral');
      }
    });
  };

  const revealBtn = document.getElementById('btn-reveal-now');
  if (revealBtn) {
    revealBtn.addEventListener('click', handleReveal);
  }

  // Next Round Button
  const nextBtn = document.getElementById('btn-next-round');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playClick();
      const currentGame = store.getState().activeGame;
      if (currentGame.roundIndex >= currentGame.totalRounds) {
        store.setView('YEARBOOK');
      } else {
        store.setState({
          activeGame: {
            ...currentGame,
            roundIndex: currentGame.roundIndex + 1,
            selectedOption: null,
            isAnswerRevealed: false,
            timeRemaining: 20,
          },
        });
        store.setView('GAME');
      }
    });
  }

  // Emoji Reactions with counter increment & floating particle
  const reactionBtns = document.querySelectorAll('.reaction-btn');
  reactionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const countSpan = btn.querySelector('.count');
      if (countSpan) {
        const num = parseInt(countSpan.textContent, 10);
        countSpan.textContent = isNaN(num) ? 1 : num + 1;
      }
      btn.classList.add('bg-primary-container/20');
      setTimeout(() => btn.classList.remove('bg-primary-container/20'), 400);

      // Create floating emoji particle
      const floater = document.createElement('div');
      floater.textContent = btn.dataset.emoji;
      floater.style.position = 'fixed';
      floater.style.left = `${Math.random() * 50 + 25}vw`;
      floater.style.bottom = '140px';
      floater.style.fontSize = '32px';
      floater.style.zIndex = '999';
      floater.style.pointerEvents = 'none';
      floater.style.transition = 'all 1.2s ease-out';
      document.body.appendChild(floater);

      requestAnimationFrame(() => {
        floater.style.transform = 'translateY(-180px) scale(1.6)';
        floater.style.opacity = '0';
      });

      setTimeout(() => floater.remove(), 1200);
    });
  });

  // Lightbox Modal
  const quoteBubble = document.getElementById('chat-quote-bubble');
  const lightboxModal = document.getElementById('quote-lightbox-modal');
  const closeLightboxBtn = document.getElementById('btn-close-lightbox');

  if (quoteBubble && lightboxModal) {
    quoteBubble.addEventListener('click', () => {
      audio.playClick();
      lightboxModal.style.display = 'flex';
    });
  }

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      audio.playClick();
      lightboxModal.style.display = 'none';
    });
  }
}
