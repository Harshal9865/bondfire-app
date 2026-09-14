// ==============================================================================
// CONTEXTUAL AUTHENTICATION MODAL (SIGN IN / REGISTER)
// Explains the exact value proposition of an account with zero party friction
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { GoogleAuthService } from '../services/googleAuth.js';
import { signInWithGoogle, getSupabase } from '../services/supabaseClient.js';

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
    <div id="auth-modal-backdrop" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none">
      <div class="relative w-full max-w-[440px] bg-[#0E121E]/95 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,90,95,0.15)] text-on-surface overflow-y-auto max-h-[92vh] no-scrollbar">
        
        <!-- Ambient Decorative Campfire Glows -->
        <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-sunset-coral/25 blur-3xl pointer-events-none -z-10"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-amber-gold/20 blur-3xl pointer-events-none -z-10"></div>

        <!-- Luxury Header -->
        <div class="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sunset-coral via-[#FF7064] to-amber-gold p-[1.5px] shadow-glow-coral flex items-center justify-center shrink-0">
              <div class="w-full h-full bg-[#0B0E17] rounded-[14px] flex items-center justify-center text-amber-gold">
                <span class="material-symbols-outlined text-[20px] text-amber-gold drop-shadow-[0_0_8px_rgba(255,183,3,0.8)]">local_fire_department</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">Bondfire Identity</h3>
                <span class="px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider bg-amber-gold/15 text-amber-gold border border-amber-gold/30 flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[10px]">lock</span>
                  <span>Passport</span>
                </span>
              </div>
              <p class="text-[11px] text-gray-400 mt-0.5 font-medium">Encrypted Social Gaming Passport</p>
            </div>
          </div>
          <button id="btn-close-auth-modal" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" title="Close">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Contextual Value Perk Box -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-sunset-coral/10 via-amber-gold/10 to-transparent border border-sunset-coral/25 mb-4 flex items-start gap-3 relative z-10">
          <div class="w-7 h-7 rounded-xl bg-sunset-coral/20 text-sunset-coral flex items-center justify-center shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-[16px]">verified</span>
          </div>
          <div class="text-xs text-gray-300 leading-snug">
            <span class="text-white font-bold block mb-0.5">Why Sign In?</span>
            <span class="text-gray-300">${reason}</span>
          </div>
        </div>

        <!-- Segmented Tab Control -->
        <div class="flex p-1 bg-[#07090E]/90 rounded-full border border-white/10 mb-4 relative z-10" id="auth-tab-strip">
          <button type="button" id="tab-sign-in" class="flex-1 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-sunset-coral/20 to-amber-gold/20 text-white border border-sunset-coral/40 shadow-sm transition-all cursor-pointer">
            Sign In
          </button>
          <button type="button" id="tab-create-account" class="flex-1 py-2 text-xs font-bold rounded-full text-gray-400 hover:text-white border border-transparent transition-all cursor-pointer">
            Create Account
          </button>
        </div>

        <!-- Google Identity Services (GSI) Button & Native Chooser -->
        <div class="relative z-10 flex flex-col items-center gap-2 mb-4 w-full">
          <div id="google-official-btn-container" class="w-full flex justify-center items-center min-h-[44px]"></div>
          
          <button type="button" id="btn-google-auth-trigger" class="w-full py-3 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-sunset-coral/50 text-white text-xs font-bold flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.98] cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div class="relative z-10 flex items-center gap-3 mb-4">
          <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/15"></div>
          <span class="text-[9.5px] uppercase font-mono text-gray-400 font-bold tracking-widest">Or Email Credentials</span>
          <div class="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/15"></div>
        </div>

        <!-- Email Credentials Form -->
        <form id="auth-form" class="relative z-10 flex flex-col gap-3">
          <div id="name-field-container" class="hidden space-y-1">
            <label class="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">Your Name / Camper Handle</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-gray-500">person</span>
              <input type="text" id="auth-name-input" placeholder="e.g. Harshal" class="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0E17]/80 border border-white/10 focus:border-sunset-coral focus:ring-2 focus:ring-sunset-coral/20 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-gray-500">mail</span>
              <input type="email" id="auth-email-input" required value="" placeholder="name@domain.com" class="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0E17]/80 border border-white/10 focus:border-sunset-coral focus:ring-2 focus:ring-sunset-coral/20 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">Passkey or Password</label>
              <button type="button" id="btn-forgot-password" class="text-[10px] text-sunset-coral hover:underline font-mono">Forgot?</button>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-gray-500">key</span>
              <input type="password" id="auth-pass-input" required value="" placeholder="Secret passphrase" class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0E17]/80 border border-white/10 focus:border-sunset-coral focus:ring-2 focus:ring-sunset-coral/20 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all" />
              <button type="button" id="btn-toggle-password-visibility" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition-colors cursor-pointer" title="Toggle password visibility">
                <span class="material-symbols-outlined text-[18px]" id="password-visibility-icon">visibility</span>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="btn-submit-auth" class="w-full py-3.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold hover:brightness-110 text-canvas font-black text-xs uppercase tracking-wider shadow-glow-coral transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-1 cursor-pointer">
            <span class="material-symbols-outlined text-[17px]">bolt</span>
            <span id="auth-submit-label">Enter Bondfire Lounge</span>
          </button>
        </form>

        <!-- Guest Fallback Footer -->
        <div class="mt-4 pt-3 border-t border-white/10 text-center relative z-10">
          <button type="button" id="btn-continue-as-guest" class="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mx-auto">
            <span>Skip for now · Continue as Instant Guest</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
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
    googleBtn.addEventListener('click', async () => {
      audio.playChime();
      try {
        const oauthRes = await signInWithGoogle();
        if (oauthRes) return;
      } catch (err) {
        console.warn('Supabase OAuth redirect notice:', err);
      }

      // If OAuth redirect is not configured, use GoogleAuthService with fallback
      const signedInUser = GoogleAuthService.promptSignIn(null, () => {
        const emailInput = document.getElementById('auth-email-input');
        if (emailInput) emailInput.focus();
      });
      if (signedInUser) {
        audio.playCorrect();
        closeAuthModal();
        store.setView('PROFILE');
      }
    });
  }

  // Password Visibility Toggle
  const togglePassBtn = document.getElementById('btn-toggle-password-visibility');
  const passInput = document.getElementById('auth-pass-input');
  const passIcon = document.getElementById('password-visibility-icon');
  if (togglePassBtn && passInput && passIcon) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      passIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Forgot Password Handler
  const forgotBtn = document.getElementById('btn-forgot-password');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      audio.playClick();
      const emailInput = document.getElementById('auth-email-input');
      const email = emailInput?.value.trim();
      if (!email) {
        if (emailInput) {
          emailInput.focus();
          emailInput.placeholder = 'Enter email to reset password';
          emailInput.classList.add('ring-2', 'ring-sunset-coral');
          setTimeout(() => emailInput.classList.remove('ring-2', 'ring-sunset-coral'), 2000);
        }
        return;
      }
      const sb = getSupabase();
      if (sb) {
        sb.auth.resetPasswordForEmail(email);
      }
      alert(`Password reset link sent to ${email} if registered.`);
    });
  }

  // Tab Switcher
  const tabSignIn = document.getElementById('tab-sign-in');
  const tabCreate = document.getElementById('tab-create-account');
  const nameContainer = document.getElementById('name-field-container');
  const submitLabel = document.getElementById('auth-submit-label');

  if (tabSignIn && tabCreate && nameContainer && submitLabel) {
    const activeTabClass = 'flex-1 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-sunset-coral/20 to-amber-gold/20 text-white border border-sunset-coral/40 shadow-sm transition-all cursor-pointer';
    const inactiveTabClass = 'flex-1 py-2 text-xs font-bold rounded-full text-gray-400 hover:text-white border border-transparent transition-all cursor-pointer';

    tabSignIn.addEventListener('click', () => {
      audio.playClick();
      tabSignIn.className = activeTabClass;
      tabCreate.className = inactiveTabClass;
      nameContainer.classList.add('hidden');
      submitLabel.textContent = 'Enter Bondfire Lounge';
    });

    tabCreate.addEventListener('click', () => {
      audio.playClick();
      tabCreate.className = activeTabClass;
      tabSignIn.className = inactiveTabClass;
      nameContainer.classList.remove('hidden');
      submitLabel.textContent = 'Create Free Account & Sync Vault';
    });
  }

  // Form Submit (Supabase Email / Password)
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      audio.playCorrect();
      const email = document.getElementById('auth-email-input').value.trim();
      const name = document.getElementById('auth-name-input')?.value.trim() || email.split('@')[0];
      const pass = document.getElementById('auth-pass-input')?.value;

      // Authenticate via Supabase if available
      const sb = getSupabase();
      if (sb && pass) {
        try {
          const isSignUp = !nameContainer?.classList.contains('hidden');
          if (isSignUp) {
            await sb.auth.signUp({
              email,
              password: pass,
              options: { data: { full_name: name } },
            });
          } else {
            await sb.auth.signInWithPassword({ email, password: pass });
          }
        } catch (err) {
          console.warn('Supabase Auth note:', err.message);
        }
      }

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

}
