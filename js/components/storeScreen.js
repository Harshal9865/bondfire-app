// ==============================================================================
// STORE & MONETIZATION HUB (Screen 7)
// The Emporium matching Google Stitch Warm Analog Cyber design
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openPaymentModal } from './demoPaymentModal.js';

export function renderStoreScreen() {
  return `
    <div class="flex flex-col w-full max-w-[780px] mx-auto px-4 py-6 pb-28 select-none text-on-surface">
      <!-- Sparks Balance & Subhead Bar -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">The Emporium</span>
          <span class="font-caption text-caption text-outline">Fuel your pod memories & keepsakes</span>
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-border shadow-inner">
          <span class="text-sm">✨</span>
          <span class="font-room-code text-body-sm font-bold text-secondary tracking-normal">1,200</span>
          <span class="font-caption text-caption text-secondary/80 font-bold uppercase tracking-wider">Sparks</span>
        </div>
      </div>

      <!-- Store Category Segmented Tabs -->
      <div class="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-full mb-6 border border-border/80 shadow-sm" id="store-category-tabs">
        <button class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-primary-container text-on-primary font-label-md text-caption font-bold transition-all active:scale-95 shadow-[0_2px_12px_rgba(255,90,95,0.4)]" type="button">
          <span class="text-xs">⭐</span>
          <span>Pod Pro</span>
        </button>
        <button class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-on-surface-variant font-label-md text-caption font-bold hover:text-on-surface transition-colors" type="button">
          <span class="text-xs">🎁</span>
          <span>Packs</span>
        </button>
        <button class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-on-surface-variant font-label-md text-caption font-bold hover:text-on-surface transition-colors" type="button">
          <span class="text-xs">📖</span>
          <span>Books</span>
        </button>
      </div>

      <!-- Featured Spotlight: Pod Pro Subscription -->
      <div class="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-secondary via-primary-container to-surface-container mb-8 shadow-[0_12px_36px_-6px_rgba(255,90,95,0.3)]">
        <div class="relative bg-surface-container-low rounded-[23px] p-6 sm:p-8 overflow-hidden flex flex-col border border-border">
          <div class="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-secondary/15 blur-2xl pointer-events-none"></div>

          <!-- Top Row Badges -->
          <div class="flex items-center justify-between mb-3 z-10">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-label-md text-caption font-bold border border-secondary/30">
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">bolt</span>
              <span>POD MEMBERSHIP</span>
            </div>
            <span class="font-label-md text-caption uppercase px-2 py-0.5 rounded-md bg-tertiary-container/30 text-tertiary font-bold tracking-wider">Most Loved</span>
          </div>

          <!-- Plan Title & Value Prop -->
          <h2 class="font-headline-md text-headline-md font-bold text-on-surface tracking-tight z-10 mb-1">
            Pod Pro · Infinite Vault
          </h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-4 z-10">
            One membership unlocks unlimited games and archival magic for everyone in the group.
          </p>

          <!-- Pricing Toggle Strip -->
          <div class="flex items-baseline gap-2 mb-5 z-10 bg-surface-container-lowest/70 p-3 rounded-2xl border border-border">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">$3.75</span>
            <span class="font-body-sm text-body-sm text-outline font-medium">/ mo per Pod</span>
            <div class="ml-auto px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-md text-caption font-bold border border-secondary/30">
              Save 25% yearly
            </div>
          </div>

          <!-- Feature Bullet Points -->
          <div class="flex flex-col gap-2.5 mb-6 z-10">
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <span class="font-body-sm text-body-sm text-on-surface">Unlimited photo, audio roast & voice note vault</span>
            </div>
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <span class="font-body-sm text-body-sm text-on-surface">Custom AI party games & unhinged roast prompts</span>
            </div>
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <span class="font-body-sm text-body-sm text-on-surface">Full 4K digital video recap reels after each round</span>
            </div>
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <span class="font-body-sm text-body-sm text-on-surface">20% off all physical hardcover keepsake books</span>
            </div>
          </div>

          <!-- Pod Pro CTA Button -->
          <button class="w-full py-3.5 px-6 rounded-full bg-primary-container text-on-primary font-headline-sm text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,90,95,0.45)] transition-all active:scale-[0.98] hover:brightness-110" id="podProCTA" type="button">
            <span>Upgrade "Goa Crew" (7-Day Trial)</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <span class="text-center font-caption text-caption text-outline mt-2">Auto-renews at $4.99/mo after trial. Cancel anytime.</span>
        </div>
      </div>

      <!-- Milestone Event Expansion Packs Section -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-[20px]">celebration</span>
          <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Milestone Game Packs</h3>
        </div>
        <span class="font-label-md text-caption text-primary cursor-pointer font-bold">View All (8)</span>
      </div>

      <!-- Horizontal Scroll Carousel for Packs -->
      <div class="flex gap-4 overflow-x-auto pb-3 pt-1 -mx-4 px-4 no-scrollbar snap-x snap-mandatory mb-8">
        <!-- Pack Card 1 -->
        <div class="snap-start shrink-0 w-[240px] bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-md border border-border relative overflow-hidden group">
          <div class="flex flex-col">
            <div class="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-surface-container-high">
              <img class="w-full h-full object-cover" alt="Nuptial Roast" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC09Mz9ioWGDN9q5KUEB8b5t00W0G7PnBcT2rXCjTioUq4grKE4nbA2kOVHXbomKRUN3TVPbjAbl6Q8mXSmVoSdvoqf9y-05UvlWjTI-nZGWL6W8wYondFF9zQ5vVw64sdMZGt4uTzHR9PpEGuvYTUMWZcvaVSVCjMrJu_33atJyYPppQstIDrwqNopg3dMcraY725CeuPPG8C4SdfocvLtmzMsBHohD-klsMkRM-ElxgMxgHDlHYlYhg" />
              <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm text-secondary font-room-code text-caption font-bold">50 CARDS</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="font-label-md text-caption text-primary font-bold">WEDDING ROAST</span>
              <span class="font-headline-sm text-body-sm font-bold text-on-surface">$9.99</span>
            </div>
            <h4 class="font-headline-sm text-body-md font-bold text-on-surface line-clamp-1 mb-1">The Nuptial Roast Pack</h4>
            <p class="font-body-sm text-caption text-outline line-clamp-2 mb-3">50 unfiltered memories & spicy prompts for bridal and bachelor squads.</p>
          </div>
          <button class="unlock-pack-btn w-full py-2 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-primary-container hover:text-on-primary transition-all active:scale-95 flex items-center justify-center gap-1 border border-border" data-pack="Nuptial Roast" type="button">
            <span>Unlock Pack</span>
            <span class="material-symbols-outlined text-[14px]">lock_open</span>
          </button>
        </div>

        <!-- Pack Card 2 -->
        <div class="snap-start shrink-0 w-[240px] bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-md border border-border relative overflow-hidden group">
          <div class="flex flex-col">
            <div class="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-surface-container-high">
              <img class="w-full h-full object-cover" alt="Dirty Thirty" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmAIX0ck3lwLkL6m6Bdtq8mLGbGKhFdfVwpLImBV6HGKmiC7EsyX_tpPxekZnpqi5ZO4ZX8O4t6AD46A80aM5lA0GjycYOLA3bZ5GvZSSL6OEWzgPbq1vgTL1Q-jY6UHdtg5EaYAEwylaUrKfW4Zmyk4rV06ioqZzz9kcWy0yqcVp9w13yEvlOaxfUa9Dcc2EWyML-RKtmdDrgdKldXIREBY3lc5JKifZrPkNRfzwj_9cGKY2qzv9SA" />
              <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm text-secondary font-room-code text-caption font-bold">DECADE RECAP</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="font-label-md text-caption text-secondary font-bold">30TH BIRTHDAY</span>
              <span class="font-headline-sm text-body-sm font-bold text-on-surface">$9.99</span>
            </div>
            <h4 class="font-headline-sm text-body-md font-bold text-on-surface line-clamp-1 mb-1">Dirty Thirty Edition</h4>
            <p class="font-body-sm text-caption text-outline line-clamp-2 mb-3">Relive the bad decisions, collegiate cringe, and early twenties lore.</p>
          </div>
          <button class="unlock-pack-btn w-full py-2 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-primary-container hover:text-on-primary transition-all active:scale-95 flex items-center justify-center gap-1 border border-border" data-pack="Dirty Thirty" type="button">
            <span>Unlock Pack</span>
            <span class="material-symbols-outlined text-[14px]">lock_open</span>
          </button>
        </div>

        <!-- Pack Card 3 -->
        <div class="snap-start shrink-0 w-[240px] bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-md border border-border relative overflow-hidden group">
          <div class="flex flex-col">
            <div class="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-surface-container-high">
              <img class="w-full h-full object-cover" alt="Anniversary Surprises" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrKWka9utpDMgXTqyT_Id96KWDHwDOzd2UTURiAEcg7nOBulVwgvSCIOX_pHToHaSLxbliTS9zeFvHzYyyV_WiYoXGxZloDeudMAPwG8_mjFOPKS2pkQC7OsodRm7-pfpzGFThEnQ0MQamiPHYoFjYv_6mYrMiLvvM-xmNcnk5t07KbWkFPXpLF0pOsGqMRFsqWReOEJUz_kx76k1DHhF8QssQ9HUdt4UgdLd9siZOk43nj8iSAoGYFg" />
              <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm text-tertiary font-room-code text-caption font-bold">ROMANCE</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="font-label-md text-caption text-tertiary font-bold">COUPLE DECK</span>
              <span class="font-headline-sm text-body-sm font-bold text-on-surface">$6.99</span>
            </div>
            <h4 class="font-headline-sm text-body-md font-bold text-on-surface line-clamp-1 mb-1">Anniversary Surprises</h4>
            <p class="font-body-sm text-caption text-outline line-clamp-2 mb-3">Vulnerability challenges, secret gratitude, and first-date recalls.</p>
          </div>
          <button class="unlock-pack-btn w-full py-2 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-primary-container hover:text-on-primary transition-all active:scale-95 flex items-center justify-center gap-1 border border-border" data-pack="Anniversary Surprises" type="button">
            <span>Unlock Pack</span>
            <span class="material-symbols-outlined text-[14px]">lock_open</span>
          </button>
        </div>
      </div>

      <!-- Physical Micro-Gifting: Memory Postcard Section -->
      <div class="flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">mark_email_unread</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Tangible Micro-Gifts</h3>
          </div>
          <span class="font-caption text-caption text-secondary uppercase font-bold tracking-wider">Fast Mail</span>
        </div>

        <div class="bg-surface-container-low rounded-3xl p-6 flex flex-col shadow-lg border border-border relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-center gap-4 mb-4 z-10">
            <!-- Tactile Polaroid Mini Canvas -->
            <div class="relative w-44 bg-surface-container-highest p-2 pb-5 rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.6)] rotate-[-2deg] transition-transform hover:rotate-0 shrink-0 border border-border">
              <div class="absolute top-1 right-1 w-6 h-7 rounded-sm bg-surface-container-lowest flex flex-col items-center justify-center shadow-inner">
                <span class="text-[8px]">🔥</span>
                <span class="text-[6px] font-room-code text-secondary font-bold">AIR</span>
              </div>
              <div class="w-full h-28 rounded bg-surface-container-lowest overflow-hidden mb-2 relative">
                <img class="w-full h-full object-cover" alt="Funniest Quote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1sLF--kOxRiyHBVD5f0LC6RD-S-h8ilwmk4Zh7jx7-pHSSU9t41BpJd9GWrmWk4EuphEowgfMQR4Mdn0VY5r368vqU-qbXqDq3ZhRa5MYxDBywgOBgdv34HCp8clhydcHBMdgs_8v5bCB4f1in_bY628d9CD0m7ERl9xwvwDkmrotEk3JXIbXdPr38u1KLAlXzkG7GMKeLFyIWSo--O-Hu7lmt6ZJOod-_AUV5pVr6rOOeMNAmau3HQ" />
                <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[8px] font-caption text-white">ROUND 04</div>
              </div>
              <p class="font-caption text-[11px] text-on-surface font-semibold text-center italic line-clamp-1 px-1 text-primary">
                "I swear that canoe was already sinking!"
              </p>
              <p class="text-[9px] text-outline text-center mt-0.5 font-caption">— Marco, 11:42 PM</p>
            </div>

            <!-- Description Copy -->
            <div class="flex flex-col text-center sm:text-left">
              <div class="inline-flex items-center justify-center sm:justify-start gap-1 mb-1">
                <span class="font-label-md text-caption text-secondary font-bold uppercase tracking-wider">Physical Polaroid Dispatch</span>
              </div>
              <h4 class="font-headline-sm text-body-lg font-bold text-on-surface mb-1">Send Tonight’s Funniest Quote</h4>
              <p class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                We print today’s highlight photo & quote onto real Fuji heavy-stock and mail it directly to their doorstep in 48 hours.
              </p>
              <div class="mt-2 flex items-center justify-center sm:justify-start gap-2">
                <span class="font-headline-sm text-body-md font-bold text-on-surface">$2.99</span>
                <span class="font-caption text-caption text-outline">including worldwide postage</span>
              </div>
            </div>
          </div>

          <!-- Micro-Gift Action Button -->
          <button class="w-full py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(251,180,0,0.35)] transition-all active:scale-98 z-10 hover:brightness-110" id="sendPostcardBtn" type="button">
            <span>Send Surprise Postcard</span>
            <span>💌</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindStoreEvents() {
  const triggerToast = (message) => {
    audio.playCorrect();
    const toastMount = document.getElementById('toast-mount');
    if (toastMount) {
      toastMount.innerHTML = `<div class="toast toast-mint show"><span>${message}</span></div>`;
      setTimeout(() => (toastMount.innerHTML = ''), 2600);
    }
  };

  const podProBtn = document.getElementById('podProCTA');
  if (podProBtn) {
    podProBtn.addEventListener('click', () => {
      audio.playChime();
      openPaymentModal({
        item: 'Pod Pro Annual Subscription',
        price: 45.00,
        originalPrice: 60.00,
        discountText: '25% Annual Pod Savings Applied',
        tier: 'PRO',
      });
    });
  }

  const postcardBtn = document.getElementById('sendPostcardBtn');
  if (postcardBtn) {
    postcardBtn.addEventListener('click', () => {
      audio.playChime();
      openPaymentModal({
        item: 'Surprise Fuji Polaroid Postcard (Worldwide Delivery)',
        price: 2.99,
        originalPrice: 4.99,
        discountText: 'Includes Archival Fuji Heavy-Stock & Postage',
        tier: 'PRO',
      });
    });
  }

  const packBtns = document.querySelectorAll('.unlock-pack-btn');
  packBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const packName = btn.dataset.pack;
      triggerToast(`Unlocked "${packName}" deck for tonight! 🃏`);
      btn.textContent = '✓ Unlocked';
      btn.classList.add('bg-mint-green/20', 'text-mint-green', 'border-mint-green');
    });
  });
}
