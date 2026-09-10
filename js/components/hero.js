// ==============================================================================
// HERO & ONBOARDING PORTAL COMPONENT
// Faithfully matches Google Stitch Warm Analog Cyber design with full interactivity
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

export function renderHero() {
  const user = store.getState().currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';
  const userBadge = userName.substring(0, 2).toUpperCase();

  return `
    <div class="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col min-h-screen">
      <!-- Ambient Glow Orbs -->
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sunset-coral/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div class="absolute top-96 right-10 w-[550px] h-[550px] bg-amber-gold/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div class="absolute top-[1600px] left-10 w-[500px] h-[500px] bg-duo-rose/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <!-- 1. HERO SECTION -->
      <section class="pt-8 sm:pt-14 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Left Column: Copy & Value Proposition -->
        <div class="lg:col-span-6 flex flex-col space-y-7">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border w-fit text-xs font-medium text-gray-300">
            <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
            <span>Private & Encrypted Social Gaming</span>
            <span class="text-gray-500">•</span>
            <span class="text-amber-gold font-semibold">Zero Pre-Written Trivia</span>
          </div>

          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Party games made from <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-gold via-sunset-coral to-duo-rose">your own memories.</span>
          </h1>

          <p class="text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
            No generic trivia. Drop in your real group chats, photos, and inside jokes. Bondfire auto-generates hilarious personalized games and keepsakes for your people.
          </p>

          <!-- CTAs & Room Code Join -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full max-w-lg">
            <div class="flex items-center justify-between p-1 rounded-full bg-surface border border-border focus-within:border-sunset-coral/80 transition-colors shadow-lg w-full sm:w-auto">
              <div class="pl-3.5 pr-1 py-1 text-xs font-mono text-gray-400 flex items-center gap-1.5 flex-1 min-w-0">
                <span class="text-sunset-coral font-bold shrink-0">#</span>
                <input id="hero-room-input" class="bg-transparent border-none text-white font-bold tracking-widest text-sm focus:outline-none w-full sm:w-28 uppercase placeholder:text-gray-500 font-room-code" placeholder="ROOM CODE" type="text" maxlength="8" autocomplete="off" />
              </div>
              <button id="btn-hero-join-room" class="px-4 sm:px-5 py-2.5 rounded-full bg-sunset-coral hover:bg-sunset-coral/90 text-white font-bold text-xs sm:text-sm shadow-glow-coral transition-all active:scale-95 shrink-0">
                Join Room →
              </button>
            </div>

            <button id="btn-hero-create-pod" class="px-6 py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-sm shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0">
              <span class="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create a Room</span>
            </button>
          </div>

          <!-- Social Proof Stats -->
          <div class="pt-6 border-t border-border/80 flex items-center gap-6">
            <div class="flex items-center -space-x-2.5">
              <div class="w-9 h-9 rounded-full border-2 border-canvas bg-secondary-container flex items-center justify-center text-[11px] font-bold text-on-secondary-container shadow-sm">RK</div>
              <div class="w-9 h-9 rounded-full border-2 border-canvas bg-primary-container flex items-center justify-center text-[11px] font-bold text-on-primary shadow-sm">MY</div>
              <div class="w-9 h-9 rounded-full border-2 border-canvas bg-tertiary-container flex items-center justify-center text-[11px] font-bold text-on-tertiary shadow-sm">AL</div>
              <div class="w-9 h-9 rounded-full border-2 border-canvas bg-surface-bright text-sunset-coral font-bold text-xs flex items-center justify-center">
                +4k
              </div>
            </div>
            <div class="text-xs text-gray-400 leading-snug">
              <p class="font-bold text-white text-sm">34,000+ Inside Jokes Played</p>
              <p>Across Discord, WhatsApp & iMessage exports</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Card Stack Demo Preview -->
        <div class="lg:col-span-6 relative">
          <!-- Floating Ambient Background Card Elements -->
          <div class="absolute -top-8 -left-6 bg-surface/50 border border-border rounded-3xl w-72 h-80 transform -rotate-6 blur-[1px] pointer-events-none"></div>
          <div class="absolute -bottom-6 -right-6 bg-surface/50 border border-border rounded-3xl w-72 h-80 transform rotate-6 blur-[1px] pointer-events-none"></div>

          <!-- Main Game Card Stack Container -->
          <div class="relative bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-2xl shadow-black/80">
            <!-- Game Round Header -->
            <div class="flex items-center justify-between pb-5 border-b border-border/70">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-sunset-coral animate-ping"></span>
                <span class="font-display font-bold text-xs uppercase tracking-wider text-sunset-coral">
                  Round 2 · Who Said This in 2019?
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs font-mono bg-canvas px-3 py-1 rounded-full border border-border text-amber-gold">
                <span class="material-symbols-outlined text-[14px] text-amber-gold animate-spin">schedule</span>
                <span id="hero-demo-timer">00:14s left</span>
              </div>
            </div>

            <!-- Stylized Screenshot Card of Real Archived Message -->
            <div class="my-5 p-5 rounded-2xl bg-canvas border border-border/80 relative overflow-hidden group">
              <div class="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                <span class="flex items-center gap-1.5 font-medium text-gray-400">
                  <span class="material-symbols-outlined text-duo-rose text-[14px]">chat</span>
                  Group Chat Archive • July 14, 2019 • 2:41 AM
                </span>
                <span class="px-2 py-0.5 rounded bg-surface border border-border text-gray-400 text-[10px]">Unedited</span>
              </div>
              <p class="text-base sm:text-lg font-medium text-gray-100 italic leading-relaxed">
                “If anyone orders another Hawaiian pizza tonight I am literally revoking my Netflix password for all 5 of you.”
              </p>
              <div class="mt-3 flex items-center gap-2 text-[11px] text-amber-gold/90 font-medium">
                <span>🔥 8 reactions</span>
                <span>•</span>
                <span>Context: Austin Airbnb trip</span>
              </div>
            </div>

            <!-- 4 Avatar Voting Choices with Live Progress Bars -->
            <div class="space-y-2.5" id="hero-demo-options">
              <!-- Choice 1: You / User -->
              <div class="p-3 rounded-xl bg-canvas/60 border border-border hover:border-sunset-coral/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="${userName}">
                <div class="absolute inset-0 bg-sunset-coral/15 w-[65%] rounded-xl pointer-events-none"></div>
                <div class="relative z-10 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs border border-sunset-coral">${userBadge}</div>
                    <span class="text-sm font-semibold text-white">${userName === 'You' ? 'You' : `${userName} (You)`}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-bold text-sunset-coral">
                    <span>3 Votes</span>
                    <span class="text-gray-400 text-[11px]">(65%)</span>
                  </div>
                </div>
              </div>

              <!-- Choice 2: Liam (CORRECT ANSWER) -->
              <div class="p-3 rounded-xl bg-canvas/60 border border-border hover:border-amber-gold/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="Liam">
                <div class="absolute inset-0 bg-amber-gold/10 w-[20%] rounded-xl pointer-events-none"></div>
                <div class="relative z-10 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs border border-border">LM</div>
                    <span class="text-sm font-medium text-gray-300">Liam</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>1 Vote</span>
                    <span class="text-gray-500 text-[11px]">(20%)</span>
                  </div>
                </div>
              </div>

              <!-- Choice 3: Sarah -->
              <div class="p-3 rounded-xl bg-canvas/60 border border-border hover:border-duo-rose/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="Sarah">
                <div class="absolute inset-0 bg-duo-rose/10 w-[15%] rounded-xl pointer-events-none"></div>
                <div class="relative z-10 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-xs border border-border">SH</div>
                    <span class="text-sm font-medium text-gray-300">Sarah</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>1 Vote</span>
                    <span class="text-gray-500 text-[11px]">(15%)</span>
                  </div>
                </div>
              </div>

              <!-- Choice 4: Alex -->
              <div class="p-3 rounded-xl bg-canvas/60 border border-border opacity-70 hover:opacity-100 transition-all cursor-pointer hero-demo-opt" data-option="Alex">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-surface-bright text-on-surface flex items-center justify-center font-bold text-xs border border-border">AX</div>
                    <span class="text-sm font-medium text-gray-300">Alex</span>
                  </div>
                  <span class="text-xs text-gray-500">0 Votes</span>
                </div>
              </div>
            </div>

            <!-- Feedback Toast / Notice -->
            <div id="hero-demo-feedback" class="mt-3 text-center text-xs font-display font-bold text-amber-gold min-h-[20px]">
              Tap who you think sent this message!
            </div>

            <!-- Live Pod Activity Bar -->
            <div class="mt-4 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-gray-400">
              <span class="flex items-center gap-1.5 text-mint-green font-medium">
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
                5 of 5 Pod players submitted
              </span>
              <span class="text-gray-400 font-mono text-[11px]">+140 Pod XP</span>
            </div>

            <!-- Floating Interactive Badge -->
            <div class="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-right-4 bg-gradient-to-r from-surface to-surface-bright border border-amber-gold/50 rounded-2xl px-4 py-2.5 shadow-glow-amber flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform" id="hero-yearbook-badge">
              <span class="text-xl shrink-0">📖</span>
              <div class="flex flex-col text-left min-w-0">
                <span class="text-xs font-bold text-white tracking-tight truncate">Saved to Pod 2026 Yearbook</span>
                <span class="text-[10px] text-amber-gold font-medium truncate">Auto-compiled into Hardcover Print</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 3-WAY (+ PIXEL GLADE) MODE SHOWCASE GRID -->
      <section class="py-16 border-t border-border/80">
        <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-sunset-coral">
            <span>MULTIPLAYER & REFLECTION ARCHITECTURE</span>
          </div>
          <h2 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Three ways to play. One permanent archive.
          </h2>
          <p class="text-base text-gray-400">
            Whether you’re sharing late-night laughs with your best friends, doing an intimate check-in with your partner, or leaving a quiet letter for yourself in 2030.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- CARD 1: Couples ('Us Mode') -->
          <div class="group relative bg-surface rounded-3xl border border-border hover:border-duo-rose/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-glow-rose/20 cursor-pointer" id="card-mode-us">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-duo-rose/15 border border-duo-rose/40 flex items-center justify-center text-2xl">
                  💑
                </div>
                <span class="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-duo-rose/15 text-duo-rose border border-duo-rose/30">
                  Us Mode
                </span>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-duo-rose transition-colors">
                  Couples & Duos
                </h3>
                <p class="text-xs font-semibold text-gray-400 mt-0.5 italic">
                  “Highest intimacy, zero awkwardness.”
                </p>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed">
                Intimate date night quizzes, "Then vs Now" side-by-side photo comparison games, and milestone anniversary keepsakes.
              </p>
              <!-- Mini Visual Feature Preview -->
              <div class="p-3 rounded-2xl bg-canvas border border-border space-y-2">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Featured Mode</span>
                  <span class="text-duo-rose font-bold">2-Player Sync</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-center text-xs">
                  <div class="p-2 rounded-xl bg-surface border border-border">
                    <div class="text-[9px] text-gray-400">2021 First Date</div>
                    <div class="font-bold text-white mt-0.5 text-[11px]">Luna Cafe ☕</div>
                  </div>
                  <div class="p-2 rounded-xl bg-surface border border-border">
                    <div class="text-[9px] text-gray-400">2024 Anniversary</div>
                    <div class="font-bold text-duo-rose mt-0.5 text-[11px]">Dolomite Peaks 🏔️</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-duo-rose">
              <span>Explore Couples Vault</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 2: Squads ('Pod Mode') -->
          <div class="group relative bg-surface rounded-3xl border-2 border-sunset-coral/50 shadow-glow-coral/20 transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer" id="card-mode-pods">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/40 flex items-center justify-center text-2xl">
                  👥
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40">
                    Pod Mode
                  </span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-gold text-canvas">POPULAR</span>
                </div>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-sunset-coral transition-colors">
                  Squads & Pods
                </h3>
                <p class="text-xs font-semibold text-gray-400 mt-0.5 italic">
                  “No pre-written cards.”
                </p>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed">
                Roast trivia, inside joke bluffing, drunken voice note reaction rounds, and auto-generated yearbooks with zero icebreakers.
              </p>
              <!-- Mini Visual Feature Preview -->
              <div class="p-3 rounded-2xl bg-canvas border border-border space-y-2">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Active Mini-Game</span>
                  <span class="text-sunset-coral">3–16 Players</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                  <span class="font-medium text-gray-200 text-[11px]">🎙️ Audio Mystery Round</span>
                  <span class="px-1.5 py-0.5 rounded bg-sunset-coral/20 text-sunset-coral text-[9px] font-mono">0:04 Clip</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                  <span class="font-medium text-gray-200 text-[11px]">🏆 Roast Champion</span>
                  <span class="text-amber-gold font-bold text-[11px]">Liam (+450)</span>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-sunset-coral">
              <span>Launch Squad Room</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 3: Solo ('Time Capsule') -->
          <div class="group relative bg-surface rounded-3xl border border-border hover:border-amber-gold/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-glow-amber/20 cursor-pointer" id="card-mode-solo">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-amber-gold/15 border border-amber-gold/40 flex items-center justify-center text-2xl">
                  👤
                </div>
                <span class="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-gold/15 text-amber-gold border border-amber-gold/30">
                  Time Capsule
                </span>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-gold transition-colors">
                  Solo Reflection
                </h3>
                <p class="text-xs font-semibold text-gray-400 mt-0.5 italic">
                  “Your private emotional vault.”
                </p>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed">
                Sealed letters to your future self, quiet photo reflections, unreleased audio journals, and 1-tap multiplayer shares.
              </p>
              <!-- Mini Visual Feature Preview -->
              <div class="p-3 rounded-2xl bg-canvas border border-border space-y-2">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Vault Status</span>
                  <span class="text-amber-gold font-mono text-[10px]">🔒 Encrypted</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <div class="flex justify-between text-gray-400 text-[9px]">
                    <span>Sealed Letter #04</span>
                    <span>Opens Dec 31, 2028</span>
                  </div>
                  <div class="font-medium text-white truncate text-[11px]">“What I hope I haven’t forgotten...”</div>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-amber-gold">
              <span>Seal First Capsule</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 4: Creative Feature ('Pixel Glade & Arcade') -->
          <div class="group relative bg-surface rounded-3xl border border-border hover:border-mint-green/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-glow-mint/20 cursor-pointer" id="card-mode-glade">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-mint-green/15 border border-mint-green/40 flex items-center justify-center text-2xl">
                  🏕️
                </div>
                <span class="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30">
                  Pixel Arcade
                </span>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-mint-green transition-colors">
                  Pixel Glade
                </h3>
                <p class="text-xs font-semibold text-gray-400 mt-0.5 italic">
                  “16-bit campfire & mini-games.”
                </p>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed">
                Animated pixel characters gathered around a cozy fire, live 32x32 graffiti board, and golden s'more reflex timing!
              </p>
              <!-- Mini Visual Feature Preview -->
              <div class="p-3 rounded-2xl bg-canvas border border-border space-y-2">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Retro Activities</span>
                  <span class="text-mint-green font-mono text-[10px]">Chiptune Live</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border text-xs flex items-center justify-between">
                  <span class="text-white text-[11px]">🎨 32x32 Graffiti</span>
                  <span class="text-mint-green text-[10px] font-bold">1-Click Print</span>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-mint-green">
              <span>Enter Pixel Glade</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. KEEPSAKE & PRINT-ON-DEMAND FEATURE SECTION -->
      <section class="py-16 border-t border-border/80">
        <div class="bg-gradient-to-br from-surface to-surface-dark rounded-[36px] border border-border p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div class="absolute -top-32 -right-32 w-96 h-96 bg-amber-gold/15 rounded-full blur-[120px] pointer-events-none"></div>
          <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-sunset-coral/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <!-- Left Column: Copy & Details -->
            <div class="lg:col-span-5 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/10 border border-amber-gold/30 text-amber-gold text-xs font-bold uppercase tracking-wider">
                <span>🖨️ Physical Keepsakes & Books</span>
              </div>
              <h2 class="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Turn a year of digital chaos into a museum-grade book.
              </h2>
              <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
                At the end of every season, Bondfire automatically synthesizes your pod’s photos, hilarious wrong answers, MVP awards, and greatest chat quotes into an archival hardcover coffee table book.
              </p>
              <ul class="space-y-3 text-sm text-gray-300">
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-mint-green/20 text-mint-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>No manual scrapbooking:</strong> Auto-curated from your highest-rated game rounds.</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-mint-green/20 text-mint-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>Foil-stamped hardcover:</strong> 180gsm archival paper, Smyth-sewn layflat binding.</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-mint-green/20 text-mint-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>1-Click Pod Split:</strong> Ship copies to all group members with address collection links.</span>
                </li>
              </ul>
              <div class="pt-2 flex items-center gap-4 flex-wrap">
                <button id="btn-hero-preview-yearbook" class="px-6 py-3 rounded-full bg-amber-gold hover:bg-amber-gold/90 text-canvas font-bold text-sm shadow-glow-amber transition-all active:scale-95">
                  Preview Sample Yearbook (PDF)
                </button>
                <span class="text-xs text-gray-400 font-mono">From $38 / copy</span>
              </div>
            </div>

            <!-- Right Column: Visual 3D Preview of Open Hardcover Book -->
            <div class="lg:col-span-7 flex justify-center py-4">
              <div class="relative w-full max-w-xl book-spine-3d transition-transform duration-500 hover:rotate-0">
                <div class="bg-[#121522] rounded-2xl border-4 border-[#2A3048] p-4 sm:p-6 shadow-2xl relative">
                  <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/80 to-black/40 pointer-events-none z-20"></div>
                  <!-- Open Two-Page Spread -->
                  <div class="grid grid-cols-2 gap-4 relative z-10 bg-[#0C0E17] rounded-xl p-4 border border-border text-left">
                    <!-- Left Page: The Funniest Bluffs & Photos -->
                    <div class="space-y-3 pr-2">
                      <div class="flex items-center justify-between border-b border-border pb-1.5">
                        <span class="text-[9px] font-mono uppercase text-sunset-coral font-bold tracking-widest">CH 4: THE CABIN TRIP</span>
                        <span class="text-[9px] text-gray-500 font-mono">p. 42</span>
                      </div>
                      <div class="rounded-lg overflow-hidden border border-border relative aspect-video bg-surface-container flex items-center justify-center">
                        <img alt="Cabin Trip" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmTvkxTpmNJFJSFINhAeLGm8sUBPCJkNY2tvuprYLpPtmpoZGndhi9Y8iVIN8gzZUXAug0Hrygmir0VhptFCHbHiqbt-Fex-S19G0c04ZLgJeDlK2yqcf46pVxEj5y4zJDYSxjc_1ZTHm1cq-b44hlgJTQDrgAV7SgJD7lw-2lIM2_odAZ4394Hxx_Ai5YmMbghI34_YJ4zCvNTdL1r0XI7en4Sy6nFawO7B3U8BovJmj26dnk879lPA" />
                        <div class="absolute bottom-1 left-1 bg-black/80 text-[8px] font-mono px-1.5 py-0.5 rounded text-amber-gold">
                          3:15 AM · Power Outage
                        </div>
                      </div>
                      <div class="p-2 rounded-lg bg-surface border border-border/70 text-[10px] space-y-0.5">
                        <div class="text-amber-gold font-bold">“Voted Worst Bluff”</div>
                        <div class="text-gray-300 italic">“Marcus tried to convince everyone he played college polo.”</div>
                        <div class="text-gray-500 text-[8px] text-right">— 100% Callout</div>
                      </div>
                    </div>

                    <!-- Right Page: Pod Superlatives & Season Recap -->
                    <div class="space-y-3 pl-2">
                      <div class="flex items-center justify-between border-b border-border pb-1.5">
                        <span class="text-[9px] font-mono uppercase text-amber-gold font-bold tracking-widest">POD AWARDS 2025</span>
                        <span class="text-[9px] text-gray-500 font-mono">p. 43</span>
                      </div>
                      <div class="space-y-1.5">
                        <div class="p-1.5 rounded-lg bg-surface border border-border flex items-center gap-2">
                          <span class="text-xs">👑</span>
                          <div>
                            <div class="text-[9px] font-bold text-white leading-none">MVP Trivia Legend</div>
                            <div class="text-[8px] text-sunset-coral">Sarah K. (94%)</div>
                          </div>
                        </div>
                        <div class="p-1.5 rounded-lg bg-surface border border-border flex items-center gap-2">
                          <span class="text-xs">🌪️</span>
                          <div>
                            <div class="text-[9px] font-bold text-white leading-none">The Chaos Agent</div>
                            <div class="text-[8px] text-amber-gold">Devon (Most wild)</div>
                          </div>
                        </div>
                        <div class="p-1.5 rounded-lg bg-surface border border-border flex items-center gap-2">
                          <span class="text-xs">💤</span>
                          <div>
                            <div class="text-[9px] font-bold text-white leading-none">First Asleep On Couch</div>
                            <div class="text-[8px] text-duo-rose">Alex (Every Friday)</div>
                          </div>
                        </div>
                      </div>
                      <div class="pt-1.5 border-t border-border flex items-center justify-between text-[8px] text-gray-500 font-mono">
                        <span>POD: GOA CREW</span>
                        <span class="text-mint-green">PRINTED ARCHIVE</span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-mono px-2">
                    <span class="text-amber-gold font-semibold">✨ Smyth-Sewn Matte Finish • Volume I</span>
                    <span class="text-gray-500">120 Pages • Hardcover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CALL TO ACTION FOOTER BANNER -->
      <section class="py-16 text-center relative border-t border-border/80">
        <div class="max-w-3xl mx-auto space-y-6">
          <div class="space-y-3">
            <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Start a Pod in 10 Seconds.
            </h2>
            <p class="text-base sm:text-lg text-gray-300 font-normal">
              No app download required, 100% private. Works right in any browser on phone, tablet, or TV.
            </p>
          </div>

          <!-- Room Code Input Pill with Join Room Button -->
          <div class="max-w-md mx-auto p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-surface border-2 border-sunset-coral/50 shadow-glow-coral flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
            <div class="pl-3 sm:pl-4 py-1.5 flex items-center gap-2 text-gray-400 font-mono text-xs flex-1 min-w-0">
              <span class="text-sunset-coral font-bold shrink-0">#</span>
              <input id="footer-room-code-input" class="bg-transparent border-none text-white font-mono font-bold tracking-widest text-sm focus:outline-none w-full uppercase placeholder:text-gray-500 font-room-code" placeholder="ENTER 4-LETTER CODE" type="text" maxlength="8" autocomplete="off" />
            </div>
            <button id="btn-footer-join-room" class="px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:from-sunset-coral/90 hover:to-amber-gold/90 text-canvas font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 shrink-0">
              Join Room →
            </button>
          </div>

          <!-- Privacy & Security Reassurance Micro-badges -->
          <div class="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 border-t border-border/60">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-mint-green">verified_user</span>
              End-to-End Encrypted Vaults
            </span>
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-amber-gold">lock</span>
              No AI Model Training on User Chats
            </span>
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-sunset-coral">delete_forever</span>
              1-Click Memory Purge Any Time
            </span>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function bindHeroEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Create Pod Button -> Generate dynamic room & enter Lobby
  const createPodBtn = document.getElementById('btn-hero-create-pod');
  if (createPodBtn) {
    createPodBtn.addEventListener('click', () => {
      audio.playChime();
      store.createNewRoom();
      store.setView('LOBBY');
    });
  }

  // Join Room from Hero Input
  const joinHeroBtn = document.getElementById('btn-hero-join-room');
  const heroInput = document.getElementById('hero-room-input');
  if (joinHeroBtn && heroInput) {
    const handleHeroJoin = () => {
      const code = heroInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        store.setRoomCode(code);
        store.setView('LOBBY');
      } else {
        audio.playClick();
        heroInput.focus();
        heroInput.placeholder = 'ENTER CODE!';
        heroInput.classList.add('animate-pulse');
        setTimeout(() => {
          heroInput.placeholder = 'ROOM CODE';
          heroInput.classList.remove('animate-pulse');
        }, 1500);
      }
    };
    joinHeroBtn.addEventListener('click', handleHeroJoin);
    heroInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleHeroJoin();
    });
  }

  // Join Room from Footer Input
  const footerJoinBtn = document.getElementById('btn-footer-join-room');
  const footerInput = document.getElementById('footer-room-code-input');
  if (footerJoinBtn && footerInput) {
    const handleFooterJoin = () => {
      const code = footerInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        store.setRoomCode(code);
        store.setView('LOBBY');
      } else {
        audio.playClick();
        footerInput.focus();
        footerInput.placeholder = 'ENTER 4-LETTER CODE!';
        footerInput.classList.add('animate-pulse');
        setTimeout(() => {
          footerInput.placeholder = 'ENTER 4-LETTER CODE';
          footerInput.classList.remove('animate-pulse');
        }, 1500);
      }
    };
    footerJoinBtn.addEventListener('click', handleFooterJoin);
    footerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleFooterJoin();
    });
  }

  // Interactive Mini Demo Answer Clicks
  const demoContainer = document.getElementById('hero-demo-options');
  const demoFeedback = document.getElementById('hero-demo-feedback');

  if (demoContainer && demoFeedback) {
    demoContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.hero-demo-opt');
      if (!btn) return;

      audio.playClick();
      const chosen = btn.dataset.option;
      const allBtns = demoContainer.querySelectorAll('.hero-demo-opt');
      allBtns.forEach((b) => (b.style.pointerEvents = 'none'));

      if (chosen === 'Liam') {
        audio.playCorrect();
        confettiInstance.burst(50);
        btn.classList.add('border-mint-green', 'bg-mint-green/20');
        demoFeedback.innerHTML = `<span class="text-mint-green">✨ EXACT MATCH! Liam sent this during the Austin Airbnb trip. (+140 Pod XP)</span>`;
      } else {
        audio.playTick();
        btn.classList.add('border-sunset-coral', 'bg-sunset-coral/20');
        const correctBtn = demoContainer.querySelector('[data-option="Liam"]');
        if (correctBtn) {
          correctBtn.classList.add('border-mint-green', 'bg-mint-green/20');
        }
        demoFeedback.innerHTML = `<span class="text-amber-gold">Nice guess! It was actually Liam. Voted & Archived to 2026 Yearbook 📖</span>`;
      }
    });
  }

  // Mode Card Click Handlers
  const cardUs = document.getElementById('card-mode-us');
  if (cardUs) {
    cardUs.addEventListener('click', () => {
      audio.playClick();
      store.setMode('US');
      store.setView('COUPLE');
    });
  }

  const cardPods = document.getElementById('card-mode-pods');
  if (cardPods) {
    cardPods.addEventListener('click', () => {
      audio.playClick();
      store.setMode('PODS');
      store.setView('LOBBY');
    });
  }

  const cardSolo = document.getElementById('card-mode-solo');
  if (cardSolo) {
    cardSolo.addEventListener('click', () => {
      audio.playClick();
      store.setMode('SOLO');
      store.setView('SOLO');
    });
  }

  const cardGlade = document.getElementById('card-mode-glade');
  if (cardGlade) {
    cardGlade.addEventListener('click', () => {
      audio.playClick();
      store.setView('GLADE');
    });
  }

  // Preview Yearbook CTAs
  const previewYearbookBtn = document.getElementById('btn-hero-preview-yearbook');
  const yearbookBadge = document.getElementById('hero-yearbook-badge');
  const goToYearbook = () => {
    audio.playClick();
    store.setView('YEARBOOK');
  };
  if (previewYearbookBtn) previewYearbookBtn.addEventListener('click', goToYearbook);
  if (yearbookBadge) yearbookBadge.addEventListener('click', goToYearbook);
}
