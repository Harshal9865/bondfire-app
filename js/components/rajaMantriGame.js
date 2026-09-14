// ==============================================================================
// RAJA MANTRI CHOR SIPAHI (राजा मंत्री चोर सिपाही - The Royal Heist)
// The iconic, loved 4-player Indian childhood bluffing & deduction chit game.
// Roles: Raja (1000), Mantri (800), Chor (0), Sipahi (500)
// Features: Secret digital chits, royal fanfare, Mantri accusation, score stealing,
// and round leaderboards with full audio synthesis & confetti celebrations!
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

const ROLES = {
  RAJA: { name: 'Raja', hindi: 'राजा', points: 1000, icon: 'crown', color: 'text-amber-gold border-amber-gold/50 bg-amber-gold/15', textColor: 'text-amber-gold' },
  MANTRI: { name: 'Mantri', hindi: 'मंत्री', points: 800, icon: 'history_edu', color: 'text-sky-400 border-sky-400/50 bg-sky-400/15', textColor: 'text-sky-400' },
  SIPAHI: { name: 'Sipahi', hindi: 'सिपाही', points: 500, icon: 'shield', color: 'text-mint-green border-mint-green/50 bg-mint-green/15', textColor: 'text-mint-green' },
  CHOR: { name: 'Chor', hindi: 'चोर', points: 0, icon: 'mask', color: 'text-rose-500 border-rose-500/50 bg-rose-500/15', textColor: 'text-rose-500' }
};

let gameState = {
  playMode: 'GROUP', // 'GROUP' | 'DUOS' | 'SOLO'
  round: 1,
  totalRounds: 5,
  phase: 'SHUFFLE', // 'SHUFFLE' | 'PEEK' | 'RAJA_PROCLAIM' | 'ACCUSATION' | 'VERDICT'
  userChitPeeked: false,
  players: [],
  rajaPlayer: null,
  mantriPlayer: null,
  suspects: [], // The 2 remaining players (Chor & Sipahi)
  accusedPlayer: null,
  isGuessCorrect: false,
  scores: {}
};

function initNewRound(resetScores = false) {
  const state = store.getState();
  const playMode = gameState.playMode || state.arcadePlayMode || 'GROUP';
  gameState.playMode = playMode;

  const hostName = state.currentUser?.displayName ? state.currentUser.displayName.split(' ')[0] : 'You';
  const realPlayers = (state.activeRoom?.players || []).map(p => p.name).filter(Boolean);

  let playerNames = [];
  if (playMode === 'SOLO') {
    playerNames = [
      hostName,
      'Courtier Aarav (AI)',
      'Courtier Priya (AI)',
      'Courtier Kabir (AI)'
    ];
  } else if (playMode === 'DUOS') {
    const partnerName = (realPlayers.length > 0 && realPlayers[0] !== hostName)
      ? realPlayers[0]
      : (realPlayers.length > 1 && realPlayers[1] !== hostName ? realPlayers[1] : 'Partner (Player 2)');
    playerNames = [
      hostName,
      partnerName,
      'Courtier Priya (AI)',
      'Courtier Kabir (AI)'
    ];
  } else {
    playerNames = [
      hostName,
      realPlayers[0] && realPlayers[0] !== hostName ? realPlayers[0] : 'Aarav',
      realPlayers[1] && realPlayers[1] !== hostName ? realPlayers[1] : 'Priya',
      realPlayers[2] && realPlayers[2] !== hostName ? realPlayers[2] : 'Kabir'
    ];
  }

  if (resetScores || Object.keys(gameState.scores).length === 0) {
    gameState.scores = {};
    playerNames.forEach(name => {
      gameState.scores[name] = 0;
    });
    gameState.round = 1;
  }

  // Shuffle roles randomly among 4 players
  const roleKeys = ['RAJA', 'MANTRI', 'CHOR', 'SIPAHI'];
  for (let i = roleKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roleKeys[i], roleKeys[j]] = [roleKeys[j], roleKeys[i]];
  }

  gameState.players = playerNames.map((name, idx) => ({
    name,
    roleKey: roleKeys[idx],
    role: ROLES[roleKeys[idx]],
    isUser: idx === 0,
    isPartner: playMode === 'DUOS' && idx === 1,
    isAI: (playMode === 'SOLO' && idx > 0) || (playMode === 'DUOS' && idx > 1),
    chitRevealed: false
  }));

  gameState.rajaPlayer = gameState.players.find(p => p.roleKey === 'RAJA');
  gameState.mantriPlayer = gameState.players.find(p => p.roleKey === 'MANTRI');
  gameState.suspects = gameState.players.filter(p => p.roleKey === 'CHOR' || p.roleKey === 'SIPAHI');
  gameState.phase = 'SHUFFLE';
  gameState.userChitPeeked = false;
  gameState.accusedPlayer = null;
  gameState.isGuessCorrect = false;
}

