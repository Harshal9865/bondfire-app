// ==============================================================================
// COUPLES "US MODE" COMPONENT (Screen 3)
// Intimate Date Night Quizzes, Then vs Now Polaroids, and Whisper Notes
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export function renderCoupleScreen() {
  const user = store.getState().currentUser;
  const partnerOne = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
  const partnerTwo = 'Partner';

  return `
    <div class="flex flex-col w-full max-w-[620px] mx-auto px-4 pt-6 pb-28 gap-5 relative overflow-hidden select-none text-on-surface">
      <!-- Atmospheric Warm Ambient Radiance -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-container/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-[380px] -right-20 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Header Bar -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface-container/90 border border-border/80 shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 border border-primary-container/30">
            <span class="material-symbols-outlined text-primary-container text-[20px]">favorite</span>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="font-headline-sm text-headline-sm text-on-surface truncate font-bold">${partnerOne} & ${partnerTwo}</span>
              <span class="material-symbols-outlined text-primary text-[14px] shrink-0">favorite</span>
            </div>
            <span class="font-caption text-caption text-secondary tracking-wide uppercase truncate font-semibold">3 Years, 4 Months</span>
          </div>
        </div>

        <button class="px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center gap-2 border border-border transition-colors cursor-pointer" id="btn-couple-header-book" type="button">
          <span class="font-label-md text-label-md text-secondary font-bold">Book 📖</span>
          <span class="font-caption text-caption text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-mono">68%</span>
        </button>
      </div>

      <!-- Status / Welcome Banner Micro Pill -->
      <div class="flex items-center justify-between pt-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border/60 shadow-sm">
          <span class="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span class="font-caption text-caption text-secondary font-bold tracking-wide">DATE NIGHT SESSION · SYNCED</span>
        </div>
        <div class="flex items-center gap-1 text-primary-container font-label-md text-label-md font-bold">
          <span class="material-symbols-outlined text-[16px]">mode_heat</span>
          <span>Streak: 12 Weeks</span>
        </div>
      </div>

      <!-- Section 2: Activity Card — "Then vs. Now" Comparison -->
      <div class="relative bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container">
              <span class="material-symbols-outlined text-[18px]">history_toggle_off</span>
            </div>
            <div>
              <span class="font-label-md text-caption text-primary tracking-wider uppercase block font-bold">Memories in Motion</span>
              <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Then & Now</h2>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-surface-container-highest text-secondary font-caption text-caption font-bold border border-border/60">Chapter 14</span>
        </div>

        <!-- Polaroids Side-by-Side Comparison Frame -->
        <div class="relative grid grid-cols-2 gap-3 pt-1 pb-4">
          <!-- THEN Polaroid (Tilted Left) -->
          <div class="flex flex-col bg-surface-container-lowest p-2.5 rounded-xl shadow-lg -rotate-2 hover:rotate-0 transition-transform duration-300 border border-border/60 cursor-pointer" id="polaroid-then">
            <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-container-low">
              <img alt="First Date - July 2021" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBAZjDOFfkY3uw8REHWAnIP-EpEiEX_5MyMu5cG4ri203TWUMqOgrN0dkElQPekfV88SscKr2Cc8L1rTlY98Etx7d6rtv4WdnY9N8-qne1LvQKNkwX1MPs5z3GIFuLMU2tvQ27sfaMDehnGhunkVsQQrUe_8JY7RLye7YpL19s656kE1gjwYxo1POndKWiLwRfPteikA0YnX8nsPYcZAPUHi5Vfkor__iiwu91YlIpCLmjfgkBQlNPw" />
              <div class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-sm">
                <span class="font-caption text-caption text-secondary font-bold">2021</span>
              </div>
            </div>
            <div class="pt-2 pb-0.5 px-0.5 text-center">
              <p class="font-label-md text-[11px] leading-tight text-on-surface truncate font-bold">Our First Date ♡</p>
              <span class="font-caption text-[10px] text-outline truncate block">Luna Cafe · July 2021</span>
            </div>
          </div>

          <!-- NOW Polaroid (Tilted Right) -->
          <div class="flex flex-col bg-surface-container-lowest p-2.5 rounded-xl shadow-lg rotate-2 hover:rotate-0 transition-transform duration-300 border border-border/60 cursor-pointer" id="polaroid-now">
            <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-container-low">
              <img alt="3 Year Anniversary - Dolomite Peaks, 2024" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbdskeB9-x7VTC_x4Eh5OzAJhbq002sRw_y2tkvl5BxE6boB8GajZxZqXf88gZKuC08DFwBbIPLyCq9aZFX43FLOcx5cS29RI_bTS7WuaMK4ROTbMWrsuM3NohQb_BieEUfWVaBpBO5xH9TDzRKVw01Z6KD2ODGRxKh6oKE39qMkZq_1bMrQ5a3dBA1BZBsAMEAp0Ok85IkHoMlguL--fsoxF-3w7QPdo-8jcjz55pk0RqCNmIhJBHBQ" />
              <div class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-sm">
                <span class="font-caption text-caption text-tertiary font-bold">2024</span>
              </div>
            </div>
            <div class="pt-2 pb-0.5 px-0.5 text-center">
              <p class="font-label-md text-[11px] leading-tight text-on-surface truncate font-bold">3 Year Anniversary ♡</p>
              <span class="font-caption text-[10px] text-outline truncate block">Dolomite Peaks · 2024</span>
            </div>
          </div>

          <!-- Overlapping Milestone Badge -->
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            <div class="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container shadow-md flex items-center gap-1.5 border border-secondary">
              <span class="material-symbols-outlined text-[16px]">favorite</span>
              <span class="font-label-md text-label-md font-bold tracking-tight">1,142 Days Together</span>
            </div>
          </div>
        </div>

        <div class="pt-1 text-center">
          <span class="font-caption text-caption text-outline">Tap any polaroid to flip and reveal Arjun's voice note 🎙️</span>
        </div>
      </div>

      <!-- Section 3: Active Couple Micro-Quiz -->
      <div class="bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-4 relative">
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary-container border border-primary-container/30">
            <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span class="font-label-md text-caption uppercase tracking-wider font-bold">Date Night Quiz · Round 1</span>
          </div>
          <div class="flex items-center gap-1 font-caption text-caption text-secondary font-bold">
            <span class="material-symbols-outlined text-[14px]">timer</span>
            <span>No Rush Mode</span>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">
            According to your chats from 2022: Who suggested the first weekend getaway?
          </h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Lock in your answer together to unlock the throwback screenshot.</p>
        </div>

        <!-- Interactive Options -->
        <div class="flex flex-col gap-2" id="quiz-options">
          <!-- Option 1: Partner One -->
          <button class="couple-quiz-btn group w-full min-h-[58px] p-3 rounded-2xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-between text-left border border-border" data-choice="${partnerOne}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary font-headline-sm text-[16px] font-bold">
                ${partnerOne.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-label-md text-label-md text-primary font-bold">${partnerOne}</span>
                <span class="font-body-sm text-body-sm text-on-surface truncate">“I booked the Airbnb!”</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-outline">
              <span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
            </div>
          </button>

          <!-- Option 2: Partner Two (Active / Selected State) -->
          <button class="couple-quiz-btn w-full min-h-[58px] p-3 rounded-2xl bg-secondary-container/20 border border-secondary shadow-[0px_8px_24px_-4px_rgba(255,183,3,0.25)] active:scale-[0.98] transition-all flex items-center justify-between text-left" data-choice="${partnerTwo}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container font-headline-sm text-[16px] font-bold">
                ${partnerTwo.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-label-md text-label-md text-secondary font-bold">${partnerTwo}</span>
                  <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-caption text-[10px] font-bold">Voted</span>
                </div>
                <span class="font-body-sm text-body-sm text-on-surface truncate">“I sent the reel first!”</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container shadow-sm font-bold">
              <span class="material-symbols-outlined text-[16px]">check</span>
            </div>
          </button>
        </div>

        <!-- Playful Clue Pill -->
        <div class="p-2.5 rounded-xl bg-surface-container-lowest flex items-center gap-2 border border-border">
          <span class="material-symbols-outlined text-secondary text-[20px] shrink-0">mark_chat_read</span>
          <span class="font-body-sm text-caption text-on-surface-variant flex-1">
            <strong class="text-secondary font-label-md font-bold">Clue:</strong> Sent on a Tuesday during work hours with “PACK YOUR BAGS”.
          </span>
          <span class="material-symbols-outlined text-outline text-[16px] shrink-0">lock</span>
        </div>
      </div>

      <!-- Section 4: "Whisper Note" (Affection Prompt) -->
      <div class="relative bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-3 overflow-hidden">
        <div class="absolute -right-8 -top-8 w-28 h-28 bg-primary-container/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-container">
              <span class="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Secret Whisper Note</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-caption text-caption font-bold border border-primary-container/30">Tonight's Seal</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant">
          Quick prompt: What's one little thing ${partnerTwo} did this week that made you smile quietly?
        </p>

        <!-- Sealed Letter Note Area -->
        <div class="relative rounded-xl bg-surface-container-lowest p-3.5 flex flex-col gap-2 shadow-inner border border-border">
          <div class="flex items-center justify-between text-outline text-xs">
            <span class="font-caption text-caption uppercase tracking-wider flex items-center gap-1 font-bold">
              <span class="material-symbols-outlined text-[13px]">drafts</span> From ${partnerOne}'s heart
            </span>
            <span class="font-caption text-caption text-primary flex items-center gap-0.5 font-bold">
              <span class="material-symbols-outlined text-[13px]">lock</span> Encrypted Capsule
            </span>
          </div>
          <textarea id="whisper-input" class="w-full bg-transparent border-none text-on-surface placeholder:text-outline/70 font-body-md text-body-md focus:outline-none resize-none" placeholder="Write your note (sealed until date night ends)..." rows="3"></textarea>
          <div class="flex items-center justify-between pt-1 border-t border-border/40">
            <div class="flex items-center gap-1 text-secondary text-xs">
              <span class="material-symbols-outlined text-[16px]">lock_clock</span>
              <span class="font-caption text-caption font-medium">Unlocks together at midnight</span>
            </div>
            <button class="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md active:scale-95 transition-transform flex items-center gap-1 font-bold shadow" id="btn-seal-whisper" type="button">
              <span>Seal Note</span>
              <span class="material-symbols-outlined text-[14px]">done_all</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Floating Action Bar -->
      <aside class="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl border-t border-border/80">
        <div class="max-w-[620px] mx-auto flex items-center justify-between gap-3">
          <button class="h-12 px-4 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center gap-2 active:scale-95 transition-all shrink-0 border border-border" id="btn-couple-view-book" type="button">
            <span class="material-symbols-outlined text-secondary text-[20px]">auto_stories</span>
            <span class="font-label-md text-label-md font-bold">Add to Book</span>
          </button>
          <button class="flex-1 h-12 px-6 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all font-bold hover:brightness-110" id="btn-couple-next-memory" type="button">
            <span>Next Memory</span>
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  `;
}

