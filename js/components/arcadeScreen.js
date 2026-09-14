// ==============================================================================
// BONDFIRE ARCADE: MASTER MULTIPLAYER ENTERTAINMENT HUB
// Fast, real human party games with living room campers & zero robotic AI jargon.
// Includes Desi Arcadia Spotlight:
// 1. Raja Mantri Chor Sipahi (राजा मंत्री चोर सिपाही - The Royal Heist)
// 2. Bollywood Antakshari & Filmi Masala
// 3. Spin the Bottle (Truth or Dare)
// 4. Never Have I Ever
// 5. Most Likely To...
// 6. Watch Party & Predict
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { triggerGameCountdown } from './gameCountdownOverlay.js';

export function renderArcadeScreen() {
  const state = store.getState();
  const room = state.activeRoom || {};
  const players = room.players || [];

  return `
    <div class="flex flex-col w-full max-w-[960px] mx-auto px-4 pt-6 pb-28 relative select-none z-20">
      
      <!-- Ambient Backdrops -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-sunset-coral/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-60 right-10 w-96 h-96 bg-amber-gold/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-20 left-10 w-80 h-80 bg-duo-rose/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Header & Active Room Status -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface border border-border shadow-xl mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-mint-green animate-pulse"></span>
            <span class="retro-pixel-badge text-[9px] text-mint-green tracking-wider">Multiplayer Arcade Arena</span>
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

      <!-- Campers Pill Avatar Strip -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span class="retro-pixel-badge text-[9px] text-gray-400 tracking-wider shrink-0 mr-1">Campers:</span>
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

      <!-- INDIAN PARTY GAMES SPOTLIGHT BANNER -->
      <div class="mb-6 p-6 rounded-3xl bg-gradient-to-r from-[#1D172A] via-[#241B38] to-[#1D172A] border-2 border-amber-gold/50 shadow-2xl relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-gold/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/20 border border-amber-gold/40 text-amber-gold text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
              <span class="material-symbols-outlined text-[15px]">crown</span>
              <span>DESI ARCADIA SPOTLIGHT // राजा मंत्री चोर सिपाही &amp; तंबोला</span>
            </div>
            <h3 class="font-display text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-2">
              <span>Raja Mantri &amp; Desi Tambola</span>
              <span class="material-symbols-outlined text-amber-gold text-2xl">casino</span>
            </h3>
            <p class="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              The legendary 4-player bluffing game with secret folded chits, plus authentic 90-coin Indian Housie with real ticket marking and instant winning claims!
            </p>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button id="arcade-launch-raja" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-gold via-[#ffc633] to-sunset-coral text-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-gold/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer">
              <span>Play Raja Mantri</span>
              <span class="material-symbols-outlined text-[18px]">crown</span>
            </button>

            <button id="arcade-launch-tambola" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#06D6A0] to-amber-gold text-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-[#06D6A0]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer">
              <span>Play Tambola</span>
              <span class="material-symbols-outlined text-[18px]">casino</span>
            </button>
          </div>
        </div>
      </div>

      <!-- GAME GRID: 6 COMPLETE MULTIPLAYER PARTY GAMES -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- GAME 1: SPIN THE BOTTLE (TRUTH OR DARE) - SUNSET CORAL -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-sunset-coral/15 via-surface to-surface border-2 border-sunset-coral/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-sunset-coral transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-sunset-coral/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/40">
                CLASSIC PARTY
              </span>
              <span class="text-xs text-mint-green font-mono font-bold">2–12 Players</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-sunset-coral">wine_bar</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-sunset-coral transition-colors">Spin the Bottle</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              Real inertia bottle physics. Spins and points at campers in your room with Mild, Spicy &amp; Savage Truths and Dares!
            </p>
          </div>

          <button id="arcade-launch-bottle" class="w-full py-3 rounded-2xl bg-sunset-coral hover:bg-[#FF7064] text-white font-bold text-xs shadow-glow-coral transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Spin with Squad</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

        <!-- GAME 2: NEVER HAVE I EVER (DROP A FINGER) - DUO ROSE -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-duo-rose/15 via-surface to-surface border-2 border-duo-rose/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-duo-rose transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-duo-rose/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-duo-rose/20 text-duo-rose border border-duo-rose/40">
                SURVIVOR SHOWDOWN
              </span>
              <span class="text-xs text-duo-rose font-mono font-bold">10 Stamina Left</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-duo-rose">pan_tool</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-duo-rose transition-colors">Never Have I Ever</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              Start with 10 stamina points. Drop a point when caught guilty of awkward everyday crimes, dating habits, and hostel secrets.
            </p>
          </div>

          <button id="arcade-launch-nhie" class="w-full py-3 rounded-2xl bg-duo-rose hover:bg-[#E84E88] text-white font-bold text-xs shadow-lg shadow-duo-rose/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Drop a Finger</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

        <!-- GAME 3: MOST LIKELY TO... (SQUAD BALLOT) - AMBER GOLD -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-amber-gold/15 via-surface to-surface border-2 border-amber-gold/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-amber-gold transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-gold/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
                LIVE BALLOT
              </span>
              <span class="text-xs text-amber-gold font-mono font-bold">Consensus Vote</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-amber-gold">how_to_vote</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-gold transition-colors">Most Likely To</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              Everyone in the room secretly votes on who matches the prompt. Reveal the consensus verdict with live percentage bars!
            </p>
          </div>

          <button id="arcade-launch-mlt" class="w-full py-3 rounded-2xl bg-amber-gold hover:bg-[#FFBF47] text-dark font-bold text-xs shadow-lg shadow-amber-gold/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Start Voting</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

        <!-- GAME 4: WATCH PARTY STREAM (INTERACTIVE STREAM) - ELECTRIC VIOLET -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-[#7C4DFF]/15 via-surface to-surface border-2 border-[#7C4DFF]/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-[#7C4DFF] transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#7C4DFF]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-[#7C4DFF]/20 text-[#A480FF] border border-[#7C4DFF]/40">
                WATCH &amp; PLAY 2.0
              </span>
              <span class="text-xs text-[#A480FF] font-mono font-bold">Synced Playback</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-[#A480FF]">movie</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-[#A480FF] transition-colors">Watch Party Stream</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              Paste any video link to watch synchronized with your friends. Features live reaction tokens and synced playback.
            </p>
          </div>

          <button id="arcade-launch-watch" class="w-full py-3 rounded-2xl bg-[#7C4DFF] hover:bg-[#8D65FF] text-white font-bold text-xs shadow-lg shadow-[#7C4DFF]/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Watch Together</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

        <!-- GAME 5: RAJA MANTRI CHOR SIPAHI - IMPERIAL GOLD -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-surface to-surface border-2 border-amber-500/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-amber-400 transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40">
                DESI BLUFFING // 4 PLAYERS
              </span>
              <span class="text-xs text-amber-gold font-mono font-bold">1000 Pts Raja</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-amber-gold">crown</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-gold transition-colors">Raja Mantri Chor Sipahi</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              The legendary royal chit bluffing game! Raja asks <em>"Mera Mantri Kaun?"</em> and Mantri must catch the Chor or lose points!
            </p>
          </div>

          <button id="arcade-launch-raja-card" class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-gold to-sunset-coral text-dark font-black text-xs shadow-lg shadow-amber-gold/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Play Royal Heist</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

        <!-- GAME 6: DESI TAMBOLA HOUSIE - EMERALD MINT -->
        <div class="relative p-6 rounded-3xl bg-gradient-to-br from-[#06D6A0]/15 via-surface to-surface border-2 border-[#06D6A0]/40 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-[#06D6A0] transition-all">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#06D6A0]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>
          
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="retro-pixel-badge px-2.5 py-0.5 rounded-full text-[9px] bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/40">
                DESI HOUSIE // तंबोला
              </span>
              <span class="text-xs text-[#06D6A0] font-mono font-bold">1–90 Caller</span>
            </div>

            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-3xl text-[#06D6A0]">casino</span>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-[#06D6A0] transition-colors">Desi Tambola Housie</h3>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed mb-4">
              Iconic Indian party game! 1–90 token caller machine, Hindi rhyming calls, dynamic 3x9 tickets, and instant claims for Jaldi 5 and Full House!
            </p>
          </div>

          <button id="arcade-launch-tambola-card" class="w-full py-3 rounded-2xl bg-gradient-to-r from-[#06D6A0] to-amber-gold text-dark font-black text-xs shadow-lg shadow-[#06D6A0]/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <span>Play Tambola</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>

      </div>

    </div>
  `;
}

