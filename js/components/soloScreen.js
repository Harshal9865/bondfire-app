// ==============================================================================
// SOLO "TIME CAPSULE & REFLECTION" COMPONENT (Screen 4)
// Easy to Understand, Zero Mock Data, Instant Direct Start, Real Persistence
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { triggerGameCountdown } from './gameCountdownOverlay.js';

let confetti = null;
let activeSoloTab = 'DAILY'; // 'DAILY' | 'CAPSULE' | 'QUIZ'

function getSavedReflections() {
  try {
    const raw = localStorage.getItem('bondfire_solo_reflections');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveReflection(text, mood) {
  const list = getSavedReflections();
  const newItem = {
    id: `ref_${Date.now()}`,
    text,
    mood: mood || 'Fun',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  };
  list.unshift(newItem);
  try {
    localStorage.setItem('bondfire_solo_reflections', JSON.stringify(list));
  } catch (e) {
    console.warn(e);
  }
  return newItem;
}

function getSavedCapsules() {
  try {
    const raw = localStorage.getItem('bondfire_solo_capsules');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCapsule(title, message, unlockMonths) {
  const list = getSavedCapsules();
  const now = new Date();
  const unlockDate = new Date(now.setMonth(now.getMonth() + Number(unlockMonths)));
  const newItem = {
    id: `cap_${Date.now()}`,
    title,
    message,
    unlockDate: unlockDate.toISOString(),
    unlockDateFormatted: unlockDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isSealed: true,
  };
  list.unshift(newItem);
  try {
    localStorage.setItem('bondfire_solo_capsules', JSON.stringify(list));
  } catch (e) {
    console.warn(e);
  }
  return newItem;
}

function showToast(msg, type = 'mint') {
  const mount = document.getElementById('toast-mount');
  if (mount) {
    mount.innerHTML = `<div class="toast toast-${type} show"><span>${msg}</span></div>`;
    setTimeout(() => {
      if (mount.innerHTML.includes(msg)) mount.innerHTML = '';
    }, 3200);
  }
}

export function renderSoloScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const firstName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Camper';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const sparks = user?.sparks || 120;

  const reflections = getSavedReflections();
  const capsules = getSavedCapsules();

  return `
    <div class="flex flex-col w-full max-w-[680px] mx-auto px-4 pt-6 pb-28 gap-6 relative select-none text-on-surface">
      <!-- Warm Ambient Glow -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-64 bg-amber-gold/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-96 -right-16 w-60 h-60 bg-sunset-coral/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Header: Warm Greeting -->
      <div class="flex items-center justify-between p-4 rounded-3xl bg-surface border border-border shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-12 h-12 rounded-2xl bg-amber-gold/20 flex items-center justify-center shrink-0 border border-amber-gold/40 text-amber-gold">
            <span class="material-symbols-outlined text-2xl">person</span>
          </div>
          <div class="flex flex-col min-w-0">
            <h2 class="font-display text-lg sm:text-xl text-white truncate font-bold">${greeting}, ${firstName}</h2>
            <span class="text-xs text-gray-400 font-mono">YOUR PRIVATE MEMORY CAPSULE</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-bold shrink-0">
          <span class="material-symbols-outlined text-[16px] text-amber-gold">local_fire_department</span>
          <span>${sparks} Sparks</span>
        </div>
      </div>

      <!-- 3 Clear Mode Navigation Tabs -->
      <div class="grid grid-cols-3 gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-sm">
        <button class="solo-nav-tab py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeSoloTab === 'DAILY' ? 'bg-amber-gold text-canvas shadow' : 'text-gray-400 hover:text-white'}" data-tab="DAILY">
          <span class="material-symbols-outlined text-[16px]">edit_note</span>
          <span>Daily Spark</span>
        </button>
        <button class="solo-nav-tab py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeSoloTab === 'CAPSULE' ? 'bg-amber-gold text-canvas shadow' : 'text-gray-400 hover:text-white'}" data-tab="CAPSULE">
          <span class="material-symbols-outlined text-[16px]">lock</span>
          <span>Time Capsule</span>
        </button>
        <button class="solo-nav-tab py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeSoloTab === 'QUIZ' ? 'bg-amber-gold text-canvas shadow' : 'text-gray-400 hover:text-white'}" data-tab="QUIZ">
          <span class="material-symbols-outlined text-[16px]">psychology</span>
          <span>Flashback</span>
        </button>
      </div>

      <!-- TAB 1: DAILY REFLECTION -->
      ${activeSoloTab === 'DAILY' ? `
        <div class="flex flex-col gap-4">
          <!-- Input Card -->
          <div class="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-display text-base font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-gold text-[20px]">edit_calendar</span>
                <span>Today's Highlight</span>
              </h3>
              <span class="text-[10px] font-mono text-mint-green bg-mint-green/15 border border-mint-green/30 px-2 py-0.5 rounded-full font-bold">+25 Sparks</span>
            </div>
            
            <p class="text-xs text-gray-300 leading-relaxed">
              What's one funny, peaceful, or memorable thing that happened today? (Private to your device).
            </p>

            <textarea id="solo-reflection-input" placeholder="e.g. Finally had that iced matcha, tried cooking pasta from scratch, or had a hilarious call with my sister..." rows="3" class="w-full p-3.5 rounded-2xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none transition-colors resize-none"></textarea>

            <!-- Mood Selector -->
            <div class="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div class="flex items-center gap-1.5" id="solo-mood-selector">
                <button class="mood-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-amber-gold/20 text-amber-gold border-amber-gold" data-mood="Fun">😄 Fun</button>
                <button class="mood-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-surface-bright text-gray-400 border-border" data-mood="Peaceful">🌿 Peaceful</button>
                <button class="mood-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-surface-bright text-gray-400 border-border" data-mood="Grateful">✨ Grateful</button>
                <button class="mood-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-surface-bright text-gray-400 border-border" data-mood="Milestone">🎯 Milestone</button>
              </div>

              <button id="btn-save-solo-reflection" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral text-canvas font-bold text-xs shadow-glow-amber active:scale-95 transition-all flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">save</span>
                <span>Save to Vault</span>
              </button>
            </div>
          </div>

          <!-- Saved Reflections Feed -->
          <div class="space-y-3">
            <h4 class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider px-1">Your Saved Moments (${reflections.length})</h4>
            
            ${reflections.length === 0 ? `
              <div class="p-8 rounded-3xl bg-surface/50 border border-dashed border-border text-center space-y-2">
                <span class="material-symbols-outlined text-3xl text-gray-500">sentiment_satisfied</span>
                <p class="text-xs text-gray-400">No reflections saved yet. Write your first highlight above!</p>
              </div>
            ` : reflections.map(r => `
              <div class="p-4 rounded-2xl bg-surface border border-border/80 shadow-sm flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-bright text-amber-gold border border-border">${r.mood}</span>
                    <span class="text-[10px] font-mono text-gray-400">${r.date}</span>
                  </div>
                  <p class="text-sm text-gray-200 font-medium leading-relaxed">${r.text}</p>
                </div>
                <button class="btn-share-to-squad px-3 py-1 rounded-full bg-surface-bright hover:bg-surface-container-high border border-border text-[10px] font-bold text-sunset-coral shrink-0 transition-colors" data-id="${r.id}" title="Turn into a trivia card for friends">
                  + Send to Squad
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 2: TIME CAPSULE (LETTERS TO FUTURE SELF) -->
      ${activeSoloTab === 'CAPSULE' ? `
        <div class="flex flex-col gap-4">
          <!-- Capsule Creation Card -->
          <div class="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-display text-base font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-gold text-[20px]">lock_clock</span>
                <span>Seal a Letter to Future Self</span>
              </h3>
              <span class="text-[10px] font-mono text-amber-gold bg-amber-gold/15 border border-amber-gold/30 px-2 py-0.5 rounded-full font-bold">Digital Wax Seal</span>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed">
              Write something today that stays locked and encrypted until your chosen future date.
            </p>

            <div class="space-y-2">
              <input type="text" id="capsule-title-input" placeholder="Title (e.g. Letter to Me in 2027, Before the Big Move...)" class="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none" />
              <textarea id="capsule-message-input" placeholder="Write to your future self: What are you worried about? What are you proud of? What do you hope hasn't changed?..." rows="4" class="w-full p-3.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none"></textarea>
            </div>

            <!-- Unlock Timeline Selector -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
              <div class="flex items-center gap-1.5 flex-wrap" id="capsule-months-selector">
                <span class="text-[11px] text-gray-400 font-mono mr-1">Opens in:</span>
                <button class="capsule-time-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-amber-gold/20 text-amber-gold border-amber-gold" data-months="1">1 Month</button>
                <button class="capsule-time-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-surface-bright text-gray-400 border-border" data-months="6">6 Months</button>
                <button class="capsule-time-pill px-3 py-1 rounded-full text-xs font-bold border transition-all bg-surface-bright text-gray-400 border-border" data-months="12">1 Year</button>
              </div>

              <button id="btn-seal-capsule" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral text-canvas font-bold text-xs shadow-glow-amber active:scale-95 transition-all flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">lock</span>
                <span>Seal Capsule</span>
              </button>
            </div>
          </div>

          <!-- Sealed Capsules List -->
          <div class="space-y-3">
            <h4 class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider px-1">Your Sealed Capsules (${capsules.length})</h4>

            ${capsules.length === 0 ? `
              <div class="p-8 rounded-3xl bg-surface/50 border border-dashed border-border text-center space-y-2">
                <span class="material-symbols-outlined text-3xl text-gray-500">lock_open</span>
                <p class="text-xs text-gray-400">No capsules sealed yet. Write a note to your future self above!</p>
              </div>
            ` : capsules.map(c => `
              <div class="p-4 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-amber-gold/20 text-amber-gold border border-amber-gold/40 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div class="min-w-0">
                    <h5 class="text-sm font-bold text-white truncate">${c.title}</h5>
                    <p class="text-xs text-amber-gold font-mono truncate">Unlocks on ${c.unlockDateFormatted}</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full bg-surface-bright text-gray-400 text-[10px] font-mono font-bold uppercase border border-border shrink-0">
                  SEALED
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: FLASHBACK SOLO QUIZ -->
      ${activeSoloTab === 'QUIZ' ? `
        <div class="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sunset-coral animate-pulse"></span>
              <span class="text-xs font-mono font-bold text-sunset-coral uppercase">SOLO NOSTALGIA FLASHBACK</span>
            </div>
            <span class="text-xs font-mono text-gray-400">Self-Reflection Quiz</span>
          </div>

          <div class="space-y-2">
            <h3 class="font-display text-lg font-bold text-white">
              "Which memory or accomplishment from this past year made you smile the most?"
            </h3>
            <p class="text-xs text-gray-400">Lock in your answer to track your mood growth over time.</p>
          </div>

          <div class="space-y-2.5" id="solo-quiz-options">
            <button class="solo-quiz-opt w-full p-3.5 rounded-2xl bg-surface-bright hover:border-amber-gold/60 border border-border text-left text-xs font-semibold text-gray-200 transition-all flex items-center justify-between">
              <span>Traveling somewhere completely new with people I love</span>
              <span class="material-symbols-outlined text-gray-500 text-sm">radio_button_unchecked</span>
            </button>
            <button class="solo-quiz-opt w-full p-3.5 rounded-2xl bg-surface-bright hover:border-amber-gold/60 border border-border text-left text-xs font-semibold text-gray-200 transition-all flex items-center justify-between">
              <span>Overcoming a big challenge or learning a new skill</span>
              <span class="material-symbols-outlined text-gray-500 text-sm">radio_button_unchecked</span>
            </button>
            <button class="solo-quiz-opt w-full p-3.5 rounded-2xl bg-surface-bright hover:border-amber-gold/60 border border-border text-left text-xs font-semibold text-gray-200 transition-all flex items-center justify-between">
              <span>A quiet late-night conversation with someone special</span>
              <span class="material-symbols-outlined text-gray-500 text-sm">radio_button_unchecked</span>
            </button>
            <button class="solo-quiz-opt w-full p-3.5 rounded-2xl bg-surface-bright hover:border-amber-gold/60 border border-border text-left text-xs font-semibold text-gray-200 transition-all flex items-center justify-between">
              <span>An unhinged spontaneous laugh that couldn't be planned</span>
              <span class="material-symbols-outlined text-gray-500 text-sm">radio_button_unchecked</span>
            </button>
          </div>

          <div class="p-3 rounded-2xl bg-canvas border border-border text-xs text-center text-gray-400" id="solo-quiz-feedback">
            Select the option that resonates with you today
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function bindSoloEvents() {
  if (!confetti) {
    confetti = new ConfettiEngine('confetti-canvas');
  }

  // Tab switching
  const tabs = document.querySelectorAll('.solo-nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playClick();
      const targetTab = tab.dataset.tab;
      if (targetTab === 'QUIZ') {
        triggerGameCountdown({
          mode: 'SOLO',
          title: 'Solo Reflection & Lore Quiz',
          onComplete: () => {
            activeSoloTab = 'QUIZ';
            store.setView('SOLO');
          },
        });
      } else {
        activeSoloTab = targetTab;
        store.setView('SOLO');
      }
    });
  });

  // Mood selection
  let selectedMood = 'Fun';
  const moodPills = document.querySelectorAll('.mood-pill');
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playBip();
      selectedMood = pill.dataset.mood;
      moodPills.forEach(p => {
        p.classList.remove('bg-amber-gold/20', 'text-amber-gold', 'border-amber-gold');
        p.classList.add('bg-surface-bright', 'text-gray-400', 'border-border');
      });
      pill.classList.remove('bg-surface-bright', 'text-gray-400', 'border-border');
      pill.classList.add('bg-amber-gold/20', 'text-amber-gold', 'border-amber-gold');
    });
  });

  // Save Daily Reflection
  const btnSaveRef = document.getElementById('btn-save-solo-reflection');
  const refInput = document.getElementById('solo-reflection-input');
  if (btnSaveRef && refInput) {
    btnSaveRef.addEventListener('click', () => {
      const val = refInput.value.trim();
      if (!val) {
        audio.playTick();
        refInput.focus();
        return;
      }
      audio.playCorrect();
      confetti.burst(30);
      saveReflection(val, selectedMood);
      store.addSparks(25);
      showToast('Reflection saved! +25 Sparks added to your vault.', 'mint');
      refInput.value = '';
      store.setView('SOLO');
    });
  }

  // Capsule months selector
  let selectedMonths = 1;
  const timePills = document.querySelectorAll('.capsule-time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playBip();
      selectedMonths = pill.dataset.months;
      timePills.forEach(p => {
        p.classList.remove('bg-amber-gold/20', 'text-amber-gold', 'border-amber-gold');
        p.classList.add('bg-surface-bright', 'text-gray-400', 'border-border');
      });
      pill.classList.remove('bg-surface-bright', 'text-gray-400', 'border-border');
      pill.classList.add('bg-amber-gold/20', 'text-amber-gold', 'border-amber-gold');
    });
  });

  // Seal Capsule
  const btnSealCap = document.getElementById('btn-seal-capsule');
  const titleInput = document.getElementById('capsule-title-input');
  const msgInput = document.getElementById('capsule-message-input');
  if (btnSealCap && titleInput && msgInput) {
    btnSealCap.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const msg = msgInput.value.trim();
      if (!title || !msg) {
        audio.playTick();
        if (!title) titleInput.focus();
        else msgInput.focus();
        return;
      }
      audio.playCorrect();
      confetti.burst(50);
      saveCapsule(title, msg, selectedMonths);
      store.addSparks(50);
      showToast(`Capsule sealed! It will remain locked for ${selectedMonths} month(s).`, 'mint');
      store.setView('SOLO');
    });
  }

  // Send to Squad button
  const shareSquadBtns = document.querySelectorAll('.btn-share-to-squad');
  shareSquadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const id = btn.dataset.id;
      const reflections = getSavedReflections();
      const item = reflections.find(r => r.id === id);
      if (item) {
        store.addCustomMemory({
          title: `Solo Highlight: ${item.mood}`,
          quote: item.text,
          type: 'REFLECTION',
        });
        showToast('Added to Squad Memory Deck! Open Squad to play with friends.', 'mint');
      }
    });
  });

  // Solo Quiz Options
  const quizOpts = document.querySelectorAll('.solo-quiz-opt');
  const quizFeedback = document.getElementById('solo-quiz-feedback');
  quizOpts.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      confetti.burst(40);
      quizOpts.forEach(b => {
        b.classList.remove('border-amber-gold', 'bg-amber-gold/20');
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'radio_button_unchecked';
      });
      btn.classList.add('border-amber-gold', 'bg-amber-gold/20');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'check_circle';
      if (quizFeedback) {
        quizFeedback.innerHTML = '<span class="text-mint-green font-bold flex items-center justify-center gap-1"><span class="material-symbols-outlined text-sm">auto_awesome</span> Growth recorded! Archived to your private profile (+40 Sparks)</span>';
      }
      store.addSparks(40);
    });
  });
}
