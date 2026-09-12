// ==============================================================================
// THE EMPORIUM COMPONENT (Physical Keepsakes, Pod Merch, 1-Click Split Checkout)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { openPaymentModal } from './demoPaymentModal.js';

let confettiInstance = null;

const PRODUCTS = [
  {
    id: 'deck-trivia',
    name: 'Custom Pod Trivia Deck',
    price: 28,
    category: 'CARD GAMES',
    badge: 'BESTSELLER',
    badgeColor: 'border-amber-gold/40 text-amber-gold bg-amber-gold/10',
    description: '100 premium linen-finish casino-grade cards customized with your inside jokes, nicknames, and scandalous roast questions.',
    icon: 'style',
    iconColor: 'text-amber-gold bg-amber-gold/15',
    specs: ['100 Custom Cards', 'Magnetic Clasp Box', 'Linen Textured Finish']
  },
  {
    id: 'layflat-book',
    name: 'Museum-Grade Layflat Photobook',
    price: 38,
    category: 'HARDCOVER ALBUMS',
    badge: 'SIGNATURE',
    badgeColor: 'border-sunset-coral/40 text-sunset-coral bg-sunset-coral/10',
    description: '48 seamless layflat pages bound in Italian Obsidian bookcloth with real hot foil stamped custom titles and MVP superlatives.',
    icon: 'auto_stories',
    iconColor: 'text-sunset-coral bg-sunset-coral/15',
    specs: ['48 Layflat Pages', 'Real Gold Foil Deboss', '240gsm Luster Stock']
  },
  {
    id: 'campfire-speaker',
    name: 'Campfire Bluetooth Parlor Speaker',
    price: 65,
    category: 'AUDIO HARDWARE',
    badge: 'LIMITED EDITION',
    badgeColor: 'border-duo-rose/40 text-duo-rose bg-duo-rose/10',
    description: 'Acoustic warm walnut cabinet speaker programmed to sync with game night buzzers and procedurally synthesized campfire lo-fi.',
    icon: 'speaker',
    iconColor: 'text-duo-rose bg-duo-rose/15',
    specs: ['Walnut Acoustic Body', '12-Hour Battery', 'Game Buzzer Sync']
  },
  {
    id: 'polaroid-pack',
    name: 'Vault Polaroid Sticker Pack',
    price: 14,
    category: 'PRINTS & STICKERS',
    badge: 'POD POPULAR',
    badgeColor: 'border-mint-green/40 text-mint-green bg-mint-green/10',
    description: '20 high-gloss mini polaroid prints automatically selected from your highest-rated Vault memory drops with waterproof finish.',
    icon: 'photo_library',
    iconColor: 'text-mint-green bg-mint-green/15',
    specs: ['20 Mini Polaroids', 'Waterproof Matte', 'Group Joke Captions']
  }
];

export function renderEmporiumScreen() {
  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto">
      
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-[#262B40]/70 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">shopping_bag</span>
            <span>THE EMPORIUM // PHYSICAL MERCH</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn memories into real-world keepsakes.
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 rounded-2xl bg-[#121522] border border-[#262B40] flex items-center gap-2">
            <span class="text-xs text-gray-400">Pod Split Option:</span>
            <span class="text-xs font-bold text-mint-green">Available on all items</span>
          </div>
        </div>
      </div>

      <!-- Product Catalog Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        ${PRODUCTS.map(product => `
          <div class="rounded-3xl bg-[#121522] border border-[#262B40] hover:border-sunset-coral/50 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 shadow-xl group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl ${product.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-[26px]">${product.icon}</span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${product.badgeColor}">
                  ${product.badge}
                </span>
              </div>

              <div class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">${product.category}</div>
              <h3 class="font-display text-lg font-bold text-white mb-2">${product.name}</h3>
              <p class="text-gray-400 text-xs leading-relaxed font-sans mb-4">${product.description}</p>

              <!-- Specs -->
              <div class="space-y-1.5 mb-6">
                ${product.specs.map(spec => `
                  <div class="flex items-center gap-1.5 text-[11px] text-gray-300 font-mono">
                    <span class="w-1 h-1 rounded-full bg-sunset-coral"></span>
                    <span>${spec}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Price & Buy Button -->
            <div class="pt-4 border-t border-[#262B40] flex items-center justify-between gap-3">
              <div>
                <span class="text-xs text-gray-400">Price</span>
                <div class="text-xl font-display font-extrabold text-white">$${product.price}</div>
              </div>
              <button class="btn-buy-product px-4 py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-sm hover:shadow-glow-coral transition-all active:scale-95 flex items-center gap-1.5" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                <span class="material-symbols-outlined text-[16px]">shopping_cart</span>
                <span>Order Now</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 1-Click Pod Split Info Box -->
      <div class="rounded-3xl bg-gradient-to-r from-[#181C2B] via-[#151928] to-[#181C2B] border border-[#2B3147] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div class="max-w-xl text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-green/15 border border-mint-green/30 text-mint-green text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">call_split</span>
            <span>POD SPLIT CHECKOUT</span>
          </div>
          <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Want to order for the entire group? Split it in 1 tap.
          </h3>
          <p class="text-gray-400 text-sm leading-relaxed font-sans">
            Bondfire automatically distributes a payment link to every member of your room. Once everyone confirms their shipping address, custom copies ship straight to their doorsteps.
          </p>
        </div>

        <button id="btn-split-pod-demo" class="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#202538] hover:bg-sunset-coral hover:text-white border border-[#363D5A] text-white font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 active:scale-95">
          <span class="material-symbols-outlined text-[18px]">share</span>
          <span>Generate Split Link</span>
        </button>
      </div>

    </div>
  `;
}

export function bindEmporiumEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Buy Product buttons
  const buyBtns = document.querySelectorAll('.btn-buy-product');
  buyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      openPaymentModal({
        name,
        price,
        tier: 'PHYSICAL_MERCH',
        description: `Custom Pod keepsake manufactured with your Vault memories.`
      });
    });
  });

  // Split Pod button
  const splitBtn = document.getElementById('btn-split-pod-demo');
  if (splitBtn) {
    splitBtn.addEventListener('click', () => {
      audio.playChime();
      confettiInstance.burst(40, 1);
      splitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] text-mint-green">done_all</span><span>Split Link Copied to Clipboard!</span>`;
      setTimeout(() => {
        splitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">share</span><span>Generate Split Link</span>`;
      }, 3000);
    });
  }
}
