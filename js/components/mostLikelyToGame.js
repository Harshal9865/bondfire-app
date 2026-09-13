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

function getAllPrompts() {
  return [...MOST_LIKELY_TO_DECK, ...customBallots];
}

function initVotes() {
  const room = store.getState().activeRoom;
  const players = (room && room.players) ? room.players : [];
  votes = {};
  players.forEach((p) => {
    votes[p.id] = 0;
  });
  hasVoted = false;
  revealed = false;
}

export function renderMostLikelyToGame() {
  const prompts = getAllPrompts();
  if (currentPromptIndex >= prompts.length) currentPromptIndex = 0;
  const currentPrompt = prompts[currentPromptIndex] || prompts[0];

  const state = store.getState();
  const room = state.activeRoom || {};
  const players = room.players || [];
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
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-xl mb-6">
        <button id="btn-mlt-back-arcade" class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-bright/70 hover:bg-surface-bright text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Arcade</span>
        </button>

        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-gold animate-pulse"></span>
          <span class="text-[11px] font-mono font-bold text-amber-gold uppercase tracking-wider">Most Likely To · Live Ballot</span>
        </div>

        <button id="btn-mlt-custom-prompt" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-gold/20 hover:bg-amber-gold/30 border border-amber-gold/40 text-amber-gold text-xs font-bold transition-all active:scale-95">
          <span class="material-symbols-outlined text-[15px]">how_to_vote</span>
          <span class="hidden sm:inline">+ Custom Ballot</span>
          <span class="sm:hidden">+ Ballot</span>
        </button>
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

        <p class="text-xs text-gray-400 mt-2 mb-4">Tap on the camper in your room who fits this the most!</p>

        <!-- Vote Control Buttons -->
        <div class="flex items-center justify-center gap-3">
          <button id="btn-mlt-reveal" class="px-5 py-2.5 rounded-full ${revealed ? 'bg-mint-green/20 text-mint-green border border-mint-green/40' : 'bg-amber-gold hover:bg-[#FFBF47] text-dark'} font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">${revealed ? 'verified' : 'visibility'}</span>
            <span>${revealed ? 'Results Revealed' : 'Reveal Squad Verdict'}</span>
          </button>

          <button id="btn-mlt-next" class="px-4 py-2.5 rounded-full bg-surface-bright hover:bg-surface-bright/80 text-gray-300 hover:text-white border border-border text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5">
            <span>Next Ballot</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- LIVE CANDIDATE GRID (ROOM CAMPERS) -->
      <div class="p-5 rounded-2xl bg-surface border border-border shadow-xl">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
          <h4 class="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-gold text-[18px]">how_to_vote</span>
            <span>Vote for Camper (${totalVotes} votes cast)</span>
          </h4>
          <span class="text-[11px] font-mono text-gray-400">1 Tap = 1 Vote</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="mlt-players-grid">
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
                      ${p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('data:') || p.avatar.startsWith('/')) ? `<img src="${p.avatar}" class="w-full h-full object-cover rounded-full" alt="${p.name}"/>` : (p.avatar && p.avatar.match(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/u) ? p.avatar : '<span class="material-symbols-outlined text-gray-300 text-lg">person</span>')}
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-white group-hover:text-amber-gold transition-colors">${p.name}</span>
                        ${isLeader ? '<span class="material-symbols-outlined text-amber-gold text-base" title="Squad Consensus">hotel_class</span>' : ''}
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
  // 1. Back to Arcade
  const btnBack = document.getElementById('btn-mlt-back-arcade');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
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
