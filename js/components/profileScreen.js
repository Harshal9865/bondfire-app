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
  { id: 'av_1', name: 'Flame Sprite', icon: 'local_fire_department', color: 'from-[#FF5A5F] to-[#FFB703]', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FlameSprite&backgroundColor=ff5a5f,ffb703' },
  { id: 'av_2', name: 'Cyber Fox', icon: 'pets', color: 'from-[#FFB703] to-[#FB8500]', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberFox&backgroundColor=ffb703,fb8500' },
  { id: 'av_3', name: 'Arcade Ace', icon: 'stadia_controller', color: 'from-[#4ADE80] to-[#2EC4B6]', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ArcadeAce&backgroundColor=4ade80,2ec4b6' },
  { id: 'av_4', name: 'Neon Rose', icon: 'favorite', color: 'from-[#F72585] to-[#7209B7]', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=NeonRose&backgroundColor=f72585,7209b7' },
  { id: 'av_5', name: 'Cosmic Star', icon: 'auto_awesome', color: 'from-[#00F0FF] to-[#4361EE]', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CosmicStar&backgroundColor=00f0ff,4361ee' },
  { id: 'av_6', name: 'Glade S\'more', icon: 'lunch_dining', color: 'from-[#D4A373] to-[#CCD5AE]', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=GladeSmore&backgroundColor=d4a373,ccd5ae' },
  { id: 'av_7', name: 'Pixel Ghost', icon: 'blur_on', color: 'from-[#E0AAFF] to-[#C77DFF]', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelGhost&backgroundColor=e0aaff,c77dff' },
  { id: 'av_8', name: 'Diamond VIP', icon: 'diamond', color: 'from-[#2EC4B6] to-[#00F0FF]', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DiamondVIP&backgroundColor=2ec4b6,00f0ff' },
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
        <div class="flex items-center gap-2.5 flex-wrap">
          <button type="button" id="btn-profile-settings" class="px-3.5 py-2 rounded-full bg-surface border border-border hover:border-amber-gold/50 text-gray-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer" title="System Settings & Preferences">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">settings</span>
            <span>Settings</span>
          </button>
          <button type="button" id="btn-profile-to-pricing" class="px-4 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">stars</span>
            <span>Manage Subscription</span>
          </button>
          <button type="button" id="btn-profile-logout" class="px-4 py-2 rounded-full bg-surface border border-border hover:border-sunset-coral/50 text-gray-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
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
              <!-- Avatar Display & Interactive Trigger -->
              <div class="relative group cursor-pointer shrink-0" id="profile-avatar-wrapper" title="Click to Upload Photo or Change Avatar">
                <div class="w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose shadow-glow-coral overflow-hidden flex items-center justify-center">
                  <div id="profile-avatar-display" class="w-full h-full rounded-[14px] overflow-hidden bg-surface-bright flex items-center justify-center text-white font-bold text-2xl relative">
                    ${user.avatarUrl ? `
                      <img src="${user.avatarUrl}" alt="${user.displayName || 'User'}" class="w-full h-full object-cover rounded-[14px]" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                      <span style="display:none;" class="w-full h-full items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'G').charAt(0).toUpperCase()}</span>
                    ` : `
                      <span class="w-full h-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'G').charAt(0).toUpperCase()}</span>
                    `}
                  </div>
                </div>
                <div class="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity gap-0.5">
                  <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span class="text-[8px] font-bold uppercase tracking-wider">Change</span>
                </div>
              </div>

              <!-- Hidden File Input for Direct Local Image Upload -->
              <input type="file" id="profile-avatar-file-input" accept="image/png, image/jpeg, image/webp, image/gif" class="hidden" />

              <div class="flex flex-col flex-1 min-w-0">
                <h2 class="font-display text-xl font-bold text-white tracking-tight leading-tight truncate" id="profile-display-name-text">${user.displayName || 'Guest Player'}</h2>
                <span class="text-xs text-gray-400 font-medium truncate">${user.email || 'Unlinked Guest Passport'}</span>
                
                ${!isLoggedIn ? `
                  <button type="button" id="btn-profile-connect-google-hero" class="mt-2 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 text-[11px] font-bold flex items-center gap-1.5 w-fit shadow-md transition-transform active:scale-95 cursor-pointer">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Connect Google Account</span>
                  </button>
                ` : `
                  <span class="text-[11px] text-amber-gold font-mono mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px] text-mint-green">verified</span>
                    <span>Member since ${user.joinedDate || 'Jan 2026'}</span>
                  </span>
                `}
              </div>
            </div>

            <!-- Avatar Action Toolbar -->
            <div class="flex items-center gap-2 mb-4">
              <button type="button" id="btn-upload-avatar-file" class="flex-1 py-1.5 px-2.5 rounded-xl bg-surface-bright hover:bg-surface border border-border/80 hover:border-sunset-coral/50 text-[11px] font-bold text-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[15px] text-sunset-coral">upload_file</span>
                <span>Upload Photo</span>
              </button>
              <button type="button" id="btn-roll-random-avatar" class="flex-1 py-1.5 px-2.5 rounded-xl bg-surface-bright hover:bg-surface border border-border/80 hover:border-amber-gold/50 text-[11px] font-bold text-amber-gold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">casino</span>
                <span>🎲 Roll Avatar</span>
              </button>
              <button type="button" id="btn-custom-avatar-url" class="py-1.5 px-2.5 rounded-xl bg-surface-bright hover:bg-surface border border-border/80 hover:border-mint-green/50 text-[11px] font-bold text-gray-300 transition-all flex items-center justify-center gap-1 cursor-pointer" title="Paste Avatar Image URL">
                <span class="material-symbols-outlined text-[15px] text-mint-green">link</span>
              </button>
            </div>

            <!-- Avatar Switcher Drawer (Preset Grid) -->
            <div class="pt-4 border-t border-border/70">
              <div class="flex items-center justify-between mb-2.5">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Cyber Avatar Presets</span>
                <span class="text-[10px] text-gray-500 font-mono">8 Styles Available</span>
              </div>
              <div class="grid grid-cols-4 gap-2" id="avatar-presets-grid">
                ${AVATAR_PRESETS.map((av) => `
                  <button type="button" class="avatar-preset-btn h-12 rounded-xl bg-gradient-to-br ${av.color} p-[1px] border border-border/60 hover:border-white transition-all active:scale-95 flex items-center justify-center text-white cursor-pointer ${user.avatarUrl === av.url ? 'ring-2 ring-amber-gold scale-105 shadow-glow-amber' : ''}" data-url="${av.url}" data-name="${av.name}" title="${av.name}">
                    <div class="w-full h-full rounded-[11px] bg-canvas/80 hover:bg-canvas/50 flex items-center justify-center transition-colors">
                      <span class="material-symbols-outlined text-[20px]">${av.icon}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Display Name Edit Form -->
            <div class="pt-4 mt-4 border-t border-border/70 flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <label for="profile-name-input" class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
                <span class="text-[10px] text-gray-500 font-mono">Press Enter to save</span>
              </div>
              <div class="flex items-center gap-2">
                <input type="text" id="profile-name-input" value="${user.displayName || 'Guest Player'}" maxlength="32" class="flex-1 px-3 py-2 rounded-xl bg-canvas border border-border/80 text-sm text-white focus:outline-none focus:border-sunset-coral font-semibold transition-colors" placeholder="Enter citizen name..." />
                <button type="button" id="btn-save-profile-name" class="px-4 py-2 rounded-xl bg-surface-bright hover:bg-sunset-coral hover:text-white text-xs font-bold text-gray-200 transition-all cursor-pointer flex items-center gap-1">
                  <span>Save</span>
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
                <span class="font-room-code text-2xl font-bold text-white" id="profile-sparks-count">${sparks.toLocaleString()}</span>
                <span class="text-xs text-gray-400 ml-1">Sparks</span>
              </div>
            </div>
            <button type="button" id="btn-buy-sparks" class="px-3.5 py-2 rounded-full bg-surface-container-high border border-border hover:border-amber-gold/50 text-xs font-bold text-amber-gold transition-all active:scale-95 cursor-pointer flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              <span>Top Up Sparks</span>
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
                  <span class="text-[10px] text-gray-400">${isLoggedIn ? (user.email || '1-Tap Identity Linked') : 'Not Connected'}</span>
                </div>
              </div>
              ${isLoggedIn ? `
                <span class="px-2 py-0.5 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30 text-[10px] font-bold">CONNECTED</span>
              ` : `
                <button type="button" id="btn-profile-link-google-row" class="px-2.5 py-1 rounded-full bg-sunset-coral/20 hover:bg-sunset-coral hover:text-white text-sunset-coral border border-sunset-coral/40 text-[10px] font-bold transition-all cursor-pointer">
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
              <button type="button" id="btn-profile-open-friends" class="px-4 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas text-xs font-bold shadow-glow-coral flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
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
              <button type="button" id="btn-create-new-pod-profile" class="text-xs font-bold text-amber-gold hover:underline cursor-pointer flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">add</span>
                <span>Create Pod</span>
              </button>
            </div>

            <div class="flex flex-col gap-2.5" id="profile-pods-list">
              ${pods.length > 0 ? pods.map((pod) => `
                <div class="p-3.5 rounded-2xl bg-canvas border border-border/70 flex items-center justify-between hover:border-sunset-coral/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-surface-bright flex items-center justify-center text-lg">
                      <span class="material-symbols-outlined text-sunset-coral text-xl">groups</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-white">${pod.name}</span>
                      <span class="text-[11px] text-gray-400">${pod.memberCount || 1} players enrolled</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${pod.role === 'HOST' ? 'bg-sunset-coral/20 text-sunset-coral' : 'bg-surface text-gray-400'}">${pod.role || 'MEMBER'}</span>
                    <button type="button" class="btn-open-pod-lobby px-3 py-1.5 rounded-full bg-surface-bright hover:bg-sunset-coral hover:text-white text-xs font-bold text-gray-300 transition-colors cursor-pointer" data-name="${pod.name}">
                      Enter Lobby
                    </button>
                  </div>
                </div>
              `).join('') : `
                <div class="p-4 rounded-2xl bg-canvas/60 border border-dashed border-border text-center flex flex-col items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-gray-500 text-2xl">group_add</span>
                  <span class="text-xs text-gray-400">No custom squads created yet.</span>
                  <button type="button" id="btn-empty-create-pod" class="text-xs font-bold text-amber-gold hover:underline cursor-pointer">
                    + Create your first Squad Pod
                  </button>
                </div>
              `}
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
              <label class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60 cursor-pointer hover:border-border transition-colors">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">PII Financial & Credit Card Redaction</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Automatically scrubs card numbers, addresses, and phone digits from uploaded screenshots.</span>
                </div>
                <input type="checkbox" id="toggle-pii" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.piiRedaction ? 'checked' : ''} />
              </label>

              <!-- Toggle 2: Private Vault -->
              <label class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60 cursor-pointer hover:border-border transition-colors">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">Private Vault Guard</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Only the host can reveal archived voice notes and memories during party gameplay.</span>
                </div>
                <input type="checkbox" id="toggle-vault" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.privateVault ? 'checked' : ''} />
              </label>

              <!-- Toggle 3: Face Blur -->
              <label class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border/60 cursor-pointer hover:border-border transition-colors">
                <div class="flex flex-col pr-4">
                  <span class="text-xs font-bold text-white">Client-Side Face Blur for Public Reels</span>
                  <span class="text-[11px] text-gray-400 leading-snug">Blurs non-pod member faces when sharing highlight videos to TikTok or Instagram.</span>
                </div>
                <input type="checkbox" id="toggle-blur" class="w-5 h-5 accent-sunset-coral rounded cursor-pointer" ${privacy.faceBlur ? 'checked' : ''} />
              </label>

              <!-- Universal Settings Launcher -->
              <div class="pt-2">
                <button type="button" id="btn-profile-open-settings" class="w-full py-2.5 px-4 rounded-2xl bg-surface-bright hover:bg-surface border border-border hover:border-amber-gold/50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-[18px] text-amber-gold">tune</span>
                  <span>Open Universal Settings & Audio Calibration Hub</span>
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
      setTimeout(() => {
        if (toastMount) toastMount.innerHTML = '';
      }, 2600);
    }
  };

  const updateAvatarDisplay = (url, name) => {
    const avatarDisplay = document.getElementById('profile-avatar-display');
    if (avatarDisplay) {
      if (url) {
        avatarDisplay.innerHTML = `
          <img src="${url}" alt="${name || 'User Avatar'}" class="w-full h-full object-cover rounded-[14px]" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <span style="display:none;" class="w-full h-full items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(name || 'G').charAt(0).toUpperCase()}</span>
        `;
      } else {
        avatarDisplay.innerHTML = `
          <span class="w-full h-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(name || 'G').charAt(0).toUpperCase()}</span>
        `;
      }
    }
  };

  // 1. Route to Pricing
  const toPricingBtn = document.getElementById('btn-profile-to-pricing');
  if (toPricingBtn) {
    toPricingBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('PRICING');
    });
  }

  // 2. Logout / Reset Guest Button
  const logoutBtn = document.getElementById('btn-profile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      audio.playClick();
      store.logoutUser();
      triggerToast('Signed out of Bondfire. Session reset to guest explorer.');
      setTimeout(() => {
        store.setView('HERO');
      }, 600);
    });
  }

  // 3. Avatar Image Upload via File Input & Compressor
  const avatarWrapper = document.getElementById('profile-avatar-wrapper');
  const avatarFileInput = document.getElementById('profile-avatar-file-input');
  const uploadAvatarBtn = document.getElementById('btn-upload-avatar-file');

  const triggerFileUpload = () => {
    audio.playClick();
    if (avatarFileInput) avatarFileInput.click();
  };

  if (avatarWrapper) avatarWrapper.addEventListener('click', triggerFileUpload);
  if (uploadAvatarBtn) uploadAvatarBtn.addEventListener('click', triggerFileUpload);

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Off-screen canvas compression to 256x256 max
          const canvas = document.createElement('canvas');
          const maxDim = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          store.updateUserProfile({ avatarUrl: compressedDataUrl });
          updateAvatarDisplay(compressedDataUrl, store.getState().currentUser?.displayName);
          triggerToast('Profile photo uploaded and synced!');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // 4. Random Dicebear Avatar Roll
  const rollRandomAvatarBtn = document.getElementById('btn-roll-random-avatar');
  if (rollRandomAvatarBtn) {
    rollRandomAvatarBtn.addEventListener('click', () => {
      audio.playChime();
      const styles = ['avataaars', 'bottts', 'lorelei', 'pixel-art', 'adventurer', 'fun-emoji'];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const seed = 'Bondfire_' + Math.random().toString(36).substring(2, 8);
      const randomUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

      store.updateUserProfile({ avatarUrl: randomUrl });
      updateAvatarDisplay(randomUrl, store.getState().currentUser?.displayName);
      triggerToast(`🎲 Rolled new ${style} digital avatar!`);
    });
  }

  // 5. Custom Image URL Prompt
  const customUrlBtn = document.getElementById('btn-custom-avatar-url');
  if (customUrlBtn) {
    customUrlBtn.addEventListener('click', () => {
      audio.playClick();
      const currentUrl = store.getState().currentUser?.avatarUrl || '';
      const newUrl = window.prompt('Enter your custom avatar image or GIF URL:', currentUrl);
      if (newUrl && newUrl.trim().length > 0) {
        const cleanUrl = newUrl.trim();
        store.updateUserProfile({ avatarUrl: cleanUrl });
        updateAvatarDisplay(cleanUrl, store.getState().currentUser?.displayName);
        triggerToast('Custom avatar URL set successfully!');
      }
    });
  }

  // 6. Preset Avatars Switcher
  const avatarButtons = document.querySelectorAll('.avatar-preset-btn');
  avatarButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const url = btn.dataset.url;
      const name = btn.dataset.name;
      if (!url) return;

      avatarButtons.forEach((b) => b.classList.remove('ring-2', 'ring-amber-gold', 'scale-105', 'shadow-glow-amber'));
      btn.classList.add('ring-2', 'ring-amber-gold', 'scale-105', 'shadow-glow-amber');

      store.updateUserProfile({ avatarUrl: url });
      updateAvatarDisplay(url, store.getState().currentUser?.displayName);
      triggerToast(`Avatar updated to "${name}"!`);
    });
  });

  // 7. Display Name Save (Button + Enter Key)
  const saveNameBtn = document.getElementById('btn-save-profile-name');
  const nameInput = document.getElementById('profile-name-input');
  const displayNameText = document.getElementById('profile-display-name-text');

  const handleSaveName = () => {
    if (!nameInput) return;
    const newName = nameInput.value.trim();
    if (newName.length >= 2) {
      audio.playClick();
      store.updateUserProfile({ displayName: newName });
      if (displayNameText) displayNameText.textContent = newName;
      if (saveNameBtn) {
        saveNameBtn.innerHTML = '<span class="material-symbols-outlined text-xs text-mint-green">check</span> Saved!';
        setTimeout(() => {
          if (saveNameBtn) saveNameBtn.innerHTML = 'Save';
        }, 1500);
      }
      triggerToast(`Display name updated to "${newName}"!`);
    } else {
      alert('Please enter a display name with at least 2 characters.');
    }
  };

  if (saveNameBtn) saveNameBtn.addEventListener('click', handleSaveName);
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSaveName();
    });
  }

  // 8. Connect Google Account Triggers (Hero & Row)
  const heroGoogleBtn = document.getElementById('btn-profile-connect-google-hero');
  const rowGoogleBtn = document.getElementById('btn-profile-link-google-row');

  const handleGoogleConnect = () => {
    audio.playClick();
    openAuthModal('Connect your Google Account to unlock cloud sync, memories vault, and host superpowers');
  };

  if (heroGoogleBtn) heroGoogleBtn.addEventListener('click', handleGoogleConnect);
  if (rowGoogleBtn) rowGoogleBtn.addEventListener('click', handleGoogleConnect);

  // 9. Top Up Sparks Button
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

  // 10. Create New Squad Pod
  const createPodBtn = document.getElementById('btn-create-new-pod-profile');
  const emptyCreatePodBtn = document.getElementById('btn-empty-create-pod');

  const handleCreatePod = () => {
    audio.playClick();
    const defaultName = `Squad Pod #${Math.floor(100 + Math.random() * 900)}`;
    const podName = window.prompt('Enter your new Squad / Pod Name:', defaultName);
    if (podName && podName.trim().length > 0) {
      store.createPod({ name: podName.trim() });
      triggerToast(`Squad "${podName.trim()}" created successfully!`);
      setTimeout(() => {
        store.setView('PROFILE');
      }, 500);
    }
  };

  if (createPodBtn) createPodBtn.addEventListener('click', handleCreatePod);
  if (emptyCreatePodBtn) emptyCreatePodBtn.addEventListener('click', handleCreatePod);

  // 11. Enter Pod Lobby
  const podLobbyBtns = document.querySelectorAll('.btn-open-pod-lobby');
  podLobbyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      store.setMode('PODS');
      store.setView('LOBBY');
    });
  });

  // 12. Open Friends Lounge
  const openFriendsBtn = document.getElementById('btn-profile-open-friends');
  if (openFriendsBtn) {
    openFriendsBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('FRIENDS');
    });
  }

  // 13. Privacy Toggles
  const piiToggle = document.getElementById('toggle-pii');
  const vaultToggle = document.getElementById('toggle-vault');
  const blurToggle = document.getElementById('toggle-blur');

  const updatePrivacy = () => {
    audio.playClick();
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

  // 14. Settings Modal Triggers
  const topSettingsBtn = document.getElementById('btn-profile-settings');
  const bottomSettingsBtn = document.getElementById('btn-profile-open-settings');

  const handleOpenSettings = () => {
    audio.playClick();
    openSettingsModal('audio');
  };

  if (topSettingsBtn) topSettingsBtn.addEventListener('click', handleOpenSettings);
  if (bottomSettingsBtn) bottomSettingsBtn.addEventListener('click', handleOpenSettings);
}
