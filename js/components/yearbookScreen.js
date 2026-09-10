// ==============================================================================
// 3D DIGITAL YEARBOOK & KEEPSAKE SHOWCASE (Screen 6)
// Interactive Hardcover Photobook matching Google Stitch Warm Analog Cyber design
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openPaymentModal } from './demoPaymentModal.js';

let currentPage = 1;

const YEARBOOK_SPREADS = [
  {
    spreadIndex: 1,
    leftPageNum: 42,
    rightPageNum: 43,
    chapter: 'CHAPTER 03 • ARCHIVE TAPE',
    leftTitle: 'The Unhinged Quotes of 2025',
    leftSub: 'Extracted during late-night Bondfire voice lobbies and hot-seat buzzers.',
    quote1: {
      author: 'Sarah M.',
      meta: 'Round 4 • 02:18 AM',
      text: '“OMG, remember the avocado incident? I genuinely thought my passport was inside the guacamole bowl.”',
    },
    quote2: {
      author: 'Liam V.',
      meta: 'Buzzer Confession',
      text: '“I am legally changing my middle name to Potato if Alex wins this prompt round.”',
    },
    polaroids: [
      {
        caption: 'Rooftop #Squad',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQNxfjuQIEDevDFdZgGoQNAJuBSLlLKlKoc1NVeR9aqH-XzPUHFfzDYHzfEcomZCfOAacSkr6xWCDycpJKu__FKzqq1N6H12iNwxjzLKu7snxhNa0aInzNGDnXZu_oUuQGTzqqMIKCAoQmyO5GrI02vHZ9HgmIStYEN5im2jZEfttKlMn1WwCWkhgnfhprYOMFqJjPu3hSPVfHbVP77cqj2JtkEfz7gSPcOBShSOKbgzFkeq0_vEZMwA',
      },
      {
        caption: 'Guac Panic',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa6jQpLJesg6J3c3-u6QNiI68bT3XYjgE_FDgQErP4KcOXlnnuIlh4T8CA3ZM-wUIC-mRQZPgPpFaGIOXxdKHq0xK8jpqLSkfwTe_nNhdubxf1aYT5VGF50sP6vC7v8DDrfFYkVbZ7l7-yaJ2Ms5dQ-y5mWoGckQdHWQcmkycRksYvrn6rcxq9A0-byJU9ykso2Se_TVvPoN3iQSXUHHElPxVjSoyljYOK_lvUrQlN6jPAp5wuN3HaTQ',
      },
    ],
    superlatives: [
      {
        icon: 'warning',
        label: 'Most Likely To',
        title: 'Trip on Flat Floor',
        desc: 'Sarah • 92% votes',
      },
      {
        icon: 'local_fire_department',
        label: 'The Chaos Agent',
        title: 'Devon V.',
        desc: 'Most unhinged roasts',
      },
      {
        icon: 'bedtime',
        label: 'First Asleep On Couch',
        title: 'Alex K.',
        desc: 'Every Friday at 11:15 PM',
      },
      {
        icon: 'military_tech',
        label: 'MVP Trivia Champion',
        title: 'Liam V.',
        desc: '94% guess accuracy',
      },
    ],
  },
  {
    spreadIndex: 2,
    leftPageNum: 44,
    rightPageNum: 45,
    chapter: 'CHAPTER 04 • ANJUNA LOST IN SOUND',
    leftTitle: 'Lost in the Anjuna Forest',
    leftSub: 'Recorded live on WhatsApp audio note during the Goa scooter expedition.',
    quote1: {
      author: 'Alex K.',
      meta: 'Scooter Convoy • 11:45 PM',
      text: '“Guys the Google Maps lady is literally crying. She has no idea where we are. Just follow the bassline.”',
    },
    quote2: {
      author: 'Rohan V.',
      meta: 'Fuel Stop',
      text: '“I don’t need gas, I need three kingfisher sodas and a flashlight.”',
    },
    polaroids: [
      {
        caption: 'Night Convoy',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1sLF--kOxRiyHBVD5f0LC6RD-S-h8ilwmk4Zh7jx7-pHSSU9t41BpJd9GWrmWk4EuphEowgfMQR4Mdn0VY5r368vqU-qbXqDq3ZhRa5MYxDBywgOBgdv34HCp8clhydcHBMdgs_8v5bCB4f1in_bY628d9CD0m7ERl9xwvwDkmrotEk3JXIbXdPr38u1KLAlXzkG7GMKeLFyIWSo--O-Hu7lmt6ZJOod-_AUV5pVr6rOOeMNAmau3HQ',
      },
      {
        caption: 'Curfew Evaded',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmTvkxTpmNJFJSFINhAeLGm8sUBPCJkNY2tvuprYLpPtmpoZGndhi9Y8iVIN8gzZUXAug0Hrygmir0VhptFCHbHiqbt-Fex-S19G0c04ZLgJeDlK2yqcf46pVxEj5y4zJDYSxjc_1ZTHm1cq-b44hlgJTQDrgAV7SgJD7lw-2lIM2_odAZ4394Hxx_Ai5YmMbghI34_YJ4zCvNTdL1r0XI7en4Sy6nFawO7B3U8BovJmj26dnk879lPA',
      },
    ],
    superlatives: [
      {
        icon: 'navigation',
        label: 'Worst Navigator',
        title: 'Alex K.',
        desc: 'Ended up in Maharashtra',
      },
      {
        icon: 'restaurant',
        label: 'Midnight Samosa Bandit',
        title: 'Rohan V.',
        desc: 'Ate 4 samosas at 3 AM',
      },
      {
        icon: 'photo_camera',
        label: 'The Shaky Cameraman',
        title: 'Maya K.',
        desc: '74 blurry selfies',
      },
      {
        icon: 'sentiment_very_dissatisfied',
        label: 'Netflix Password Revoker',
        title: 'Liam V.',
        desc: 'Revoked 5 accounts',
      },
    ],
  },
];

