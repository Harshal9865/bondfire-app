// ==============================================================================
// BONDFIRE ARCADE: MOST LIKELY TO (MULTIPLAYER LIVE VOTING SHOWDOWN)
// Real human roasts, live squad voting, animated percentage bars & custom ballot creator
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { MOST_LIKELY_TO_DECK } from '../data/indianCultureDecks.js';

let currentPromptIndex = 0;
let customBallots = [];
let votes = {}; // { playerId: number }
let hasVoted = false;
let revealed = false;
let mltTimerInterval = null;

function getAllPrompts() {
  return [...MOST_LIKELY_TO_DECK, ...customBallots];
}

let duosVotes = { p1: null, p2: null };
let soloArchetypes = { guilty: 0, notMe: 0 };

function initVotes() {
  const currentPlayMode = store.getState().arcadePlayMode || 'GROUP';
  const room = store.getState().activeRoom;
  const currentUser = store.getState().currentUser || {};
  const currentUserId = currentUser.id || 'p1';

  votes = {};
  if (currentPlayMode === 'DUOS') {
    votes[currentUserId] = 0;
    votes['partner'] = 0;
    duosVotes = { p1: null, p2: null };
  } else if (currentPlayMode === 'SOLO') {
    // Solo uses soloArchetypes
  } else {
    // GROUP
    const players = (room && room.players && room.players.length >= 3)
      ? room.players
      : [
          { id: currentUserId, name: currentUser.displayName ? `${currentUser.displayName.split(' ')[0]} (You)` : 'You (Host)' },
          { id: 'p2', name: 'Kabir' },
          { id: 'p3', name: 'Riya' },
          { id: 'p4', name: 'Ananya' }
        ];
    players.forEach((p) => {
      votes[p.id] = 0;
    });
  }

  hasVoted = false;
  revealed = false;
}

