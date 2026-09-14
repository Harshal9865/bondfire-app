// ==============================================================================
// GLOBAL FOOTER COMPONENT
// Professional Luxury Site Directory, Architecture Links, Trust Badges & System Status
// Warm Analog Cyber aesthetics with glassmorphism & zero emoji clutter
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openAuthModal } from './authModal.js';
import { openLegalModal } from './legalModal.js';

export function renderFooter() {
  return `
    <footer class="site-footer bg-[#070910] border-t border-[#1F2436] pt-14 pb-36 lg:pb-14 select-none relative z-20">
      <!-- Ambient Backlight Gradient -->
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sunset-coral/40 to-transparent"></div>
      
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <!-- Main Directory Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12">
          
          <!-- Column 1: Brand & Operational Status (Spans 2 cols on Desktop) -->
          <div class="sm:col-span-2 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <!-- Brand Identity -->
              <div class="flex items-center gap-3 mb-3.5 cursor-pointer group" id="footer-brand-logo">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose p-[1.5px] shadow-glow-coral flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <div class="w-full h-full bg-[#0B0E17] rounded-[10px] flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C12 2 13.8 6.2 16 8.5C18.2 10.8 21 12 21 12C21 12 18.2 13.2 16 15.5C13.8 17.8 12 22 12 22C12 22 10.2 17.8 8 15.5C5.8 13.2 3 12 3 12C3 12 5.8 10.8 8 8.5C10.2 6.2 12 2 12 2Z"></path>
                      <circle class="text-sunset-coral" cx="12" cy="12" fill="currentColor" r="2.5"></circle>
                    </svg>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-display font-bold text-2xl text-white tracking-tight">Bondfire</span>
                  <span class="retro-pixel-badge text-[8px] tracking-widest px-2 py-0.5 rounded-full bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30">Beta</span>
                </div>
              </div>

              <!-- Mission Statement -->
              <p class="text-xs text-gray-400 leading-relaxed max-w-sm mb-5 font-normal">
                Social memory party games and physical archival keepsakes generated directly from your real group chats, photos, and inside jokes. Zero gambling, 100% human connection.
              </p>
            </div>

            <!-- Live Status & Trust Capsule -->
            <div class="flex flex-col gap-2.5 pt-2">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121624] border border-[#262B40] w-fit shadow-inner">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-green opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-mint-green"></span>
                </span>
                <span class="text-[10.5px] font-mono font-semibold text-mint-green tracking-wide">WebRTC Mesh Active · 100% Operational</span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-gray-500">
                <span class="material-symbols-outlined text-[14px] text-gray-400">lock</span>
                <span>Client-Side AES Encryption &amp; Zero AI Training Guarantee</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Game Modes & Experiences -->
          <div>
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-gold/90 mb-3.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">sports_esports</span>
              <span>Game Modes</span>
            </div>
            <ul class="flex flex-col gap-2">
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="HERO">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-amber-gold transition-colors">home</span>
                  <span>Interactive Campfire</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="LOBBY">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-sunset-coral transition-colors">groups</span>
                  <span>Pods Squad Mode</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="COUPLE">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-duo-rose transition-colors">favorite</span>
                  <span>Us Mode (Couples)</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="SOLO">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-amber-gold transition-colors">person</span>
                  <span>Solo Time Capsule</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="GAME">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-secondary transition-colors">stadia_controller</span>
                  <span>Live Roast Trivia</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-mint-green hover:text-mint-green/80 flex items-center gap-2 py-0.5 transition-colors font-medium" data-view="ARCADE">
                  <span class="material-symbols-outlined text-[15px] text-mint-green">sports_esports</span>
                  <span>Multiplayer Party Arcade</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 3: Memory Vault & Keepsakes -->
          <div>
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-sunset-coral/90 mb-3.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">auto_stories</span>
              <span>Memory Vault</span>
            </div>
            <ul class="flex flex-col gap-2">
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="VAULT">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-tertiary transition-colors">inventory_2</span>
                  <span>Chat &amp; Media Vault</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="YEARBOOK">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-amber-gold transition-colors">book</span>
                  <span>3D Digital Keepsake</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="STORE">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-secondary transition-colors">shopping_bag</span>
                  <span>The Store</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="PRICING">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-amber-gold transition-colors">stars</span>
                  <span>Keepsake Hardcovers</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group" data-view="PROFILE">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-sunset-coral transition-colors">badge</span>
                  <span>Citizen Passport</span>
                </button>
              </li>
              <li>
                <button id="btn-footer-open-auth" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-blue-400 transition-colors">login</span>
                  <span>Sign In with Google</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 4: Architecture & Security -->
          <div>
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-mint-green/90 mb-3.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">shield</span>
              <span>Open Architecture</span>
            </div>
            <ul class="flex flex-col gap-2">
              <li>
                <a href="docs/ARCHITECTURE.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-blue-400 transition-colors">account_tree</span>
                  <span>P2P Dataflow Spec</span>
                </a>
              </li>
              <li>
                <a href="docs/SECURITY.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-mint-green transition-colors">security</span>
                  <span>Security &amp; OWASP Top 10</span>
                </a>
              </li>
              <li>
                <a href="docs/FREE_APIS_AND_MANUAL_SETUP_GUIDE.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-amber-gold transition-colors">hub</span>
                  <span>Free STUN &amp; WebRTC Setup</span>
                </a>
              </li>
              <li>
                <a href="docs/API_SPEC.yaml" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-sunset-coral transition-colors">api</span>
                  <span>OpenAPI 3.1 Spec</span>
                </a>
              </li>
              <li>
                <a href="docs/RUNBOOK.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-0.5 transition-colors group">
                  <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-tertiary transition-colors">terminal</span>
                  <span>DevOps Runbook</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom Legal & Technology Infrastructure Bar -->
        <div class="pt-8 border-t border-[#1C2132] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div class="flex items-center gap-2">
            <span>© 2026 Bondfire Inc. Party games made from your own memories.</span>
          </div>
          
          <div class="flex items-center gap-4 flex-wrap text-xs">
            <span class="hover:text-gray-300 cursor-pointer transition-colors" id="btn-footer-terms">Terms of Service</span>
            <span class="text-gray-700">•</span>
            <span class="hover:text-gray-300 cursor-pointer transition-colors" id="btn-footer-privacy">Privacy Policy</span>
            <span class="text-gray-700">•</span>
            <span class="hover:text-gray-300 cursor-pointer transition-colors" id="btn-footer-compliance">Streaming & DMCA</span>
            <span class="text-gray-700">•</span>
            <span class="font-mono text-gray-500">WebRTC P2P Mesh</span>
            <span class="text-gray-700">•</span>
            <span class="font-mono text-gray-500">Vanilla JS + PWA</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function bindFooterEvents() {
  const footerNavBtns = document.querySelectorAll('.footer-nav-btn');
  footerNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const view = btn.dataset.view;
      if (view === 'COUPLE') store.setMode('US');
      else if (view === 'SOLO') store.setMode('SOLO');
      else if (view === 'LOBBY' || view === 'GAME' || view === 'VAULT' || view === 'YEARBOOK') store.setMode('PODS');
      store.setView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const footerLogo = document.getElementById('footer-brand-logo');
  if (footerLogo) {
    footerLogo.addEventListener('click', () => {
      audio.playClick();
      store.setView('GATE');
      window.location.hash = '#/GATE';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const authBtn = document.getElementById('btn-footer-open-auth');
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      audio.playClick();
      openAuthModal('Connect your account to sync your memories across all devices');
    });
  }

  const termsBtn = document.getElementById('btn-footer-terms');
  const privacyBtn = document.getElementById('btn-footer-privacy');
  const complianceBtn = document.getElementById('btn-footer-compliance');

  if (termsBtn) termsBtn.addEventListener('click', () => openLegalModal('terms'));
  if (privacyBtn) privacyBtn.addEventListener('click', () => openLegalModal('privacy'));
  if (complianceBtn) complianceBtn.addEventListener('click', () => openLegalModal('platforms'));
}