export function renderYearbookScreen() {
  const user = store.getState().currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? `${user.displayName.split(' ')[0]} (You)` : 'You';
  const currentSpread = YEARBOOK_SPREADS[(currentPage - 1) % YEARBOOK_SPREADS.length];

  return `
    <div class="flex flex-col w-full max-w-6xl mx-auto px-4 py-6 pb-28 select-none text-on-surface">
      <!-- Top Meta Action Bar -->
      <div class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-border shadow-xl mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
            <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">auto_stories</span>
          </div>
          <div class="flex items-center gap-2 font-caption text-caption text-on-surface-variant font-medium">
            <span class="text-on-surface font-label-md text-label-md font-bold">Goa Crew Pod</span>
            <span>•</span>
            <span class="text-secondary font-label-md text-label-md font-bold">Season 2026</span>
            <span>•</span>
            <span class="text-primary font-label-md text-label-md font-bold">Official Hardcover Yearbook</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-md text-caption uppercase tracking-wider font-bold border border-tertiary/30">POD EXCLUSIVE</span>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-all border border-border font-bold active:scale-95" id="shareBtn" type="button">
            <span class="material-symbols-outlined text-[16px]">share</span>
            <span>Share Digital Recap</span>
          </button>
          <button class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-all border border-border font-bold active:scale-95" id="pdfBtn" type="button">
            <span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <!-- Main Showcase Grid (Book Visualizer + Order Module) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Centerpiece Hardcover 3D Spread Viewer -->
        <div class="lg:col-span-8 flex flex-col gap-4">
          <div class="relative w-full rounded-3xl p-4 md:p-6 bg-surface-container-low shadow-2xl border border-border overflow-hidden">
            <!-- Header of Spread Display -->
            <div class="flex items-center justify-between gap-4 mb-4 relative z-10">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping"></span>
                <span class="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">Hardcover Keepsake Photobook</span>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-caption tabular-nums border border-border">
                <span id="pageIndicator" class="font-bold">Pages ${currentSpread.leftPageNum}–${currentSpread.rightPageNum}</span>
                <span class="text-outline">/</span>
                <span class="text-on-surface-variant font-mono">120</span>
              </div>
            </div>

            <!-- Open Book Canvas Simulation -->
            <div id="yearbook-spread-container" class="yearbook-print-container relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0e111a] p-2 md:p-5 touch-manipulation select-none">
              <div class="relative w-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row bg-[#FDFBF7] text-[#1E2330] transition-all duration-300 min-h-[460px]">
                
                <!-- Left Page: The Unhinged Quotes -->
                <div class="flex-1 p-6 md:p-7 flex flex-col justify-between relative bg-gradient-to-r from-[#F7F4EC] to-[#FCFBF8] border-r border-[#E5DFD3]">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                      <span class="font-label-md text-caption uppercase tracking-wider text-[#A09383] font-bold">${currentSpread.chapter}</span>
                      <span class="text-[10px] font-caption text-[#8C7B68] bg-[#EBE4D5] px-2 py-0.5 rounded font-bold">AUTO-COMPILED</span>
                    </div>
                    <h3 class="font-headline-md text-headline-md text-[#1a1c24] font-serif leading-tight font-bold">${currentSpread.leftTitle}</h3>
                    <p class="font-caption text-caption text-[#6B5E51] -mt-1 leading-snug">${currentSpread.leftSub}</p>

                    <!-- Mock chat/quote bubbles styled analog style -->
                    <div class="space-y-2.5 mt-2">
                      <div class="p-3 rounded-xl bg-white shadow-sm border border-[#E9E4DC] transform -rotate-1 transition-transform hover:rotate-0">
                        <div class="flex items-center justify-between text-[11px] font-caption text-[#827263] mb-1">
                          <span class="font-bold text-[#1a1c24]">${currentSpread.quote1.author}</span>
                          <span>${currentSpread.quote1.meta}</span>
                        </div>
                        <p class="font-body-md text-body-sm text-[#272B35] font-serif italic">${currentSpread.quote1.text}</p>
                      </div>

                      <div class="p-3 rounded-xl bg-[#FFF6E9] shadow-sm border border-[#EEDBCA] transform rotate-1 transition-transform hover:rotate-0">
                        <div class="flex items-center justify-between text-[11px] font-caption text-[#A06C2C] mb-1">
                          <span class="font-bold text-[#6D4208]">${currentSpread.quote2.author}</span>
                          <span>${currentSpread.quote2.meta}</span>
                        </div>
                        <p class="font-body-md text-body-sm text-[#3E2911] font-serif italic">${currentSpread.quote2.text}</p>
                      </div>

                      <!-- Polaroids strip mini mockup -->
                      <div class="pt-2 flex items-center gap-3">
                        ${currentSpread.polaroids
                          .map(
                            (pol, idx) => `
                          <div class="w-20 h-24 bg-white p-1.5 shadow-md ${idx === 0 ? '-rotate-3' : 'rotate-2'} rounded-sm flex flex-col justify-between">
                            <img class="w-full h-16 object-cover rounded-xs" alt="${pol.caption}" src="${pol.src}" />
                            <span class="text-[8px] font-caption text-center text-[#736353] font-semibold truncate">${pol.caption}</span>
                          </div>
                        `
                          )
                          .join('')}
                        <div class="flex-1 text-[11px] font-caption text-[#7C6E61] italic">
                          “Best trip ever! 84 photos voted to print.”
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="pt-4 flex items-center justify-between text-[11px] font-caption text-[#A79A8B] font-mono">
                    <span>BONDFIRE POD CHRONICLES</span>
                    <span>PG ${currentSpread.leftPageNum}</span>
                  </div>
                </div>

                <!-- Book Spine Center Fold Gradient -->
                <div class="hidden md:block w-3.5 bg-gradient-to-r from-[#D6CEC0] via-[#F3EFE6] to-[#CCC3B3] shadow-inner"></div>

                <!-- Right Page: Superlatives & Season Recap -->
                <div class="flex-1 p-6 md:p-7 flex flex-col justify-between relative bg-gradient-to-l from-[#F8F5EE] to-[#FCFBF8]">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                      <span class="font-label-md text-caption uppercase tracking-wider text-[#A09383] font-bold">COMMUNITY BALLOT</span>
                      <span class="px-2 py-0.5 rounded-full bg-[#FFEED0] text-[#915B06] font-caption text-[10px] font-bold">100% UNANIMOUS</span>
                    </div>

                    <div class="text-center my-0.5">
                      <h3 class="font-headline-md text-headline-md text-[#171922] font-serif leading-none tracking-tight font-bold">SQUAD MEMBER</h3>
                      <div class="font-headline-lg text-headline-lg text-[#C83439] tracking-tight font-serif uppercase font-bold">ROAST AWARDS</div>
                    </div>

                    <!-- Roast Badges Grid -->
                    <div class="grid grid-cols-2 gap-2.5 my-1.5">
                      ${currentSpread.superlatives
                        .map(
                          (sup) => `
                        <div class="p-2.5 rounded-xl bg-white shadow-sm border border-[#EAE4D8] flex items-center gap-2">
                          <div class="w-8 h-8 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                            <span class="material-symbols-outlined text-[16px]">${sup.icon}</span>
                          </div>
                          <div class="min-w-0">
                            <div class="text-[9px] uppercase font-bold text-[#A8282D] tracking-wide truncate">${sup.label}</div>
                            <div class="font-body-md text-xs font-bold text-[#1F2430] truncate">${(sup.title === 'Maya K.' || sup.title === 'Devon V.') ? userName : sup.title}</div>
                            <div class="text-[9px] text-[#7A6B5C] truncate">${sup.desc}</div>
                          </div>
                        </div>
                      `
                        )
                        .join('')}
                    </div>

                    <div class="p-2.5 rounded-xl bg-[#F0EBE0] text-[10px] text-[#5A4F44] border border-[#DDD4C4] italic text-center">
                      “Awarded during the 3:00 AM live lobby elimination round.”
                    </div>
                  </div>

                  <div class="pt-4 flex items-center justify-between text-[11px] font-caption text-[#A79A8B] font-mono">
                    <span>ARCHIVAL 180GSM MATTE</span>
                    <span>PG ${currentSpread.rightPageNum}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Spread Navigation Controls -->
            <div class="flex items-center justify-between pt-2">
              <button class="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-caption font-bold border border-border transition-all active:scale-95 disabled:opacity-40" id="btn-book-prev" ${currentPage === 1 ? 'disabled' : ''} type="button">
                ◀ Previous Spread
              </button>
              <span class="font-caption text-caption text-secondary font-mono">Layflat Smyth-Sewn Binding</span>
              <button class="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-caption font-bold border border-border transition-all active:scale-95 disabled:opacity-40" id="btn-book-next" ${currentPage === YEARBOOK_SPREADS.length ? 'disabled' : ''} type="button">
                Next Spread ▶
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Print-on-Demand Keepsake Customizer -->
        <div class="lg:col-span-4 flex flex-col gap-5">
          <div class="bg-surface-container rounded-3xl p-6 shadow-xl border border-border">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-secondary text-[22px]">local_shipping</span>
              <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Hardcover Order</h3>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Museum-grade coffee table photobook autogenerated from your season's highest-rated prompts.
            </p>

            <!-- Fabric Choice -->
            <div class="mb-4">
              <span class="font-label-md text-caption uppercase text-on-surface-variant font-bold block mb-2">Cover Fabric:</span>
              <div class="grid grid-cols-3 gap-2 text-xs text-center font-bold">
                <div class="p-2.5 rounded-xl bg-surface-container-high border-2 border-secondary text-secondary cursor-pointer shadow-sm">
                  Obsidian
                </div>
                <div class="p-2.5 rounded-xl bg-surface-container-high border border-border text-on-surface-variant cursor-pointer hover:border-secondary transition-colors">
                  Midnight
                </div>
                <div class="p-2.5 rounded-xl bg-surface-container-high border border-border text-on-surface-variant cursor-pointer hover:border-secondary transition-colors">
                  Coral Silk
                </div>
              </div>
            </div>

            <!-- Foil Embossing -->
            <div class="mb-4">
              <span class="font-label-md text-caption uppercase text-on-surface-variant font-bold block mb-2">Foil Embossing:</span>
              <div class="flex gap-2">
                <span class="px-3 py-1.5 rounded-full bg-surface-container-high border-2 border-secondary text-secondary text-xs font-bold">Gold Foil</span>
                <span class="px-3 py-1.5 rounded-full bg-surface-container-high border border-border text-on-surface-variant text-xs font-bold">Rose Gold</span>
                <span class="px-3 py-1.5 rounded-full bg-surface-container-high border border-border text-on-surface-variant text-xs font-bold">Silver</span>
              </div>
            </div>

            <!-- Quantity Selector & Volume Discount Calculation -->
            <div class="pt-4 border-t border-border flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="font-label-md text-label-md text-on-surface font-bold">Pod Copies:</span>
                <select id="book-qty-select" class="bg-surface-container-high border border-border rounded-xl px-3 py-1.5 text-on-surface font-label-md text-label-md font-bold focus:outline-none">
                  <option value="1">1 Copy ($39)</option>
                  <option value="2">2 Copies ($78)</option>
                  <option value="4" selected>4 Copies ($125 - Save 20%)</option>
                  <option value="6">6 Copies ($187 - Save 20%)</option>
                </select>
              </div>

              <div class="flex items-baseline justify-between pt-1">
                <span class="font-body-sm text-caption text-on-surface-variant">Total with Free Shipping:</span>
                <span class="font-headline-lg text-headline-lg font-bold text-secondary tabular-nums" id="book-total-price">$125.00</span>
              </div>

              <button id="btn-checkout-book" class="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-sm shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-2 mt-2" type="button">
                <span>Order Hardcover for Goa Crew</span>
                <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
              </button>

              <span class="text-[10px] text-center text-outline">Printed on demand & shipped within 4 business days.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindYearbookEvents() {
  const prevBtn = document.getElementById('btn-book-prev');
  const nextBtn = document.getElementById('btn-book-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        audio.playClick();
        currentPage--;
        store.setView('YEARBOOK');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < YEARBOOK_SPREADS.length) {
        audio.playClick();
        currentPage++;
        store.setView('YEARBOOK');
      }
    });
  }

  // Touch Swipe Gestures for Mobile & Tablet
  const spreadContainer = document.getElementById('yearbook-spread-container');
  if (spreadContainer) {
    let touchStartX = 0;
    let touchStartY = 0;

    spreadContainer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    spreadContainer.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0 && currentPage < YEARBOOK_SPREADS.length) {
          audio.playClick();
          audio.triggerHaptic(20);
          currentPage++;
          store.setView('YEARBOOK');
        } else if (deltaX > 0 && currentPage > 1) {
          audio.playClick();
          audio.triggerHaptic(20);
          currentPage--;
          store.setView('YEARBOOK');
        }
      }
    }, { passive: true });
  }

  // Quantity Change Calculator matching Test Suite 3
  const qtySelect = document.getElementById('book-qty-select');
  const priceDisplay = document.getElementById('book-total-price');

  if (qtySelect && priceDisplay) {
    qtySelect.addEventListener('change', (e) => {
      audio.playClick();
      const qty = parseInt(e.target.value, 10);
      let total = qty * 39;
      if (qty >= 4) total = Math.round(total * 0.8);
      priceDisplay.textContent = `$${total}.00`;
    });
  }

  // Checkout Button -> Launch Interactive Demo Payment Checkout
  const checkoutBtn = document.getElementById('btn-checkout-book');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      audio.playChime();
      const qtySelect = document.getElementById('book-qty-select');
      const qty = qtySelect ? parseInt(qtySelect.value, 10) : 4;
      let total = qty * 39;
      if (qty >= 4) total = Math.round(total * 0.8);

      openPaymentModal({
        item: `${qty}x Hardcover Yearbooks (Goa Crew 2026)`,
        price: total,
        originalPrice: qty * 39,
        discountText: qty >= 4 ? '20% Volume Squad Bundle Discount Applied' : 'Standard Hardcover Print Order',
        tier: 'PRO',
      });
    });
  }

  // Share and PDF
  const shareBtn = document.getElementById('shareBtn');
  const pdfBtn = document.getElementById('pdfBtn');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      audio.playClick();
      navigator.clipboard?.writeText(window.location.href);
      const toastMount = document.getElementById('toast-mount');
      if (toastMount) {
        toastMount.innerHTML = `<div class="toast toast-mint show"><span>Digital recap link copied to clipboard! 🔗</span></div>`;
        setTimeout(() => (toastMount.innerHTML = ''), 2500);
      }
    });
  }

  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      audio.playChime();
      window.print();
    });
  }
}
