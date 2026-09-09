// ==============================================================================
// GLOBAL FOOTER COMPONENT
// Site Directory, Production Documentation Links, Trust Badges & System Status
// Single-tier Warm Analog Cyber aesthetics with zero raw emojis
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { openAuthModal } from './authModal.js';

export function renderFooter() {
  return `
    <footer class="site-footer bg-[#0B0E17] border-t border-[#262B40]/70 py-12 select-none">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <!-- Top Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          
          <!-- Column 1: Brand & Mission (2 cols on LG) -->
          <div class="lg:col-span-2 flex flex-col pr-4">
            <div class="flex items-center gap-3 mb-3 cursor-pointer" id="footer-brand-logo">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-sunset-coral via-amber-gold to-duo-rose p-[1.5px] shadow-glow-coral flex items-center justify-center">
                <div class="w-full h-full bg-canvas rounded-[9px] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[16px] text-amber-gold">local_fire_department</span>
                </div>
              </div>
              <span class="font-display font-bold text-xl text-white tracking-tight">Bondfire</span>
              <span class="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">Beta</span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
              Social memory party games and physical keepsakes made from your real group chats, photos, and inside jokes. Zero gambling, 100% human connection.
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-green/10 border border-mint-green/30 w-fit">
              <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
              <span class="text-[10px] font-mono font-bold text-mint-green tracking-wider uppercase">System Operational · All Engines Live</span>
            </div>
          </div>

          <!-- Column 2: Experiences (Modes) -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">Experiences</div>
            <ul class="flex flex-col gap-2.5">
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="HERO">
                  <span class="material-symbols-outlined text-[15px] text-amber-gold">home</span>
                  <span>Home & Interactive Demo</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="LOBBY">
                  <span class="material-symbols-outlined text-[15px] text-sunset-coral">groups</span>
                  <span>Pods Mode (Squad Lobby)</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="GAME">
                  <span class="material-symbols-outlined text-[15px] text-secondary">stadia_controller</span>
                  <span>Live Game (Roast Trivia)</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="COUPLE">
                  <span class="material-symbols-outlined text-[15px] text-duo-rose">favorite</span>
                  <span>Us Mode (Couples Date)</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="SOLO">
                  <span class="material-symbols-outlined text-[15px] text-amber-gold">person</span>
                  <span>Time Capsule (Solo Archive)</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-mint-green hover:text-mint-green/80 flex items-center gap-2 transition-colors font-semibold" data-view="GLADE">
                  <span class="material-symbols-outlined text-[15px] text-mint-green">videogame_asset</span>
                  <span>The Pixel Glade (Arcade)</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 3: Keepsakes & Platform -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">Keepsakes & Plans</div>
            <ul class="flex flex-col gap-2.5">
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="VAULT">
                  <span class="material-symbols-outlined text-[15px] text-tertiary">folder</span>
                  <span>Pod Memory Vault</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="YEARBOOK">
                  <span class="material-symbols-outlined text-[15px] text-amber-gold">auto_stories</span>
                  <span>3D Digital Yearbook</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="STORE">
                  <span class="material-symbols-outlined text-[15px] text-secondary">shopping_bag</span>
                  <span>The Emporium</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-amber-gold hover:text-white flex items-center gap-2 transition-colors font-semibold" data-view="PRICING">
                  <span class="material-symbols-outlined text-[15px] text-amber-gold">stars</span>
                  <span>Pricing & Membership</span>
                </button>
              </li>
              <li>
                <button class="footer-nav-btn text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors" data-view="PROFILE">
                  <span class="material-symbols-outlined text-[15px] text-sunset-coral">badge</span>
                  <span>My Citizen Profile</span>
                </button>
              </li>
              <li>
                <button id="btn-footer-open-auth" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-[15px]">login</span>
                  <span>Sign In / Register</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 4: Specs & Security -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">Enterprise Specs</div>
            <ul class="flex flex-col gap-2.5">
              <li>
                <a href="docs/ARCHITECTURE.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-[15px] text-blue-400">account_tree</span>
                  <span>Architecture & Dataflow</span>
                </a>
              </li>
              <li>
                <a href="docs/SECURITY.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-[15px] text-mint-green">security</span>
                  <span>Security & OWASP</span>
                </a>
              </li>
              <li>
                <a href="docs/API_SPEC.yaml" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-[15px] text-amber-gold">api</span>
                  <span>OpenAPI 3.1 Spec</span>
                </a>
              </li>
              <li>
                <a href="docs/RUNBOOK.md" target="_blank" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-[15px] text-sunset-coral">terminal</span>
                  <span>DevOps Runbook</span>
                </a>
              </li>
              <li>
                <span class="text-xs text-mint-green flex items-center gap-2 cursor-default">
                  <span class="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>Zero AI Training Guarantee</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright & Live Health Bar -->
        <div class="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 Bondfire Inc. Built with Warm Analog Cyber Design.
          </div>
          <div class="flex items-center gap-4 flex-wrap text-xs">
            <span class="hover:text-gray-300 cursor-pointer" id="btn-footer-terms">Terms of Service</span>
            <span class="text-gray-700">•</span>
            <span class="hover:text-gray-300 cursor-pointer" id="btn-footer-privacy">Privacy Policy</span>
            <span class="text-gray-700">•</span>
            <span>Fastify + WebSockets</span>
            <span class="text-gray-700">•</span>
            <span>PostgreSQL 16</span>
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
      store.setView('HERO');
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
  const toastMount = document.getElementById('toast-mount');

  const showLegalToast = (title) => {
    audio.playClick();
    if (toastMount) {
      toastMount.innerHTML = `<div class="toast toast-mint show"><span>📜 ${title}: Zero AI training on your private chat memories. 100% GDPR & CCPA compliant.</span></div>`;
      setTimeout(() => (toastMount.innerHTML = ''), 3500);
    }
  };

  if (termsBtn) termsBtn.addEventListener('click', () => showLegalToast('Bondfire Terms of Service'));
  if (privacyBtn) privacyBtn.addEventListener('click', () => showLegalToast('Bondfire Privacy Policy'));
}
