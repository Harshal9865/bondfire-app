// ==============================================================================
// FULLSCREEN GAME COUNTDOWN & RULES EXAMPLE ENGINE (js/components/gameCountdownOverlay.js)
// 1. Interactive "How It Works" visual card with dynamic rules, sample round & normal timer
// 2. Full-screen center-to-corner expanding circular wave countdown (5-4-3-2-1)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

/**
 * Returns dynamic, authentic, highly engaging game examples for each game mode.
 * Dynamically uses real connected player names from the room instead of bot placeholders.
 */
export function getExampleForMode(modeKey, customTitle) {
  const state = store.getState();
  const roomCampers = state.activeRoom?.players || state.activeRoom?.campers || [];
  const camperNames = roomCampers.map((c) => c.name).filter(Boolean);
  const currentUserName = state.currentUser?.displayName ? state.currentUser.displayName.split(' ')[0] : 'Host (You)';
  const activeRoster = camperNames.length > 0 ? camperNames : [currentUserName, 'Player 2'];

  const p1 = activeRoster[0] || currentUserName;
  const p2 = activeRoster[1] || (activeRoster.length > 1 ? activeRoster[1] : 'Partner');
  const p3 = activeRoster[2] || 'Camper 3';

  const normalized = (modeKey || 'SQUAD').toUpperCase();

  switch (normalized) {
    case 'RED_FLAG_COURT':
      return {
        badge: '⚖️ The Red Flag Courtroom · Party Trial',
        title: 'How The Courtroom Works',
        summary: 'A petty crime or red flag is brought to the bench. The jury hears the exhibit, examines the defendant, and casts a verdict: Guilty, Innocent, or Community Service!',
        sampleCard: {
          tag: 'Sample Case #204 · Kitchen Felony',
          question: `Defendant left an empty milk carton back in the fridge. How does the squad plead?`,
          options: ['Guilty: 20 Squats / Pushups', 'Innocent: There was 1 drop left', 'Sentence: Make Chai For All', 'Mistrial: We all did this'],
          correctIndex: 0,
        },
        scoringHint: '⚖️ Majority vote passes the binding squad sentence and earns 100+ Sparks!',
      };

    case 'CONFESSION_VAULT':
      return {
        badge: '🕵️ Anonymous Confession Vault · Secret Whodunit',
        title: 'How Confession Vault Works',
        summary: 'A spicy, funny, or chaotic secret appears on all screens completely anonymously. Everyone must guess which squad camper wrote it!',
        sampleCard: {
          tag: 'Sample Secret · 100% Anonymous',
          question: '“I once muted a work meeting to sing along full-volume to Choo Lo, not realizing my mic was on.”',
          options: [p1, p2, p3, 'A Mysterious Guest'],
          correctIndex: 1,
        },
        scoringHint: '🕵️ Guess the real culprit! Accurate detective votes earn 150 Sparks.',
      };

    case 'HOT_SEAT':
      return {
        badge: '🎯 Hot Seat Roulette · Deep & Unfiltered',
        title: 'How Hot Seat Roulette Works',
        summary: 'The wheel picks one camper for the hot seat. The squad fires an unfiltered dilemma. The hot seat camper has 30 seconds to answer or take a penalty!',
        sampleCard: {
          tag: 'Sample Round · Unfiltered Truth',
          question: '“If this squad was stuck on an island, who is the first person you would NOT trust to build the shelter?”',
          options: ['The Over-Confident Architect', 'The One Who Gets Tired in 5 Mins', 'The Group Chat Lurker', 'Take a Sip / Pass'],
          correctIndex: 0,
        },
        scoringHint: '🎯 30 seconds on the hot seat. No dodging, 100% real bonding!',
      };

    case 'MOST_LIKELY_TO':
      return {
        badge: '🎭 Most Likely To... · Savage Ballot',
        title: 'How Most Likely To Works',
        summary: 'A wild superlative appears on all screens simultaneously. Everyone votes for the squad member who fits the description best!',
        sampleCard: {
          tag: 'Sample Ballot · Group Chat Lore',
          question: 'Who is most likely to text "I\'m 5 mins away" while still in bed wrapped in a blanket?',
          options: [p1, p2, p3, 'The Whole Squad'],
          correctIndex: 0,
        },
        scoringHint: '⚡ Fastest matching votes earn combo multiplier fire and Sparks!',
      };

    case 'INSIDE_JOKES':
      return {
        badge: '🎙️ Inside Joke Mystery · Vault Flashback',
        title: 'How Inside Joke Mystery Works',
        summary: 'Memories, quotes, and funny inside jokes from your shared vault are turned into playable trivia rounds with real photos and voice notes.',
        sampleCard: {
          tag: 'Sample Round · Archive Flashback',
          question: '“Who said: \'Bro tension mat le, main sambhal loonga\' 5 minutes before absolute disaster?”',
          options: [p1, p2, p3, 'Nobody Admits It'],
          correctIndex: 0,
        },
        scoringHint: '🎙️ Guess the author or the trip date to unlock custom yearbook superlatives!',
      };

    case 'BOTTLE':
      return {
        badge: '🍾 Spin The Bottle · Party Arcade',
        title: 'How Spin The Bottle Works',
        summary: 'A digital 3D retro bottle spins with real physics synced across all phones and laptops. Whoever the bottle points to faces Truth, Dare, or Roast!',
        sampleCard: {
          tag: 'Sample Spin · The Living Room Bottle',
          question: 'The bottle stopped on you! Choose your fate:',
          options: ['Confess your most embarrassing search query', 'Do your best 10s impression of the host', 'Show your last 3 camera roll photos'],
          correctIndex: 0,
        },
        scoringHint: '🍾 Real-time synced physics across all devices. Zero bots, pure laughter!',
      };

    case 'NHIE':
      return {
        badge: '🍷 Never Have I Ever · 5 Fingers Up',
        title: 'How Never Have I Ever Works',
        summary: 'Everyone holds up 5 fingers. When a prompt applies to you, tap \'I Have\' to drop a finger and take a sip! Last camper standing wins.',
        sampleCard: {
          tag: 'Sample Statement · 5 Fingers Up',
          question: 'Never Have I Ever re-gifted a birthday present to someone in this very friend group.',
          options: ['I Have (Drop 1 Finger 🍷)', 'Never In My Life 😇'],
          correctIndex: 0,
        },
        scoringHint: '🍷 Clean, unfiltered, synced live across all phones in the room.',
      };

    case 'US':
    case 'COUPLE':
      return {
        badge: '❤️ Us Mode · Couples Date Night',
        title: 'How Couples Date Night Works',
        summary: 'Answer personalized questions about your relationship lore. Lock in your choices privately to see if your answers match when revealed!',
        sampleCard: {
          tag: 'Sample Memory · Chapter 1: The Spark',
          question: 'Who takes longer to pack their bags before a weekend getaway?',
          options: [p1, p2],
          correctIndex: 1,
        },
        scoringHint: '❤️ Matching answers unlock Compatibility Sparks and unseal secret vault notes!',
      };

    case 'SOLO':
      return {
        badge: '🏆 Solo Mode · Memory Quest',
        title: 'How Solo Reflection Works',
        summary: 'Journey through your personal memory archives, past adventures, and daily reflection prompts at your own pace.',
        sampleCard: {
          tag: 'Sample Prompt · Time Capsule 2024',
          question: 'What was your single most spontaneous trip or decision this past year?',
          options: ['Midnight Road Trip', 'Surprise Concert', 'New Career Pivot', 'Random Weekend Stay'],
          correctIndex: 0,
        },
        scoringHint: '🏆 Complete daily prompts to level up your Citizen tier and unlock custom yearbook covers!',
      };

    case 'ARCADE':
      return {
        badge: '🕹️ Retro Pixel Glade · Arcade Party',
        title: 'How Pixel Arcade Works',
        summary: 'Multiplayer party spinners, rapid buzzers, and retro mini-games synced with zero latency across all devices.',
        sampleCard: {
          tag: 'Sample Game · Speed Buzzer',
          question: 'Rapid Fire: Tap your buzzer the instant you hear the campfire chime!',
          options: ['Buzzer 1 (Ready)', 'Buzzer 2 (Locked In)'],
          correctIndex: 0,
        },
        scoringHint: '🎉 Tap the buzzer first to win bonus combo multipliers!',
      };

    default:
      return {
        badge: '🔥 Squad Party Mode · Real-time Multiplayer',
        title: customTitle || 'How Squad Games Work',
        summary: 'Questions and dilemma cards appear on all connected screens at the exact same moment. Lock in your choice before the timer expires!',
        sampleCard: {
          tag: 'Sample Round · Living Room Trial',
          question: 'Who is most likely to check their phone 40 times during a movie and then ask "Wait what happened?"',
          options: [p1, p2, p3, 'The Whole Squad'],
          correctIndex: 0,
        },
        scoringHint: '⚡ Fastest matching votes earn 100+ Sparks and combo multiplier fire!',
      };
  }
}

