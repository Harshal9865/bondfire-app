// ==============================================================================
// THE PHOTOBOOK (YEARBOOK) STUDIO COMPONENT (Screen 3)
// 3D Layflat Book Studio, Real Gold Foil, Italian Bookcloth, 1-Click Pod Split
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { openPaymentModal } from './demoPaymentModal.js';

let confettiInstance = null;

export function renderYearbookScreen() {
  const state = store.getState();
  const room = state.activeRoom || { id: 'GOA-8842', name: 'The Goa Crew', type: 'SQUAD' };

  const realPlayers = (state.activeRoom?.players || []).map((p) => p.name).filter(Boolean);
  const hostUser = state.currentUser?.displayName ? state.currentUser.displayName.split(' ')[0] : 'Host (You)';
  const p1 = realPlayers[0] || hostUser;
  const p2 = realPlayers[1] || realPlayers[0] || hostUser;
  const p3 = realPlayers[2] || realPlayers[0] || hostUser;
  const p4 = realPlayers[3] || realPlayers[1] || hostUser;

  const awards = [
    { title: 'MVP Lore Master', winner: p1, icon: 'hotel_class', reason: 'Highest trivia and roast score in the squad room', color: 'text-amber-gold bg-amber-gold/15' },
    { title: 'The Chaos Agent', winner: p2, icon: 'local_fire_department', reason: 'Dropped the most unhinged answers and spicy defense pleas', color: 'text-sunset-coral bg-sunset-coral/15' },
    { title: 'Fastest Buzzer Finger', winner: p3, icon: 'bolt', reason: 'Locked in first answer in under 2.4 seconds', color: 'text-duo-rose bg-duo-rose/15' },
    { title: 'Unforgivable Alibi', winner: p4, icon: 'notifications_active', reason: 'Voted guilty by the squad jury verdict', color: 'text-mint-green bg-mint-green/15' },
  ];

  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto select-none">
      
      <!-- Top Breadcrumb & Studio Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-[#262B40]/80 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>PHOTOBOOK STUDIO // LAYFLAT ARCHIVE</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The ${room.name} Layflat Keepsake
          </h1>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-full bg-[#141826] border border-[#2B3147] flex items-center gap-2 font-mono text-xs text-gray-300">
            <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
            <span>48 PAGES • ULTRA-HD 240GSM LUSTER</span>
          </div>
          <button id="btn-back-home" class="p-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-400 hover:text-white border border-[#2B3147] transition-colors" title="Back to Home">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <!-- MAIN 3D LAYFLAT BOOK CANVAS -->
      <div class="relative w-full rounded-[36px] bg-gradient-to-b from-[#151928] to-[#0E121E] p-6 sm:p-10 border border-[#2B3147] shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_50px_rgba(255,183,3,0.1)] overflow-hidden mb-12">
        
        <!-- Book Spine Center Divide Simulation -->
        <div class="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/70 to-black/40 pointer-events-none z-30 shadow-inner"></div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-20">
          
          <!-- LEFT PAGE: Photo Collage & Live Quote Highlights -->
          <div class="rounded-2xl bg-[#181C2B] border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <!-- Subtle paper texture overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">SECTION 01 // CRIME SCENE EVIDENCE</span>
                <span class="text-xs font-mono text-gray-400">PAGE 14</span>
              </div>

              <!-- Polaroid Stack -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="rounded-xl bg-white p-2.5 pb-4 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform">
                  <div class="w-full h-32 rounded-lg bg-gray-900 overflow-hidden mb-2">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmTvkxTpmNJFJSFINhAeLGm8sUBPCJkNY2tvuprYLpPtmpoZGndhi9Y8iVIN8gzZUXAug0Hrygmir0VhptFCHbHiqbt-Fex-S19G0c04ZLgJeDlK2yqcf46pVxEj5y4zJDYSxjc_1ZTHm1cq-b44hlgJTQDrgAV7SgJD7lw-2lIM2_odAZ4394Hxx_Ai5YmMbghI34_YJ4zCvNTdL1r0XI7en4Sy6nFawO7B3U8BovJmj26dnk879lPA" alt="Cabin Trip" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-[11px] font-mono text-gray-800 font-bold truncate">Cabin Midnight Bonfire</div>
                  <div class="text-[9px] font-mono text-gray-500">October 14, 2:41 AM</div>
                </div>

                <div class="rounded-xl bg-white p-2.5 pb-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform mt-4">
                  <div class="w-full h-32 rounded-lg bg-gray-900 overflow-hidden mb-2">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGH6yEwA909wOyLkmZfOcLEXZ0vjO3uMaDFegMm6wF5v4lQA1wqbOz6aLw_0TlQJH185KKyqI9cA881f85FEyfYZ-tsIwGyEQEYdSgJKhV9CfKpgCtM32ALPbFdkZc6OWElg6g37Kbrm0XQUzOxRmO0yArFpdI7JwqKE-eMb4D8nK56sGPeDi8d4lHJkxJP2qgfzzFMZr-90DmWTlrtgx7pOtEoPWeZtMvmhSpTjKPyrsRFJ2ug4iObQ" alt="Pizza Incident" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-[11px] font-mono text-gray-800 font-bold truncate">Hawaiian Pizza Arrival</div>
                  <div class="text-[9px] font-mono text-gray-500">Exhibit #204</div>
                </div>
              </div>

              <!-- Quote Chip -->
              <div class="p-4 rounded-2xl bg-[#121522] border border-[#2B3147] relative">
                <span class="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-sunset-coral text-canvas font-mono font-extrabold text-[9px] uppercase">
                  UNANIMOUS ROAST VERDICT
                </span>
                <p class="text-sm sm:text-base text-gray-200 italic font-sans leading-snug">
                  "If anyone orders another midnight snack delivery, ${p2} is legally liable for calling the police."
                </p>
                <div class="flex items-center justify-between mt-3 text-[11px] font-mono text-gray-400">
                  <span>Voted guilty: ${p2} (65%)</span>
                  <span class="text-sunset-coral font-bold">VERIFIED INSIDE JOKE</span>
                </div>
              </div>
            </div>

            <div class="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>Bondfire Archival Series</span>
              <span>ISSN 9482-1102</span>
            </div>
          </div>

          <!-- RIGHT PAGE: Pod Awards & Superlatives -->
          <div class="rounded-2xl bg-[#181C2B] border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">SECTION 02 // POD SUPERLATIVES</span>
                <span class="text-xs font-mono text-gray-400">PAGE 15</span>
              </div>

              <!-- Superlative Cards -->
              <div class="space-y-3 mb-6">
                ${awards.map(award => `
                  <div class="p-3.5 rounded-2xl bg-[#121522] border border-[#262B40] hover:border-amber-gold/40 transition-all flex items-center gap-3.5 shadow-sm">
                    <div class="w-10 h-10 rounded-xl ${award.color} flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[20px]">${award.icon}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="font-display font-bold text-white text-sm truncate">${award.winner}</h4>
                        <span class="retro-pixel-badge text-[9.5px] text-amber-gold">${award.title}</span>
                      </div>
                      <p class="text-xs text-gray-400 font-sans truncate mt-0.5">${award.reason}</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Sparks & Score Tally Box -->
              <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-gold/15 to-sunset-coral/15 border border-amber-gold/30 flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">SESSION SCOREBOARD</span>
                  <div class="text-xl font-display font-black text-white">1,450 Sparks Earned</div>
                </div>
                <span class="material-symbols-outlined text-amber-gold text-[28px]">workspace_premium</span>
              </div>
            </div>

            <div class="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>Layflat Spine 0.75"</span>
              <span>Debossed Cover</span>
            </div>
          </div>

        </div>

      </div>

      <!-- CUSTOMIZER & ORDER BAR -->
      <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        
        <!-- Left: Material & Fabric Swatches -->
        <div class="flex flex-wrap items-center gap-6">
          <div>
            <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-2">COVER MATERIAL</span>
            <div class="flex items-center gap-2" id="fabric-swatches">
              <button class="fabric-swatch w-8 h-8 rounded-full bg-[#18181A] border-2 border-amber-gold shadow transition-transform scale-110" data-name="Italian Obsidian" title="Italian Obsidian Bookcloth"></button>
              <button class="fabric-swatch w-8 h-8 rounded-full bg-[#8B263E] border-2 border-transparent hover:border-white transition-transform" data-name="Campfire Crimson" title="Campfire Crimson Velvet"></button>
              <button class="fabric-swatch w-8 h-8 rounded-full bg-[#1E3A5F] border-2 border-transparent hover:border-white transition-transform" data-name="Midnight Navy" title="Midnight Navy Linen"></button>
            </div>
          </div>

          <div class="h-10 w-px bg-[#262B40] hidden sm:block"></div>

          <div>
            <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-2">FOIL STAMPING</span>
            <span class="px-3 py-1 rounded-full bg-amber-gold/15 text-amber-gold border border-amber-gold/30 text-xs font-mono font-bold inline-flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>Real 24k Gold Foil Deboss</span>
            </span>
          </div>
        </div>

        <!-- Right: Order CTA & Pod Split -->
        <div class="flex flex-wrap items-center gap-3">
          <button id="btn-pod-split-link" class="px-5 py-3 rounded-full bg-[#202538] hover:bg-[#2A3148] border border-[#363D5A] text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 active:scale-95 shadow">
            <span class="material-symbols-outlined text-[16px]">call_split</span>
            <span>Split Cost ($9.50/ea)</span>
          </button>

          <button id="btn-order-hardcover" class="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-gold via-sunset-coral to-duo-rose text-canvas font-bold text-xs sm:text-sm shadow-glow-amber hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Order Layflat Hardcover ($38)</span>
          </button>
        </div>

      </div>

    </div>
  `;
}

export function bindYearbookEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Confetti fanfare on load
  setTimeout(() => {
    if (confettiInstance) {
      confettiInstance.burst(80, 1.2);
      audio.playFanfare();
    }
  }, 400);

  // Back home button
  const backBtn = document.getElementById('btn-back-home');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('HOME');
    });
  }

  // Fabric swatches
  const swatches = document.querySelectorAll('.fabric-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      audio.playClick();
      swatches.forEach(s => s.classList.remove('scale-110', 'border-amber-gold'));
      swatch.classList.add('scale-110', 'border-amber-gold');
    });
  });

  // Order Hardcover Button -> triggers payment simulator modal
  const orderHardcover = document.getElementById('btn-order-hardcover');
  if (orderHardcover) {
    orderHardcover.addEventListener('click', () => {
      audio.playChime();
      openPaymentModal({
        name: 'Layflat Hardcover Photobook (48 Pages)',
        price: 38,
        tier: 'HARDCOVER_PHOTOBOOK',
        description: 'Bound in Italian Obsidian bookcloth with real gold foil custom stamping.'
      });
    });
  }

  // Pod Split Link
  const splitBtn = document.getElementById('btn-pod-split-link');
  if (splitBtn) {
    splitBtn.addEventListener('click', () => {
      audio.playChime();
      confettiInstance.burst(30, 0.8);
      splitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] text-mint-green">done_all</span><span>Link Copied ($9.50/ea)!</span>`;
      setTimeout(() => {
        splitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">call_split</span><span>Split Cost ($9.50/ea)</span>`;
      }, 3000);
    });
  }
}
