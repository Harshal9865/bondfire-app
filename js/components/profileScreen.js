// ==============================================================================
// PROFILE & ACCOUNT SETTINGS COMPONENT
// Complete user identity hub, avatar picker, subscription management & privacy center
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openPaymentModal } from './demoPaymentModal.js';
import { openAuthModal } from './authModal.js';
import { openSettingsModal } from './settingsModal.js';

const AVATAR_PRESETS = [
  { id: 'av_1', name: 'Flame Sprite', icon: 'local_fire_department', color: 'from-[#FF5A5F] to-[#FFB703]' },
  { id: 'av_2', name: 'Cyber Fox', icon: 'pets', color: 'from-[#FFB703] to-[#FB8500]' },
  { id: 'av_3', name: 'Arcade Ace', icon: 'stadia_controller', color: 'from-[#4ADE80] to-[#2EC4B6]' },
  { id: 'av_4', name: 'Neon Rose', icon: 'favorite', color: 'from-[#F72585] to-[#7209B7]' },
  { id: 'av_5', name: 'Cosmic Star', icon: 'auto_awesome', color: 'from-[#00F0FF] to-[#4361EE]' },
  { id: 'av_6', name: 'Glade S\'more', icon: 'lunch_dining', color: 'from-[#D4A373] to-[#CCD5AE]' },
  { id: 'av_7', name: 'Pixel Ghost', icon: 'blur_on', color: 'from-[#E0AAFF] to-[#C77DFF]' },
  { id: 'av_8', name: 'Diamond VIP', icon: 'diamond', color: 'from-[#2EC4B6] to-[#00F0FF]' },
];

