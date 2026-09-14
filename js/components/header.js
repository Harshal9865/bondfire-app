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
      <div class="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-7 h-14 sm:h-15 md:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        <!-- Left: Brand Identity -->
        <div class="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0" id="nav-brand-logo">
          <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-amber-gold via-sunset-coral to-duo-rose p-[1.5px] shadow-glow-coral flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shrink-0">
            <div class="w-full h-full bg-[#0B0E17] rounded-[10px] flex items-center justify-center">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-gold drop-shadow-[0_0_8px_rgba(255,183,3,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
              </svg>
            </div>
          </div>
          <div class="flex flex-col shrink-0">
            <span class="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none whitespace-nowrap">
              Bondfire
              <span class="text-[7.5px] sm:text-[8.5px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">Beta</span>
            </span>
            <span class="hidden sm:block text-[9px] sm:text-[10px] text-gray-400 mt-0.5 font-medium tracking-wide whitespace-nowrap">formerly Huddle</span>
          </div>
        </div>

        <!-- Center: Curated Single-Deck Navigation Capsule (Desktop & Tablets >= 768px) -->
        <nav class="hidden md:flex items-center p-1 rounded-full glass-pill border border-border/80 shadow-lg shadow-black/40 shrink-0 select-none">
          
          <!-- Mode Switcher Section -->
          <div class="flex items-center gap-0.5 p-0.5 bg-surface-dark/60 rounded-full border border-border/60 shrink-0" id="header-mode-switcher">
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${currentMode === 'SOLO' || currentView === 'SOLO' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}" data-mode="SOLO">
              <span class="material-symbols-outlined text-[15px]">person</span>
              <span>Solo</span>
            </button>
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${currentMode === 'US' || currentView === 'COUPLE' ? 'bg-duo-rose/20 text-duo-rose border border-duo-rose/40 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}" data-mode="US">
              <span class="material-symbols-outlined text-[15px]">favorite</span>
              <span>Us Mode</span>
            </button>
            <button class="mode-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${currentMode === 'PODS' || ['ROOMS', 'LOBBY', 'GAME', 'BOTTLE', 'NHIE', 'MOST_LIKELY_TO'].includes(currentView) ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}" data-mode="PODS">
              <span class="material-symbols-outlined text-[15px]">groups</span>
              <span>Pods</span>
            </button>
          </div>

          <!-- Extended Direct Experience Links (Large Desktops >= 1280px) -->
          <div class="hidden xl:flex items-center gap-0.5 pr-1 pl-1 shrink-0" id="header-links">
            <div class="w-[1px] h-4 bg-border/80 mx-1.5 shrink-0"></div>
            <button class="nav-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${currentView === 'MEMORIES' || currentView === 'VAULT' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40 font-bold' : 'text-gray-400 hover:text-amber-gold'} transition-all" data-view="MEMORIES">
              <span class="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Vault</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${currentView === 'YEARBOOK' || currentView === 'PHOTOBOOK' ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 font-bold' : 'text-gray-400 hover:text-sunset-coral'} transition-all" data-view="YEARBOOK">
              <span class="material-symbols-outlined text-[15px]">auto_stories</span>
              <span>Photobook</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${currentView === 'FRIENDS' ? 'bg-tertiary/20 text-tertiary border border-tertiary/40 font-bold' : 'text-gray-400 hover:text-tertiary'} transition-all" data-view="FRIENDS">
              <span class="material-symbols-outlined text-[15px]">group</span>
              <span>Friends</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${['ARCADE', 'BOTTLE', 'NHIE', 'MOST_LIKELY_TO'].includes(currentView) ? 'bg-duo-rose/20 text-duo-rose border border-duo-rose/40 font-bold' : 'text-gray-400 hover:text-duo-rose'} transition-all" data-view="ARCADE">
              <span class="material-symbols-outlined text-[15px]">sports_esports</span>
              <span>Arcade</span>
            </button>
            <button class="nav-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${currentView === 'STORE' || currentView === 'EMPORIUM' ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold' : 'text-gray-400 hover:text-secondary'} transition-all" data-view="STORE">
              <span class="material-symbols-outlined text-[15px]">shopping_bag</span>
              <span>Store</span>
            </button>
          </div>
        </nav>

        <!-- Right: Action Suite -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <!-- Audio Synthesizer Toggle -->
          <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface border border-border/80 text-gray-400 hover:text-white hover:border-amber-gold/50 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 shrink-0" id="btn-sound-toggle" title="Toggle Procedural Audio">
            <span class="material-symbols-outlined text-[15px] sm:text-[17px]">${state.soundEnabled ? 'volume_up' : 'volume_off'}</span>
          </button>

          <!-- Campfire Jukebox Quick Toggle (Spotify Brand Styling) -->
          <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#121212] border border-[#1DB954]/60 text-[#1DB954] hover:bg-[#1DB954]/20 hover:border-[#1DB954] hover:scale-105 shadow-[0_0_12px_rgba(29,185,84,0.35)] flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 group" id="btn-header-jukebox" title="Campfire Music &amp; Spotify Jukebox">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#1DB954] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </button>

          <!-- Room Code Quick Pill (Large Desktops >= 1536px) -->
          <div class="hidden 2xl:flex items-center p-1 rounded-full bg-surface border border-border focus-within:border-sunset-coral/70 transition-colors shadow-inner shrink-0">
            <div class="pl-2.5 pr-1 text-xs font-mono text-sunset-coral font-bold flex items-center gap-1">
              <span>#</span>
              <input type="text" id="quick-join-input" placeholder="CODE" maxlength="4" class="w-12 bg-transparent text-xs font-room-code font-bold uppercase text-white placeholder:text-gray-600 focus:outline-none tracking-wider" />
            </div>
            <button class="px-2.5 py-0.5 rounded-full bg-surface-bright hover:bg-sunset-coral hover:text-white text-gray-300 text-[11px] font-bold transition-all active:scale-95 cursor-pointer" id="btn-quick-join">
              JOIN
            </button>
          </div>

          <!-- Primary CTA Button (Desktop >= 1024px) -->
          <button class="hidden lg:flex relative group overflow-hidden px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:shadow-glow-amber transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer" id="btn-header-create-room">
            <span class="material-symbols-outlined text-[16px] text-canvas">add_circle</span>
            <span>Create Room</span>
          </button>

          <!-- Citizen Passport Profile or Sign-In Trigger -->
          ${user && user.isLoggedIn && user.email ? `
            <div class="flex items-center gap-2 pl-1 cursor-pointer group shrink-0" id="header-user-profile" title="Citizen Passport: ${user.displayName || user.email}">
              <div class="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-sunset-coral/60 overflow-hidden shadow-sm group-hover:border-amber-gold transition-colors shrink-0">
                <img src="${user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=BondfireHost'}" alt="User Avatar" class="w-full h-full object-cover" />
                <span class="w-2 h-2 rounded-full bg-mint-green border-2 border-canvas absolute bottom-0 right-0" title="Verified Online"></span>
              </div>
              <div class="hidden xl:flex flex-col text-left shrink-0">
                <span class="text-xs font-bold text-white leading-tight truncate max-w-[90px]">${user.displayName ? user.displayName.split(' ')[0] : 'Citizen'}</span>
                <span class="text-[9px] font-mono text-amber-gold flex items-center gap-0.5 leading-none">
                  <span class="material-symbols-outlined text-[10px]">bolt</span>
                  ${user.sparks || 120}
                </span>
              </div>
            </div>
          ` : `
            <button id="btn-google-auth-header" class="btn-google-sign-in flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-surface-bright hover:bg-surface border border-white/10 hover:border-amber-gold/40 text-white transition-all duration-200 active:scale-95 shadow-sm group shrink-0 cursor-pointer" type="button" title="Sign In with Google">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span class="text-xs font-bold whitespace-nowrap hidden sm:inline">Sign In</span>
            </button>
          `}
        </div>
      </div>

      <!-- Horizontal Scrolling Category & Mode Tabs (Mobile < 768px) -->
      <div class="md:hidden w-full overflow-x-auto no-scrollbar border-t border-[#262B40]/60 px-2.5 py-1.5 bg-[#0E121E]/85 backdrop-blur-md flex items-center gap-1.5 scroll-smooth">
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'MEMORIES' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="MEMORIES">
          <span class="material-symbols-outlined text-[13px] text-amber-gold">inventory_2</span>
          <span>Vault</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'YEARBOOK' ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="YEARBOOK">
          <span class="material-symbols-outlined text-[13px] text-sunset-coral">auto_stories</span>
          <span>Photobook</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'FRIENDS' ? 'bg-tertiary/20 text-tertiary border border-tertiary/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="FRIENDS">
          <span class="material-symbols-outlined text-[13px] text-tertiary">group</span>
          <span>Friends</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${['ARCADE', 'BOTTLE', 'NHIE', 'MOST_LIKELY_TO'].includes(currentView) ? 'bg-duo-rose/20 text-duo-rose border border-duo-rose/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="ARCADE">
          <span class="material-symbols-outlined text-[13px] text-duo-rose">sports_esports</span>
          <span>Arcade</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'STORE' ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="STORE">
          <span class="material-symbols-outlined text-[13px] text-secondary">shopping_bag</span>
          <span>Store</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${['ROOMS', 'LOBBY', 'GAME'].includes(currentView) || currentMode === 'PODS' ? 'bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="ROOMS" data-mode="PODS">
          <span class="material-symbols-outlined text-[13px] text-sunset-coral">groups</span>
          <span>Squad</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'SOLO' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="SOLO" data-mode="SOLO">
          <span class="material-symbols-outlined text-[13px] text-amber-gold">person</span>
          <span>Solo</span>
        </button>
        <button class="mobile-filter-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${currentView === 'COUPLE' ? 'bg-duo-rose/20 text-duo-rose border border-duo-rose/40 font-bold shadow-sm' : 'bg-surface text-gray-400 border border-border/80'}" data-view="COUPLE" data-mode="US">
          <span class="material-symbols-outlined text-[13px] text-duo-rose">favorite</span>
          <span>Us Mode</span>
        </button>
      </div>
    </header>

    <!-- Mobile Bottom Command Dock with Hide/Show Capability -->
    <nav id="mobile-bottom-nav" class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B0E17]/95 backdrop-blur-2xl border-t border-[#262B40] shadow-[0_-10px_35px_rgba(0,0,0,0.85)] select-none pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1 px-3">
      <!-- Top header bar on dock with Title + Hide/Collapse button -->
      <div class="flex items-center justify-between px-2 pb-1 border-b border-white/5 mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-pulse"></span>
          <span class="text-[9.5px] font-mono font-bold uppercase tracking-wider text-gray-400">Navigation</span>
        </div>
        <!-- Hide / Minimize Button -->
        <button id="btn-hide-bottom-nav" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface hover:bg-surface-bright border border-border/80 text-[10px] font-medium text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer" title="Hide Navigation Bar">
          <span>Hide</span>
          <span class="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </div>

      <div class="max-w-md mx-auto grid grid-cols-5 items-center justify-around gap-1 text-center">
        <!-- Tab 1: Home -->
        <button class="mobile-bottom-tab flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${currentView === 'HOME' ? 'text-sunset-coral font-bold' : 'text-gray-400 hover:text-gray-200'}" data-view="HOME">
          <span class="material-symbols-outlined text-[22px] ${currentView === 'HOME' ? 'text-sunset-coral scale-110 drop-shadow-[0_0_8px_rgba(255,90,95,0.6)]' : ''}">home</span>
          <span class="text-[10px] tracking-tight mt-0.5 font-medium">Home</span>
        </button>

        <!-- Tab 2: Memories -->
        <button class="mobile-bottom-tab flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${currentView === 'MEMORIES' ? 'text-amber-gold font-bold' : 'text-gray-400 hover:text-gray-200'}" data-view="MEMORIES">
          <span class="material-symbols-outlined text-[22px] ${currentView === 'MEMORIES' ? 'text-amber-gold scale-110 drop-shadow-[0_0_8px_rgba(255,183,3,0.6)]' : ''}">inventory_2</span>
          <span class="text-[10px] tracking-tight mt-0.5 font-medium">Memories</span>
        </button>

        <!-- Tab 3: CENTER HERO FLAME (ROOMS) -->
        <div class="flex flex-col items-center justify-center -mt-3">
          <button class="mobile-bottom-tab bottom-nav-center-btn w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-full bg-gradient-to-tr from-sunset-coral via-[#FF7064] to-amber-gold p-[2px] flex items-center justify-center shadow-lg transition-transform duration-200 group active:scale-90" data-view="ROOMS" title="Party Rooms">
            <div class="w-full h-full rounded-full bg-[#0B0E17] flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-[24px] text-sunset-coral drop-shadow-[0_0_10px_rgba(255,90,95,0.8)]">local_fire_department</span>
            </div>
          </button>
          <span class="text-[10px] tracking-tight mt-0.5 font-bold ${currentView === 'ROOMS' || currentView === 'LOBBY' || currentView === 'GAME' ? 'text-sunset-coral' : 'text-gray-300'}">Rooms</span>
        </div>

        <!-- Tab 4: Shows -->
        <button class="mobile-bottom-tab flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${currentView === 'SHOWS' ? 'text-mint-green font-bold' : 'text-gray-400 hover:text-gray-200'}" data-view="SHOWS">
          <span class="material-symbols-outlined text-[22px] ${currentView === 'SHOWS' ? 'text-mint-green scale-110 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : ''}">play_circle</span>
          <span class="text-[10px] tracking-tight mt-0.5 font-medium">Shows</span>
        </button>

        <!-- Tab 5: Profile -->
        <button class="mobile-bottom-tab flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${currentView === 'PROFILE' ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'}" data-view="PROFILE">
          <span class="material-symbols-outlined text-[22px] ${currentView === 'PROFILE' ? 'text-white scale-110' : ''}">person</span>
          <span class="text-[10px] tracking-tight mt-0.5 font-medium">Profile</span>
        </button>
      </div>
    </nav>

    <!-- Floating Re-open Nav Pill (Shown when user has hidden the bottom nav) -->
    <button id="btn-restore-bottom-nav" class="md:hidden fixed bottom-4 right-4 z-40 hidden px-3.5 py-2 rounded-full bg-[#0B0E17]/95 border border-sunset-coral/50 text-white text-xs font-bold shadow-glow-coral backdrop-blur-md flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer" title="Show Navigation Menu">
      <span class="material-symbols-outlined text-[16px] text-sunset-coral">local_fire_department</span>
      <span>Menu</span>
    </button>

    <!-- Mobile Slide-up Command Hub Sheet (Bottom Drawer with Modes, Arcade, TV Mode, Soundboard & Profile) -->
    <div id="mobile-explore-sheet-backdrop" class="bottom-sheet-backdrop fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end md:hidden select-none">
      <div id="mobile-explore-sheet" class="bottom-sheet-panel relative w-full bg-[#0E121E] border-t border-border/80 rounded-t-[32px] p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] shadow-2xl max-h-[85vh] overflow-y-auto text-on-surface">
        
        <!-- Grab Handle -->
        <div class="w-12 h-1.5 bg-gray-600/80 rounded-full mx-auto mb-4 cursor-pointer" id="sheet-grab-handle"></div>

        <!-- Sheet Header -->
        <div class="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sunset-coral text-[20px]">local_fire_department</span>
            <h3 class="font-bold text-white text-base tracking-tight">Bondfire Command Hub</h3>
          </div>
          <button id="btn-close-explore-sheet" class="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Section 1: Play Modes Switcher -->
        <div class="mb-4">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Game Flavor & Mode</label>
          <div class="grid grid-cols-3 gap-2">
            <button class="sheet-mode-btn p-2.5 rounded-2xl bg-surface border ${currentMode === 'SOLO' ? 'border-amber-gold text-white bg-surface-bright' : 'border-border text-gray-300'} flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-mode="SOLO">
              <span class="material-symbols-outlined text-amber-gold text-[20px]">person</span>
              <span class="text-xs font-bold">Solo</span>
              <span class="text-[9px] text-gray-400">1 Player</span>
            </button>
            <button class="sheet-mode-btn p-2.5 rounded-2xl bg-surface border ${currentMode === 'US' ? 'border-duo-rose text-white bg-surface-bright' : 'border-border text-gray-300'} flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-mode="US">
              <span class="material-symbols-outlined text-duo-rose text-[20px]">favorite</span>
              <span class="text-xs font-bold">Us Mode</span>
              <span class="text-[9px] text-gray-400">Couples</span>
            </button>
            <button class="sheet-mode-btn p-2.5 rounded-2xl bg-surface border ${currentMode === 'PODS' ? 'border-sunset-coral text-white bg-surface-bright' : 'border-border text-gray-300'} flex flex-col items-center gap-1 text-center transition-all active:scale-95" data-mode="PODS">
              <span class="material-symbols-outlined text-sunset-coral text-[20px]">groups</span>
              <span class="text-xs font-bold">Pods</span>
              <span class="text-[9px] text-gray-400">Squads</span>
            </button>
          </div>
        </div>

        <!-- Section 2: Experiences & Creative Features Grid -->
        <div class="mb-4">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Experiences & Mini-Games</label>
          <div class="grid grid-cols-2 gap-2">
            <button class="sheet-nav-btn p-3 rounded-2xl bg-surface border border-border/80 hover:border-mint-green/60 text-left flex items-center gap-3 transition-all active:scale-95" data-view="GLADE">
              <div class="w-9 h-9 rounded-xl bg-mint-green/10 border border-mint-green/30 flex items-center justify-center text-mint-green shrink-0">
                <span class="material-symbols-outlined text-[20px]">stadia_controller</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white truncate">Pixel Glade</div>
                <div class="text-[10px] text-gray-400 truncate">Graffiti & S'mores</div>
              </div>
            </button>

            <button class="sheet-nav-btn p-3 rounded-2xl bg-surface border border-border/80 hover:border-sunset-coral/60 text-left flex items-center gap-3 transition-all active:scale-95" data-view="TV_MODE">
              <div class="w-9 h-9 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral shrink-0">
                <span class="material-symbols-outlined text-[20px]">tv</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white truncate">TV Host View</div>
                <div class="text-[10px] text-gray-400 truncate">Living Room Cast</div>
              </div>
            </button>

            <button class="sheet-nav-btn p-3 rounded-2xl bg-surface border border-border/80 hover:border-secondary/60 text-left flex items-center gap-3 transition-all active:scale-95" data-view="STORE">
              <div class="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white truncate">Store</div>
                <div class="text-[10px] text-gray-400 truncate">Keepsakes & Merch</div>
              </div>
            </button>

            <button class="sheet-nav-btn p-3 rounded-2xl bg-surface border border-border/80 hover:border-amber-gold/60 text-left flex items-center gap-3 transition-all active:scale-95" data-view="PROFILE">
              <div class="w-9 h-9 rounded-xl bg-amber-gold/10 border border-amber-gold/30 flex items-center justify-center text-amber-gold shrink-0">
                <span class="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white truncate">Passport</div>
                <div class="text-[10px] text-gray-400 truncate">Stats & Account</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Section 3: Host Comedy Soundboard Mini-Rack -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest border border-border/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] uppercase font-mono text-amber-gold font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">volume_up</span>
              <span>Party FX Soundboard</span>
            </span>
            <span class="text-[9px] text-gray-500 font-mono">Synthesized Web Audio</span>
          </div>
          <div class="grid grid-cols-5 gap-1.5">
            <button class="btn-sheet-fx py-2 px-1 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-center text-xs flex flex-col items-center gap-0.5 active:scale-90 transition-all" data-sound="buzzer" title="Wrong Buzzer">
              <span class="material-symbols-outlined text-coral-red text-base">notifications_active</span>
              <span class="text-[9px] text-gray-300 font-bold font-mono">Buzzer</span>
            </button>
            <button class="btn-sheet-fx py-2 px-1 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-center text-xs flex flex-col items-center gap-0.5 active:scale-90 transition-all" data-sound="airhorn" title="Airhorn">
              <span class="material-symbols-outlined text-amber-gold text-base">campaign</span>
              <span class="text-[9px] text-gray-300 font-bold font-mono">Airhorn</span>
            </button>
            <button class="btn-sheet-fx py-2 px-1 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-center text-xs flex flex-col items-center gap-0.5 active:scale-90 transition-all" data-sound="rimshot" title="Rimshot">
              <span class="material-symbols-outlined text-mint-green text-base">music_note</span>
              <span class="text-[9px] text-gray-300 font-bold font-mono">Rimshot</span>
            </button>
            <button class="btn-sheet-fx py-2 px-1 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-center text-xs flex flex-col items-center gap-0.5 active:scale-90 transition-all" data-sound="cheer" title="Crowd Cheer">
              <span class="material-symbols-outlined text-rose-glow text-base">celebration</span>
              <span class="text-[9px] text-gray-300 font-bold font-mono">Cheer</span>
            </button>
            <button class="btn-sheet-fx py-2 px-1 rounded-xl bg-surface border border-border/80 hover:bg-surface-bright text-center text-xs flex flex-col items-center gap-0.5 active:scale-90 transition-all" data-sound="crickets" title="Awkward Silence">
              <span class="material-symbols-outlined text-gray-400 text-base">volume_off</span>
              <span class="text-[9px] text-gray-300 font-bold font-mono">Silence</span>
            </button>
          </div>
        </div>

      </div>
    </div>
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
        else if (mode === 'PODS') store.setView('ROOMS');
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
        store.joinRoomWithCode(code);
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
        store.joinRoomWithCode(code);
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

  // Google Sign-In Direct Header Button -> Opens Auth Modal directly for 100% reliable sign-in
  const googleAuthBtn = document.getElementById('btn-google-auth-header');
  if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      openAuthModal('Sign in with Google or Email to unlock cloud vault and start games');
    });
  }

  // Header Quick Jukebox Toggle (Global 1-Click Music Launcher)
  const headerJukeboxBtn = document.getElementById('btn-header-jukebox');
  if (headerJukeboxBtn) {
    headerJukeboxBtn.addEventListener('click', () => {
      audio.playClick();
      let jukeboxModal = document.getElementById('spotify-jukebox-modal');
      if (!jukeboxModal) {
        const mount = document.getElementById('jukebox-mount');
        if (mount) {
          import('./spotifyPlayer.js').then(({ renderSpotifyJukebox, bindSpotifyEvents }) => {
            mount.innerHTML = renderSpotifyJukebox();
            bindSpotifyEvents();
            const modal = document.getElementById('spotify-jukebox-modal');
            if (modal) modal.classList.remove('hidden');
          });
          return;
        }
      }
      if (jukeboxModal) {
        jukeboxModal.classList.toggle('hidden');
      }
    });
  }

  // Mobile Filter Pills Click (Vault, Photobook, Friends, Arcade, Store, Squad, Solo, Us Mode)
  const filterPills = document.querySelectorAll('.mobile-filter-pill');
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      audio.playClick();
      const view = pill.dataset.view;
      const mode = pill.dataset.mode;
      if (mode) store.setMode(mode);
      if (view) {
        store.setView(view);
        window.location.hash = `#/${view}`;
      }
    });
  });

  // Mobile Bottom Navigation Tabs Click
  const bottomTabs = document.querySelectorAll('.mobile-bottom-tab');
  bottomTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      audio.playClick();
      const view = tab.dataset.view;
      if (view) {
        store.setView(view);
      }
    });
  });

  // Mobile Center Elevated Home / Play Button
  const centerHomeBtn = document.getElementById('btn-bottom-center-home');
  if (centerHomeBtn) {
    centerHomeBtn.addEventListener('click', () => {
      audio.playChime();
      const currentRoom = store.getState().activeRoom;
      if (currentRoom && currentRoom.roomCode) {
        store.setView('LOBBY');
      } else {
        store.setView('HERO');
      }
    });
  }

  // Mobile Explore Command Sheet Controls
  const sheetBackdrop = document.getElementById('mobile-explore-sheet-backdrop');
  const openSheetBtn = document.getElementById('btn-bottom-open-sheet');
  const closeSheetBtn = document.getElementById('btn-close-explore-sheet');
  const grabHandle = document.getElementById('sheet-grab-handle');

  const openSheet = () => {
    if (sheetBackdrop) {
      audio.playClick();
      sheetBackdrop.classList.add('active');
    }
  };

  const closeSheet = () => {
    if (sheetBackdrop) {
      audio.playClick();
      sheetBackdrop.classList.remove('active');
    }
  };

  if (openSheetBtn) openSheetBtn.addEventListener('click', openSheet);
  if (closeSheetBtn) closeSheetBtn.addEventListener('click', closeSheet);
  if (grabHandle) grabHandle.addEventListener('click', closeSheet);
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', (e) => {
      if (e.target === sheetBackdrop) closeSheet();
    });
  }

  // Sheet Mode Buttons
  const sheetModeBtns = document.querySelectorAll('.sheet-mode-btn');
  sheetModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const mode = btn.dataset.mode;
      if (mode) {
        store.setMode(mode);
        if (mode === 'SOLO') store.setView('SOLO');
        else if (mode === 'US') store.setView('COUPLE');
        else if (mode === 'PODS') store.setView('ROOMS');
        else store.setView('HERO');
      }
      closeSheet();
    });
  });

  // Sheet Navigation Buttons
  const sheetNavBtns = document.querySelectorAll('.sheet-nav-btn');
  sheetNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const view = btn.dataset.view;
      if (view) {
        store.setView(view);
      }
      closeSheet();
    });
  });

  // Sheet Party Comedy Soundboard Buttons
  const sheetFxBtns = document.querySelectorAll('.btn-sheet-fx');
  sheetFxBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sound = btn.dataset.sound;
      if (sound === 'buzzer') audio.playWrongBuzzer();
      else if (sound === 'airhorn') audio.playAirhorn();
      else if (sound === 'rimshot') audio.playRimshot();
      else if (sound === 'cheer') audio.playCrowdCheer();
      else if (sound === 'crickets') audio.playCrickets();
    });
  });

  // Mobile Bottom Navigation Hide / Restore & Scroll Behavior
  const bottomNav = document.getElementById('mobile-bottom-nav');
  const hideNavBtn = document.getElementById('btn-hide-bottom-nav');
  const restoreNavBtn = document.getElementById('btn-restore-bottom-nav');

  const hideBottomNav = () => {
    if (!bottomNav) return;
    bottomNav.classList.add('nav-hidden');
    if (restoreNavBtn) {
      restoreNavBtn.classList.remove('hidden');
      restoreNavBtn.classList.add('flex');
    }
  };

  const showBottomNav = () => {
    if (!bottomNav) return;
    bottomNav.classList.remove('nav-hidden');
    if (restoreNavBtn) {
      restoreNavBtn.classList.add('hidden');
      restoreNavBtn.classList.remove('flex');
    }
  };

  if (hideNavBtn) {
    hideNavBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      hideBottomNav();
    });
  }

  if (restoreNavBtn) {
    restoreNavBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      showBottomNav();
    });
  }

  // Smart Auto-Hide on Scroll Down / Reveal on Scroll Up for maximum screen real-estate
  let lastScrollY = window.scrollY;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        // Auto-hide when user actively scrolls down more than 18px past header
        if (scrollDelta > 18 && currentScrollY > 120) {
          hideBottomNav();
        } else if (scrollDelta < -12 || (window.innerHeight + currentScrollY) >= (document.body.offsetHeight - 60)) {
          // Reveal when scrolling up or reaching the bottom of the page
          showBottomNav();
        }

        lastScrollY = Math.max(0, currentScrollY);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
}
