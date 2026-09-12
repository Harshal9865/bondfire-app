// ==============================================================================
// HOME SCROLL STORY COMPONENT (Screenshot Replicas: 4 Modes, Keepsake, 10s Pod)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export function renderHomeScrollStory() {
  return `
    <!-- SECTION 1: RETRO NEOPIXEL RGB LED DOT-MATRIX TELEMETRY MARQUEE -->
    <div class="w-full neopixel-banner py-2.5 px-4 overflow-hidden border-y border-[#262B40]/70 select-none">
      <div class="flex items-center gap-8 whitespace-nowrap animate-marquee">
        <span class="neopixel-text text-xs flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#4DE082] animate-ping"></span>
          BONDFIRE ARCADE ENGINE ONLINE // 34,000+ MEMORIES ARCHIVED // ZERO GAMBLING • 100% HUMAN CONNECTION
        </span>
        <span class="text-[#262B40] font-mono">///</span>
        <span class="neopixel-text-amber text-xs font-mono">
          TELEMETRY: ROOM LATENCY <14MS // MULTI-DEVICE CAST READY // WEBRTC ENCRYPTED
        </span>
        <span class="text-[#262B40] font-mono">///</span>
        <span class="neopixel-text-coral text-xs font-mono">
          AI MODEL: BONDFIRE TRIVIA COMPILER v3.4 // READY TO PLAY
        </span>
      </div>
    </div>

    <!-- SECTION 2: FOUR WAYS TO PLAY (Exact Cards from Screenshot 2) -->
    <section class="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto z-20">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/10 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[14px]">sports_esports</span>
            <span>EXPERIENCES</span>
          </div>
          <h2 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Four ways to play.
          </h2>
        </div>
        <p class="text-gray-400 text-sm sm:text-base max-w-md font-sans leading-relaxed">
          From high-stakes roast tribunals to quiet couple reflections and pixel hangs, choose your pod's flavor.
        </p>
      </div>

      <!-- 4 Game Mode Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Mode 1: Couples & Duos -->
        <div class="rounded-3xl bg-[#121522] border border-[#262B40] hover:border-duo-rose/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg group">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-duo-rose/15 border border-duo-rose/30 flex items-center justify-center text-duo-rose mb-5 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[26px]">favorite</span>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-display text-xl font-bold text-white">Couples & Duos</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
              Date night games powered by shared memories & inside jokes. Discover who remembers the anniversary details best.
            </p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-gray-300 border border-border">OUR LORE</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-duo-rose border border-duo-rose/30">SWEET & SPICY</span>
            </div>
          </div>
          <button class="btn-mode-card w-full py-2.5 rounded-xl bg-surface-bright hover:bg-duo-rose hover:text-white text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5" data-mode="US">
            <span>Launch Us Mode</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        <!-- Mode 2: Squads & Pods (Popular) -->
        <div class="rounded-3xl bg-gradient-to-b from-[#1E1926] to-[#121522] border-2 border-sunset-coral/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 shadow-glow-coral group relative">
          <div class="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-sunset-coral text-canvas font-bold text-[10px] uppercase tracking-wider shadow">
            MOST POPULAR 🔥
          </div>
          <div>
            <div class="w-12 h-12 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral mb-5 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[26px]">groups</span>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-display text-xl font-bold text-white">Squads & Pods</h3>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
              Friend group roasts, bracket battles & photobook lore. Real group chat screenshots turned into ruthless comedy.
            </p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span class="px-2.5 py-0.5 rounded-full bg-sunset-coral/15 text-[10px] font-mono text-sunset-coral border border-sunset-coral/30">ROAST ROOM</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-gray-300 border border-border">WHO SAID THIS?</span>
            </div>
          </div>
          <button class="btn-mode-card w-full py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow" data-mode="PODS">
            <span>Launch Pod Game</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        <!-- Mode 3: Solo Reflection -->
        <div class="rounded-3xl bg-[#121522] border border-[#262B40] hover:border-amber-gold/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg group">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold mb-5 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[26px]">self_improvement</span>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-display text-xl font-bold text-white">Solo Reflection</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
              Mindful personal games, time capsules & memory vault. Revisit forgotten camera roll moments with gentle prompts.
            </p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-gray-300 border border-border">TIME CAPSULE</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-amber-gold border border-amber-gold/30">DAILY PROMPT</span>
            </div>
          </div>
          <button class="btn-mode-card w-full py-2.5 rounded-xl bg-surface-bright hover:bg-amber-gold hover:text-canvas text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5" data-mode="SOLO">
            <span>Open Vault</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        <!-- Mode 4: Pixel Glade -->
        <div class="rounded-3xl bg-[#121522] border border-[#262B40] hover:border-mint-green/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg group">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-mint-green/15 border border-mint-green/30 flex items-center justify-center text-mint-green mb-5 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[26px]">stadia_controller</span>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-display text-xl font-bold text-white">Pixel Glade</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
              Retro 2D pixel campfire lounge for lo-fi chill hangs. Roast pixel marshmallows and leave graffiti on the shared canvas.
            </p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-gray-300 border border-border">LO-FI BEATS</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#181C2B] text-[10px] font-mono text-mint-green border border-mint-green/30">CAMPFIRE CHAT</span>
            </div>
          </div>
          <button class="btn-mode-card w-full py-2.5 rounded-xl bg-surface-bright hover:bg-mint-green hover:text-canvas text-gray-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5" data-view="GLADE">
            <span>Enter Glade</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>

    <!-- SECTION 3: PHYSICAL KEEPSAKES & PHOTOBOOK (Exact Replica of Screenshot 3) -->
    <section class="relative w-full py-20 lg:py-28 bg-[#0D101C] border-y border-[#262B40]/80 overflow-hidden">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left: Text & Features -->
        <div class="lg:col-span-6 text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/10 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <span class="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>PHYSICAL KEEPSAKE</span>
          </div>
          <h2 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Turn game night into a physical keepsake.
          </h2>
          <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 font-sans">
            Every memorable round, tribunal verdict, and inside joke quote is automatically compiled into a gorgeous, archival-grade physical photobook. 
          </p>

          <!-- Book Features List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-sunset-coral/20 text-sunset-coral flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
              <p class="text-sm text-gray-300 font-medium">
                <strong class="text-white">Museum-Grade Layflat Binding:</strong> Ultra-thick 240gsm luster pages that open completely flat without gutter loss.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-amber-gold/20 text-amber-gold flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
              <p class="text-sm text-gray-300 font-medium">
                <strong class="text-white">Real Hot Foil Stamping:</strong> Custom debossed metallic gold titles featuring your pod's official secret name.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-mint-green/20 text-mint-green flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
              <p class="text-sm text-gray-300 font-medium">
                <strong class="text-white">1-Click Pod Cost Split:</strong> Easily split the printing cost across all pod members with one shareable link.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <button id="btn-explore-photobook" class="px-6 py-3 rounded-full bg-amber-gold text-canvas font-bold text-sm shadow-glow-amber hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Explore Photobook</span>
            </button>
            <span class="text-xs font-mono text-gray-400">Hardcover ($38) & Softcover ($24)</span>
          </div>
        </div>

        <!-- Right: 3D Layflat Book Interactive Mockup -->
        <div class="lg:col-span-6 flex justify-center">
          <div class="relative w-full max-w-[500px] h-[360px] sm:h-[420px] rounded-3xl bg-[#151928] border border-[#2B3147] shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
            
            <!-- Book Cover Badge & Binding Spine -->
            <div class="flex items-center justify-between pb-4 border-b border-[#262B40]">
              <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">
                CABIN TRIP 2025 // POD ARCHIVE
              </span>
              <span class="text-[11px] font-mono text-gray-400">48 PAGES • HARDCOVER</span>
            </div>

            <!-- Layflat Book Spread Preview -->
            <div class="grid grid-cols-2 gap-4 py-4 h-full">
              <!-- Left Page: Polaroids & Quotes -->
              <div class="bg-[#1C2033] rounded-xl p-3 border border-white/5 flex flex-col justify-between shadow-inner">
                <div class="w-full h-24 rounded-lg overflow-hidden border border-white/10 relative bg-[#0D101A] shadow-inner group-hover:border-amber-gold/40 transition-colors">
                  <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80" alt="Cabin Deck Campfire" class="w-full h-full object-cover" />
                  <div class="absolute bottom-1.5 left-2 bg-black/80 backdrop-blur-sm text-[9px] font-mono px-2 py-0.5 rounded text-amber-gold border border-amber-gold/30">
                    3:15 AM · Cabin Deck Fire
                  </div>
                </div>
                <div class="text-[11px] text-gray-300 italic">
                  "Priya claimed she could start a fire with two sticks... burnt the marshmallows in 4 seconds."
                </div>
                <div class="text-[9px] font-mono text-sunset-coral font-bold uppercase">MVP CHAOS AGENT: PRIYA</div>
              </div>

              <!-- Right Page: Superlatives & Scores -->
              <div class="bg-[#1C2033] rounded-xl p-3 border border-white/5 flex flex-col justify-between shadow-inner">
                <div class="text-[11px] font-bold text-white mb-1">POD AWARDS 2025</div>
                <div class="space-y-1.5 text-[10px] text-gray-400">
                  <div class="flex justify-between"><span>👑 Lore Master</span><span class="text-white font-bold">Harshal</span></div>
                  <div class="flex justify-between"><span>🍕 Hawaiian Pizza Ally</span><span class="text-white font-bold">Marcus</span></div>
                  <div class="flex justify-between"><span>💤 First Asleep on Couch</span><span class="text-white font-bold">Sam</span></div>
                </div>
                <div class="w-full py-1.5 rounded-lg bg-amber-gold/20 text-amber-gold text-[10px] font-bold text-center border border-amber-gold/30">
                  ARCHIVED FOREVER
                </div>
              </div>
            </div>

            <!-- Book Footer Action -->
            <div class="pt-3 border-t border-[#262B40] flex items-center justify-between">
              <span class="text-xs text-gray-400">Italian Obsidian Bookcloth</span>
              <button class="text-xs font-bold text-amber-gold hover:text-white flex items-center gap-1 transition-colors" id="btn-preview-book-modal">
                <span>Interactive 3D Preview</span>
                <span class="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 4: 10-SECOND POD JOIN TIMELINE (Exact Replica of Screenshot 4) -->
    <section class="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto z-20">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-green/10 border border-mint-green/30 text-mint-green text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <span class="material-symbols-outlined text-[14px]">bolt</span>
          <span>FRICTIONLESS LAUNCH</span>
        </div>
        <h2 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          From group chat to game night in 10 seconds.
        </h2>
        <p class="text-gray-400 text-sm sm:text-base font-sans">
          No mandatory sign-ups for guests, no tedious trivia question entry. Just instantaneous memories.
        </p>
      </div>

      <!-- 3-Step Timeline Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        
        <!-- Step 1 -->
        <div class="p-8 rounded-3xl bg-[#121522] border border-[#262B40] relative flex flex-col items-start group hover:border-amber-gold/50 transition-all">
          <div class="w-10 h-10 rounded-full bg-amber-gold/20 text-amber-gold font-mono font-extrabold text-sm flex items-center justify-center mb-6 border border-amber-gold/40">
            01
          </div>
          <h3 class="font-display text-xl font-bold text-white mb-2">Drop your media</h3>
          <p class="text-gray-400 text-sm leading-relaxed font-sans">
            Paste an exported WhatsApp group chat, dump camera roll photos, or enter 3 inside joke keywords into the Vault.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="p-8 rounded-3xl bg-[#121522] border border-[#262B40] relative flex flex-col items-start group hover:border-sunset-coral/50 transition-all">
          <div class="w-10 h-10 rounded-full bg-sunset-coral/20 text-sunset-coral font-mono font-extrabold text-sm flex items-center justify-center mb-6 border border-sunset-coral/40">
            02
          </div>
          <h3 class="font-display text-xl font-bold text-white mb-2">AI crafts custom games</h3>
          <p class="text-gray-400 text-sm leading-relaxed font-sans">
            Our private agent extracts inside jokes, nicknames, and wild quotes into 5 hilarious party game formats automatically.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="p-8 rounded-3xl bg-[#121522] border border-[#262B40] relative flex flex-col items-start group hover:border-mint-green/50 transition-all">
          <div class="w-10 h-10 rounded-full bg-mint-green/20 text-mint-green font-mono font-extrabold text-sm flex items-center justify-center mb-6 border border-mint-green/40">
            03
          </div>
          <h3 class="font-display text-xl font-bold text-white mb-2">Play on any phone</h3>
          <p class="text-gray-400 text-sm leading-relaxed font-sans">
            Share the 4-letter room code or QR. Guests tap buzzers directly in mobile Safari or Chrome with zero installation.
          </p>
        </div>

      </div>

      <!-- Quick Launch Box -->
      <div class="mt-16 max-w-xl mx-auto p-2 rounded-full bg-[#10131C] border border-[#262B40] flex items-center justify-between shadow-2xl">
        <span class="pl-6 text-sm text-gray-400 font-sans">Ready to start with your crew?</span>
        <button id="btn-bottom-ignite" class="px-6 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs sm:text-sm shadow-glow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
          <span>Ignite Room — Free</span>
        </button>
      </div>

    </section>
  `;
}

export function bindHomeScrollStory() {
  // Mode card clicks
  const modeCards = document.querySelectorAll('.btn-mode-card');
  modeCards.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const mode = btn.dataset.mode;
      const view = btn.dataset.view;
      if (mode) store.setMode(mode);
      if (view) {
        store.setView(view);
      } else if (mode === 'SOLO') {
        store.setView('MEMORIES');
      } else {
        store.createNewRoom();
        store.setView('LOBBY');
      }
    });
  });

  // Photobook explorer
  const photobookBtn = document.getElementById('btn-explore-photobook');
  if (photobookBtn) {
    photobookBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('YEARBOOK');
    });
  }

  // 3D book preview modal
  const bookPreviewBtn = document.getElementById('btn-preview-book-modal');
  if (bookPreviewBtn) {
    bookPreviewBtn.addEventListener('click', () => {
      audio.playChime();
      store.setView('YEARBOOK');
    });
  }

  // Bottom ignite CTA
  const bottomIgnite = document.getElementById('btn-bottom-ignite');
  if (bottomIgnite) {
    bottomIgnite.addEventListener('click', () => {
      audio.playChime();
      store.createNewRoom();
      store.setView('LOBBY');
    });
  }
}
