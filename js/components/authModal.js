// ==============================================================================
// CONTEXTUAL AUTHENTICATION MODAL (SIGN IN / REGISTER)
// Explains the exact value proposition of an account with zero party friction
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { GoogleAuthService } from '../services/googleAuth.js';

let currentAuthReason = 'Save your squad memories & unlock cloud vault';

export function openAuthModal(reason = 'Save your squad memories & unlock cloud vault') {
  currentAuthReason = reason;
  const modalMount = document.getElementById('modal-mount');
  if (!modalMount) return;

  modalMount.innerHTML = renderAuthModalMarkup(currentAuthReason);
  bindAuthModalEvents();
  audio.playChime();
}

export function closeAuthModal() {
  const modalMount = document.getElementById('modal-mount');
  if (modalMount) {
    modalMount.innerHTML = '';
  }
}

export function renderAuthModal() {
  // Exported for testing harness
  return renderAuthModalMarkup('Save your squad memories & unlock cloud vault');
}

function renderAuthModalMarkup(reason) {
  return `
    <div id="auth-modal-backdrop" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
      <div class="relative w-full max-w-md bg-surface-container-low border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 text-on-surface overflow-hidden">
        
        <!-- Ambient Decorative Glows -->
        <div class="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-sunset-coral/20 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-amber-gold/15 blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-border/70 mb-5 relative z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sunset-coral to-amber-gold p-[1px] flex items-center justify-center">
              <div class="w-full h-full bg-canvas rounded-[7px] flex items-center justify-center text-amber-gold font-bold text-xs">
                🔥
              </div>
            </div>
            <div>
              <h3 class="font-headline-sm text-headline-sm font-bold text-white tracking-tight">Bondfire Identity</h3>
              <p class="text-[11px] text-gray-400 font-mono">ENCRYPTED MEMORY PASSPORT</p>
            </div>
          </div>
          <button id="btn-close-auth-modal" class="w-8 h-8 rounded-full bg-surface border border-border/80 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Dynamic Context Alert -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest/80 border border-border/60 mb-5 flex items-start gap-2.5 relative z-10">
          <span class="material-symbols-outlined text-amber-gold text-[18px] shrink-0 mt-0.5">verified</span>
          <p class="text-xs text-gray-300 leading-snug">
            <strong class="text-white">Why Sign In?</strong> ${reason}
          </p>
        </div>

        <!-- Tab Switcher -->
        <div class="flex p-1 bg-surface-container-lowest rounded-full border border-border/70 mb-5 relative z-10" id="auth-tab-strip">
          <button type="button" id="tab-sign-in" class="flex-1 py-2 text-xs font-bold rounded-full bg-surface-bright text-white shadow-sm transition-all">
            Sign In
          </button>
          <button type="button" id="tab-create-account" class="flex-1 py-2 text-xs font-bold rounded-full text-gray-400 hover:text-white transition-all">
            Create Account
          </button>
        </div>

        <!-- Quick Multi-Account Test Profiles Switcher -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest/90 border border-border/80 mb-4 relative z-10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] uppercase font-mono text-amber-gold font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">switch_account</span>
              <span>1-Click Test Accounts</span>
            </span>
            <span class="text-[9px] text-gray-500 font-mono">Multi-player Testing</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button type="button" class="btn-quick-login p-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-border flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-name="Harshal (Host)" data-email="harshal@bondfire.app" data-role="HOST" data-avatar="https://api.dicebear.com/7.x/bottts/svg?seed=HarshalHost">
              <div class="w-7 h-7 rounded-lg overflow-hidden bg-primary-container/20">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=HarshalHost" class="w-full h-full object-cover" />
              </div>
              <span class="text-[11px] font-bold text-white truncate w-full">Harshal</span>
              <span class="text-[8px] text-sunset-coral font-bold uppercase">Host</span>
            </button>
            <button type="button" class="btn-quick-login p-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-border flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-name="Liam" data-email="liam@bondfire.app" data-role="PLAYER" data-avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Liam">
              <div class="w-7 h-7 rounded-lg overflow-hidden bg-secondary-container/20">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Liam" class="w-full h-full object-cover" />
              </div>
              <span class="text-[11px] font-bold text-white truncate w-full">Liam</span>
              <span class="text-[8px] text-amber-gold font-bold uppercase">Camper</span>
            </button>
            <button type="button" class="btn-quick-login p-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-border flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-name="Sarah" data-email="sarah@bondfire.app" data-role="PLAYER" data-avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Sarah">
              <div class="w-7 h-7 rounded-lg overflow-hidden bg-tertiary-container/20">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Sarah" class="w-full h-full object-cover" />
              </div>
              <span class="text-[11px] font-bold text-white truncate w-full">Sarah</span>
              <span class="text-[8px] text-mint-green font-bold uppercase">Camper</span>
            </button>
            <button type="button" class="btn-quick-login p-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-border flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-name="Alex" data-email="alex@bondfire.app" data-role="PLAYER" data-avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Alex">
              <div class="w-7 h-7 rounded-lg overflow-hidden bg-surface-bright">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Alex" class="w-full h-full object-cover" />
              </div>
              <span class="text-[11px] font-bold text-white truncate w-full">Alex</span>
              <span class="text-[8px] text-duo-rose font-bold uppercase">Camper</span>
            </button>
          </div>
        </div>

        <!-- Google Identity Services (GSI) Button & Account Chooser -->
        <div class="relative z-10 flex flex-col items-center gap-2 mb-4">
          <!-- Official Google Sign-In button container (Native Account Chooser) -->
          <div id="google-official-btn-container" class="w-full flex justify-center min-h-[44px]"></div>
          
          <button type="button" id="btn-google-auth-trigger" class="w-full py-2.5 px-4 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Switch / Choose Another Google Account</span>
          </button>
        </div>

        <div class="relative z-10 flex items-center gap-3 mb-5">
          <div class="h-[1px] flex-1 bg-border/80"></div>
          <span class="text-[10px] uppercase font-mono text-gray-500 font-bold">Or Email Magic Link</span>
          <div class="h-[1px] flex-1 bg-border/80"></div>
        </div>

        <!-- Email Credentials Form -->
        <form id="auth-form" class="relative z-10 flex flex-col gap-3">
          <div id="name-field-container" class="hidden">
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Your Name</label>
            <input type="text" id="auth-name-input" placeholder="e.g. Alex River" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
            <input type="email" id="auth-email-input" required value="" placeholder="name@domain.com" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Passkey or Password</label>
            <input type="password" id="auth-pass-input" required value="" placeholder="Secret passphrase" class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors" />
          </div>

          <!-- Submit Button -->
          <button type="submit" id="btn-submit-auth" class="w-full py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            <span id="auth-submit-label">Enter Bondfire Lounge</span>
          </button>
        </form>

        <!-- Guest Fallback Footer -->
        <div class="mt-5 pt-4 border-t border-border/70 text-center relative z-10">
          <button type="button" id="btn-continue-as-guest" class="text-xs text-gray-400 hover:text-white underline decoration-dotted font-medium transition-colors">
            Continue as Instant Guest (Party Mode) →
          </button>
        </div>

      </div>
    </div>
  `;
}