export function renderMostLikelyToGame() {
  const currentPlayMode = store.getState().arcadePlayMode || 'GROUP';
  const prompts = getAllPrompts();
  if (currentPromptIndex >= prompts.length) currentPromptIndex = 0;
  const currentPrompt = prompts[currentPromptIndex] || prompts[0];

  const state = store.getState();
  const room = state.activeRoom || {};
  const currentUser = state.currentUser || {};
  const currentUserId = currentUser.id || 'p1';
  const currentUserName = currentUser.displayName ? `${currentUser.displayName.split(' ')[0]} (You)` : 'You (Host)';

  let players = [];
  if (currentPlayMode === 'DUOS') {
    players = [
      { id: currentUserId, name: currentUserName, avatar: currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host' },
      { id: 'partner', name: 'Partner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Partner' }
    ];
  } else if (currentPlayMode === 'SOLO') {
    players = [
      { id: currentUserId, name: currentUserName, avatar: currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host' }
    ];
  } else {
    players = (room.players && room.players.length >= 3)
      ? room.players
      : [
          { id: currentUserId, name: currentUserName, avatar: currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host' },
          { id: 'p2', name: 'Kabir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir' },
          { id: 'p3', name: 'Riya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya' },
          { id: 'p4', name: 'Ananya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya' }
        ];
  }

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  // Find current leader(s)
  let maxVotes = 0;
  let leaderId = null;
  Object.entries(votes).forEach(([pid, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      leaderId = pid;
    }
  });

  return `
    <div class="flex flex-col w-full max-w-[760px] mx-auto px-4 pt-6 pb-28 relative select-none z-20">
      
      <!-- Ambient Lights -->
      <div class="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-gold/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-80 left-10 w-80 h-80 bg-sunset-coral/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Header & Back -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-xl mb-4">
        <button id="btn-mlt-back-arcade" class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-bright/70 hover:bg-surface-bright text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Arcade</span>
        </button>

        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-gold animate-pulse"></span>
          <span class="text-[11px] font-mono font-bold text-amber-gold uppercase tracking-wider">Most Likely To · Live Ballot</span>
        </div>

        <button id="btn-mlt-custom-prompt" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-gold/20 hover:bg-amber-gold/30 border border-amber-gold/40 text-amber-gold text-xs font-bold transition-all active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined text-[15px]">how_to_vote</span>
          <span class="hidden sm:inline">+ Custom Ballot</span>
          <span class="sm:hidden">+ Ballot</span>
        </button>
      </div>

      <!-- In-Game Play Mode Switcher -->
      <div class="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#121626] border border-[#262B40] mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-gold text-base">tune</span>
          <span class="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Ballot Mode:</span>
        </div>
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0E17] border border-white/5">
          <button class="btn-mlt-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'GROUP' ? 'bg-amber-gold text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="GROUP">
            Group (Squad Vote)
          </button>
          <button class="btn-mlt-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'DUOS' ? 'bg-duo-rose text-white font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="DUOS">
            Duos (Who's More Likely?)
          </button>
          <button class="btn-mlt-mode px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPlayMode === 'SOLO' ? 'bg-mint-green text-dark font-black shadow-sm' : 'text-gray-400 hover:text-white'}" data-mode="SOLO">
            Solo (Roast Archive)
          </button>
        </div>
      </div>

      <!-- PROMPT CARD -->
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#241F1A] to-surface border-2 border-amber-gold/40 shadow-2xl mb-6 text-center relative overflow-hidden">
        <div class="flex items-center justify-center gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
            ${currentPrompt.tone || 'SQUAD VOTE'}
          </span>
          <span class="text-xs text-gray-400 font-mono">Card ${currentPromptIndex + 1} of ${prompts.length}</span>
        </div>

        <h3 class="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed max-w-xl mx-auto my-2">
          "${currentPrompt.question || currentPrompt.prompt || currentPrompt.text}"
        </h3>

        <p class="text-xs text-gray-400 mt-2 mb-3">
          ${currentPlayMode === 'DUOS' ? "Who fits this more: You or your Partner? Tap to cast your duel vote!" : currentPlayMode === 'SOLO' ? "Be honest: Does this describe you or would you never do this?" : "Tap on the camper in your room who fits this the most!"}
        </p>

        <!-- In-Game 20-Second Ballot Shot Clock -->
        <div class="max-w-md mx-auto mb-4 p-2.5 rounded-2xl bg-[#0F131E]/80 border border-white/10 flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-amber-gold animate-pulse">timer</span>
              <span class="text-xs font-mono font-bold text-gray-300">Ballot Shot Clock:</span>
              <span id="mlt-shot-clock-text" class="text-xs font-mono font-black text-amber-gold bg-amber-gold/15 px-2 py-0.5 rounded-full border border-amber-gold/30">${revealed ? 'VERDICT' : '20s'}</span>
            </div>
            <span id="mlt-timer-status" class="text-[10.5px] font-mono text-gray-400">${revealed ? 'Verdict unlocked!' : 'Vote before clock expires'}</span>
          </div>
          <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div id="mlt-timer-bar" class="h-full bg-gradient-to-r from-amber-gold to-sunset-coral rounded-full transition-all duration-1000 ease-linear" style="width: ${revealed ? '0%' : '100%'};"></div>
          </div>
        </div>

        <!-- Vote Control Buttons -->
        <div class="flex items-center justify-center gap-3">
          ${currentPlayMode !== 'SOLO' ? `
            <button id="btn-mlt-reveal" class="px-5 py-2.5 rounded-full ${revealed ? 'bg-mint-green/20 text-mint-green border border-mint-green/40' : 'bg-amber-gold hover:bg-[#FFBF47] text-dark'} font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">${revealed ? 'verified' : 'visibility'}</span>
              <span>${revealed ? 'Results Revealed' : 'Reveal Verdict'}</span>
            </button>
          ` : ''}

          <button id="btn-mlt-next" class="px-4 py-2.5 rounded-full bg-surface-bright hover:bg-surface-bright/80 text-gray-300 hover:text-white border border-border text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <span>Next Ballot</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- LIVE CANDIDATE GRID (ROOM CAMPERS) OR SOLO CHOICES -->
      ${currentPlayMode === 'SOLO' ? `
        <div class="p-6 rounded-2xl bg-surface border border-border shadow-xl text-center">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
            <span class="text-xs font-mono text-gray-400 uppercase font-bold">Your Honest Self-Verdict</span>
            <span class="text-xs font-mono text-mint-green font-bold">Campfire Archetype Log</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <button id="btn-solo-guilty" class="p-5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-500/40 text-rose-300 font-bold flex flex-col items-center gap-2 active:scale-95 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-3xl text-rose-400">psychology_alt</span>
              <span class="text-sm font-display">Guilty as Charged!</span>
              <span class="text-[11px] font-mono text-rose-200/80">"Yup, that's totally me"</span>
            </button>

            <button id="btn-solo-notme" class="p-5 rounded-2xl bg-mint-green/15 hover:bg-mint-green/25 border-2 border-mint-green/40 text-mint-green font-bold flex flex-col items-center gap-2 active:scale-95 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-3xl text-mint-green">verified_user</span>
              <span class="text-sm font-display">Never In My Life!</span>
              <span class="text-[11px] font-mono text-mint-green/80">"Not even close"</span>
            </button>
          </div>

          <div class="flex items-center justify-around p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
            <span class="text-rose-400">Wild Tendencies: <strong>${soloArchetypes.guilty}</strong></span>
            <span class="text-gray-500">|</span>
            <span class="text-mint-green">Innocent Habits: <strong>${soloArchetypes.notMe}</strong></span>
          </div>
        </div>
      ` : `
        <div class="p-5 rounded-2xl bg-surface border border-border shadow-xl">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
            <h4 class="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-[18px]">how_to_vote</span>
              <span>${currentPlayMode === 'DUOS' ? 'Duos Face-off Ballot' : `Vote for Camper (${totalVotes} votes cast)`}</span>
            </h4>
            <span class="text-[11px] font-mono text-gray-400">1 Tap = 1 Vote</span>
          </div>

          <div class="grid grid-cols-1 ${currentPlayMode === 'DUOS' ? 'grid-cols-2' : 'sm:grid-cols-2'} gap-3" id="mlt-players-grid">
            ${players.map((p) => {
              const count = votes[p.id] || 0;
              const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isLeader = revealed && totalVotes > 0 && p.id === leaderId;

              return `
                <div class="mlt-vote-card relative p-3.5 rounded-2xl ${isLeader ? 'bg-amber-gold/15 border-2 border-amber-gold shadow-lg shadow-amber-gold/10' : 'bg-surface-bright/60 hover:bg-surface-bright border border-border'} cursor-pointer transition-all active:scale-98 overflow-hidden group" data-player-id="${p.id}">
                  
                  <!-- Live Progress Bar Background -->
                  <div class="absolute left-0 top-0 bottom-0 bg-amber-gold/15 transition-all duration-500 pointer-events-none" style="width: ${revealed ? percentage : 0}%"></div>

                  <div class="relative z-10 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-full bg-surface border ${isLeader ? 'border-amber-gold' : 'border-border'} flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="${p.avatar}" class="w-full h-full object-cover rounded-full" alt="${p.name}"/>
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <span class="text-sm font-bold text-white group-hover:text-amber-gold transition-colors">${p.name}</span>
                          ${isLeader ? '<span class="material-symbols-outlined text-amber-gold text-base" title="Consensus Winner">hotel_class</span>' : ''}
                        </div>
                        <span class="text-[11px] text-gray-400">${revealed ? `${percentage}% consensus` : 'Tap to cast vote'}</span>
                      </div>
                    </div>

                    <div class="flex flex-col items-end">
                      <span class="font-mono text-lg font-black ${isLeader ? 'text-amber-gold' : 'text-white'}">
                        ${revealed ? `${count}` : '<span class="material-symbols-outlined text-sm text-gray-400">how_to_vote</span>'}
                      </span>
                      <span class="text-[10px] text-gray-400 font-mono">${revealed ? 'votes' : 'vote'}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `}

      <!-- CUSTOM BALLOT MODAL -->
      <div id="mlt-custom-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl relative">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl text-coral-red">how_to_vote</span>
              <h3 class="font-display text-lg font-bold text-white">Create Custom Ballot</h3>
            </div>
            <button id="btn-close-mlt-modal" class="text-gray-400 hover:text-white p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <p class="text-xs text-gray-300 mb-3">Add a prompt to vote on tonight with your room:</p>

          <textarea id="mlt-custom-input" rows="3" placeholder="e.g. Most likely to disappear for 3 months and reappear with a completely new personality..." class="w-full p-3 rounded-xl bg-surface-bright border border-border text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-gold mb-4 resize-none"></textarea>

          <button id="btn-save-mlt-custom" class="w-full py-3 rounded-xl bg-amber-gold hover:bg-[#FFBF47] text-dark font-bold text-xs shadow-lg shadow-amber-gold/20 transition-all active:scale-95">
            Start Live Vote on This
          </button>
        </div>
      </div>

    </div>
  `;
}

export function bindMostLikelyToEvents() {
  if (mltTimerInterval) {
    clearInterval(mltTimerInterval);
    mltTimerInterval = null;
  }

  // Active 20-Second Ballot Shot Clock (Auto-reveals verdict on expiry)
  if (!revealed) {
    let mltSecondsLeft = 20;
    const timerText = document.getElementById('mlt-shot-clock-text');
    const timerBar = document.getElementById('mlt-timer-bar');
    const timerStatus = document.getElementById('mlt-timer-status');

    mltTimerInterval = setInterval(() => {
      mltSecondsLeft--;
      if (mltSecondsLeft < 0) mltSecondsLeft = 0;

      if (timerText) timerText.textContent = `${mltSecondsLeft}s`;
      if (timerBar) {
        const pct = Math.max(0, (mltSecondsLeft / 20) * 100);
        timerBar.style.width = `${pct}%`;
        if (mltSecondsLeft <= 5) {
          timerBar.className = 'h-full bg-red-500 rounded-full transition-all duration-1000 ease-linear animate-pulse';
        }
      }

      if (mltSecondsLeft <= 5 && mltSecondsLeft > 0) {
        audio.playTick();
        if (timerText) timerText.className = 'text-xs font-mono font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/40 animate-bounce';
      }

      if (mltSecondsLeft <= 0) {
        clearInterval(mltTimerInterval);
        mltTimerInterval = null;
        audio.playFanfare();
        revealed = true;
        reRender();
      }
    }, 1000);
  }

  // In-Game Play Mode Switcher
  document.querySelectorAll('.btn-mlt-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      if (mode && mode !== store.getState().arcadePlayMode) {
        if (mltTimerInterval) clearInterval(mltTimerInterval);
        audio.playClick();
        store.setArcadePlayMode(mode);
        initVotes();
        reRender();
      }
    });
  });

  // Solo Mode Buttons
  const btnSoloGuilty = document.getElementById('btn-solo-guilty');
  if (btnSoloGuilty) {
    btnSoloGuilty.addEventListener('click', () => {
      audio.playScoreUp();
      soloArchetypes.guilty++;
      setTimeout(() => {
        const prompts = getAllPrompts();
        currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
        reRender();
      }, 400);
      reRender();
    });
  }

  const btnSoloNotMe = document.getElementById('btn-solo-notme');
  if (btnSoloNotMe) {
    btnSoloNotMe.addEventListener('click', () => {
      audio.playChime();
      soloArchetypes.notMe++;
      setTimeout(() => {
        const prompts = getAllPrompts();
        currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
        reRender();
      }, 400);
      reRender();
    });
  }

  // 1. Back to Arcade
  const btnBack = document.getElementById('btn-mlt-back-arcade');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (mltTimerInterval) clearInterval(mltTimerInterval);
      audio.playClick();
      store.setView('ARCADE');
      window.location.hash = '#/ARCADE';
    });
  }

  // 2. Voting on a Camper
  const voteCards = document.querySelectorAll('.mlt-vote-card');
  voteCards.forEach((card) => {
    card.addEventListener('click', () => {
      audio.playScoreUp();
      const pid = card.dataset.playerId;
      if (votes[pid] !== undefined) {
        votes[pid]++;
      } else {
        votes[pid] = 1;
      }
      hasVoted = true;
      reRender();
    });
  });

  // 3. Reveal Squad Verdict
  const btnReveal = document.getElementById('btn-mlt-reveal');
  if (btnReveal) {
    btnReveal.addEventListener('click', () => {
      if (mltTimerInterval) clearInterval(mltTimerInterval);
      audio.playFanfare();
      revealed = true;
      reRender();
    });
  }

  // 4. Next Ballot
  const btnNext = document.getElementById('btn-mlt-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      audio.playClick();
      const prompts = getAllPrompts();
      currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
      initVotes();
      reRender();
    });
  }

  // 5. Custom Ballot Modal Handlers
  const modal = document.getElementById('mlt-custom-modal');
  const btnOpenModal = document.getElementById('btn-mlt-custom-prompt');
  const btnCloseModal = document.getElementById('btn-close-mlt-modal');
  const btnSave = document.getElementById('btn-save-mlt-custom');
  const inputPrompt = document.getElementById('mlt-custom-input');

  if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', () => {
      audio.playClick();
      modal.classList.remove('hidden');
      if (inputPrompt) inputPrompt.focus();
    });
  }

  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (btnSave && modal && inputPrompt) {
    btnSave.addEventListener('click', () => {
      const text = inputPrompt.value.trim();
      if (!text) return;
      
      audio.playFanfare();
      const newPrompt = {
        question: text.startsWith('Most likely to') ? text : `Most likely to ${text}`,
        tone: 'INSIDE ROAST',
        answers: ['Campers Vote']
      };
      
      customBallots.unshift(newPrompt);
      currentPromptIndex = 0;
      initVotes();
      modal.classList.add('hidden');
      inputPrompt.value = '';
      reRender();
    });
  }
}

function reRender() {
  const mount = document.getElementById('app-mount');
  if (mount && store.getState().currentView === 'MOST_LIKELY_TO') {
    mount.innerHTML = renderMostLikelyToGame();
    bindMostLikelyToEvents();
  }
}
