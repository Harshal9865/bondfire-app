// ==============================================================================
// HERO & ONBOARDING PORTAL COMPONENT
// Faithfully matches Google Stitch Warm Analog Cyber design with full interactivity
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

export function renderHero() {
  const state = store.getState();
  const user = state.currentUser;
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
                “If anyone asks for another scenic detour before morning coffee, I am officially retiring as group navigator.”
              </p>
              <div class="mt-3 flex items-center gap-2 text-[11px] text-amber-gold/90 font-medium">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-sunset-coral">local_fire_department</span><span class="retro-led-coral text-[11px]">8 reactions</span></span>
                <span>•</span>
                <span class="font-mono text-gray-400">Context: Weekend Road Trip</span>
              </div>
            </div>

            <!-- Real People Avatar Voting Choices -->
            <div class="space-y-2.5" id="hero-demo-options">
              <!-- Choice 1: Real User -->
              <div class="p-3 rounded-xl bg-canvas/60 border border-border hover:border-sunset-coral/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="${userName}" data-correct="true">
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

              ${(state.activeRoom?.players || []).filter(p => p.name !== userName && !p.name.includes('(You)') && !p.isBot).map((p, idx) => `
                <div class="p-3 rounded-xl bg-canvas/60 border border-border hover:border-amber-gold/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="${p.name}">
                  <div class="absolute inset-0 bg-amber-gold/10 w-[25%] rounded-xl pointer-events-none"></div>
                  <div class="relative z-10 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs border border-border">${p.name.substring(0, 2).toUpperCase()}</div>
                      <span class="text-sm font-medium text-gray-300">${p.name}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <span>1 Vote</span>
                      <span class="text-gray-500 text-[11px]">(25%)</span>
                    </div>
                  </div>
                </div>
              `).join('')}

              ${(state.activeRoom?.players || []).filter(p => !p.isBot).length <= 1 ? `
                <div class="p-3 rounded-xl bg-canvas/60 border border-dashed border-border/80 hover:border-mint-green/60 transition-all cursor-pointer relative overflow-hidden hero-demo-opt" data-option="Invite Friend" id="btn-hero-invite-camper">
                  <div class="relative z-10 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-surface-bright text-mint-green flex items-center justify-center font-bold text-xs border border-mint-green/40">
                        <span class="material-symbols-outlined text-[15px]">person_add</span>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-200 block">+ Invite Real Friend</span>
                        <span class="text-[10px] text-gray-500 font-mono">Join code: #${state.activeRoom?.roomCode || 'BONDFIRE'}</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded bg-mint-green/10 text-mint-green text-[10px] font-mono font-bold">REAL PEOPLE ONLY</span>
                  </div>
                </div>
              ` : ''}
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
              <span class="material-symbols-outlined text-xl text-amber-gold shrink-0">auto_stories</span>
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
                <div class="w-12 h-12 rounded-2xl bg-duo-rose/15 border border-duo-rose/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl text-duo-rose">favorite</span>
                </div>
                <span class="retro-pixel-badge text-[10px] px-3 py-1 rounded-full bg-duo-rose/15 text-duo-rose border border-duo-rose/30">
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
                  <span class="retro-pixel-badge text-[9px]">Featured Mode</span>
                  <span class="retro-led-rose text-[10px]">2-Player Sync</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-center text-xs">
                  <div class="p-2 rounded-xl bg-surface border border-border">
                    <div class="text-[9px] text-gray-400 font-mono">2021 First Date</div>
                    <div class="font-bold text-white mt-0.5 text-[11px] flex items-center justify-center gap-1"><span>Luna Cafe</span><span class="material-symbols-outlined text-[13px] text-amber-gold">local_cafe</span></div>
                  </div>
                  <div class="p-2 rounded-xl bg-surface border border-border">
                    <div class="text-[9px] text-gray-400 font-mono">2024 Anniversary</div>
                    <div class="font-bold text-duo-rose mt-0.5 text-[11px] flex items-center justify-center gap-1"><span>Dolomite Peaks</span><span class="material-symbols-outlined text-[13px] text-duo-rose">landscape</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-duo-rose">
              <span class="retro-pixel-badge text-[10px]">Explore Couples Vault</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 2: Squads ('Pod Mode') -->
          <div class="group relative bg-surface rounded-3xl border-2 border-sunset-coral/50 shadow-glow-coral/20 transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer" id="card-mode-pods">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl text-sunset-coral">groups</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="retro-pixel-badge text-[10px] px-3 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40">
                    Pod Mode
                  </span>
                  <span class="retro-pixel-badge text-[9px] px-2 py-0.5 rounded bg-amber-gold text-canvas">POPULAR</span>
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
                Interactive trivia, witty bluffing, shared audio reaction rounds, and auto-generated yearbooks with zero awkward icebreakers.
              </p>
              <!-- Mini Visual Feature Preview -->
              <div class="p-3 rounded-2xl bg-canvas border border-border space-y-2">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="retro-pixel-badge text-[9px]">Active Mini-Game</span>
                  <span class="retro-led-coral text-[10px]">3–16 Players</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-sunset-coral">mic</span><span class="font-medium text-gray-200 text-[11px]">Audio Mystery Round</span></div>
                  <span class="px-1.5 py-0.5 rounded bg-sunset-coral/20 text-sunset-coral text-[9px] font-mono">0:04 Clip</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-amber-gold">emoji_events</span><span class="font-medium text-gray-200 text-[11px]">Trivia Champion</span></div>
                  <span class="retro-led-amber font-bold text-[11px]">${(store.getState()?.currentUser?.displayName ? store.getState().currentUser.displayName.split(' ')[0] : 'Squad Host')} (+450)</span>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-sunset-coral">
              <span class="retro-pixel-badge text-[10px]">Launch Squad Room</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 3: Solo ('Time Capsule') -->
          <div class="group relative bg-surface rounded-3xl border border-border hover:border-amber-gold/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-glow-amber/20 cursor-pointer" id="card-mode-solo">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-amber-gold/15 border border-amber-gold/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl text-amber-gold">person</span>
                </div>
                <span class="retro-pixel-badge text-[10px] px-3 py-1 rounded-full bg-amber-gold/15 text-amber-gold border border-amber-gold/30">
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
                  <span class="retro-pixel-badge text-[9px]">Vault Status</span>
                  <span class="flex items-center gap-1 text-amber-gold font-mono text-[10px]"><span class="material-symbols-outlined text-[12px]">lock</span><span class="retro-pixel-badge text-[9px]">ENCRYPTED</span></span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <div class="flex justify-between text-gray-400 text-[9px] font-mono">
                    <span>Sealed Letter #04</span>
                    <span>Opens Dec 31, 2028</span>
                  </div>
                  <div class="font-medium text-white truncate text-[11px]">“What I hope I haven’t forgotten...”</div>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-amber-gold">
              <span class="retro-pixel-badge text-[10px]">Seal First Capsule</span>
              <span>→</span>
            </div>
          </div>

          <!-- CARD 4: Creative Feature ('Pixel Glade & Arcade') -->
          <div class="group relative bg-surface rounded-3xl border border-border hover:border-mint-green/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-glow-mint/20 cursor-pointer" id="card-mode-glade">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-mint-green/15 border border-mint-green/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl text-mint-green">cabin</span>
                </div>
                <span class="retro-pixel-badge text-[10px] px-3 py-1 rounded-full bg-mint-green/15 text-mint-green border border-mint-green/30">
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
                  <span class="retro-pixel-badge text-[9px]">Retro Activities</span>
                  <span class="retro-led-mint text-[10px]">Chiptune Live</span>
                </div>
                <div class="p-2 rounded-xl bg-surface border border-border text-xs flex items-center justify-between">
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-mint-green">palette</span><span class="text-white text-[11px] font-arcade">32×32 Graffiti</span></div>
                  <span class="retro-pixel-badge text-mint-green text-[9px]">1-Click Print</span>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-mint-green">
              <span class="retro-pixel-badge text-[10px]">Enter Pixel Glade</span>
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
            <!-- Left Column: Copy & Details (Matching Image 1) -->
            <div class="lg:col-span-5 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/10 border border-amber-gold/30 text-amber-gold text-xs font-bold">
                <span class="material-symbols-outlined text-[14px]">auto_stories</span>
                <span class="retro-pixel-badge text-[10px]">PHYSICAL KEEPSAKE</span>
              </div>
              <h2 class="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Turn game night into a physical keepsake.
              </h2>
              <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
                Every memorable round, tribunal verdict, and inside joke quote is automatically compiled into a gorgeous, archival-grade physical photobook.
              </p>
              <ul class="space-y-4 text-sm text-gray-300">
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-sunset-coral/20 text-sunset-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>Museum-Grade Layflat Binding:</strong> Ultra-thick 240gsm luster pages that open completely flat without gutter loss.</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-amber-gold/20 text-amber-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>Real Hot Foil Stamping:</strong> Custom debossed metallic gold titles featuring your pod's official secret name.</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-mint-green/20 text-mint-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span><strong>1-Click Pod Cost Split:</strong> Easily split the printing cost across all pod members with one shareable link.</span>
                </li>
              </ul>
              <div class="pt-2 flex items-center gap-4 flex-wrap">
                <button id="btn-hero-preview-yearbook" class="px-6 py-3 rounded-full bg-amber-gold hover:bg-amber-gold/90 text-canvas font-bold text-sm shadow-glow-amber transition-all active:scale-95 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Explore Photobook</span>
                </button>
                <span class="text-xs text-gray-400 font-mono">Hardcover ($38) & Softcover ($24)</span>
              </div>
            </div>

            <!-- Right Column: 3D Tilted Card Preview (Matching Image 1 Exact Replica with Hover Straighten) -->
            <div class="lg:col-span-7 flex justify-center py-4">
              <div class="hero-3d-card-stage">
                <div id="hero-keepsake-3d-card" class="hero-3d-tilted-card relative w-full max-w-xl rounded-3xl bg-[#111422]/95 border-2 border-[#262B40] p-6 shadow-2xl overflow-hidden cursor-pointer group">
                  
                  <!-- Subtle Constellation Mesh Background (Matching Image 1) -->
                  <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-35">
                    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18%" y1="18%" x2="48%" y2="28%" stroke="#FFAE33" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="3 3"/>
                      <line x1="48%" y1="28%" x2="82%" y2="22%" stroke="#FFAE33" stroke-width="1" stroke-opacity="0.35"/>
                      <line x1="48%" y1="28%" x2="42%" y2="65%" stroke="#FF5A5F" stroke-width="1" stroke-opacity="0.3"/>
                      <line x1="42%" y1="65%" x2="72%" y2="78%" stroke="#FFAE33" stroke-width="1" stroke-opacity="0.25"/>
                      <line x1="18%" y1="72%" x2="42%" y2="65%" stroke="#FFAE33" stroke-width="1" stroke-opacity="0.35"/>
                      
                      <circle cx="18%" cy="18%" r="3.5" fill="#FFAE33" opacity="0.7"/>
                      <circle cx="48%" cy="28%" r="4.5" fill="#FFAE33" opacity="0.85"/>
                      <circle cx="82%" cy="22%" r="3.5" fill="#FFAE33" opacity="0.6"/>
                      <circle cx="42%" cy="65%" r="4" fill="#FF5A5F" opacity="0.75"/>
                      <circle cx="72%" cy="78%" r="3" fill="#FFAE33" opacity="0.5"/>
                      <circle cx="18%" cy="72%" r="3.5" fill="#FFAE33" opacity="0.65"/>
                    </svg>
                  </div>

                  <!-- Card Header (Matching Image 1) -->
                  <div class="relative z-10 flex items-center justify-between pb-4 border-b border-[#262B40]">
                    <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">
                      CABIN TRIP 2025 // POD ARCHIVE
                    </span>
                    <span class="text-[11px] font-mono text-gray-400">48 PAGES • HARDCOVER</span>
                  </div>

                  <!-- Layflat Book Spread Preview -->
                  <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <!-- Left Page -->
                    <div class="bg-[#161928] rounded-2xl p-4 border border-[#262B40] flex flex-col justify-between shadow-inner min-h-[220px]">
                      <div class="w-full h-32 rounded-xl overflow-hidden border border-[#202538] relative bg-[#0D101A] shadow-inner group-hover:border-amber-gold/40 transition-colors">
                        <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80" alt="Cabin Deck Campfire" class="w-full h-full object-cover" />
                        <div class="absolute bottom-1.5 left-2 bg-black/80 backdrop-blur-sm text-[9px] font-mono px-2 py-0.5 rounded text-amber-gold border border-amber-gold/30">
                          3:15 AM · Cabin Deck Fire
                        </div>
                      </div>
                      <div class="text-[11px] text-gray-300 italic my-2">
                        "Claimed we could start a fire with two sticks... toasted the marshmallows in record time."
                      </div>
                      <div class="text-[9px] font-mono text-sunset-coral font-bold uppercase">CAMPFIRE STORYTELLER</div>
                    </div>

                    <!-- Right Page -->
                    <div class="bg-[#161928] rounded-2xl p-4 border border-[#262B40] flex flex-col justify-between shadow-inner min-h-[220px]">
                      <div>
                        <div class="text-xs font-bold text-white mb-2 font-mono uppercase">POD SUPERLATIVES</div>
                        <div class="space-y-2 text-[11px] text-gray-400 font-mono">
                          <div class="flex items-center justify-between py-0.5 border-b border-white/5"><span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-amber-gold">hotel_class</span><span>Trivia Champion</span></span><span class="text-white font-bold">${userName}</span></div>
                          <div class="flex items-center justify-between py-0.5 border-b border-white/5"><span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-sunset-coral">explore</span><span>Lead Navigator</span></span><span class="text-white font-bold">${(state.activeRoom?.players || []).length > 1 ? state.activeRoom.players[1].name : 'Camper 2'}</span></div>
                          <div class="flex items-center justify-between py-0.5 border-b border-white/5"><span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-duo-rose">headphones</span><span>Playlist Curator</span></span><span class="text-white font-bold">${(state.activeRoom?.players || []).length > 2 ? state.activeRoom.players[2].name : 'Camper 3'}</span></div>
                        </div>
                      </div>
                      <div class="w-full py-2 rounded-xl bg-amber-gold/20 text-amber-gold text-[10px] font-bold text-center border border-amber-gold/30 hover:bg-amber-gold/30 transition-colors uppercase tracking-wider font-mono mt-2">
                        ARCHIVED FOREVER
                      </div>
                    </div>
                  </div>

                  <!-- Book Footer Action -->
                  <div class="relative z-10 pt-3 border-t border-[#262B40] flex items-center justify-between">
                    <span class="text-xs text-gray-400">Italian Obsidian Bookcloth</span>
                    <button class="text-xs font-bold text-amber-gold hover:text-white flex items-center gap-1 transition-colors" id="btn-preview-book-modal">
                      <span>Interactive 3D Preview</span>
                      <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
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
        store.joinRoomWithCode(code);
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
        store.joinRoomWithCode(code);
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
      if (chosen === 'Invite Friend') {
        const state = store.getState();
        const code = state.activeRoom?.roomCode || 'BONDFIRE';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${window.location.origin}/#room=${code}`);
          demoFeedback.innerHTML = `<span class="text-mint-green font-mono">Room link copied! Send it to your friend to join live.</span>`;
        } else {
          demoFeedback.innerHTML = `<span class="text-amber-gold font-mono">Ask your friend to enter code #${code} to join!</span>`;
        }
        return;
      }

      const isCorrect = btn.dataset.correct === 'true';
      const allBtns = demoContainer.querySelectorAll('.hero-demo-opt');
      allBtns.forEach((b) => (b.style.pointerEvents = 'none'));

      if (isCorrect) {
        audio.playCorrect();
        confettiInstance.burst(50);
        btn.classList.add('border-mint-green', 'bg-mint-green/20');
        demoFeedback.innerHTML = `<span class="text-mint-green inline-flex items-center gap-1 font-mono"><span class="material-symbols-outlined text-xs">auto_awesome</span><span>EXACT MATCH! ${chosen} sent this during the squad trip. (+140 Pod XP)</span></span>`;
      } else {
        audio.playTick();
        btn.classList.add('border-sunset-coral', 'bg-sunset-coral/20');
        const correctBtn = demoContainer.querySelector('[data-correct="true"]');
        if (correctBtn) {
          correctBtn.classList.add('border-mint-green', 'bg-mint-green/20');
        }
        demoFeedback.innerHTML = `<span class="text-amber-gold font-mono">Good guess! Voted & Archived to your 2026 Live Squad Vault.</span>`;
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

  // Preview Yearbook / Photobook CTAs
  const previewYearbookBtn = document.getElementById('btn-hero-preview-yearbook');
  const previewBookModalBtn = document.getElementById('btn-preview-book-modal');
  const keepsakeCard = document.getElementById('hero-keepsake-3d-card');
  const yearbookBadge = document.getElementById('hero-yearbook-badge');

  const goToYearbook = () => {
    audio.playClick();
    confettiInstance.burst(30);
    store.setView('YEARBOOK');
    window.location.hash = '#/YEARBOOK';
  };

  if (previewYearbookBtn) previewYearbookBtn.addEventListener('click', goToYearbook);
  if (previewBookModalBtn) previewBookModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToYearbook();
  });
  if (yearbookBadge) yearbookBadge.addEventListener('click', goToYearbook);

  if (keepsakeCard) {
    keepsakeCard.addEventListener('touchstart', () => {
      keepsakeCard.classList.add('is-active');
    }, { passive: true });

    keepsakeCard.addEventListener('touchend', () => {
      setTimeout(() => keepsakeCard.classList.remove('is-active'), 800);
    }, { passive: true });

    keepsakeCard.addEventListener('click', (e) => {
      if (e.target.closest('#btn-preview-book-modal')) return;
      try { audio.playClick(); } catch (_) {}
      keepsakeCard.classList.toggle('is-active');
    });
  }
}