export const MODE_EXAMPLES = getExampleForMode;

const COUNTDOWN_STEPS = [
  {
    num: '5',
    sub: 'GET READY',
    bgColor: '#7209B7', // Deep Electric Violet
    textColor: '#E0AAFF',
    accentColor: '#C77DFF',
    desc: 'Connect all campers',
  },
  {
    num: '4',
    sub: 'SCREENS SYNCED',
    bgColor: '#06D6A0', // Cyan / Cyber Aqua / Mint #06D6A0
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
    bgColor: '#F72585', // Hot Flame Rose
    textColor: '#FFFFFF',
    accentColor: '#FF70A6',
    desc: 'Game starting now!',
  },
];

/**
 * Triggers the full game start sequence:
 * 1. Shows "How It Works" visual card with rules, sample question & normal 5s timer
 * 2. Runs the 5-4-3-2-1 center-to-corner expanding circular shockwave countdown covering 100% of screen
 * 3. Calls onComplete() to load active game screen
 */
export function triggerGameCountdown({ mode = 'SQUAD', title, onComplete, skipExample = false }) {
  const mount = document.getElementById('countdown-mount') || document.body;
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  const exampleData = getExampleForMode(mode, title);

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
 * Stage 1: How It Works Visual Card with Normal Timer & Interactive Choices
 */
function renderExampleStage(overlay, exampleData, customTitle, onComplete) {
  let secondsRemaining = 5;
  const totalSeconds = 5;
  let timerInterval = null;

  overlay.innerHTML = `
    <div class="relative w-full max-w-lg mx-4 p-5 sm:p-7 rounded-3xl bg-surface border-2 border-amber-gold/50 shadow-2xl flex flex-col gap-4 text-on-surface transform transition-all duration-300 animate-countdown-punch select-none">
      <!-- Ambient Glow Behind Card -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-sunset-coral/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Top Header & Timer Row -->
      <div class="flex items-center justify-between gap-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-[10.5px] font-bold font-mono uppercase tracking-wide">
          <span class="material-symbols-outlined text-[14px]">tips_and_updates</span>
          <span>${exampleData.badge}</span>
        </div>
        
        <!-- Normal Countdown Timer Pill -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-bright border border-border text-xs font-mono font-bold text-white shrink-0">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span>Starts in <strong id="example-timer-count" class="text-sunset-coral font-black">${secondsRemaining}s</strong></span>
        </div>
      </div>

      <!-- Normal Linear Progress Bar on Example -->
      <div class="w-full bg-surface-bright/80 rounded-full h-1.5 overflow-hidden border border-border/80">
        <div id="example-timer-bar" class="h-full bg-gradient-to-r from-sunset-coral via-amber-gold to-duo-rose transition-all duration-1000 ease-linear rounded-full" style="width: 100%;"></div>
      </div>

      <!-- Title & Summary -->
      <div>
        <h2 class="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
          ${customTitle || exampleData.title}
        </h2>
        <p class="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
          ${exampleData.summary}
        </p>
      </div>

      <!-- Interactive Sample Card Demo -->
      <div class="p-3.5 sm:p-4 rounded-2xl bg-canvas border border-border/80 flex flex-col gap-2.5">
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
        <div class="grid grid-cols-2 gap-2 pt-1" id="example-options-grid">
          ${exampleData.sampleCard.options.map((opt, idx) => `
            <button type="button" class="btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${idx === exampleData.sampleCard.correctIndex ? 'bg-sunset-coral/20 border-sunset-coral text-white font-bold shadow-sm' : 'bg-surface-bright/60 border-border/60 text-gray-300 hover:bg-surface-bright'}" data-index="${idx}">
              <span class="truncate">${opt}</span>
              ${idx === exampleData.sampleCard.correctIndex ? '<span class="material-symbols-outlined text-[14px] text-sunset-coral shrink-0">check_circle</span>' : ''}
            </button>
          `).join('')}
        </div>
        <div class="text-[10.5px] font-mono text-gray-400 flex items-center gap-1 pt-1">
          <span class="material-symbols-outlined text-amber-gold text-[14px] shrink-0">electric_bolt</span>
          <span class="truncate">${exampleData.scoringHint}</span>
        </div>
      </div>

      <!-- Footer & Action Controls -->
      <div class="flex items-center justify-between pt-1">
        <span class="text-[10px] font-mono text-gray-400">Normal timer auto-advances to fullscreen countdown</span>
        <button id="btn-skip-example" type="button" class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-black text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
          <span>Skip &amp; Start Now</span>
          <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;

  const countEl = document.getElementById('example-timer-count');
  const barEl = document.getElementById('example-timer-bar');
  const skipBtn = document.getElementById('btn-skip-example');

  // Allow clicking sample choices interactively
  const optionBtns = overlay.querySelectorAll('.btn-sample-option');
  optionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      optionBtns.forEach((b) => {
        b.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-surface-bright/60 border-border/60 text-gray-300';
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.remove();
      });
      btn.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-sunset-coral/20 border-sunset-coral text-white font-bold shadow-sm';
      btn.innerHTML = `<span class="truncate">${btn.textContent.trim()}</span><span class="material-symbols-outlined text-[14px] text-sunset-coral shrink-0">check_circle</span>`;
    });
  });

  const proceedToCountdown = () => {
    if (timerInterval) clearInterval(timerInterval);
    audio.playClick();
    runExpandingCircleCountdown(overlay, onComplete);
  };

  if (skipBtn) skipBtn.addEventListener('click', proceedToCountdown);

  timerInterval = setInterval(() => {
    secondsRemaining--;
    if (countEl) countEl.textContent = `${secondsRemaining}s`;
    if (barEl) {
      const pct = Math.max(0, (secondsRemaining / totalSeconds) * 100);
      barEl.style.width = `${pct}%`;
    }
    audio.playTick();
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      runExpandingCircleCountdown(overlay, onComplete);
    }
  }, 1000);
}

/**
 * Stage 2: Fullscreen 5-4-3-2-1 Center-to-Corner Expanding Circular Shockwave Countdown
 * Expands in a circle from center (50%, 50%) until it covers 100% of all screens in 5 distinct colors.
 */
function runExpandingCircleCountdown(overlay, onComplete) {
  audio.playChime();
  let stepIndex = 0;

  // Clear overlay and convert to 100% fullscreen layer
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