export function bindArcadeEvents() {
  // Launch Raja Mantri Chor Sipahi
  const btnRaja = document.getElementById('arcade-launch-raja');
  const btnRajaCard = document.getElementById('arcade-launch-raja-card');
  const launchRaja = () => {
    audio.playClick();
    triggerGameCountdown({
      mode: 'ARCADE',
      title: 'Raja Mantri Chor Sipahi',
      onComplete: () => {
        store.setView('RAJA_MANTRI');
        window.location.hash = '#/RAJA_MANTRI';
      }
    });
  };
  if (btnRaja) btnRaja.addEventListener('click', launchRaja);
  if (btnRajaCard) btnRajaCard.addEventListener('click', launchRaja);

  // Launch Desi Tambola Housie
  const btnTambola = document.getElementById('arcade-launch-tambola');
  const btnTambolaCard = document.getElementById('arcade-launch-tambola-card');
  const launchTambola = () => {
    audio.playClick();
    triggerGameCountdown({
      mode: 'ARCADE',
      title: 'Desi Tambola Housie',
      onComplete: () => {
        store.setView('TAMBOLA');
        window.location.hash = '#/TAMBOLA';
      }
    });
  };
  if (btnTambola) btnTambola.addEventListener('click', launchTambola);
  if (btnTambolaCard) btnTambolaCard.addEventListener('click', launchTambola);

  // Launch Watch Party
  const btnWatch = document.getElementById('arcade-launch-watch');
  if (btnWatch) {
    btnWatch.addEventListener('click', () => {
      audio.playClick();
      triggerGameCountdown({
        mode: 'ARCADE',
        title: 'Watch Party & Stream',
        onComplete: () => {
          store.setView('SHOWS');
          window.location.hash = '#/SHOWS';
        }
      });
    });
  }

  // Launch Spin the Bottle
  const btnBottle = document.getElementById('arcade-launch-bottle');
  if (btnBottle) {
    btnBottle.addEventListener('click', () => {
      audio.playClick();
      triggerGameCountdown({
        mode: 'ARCADE',
        title: 'Spin the Bottle',
        onComplete: () => {
          store.setView('BOTTLE');
          window.location.hash = '#/BOTTLE';
        }
      });
    });
  }

  // Launch Never Have I Ever
  const btnNhie = document.getElementById('arcade-launch-nhie');
  if (btnNhie) {
    btnNhie.addEventListener('click', () => {
      audio.playClick();
      triggerGameCountdown({
        mode: 'ARCADE',
        title: 'Never Have I Ever',
        onComplete: () => {
          store.setView('NHIE');
          window.location.hash = '#/NHIE';
        }
      });
    });
  }

  // Launch Most Likely To
  const btnMlt = document.getElementById('arcade-launch-mlt');
  if (btnMlt) {
    btnMlt.addEventListener('click', () => {
      audio.playClick();
      triggerGameCountdown({
        mode: 'ARCADE',
        title: 'Most Likely To',
        onComplete: () => {
          store.setView('MOST_LIKELY_TO');
          window.location.hash = '#/MOST_LIKELY_TO';
        }
      });
    });
  }
}