export function bindCoupleEvents() {
  // Flip Polaroid audio simulation
  const polThen = document.getElementById('polaroid-then');
  const polNow = document.getElementById('polaroid-now');

  const flipPolaroid = () => {
    audio.playChime();
    const toast = document.getElementById('toast-mount');
    if (toast) {
      toast.innerHTML = `<div class="toast toast-amber show"><span>🎙️ Playing Arjun's Audio Note: "Remember how lost we got looking for Luna Cafe?"</span></div>`;
      setTimeout(() => {
        toast.innerHTML = '';
      }, 3500);
    }
  };

  if (polThen) polThen.addEventListener('click', flipPolaroid);
  if (polNow) polNow.addEventListener('click', flipPolaroid);

  // Couple Quiz Click
  const quizBtns = document.querySelectorAll('.couple-quiz-btn');
  quizBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      quizBtns.forEach((b) => b.classList.remove('bg-secondary-container/20', 'border-secondary'));
      btn.classList.add('bg-secondary-container/20', 'border-secondary');
      const toast = document.getElementById('toast-mount');
      if (toast) {
        toast.innerHTML = `<div class="toast toast-mint show"><span>💖 Answer Locked! Both awarded +50 Sparks!</span></div>`;
        setTimeout(() => (toast.innerHTML = ''), 2500);
      }
    });
  });

  // Seal Whisper Note
  const sealBtn = document.getElementById('btn-seal-whisper');
  const whisperInput = document.getElementById('whisper-input');
  if (sealBtn && whisperInput) {
    sealBtn.addEventListener('click', () => {
      if (whisperInput.value.trim()) {
        audio.playCorrect();
        sealBtn.innerHTML = '<span>Sealed 🔒</span>';
        whisperInput.value = '';
        whisperInput.placeholder = 'Sealed with digital wax! Unlocks tonight at midnight.';
        whisperInput.disabled = true;
      }
    });
  }

  // View Book Handlers
  const viewBookBtn = document.getElementById('btn-couple-view-book');
  const headerBookBtn = document.getElementById('btn-couple-header-book');
  const nextMemBtn = document.getElementById('btn-couple-next-memory');

  const goToYearbook = () => {
    audio.playClick();
    store.setView('YEARBOOK');
  };

  if (viewBookBtn) viewBookBtn.addEventListener('click', goToYearbook);
  if (headerBookBtn) headerBookBtn.addEventListener('click', goToYearbook);
  if (nextMemBtn) nextMemBtn.addEventListener('click', goToYearbook);
}
