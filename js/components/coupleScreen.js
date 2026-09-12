// ==============================================================================
// COUPLES "US MODE" COMPONENT (Screen 3)
// Intimate Date Night Quizzes, 3D Then vs Now Polaroids, and Whisper Notes
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

let currentQuizIndex = 0;
let isFlippedThen = false;
let isFlippedNow = false;

const DATE_NIGHT_QUESTIONS = [
  {
    round: 1,
    title: 'The First Spark',
    question: 'According to your memory archives: Who suggested the first weekend getaway?',
    clue: 'Sent on a Tuesday afternoon with “PACK YOUR BAGS NOW”.',
    p1Quote: '“I booked the Airbnb!”',
    p2Quote: '“I sent the reel first!”',
  },
  {
    round: 2,
    title: 'Airport Routine',
    question: 'Who takes longer to finish packing their bags before a flight?',
    clue: 'Usually involves 4 outfit changes 20 minutes before the cab arrives.',
    p1Quote: '“I’m packed 2 days early.”',
    p2Quote: '“I’m curating the aesthetic!”',
  },
  {
    round: 3,
    title: 'Movie Night Drift',
    question: 'Who is more likely to fall asleep first during a late-night movie marathon?',
    clue: 'Asleep 18 minutes into the opening credits with popcorn in hand.',
    p1Quote: '“I was just resting my eyes!”',
    p2Quote: '“You were asleep by minute 10.”',
  },
  {
    round: 4,
    title: 'Spontaneous Souvenirs',
    question: 'Who is more likely to buy a totally random souvenir on vacation?',
    clue: 'Found in a quirky boutique in the middle of nowhere.',
    p1Quote: '“It matches our vibe!”',
    p2Quote: '“We had zero luggage space!”',
  },
];

function getPartnerTwoName() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bondfire_partner_name') || store.getState().partnerName || 'Partner';
    }
  } catch (e) {
    // Fallback if security restrictions or node environment
  }
  return store.getState().partnerName || 'Partner';
}

function showToast(msg, type = 'mint') {
  const mount = document.getElementById('toast-mount');
  if (mount) {
    mount.innerHTML = `<div class="toast toast-${type} show"><span>${msg}</span></div>`;
    setTimeout(() => {
      if (mount.innerHTML.includes(msg)) mount.innerHTML = '';
    }, 3000);
  }
}