function bindAuthModalEvents() {
  const backdrop = document.getElementById('auth-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-auth-modal');
  const guestBtn = document.getElementById('btn-continue-as-guest');

  const handleClose = () => {
    audio.playClick();
    closeAuthModal();
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (guestBtn) guestBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });
  }

  // Google Identity Services (GSI) Button & Trigger
  GoogleAuthService.renderSignInButton('google-official-btn-container');

  const googleBtn = document.getElementById('btn-google-auth-trigger');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      audio.playChime();
      const signedInUser = GoogleAuthService.promptSignIn();
      if (signedInUser) {
        audio.playCorrect();
        closeAuthModal();
        store.setView('PROFILE');
      } else {
        closeAuthModal();
      }
    });
  }

  // Tab Switcher
  const tabSignIn = document.getElementById('tab-sign-in');
  const tabCreate = document.getElementById('tab-create-account');
  const nameContainer = document.getElementById('name-field-container');
  const submitLabel = document.getElementById('auth-submit-label');

  if (tabSignIn && tabCreate && nameContainer && submitLabel) {
    tabSignIn.addEventListener('click', () => {
      audio.playClick();
      tabSignIn.className = 'flex-1 py-2 text-xs font-bold rounded-full bg-surface-bright text-white shadow-sm transition-all';
      tabCreate.className = 'flex-1 py-2 text-xs font-bold rounded-full text-gray-400 hover:text-white transition-all';
      nameContainer.classList.add('hidden');
      submitLabel.textContent = 'Enter Bondfire Lounge';
    });

    tabCreate.addEventListener('click', () => {
      audio.playClick();
      tabCreate.className = 'flex-1 py-2 text-xs font-bold rounded-full bg-surface-bright text-white shadow-sm transition-all';
      tabSignIn.className = 'flex-1 py-2 text-xs font-bold rounded-full text-gray-400 hover:text-white transition-all';
      nameContainer.classList.remove('hidden');
      submitLabel.textContent = 'Create Free Account & Sync Vault';
    });
  }

  // Form Submit
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.playCorrect();
      const email = document.getElementById('auth-email-input').value.trim();
      const name = document.getElementById('auth-name-input')?.value.trim() || email.split('@')[0];

      store.updateUserProfile({
        isLoggedIn: true,
        displayName: name,
        email: email,
        isHost: true,
      });

      closeAuthModal();
      store.setView('PROFILE');
    });
  }

  // 1-Click Multi-Account Switcher for Real Player Testing
  const quickLoginBtns = document.querySelectorAll('.btn-quick-login');
  quickLoginBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const name = btn.dataset.name;
      const email = btn.dataset.email;
      const role = btn.dataset.role;
      const avatar = btn.dataset.avatar;

      store.updateUserProfile({
        isLoggedIn: true,
        displayName: name,
        email: email,
        avatarUrl: avatar,
        isHost: role === 'HOST',
      });

      // Also ensure current user is reflected in activeRoom
      const room = store.getState().activeRoom;
      if (room) {
        let players = [...room.players];
        const existingIdx = players.findIndex((p) => p.name === name || p.role === role);
        if (existingIdx !== -1) {
          players[existingIdx] = { ...players[existingIdx], name, avatar, isReady: true };
        } else {
          players.push({
            id: `usr_${Date.now()}`,
            name,
            role,
            isReady: true,
            avatar,
          });
        }
        store.setState({ activeRoom: { ...room, players } });
      }

      closeAuthModal();
      store.setView('PROFILE');
    });
  });
}
