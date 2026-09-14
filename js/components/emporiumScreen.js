// ==============================================================================
// THE REAL STORE & EMPORIUM COMPONENT
// Features:
// - Real "Campfire Sparks" wallet currency with live balance
// - Daily Claim (+100 Sparks) with celebratory confetti & audio
// - Instant Digital Perk Unlocks (Plasma Shaders, Gold Film, Lo-Fi Trackpack)
// - Real Physical Keepsakes Orders with Shipping Form & Live Tracking Receipts
// - "My Vault Inventory" tab showing owned perks and order shipment tracking
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;
let activeStoreTab = 'CATALOG'; // 'CATALOG' | 'VAULT'

const DIGITAL_PERKS = [
  {
    id: 'cyber_flame_plasma',
    name: 'Plasma Blue Flame Shader',
    costSparks: 300,
    category: 'CAMPFIRE SHADER',
    badge: 'EXCLUSIVE',
    description: 'Transform your central campfire into an electric neon cyan plasma fire with dancing energetic particle wisps.',
    icon: 'local_fire_department',
    iconColor: 'text-cyan-400 bg-cyan-400/15',
    type: 'DIGITAL'
  },
  {
    id: 'gold_polaroid_pack',
    name: '24k Gold Polaroid Film',
    costSparks: 250,
    category: 'PHOTOBOOK FX',
    badge: 'LUSTER',
    description: 'Enables genuine 24k gold foil leaf debossed borders on all memory uploads in the Photo Album Studio.',
    icon: 'auto_awesome',
    iconColor: 'text-amber-gold bg-amber-gold/15',
    type: 'DIGITAL'
  },
  {
    id: 'lofi_midnight_audio',
    name: 'Midnight Lo-Fi Audio Pack',
    costSparks: 200,
    category: 'JUKEBOX AUDIO',
    badge: 'POPULAR',
    description: 'Unlocks 3 procedural cozy vinyl tape campfire melodies in your personal Spotify and Campfire Jukebox.',
    icon: 'music_note',
    iconColor: 'text-rose-400 bg-rose-400/15',
    type: 'DIGITAL'
  },
  {
    id: 'cyber_nametag_holo',
    name: 'Cyber Hologram Nametag',
    costSparks: 150,
    category: 'PROFILE COSMETIC',
    badge: 'NEON',
    description: 'Displays a glowing cyberpunk hologram seal next to your name across all room chats and game scoreboards.',
    icon: 'badge',
    iconColor: 'text-mint-green bg-mint-green/15',
    type: 'DIGITAL'
  }
];

