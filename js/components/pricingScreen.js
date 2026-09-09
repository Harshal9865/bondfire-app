// ==============================================================================
// PRICING & SUBSCRIPTION EXPERIENCE COMPONENT
// Complete tier breakdown, comparison matrix, annual savings toggle & demo checkout
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openPaymentModal } from './demoPaymentModal.js';

let isAnnualBilling = true;

export function renderPricingScreen() {
  const state = store.getState();
  const user = state.currentUser || {};
  const currentTier = user.tier || 'PRO';

  const proPrice = isAnnualBilling ? '$3.75' : '$4.99';
  const proSubtext = isAnnualBilling ? 'billed annually ($45/yr)' : 'billed monthly';

  return `
    <div class="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32 select-none text-on-surface">
      
      <!-- Top Ambient Glows -->
      <div class="absolute top-10 left-1/3 w-[500px] h-[500px] bg-sunset-coral/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div class="absolute top-40 right-10 w-[450px] h-[450px] bg-amber-gold/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <!-- Header & Value Proposition -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-amber-gold mb-3">
          <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
          <span>Zero Per-Seat Taxes · One Pod Covers Everyone</span>
        </div>
        <h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
          Fair, transparent pricing for <span class="bg-clip-text text-transparent bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold">tight-knit groups.</span>
        </h1>
        <p class="text-base text-gray-300">
          Your friends will never be asked to pay to join your games. One host subscription unlocks infinite memory archiving and 4K AI roasts for the entire squad.
        </p>

        <!-- Monthly vs Annual Billing Toggle -->
        <div class="inline-flex items-center gap-3 p-1.5 bg-surface rounded-full border border-border mt-8 shadow-inner">
          <button type="button" id="btn-billing-monthly" class="px-5 py-2 rounded-full text-xs font-bold transition-all ${!isAnnualBilling ? 'bg-surface-bright text-white shadow-sm border border-border' : 'text-gray-400 hover:text-white'}">
            Monthly Billing
          </button>
          <button type="button" id="btn-billing-annual" class="px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnualBilling ? 'bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas shadow-glow-coral' : 'text-gray-400 hover:text-white'}">
            <span>Annual (Save 25%)</span>
            <span class="text-[10px] bg-canvas/30 px-1.5 py-0.5 rounded-full font-extrabold uppercase">PROMO</span>
          </button>
        </div>
      </div>

      <!-- 3 Tier Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
        
        <!-- Card 1: Free Spark -->
        <div class="bg-surface rounded-3xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-display text-lg font-bold text-gray-300">Free Spark</span>
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-bright text-gray-400 border border-border">Starter</span>
            </div>
            <p class="text-xs text-gray-400 mb-6">Perfect for trying out casual party game nights with standard memories.</p>
            
            <div class="flex items-baseline gap-1.5 mb-6">
              <span class="font-display text-4xl font-bold text-white">$0</span>
              <span class="text-xs text-gray-400">/ forever free</span>
            </div>

            <div class="flex flex-col gap-3 text-xs text-gray-300 mb-8 border-t border-border/70 pt-6">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-mint-green">check</span>
                <span>1 Active Pod Room</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-mint-green">check</span>
                <span>Up to 8 players per room</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-mint-green">check</span>
                <span>100 memories cloud storage</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-mint-green">check</span>
                <span>Standard AI trivia generator</span>
              </div>
              <div class="flex items-center gap-2.5 text-gray-500">
                <span class="material-symbols-outlined text-[16px]">close</span>
                <span class="line-through">4K video highlight reels</span>
              </div>
              <div class="flex items-center gap-2.5 text-gray-500">
                <span class="material-symbols-outlined text-[16px]">close</span>
                <span class="line-through">Hardcover yearbook discounts</span>
              </div>
            </div>
          </div>

          <button type="button" id="btn-select-free" class="w-full py-3 rounded-full bg-surface-bright hover:bg-surface-container-high text-gray-300 hover:text-white font-bold text-xs transition-colors border border-border">
            ${currentTier === 'FREE' ? '✓ Current Plan' : 'Select Free Spark'}
          </button>
        </div>

        <!-- Card 2: Pod Pro (Featured Hero Card) -->
        <div class="relative rounded-3xl p-[2px] bg-gradient-to-b from-sunset-coral via-amber-gold to-duo-rose shadow-[0_12px_40px_rgba(255,90,95,0.35)] flex flex-col justify-between">
          <div class="h-full bg-surface-container-low rounded-[22px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-sunset-coral/20 blur-3xl pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="font-display text-lg font-bold text-white flex items-center gap-1.5">
                  <span>Pod Pro</span>
                  <span class="material-symbols-outlined text-amber-gold text-[18px]">bolt</span>
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40">Most Loved</span>
              </div>
              <p class="text-xs text-gray-300 mb-6">Unlimited games and archival magic for everyone in your entire group.</p>
              
              <div class="flex items-baseline gap-1.5 mb-1">
                <span class="font-display text-4xl font-bold text-white">${proPrice}</span>
                <span class="text-xs text-gray-400">/ mo</span>
              </div>
              <span class="text-[11px] text-amber-gold font-mono block mb-6">${proSubtext}</span>

              <div class="flex flex-col gap-3 text-xs text-gray-200 mb-8 border-t border-border/70 pt-6">
                <div class="flex items-center gap-2.5 font-bold text-white">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>Unlimited Pod Rooms & Squads</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>Up to 30 players per room</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>Infinite Cloudflare R2 Vault</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>Custom AI Roast Prompts (from OCR)</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>Full 4K digital video recap reels</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-sunset-coral">check_circle</span>
                  <span>20% off physical hardcover yearbooks</span>
                </div>
              </div>
            </div>

            <button type="button" id="btn-upgrade-pro" class="w-full py-3.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center justify-center gap-2">
              <span>${currentTier === 'PRO' ? '✓ Pro Membership Active · Upgrade / Renew' : 'Upgrade to Pod Pro (7-Day Trial)'}</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Card 3: Campfire Lifetime -->
        <div class="bg-surface rounded-3xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-display text-lg font-bold text-gray-300">Campfire Lifetime</span>
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">Collector</span>
            </div>
            <p class="text-xs text-gray-400 mb-6">Pay once, own it forever. Includes a physical laser-engraved memory keepsake.</p>
            
            <div class="flex items-baseline gap-1.5 mb-1">
              <span class="font-display text-4xl font-bold text-white">$49</span>
              <span class="text-xs text-gray-400">/ one-time</span>
            </div>
            <span class="text-[11px] text-mint-green font-mono block mb-6">Zero recurring subscriptions ever</span>

            <div class="flex flex-col gap-3 text-xs text-gray-300 mb-8 border-t border-border/70 pt-6">
              <div class="flex items-center gap-2.5 font-semibold text-white">
                <span class="material-symbols-outlined text-[16px] text-amber-gold">verified</span>
                <span>Everything in Pod Pro Forever</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-amber-gold">verified</span>
                <span>Physical laser-engraved wooden memory box</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-amber-gold">verified</span>
                <span>Lifetime VIP citizen badge in arcade</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-amber-gold">verified</span>
                <span>Early access to all upcoming pixel minigames</span>
              </div>
            </div>
          </div>

          <button type="button" id="btn-claim-lifetime" class="w-full py-3 rounded-full bg-surface-bright hover:bg-amber-gold hover:text-canvas text-gray-200 font-bold text-xs transition-colors border border-border">
            Claim Lifetime Edition
          </button>
        </div>

      </div>

      <!-- Feature Comparison Matrix -->
      <div class="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xl mb-16">
        <h3 class="font-display text-xl font-bold text-white mb-6">Full Capabilities Matrix</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr class="border-b border-border/80 text-gray-400 uppercase font-mono">
                <th class="py-3 px-4">Feature</th>
                <th class="py-3 px-4">Free Spark</th>
                <th class="py-3 px-4 text-sunset-coral font-bold">Pod Pro</th>
                <th class="py-3 px-4 text-amber-gold font-bold">Campfire Lifetime</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60 text-gray-300">
              <tr>
                <td class="py-3 px-4 font-semibold text-white">Maximum Pods / Squads</td>
                <td class="py-3 px-4">1 Pod</td>
                <td class="py-3 px-4 text-mint-green font-bold">Unlimited</td>
                <td class="py-3 px-4 text-mint-green font-bold">Unlimited</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-semibold text-white">Cloudflare R2 Memory Vault</td>
                <td class="py-3 px-4">100 Items</td>
                <td class="py-3 px-4 text-mint-green font-bold">Infinite Storage</td>
                <td class="py-3 px-4 text-mint-green font-bold">Infinite Storage</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-semibold text-white">AI Roast Generation Engine</td>
                <td class="py-3 px-4">Standard Trivia</td>
                <td class="py-3 px-4 text-mint-green font-bold">Gemini 1.5 Custom OCR</td>
                <td class="py-3 px-4 text-mint-green font-bold">Gemini 1.5 Custom OCR</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-semibold text-white">Physical Hardcover Book Discount</td>
                <td class="py-3 px-4">Standard Price ($39)</td>
                <td class="py-3 px-4 text-mint-green font-bold">20% Off Volume Bundle</td>
                <td class="py-3 px-4 text-mint-green font-bold">20% Off + Free Engraved Box</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-semibold text-white">Zero AI Training Guarantee</td>
                <td class="py-3 px-4 text-mint-green">Included</td>
                <td class="py-3 px-4 text-mint-green">Included</td>
                <td class="py-3 px-4 text-mint-green">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Frequently Asked Questions -->
      <div class="max-w-2xl mx-auto">
        <h3 class="font-display text-2xl font-bold text-white text-center mb-6">Frequently Asked Questions</h3>
        <div class="flex flex-col gap-4">
          <div class="p-4 rounded-2xl bg-surface border border-border/70">
            <h4 class="font-bold text-white text-sm mb-1">Do my friends need to pay to play?</h4>
            <p class="text-xs text-gray-400">Never. Only the host of the room needs a Pod Pro subscription for the entire game room to get 4K reels, custom roasts, and infinite photo archiving.</p>
          </div>
          <div class="p-4 rounded-2xl bg-surface border border-border/70">
            <h4 class="font-bold text-white text-sm mb-1">Can I cancel anytime?</h4>
            <p class="text-xs text-gray-400">Yes! Cancel anytime with 1 click in your Citizen Profile. You will keep all Pro features until the end of your billing cycle.</p>
          </div>
          <div class="p-4 rounded-2xl bg-surface border border-border/70">
            <h4 class="font-bold text-white text-sm mb-1">How does physical yearbook printing work?</h4>
            <p class="text-xs text-gray-400">We partner with archival photo printers to dropship real 8.5x11 hardcover books directly to each squad member's address in 48 hours.</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function bindPricingEvents() {
  const monthlyBtn = document.getElementById('btn-billing-monthly');
  const annualBtn = document.getElementById('btn-billing-annual');

  if (monthlyBtn && annualBtn) {
    monthlyBtn.addEventListener('click', () => {
      audio.playClick();
      isAnnualBilling = false;
      store.setView('PRICING');
    });

    annualBtn.addEventListener('click', () => {
      audio.playClick();
      isAnnualBilling = true;
      store.setView('PRICING');
    });
  }

  // Free Tier CTA
  const freeBtn = document.getElementById('btn-select-free');
  if (freeBtn) {
    freeBtn.addEventListener('click', () => {
      audio.playClick();
      store.setUserTier('FREE');
      store.setView('PROFILE');
    });
  }

  // Pod Pro CTA
  const proBtn = document.getElementById('btn-upgrade-pro');
  if (proBtn) {
    proBtn.addEventListener('click', () => {
      audio.playChime();
      openPaymentModal({
        item: isAnnualBilling ? 'Pod Pro Annual Subscription' : 'Pod Pro Monthly Subscription',
        price: isAnnualBilling ? 45.00 : 4.99,
        originalPrice: isAnnualBilling ? 60.00 : 6.99,
        discountText: isAnnualBilling ? '25% Annual Squad Discount Applied' : '7-Day Free Trial Included',
        tier: 'PRO',
      });
    });
  }

  // Lifetime CTA
  const lifetimeBtn = document.getElementById('btn-claim-lifetime');
  if (lifetimeBtn) {
    lifetimeBtn.addEventListener('click', () => {
      audio.playChime();
      openPaymentModal({
        item: 'Campfire Lifetime Edition & Engraved Keepsake Box',
        price: 49.00,
        originalPrice: 99.00,
        discountText: 'Founding Member Special (50% Off Lifetime)',
        tier: 'LIFETIME',
      });
    });
  }
}
