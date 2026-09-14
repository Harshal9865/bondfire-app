// ==============================================================================
// BONDFIRE ARCADE: MASTER MULTIPLAYER ENTERTAINMENT HUB
// 100% Real human party games with living room campers & zero robotic AI jargon.
// Includes Desi Arcadia Spotlight (3 Distinct Cards matching Reference Layout):
// 1. Raja Mantri Chor Sipahi (राजा मंत्री चोर सिपाही - Royal Bluff)
// 2. Desi Tambola Housie (तंबोला - 1-90 Token Caller & Live Tickets)
// 3. Bollywood Antakshari & Filmi Masala (बॉलीवुड अंताक्षरी व फिल्मी मसाला)
// Plus Campfire Living Room Classics:
// 4. Spin the Bottle (Truth or Dare)
// 5. Never Have I Ever (Survivor Finger Drop)
// 6. Most Likely To... (Secret Squad Ballot)
// 7. Watch Party Stream (Synced Video & Reactions)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { triggerGameCountdown, showGameExampleModal } from './gameCountdownOverlay.js';

export function renderArcadeScreen() {
  const state = store.getState();
  const room = state.activeRoom || {};
  const players = room.players || [];
  const playMode = state.arcadePlayMode || 'GROUP';

  // Mode-dependent player labels & badge configurations
  const modeBadges = {
    RAJA: playMode === 'SOLO' ? 'Solo Detective Run' : playMode === 'DUOS' ? '1v1 Royal Duel' : '4 Players · 1000 Pts',
    TAMBOLA: playMode === 'SOLO' ? 'Speed Caller Challenge' : playMode === 'DUOS' ? '1v1 Ticket Clash' : '1–90 Caller · Party',
    BOLLYWOOD: playMode === 'SOLO' ? '15s Blitz Run' : playMode === 'DUOS' ? '1v1 Filmi Battle' : 'Squad Relay · 15s',
    BOTTLE: playMode === 'SOLO' ? 'Daily Dare Wheel' : playMode === 'DUOS' ? '2-Player Intimate Duel' : '3–12 Players · Circle',
    NHIE: playMode === 'SOLO' ? 'Solo Guilt Meter' : playMode === 'DUOS' ? '1v1 Bestie Face-off' : 'Squad Survivor · 10F',
    MLT: playMode === 'SOLO' ? 'Roast Archive' : playMode === 'DUOS' ? '2P "Who\'s More Likely?"' : 'Squad Ballot · Votes',
    WATCH: playMode === 'SOLO' ? 'Personal Cinema' : playMode === 'DUOS' ? 'Date Lounge (2P)' : 'Squad Cinema · Synced',
  };

  const actionLabels = {
    RAJA: playMode === 'SOLO' ? 'Play Solo Detective' : playMode === 'DUOS' ? 'Play 1v1 Duel' : 'Play Royal Heist',
    TAMBOLA: playMode === 'SOLO' ? 'Start Speed Caller' : playMode === 'DUOS' ? 'Play 1v1 Clash' : 'Play Tambola',
    BOLLYWOOD: playMode === 'SOLO' ? 'Start Blitz Sprint' : playMode === 'DUOS' ? 'Play 1v1 Battle' : 'Play Filmi Masala',
    BOTTLE: playMode === 'SOLO' ? 'Spin Daily Dare' : playMode === 'DUOS' ? 'Spin 1v1 Duel' : 'Spin with Squad',
    NHIE: playMode === 'SOLO' ? 'Test Guilt Meter' : playMode === 'DUOS' ? '1v1 Finger Drop' : 'Drop a Finger',
    MLT: playMode === 'SOLO' ? 'Roast Archive' : playMode === 'DUOS' ? 'Start 2P Debate' : 'Start Voting',
    WATCH: playMode === 'SOLO' ? 'Solo Cinema' : playMode === 'DUOS' ? 'Watch 1v1 Stream' : 'Watch Together',
  };

  return `
    <div class="flex flex-col w-full max-w-[1040px] mx-auto px-4 pt-6 pb-28 relative select-none z-20">
      
      <!-- Ambient Backdrops -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-sunset-coral/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-60 right-10 w-96 h-96 bg-amber-gold/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-20 left-10 w-80 h-80 bg-duo-rose/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Header & Active Room Status -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface border border-border shadow-xl mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-mint-green animate-pulse"></span>
            <span class="retro-pixel-badge text-[9px] text-mint-green tracking-wider whitespace-nowrap">Multiplayer Arcade Arena</span>
          </div>
          <h2 class="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>The Party Hearth</span>
            <span class="material-symbols-outlined text-coral-red text-2xl">local_fire_department</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1 font-mono">
            Room: <span class="text-amber-gold font-bold">${room.podName || "Our Squad Room"}</span> (${room.roomCode}) · ${players.length} Campers Ready
          </p>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          <a href="#/ROOMS" class="px-4 py-2 rounded-xl bg-surface-bright/80 hover:bg-surface-bright text-xs font-bold text-gray-300 hover:text-white border border-border transition-all active:scale-95 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">tune</span>
            <span>Room Settings</span>
          </a>
        </div>
      </div>

      <!-- PLAY MODE SELECTOR: GROUP (SQUAD) / DUOS (1V1) / SOLO (1P) -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-surface/90 border-2 border-border shadow-xl mb-6 backdrop-blur-md">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold shrink-0">
            <span class="material-symbols-outlined text-lg">sports_esports</span>
          </div>
          <div>
            <div class="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>Arcade Play Mode:</span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${playMode === 'SOLO' ? 'bg-mint-green/20 text-mint-green border border-mint-green/30' : playMode === 'DUOS' ? 'bg-duo-rose/20 text-duo-rose border border-duo-rose/30' : 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30'}">
                ${playMode === 'SOLO' ? 'Solo (1 Player)' : playMode === 'DUOS' ? 'Duos (2-Player 1v1)' : 'Group (Squad 3+)'}
              </span>
            </div>
            <p class="text-[11px] text-gray-400 font-sans mt-0.5">
              ${playMode === 'SOLO' ? 'Solo practice run, detective challenge & personal high scores' : playMode === 'DUOS' ? 'Head-to-head 1v1 duels, couples & besties showdown' : 'Living room multiplayer party room synced across all screens'}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F131E] border border-white/10 w-full sm:w-auto justify-center shrink-0">
          <button class="btn-arcade-mode-tab flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${playMode === 'GROUP' ? 'bg-amber-gold text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}" data-mode="GROUP">
            <span class="material-symbols-outlined text-[15px]">groups</span>
            <span>Group</span>
          </button>
          <button class="btn-arcade-mode-tab flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${playMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}" data-mode="DUOS">
            <span class="material-symbols-outlined text-[15px]">people</span>
            <span>Duos</span>
          </button>
          <button class="btn-arcade-mode-tab flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${playMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}" data-mode="SOLO">
            <span class="material-symbols-outlined text-[15px]">person</span>
            <span>Solo</span>
          </button>
        </div>
      </div>

      <!-- Campers Pill Avatar Strip -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span class="retro-pixel-badge text-[9px] text-gray-400 tracking-wider shrink-0 mr-1 whitespace-nowrap">Campers:</span>
        ${players.map((p) => `
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-bright/70 border border-border shrink-0 shadow-sm">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs text-gray-300 bg-surface overflow-hidden shrink-0">
              ${p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('data:') || p.avatar.startsWith('/')) ? `<img src="${p.avatar}" class="w-full h-full object-cover rounded-full" alt="${p.name}"/>` : (p.avatar && p.avatar.match(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/u) ? p.avatar : '<span class="material-symbols-outlined text-[14px] text-sunset-coral">person</span>')}
            </span>
            <span class="text-xs font-bold text-white font-mono">${p.name}</span>
          </div>
        `).join('')}
        <a href="#/ROOMS" class="px-3 py-1.5 rounded-full bg-sunset-coral/20 hover:bg-sunset-coral/30 border border-sunset-coral/40 text-sunset-coral text-xs font-bold shrink-0 transition-all font-mono">
          + Add Friend
        </a>
      </div>

      <!-- ========================================================================= -->
      <!-- SECTION 1: DESI ARCADIA SPOTLIGHT (3 SEPARATE CARDS - REFERENCE IMAGE 2)   -->
      <!-- ========================================================================= -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-gold text-2xl">crown</span>
            <h3 class="font-display text-xl sm:text-2xl font-black text-white tracking-tight">Desi Arcadia Spotlight</h3>
            <span class="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 uppercase tracking-wider whitespace-nowrap">
              3 Indian Party Games
            </span>
          </div>
          <span class="text-xs text-gray-400 font-mono hidden sm:inline">Authentic Chits, Housie &amp; Filmi Masala</span>
        </div>

        <!-- 3 Desi Cards Grid (Identical Layout & Proportions to Image 2) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <!-- CARD 1: RAJA MANTRI CHOR SIPAHI (IMPERIAL GOLD) -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-surface to-surface border-2 border-amber-500/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-amber-400 transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <!-- Badge Row (Resized & Non-wrapping - Fixed Image 3 bug) -->
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 whitespace-nowrap shrink-0">
                  ROYAL BLUFF
                </span>
                <span class="text-xs text-amber-gold font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.RAJA}
                </span>
              </div>

              <!-- Title & Icon -->
              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-amber-gold">crown</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-gold transition-colors">Raja Mantri Chor Sipahi</h3>
              </div>

              <!-- Description -->
              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                The legendary 4-player royal chit bluffing game! Raja asks <em>"Mera Mantri Kaun?"</em> and Mantri must catch the Chor or forfeit the bounty!
              </p>
            </div>

            <!-- Action Buttons Row (Launch + Example) -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-raja" class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-gold via-[#ffc633] to-sunset-coral text-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-gold/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.RAJA}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-raja" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-amber-gold border border-amber-gold/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="RAJA_MANTRI">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

          <!-- CARD 2: DESI TAMBOLA HOUSIE (EMERALD MINT) -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-[#06D6A0]/15 via-surface to-surface border-2 border-[#06D6A0]/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-[#06D6A0] transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#06D6A0]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <!-- Badge Row (Resized & Non-wrapping - Fixed Image 3 bug) -->
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/40 whitespace-nowrap shrink-0">
                  INDIAN HOUSIE
                </span>
                <span class="text-xs text-[#06D6A0] font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.TAMBOLA}
                </span>
              </div>

              <!-- Title & Icon -->
              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-[#06D6A0]">casino</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-[#06D6A0] transition-colors">Desi Tambola Housie</h3>
              </div>

              <!-- Description -->
              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Iconic 90-coin Indian Housie! Live token caller with authentic Hindi rhymes, dynamic 3x9 tickets, and instant claims for Jaldi 5 and Full House!
              </p>
            </div>

            <!-- Action Buttons Row (Launch + Example) -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-tambola" class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#06D6A0] to-amber-gold text-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-[#06D6A0]/25 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.TAMBOLA}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-tambola" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-[#06D6A0] border border-[#06D6A0]/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="TAMBOLA">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

          <!-- CARD 3: BOLLYWOOD ANTAKSHARI & FILMI MASALA (ELECTRIC ROSE - NEW INTERESTING GAME!) -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-rose-500/15 via-surface to-surface border-2 border-rose-500/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-rose-400 transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <!-- Badge Row (Resized & Non-wrapping - Fixed Image 3 bug) -->
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/40 whitespace-nowrap shrink-0">
                  FILMI DHAMAKA
                </span>
                <span class="text-xs text-rose-400 font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.BOLLYWOOD}
                </span>
              </div>

              <!-- Title & Icon -->
              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-rose-400">movie</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-rose-400 transition-colors">Bollywood Antakshari</h3>
              </div>

              <!-- Description -->
              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Fast-paced Bollywood party showdown! Antakshari letter chains, iconic dialogue decoders, and visual scene riddles with rapid shot clocks!
              </p>
            </div>

            <!-- Action Buttons Row (Launch + Example) -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-bollywood" class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-sunset-coral to-amber-gold text-canvas font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/25 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.BOLLYWOOD}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-bollywood" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-rose-400 border border-rose-500/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="BOLLYWOOD">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- SECTION 2: LIVING ROOM & SQUAD PARTY CLASSICS (RESTORED ORIGINAL PALETTES) -->
      <!-- ========================================================================= -->
      <div>
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sunset-coral text-2xl">local_fire_department</span>
            <h3 class="font-display text-xl sm:text-2xl font-black text-white tracking-tight">Squad Party Classics</h3>
            <span class="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30 uppercase tracking-wider whitespace-nowrap">
              Synced Multiplayer
            </span>
          </div>
          <span class="text-xs text-gray-400 font-mono hidden sm:inline">Real-time synced physics &amp; votes</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <!-- GAME 4: SPIN THE BOTTLE (TRUTH OR DARE) - SUNSET CORAL -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-sunset-coral/15 via-surface to-surface border-2 border-sunset-coral/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-sunset-coral transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-sunset-coral/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40 whitespace-nowrap shrink-0">
                  CLASSIC PARTY
                </span>
                <span class="text-xs text-mint-green font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.BOTTLE}
                </span>
              </div>

              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-sunset-coral">wine_bar</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-sunset-coral transition-colors">Spin the Bottle</h3>
              </div>

              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Real inertia bottle physics. Spins and points at campers in your room with Mild, Spicy &amp; Savage Truths and Dares!
              </p>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-bottle" class="flex-1 py-3 rounded-2xl bg-sunset-coral hover:bg-[#FF7064] text-white font-bold text-xs shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.BOTTLE}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-bottle" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-sunset-coral border border-sunset-coral/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="BOTTLE">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

          <!-- GAME 5: NEVER HAVE I EVER (DROP A FINGER) - DUO ROSE -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-duo-rose/15 via-surface to-surface border-2 border-duo-rose/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-duo-rose transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-duo-rose/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-duo-rose/20 text-duo-rose border border-duo-rose/40 whitespace-nowrap shrink-0">
                  SURVIVOR
                </span>
                <span class="text-xs text-duo-rose font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.NHIE}
                </span>
              </div>

              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-duo-rose">pan_tool</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-duo-rose transition-colors">Never Have I Ever</h3>
              </div>

              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Start with 10 stamina points. Drop a point when caught guilty of awkward everyday crimes, dating habits, and hostel secrets.
              </p>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-nhie" class="flex-1 py-3 rounded-2xl bg-duo-rose hover:bg-[#E84E88] text-white font-bold text-xs shadow-lg shadow-duo-rose/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.NHIE}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-nhie" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-duo-rose border border-duo-rose/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="NHIE">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

          <!-- GAME 6: MOST LIKELY TO... (SQUAD BALLOT) - AMBER GOLD -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-amber-gold/15 via-surface to-surface border-2 border-amber-gold/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-amber-gold transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-gold/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-amber-gold/20 text-amber-gold border border-amber-gold/40 whitespace-nowrap shrink-0">
                  LIVE BALLOT
                </span>
                <span class="text-xs text-amber-gold font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.MLT}
                </span>
              </div>

              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-amber-gold">how_to_vote</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-gold transition-colors">Most Likely To</h3>
              </div>

              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Everyone in the room secretly votes on who matches the prompt. Reveal the consensus verdict with live percentage bars!
              </p>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-mlt" class="flex-1 py-3 rounded-2xl bg-amber-gold hover:bg-[#FFBF47] text-dark font-bold text-xs shadow-lg shadow-amber-gold/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.MLT}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-mlt" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-amber-gold border border-amber-gold/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="MOST_LIKELY_TO">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

          <!-- GAME 7: WATCH PARTY STREAM (INTERACTIVE STREAM) - ELECTRIC VIOLET -->
          <div class="relative p-6 rounded-3xl bg-gradient-to-br from-[#7C4DFF]/15 via-surface to-surface border-2 border-[#7C4DFF]/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-[#7C4DFF] transition-all">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#7C4DFF]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div>
              <div class="flex items-center justify-between gap-2 mb-3 w-full">
                <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-[#7C4DFF]/20 text-[#A480FF] border border-[#7C4DFF]/40 whitespace-nowrap shrink-0">
                  WATCH &amp; PLAY
                </span>
                <span class="text-xs text-[#A480FF] font-mono font-bold whitespace-nowrap shrink-0">
                  ${modeBadges.WATCH}
                </span>
              </div>

              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-3xl text-[#A480FF]">movie</span>
                <h3 class="font-display text-xl font-bold text-white group-hover:text-[#A480FF] transition-colors">Watch Party Stream</h3>
              </div>

              <p class="text-xs text-gray-300 leading-relaxed mb-4">
                Paste any video link to watch synchronized with your friends. Features live reaction tokens and synced playback.
              </p>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-2 w-full pt-1">
              <button id="arcade-launch-watch" class="flex-1 py-3 rounded-2xl bg-[#7C4DFF] hover:bg-[#8D65FF] text-white font-bold text-xs shadow-lg shadow-[#7C4DFF]/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${actionLabels.WATCH}</span>
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <button id="btn-example-watch" class="btn-game-example p-3 rounded-2xl bg-surface-bright/80 hover:bg-surface-bright text-[#A480FF] border border-[#7C4DFF]/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0" title="See How It Works (Example)" data-game="ARCADE">
                <span class="material-symbols-outlined text-lg">tips_and_updates</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}

export function bindArcadeEvents() {
  // Play Mode Switcher Tabs
  document.querySelectorAll('.btn-arcade-mode-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = tab.getAttribute('data-mode');
      if (mode && mode !== store.getState().arcadePlayMode) {
        try { audio.playClick(); } catch (_) {}
        store.setArcadePlayMode(mode);
        const mount = document.getElementById('main-content') || document.querySelector('main');
        if (mount) {
          mount.innerHTML = renderArcadeScreen();
          bindArcadeEvents();
        }
      }
    });
  });

  // How to Play (Example) Buttons
  document.querySelectorAll('.btn-game-example').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameKey = btn.getAttribute('data-game');
      if (gameKey) {
        try { audio.playClick(); } catch (_) {}
        showGameExampleModal({
          mode: gameKey,
          playMode: store.getState().arcadePlayMode,
          onLaunch: () => {
            launchArcadeGame(gameKey);
          }
        });
      }
    });
  });

  function launchArcadeGame(modeKey) {
    const titles = {
      RAJA_MANTRI: 'Raja Mantri Chor Sipahi',
      TAMBOLA: 'Desi Tambola Housie',
      BOLLYWOOD: 'Bollywood Antakshari & Masala',
      BOTTLE: 'Spin the Bottle',
      NHIE: 'Never Have I Ever',
      MOST_LIKELY_TO: 'Most Likely To',
      ARCADE: 'Watch Party & Stream'
    };

    const routes = {
      RAJA_MANTRI: 'RAJA_MANTRI',
      TAMBOLA: 'TAMBOLA',
      BOLLYWOOD: 'BOLLYWOOD',
      BOTTLE: 'BOTTLE',
      NHIE: 'NHIE',
      MOST_LIKELY_TO: 'MOST_LIKELY_TO',
      ARCADE: 'SHOWS'
    };

    triggerGameCountdown({
      mode: modeKey,
      title: titles[modeKey] || 'Arcade Game',
      onComplete: () => {
        const view = routes[modeKey] || 'ARCADE';
        store.setView(view);
        window.location.hash = `#/${view}`;
      }
    });
  }

  // Launch Raja Mantri Chor Sipahi
  const btnRaja = document.getElementById('arcade-launch-raja');
  if (btnRaja) {
    btnRaja.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('RAJA_MANTRI');
    });
  }

  // Launch Desi Tambola Housie
  const btnTambola = document.getElementById('arcade-launch-tambola');
  if (btnTambola) {
    btnTambola.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('TAMBOLA');
    });
  }

  // Launch Bollywood Antakshari & Filmi Masala
  const btnBolly = document.getElementById('arcade-launch-bollywood');
  if (btnBolly) {
    btnBolly.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('BOLLYWOOD');
    });
  }

  // Launch Watch Party
  const btnWatch = document.getElementById('arcade-launch-watch');
  if (btnWatch) {
    btnWatch.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('ARCADE');
    });
  }

  // Launch Spin the Bottle
  const btnBottle = document.getElementById('arcade-launch-bottle');
  if (btnBottle) {
    btnBottle.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('BOTTLE');
    });
  }

  // Launch Never Have I Ever
  const btnNhie = document.getElementById('arcade-launch-nhie');
  if (btnNhie) {
    btnNhie.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('NHIE');
    });
  }

  // Launch Most Likely To
  const btnMlt = document.getElementById('arcade-launch-mlt');
  if (btnMlt) {
    btnMlt.addEventListener('click', () => {
      try { audio.playClick(); } catch (_) {}
      launchArcadeGame('MOST_LIKELY_TO');
    });
  }
}

