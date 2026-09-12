// ==============================================================================
// INTERACTIVE DEMO PAYMENT CHECKOUT MODAL
// High-polish Stripe-style cyber checkout simulator with 1-click test cards & receipts
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let currentOrder = null;

export function openPaymentModal(options = {}) {
  currentOrder = {
    item: options.item || options.name || 'Pod Pro Membership (1 Year)',
    price: options.price !== undefined ? options.price : 45.00,
    originalPrice: options.originalPrice || (options.price ? options.price * 1.25 : 60.00),
    discountText: options.discountText || 'Special 25% Squad Discount Applied',
    tier: options.tier || 'PRO',
    orderId: `BF-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  const modalMount = document.getElementById('modal-mount');
  if (!modalMount) return;

  modalMount.innerHTML = renderPaymentModalMarkup(currentOrder);
  bindPaymentModalEvents();
  audio.playChime();
}

export const openDemoPaymentModal = openPaymentModal;

export function closePaymentModal() {
  const modalMount = document.getElementById('modal-mount');
  if (modalMount) {
    modalMount.innerHTML = '';
  }
}

export const closeDemoPaymentModal = closePaymentModal;

export function renderPaymentModal() {
  // Exported for testing harness
  return renderPaymentModalMarkup({
    item: 'Pod Pro Membership (1 Year)',
    price: 45.0,
    originalPrice: 60.0,
    discountText: 'Special 25% Squad Discount Applied',
    tier: 'PRO',
    orderId: 'BF-849201',
  });
}

function renderPaymentModalMarkup(order) {
  const formattedPrice = typeof order.price === 'number' ? order.price.toFixed(2) : order.price;
  const formattedOriginal = typeof order.originalPrice === 'number' ? order.originalPrice.toFixed(2) : order.originalPrice;

  return `
    <div id="payment-modal-backdrop" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
      <div class="relative w-full max-w-lg bg-surface-container-low border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 text-on-surface overflow-hidden">
        
        <!-- Ambient Decorative Glows -->
        <div class="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-sunset-coral/20 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-amber-gold/15 blur-3xl pointer-events-none"></div>

        <!-- Header Strip -->
        <div class="flex items-center justify-between pb-4 border-b border-border/70 mb-5 relative z-10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-headline-sm font-bold text-white tracking-tight">Express Checkout</h3>
              <p class="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
                <span>STRIPE TEST SANDBOX · ZERO REAL CHARGES</span>
              </p>
            </div>
          </div>
          <button id="btn-close-payment-modal" class="w-8 h-8 rounded-full bg-surface border border-border/80 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Checkout View / Container -->
        <div id="payment-stage-form" class="relative z-10 flex flex-col gap-4">
          <!-- Order Summary Pill -->
          <div class="p-4 rounded-2xl bg-surface-container-lowest/80 border border-border/70 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-white">${order.item}</span>
              <div class="text-right">
                <span class="text-xs text-gray-500 line-through mr-1.5">$${formattedOriginal}</span>
                <span class="font-bold text-base text-mint-green font-mono">$${formattedPrice}</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-amber-gold/90 font-medium">
              <span>${order.discountText}</span>
              <span class="text-[10px] text-gray-400 uppercase tracking-wider">Taxes $0.00</span>
            </div>
          </div>

          <!-- 1-Click Test Card Presets -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Fill Test Card</label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" id="btn-autofill-visa" class="px-3 py-2 rounded-xl bg-surface border border-border/80 hover:border-sunset-coral/50 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition-all active:scale-95">
                <span class="text-[13px] font-bold text-sunset-coral">VISA</span>
                <span>4242 · Success</span>
              </button>
              <button type="button" id="btn-autofill-mastercard" class="px-3 py-2 rounded-xl bg-surface border border-border/80 hover:border-amber-gold/50 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition-all active:scale-95">
                <span class="text-[13px] font-bold text-amber-gold">MC</span>
                <span>5555 · Success</span>
              </button>
            </div>
          </div>

          <!-- Card Form Inputs -->
          <div class="flex flex-col gap-3">
            <div>
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Cardholder Name</label>
              <input type="text" id="pay-card-name" value="${(store.getState().currentUser?.displayName && store.getState().currentUser.isLoggedIn) ? store.getState().currentUser.displayName : 'Citizen Member'}" placeholder="Name on card" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Card Number</label>
              <div class="relative">
                <input type="text" id="pay-card-number" value="4242 •••• •••• 4242" placeholder="4242 4242 4242 4242" maxlength="19" class="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors" />
                <div class="absolute right-3 top-2.5 text-xs font-bold text-sunset-coral" id="pay-card-badge">VISA</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Expires (MM/YY)</label>
                <input type="text" id="pay-card-exp" value="12/28" placeholder="MM/YY" maxlength="5" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">CVC / CVV</label>
                <input type="password" id="pay-card-cvc" value="123" placeholder="123" maxlength="4" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          <!-- Security Badges Row -->
          <div class="flex items-center justify-between text-[10px] text-gray-400 font-mono py-1">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px] text-mint-green">verified_user</span>
              <span>256-Bit Encrypted</span>
            </span>
            <span>PCI DSS Level 1</span>
            <span>Zero Data Retained</span>
          </div>

          <!-- Authorize Payment CTA -->
          <button type="button" id="btn-submit-payment" class="w-full py-3.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold hover:brightness-110 text-canvas font-headline-sm font-bold text-sm shadow-glow-coral transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
            <span class="material-symbols-outlined text-[18px]">credit_card</span>
            <span>Complete Payment · $${formattedPrice}</span>
          </button>
        </div>

        <!-- Processing State (Hidden initially) -->
        <div id="payment-stage-processing" class="hidden relative z-10 flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 rounded-full border-4 border-sunset-coral/20 border-t-sunset-coral animate-spin mb-6"></div>
          <h4 class="font-headline-sm text-headline-sm font-bold text-white mb-2">Processing Sandbox Transaction...</h4>
          <p id="processing-step-text" class="text-xs text-amber-gold font-mono mb-4">Authorizing test token with gateway...</p>
          <div class="w-48 h-1.5 bg-surface rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-sunset-coral to-mint-green animate-pulse w-3/4"></div>
          </div>
        </div>

        <!-- Success Receipt State (Hidden initially) -->
        <div id="payment-stage-success" class="hidden relative z-10 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-full bg-mint-green/20 border-2 border-mint-green text-mint-green flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-[32px] font-bold">check</span>
          </div>
          <span class="text-xs uppercase font-bold tracking-widest text-mint-green px-2.5 py-0.5 rounded-full bg-mint-green/10 border border-mint-green/30 mb-2">Payment Confirmed</span>
          <h4 class="font-headline-md text-headline-md font-bold text-white mb-1">Upgrade Activated!</h4>
          <p class="text-xs text-gray-300 max-w-xs mb-6">
            Your pod has been upgraded to <strong class="text-white">${order.item}</strong>. All infinite features are unlocked now.
          </p>

          <!-- Receipt Details Card -->
          <div class="w-full p-4 rounded-2xl bg-surface border border-border/80 text-left font-mono text-xs flex flex-col gap-2 mb-6">
            <div class="flex justify-between text-gray-400">
              <span>Receipt ID:</span>
              <span class="text-white font-bold" id="receipt-order-id">${order.orderId}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Amount Paid:</span>
              <span class="text-mint-green font-bold">$${formattedPrice} USD</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Payment Method:</span>
              <span class="text-white">Visa ending in 4242</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Status:</span>
              <span class="text-mint-green">PAID · TEST SIMULATION</span>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full">
            <button type="button" id="btn-download-receipt" class="flex-1 py-2.5 px-4 rounded-full bg-surface border border-border/80 hover:text-white text-xs font-bold text-gray-300 transition-colors flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Print Invoice</span>
            </button>
            <button type="button" id="btn-finish-payment" class="flex-1 py-2.5 px-4 rounded-full bg-mint-green hover:bg-mint-green/90 text-canvas text-xs font-bold transition-transform active:scale-95 shadow-glow-mint">
              Done & Enjoy Pro
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function bindPaymentModalEvents() {
  const backdrop = document.getElementById('payment-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-payment-modal');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      audio.playClick();
      closePaymentModal();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        audio.playClick();
        closePaymentModal();
      }
    });
  }

  // 1-Click Autofill Buttons
  const visaBtn = document.getElementById('btn-autofill-visa');
  const mcBtn = document.getElementById('btn-autofill-mastercard');
  const cardNum = document.getElementById('pay-card-number');
  const cardName = document.getElementById('pay-card-name');
  const cardExp = document.getElementById('pay-card-exp');
  const cardCvc = document.getElementById('pay-card-cvc');
  const cardBadge = document.getElementById('pay-card-badge');

  if (visaBtn && cardNum) {
    visaBtn.addEventListener('click', () => {
      audio.playClick();
      const currentUserName = (store.getState().currentUser?.displayName && store.getState().currentUser.isLoggedIn) ? store.getState().currentUser.displayName : 'Citizen Member';
      cardNum.value = '4242 4242 4242 4242';
      cardName.value = currentUserName;
      cardExp.value = '12/28';
      cardCvc.value = '123';
      if (cardBadge) {
        cardBadge.textContent = 'VISA';
        cardBadge.className = 'absolute right-3 top-2.5 text-xs font-bold text-sunset-coral';
      }
    });
  }

  if (mcBtn && cardNum) {
    mcBtn.addEventListener('click', () => {
      audio.playClick();
      const currentUserName = (store.getState().currentUser?.displayName && store.getState().currentUser.isLoggedIn) ? store.getState().currentUser.displayName : 'Citizen Member';
      cardNum.value = '5555 5555 5555 4444';
      cardName.value = currentUserName;
      cardExp.value = '10/29';
      cardCvc.value = '888';
      if (cardBadge) {
        cardBadge.textContent = 'MC';
        cardBadge.className = 'absolute right-3 top-2.5 text-xs font-bold text-amber-gold';
      }
    });
  }

  // Submit Payment Action
  const submitBtn = document.getElementById('btn-submit-payment');
  const formStage = document.getElementById('payment-stage-form');
  const processStage = document.getElementById('payment-stage-processing');
  const successStage = document.getElementById('payment-stage-success');
  const stepText = document.getElementById('processing-step-text');

  if (submitBtn && formStage && processStage && successStage) {
    submitBtn.addEventListener('click', () => {
      audio.playChime();
      formStage.classList.add('hidden');
      processStage.classList.remove('hidden');

      // Animated multi-step gateway simulation
      setTimeout(() => {
        if (stepText) stepText.textContent = 'Authorizing $45.00 with Stripe test tokens...';
      }, 700);

      setTimeout(() => {
        if (stepText) stepText.textContent = 'Provisioning infinite cloud vault & R2 buckets...';
      }, 1400);

      setTimeout(() => {
        audio.playCorrect();
        processStage.classList.add('hidden');
        successStage.classList.remove('hidden');

        // Upgrade state tier
        if (currentOrder && currentOrder.tier) {
          store.setUserTier(currentOrder.tier);
        }

        // Trigger celebration confetti
        try {
          const confetti = new ConfettiEngine('confetti-canvas');
          confetti.burst(60);
        } catch (e) {
          console.warn('Confetti burst in modal:', e);
        }
      }, 2100);
    });
  }

  // Receipt Download / Print
  const printBtn = document.getElementById('btn-download-receipt');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      audio.playClick();
      window.print();
    });
  }

  // Done Button
  const finishBtn = document.getElementById('btn-finish-payment');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      audio.playClick();
      closePaymentModal();
      store.setView('STORE');
    });
  }
}
