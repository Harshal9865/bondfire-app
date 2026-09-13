// ==============================================================================
// FULLSCREEN GAME COUNTDOWN & RULES EXAMPLE ENGINE (js/components/gameCountdownOverlay.js)
// 1. Interactive "How It Works" visual card with rule preview & 5s timer
// 2. Full-screen center-to-corner expanding circular wave countdown (5-4-3-2-1)
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

const MODE_EXAMPLES = {
  SQUAD: {
    badge: 'Squad Party Mode · Real-time Multiplayer',
    title: 'How Squad Trivia & Games Work',
    summary: 'A question or dilemma appears on all connected screens at the same time. Tap your choice before the timer runs out!',
    sampleCard: {
      tag: 'Sample Round · The Living Room Trial',
      question: 'Who is most likely to say "I\'m 5 mins away" while still in bed?',
      options: ['The Host', 'The Group Chat Ghost', 'The Squad DJ', 'The Latecomer'],
      correctIndex: 3,
    },
    scoringHint: '⚡ Fastest matching votes earn 100+ Sparks and combo multiplier fire!',
  },
  US: {
    badge: 'Us Mode · Couples Date Night',
    title: 'How Date Night Works',
    summary: 'Answer personalized questions about your relationship story. Lock in your choices privately to see if your answers match!',
    sampleCard: {
      tag: 'Sample Round · Chapter 1: The Spark',
      question: 'Who takes longer to pack their bags before a weekend getaway?',
      options: ['Partner 1', 'Partner 2'],
      correctIndex: 1,
    },
    scoringHint: '❤️ Matching answers unlock Compatibility Sparks and unseal secret vault notes!',
  },
  SOLO: {
    badge: 'Solo Mode · Memory Quest',
    title: 'How Solo Play Works',
    summary: 'Journey through your personal memory archives, past adventures, and daily reflection prompts at your own pace.',
    sampleCard: {
      tag: 'Sample Prompt · Archive 2024',
      question: 'What was your single most spontaneous trip or decision this past year?',
      options: ['Road Trip Detour', 'Midnight Concert', 'New Career Move', 'Random Weekend Stay'],
      correctIndex: 0,
    },
    scoringHint: '🏆 Complete daily prompts to level up your Citizen tier and unlock custom yearbook covers!',
  },
  ARCADE: {
    badge: 'Arcade Mini-Games · Party Spinners',
    title: 'How Arcade Mini-Games Work',
    summary: 'Digital Spin The Bottle, Never Have I Ever, and Most Likely To with live physics synced across all phones and laptops.',
    sampleCard: {
      tag: 'Sample Spin · Spin The Bottle',
      question: 'Bottle points to: The Camper with the most unread notifications!',
      options: ['Truth / Confession', 'Roast Verdict', 'Take a Sip / Penalty'],
      correctIndex: 0,
    },
    scoringHint: '🎉 Zero bots, 100% human hilarity. Turn any awkward moment into a custom card!',
  },
};

const COUNTDOWN_STEPS = [
  {
    num: '5',
    sub: 'GET READY',
    bgColor: '#7209B7', // Electric Violet
    textColor: '#E0AAFF',
    accentColor: '#C77DFF',
    desc: 'Connect all campers',
  },
  {
    num: '4',
    sub: 'SCREENS SYNCED',
    bgColor: '#06D6A0', // Cyber Aqua / Mint
    textColor: '#0B0E17',
    accentColor: '#00F5D4',
    desc: 'Audio & buzzers active',
  },
  {
    num: '3',
    sub: 'LOCK IN FOCUS',
    bgColor: '#FFB703', // Amber Gold
    textColor: '#0B0E17',
    accentColor: '#FFE494',
    desc: 'Hands on buttons',
  },
  {
    num: '2',
    sub: 'BUZZERS LIVE',
    bgColor: '#FF5A5F', // Sunset Coral
    textColor: '#FFFFFF',
    accentColor: '#FFA39E',
    desc: 'First to vote wins bonus',
  },
  {
    num: '1',
    sub: 'IGNITE!',
    bgColor: '#F72585', // Hot Duo Rose / Flame
    textColor: '#FFFFFF',
    accentColor: '#FF70A6',
    desc: 'Game starting now!',
  },
];