export function renderRajaMantriGame() {
  const storeMode = store.getState().arcadePlayMode || 'GROUP';
  if (gameState.players.length === 0 || gameState.playMode !== storeMode) {
    gameState.playMode = storeMode;
    initNewRound(true);
  }

  const user = gameState.players[0];
  const raja = gameState.rajaPlayer;
  const mantri = gameState.mantriPlayer;
  const currentPlayMode = gameState.playMode || 'GROUP';

  return `
    <div class="min-h-screen bg-[#090C15] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[1280px] mx-auto select-none" id="raja-mantri-root">
      
      <!-- Top Royal Bar -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#262B40]/70 flex-wrap gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold uppercase mb-2">
            <span class="material-symbols-outlined text-[16px] text-amber-gold">crown</span>
            <span>INDIAN ARCADE SPOTLIGHT // राजा मंत्री चोर सिपाही</span>
          </div>
          <h1 class="font-display text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Raja Mantri Chor Sipahi</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30 font-mono">
              Round ${gameState.round} of ${gameState.totalRounds}
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-raja-reset" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-400 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>New Game</span>
          </button>

          <a href="#/ARCADE" class="px-3.5 py-2 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Arcade Hub</span>
          </a>
        </div>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-gold text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Royal Court Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-raja-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-amber-gold text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (4 Campers)
          </button>
          <button class="btn-raja-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (1v1 Heist)
          </button>
          <button class="btn-raja-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo Detective
          </button>
        </div>
      </div>

      <!-- Mode Banner -->
      <div class="w-full mb-6 px-4 py-2 rounded-xl text-center text-xs font-mono ${currentPlayMode === 'DUOS' ? 'bg-duo-rose/10 text-duo-rose border border-duo-rose/30' : currentPlayMode === 'SOLO' ? 'bg-mint-green/10 text-mint-green border border-mint-green/30' : 'bg-surface border border-white/5 text-gray-400'}">
        ${currentPlayMode === 'DUOS' ? '👫 1v1 Royal Duel: Head-to-head showdown between Human 1 (Mantri) and Human 2 (Chor) with 2 AI courtiers!' : currentPlayMode === 'SOLO' ? '👤 Solo Detective Run: Read AI behavioral tells to unmask the hidden Chor and secure the bounty!' : '👥 Royal Living Room Court: 4 players taking turns guessing chits in real time.'}
      </div>

      <!-- MAIN ROYAL HEIST STAGE -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: The Royal Court & Chits -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Dramatic Proclamation Banner -->
          <div class="p-6 rounded-3xl bg-gradient-to-r from-[#181C2B] via-[#1A2035] to-[#181C2B] border border-amber-gold/30 shadow-2xl relative overflow-hidden text-center">
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="text-[11px] font-mono tracking-widest text-amber-gold uppercase font-bold mb-2">
              ROYAL COURT PROCEEDINGS // ${gameState.phase}
            </div>

            ${gameState.phase === 'SHUFFLE' ? `
              <h2 class="font-display text-xl sm:text-2xl font-black text-white mb-2">
                4 Chits Have Been Folded &amp; Shuffled!
              </h2>
              <p class="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto mb-4">
                Tap your folded chit below to secretly peek your royal destiny before the court convenes.
              </p>
              <button id="btn-start-peeking" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral text-dark font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Peek Your Chit
              </button>
            ` : ''}

            ${gameState.phase === 'PEEK' ? `
              <h2 class="font-display text-xl sm:text-2xl font-black text-white mb-2">
                Your Secret Role: <span class="text-amber-gold">${user.role.hindi} (${user.role.name})</span>
              </h2>
              <p class="text-xs text-gray-300 font-sans max-w-md mx-auto mb-4">
                Keep your poker face! The Raja is about to summon the Royal Minister.
              </p>
              <button id="btn-proclaim-raja" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral text-dark font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Summon The Court (Suno Suno!)
              </button>
            ` : ''}

            ${gameState.phase === 'RAJA_PROCLAIM' ? `
              <div class="animate-bounce mb-2 flex justify-center"><span class="material-symbols-outlined text-4xl text-amber-gold">crown</span></div>
              <h2 class="font-display text-xl sm:text-3xl font-black text-amber-gold mb-2">
                "${raja.name}: Mera Mantri Kaun?!"
              </h2>
              <p class="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto mb-4">
                The King commands his minister to step forward and identify the thief!
              </p>
              <button id="btn-mantri-step" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-amber-gold text-dark font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Mantri Steps Forward ("Huzoor, Main!")
              </button>
            ` : ''}

            ${gameState.phase === 'ACCUSATION' ? `
              <h2 class="font-display text-xl sm:text-2xl font-black text-sky-400 mb-2">
                ${mantri.isUser ? 'YOU ARE THE MANTRI! CATCH THE CHOR!' : `${mantri.name} is the Mantri! Deciding who is the Chor...`}
              </h2>
              <p class="text-xs sm:text-sm text-gray-300 font-sans max-w-lg mx-auto mb-4">
                Between ${gameState.suspects[0].name} and ${gameState.suspects[1].name}, one is the innocent Sipahi (500 pts) and one is the cunning Chor (0 pts). Guess wrong, and the Chor steals your 800 points!
              </p>
              ${mantri.isUser ? `
                <div class="flex items-center justify-center gap-4 mt-2">
                  <button class="btn-accuse-suspect px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 border border-rose-500 text-white font-bold text-xs transition-all cursor-pointer" data-name="${gameState.suspects[0].name}">
                    Accuse ${gameState.suspects[0].name}
                  </button>
                  <button class="btn-accuse-suspect px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 border border-rose-500 text-white font-bold text-xs transition-all cursor-pointer" data-name="${gameState.suspects[1].name}">
                    Accuse ${gameState.suspects[1].name}
                  </button>
                </div>
              ` : `
                <button id="btn-ai-accuse" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  See ${mantri.name}'s Accusation
                </button>
              `}
            ` : ''}

            ${gameState.phase === 'VERDICT' ? `
              <h2 class="font-display text-2xl sm:text-3xl font-black ${gameState.isGuessCorrect ? 'text-mint-green' : 'text-rose-500'} mb-2 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-2xl">${gameState.isGuessCorrect ? 'celebration' : 'gpp_bad'}</span>
                <span>${gameState.isGuessCorrect ? 'CHOR PAKDA GAYA! (Thief Caught!)' : 'DHOKHA! SIPAHI WAS WRONGLY ACCUSED!'}</span>
              </h2>
              <p class="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto mb-4">
                ${gameState.isGuessCorrect ? 
                  `Mantri ${mantri.name} correctly identified the Chor! Mantri scores 800 pts, Sipahi gets 500 pts!` : 
                  `The Chor fooled the court! The Chor steals the Mantri's 800 points and Mantri gets 0 pts!`}
              </p>
              <button id="btn-next-round" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-gold to-sunset-coral text-dark font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto">
                <span>${gameState.round >= gameState.totalRounds ? 'Finish & Crown Maharaja' : 'Next Round'}</span>
                <span class="material-symbols-outlined text-[16px]">${gameState.round >= gameState.totalRounds ? 'crown' : 'arrow_forward'}</span>
              </button>
            ` : ''}

          </div>

          <!-- THE 4 DIGITAL FOLDED CHITS TABLE -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            ${gameState.players.map((p) => {
              const isChitRevealed = p.chitRevealed || (gameState.phase === 'PEEK' && p.isUser) || gameState.phase === 'VERDICT';
              const roleInfo = p.role;

              return `
                <div class="rounded-2xl p-5 border flex flex-col items-center justify-between text-center transition-all min-h-[220px] relative ${isChitRevealed ? roleInfo.color : 'bg-[#121522] border-[#2B3147] hover:border-amber-gold/40'} shadow-lg group">
                  
                  <div class="w-full flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span class="font-bold text-white">${p.name}</span>
                    ${p.isUser ? '<span class="text-amber-gold font-bold">YOU</span>' : ''}
                  </div>

                  <!-- Chit Graphic -->
                  <div class="my-3">
                    ${isChitRevealed ? `
                      <div class="mb-2 animate-bounce flex justify-center">
                        <span class="material-symbols-outlined text-5xl ${roleInfo.textColor}">${roleInfo.icon}</span>
                      </div>
                      <div class="font-display font-black text-base text-white">${roleInfo.hindi}</div>
                      <div class="text-xs font-mono font-bold opacity-80 uppercase">${roleInfo.name}</div>
                      <div class="mt-1 text-xs font-mono font-black text-amber-gold">+${roleInfo.points} Pts</div>
                    ` : `
                      <div class="w-16 h-20 rounded-xl bg-gradient-to-b from-[#22273d] to-[#151928] border-2 border-dashed border-amber-gold/40 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined text-amber-gold text-2xl">lock</span>
                        <span class="text-[9px] font-mono text-gray-400 mt-1 uppercase">Folded</span>
                      </div>
                      <div class="text-[11px] font-mono text-gray-400 mt-2">Secret Chit</div>
                    `}
                  </div>

                  <!-- Suspect Banter Quote -->
                  <div class="text-[10px] font-mono text-gray-400 italic">
                    ${p.isUser && !isChitRevealed ? 'Tap to peek role' : isChitRevealed ? 'Chit Revealed' : 'Maintaining Poker Face'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>

        <!-- Right Col: Cumulative Royal Scoreboard -->
        <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div class="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
              <span class="material-symbols-outlined text-amber-gold text-xl">leaderboard</span>
              <h3 class="font-display text-lg font-bold text-white">Royal Court Leaderboard</h3>
            </div>

            <div class="space-y-3">
              ${Object.entries(gameState.scores)
                .sort(([, a], [, b]) => b - a)
                .map(([name, score], idx) => `
                  <div class="p-3.5 rounded-2xl bg-[#181C2B] border ${idx === 0 ? 'border-amber-gold/50 shadow-[0_0_15px_rgba(255,183,3,0.15)]' : 'border-white/5'} flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-gold text-dark' : 'bg-white/10 text-gray-400'} flex items-center justify-center font-bold text-xs font-mono">
                        ${idx + 1}
                      </span>
                      <div>
                        <div class="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>${name}</span>
                          ${idx === 0 ? '<span class="material-symbols-outlined text-[15px] text-amber-gold">crown</span>' : ''}
                        </div>
                        <span class="text-[9.5px] font-mono text-gray-400">
                          ${idx === 0 ? 'Maharaja Candidate' : 'Royal Courtier'}
                        </span>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-base font-display font-black text-amber-gold">${score}</div>
                      <span class="text-[9px] font-mono text-gray-500">POINTS</span>
                    </div>
                  </div>
                `).join('')}
            </div>

            <!-- Rules Summary -->
            <div class="mt-8 p-4 rounded-2xl bg-[#0E111D] border border-white/5 text-[11px] font-mono text-gray-400 space-y-2">
              <div class="text-amber-gold font-bold uppercase mb-1">Traditional Points Guide:</div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[15px] text-amber-gold">crown</span>
                <span>Raja: 1000 Points (Always secure)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[15px] text-sky-400">history_edu</span>
                <span>Mantri: 800 Points (If correct)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[15px] text-mint-green">shield</span>
                <span>Sipahi: 500 Points (Always innocent)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[15px] text-rose-500">mask</span>
                <span>Chor: 0 Points (Or steals Mantri's 800 pts!)</span>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-6 border-t border-white/10 text-center text-[10px] font-mono text-gray-500">
            DESI ARCADIA // AUTHENTIC INDIAN BLUFFING
          </div>
        </div>

      </div>

    </div>
  `;
}

export function bindRajaMantriEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // In-Game Mode Switcher
  document.querySelectorAll('.btn-raja-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== gameState.playMode) {
        audio.playClick();
        gameState.playMode = mode;
        store.setArcadePlayMode(mode);
        initNewRound(true);
        reRender();
      }
    });
  });

  // Reset Game
  const resetBtn = document.getElementById('btn-raja-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      audio.playClick();
      initNewRound(true);
      reRender();
    });
  }

  // Start Peeking
  const peekBtn = document.getElementById('btn-start-peeking');
  if (peekBtn) {
    peekBtn.addEventListener('click', () => {
      audio.playClick();
      gameState.phase = 'PEEK';
      gameState.userChitPeeked = true;
      reRender();
    });
  }

  // Proclaim Raja (Suno Suno!)
  const proclaimBtn = document.getElementById('btn-proclaim-raja');
  if (proclaimBtn) {
    proclaimBtn.addEventListener('click', () => {
      audio.playRoyalFanfare();
      gameState.phase = 'RAJA_PROCLAIM';
      gameState.rajaPlayer.chitRevealed = true;
      reRender();
    });
  }

  // Mantri Step Forward
  const mantriStepBtn = document.getElementById('btn-mantri-step');
  if (mantriStepBtn) {
    mantriStepBtn.addEventListener('click', () => {
      audio.playClick();
      gameState.phase = 'ACCUSATION';
      gameState.mantriPlayer.chitRevealed = true;
      reRender();
    });
  }

  // User Accuses Suspect
  const accuseBtns = document.querySelectorAll('.btn-accuse-suspect');
  accuseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const accusedName = btn.dataset.name;
      resolveAccusation(accusedName);
    });
  });

  // AI Mantri Accuses
  const aiAccuseBtn = document.getElementById('btn-ai-accuse');
  if (aiAccuseBtn) {
    aiAccuseBtn.addEventListener('click', () => {
      const suspects = gameState.suspects;
      const randomSuspect = suspects[Math.floor(Math.random() * suspects.length)];
      resolveAccusation(randomSuspect.name);
    });
  }

  function resolveAccusation(accusedName) {
    gameState.accusedPlayer = gameState.players.find(p => p.name === accusedName);
    gameState.isGuessCorrect = gameState.accusedPlayer.roleKey === 'CHOR';
    gameState.phase = 'VERDICT';

    // Reveal all chits
    gameState.players.forEach(p => { p.chitRevealed = true; });

    // Calculate Round Scores
    const raja = gameState.rajaPlayer;
    const mantri = gameState.mantriPlayer;
    const chor = gameState.players.find(p => p.roleKey === 'CHOR');
    const sipahi = gameState.players.find(p => p.roleKey === 'SIPAHI');

    gameState.scores[raja.name] = (gameState.scores[raja.name] || 0) + 1000;
    gameState.scores[sipahi.name] = (gameState.scores[sipahi.name] || 0) + 500;

    if (gameState.isGuessCorrect) {
      // Mantri caught Chor!
      gameState.scores[mantri.name] = (gameState.scores[mantri.name] || 0) + 800;
      gameState.scores[chor.name] = (gameState.scores[chor.name] || 0) + 0;
      audio.playRoyalFanfare();
      confettiInstance.burst(60, 1);
    } else {
      // Chor stole Mantri's score!
      gameState.scores[chor.name] = (gameState.scores[chor.name] || 0) + 800;
      gameState.scores[mantri.name] = (gameState.scores[mantri.name] || 0) + 0;
      audio.playChime();
    }

    reRender();
  }

  // Next Round
  const nextRoundBtn = document.getElementById('btn-next-round');
  if (nextRoundBtn) {
    nextRoundBtn.addEventListener('click', () => {
      audio.playClick();
      if (gameState.round >= gameState.totalRounds) {
        alert('Crown Ceremony: Game complete! Check the final Maharaja on the leaderboard.');
        initNewRound(true);
      } else {
        gameState.round++;
        initNewRound(false);
      }
      reRender();
    });
  }

  function reRender() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'RAJA_MANTRI') {
      mount.innerHTML = renderRajaMantriGame();
      bindRajaMantriEvents();
    }
  }
}