export function renderProfileScreen() {
  const state = store.getState();
  const user = state.currentUser || {};
  const tier = user.tier || 'FREE';
  const sparks = user.sparks !== undefined ? user.sparks : 50;
  const stats = user.stats || { gamesHosted: 0, memoriesArchived: 0, yearbooksPrinted: 0, roastsWon: 0 };
  const privacy = user.privacy || { piiRedaction: true, privateVault: false, faceBlur: false };
  const pods = user.pods || [];
  const isLoggedIn = Boolean(user.isLoggedIn && user.email);
  const friends = state.friendsList || [];
  const onlineCount = friends.filter((f) => f.status === 'online').length;
  const incomingRequestsCount = (state.friendRequests?.incoming || []).length;

  return `
    <div class="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 select-none text-on-surface">
      
      <!-- Top Breadcrumb & Title -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 text-xs font-mono text-amber-gold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full ${isLoggedIn ? 'bg-mint-green' : 'bg-sunset-coral'} animate-pulse"></span>
            <span>${isLoggedIn ? 'Active Citizen Profile · Google Verified' : 'Guest Passport · Unregistered Explorer'}</span>
          </div>
          <h1 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Citizen Passport</span>
            <span class="retro-pixel-badge text-[9px] px-2.5 py-1 rounded-full ${tier === 'PRO' || tier === 'LIFETIME' ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 shadow-glow-coral' : 'bg-surface border border-border text-gray-400'} font-bold inline-flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-amber-gold">${tier === 'PRO' ? 'hotel_class' : (tier === 'LIFETIME' ? 'workspace_premium' : 'bolt')}</span>
              <span>${tier === 'PRO' ? 'Pod Pro Active' : (tier === 'LIFETIME' ? 'Lifetime VIP' : 'Free Spark')}</span>
            </span>
          </h1>
        </div>

        <!-- Quick Top Actions -->
        <div class="flex items-center gap-2.5">
          <button type="button" id="btn-profile-settings" class="px-3.5 py-2 rounded-full bg-surface border border-border hover:border-amber-gold/50 text-gray-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer" title="System Settings &amp; Preferences">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">settings</span>
            <span>Settings</span>
          </button>
          <button type="button" id="btn-profile-to-pricing" class="px-4 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">stars</span>
            <span>Manage Subscription</span>
          </button>
          <button type="button" id="btn-profile-logout" class="px-4 py-2 rounded-full bg-surface border border-border hover:border-sunset-coral/50 text-gray-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>${isLoggedIn ? 'Sign Out' : 'Reset Guest'}</span>
          </button>
        </div>
      </div>

      <!-- Main Profile Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left Column: Identity & Presets (5 Cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          
          <!-- Identity Summary Card -->
          <div class="relative bg-surface rounded-3xl border border-border/80 p-6 shadow-xl overflow-hidden">
            <div class="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-sunset-coral/10 blur-2xl pointer-events-none"></div>

            <div class="flex items-center gap-4 mb-5">
              <div class="relative group cursor-pointer" id="profile-avatar-wrapper" title="Click to Change Avatar">
                <div class="w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose shadow-glow-coral overflow-hidden flex items-center justify-center">
                  <div id="profile-avatar-display" class="w-full h-full rounded-[14px] overflow-hidden bg-surface-bright flex items-center justify-center text-white font-bold text-2xl">
                    ${user.avatarUrl ? `
                      <img src="${user.avatarUrl}" alt="${user.displayName || 'User'}" class="w-full h-full object-cover rounded-[14px]" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                      <span style="display:none;" class="w-full h-full items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'G').charAt(0).toUpperCase()}</span>
                    ` : `
                      <span class="w-full h-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'G').charAt(0).toUpperCase()}</span>
                    `}
                  </div>
                </div>
                <div class="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
              </div>

              <div class="flex flex-col flex-1">
                <h2 class="font-display text-xl font-bold text-white tracking-tight leading-tight">${user.displayName || 'Guest Player'}</h2>
                <span class="text-xs text-gray-400 font-medium truncate">${user.email || 'Unlinked Guest Account'}</span>
                
                ${!isLoggedIn ? `
                  <button type="button" id="btn-profile-connect-google-hero" class="mt-2 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 text-[11px] font-bold flex items-center gap-1.5 w-fit shadow-md transition-transform active:scale-95">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Connect Google Account</span>
                  </button>
                ` : `
                  <span class="text-[11px] text-amber-gold font-mono mt-1">Member since ${user.joinedDate || 'Jan 2026'}</span>
                `}
              </div>
            </div>

            <!-- Avatar Switcher Drawer (Preset Grid) -->
            <div class="pt-4 border-t border-border/70">
              <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">Switch Digital Avatar</span>
              <div class="grid grid-cols-4 gap-2" id="avatar-presets-grid">
                ${AVATAR_PRESETS.map((av) => `
                  <button type="button" class="avatar-preset-btn h-12 rounded-xl bg-gradient-to-br ${av.color} p-[1px] border border-border/60 hover:border-white transition-all active:scale-95 flex items-center justify-center text-white" data-name="${av.name}" title="${av.name}">
                    <div class="w-full h-full rounded-[11px] bg-canvas/80 hover:bg-canvas/50 flex items-center justify-center transition-colors">
                      <span class="material-symbols-outlined text-[20px]">${av.icon}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Display Name Edit Form -->
            <div class="pt-4 mt-4 border-t border-border/70 flex flex-col gap-2.5">
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
              <div class="flex items-center gap-2">
                <input type="text" id="profile-name-input" value="${user.displayName || 'Guest Player'}" class="flex-1 px-3 py-2 rounded-xl bg-canvas border border-border/80 text-sm text-white focus:outline-none focus:border-sunset-coral font-semibold" />
                <button type="button" id="btn-save-profile-name" class="px-4 py-2 rounded-xl bg-surface-bright hover:bg-sunset-coral hover:text-white text-xs font-bold text-gray-200 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Sparks & Pod Currency Balance -->
          <div class="bg-surface rounded-3xl border border-border/80 p-6 shadow-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold text-2xl">
                <span class="material-symbols-outlined text-amber-gold text-2xl">auto_awesome</span>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-arcade">Sparks Vault</span>
                <span class="font-room-code text-2xl font-bold text-white">${sparks.toLocaleString()}</span>
                <span class="text-xs text-gray-400 ml-1">Sparks</span>
              </div>
            </div>
            <button type="button" id="btn-buy-sparks" class="px-3.5 py-2 rounded-full bg-surface-container-high border border-border hover:border-amber-gold/50 text-xs font-bold text-amber-gold transition-colors">
              + Top Up Sparks
            </button>
          </div>

          <!-- Connected Cloud Accounts -->
          <div class="bg-surface rounded-3xl border border-border/80 p-6 shadow-xl flex flex-col gap-3">
            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Cloud Synchronizations</span>
            
            <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60">
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white">Google OAuth 2.0</span>
                  <span class="text-[10px] text-gray-400">${isLoggedIn ? '1-Tap Identity Linked' : 'Not Connected'}</span>
                </div>
              </div>
              ${isLoggedIn ? `
                <span class="px-2 py-0.5 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30 text-[10px] font-bold">CONNECTED</span>
              ` : `
                <button type="button" id="btn-profile-link-google-row" class="px-2.5 py-1 rounded-full bg-sunset-coral/20 hover:bg-sunset-coral hover:text-white text-sunset-coral border border-sunset-coral/40 text-[10px] font-bold transition-all">
                  LINK GOOGLE
                </button>
              `}
            </div>

            <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-mint-green text-[18px]">database</span>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white">Supabase Cloud PostgreSQL</span>
                  <span class="text-[10px] text-gray-400">Multi-User Memory Vault</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30 text-[10px] font-bold">ACTIVE · 100% ONLINE</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats, Pods, Privacy & Plan (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          
          <!-- 4-Metric Lifetime Stats Matrix -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-4 rounded-2xl bg-surface border border-border/80 flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Games Hosted</span>
              <span class="font-display text-2xl font-bold text-white mt-1">${stats.gamesHosted}</span>
              <span class="text-[10px] text-mint-green mt-0.5">Top 5% Pod Host</span>
            </div>

            <div class="p-4 rounded-2xl bg-surface border border-border/80 flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Memories Saved</span>
              <span class="font-display text-2xl font-bold text-amber-gold mt-1">${stats.memoriesArchived}</span>
              <span class="text-[10px] text-gray-400 mt-0.5">In Cloud Vault</span>
            </div>

            <div class="p-4 rounded-2xl bg-surface border border-border/80 flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Yearbooks</span>
              <span class="font-display text-2xl font-bold text-duo-rose mt-1">${stats.yearbooksPrinted}</span>
              <span class="text-[10px] text-gray-400 mt-0.5">Hardcover Editions</span>
            </div>

            <div class="p-4 rounded-2xl bg-surface border border-border/80 flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Roasts Won</span>
              <span class="font-display text-2xl font-bold text-sunset-coral mt-1">${stats.roastsWon}</span>
              <span class="text-[10px] text-sunset-coral mt-0.5">Voted by Pod</span>
            </div>
          </div>

          <!-- Friends & Social Squads Hub Banner -->
          <div class="bg-surface rounded-3xl border border-sunset-coral/30 p-6 shadow-xl relative overflow-hidden group">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-sunset-coral/10 blur-2xl pointer-events-none"></div>
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
                  <span class="material-symbols-outlined text-[26px]">diversity_3</span>
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <h3 class="font-headline-sm text-headline-sm font-bold text-white">Friends & Squads Lounge</h3>
                    ${incomingRequestsCount > 0 ? `
                      <span class="px-2 py-0.5 rounded-full bg-sunset-coral text-canvas text-[10px] font-bold animate-pulse">${incomingRequestsCount} New</span>
                    ` : ''}
                  </div>
                  <span class="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>${friends.length} Campers in Roster</span>
                    <span class="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span class="text-mint-green font-semibold">${onlineCount} Online Now</span>
                  </span>
                </div>
              </div>
              <button type="button" id="btn-profile-open-friends" class="px-4 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas text-xs font-bold shadow-glow-coral flex items-center gap-1.5 transition-all active:scale-95">
                <span>Enter Lounge</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- Squad & Pod Memberships List -->
          <div class="bg-surface rounded-3xl border border-border/80 p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sunset-coral text-[20px]">groups</span>
                <h3 class="font-headline-sm text-headline-sm font-bold text-white">Your Pods & Squads</h3>
              </div>
              <button type="button" id="btn-create-new-pod-profile" class="text-xs font-bold text-amber-gold hover:underline">
                + Create Pod
              </button>
            </div>

            <div class="flex flex-col gap-2.5">
              ${pods.map((pod) => `
                <div class="p-3.5 rounded-2xl bg-canvas border border-border/70 flex items-center justify-between hover:border-sunset-coral/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-surface-bright flex items-center justify-center text-lg">
                      <span class="material-symbols-outlined text-sunset-coral text-xl">groups</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-white">${pod.name}</span>
                      <span class="text-[11px] text-gray-400">${pod.memberCount} players enrolled</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${pod.role === 'HOST' ? 'bg-sunset-coral/20 text-sunset-coral' : 'bg-surface text-gray-400'}">${pod.role}</span>
                    <button type="button" class="btn-open-pod-lobby px-3 py-1.5 rounded-full bg-surface-bright hover:bg-sunset-coral hover:text-white text-xs font-bold text-gray-300 transition-colors">
                      Enter Lobby
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Privacy & Security Hardening Controls -->
          <div class="bg-surface rounded-3xl border border-border/80 p-6 shadow-xl">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-mint-green text-[20px]">shield</span>
              <h3 class="font-headline-sm text-headline-sm font-bold text-white">Privacy & Protection Controls</h3>
            </div>

            <div class="flex flex-col gap-3">
              <!-- Toggle 1: PII Redaction -->
              <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">PII Financial & Credit Card Redaction</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Automatically scrubs card numbers, addresses, and phone digits from uploaded screenshots.</span>
                </div>
                <input type="checkbox" id="toggle-pii" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.piiRedaction ? 'checked' : ''} />
              </div>

              <!-- Toggle 2: Private Vault -->
              <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">Private Vault Guard</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Only the host can reveal archived voice notes and memories during party gameplay.</span>
                </div>
                <input type="checkbox" id="toggle-vault" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.privateVault ? 'checked' : ''} />
              </div>

              <!-- Toggle 3: Face Blur -->
              <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">Client-Side Face Blur for Public Reels</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Blurs non-pod member faces when sharing highlight videos to TikTok or Instagram.</span>
                </div>
                <input type="checkbox" id="toggle-blur" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.faceBlur ? 'checked' : ''} />
              </div>

              <!-- Universal Settings Launcher -->
              <div class="pt-2">
                <button type="button" id="btn-profile-open-settings" class="w-full py-2.5 px-4 rounded-2xl bg-surface-bright hover:bg-surface border border-border hover:border-amber-gold/50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-[18px] text-amber-gold">tune</span>
                  <span>Open Universal Settings &amp; Audio Calibration Hub</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function bindProfileEvents() {
  const toastMount = document.getElementById('toast-mount');
  const triggerToast = (msg) => {
    audio.playCorrect();
    if (toastMount) {
      toastMount.innerHTML = `<div class="toast toast-mint show"><span>${msg}</span></div>`;
      setTimeout(() => (toastMount.innerHTML = ''), 2600);
    }
  };

  // Route to Pricing
  const toPricingBtn = document.getElementById('btn-profile-to-pricing');
  if (toPricingBtn) {
    toPricingBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('PRICING');
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('btn-profile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      audio.playClick();
      store.logoutUser();
      triggerToast('Signed out of Bondfire. Active session reset to guest.');
      setTimeout(() => {
        store.setView('HERO');
      }, 700);
    });
  }

  // Avatar Preset Switchers
  const avatarButtons = document.querySelectorAll('.avatar-preset-btn');
  const avatarDisplay = document.getElementById('profile-avatar-display');

  avatarButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const url = btn.dataset.url;
      if (avatarDisplay) avatarDisplay.src = url;

      avatarButtons.forEach((b) => b.classList.remove('border-amber-gold', 'shadow-glow-amber', 'scale-105'));
      btn.classList.add('border-amber-gold', 'shadow-glow-amber', 'scale-105');

      store.updateUserProfile({ avatarUrl: url });
      triggerToast('Avatar updated! Synced across all your pods');
    });
  });

  // Display Name Save
  const saveNameBtn = document.getElementById('btn-save-profile-name');
  const nameInput = document.getElementById('profile-name-input');
  if (saveNameBtn && nameInput) {
    saveNameBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim();
      if (newName.length > 0) {
        audio.playClick();
        store.updateUserProfile({ displayName: newName });
        triggerToast(`Display name updated to "${newName}"!`);
      }
    });
  }

  // Top Up Sparks Button
  const buySparksBtn = document.getElementById('btn-buy-sparks');
  if (buySparksBtn) {
    buySparksBtn.addEventListener('click', () => {
      audio.playClick();
      openPaymentModal({
        item: '500 Sparks Vault Pack',
        price: 4.99,
        originalPrice: 7.99,
        discountText: 'Special Spark Bonus: +100 Free Sparks',
        tier: 'PRO',
      });
    });
  }

  // Enter Pod Lobby
  const podLobbyBtns = document.querySelectorAll('.btn-open-pod-lobby');
  podLobbyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      store.setMode('PODS');
      store.setView('LOBBY');
    });
  });

  // Create New Pod
  const createPodBtn = document.getElementById('btn-create-new-pod-profile');
  if (createPodBtn) {
    createPodBtn.addEventListener('click', () => {
      audio.playClick();
      store.setMode('PODS');
      store.setView('LOBBY');
    });
  }

  // Open Friends Lounge
  const openFriendsBtn = document.getElementById('btn-profile-open-friends');
  if (openFriendsBtn) {
    openFriendsBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('FRIENDS');
    });
  }

  // Privacy Toggles
  const piiToggle = document.getElementById('toggle-pii');
  const vaultToggle = document.getElementById('toggle-vault');
  const blurToggle = document.getElementById('toggle-blur');

  const updatePrivacy = () => {
    store.updateUserProfile({
      privacy: {
        piiRedaction: piiToggle ? piiToggle.checked : true,
        privateVault: vaultToggle ? vaultToggle.checked : false,
        faceBlur: blurToggle ? blurToggle.checked : false,
      },
    });
    triggerToast('Privacy security parameters updated.');
  };

  if (piiToggle) piiToggle.addEventListener('change', updatePrivacy);
  if (vaultToggle) vaultToggle.addEventListener('change', updatePrivacy);
  if (blurToggle) blurToggle.addEventListener('change', updatePrivacy);

  // Settings Modal Triggers
  const topSettingsBtn = document.getElementById('btn-profile-settings');
  const bottomSettingsBtn = document.getElementById('btn-profile-open-settings');

  const handleOpenSettings = () => {
    audio.playClick();
    openSettingsModal('audio');
  };

  if (topSettingsBtn) topSettingsBtn.addEventListener('click', handleOpenSettings);
  if (bottomSettingsBtn) bottomSettingsBtn.addEventListener('click', handleOpenSettings);
}