/**
 * Triggers the full game start sequence:
 * 1. Shows "How It Works" visual card with rules, sample question & 5s timer
 * 2. Runs the 5-4-3-2-1 center-to-corner expanding circular shockwave countdown
 * 3. Calls onComplete() to load active game screen
 */
export function triggerGameCountdown({ mode = 'SQUAD', title, onComplete, skipExample = false }) {
  const mount = document.getElementById('countdown-mount') || document.body;
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  const exampleData = MODE_EXAMPLES[mode] || MODE_EXAMPLES.SQUAD;

  // Clean any existing overlay
  const existing = document.getElementById('game-countdown-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'game-countdown-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden';
  overlay.style.backgroundColor = 'rgba(11, 14, 23, 0.96)';
  overlay.style.backdropFilter = 'blur(20px)';
  mount.appendChild(overlay);

  if (skipExample) {
    runExpandingCircleCountdown(overlay, onComplete);
  } else {
    renderExampleStage(overlay, exampleData, title, onComplete);
  }
}

/**
 * Stage 1: How It Works Visual Card with 5s Timer
 */
function renderExampleStage(overlay, exampleData, customTitle, onComplete) {
  let secondsRemaining = 5;
  let timerInterval = null;

  overlay.innerHTML = `
    <div class="relative w-full max-w-lg mx-4 p-6 sm:p-8 rounded-3xl bg-surface border-2 border-amber-gold/50 shadow-2xl flex flex-col gap-5 text-on-surface transform transition-all duration-300 animate-countdown-punch">
      <!-- Glow -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-sunset-coral/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Header & Badge -->
      <div class="flex items-center justify-between">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-[11px] font-bold font-mono uppercase">
          <span class="material-symbols-outlined text-[15px]">tips_and_updates</span>
          <span>${exampleData.badge}</span>
        </div>
        
        <!-- Animated Countdown Ring Pill -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-bright border border-border text-xs font-mono font-bold text-white">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span>Starting in <strong id="example-timer-count" class="text-sunset-coral">${secondsRemaining}s</strong></span>
        </div>
      </div>

      <!-- Title & Summary -->
      <div>
        <h2 class="font-display text-2xl font-bold text-white tracking-tight">
          ${customTitle || exampleData.title}
        </h2>
        <p class="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
          ${exampleData.summary}
        </p>
      </div>

      <!-- Interactive Sample Card Demo -->
      <div class="p-4 rounded-2xl bg-canvas border border-border/80 flex flex-col gap-3">
        <div class="flex items-center justify-between border-b border-border/50 pb-1.5">
          <span class="text-[10px] font-mono text-amber-gold uppercase font-bold tracking-wider">${exampleData.sampleCard.tag}</span>
          <span class="text-[10px] font-mono text-mint-green font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
            Live Sample
          </span>
        </div>
        <p class="text-xs sm:text-sm text-white font-bold italic leading-snug">
          “${exampleData.sampleCard.question}”
        </p>
        <div class="grid grid-cols-2 gap-2 pt-1">
          ${exampleData.sampleCard.options.map((opt, idx) => `
            <div class="p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${idx === exampleData.sampleCard.correctIndex ? 'bg-sunset-coral/20 border-sunset-coral text-white font-bold' : 'bg-surface-bright/60 border-border/60 text-gray-300'}">
              <span class="truncate">${opt}</span>
              ${idx === exampleData.sampleCard.correctIndex ? '<span class="material-symbols-outlined text-[14px] text-sunset-coral">check_circle</span>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="text-[11px] font-mono text-gray-400 flex items-center gap-1 pt-1">
          <span class="material-symbols-outlined text-amber-gold text-[15px]">electric_bolt</span>
          <span>${exampleData.scoringHint}</span>
        </div>
      </div>

      <!-- Skip Button -->
      <div class="flex items-center justify-between pt-1">
        <span class="text-[11px] font-mono text-gray-400">Timer auto-starts countdown</span>
        <button id="btn-skip-example" type="button" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
          <span>Skip &amp; Start Now</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;

  const countEl = document.getElementById('example-timer-count');
  const skipBtn = document.getElementById('btn-skip-example');

  const proceedToCountdown = () => {
    if (timerInterval) clearInterval(timerInterval);
    audio.playClick();
    runExpandingCircleCountdown(overlay, onComplete);
  };

  if (skipBtn) skipBtn.addEventListener('click', proceedToCountdown);

  timerInterval = setInterval(() => {
    secondsRemaining--;
    if (countEl) countEl.textContent = `${secondsRemaining}s`;
    audio.playTick();
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      runExpandingCircleCountdown(overlay, onComplete);
    }
  }, 1000);
}

/**
 * Stage 2: Fullscreen 5-4-3-2-1 Center-to-Corner Expanding Circular Shockwave Countdown
 */
function runExpandingCircleCountdown(overlay, onComplete) {
  audio.playChime();
  let stepIndex = 0;

  // Clear overlay and prepare pure full-screen layer
  overlay.innerHTML = '';
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden';
  overlay.style.backgroundColor = 'transparent';

  function playNextStep() {
    if (stepIndex >= COUNTDOWN_STEPS.length) {
      // Finished 1 -> Flash Ignite Burst!
      renderIgniteBlast(overlay, onComplete);
      return;
    }

    const step = COUNTDOWN_STEPS[stepIndex];
    stepIndex++;

    // Procedural synth audio tick for each number
    audio.playBip();

    // Create expanding circular wave layer starting at center (50%, 50%) and expanding to all 4 corners
    const circleWaveLayer = document.createElement('div');
    circleWaveLayer.className = 'absolute inset-0 flex items-center justify-center animate-circle-wave overflow-hidden pointer-events-none';
    circleWaveLayer.style.backgroundColor = step.bgColor;
    circleWaveLayer.style.zIndex = stepIndex * 10;

    // Center Radial Rings & Number Container
    circleWaveLayer.innerHTML = `
      <!-- Animated Concentric Shockwave Rings radiating from center -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-white/40 animate-ring-pulse pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white/20 animate-ring-pulse pointer-events-none" style="animation-delay: 0.2s;"></div>

      <!-- Center Bouncing Kinetic Number & Label -->
      <div class="relative flex flex-col items-center justify-center text-center animate-countdown-punch pointer-events-none">
        <span class="font-display font-black text-8xl sm:text-[160px] leading-none tracking-tighter drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]" style="color: ${step.textColor};">
          ${step.num}
        </span>
        <div class="mt-2 px-5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full animate-ping" style="background-color: ${step.accentColor};"></span>
          <span class="font-mono text-sm sm:text-base font-extrabold tracking-widest uppercase text-white drop-shadow">
            ${step.sub}
          </span>
        </div>
        <span class="font-mono text-xs text-white/80 mt-2 font-bold tracking-wider uppercase">
          ${step.desc}
        </span>
      </div>
    `;

    overlay.appendChild(circleWaveLayer);

    // Run each step for ~950ms, then launch next expanding circle
    setTimeout(playNextStep, 950);
  }

  playNextStep();
}

/**
 * Stage 3: The IGNITE explosion on 0
 */
function renderIgniteBlast(overlay, onComplete) {
  audio.playCorrect();
  audio.playChime();
  if (confettiInstance) {
    confettiInstance.burst(80);
  }

  const blastLayer = document.createElement('div');
  blastLayer.className = 'absolute inset-0 flex items-center justify-center animate-circle-wave z-[90] overflow-hidden pointer-events-none';
  blastLayer.style.background = 'radial-gradient(circle at 50% 50%, #FFB703 0%, #FF5A5F 50%, #0B0E17 100%)';

  blastLayer.innerHTML = `
    <div class="relative flex flex-col items-center justify-center text-center animate-countdown-punch pointer-events-none">
      <span class="material-symbols-outlined text-white text-6xl sm:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-pulse">
        local_fire_department
      </span>
      <h1 class="font-display font-black text-5xl sm:text-8xl text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)] mt-2">
        IGNITE!
      </h1>
      <span class="font-mono text-sm sm:text-lg font-extrabold text-amber-gold tracking-widest uppercase mt-2">
        Let The Games Begin!
      </span>
    </div>
  `;

  overlay.appendChild(blastLayer);

  // Smooth dissolve and finish
  setTimeout(() => {
    overlay.style.transition = 'opacity 0.4s ease-out';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 400);
  }, 900);
}