export function renderCoupleScreen() {
  const user = store.getState().currentUser;
  const partnerOne = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
  const partnerTwo = getPartnerTwoName();
  const currentQuiz = DATE_NIGHT_QUESTIONS[currentQuizIndex % DATE_NIGHT_QUESTIONS.length];

  return `
    <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-6 pb-28 gap-5 relative overflow-hidden select-none text-on-surface">
      <!-- Atmospheric Warm Ambient Radiance -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-sunset-coral/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-[380px] -right-20 w-64 h-64 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Header Bar with Dynamic Partner Customization -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface-container/90 border border-border/80 shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-sunset-coral/20 flex items-center justify-center shrink-0 border border-sunset-coral/30">
            <span class="material-symbols-outlined text-sunset-coral text-[20px]">favorite</span>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="font-headline-sm text-base sm:text-lg text-on-surface truncate font-bold" id="couple-display-names">${partnerOne} & ${partnerTwo}</span>
              <button type="button" id="btn-edit-partner-name" class="p-1 rounded-md hover:bg-surface-bright text-gray-400 hover:text-amber-gold transition-colors shrink-0" title="Edit Partner's Name">
                <span class="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>
            <span class="font-caption text-xs text-amber-gold tracking-wide uppercase truncate font-semibold">Private Date Night Space</span>
          </div>
        </div>

        <button class="px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center gap-2 border border-border transition-colors cursor-pointer shrink-0" id="btn-couple-header-book" type="button">
          <span class="flex items-center gap-1 text-xs text-gray-300 font-bold"><span class="material-symbols-outlined text-[15px] text-amber-gold">auto_stories</span><span>Yearbook</span></span>
          <span class="retro-pixel-badge text-[10px] text-amber-gold bg-surface-container-lowest px-2 py-0.5 rounded-full border border-amber-gold/30">Us</span>
        </button>
      </div>

      <!-- Status / Welcome Banner Micro Pill -->
      <div class="flex items-center justify-between pt-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border/60 shadow-sm">
          <span class="inline-block w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
          <span class="text-[11px] text-gray-300 font-bold tracking-wide uppercase">DATE NIGHT SESSION · SYNCED</span>
        </div>
        <div class="flex items-center gap-1 text-sunset-coral text-xs font-bold">
          <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
          <span>Sparks Synced</span>
        </div>
      </div>

      <!-- Section 2: Activity Card — "Then vs. Now" 3D Flippable Comparison -->
      <div class="relative bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sunset-coral/20 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[18px]">history_toggle_off</span>
            </div>
            <div>
              <span class="text-[11px] text-sunset-coral tracking-wider uppercase block font-bold">Memories in Motion</span>
              <h2 class="font-headline-sm text-base sm:text-lg text-white font-bold">Then & Now</h2>
            </div>
          </div>
          <span class="retro-pixel-badge px-2.5 py-1 rounded-full bg-surface-container-highest text-gray-300 text-[10px] font-bold border border-border/60 flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">flip</span><span>Tap to Flip</span></span>
        </div>

        <!-- Polaroids Side-by-Side Comparison Frame with 3D Flip Effects -->
        <div class="relative grid grid-cols-2 gap-3 pt-1 pb-4">
          <!-- THEN Polaroid -->
          <div class="cursor-pointer select-none group perspective-1000" id="polaroid-then-container">
            <div class="relative w-full transition-transform duration-500 transform-style-preserve-3d ${isFlippedThen ? 'rotate-y-180' : ''}" id="polaroid-then-card">
              <!-- Front Side -->
              <div class="flex flex-col bg-surface-container-lowest p-2.5 rounded-xl shadow-lg -rotate-2 group-hover:rotate-0 transition-transform duration-300 border border-border/60 backface-hidden">
                <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-container-low">
                  <img alt="First Date" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBAZjDOFfkY3uw8REHWAnIP-EpEiEX_5MyMu5cG4ri203TWUMqOgrN0dkElQPekfV88SscKr2Cc8L1rTlY98Etx7d6rtv4WdnY9N8-qne1LvQKNkwX1MPs5z3GIFuLMU2tvQ27sfaMDehnGhunkVsQQrUe_8JY7RLye7YpL19s656kE1gjwYxo1POndKWiLwRfPteikA0YnX8nsPYcZAPUHi5Vfkor__iiwu91YlIpCLmjfgkBQlNPw" />
                  <div class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-sm">
                    <span class="text-[10px] text-gray-300 font-bold">THEN</span>
                  </div>
                </div>
                <div class="pt-2 pb-0.5 px-0.5 text-center">
                  <p class="text-[11px] leading-tight text-white truncate font-bold flex items-center justify-center gap-1"><span>Our First Date</span><span class="material-symbols-outlined text-[12px] text-rose-glow">favorite</span></p>
                  <span class="text-[10px] text-gray-400 truncate block">Luna Cafe · Chapter 1</span>
                </div>
              </div>

              <!-- Back Side (Voice Note & Handwritten Memory) -->
              <div class="absolute inset-0 bg-surface-container-low border border-amber-gold/60 p-3 rounded-xl shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden text-left">
                <div>
                  <div class="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2">
                    <span class="retro-pixel-badge text-[9.5px] font-bold text-amber-gold flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">mic</span><span>Audio Note</span></span>
                    <span class="text-[10px] font-mono text-gray-400">0:24</span>
                  </div>
                  <p class="text-xs text-gray-200 italic leading-snug">“Remember how lost we got looking for the cafe? Best accidental detour ever.”</p>
                </div>
                <div class="text-[10px] text-right text-sunset-coral font-bold">— ${partnerTwo}</div>
              </div>
            </div>
          </div>

          <!-- NOW Polaroid -->
          <div class="cursor-pointer select-none group perspective-1000" id="polaroid-now-container">
            <div class="relative w-full transition-transform duration-500 transform-style-preserve-3d ${isFlippedNow ? 'rotate-y-180' : ''}" id="polaroid-now-card">
              <!-- Front Side -->
              <div class="flex flex-col bg-surface-container-lowest p-2.5 rounded-xl shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-300 border border-border/60 backface-hidden">
                <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-container-low">
                  <img alt="Anniversary" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbdskeB9-x7VTC_x4Eh5OzAJhbq002sRw_y2tkvl5BxE6boB8GajZxZqXf88gZKuC08DFwBbIPLyCq9aZFX43FLOcx5cS29RI_bTS7WuaMK4ROTbMWrsuM3NohQb_BieEUfWVaBpBO5xH9TDzRKVw01Z6KD2ODGRxKh6oKE39qMkZq_1bMrQ5a3dBA1BZBsAMEAp0Ok85IkHoMlguL--fsoxF-3w7QPdo-8jcjz55pk0RqCNmIhJBHBQ" />
                  <div class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-sm">
                    <span class="text-[10px] text-mint-green font-bold">NOW</span>
                  </div>
                </div>
                <div class="pt-2 pb-0.5 px-0.5 text-center">
                  <p class="text-[11px] leading-tight text-white truncate font-bold flex items-center justify-center gap-1"><span>Recent Adventures</span><span class="material-symbols-outlined text-[12px] text-rose-glow">favorite</span></p>
                  <span class="text-[10px] text-gray-400 truncate block">Mountain Getaway</span>
                </div>
              </div>

              <!-- Back Side (Voice Note & Handwritten Memory) -->
              <div class="absolute inset-0 bg-surface-container-low border border-mint-green/60 p-3 rounded-xl shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden text-left">
                <div>
                  <div class="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2">
                    <span class="retro-pixel-badge text-[9.5px] font-bold text-mint-green flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">mic</span><span>Voice Note</span></span>
                    <span class="text-[10px] font-mono text-gray-400">0:31</span>
                  </div>
                  <p class="text-xs text-gray-200 italic leading-snug">“Three years in and you still let me pick all the road trip music. Here’s to many more.”</p>
                </div>
                <div class="text-[10px] text-right text-amber-gold font-bold">— ${partnerOne}</div>
              </div>
            </div>
          </div>

          <!-- Overlapping Milestone Badge -->
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            <div class="px-4 py-1.5 rounded-full bg-surface-bright text-white shadow-md flex items-center gap-1.5 border border-sunset-coral/50">
              <span class="material-symbols-outlined text-sunset-coral text-[16px]">favorite</span>
              <span class="text-xs font-bold tracking-tight">Our Journey In Photos</span>
            </div>
          </div>
        </div>

        <div class="pt-1 text-center">
          <span class="text-xs text-gray-400 font-mono">Tap either polaroid to reveal the voice note & handwritten memory</span>
        </div>
      </div>

      <!-- Section 3: Active Couple Date Night Quiz -->
      <div class="bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-4 relative">
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">
            <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span class="retro-pixel-badge text-[10px]">Round ${currentQuiz.round}/${DATE_NIGHT_QUESTIONS.length} · ${currentQuiz.title}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button type="button" id="btn-quiz-prev" class="p-1.5 rounded-lg bg-surface hover:bg-surface-bright text-gray-400 hover:text-white border border-border text-xs flex items-center justify-center" title="Previous Question">
              <span class="material-symbols-outlined text-[14px]">arrow_back</span>
            </button>
            <button type="button" id="btn-quiz-next" class="p-1.5 rounded-lg bg-surface hover:bg-surface-bright text-gray-400 hover:text-white border border-border text-xs flex items-center justify-center" title="Next Question">
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="font-headline-sm text-base sm:text-lg text-white font-bold" id="couple-quiz-question">
            ${currentQuiz.question}
          </h3>
          <p class="text-xs text-gray-400">Lock in your answers together to unlock compatibility sparks.</p>
        </div>

        <!-- Interactive Options -->
        <div class="flex flex-col gap-2.5" id="couple-quiz-options">
          <!-- Option 1: Partner One -->
          <button class="couple-quiz-btn group w-full min-h-[58px] p-3 rounded-2xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-between text-left border border-border" data-choice="${partnerOne}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-sunset-coral/30 flex items-center justify-center shrink-0 text-sunset-coral font-bold text-[16px] border border-sunset-coral/40">
                ${partnerOne.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs text-sunset-coral font-bold">${partnerOne}</span>
                <span class="text-xs text-gray-300 truncate">${currentQuiz.p1Quote}</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-gray-500">
              <span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
            </div>
          </button>

          <!-- Option 2: Partner Two -->
          <button class="couple-quiz-btn group w-full min-h-[58px] p-3 rounded-2xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-between text-left border border-border" data-choice="${partnerTwo}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-amber-gold/30 flex items-center justify-center shrink-0 text-amber-gold font-bold text-[16px] border border-amber-gold/40">
                ${partnerTwo.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs text-amber-gold font-bold">${partnerTwo}</span>
                <span class="text-xs text-gray-300 truncate">${currentQuiz.p2Quote}</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-gray-500">
              <span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
            </div>
          </button>
        </div>

        <!-- Playful Clue Pill -->
        <div class="p-2.5 rounded-xl bg-surface-container-lowest flex items-center gap-2 border border-border">
          <span class="material-symbols-outlined text-amber-gold text-[20px] shrink-0">mark_chat_read</span>
          <span class="text-xs text-gray-300 flex-1">
            <strong class="text-amber-gold font-bold">Clue:</strong> <span id="couple-quiz-clue">${currentQuiz.clue}</span>
          </span>
          <span class="material-symbols-outlined text-gray-500 text-[16px] shrink-0">lock</span>
        </div>
      </div>

      <!-- Section 4: "Whisper Note" (Affection Prompt) -->
      <div class="relative bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80 flex flex-col gap-3 overflow-hidden">
        <div class="absolute -right-8 -top-8 w-28 h-28 bg-sunset-coral/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sunset-coral/20 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <h3 class="font-headline-sm text-base text-white font-bold">Secret Whisper Note</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral text-[11px] font-bold border border-sunset-coral/30">Tonight's Seal</span>
        </div>
        <p class="text-xs text-gray-300">
          Quick prompt: What's one little thing <span class="text-amber-gold font-semibold">${partnerTwo}</span> did recently that made you smile quietly?
        </p>

        <!-- Sealed Letter Note Area -->
        <div class="relative rounded-xl bg-surface-container-lowest p-3.5 flex flex-col gap-2 shadow-inner border border-border">
          <div class="flex items-center justify-between text-gray-400 text-xs">
            <span class="uppercase tracking-wider flex items-center gap-1 font-bold text-[10px]">
              <span class="material-symbols-outlined text-[13px]">drafts</span> From ${partnerOne}'s heart
            </span>
            <span class="text-sunset-coral flex items-center gap-0.5 font-bold text-[10px]">
              <span class="material-symbols-outlined text-[13px]">lock</span> Encrypted Vault Note
            </span>
          </div>
          <textarea id="whisper-input" class="w-full bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus:outline-none resize-none" placeholder="Write your quiet note (sealed into your private vault)..." rows="3"></textarea>
          <div class="flex items-center justify-between pt-1 border-t border-border/40">
            <div class="flex items-center gap-1 text-amber-gold text-xs">
              <span class="material-symbols-outlined text-[16px]">lock_clock</span>
              <span class="text-[11px]">Seals with custom digital wax</span>
            </div>
            <button class="px-4 py-1.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs active:scale-95 transition-transform flex items-center gap-1 shadow" id="btn-seal-whisper" type="button">
              <span>Seal Note</span>
              <span class="material-symbols-outlined text-[14px]">done_all</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Partner Name Edit Modal -->
      <div id="partner-edit-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" style="display: none;">
        <div class="relative w-full max-w-sm bg-surface-container-low border border-sunset-coral/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
          <div class="flex justify-between items-center pb-2 border-b border-border/80">
            <h4 class="text-sm font-bold text-sunset-coral flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sunset-coral text-[16px]">favorite</span>
              <span>Set Partner's Name</span>
            </h4>
            <button type="button" id="btn-close-partner-modal" class="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white"><span class="material-symbols-outlined text-[15px]">close</span></button>
          </div>
          <div>
            <label class="text-[11px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Partner Name or Nickname</label>
            <input type="text" id="partner-name-input" value="${partnerTwo === 'Partner' ? '' : partnerTwo}" placeholder="e.g. Maya, Alex, Sarah" class="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-sunset-coral" />
          </div>
          <button type="button" id="btn-save-partner-name" class="w-full py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs hover:brightness-110 active:scale-95 transition-transform">
            Save Partner Name
          </button>
        </div>
      </div>

      <!-- Bottom Floating Action Bar -->
      <aside class="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl border-t border-border/80">
        <div class="max-w-[640px] mx-auto flex items-center justify-between gap-3">
          <button class="h-11 px-4 rounded-full bg-surface-container-high hover:bg-surface-bright text-white flex items-center gap-2 active:scale-95 transition-all shrink-0 border border-border text-xs font-bold" id="btn-couple-view-book" type="button">
            <span class="material-symbols-outlined text-amber-gold text-[18px]">auto_stories</span>
            <span>Us Album</span>
          </button>
          <button class="flex-1 h-11 px-5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:brightness-110" id="btn-couple-next-memory" type="button">
            <span>Next Round (${(currentQuizIndex % DATE_NIGHT_QUESTIONS.length) + 1}/${DATE_NIGHT_QUESTIONS.length})</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  `;
}

