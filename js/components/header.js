// ==============================================================================
// GLOBAL LUXURY HEADER & NAVIGATION COMPONENT
// Single-tier Warm Analog Cyber Header with sleek glassmorphism & zero emoji clutter
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { GoogleAuthService } from '../services/googleAuth.js';
import { openAuthModal } from './authModal.js';

export function renderHeader() {
  const state = store.getState();
  const currentMode = state.activeMode;
  const currentView = state.currentView;
  const user = state.currentUser;

  return `
    <header class="sticky top-0 w-full z-50 bg-[#0B0E17]/85 backdrop-blur-2xl border-b border-[#262B40]/70 select-none transition-all duration-300">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        
        <!-- Left: Brand Identity -->
        <div class="flex items-center gap-3 cursor-pointer group" id="nav-brand-logo">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose p-[1.5px] shadow-glow-coral flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
            <div class="w-full h-full bg-canvas rounded-[10px] flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 13.8 6.2 16 8.5C18.2 10.8 21 12 21 12C21 12 18.2 13.2 16 15.5C13.8 17.8 12 22 12 22C12 22 10.2 17.8 8 15.5C5.8 13.2 3 12 3 12C3 12 5.8 10.8 8 8.5C10.2 6.2 12 2 12 2Z"></path>
                <circle class="text-sunset-coral" cx="12" cy="12" fill="currentColor" r="2.5"></circle>
              </svg>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2 leading-none">
              Bondfire
              <span class="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">Beta</span>
            </span>
            <span class="text-[11px] text-gray-400 mt-1 font-medium tracking-wide">formerly Huddle</span>
          </div>
        </div>

        <!-- Center: Curated Single-Deck Navigation Capsule -->
        <nav class="hidden lg:flex items-center p-1 rounded-full glass-pill border border-border/80 shadow-lg shadow-black/40">
          <!-- Mode Switcher Segment -->
          <div class="flex items-center gap-1 p-0.5 bg-surface-dark/60 rounded-full border border-border/60" id="header-mode-switcher">
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${currentMode === 'SOLO' ? 'bg-surface-bright text-white shadow-sm border border-amber-gold/40' : 'text-gray-400 hover:text-white'} transition-all" data-mode="SOLO">
              <span class="material-symbols-outlined text-[15px] ${currentMode === 'SOLO' ? 'text-amber-gold' : ''}">person</span>
              <span>Solo</span>
            </button>
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${currentMode === 'US' ? 'bg-surface-bright text-white shadow-sm border border-duo-rose/40' : 'text-gray-400 hover:text-duo-rose'} transition-all" data-mode="US">
              <span class="material-symbols-outlined text-[15px] ${currentMode === 'US' ? 'text-duo-rose' : ''}">favorite</span>
              <span>Us Mode</span>
            </button>
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${currentMode === 'PODS' ? 'bg-surface-bright text-white shadow-sm border border-sunset-coral/40' : 'text-gray-400 hover:text-white'} relative transition-all" data-mode="PODS">
              ${currentMode === 'PODS' ? '<span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-ping absolute -top-0.5 -right-0.5"></span>' : ''}
              <span class="material-symbols-outlined text-[15px] ${currentMode === 'PODS' ? 'text-sunset-coral' : ''}">groups</span>
              <span>Pods</span>
            </button>
          </div>

          <!-- Subtle Vertical Divider -->
          <div class="w-[1px] h-4 bg-border/80 mx-2"></div>

          <!-- Direct Primary Experiences Links -->
          <div class="flex items-center gap-1 pr-1" id="header-links">
            <button class="nav-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${currentView === 'VAULT' ? 'text-white bg-surface-bright/80 font-bold' : 'text-gray-400 hover:text-gray-200'} transition-all" data-view="VAULT">
              <span class="material-symbols-outlined text-[15px] text-tertiary">folder</span>
              <span>Vault</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${currentView === 'YEARBOOK' ? 'text-white bg-surface-bright/80 font-bold' : 'text-gray-400 hover:text-gray-200'} transition-all" data-view="YEARBOOK">
              <span class="material-symbols-outlined text-[15px] text-amber-gold">auto_stories</span>
              <span>Photobook</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${currentView === 'FRIENDS' ? 'text-sunset-coral bg-sunset-coral/10 border border-sunset-coral/30 font-bold' : 'text-gray-400 hover:text-sunset-coral'} transition-all" data-view="FRIENDS">
              <span class="material-symbols-outlined text-[15px] text-sunset-coral">diversity_3</span>
              <span>Friends</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${currentView === 'GLADE' ? 'text-mint-green bg-mint-green/10 border border-mint-green/30 font-bold' : 'text-gray-400 hover:text-mint-green'} transition-all" data-view="GLADE">
              <span class="material-symbols-outlined text-[15px] text-mint-green">stadia_controller</span>
              <span>Pixel Glade</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${currentView === 'STORE' ? 'text-white bg-surface-bright/80 font-bold' : 'text-gray-400 hover:text-gray-200'} transition-all" data-view="STORE">
              <span class="material-symbols-outlined text-[15px] text-secondary">shopping_bag</span>
              <span>Emporium</span>
            </button>
          </div>
        </nav>

        <!-- Right: Action Suite -->
        <div class="flex items-center gap-3">
          <!-- Audio Synthesizer Toggle -->
          <button class="w-9 h-9 rounded-full bg-surface border border-border/80 text-gray-400 hover:text-white hover:border-amber-gold/50 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95" id="btn-sound-toggle" title="Toggle Procedural Audio">
            <span class="material-symbols-outlined text-[18px]">${state.soundEnabled ? 'volume_up' : 'volume_off'}</span>
          </button>

          <!-- Room Code Quick Pill -->
          <div class="hidden sm:flex items-center p-1 rounded-full bg-surface border border-border focus-within:border-sunset-coral/70 transition-colors shadow-inner">
            <div class="pl-3 pr-1 text-xs font-mono text-sunset-coral font-bold flex items-center gap-1">
              <span>#</span>
              <input type="text" id="quick-join-input" placeholder="CODE" maxlength="4" class="w-14 bg-transparent text-xs font-room-code font-bold uppercase text-white placeholder:text-gray-600 focus:outline-none tracking-wider" />
            </div>
            <button class="px-3 py-1 rounded-full bg-surface-bright hover:bg-sunset-coral hover:text-white text-gray-300 text-xs font-bold transition-all active:scale-95" id="btn-quick-join">
              JOIN
            </button>
          </div>

          <!-- Primary CTA Button -->
          <button class="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-bold text-xs sm:text-sm shadow-glow-coral hover:shadow-glow-amber transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2" id="btn-header-create-room">
            <span class="relative z-10 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>Create Room</span>
            </span>
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <!-- User Profile / Auth Trigger -->
          ${user.isLoggedIn && user.email ? `
            <div class="relative group cursor-pointer" id="header-user-profile" title="${user.displayName || 'Citizen Profile'}">
              <div class="w-9 h-9 rounded-full border-2 border-sunset-coral/50 overflow-hidden shrink-0 shadow hover:border-amber-gold transition-colors flex items-center justify-center bg-surface-bright text-xs font-bold text-white">
                ${user.avatarUrl ? `
                  <img src="${user.avatarUrl}" alt="${user.displayName || 'User'}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <span style="display:none;" class="w-full h-full items-center justify-center font-bold text-xs bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'U').charAt(0).toUpperCase()}</span>
                ` : `
                  <span class="w-full h-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-sunset-coral to-amber-gold text-canvas">${(user.displayName || 'U').charAt(0).toUpperCase()}</span>
                `}
              </div>
              <span class="w-2.5 h-2.5 rounded-full bg-mint-green border-2 border-canvas absolute -bottom-0.5 -right-0.5" title="Verified Online"></span>
            </div>
          ` : `
            <button class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border/80 hover:border-sunset-coral/70 text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95 shadow-sm" id="header-user-profile" title="Sign In with Google">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span class="hidden sm:inline">Sign In</span>
            </button>
          `}

          <!-- Mobile Menu Drawer Toggle -->
          <button class="lg:hidden w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-gray-300 hover:text-white transition-colors" id="btn-mobile-menu" title="Menu">
            <span class="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer (Sleek modal on small screens, hidden by default) -->
      <div id="mobile-drawer" class="lg:hidden fixed inset-x-0 top-20 bg-canvas/95 backdrop-blur-2xl border-b border-border/80 p-5 shadow-2xl transition-all duration-300 z-50 max-h-[calc(100vh-80px)] overflow-y-auto" style="display: none;">
        <div class="flex flex-col gap-3">
          <!-- Mobile Quick Join Pill -->
          <div class="p-2 rounded-xl bg-surface border border-border focus-within:border-sunset-coral/80 flex items-center justify-between gap-2 shadow-sm">
            <div class="flex items-center gap-1.5 pl-2 text-xs font-mono text-gray-400 flex-1 min-w-0">
              <span class="text-sunset-coral font-bold font-mono">#</span>
              <input type="text" id="drawer-quick-join-input" placeholder="ROOM CODE" maxlength="8" class="bg-transparent border-none text-white font-bold tracking-widest text-xs focus:outline-none w-full uppercase placeholder:text-gray-500 font-room-code" />
            </div>
            <button id="btn-drawer-quick-join" class="px-3.5 py-1.5 rounded-lg bg-sunset-coral text-white font-bold text-xs shadow-glow-coral active:scale-95 shrink-0">
              Join
            </button>
          </div>

          <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-1">Modes</div>
          <div class="grid grid-cols-3 gap-2">
            <button class="mobile-nav-btn p-2.5 rounded-xl bg-surface border border-border text-center text-xs font-semibold text-gray-200 flex flex-col items-center gap-1" data-mode="SOLO" data-view="SOLO">
              <span class="material-symbols-outlined text-amber-gold text-[18px]">person</span>
              <span>Solo</span>
            </button>
            <button class="mobile-nav-btn p-2.5 rounded-xl bg-surface border border-border text-center text-xs font-semibold text-gray-200 flex flex-col items-center gap-1" data-mode="US" data-view="COUPLE">
              <span class="material-symbols-outlined text-duo-rose text-[18px]">favorite</span>
              <span>Us Mode</span>
            </button>
            <button class="mobile-nav-btn p-2.5 rounded-xl bg-surface border border-border text-center text-xs font-semibold text-gray-200 flex flex-col items-center gap-1" data-mode="PODS" data-view="LOBBY">
              <span class="material-symbols-outlined text-sunset-coral text-[18px]">groups</span>
              <span>Pods</span>
            </button>
          </div>

          <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1">Experiences</div>
          <div class="grid grid-cols-2 gap-2">
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="FRIENDS">
              <span class="material-symbols-outlined text-sunset-coral text-[20px]">diversity_3</span>
              <span>Friends Lounge</span>
            </button>
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="VAULT">
              <span class="material-symbols-outlined text-tertiary text-[20px]">folder</span>
              <span>Memory Vault</span>
            </button>
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="YEARBOOK">
              <span class="material-symbols-outlined text-amber-gold text-[20px]">auto_stories</span>
              <span>3D Yearbook</span>
            </button>
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="GLADE">
              <span class="material-symbols-outlined text-mint-green text-[20px]">stadia_controller</span>
              <span>Pixel Glade</span>
            </button>
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white col-span-2" data-view="STORE">
              <span class="material-symbols-outlined text-secondary text-[20px]">shopping_bag</span>
              <span>Emporium & Sparks</span>
            </button>
          </div>

          <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1">Account & Plans</div>
          <div class="grid grid-cols-2 gap-2">
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="PROFILE">
              <span class="material-symbols-outlined text-amber-gold text-[20px]">badge</span>
              <span>My Profile</span>
            </button>
            <button class="mobile-nav-btn p-3 rounded-xl bg-surface-container border border-border text-left flex items-center gap-2.5 text-xs font-bold text-white" data-view="PRICING">
              <span class="material-symbols-outlined text-sunset-coral text-[20px]">stars</span>
              <span>Pricing & Plans</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  // Brand Logo Click -> Go Home
  const logo = document.getElementById('nav-brand-logo');
  if (logo) {
    logo.addEventListener('click', () => {
      audio.playClick();
      store.setView('HERO');
    });
  }

  // Create Room CTA
  const createRoomBtn = document.getElementById('btn-header-create-room');
  if (createRoomBtn) {
    createRoomBtn.addEventListener('click', () => {
      audio.playChime();
      store.createNewRoom();
      store.setView('LOBBY');
    });
  }

  // Direct Nav Link Clicks
  const headerLinks = document.getElementById('header-links');
  if (headerLinks) {
    headerLinks.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-link-btn');
      if (btn) {
        audio.playClick();
        const view = btn.dataset.view;
        store.setView(view);
      }
    });
  }

  // Mode Switcher Buttons
  const modeSwitcher = document.getElementById('header-mode-switcher');
  if (modeSwitcher) {
    modeSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (btn) {
        audio.playClick();
        const mode = btn.dataset.mode;
        store.setMode(mode);
        if (mode === 'SOLO') store.setView('SOLO');
        else if (mode === 'US') store.setView('COUPLE');
        else store.setView('HERO');
      }
    });
  }

  // Sound Toggle
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      store.toggleSound();
      audio.playClick();
      const isEnabled = store.getState().soundEnabled;
      soundBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">${isEnabled ? 'volume_up' : 'volume_off'}</span>`;
    });
  }

  // Quick Join Button
  const joinBtn = document.getElementById('btn-quick-join');
  const joinInput = document.getElementById('quick-join-input');
  if (joinBtn && joinInput) {
    const handleJoin = () => {
      const code = joinInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        const currentPod = store.getState().activeRoom;
        store.setState({
          activeRoom: { ...currentPod, roomCode: code, isHost: false },
        });
        store.setView('LOBBY');
      } else {
        audio.playClick();
        joinInput.classList.add('border-sunset-coral');
        setTimeout(() => joinInput.classList.remove('border-sunset-coral'), 1000);
      }
    };

    joinBtn.addEventListener('click', handleJoin);
    joinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleJoin();
    });
  }

  // Mobile Drawer Quick Join Button
  const drawerJoinBtn = document.getElementById('btn-drawer-quick-join');
  const drawerJoinInput = document.getElementById('drawer-quick-join-input');
  if (drawerJoinBtn && drawerJoinInput) {
    const handleDrawerJoin = () => {
      const code = drawerJoinInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        const currentPod = store.getState().activeRoom;
        store.setState({
          activeRoom: { ...currentPod, roomCode: code, isHost: false },
        });
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer) mobileDrawer.style.display = 'none';
        store.setView('LOBBY');
      } else {
        audio.playClick();
        drawerJoinInput.placeholder = 'ENTER CODE';
      }
    };
    drawerJoinBtn.addEventListener('click', handleDrawerJoin);
    drawerJoinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleDrawerJoin();
    });
  }

  // User Profile Click -> Go to Profile Screen or Prompt Auth Modal
  const userProfile = document.getElementById('header-user-profile');
  if (userProfile) {
    userProfile.addEventListener('click', () => {
      audio.playClick();
      const currentUser = store.getState().currentUser;
      if (currentUser && currentUser.email) {
        store.setView('PROFILE');
      } else {
        openAuthModal('Sign in to access your citizen passport and cloud vault');
      }
    });
  }

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('btn-mobile-menu');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      audio.playClick();
      const isHidden = mobileDrawer.style.display === 'none';
      mobileDrawer.style.display = isHidden ? 'block' : 'none';
    });

    mobileDrawer.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-nav-btn');
      if (btn) {
        audio.playClick();
        if (btn.dataset.mode) store.setMode(btn.dataset.mode);
        if (btn.dataset.view) store.setView(btn.dataset.view);
        mobileDrawer.style.display = 'none';
      }
    });
  }
}