const PHYSICAL_PRODUCTS = [
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
  const state = store.getState();
  const sparks = typeof state.userSparks === 'number' ? state.userSparks : 750;
  const unlocked = state.unlockedPerks || ['cyber_flame_plasma'];
  const orders = state.orderHistory || [];

  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto select-none" id="emporium-root">
      
      <!-- Top Breadcrumb & Sparks Wallet HUD -->
      <div class="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-[#262B40]/70 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset-coral/15 border border-sunset-coral/30 text-sunset-coral text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">local_mall</span>
            <span>REAL STORE // CAMPFIRE SPARKS &amp; KEEPSAKES</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn memories into real-world keepsakes.
          </h1>
          <p class="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Earn sparks in arcade games &amp; photobook uploads to unlock rare campfire cosmetics.
          </p>
        </div>

        <!-- Sparks Wallet & Claim HUD -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="px-4 py-2.5 rounded-2xl bg-[#141826] border border-amber-gold/40 flex items-center gap-3 shadow-[0_0_20px_rgba(255,183,3,0.15)]">
            <div class="w-8 h-8 rounded-xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
              <span class="material-symbols-outlined text-[20px] animate-pulse">local_fire_department</span>
            </div>
            <div>
              <span class="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">YOUR BALANCE</span>
              <div class="text-lg font-display font-black text-amber-gold" id="wallet-sparks-display">${sparks} Sparks</div>
            </div>
          </div>

          <button id="btn-claim-sparks" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-gold to-sunset-coral text-dark font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">redeem</span>
            <span>+100 Daily Sparks</span>
          </button>
        </div>
      </div>

      <!-- TAB SELECTOR: STORE CATALOG VS MY VAULT INVENTORY -->
      <div class="flex items-center gap-2 bg-[#121522] border border-[#2B3147] p-1.5 rounded-2xl mb-8 max-w-md">
        <button id="tab-store-catalog" class="flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeStoreTab === 'CATALOG' ? 'bg-sunset-coral text-white shadow-md' : 'text-gray-400 hover:text-white'}">
          <span class="material-symbols-outlined text-[16px]">storefront</span>
          <span>Store Catalog</span>
        </button>
        <button id="tab-store-vault" class="flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeStoreTab === 'VAULT' ? 'bg-sunset-coral text-white shadow-md' : 'text-gray-400 hover:text-white'}">
          <span class="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>My Vault &amp; Orders (${unlocked.length + orders.length})</span>
        </button>
      </div>

      ${activeStoreTab === 'CATALOG' ? renderCatalog(sparks, unlocked) : renderVaultInventory(unlocked, orders)}

      <!-- REAL CHECKOUT MODAL -->
      <div id="modal-checkout" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-lg rounded-3xl bg-[#131726] border border-[#2B3147] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div>
              <span class="text-[10px] font-mono text-mint-green uppercase font-bold tracking-widest block">BONDFIRE DISPATCH</span>
              <h3 class="font-display text-xl font-bold text-white" id="checkout-product-title">Order Keepsake</h3>
            </div>
            <button id="btn-close-checkout" class="p-1.5 rounded-lg bg-surface-bright hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-[#0E111D] border border-white/5 mb-4 flex items-center justify-between">
            <div>
              <span class="text-xs text-gray-400">Total Price</span>
              <div class="text-2xl font-display font-black text-amber-gold" id="checkout-product-price">$38.00</div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30 text-xs font-mono font-bold">
              ✓ Worldwide Tracked Shipping
            </span>
          </div>

          <!-- Shipping Form -->
          <div class="space-y-3 text-left">
            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Full Name</label>
              <input type="text" id="input-ship-name" placeholder="Aarav Sharma" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none" />
            </div>

            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Delivery Address</label>
              <input type="text" id="input-ship-address" placeholder="Flat 402, Sunset Heights, MG Road" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">City</label>
                <input type="text" id="input-ship-city" placeholder="Bangalore / Mumbai" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] text-white text-xs outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Postal Code</label>
                <input type="text" id="input-ship-zip" placeholder="560001" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] text-white text-xs outline-none" />
              </div>
            </div>
          </div>

          <!-- Confirm Button -->
          <button id="btn-confirm-order" class="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-sm uppercase tracking-wider shadow-glow-coral hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Confirm Order &amp; Generate Tracking Receipt</span>
          </button>
        </div>
      </div>

    </div>
  `;
}

/**
 * Store Catalog View (Digital Sparks Perks & Physical Merch)
 */
function renderCatalog(sparks, unlocked) {
  return `
    <!-- SECTION 1: DIGITAL PERKS (UNLOCKED WITH SPARKS) -->
    <div class="mb-14">
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-gold animate-pulse"></span>
        <h2 class="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Digital Campfire Perks (Buy with Sparks)
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        ${DIGITAL_PERKS.map(perk => {
          const isOwned = unlocked.includes(perk.id);
          const canAfford = sparks >= perk.costSparks;

          return `
            <div class="rounded-3xl bg-[#121522] border ${isOwned ? 'border-mint-green/50 shadow-[0_0_20px_rgba(74,222,128,0.1)]' : 'border-[#262B40] hover:border-amber-gold/50'} p-5 flex flex-col justify-between transition-all group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl ${perk.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-[22px]">${perk.icon}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${isOwned ? 'border-mint-green text-mint-green bg-mint-green/10' : 'border-amber-gold/40 text-amber-gold bg-amber-gold/10'}">
                    ${isOwned ? 'OWNED' : perk.badge}
                  </span>
                </div>

                <div class="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">${perk.category}</div>
                <h3 class="font-display text-base font-bold text-white mb-1.5">${perk.name}</h3>
                <p class="text-gray-400 text-xs leading-relaxed font-sans mb-4">${perk.description}</p>
              </div>

              <div class="pt-3 border-t border-[#262B40] flex items-center justify-between gap-2">
                <div>
                  <span class="text-[10px] font-mono text-gray-400">Price</span>
                  <div class="text-base font-display font-black text-amber-gold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px] text-amber-gold">local_fire_department</span>
                    <span>${perk.costSparks}</span>
                  </div>
                </div>

                ${isOwned ? `
                  <span class="px-3 py-1.5 rounded-lg bg-mint-green/15 text-mint-green font-mono font-bold text-xs border border-mint-green/30 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Equipped</span>
                  </span>
                ` : `
                  <button class="btn-unlock-perk px-3.5 py-1.5 rounded-xl ${canAfford ? 'bg-amber-gold hover:bg-[#ffc633] text-dark' : 'bg-gray-800 text-gray-400 cursor-not-allowed'} font-bold text-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer" data-id="${perk.id}" data-name="${perk.name}" data-cost="${perk.costSparks}">
                    <span>Unlock</span>
                    <span class="material-symbols-outlined text-[14px]">bolt</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- SECTION 2: PHYSICAL KEEPSAKES (ORDER WITH REAL TRACKING) -->
    <div class="mb-14">
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2.5 h-2.5 rounded-full bg-sunset-coral animate-pulse"></span>
        <h2 class="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Physical Keepsakes &amp; Pod Merchandise
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${PHYSICAL_PRODUCTS.map(product => `
          <div class="rounded-3xl bg-[#121522] border border-[#262B40] hover:border-sunset-coral/50 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-xl group">
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
              <button class="btn-order-physical px-4 py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-sm hover:shadow-glow-coral transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                <span class="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Order Now</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Vault Inventory View (Unlocked digital perks & shipment receipts)
 */
function renderVaultInventory(unlocked, orders) {
  return `
    <div class="space-y-8">
      
      <!-- Unlocked Digital Items -->
      <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 sm:p-8">
        <h3 class="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-gold">verified_user</span>
          <span>Owned Digital Perks &amp; Shaders (${unlocked.length})</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${DIGITAL_PERKS.filter(p => unlocked.includes(p.id)).map(p => `
            <div class="p-4 rounded-2xl bg-[#161a29] border border-mint-green/30 flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl ${p.iconColor} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">${p.icon}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-display font-bold text-white text-sm truncate">${p.name}</h4>
                <span class="text-[10px] font-mono text-mint-green">ACTIVE &amp; EQUIPPED</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Physical Keepsake Orders & Tracking Receipts -->
      <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 sm:p-8">
        <h3 class="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-sunset-coral">local_shipping</span>
          <span>Active Keepsake Shipments &amp; Tracking (${orders.length})</span>
        </h3>

        ${orders.length === 0 ? `
          <div class="p-8 rounded-2xl bg-[#0E111D] border border-dashed border-white/10 text-center">
            <span class="material-symbols-outlined text-4xl text-gray-500 mb-2">inventory</span>
            <p class="text-sm text-gray-300 font-bold">No keepsake shipments placed yet</p>
            <p class="text-xs text-gray-500 font-mono mt-1">Order any physical photobook or deck from the catalog to see real-time dispatch tracking receipts here.</p>
          </div>
        ` : `
          <div class="space-y-4">
            ${orders.map(o => `
              <div class="p-5 rounded-2xl bg-[#151928] border border-[#2B3147] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30 text-[9.5px] font-mono font-bold">
                      ${o.status || 'PROCESSING'}
                    </span>
                    <span class="text-xs font-mono text-gray-400">Tracking: <strong class="text-white">${o.trackingNumber}</strong></span>
                  </div>
                  <h4 class="font-display font-bold text-white text-base">${o.productName}</h4>
                  <p class="text-xs text-gray-400 font-mono">Recipient: ${o.shippingName} · ${o.city}, ${o.postalCode}</p>
                </div>

                <div class="text-right">
                  <div class="text-xs font-mono text-gray-400">Order Placed: ${new Date(o.createdAt).toLocaleDateString()}</div>
                  <div class="text-sm font-display font-bold text-amber-gold mt-0.5">$${o.price} Paid</div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

    </div>
  `;
}

export function bindEmporiumEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Claim daily sparks
  const claimBtn = document.getElementById('btn-claim-sparks');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      audio.playChime();
      const newSparks = store.claimDailySparks();
      confettiInstance.burst(50, 1);

      const walletDisp = document.getElementById('wallet-sparks-display');
      if (walletDisp) walletDisp.textContent = `${newSparks} Sparks`;

      claimBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] text-mint-green">done_all</span><span>+100 Claimed!</span>`;
      setTimeout(() => {
        reRenderStore();
      }, 1500);
    });
  }

  // Store Tabs
  const tabCatalog = document.getElementById('tab-store-catalog');
  const tabVault = document.getElementById('tab-store-vault');

  if (tabCatalog) {
    tabCatalog.addEventListener('click', () => {
      audio.playClick();
      activeStoreTab = 'CATALOG';
      reRenderStore();
    });
  }

  if (tabVault) {
    tabVault.addEventListener('click', () => {
      audio.playClick();
      activeStoreTab = 'VAULT';
      reRenderStore();
    });
  }

  // Unlock Digital Perk Buttons
  const unlockBtns = document.querySelectorAll('.btn-unlock-perk');
  unlockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const perkId = btn.dataset.id;
      const perkName = btn.dataset.name;
      const cost = parseInt(btn.dataset.cost, 10);

      const ok = store.unlockPerk(perkId, perkName, cost);
      if (ok) {
        audio.playChime();
        confettiInstance.burst(60, 1);
        reRenderStore();
      } else {
        audio.playClick();
        alert(`You need ${cost} Sparks for this perk! Click "+100 Daily Sparks" above to collect more.`);
      }
    });
  });

  // Physical Order Checkout Modal
  let selectedProduct = null;
  const modalCheckout = document.getElementById('modal-checkout');
  const closeCheckoutBtn = document.getElementById('btn-close-checkout');
  const confirmOrderBtn = document.getElementById('btn-confirm-order');

  const orderBtns = document.querySelectorAll('.btn-order-physical');
  orderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      selectedProduct = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price)
      };

      const titleEl = document.getElementById('checkout-product-title');
      const priceEl = document.getElementById('checkout-product-price');
      if (titleEl) titleEl.textContent = `Order ${selectedProduct.name}`;
      if (priceEl) priceEl.textContent = `$${selectedProduct.price.toFixed(2)}`;

      if (modalCheckout) modalCheckout.classList.remove('hidden');
    });
  });

  if (closeCheckoutBtn && modalCheckout) {
    closeCheckoutBtn.addEventListener('click', () => {
      audio.playClick();
      modalCheckout.classList.add('hidden');
    });
  }

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener('click', () => {
      const name = document.getElementById('input-ship-name')?.value.trim() || 'Campfire Camper';
      const address = document.getElementById('input-ship-address')?.value.trim() || 'MG Road, 4th Block';
      const city = document.getElementById('input-ship-city')?.value.trim() || 'Bangalore';
      const zip = document.getElementById('input-ship-zip')?.value.trim() || '560001';

      if (!selectedProduct) return;

      const order = store.recordStoreOrder({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        shippingName: name,
        address,
        city,
        postalCode: zip
      });

      audio.playChime();
      confettiInstance.burst(75, 1);
      if (modalCheckout) modalCheckout.classList.add('hidden');

      activeStoreTab = 'VAULT';
      reRenderStore();
    });
  }

  function reRenderStore() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'STORE') {
      mount.innerHTML = renderEmporiumScreen();
      bindEmporiumEvents();
    }
  }
}