export function bindCoupleEvents() {
  // Flip Polaroid card handlers
  const polThenCard = document.getElementById('polaroid-then-card');
  const polNowCard = document.getElementById('polaroid-now-card');

  const polThenContainer = document.getElementById('polaroid-then-container');
  const polNowContainer = document.getElementById('polaroid-now-container');

  if (polThenContainer && polThenCard) {
    polThenContainer.addEventListener('click', () => {
      audio.playChime();
      isFlippedThen = !isFlippedThen;
      polThenCard.classList.toggle('rotate-y-180', isFlippedThen);
      const partnerTwo = getPartnerTwoName();
      showToast(`Playing ${partnerTwo}'s audio note from Luna Cafe...`, 'amber');
    });
  }

  if (polNowContainer && polNowCard) {
    polNowContainer.addEventListener('click', () => {
      audio.playChime();
      isFlippedNow = !isFlippedNow;
      polNowCard.classList.toggle('rotate-y-180', isFlippedNow);
      showToast('Playing your anniversary voice note...', 'mint');
    });
  }

  // Partner Name Edit Modal Logic
  const editPartnerBtn = document.getElementById('btn-edit-partner-name');
  const partnerModal = document.getElementById('partner-edit-modal');
  const closePartnerModalBtn = document.getElementById('btn-close-partner-modal');
  const savePartnerNameBtn = document.getElementById('btn-save-partner-name');
  const partnerInput = document.getElementById('partner-name-input');

  if (editPartnerBtn && partnerModal) {
    editPartnerBtn.addEventListener('click', () => {
      audio.playClick();
      partnerModal.style.display = 'flex';
      if (partnerInput) partnerInput.focus();
    });
  }

  if (closePartnerModalBtn && partnerModal) {
    closePartnerModalBtn.addEventListener('click', () => {
      audio.playClick();
      partnerModal.style.display = 'none';
    });
  }

  if (savePartnerNameBtn && partnerModal && partnerInput) {
    savePartnerNameBtn.addEventListener('click', () => {
      const newName = partnerInput.value.trim();
      if (newName) {
        audio.playCorrect();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('bondfire_partner_name', newName);
        }
        store.setState({ partnerName: newName });
        partnerModal.style.display = 'none';
        showToast(`Partner name saved as "${newName}"!`, 'mint');
        // Re-render
        store.setView('COUPLE');
      }
    });
  }

  // Couple Quiz Option Selection
  const quizBtns = document.querySelectorAll('.couple-quiz-btn');
  quizBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      quizBtns.forEach((b) => {
        b.classList.remove('border-amber-gold', 'bg-amber-gold/20');
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'radio_button_unchecked';
      });
      btn.classList.add('border-amber-gold', 'bg-amber-gold/20');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'check_circle';

      store.addSparks(50);
      showToast('Answer Locked! Both awarded +50 Sparks!', 'mint');
    });
  });

  // Quiz Navigation Buttons (Next / Prev)
  const nextQuizBtn = document.getElementById('btn-quiz-next');
  const prevQuizBtn = document.getElementById('btn-quiz-prev');
  const nextMemBtn = document.getElementById('btn-couple-next-memory');

  const advanceQuiz = () => {
    audio.playClick();
    currentQuizIndex = (currentQuizIndex + 1) % DATE_NIGHT_QUESTIONS.length;
    store.setView('COUPLE');
  };

  const prevQuiz = () => {
    audio.playClick();
    currentQuizIndex = (currentQuizIndex - 1 + DATE_NIGHT_QUESTIONS.length) % DATE_NIGHT_QUESTIONS.length;
    store.setView('COUPLE');
  };

  if (nextQuizBtn) nextQuizBtn.addEventListener('click', advanceQuiz);
  if (prevQuizBtn) prevQuizBtn.addEventListener('click', prevQuiz);
  if (nextMemBtn) nextMemBtn.addEventListener('click', advanceQuiz);

  // Seal Whisper Note
  const sealBtn = document.getElementById('btn-seal-whisper');
  const whisperInput = document.getElementById('whisper-input');
  if (sealBtn && whisperInput) {
    sealBtn.addEventListener('click', () => {
      const note = whisperInput.value.trim();
      if (!note) {
        showToast('Please write your whisper note first', 'amber');
        return;
      }

      audio.playCorrect();
      store.addSparks(30);

      const partnerOne = store.getState().currentUser?.displayName?.split(' ')[0] || 'You';
      const partnerTwo = getPartnerTwoName();

      const newWhisperMem = {
        id: `whisper_${Date.now()}`,
        type: 'NOTE',
        title: `Whisper from ${partnerOne} to ${partnerTwo}`,
        snippet: note,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: partnerOne,
        tags: ['Us Mode', 'Whisper Note', 'Couples', 'Private']
      };

      const currentMemories = store.getState().vaultMemories || [];
      store.setState({ vaultMemories: [newWhisperMem, ...currentMemories] });

      sealBtn.innerHTML = '<span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-xs">lock</span><span>Sealed</span></span>';
      whisperInput.value = '';
      whisperInput.placeholder = 'Sealed with digital wax stamp! (+30 Sparks)';
      whisperInput.disabled = true;
      showToast('Secret whisper note sealed into your Vault!', 'mint');
    });
  }

  // View Book Handlers
  const viewBookBtn = document.getElementById('btn-couple-view-book');
  const headerBookBtn = document.getElementById('btn-couple-header-book');

  const goToYearbook = () => {
    audio.playClick();
    store.setView('YEARBOOK');
  };

  if (viewBookBtn) viewBookBtn.addEventListener('click', goToYearbook);
  if (headerBookBtn) headerBookBtn.addEventListener('click', goToYearbook);
}
