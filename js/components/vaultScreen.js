// ==============================================================================
// MEMORY VAULT COMPONENT (Screen 5)
// Encrypted Squad Lore: Inside Jokes, Audio Notes, Chat Quotes & Time Capsules
// Differentiated from Photo Book (Vault = Lore & Game Trivia | Photo Book = Photos)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { renderVaultUpload, bindVaultUploadEvents } from './uploadVaultInteraction.js';

let confetti = null;
let activeVaultCategory = 'ALL'; // 'ALL' | 'QUOTES' | 'AUDIO' | 'CAPSULES'

// Authentic Squad Lore Starter Examples (No fake photo duplicates!)
const SAMPLE_VAULT_LORE = [
  {
    id: 's_lore_1',
    category: 'QUOTES',
    type: 'INSIDE JOKE',
    title: 'The 3 AM Electric Kettle Incident',
    quote: 'Who boiled water in the hotel kettle with Maggi masala already inside and blew the entire cottage fuse?',
    author: 'Harshal',
    timestamp: 'Trip Archive',
    badge: 'Ready for Live Game',
    badgeColor: 'text-amber-gold border-amber-gold/30',
  },
  {
    id: 's_lore_2',
    category: 'AUDIO',
    type: 'VOICE NOTE',
    title: 'Ghats Road Trip Singalong',
    quote: '15-second voice memo recorded at midnight screaming 90s Bollywood tracks with the windows down.',
    author: 'Priya',
    timestamp: 'Lonavala Drive',
    badge: 'Voice Memo',
    badgeColor: 'text-mint-green border-mint-green/30',
    duration: '0:18',
  },
  {
    id: 's_lore_3',
    category: 'CAPSULES',
    type: 'TIME CAPSULE',
    title: 'Goa Reunion Pact 2027',
    quote: 'Sealed squad pact: Nobody checks work email or Slack until Monday 9 AM or pays ₹1,000 fine into the squad pizza fund.',
    author: 'Room Campers',
    timestamp: 'Locked until Oct 2027',
    badge: 'Time Locked',
    badgeColor: 'text-sunset-coral border-sunset-coral/30',
    isLocked: true,
    unlockDate: 'Oct 24, 2027',
  },
];

export function renderVaultScreen() {
  const state = store.getState();
  const room = state.activeRoom || { roomCode: 'BONDFIRE', podName: 'Our Squad' };
  const user = state.currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';

  // Dynamic User Memories Aggregated from Store
  const userCustomMemories = (state.vaultMemories || []).map((m) => ({
    ...m,
    category: m.isTimeCapsule ? 'CAPSULES' : (m.category === 'AUDIO' ? 'AUDIO' : 'QUOTES'),
    type: m.isTimeCapsule ? 'TIME CAPSULE' : (m.type || 'INSIDE JOKE'),
  }));

  const duoWhispers = (state.duoWhisperNotes || []).map((n) => ({
    id: n.id,
    category: 'QUOTES',
    type: 'WHISPER NOTE',
    title: `Whisper Note from ${n.author}`,
    quote: n.text,
    author: n.author,
    timestamp: n.timestamp || 'Recent',
  }));

  const duoVoices = (state.duoVoiceNotes || []).map((v) => ({
    id: v.id,
    category: 'AUDIO',
    type: 'VOICE NOTE',
    title: `Voice Note from ${v.author}`,
    quote: `Audio recording saved during Date Night session (${v.duration || '0:15'})`,
    author: v.author,
    timestamp: v.timestamp || 'Recent',
    duration: v.duration || '0:15',
  }));

  const squadCards = (state.customGameDeck || []).map((c) => ({
    id: c.id,
    category: 'QUOTES',
    type: 'PARTY TRIVIA',
    title: c.title || 'Squad Inside Joke',
    quote: c.prompt || c.quote,
    author: c.author || 'Squad Camper',
    timestamp: c.timestamp || 'Live Party',
  }));

  const allDynamicMemories = [
    ...userCustomMemories,
    ...duoWhispers,
    ...duoVoices,
    ...squadCards,
  ];

  // Combine with starter lore if user has few entries
  const displayedItems = allDynamicMemories.length > 0 ? allDynamicMemories : SAMPLE_VAULT_LORE;

  const filteredMemories = displayedItems.filter((m) => {
    if (activeVaultCategory === 'ALL') return true;
    return m.category === activeVaultCategory;
  });

  const quotesCount = displayedItems.filter((m) => m.category === 'QUOTES').length;
  const audioCount = displayedItems.filter((m) => m.category === 'AUDIO').length;
  const capsulesCount = displayedItems.filter((m) => m.category === 'CAPSULES').length;

  return `
    <div class="flex flex-col w-full max-w-[880px] mx-auto px-4 py-6 relative select-none text-on-surface">
      <!-- Cyber Ambient Glow -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-amber-gold/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <!-- Top Header & Security Status -->
      <div class="flex flex-col gap-3 mb-6 relative">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-surface-bright font-mono text-xs text-amber-gold border border-amber-gold/30 tracking-wider uppercase font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">lock</span>
              <span>SQUAD LORE VAULT</span>
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-mint-green font-mono text-xs font-bold border border-mint-green/30">
              <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
              <span>Encrypted &amp; Private</span>
            </span>
          </div>

          <div class="font-mono text-xs text-sunset-coral font-bold bg-surface px-3 py-1 rounded-full border border-sunset-coral/30 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">meeting_room</span>
            <span>Room:</span>
            <span class="text-white">#${room.roomCode}</span>
          </div>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-4 pt-1">
          <div>
            <h1 class="font-display text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
              Squad Lore &amp; Time Vault
            </h1>
            <p class="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl leading-relaxed">
              Your room&apos;s encrypted archive for inside jokes, audio notes, and time-capsules. Everything stored here fuels live party game rounds.
            </p>
          </div>

          <button id="btn-open-add-memory-modal" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Lore or Secret</span>
          </button>
        </div>
      </div>

      <!-- SQUAD VAULT vs PHOTO BOOK Explainer Banner -->
      <div class="p-4 sm:p-5 rounded-3xl bg-surface/80 border border-amber-gold/25 backdrop-blur-md mb-6 shadow-xl relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1.5 max-w-xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-gold/15 text-amber-gold font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">help</span>
                <span>Squad Vault vs Photo Book</span>
              </span>
            </div>
            <p class="text-xs text-gray-200 leading-relaxed">
              <strong class="text-amber-gold font-semibold">The Vault</strong> stores squad lore, 3 AM quotes, voice recordings, and sealed time-capsules that generate live party games.
              For photography, polaroids, and printed keepsake albums, use the <strong class="text-sunset-coral font-semibold">Photo Book</strong>.
            </p>
          </div>

          <button id="btn-jump-to-photobook" class="px-4 py-2 rounded-2xl bg-surface-bright border border-sunset-coral/40 text-sunset-coral hover:text-white hover:bg-sunset-coral/20 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow">
            <span class="material-symbols-outlined text-[16px]">photo_library</span>
            <span>Open Photo Book Studio →</span>
          </button>
        </div>
      </div>

      <!-- Quick 3-Step Guide: How the Vault Works -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div class="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-gold/15 text-amber-gold flex items-center justify-center shrink-0 border border-amber-gold/30">
            <span class="material-symbols-outlined text-[18px]">history_edu</span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">1. Capture Squad Lore</h4>
            <p class="text-[11px] text-gray-400 leading-tight mt-0.5">Archive 3 AM banter, inside jokes, and audio notes.</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-mint-green/15 text-mint-green flex items-center justify-center shrink-0 border border-mint-green/30">
            <span class="material-symbols-outlined text-[18px]">sports_esports</span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">2. Auto-Feeds Games</h4>
            <p class="text-[11px] text-gray-400 leading-tight mt-0.5">Generates live trivia cards in Spin the Bottle &amp; Arcade.</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-sunset-coral/15 text-sunset-coral flex items-center justify-center shrink-0 border border-sunset-coral/30">
            <span class="material-symbols-outlined text-[18px]">lock_clock</span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">3. Time-Locked Capsules</h4>
            <p class="text-[11px] text-gray-400 leading-tight mt-0.5">Lock secret notes until next year&apos;s trip or squad reunion.</p>
          </div>
        </div>
      </div>

      <!-- Quick Chat Screenshot / Voice Upload Drop Zone -->
      ${renderVaultUpload()}

      <!-- 4 Category Filter Tabs -->
      <div class="my-6">
        <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">tune</span>
            <span>Browse Vault Archives</span>
          </h3>
          <span class="text-xs font-mono text-amber-gold">${displayedItems.length} Entries Sealed</span>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'ALL' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="ALL">
            <span class="material-symbols-outlined text-[15px]">apps</span>
            <span>All Lore (${displayedItems.length})</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'QUOTES' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="QUOTES">
            <span class="material-symbols-outlined text-[15px]">history_edu</span>
            <span>Inside Jokes &amp; Quotes (${quotesCount})</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'AUDIO' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="AUDIO">
            <span class="material-symbols-outlined text-[15px]">mic</span>
            <span>Voice Notes (${audioCount})</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'CAPSULES' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="CAPSULES">
            <span class="material-symbols-outlined text-[15px]">lock_clock</span>
            <span>Time Capsules (${capsulesCount})</span>
          </button>
        </div>
      </div>

      <!-- Vault Entries Grid -->
      ${filteredMemories.length > 0 ? `
        <div class="mb-3 flex items-center justify-between">
          <h4 class="text-xs font-mono font-bold text-mint-green uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-mint-green"></span>
            <span>Live Vault Entries (${filteredMemories.length})</span>
          </h4>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          ${filteredMemories.map(m => `
            <div class="p-5 rounded-3xl bg-surface border-2 ${m.isLocked ? 'border-sunset-coral/40 bg-gradient-to-b from-surface to-sunset-coral/5' : 'border-border hover:border-amber-gold/50'} shadow-lg flex flex-col justify-between gap-3 transition-all relative overflow-hidden group">
              ${m.isLocked ? `
                <div class="absolute top-0 right-0 px-3 py-1 bg-sunset-coral/20 text-sunset-coral font-mono text-[10px] font-bold rounded-bl-2xl border-b border-l border-sunset-coral/30 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">lock_clock</span>
                  <span>LOCKED UNTIL ${m.unlockDate || 'FUTURE'}</span>
                </div>
              ` : ''}

              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full ${m.category === 'AUDIO' ? 'bg-mint-green/20 text-mint-green' : m.category === 'CAPSULES' ? 'bg-sunset-coral/20 text-sunset-coral' : 'bg-amber-gold/20 text-amber-gold'} font-bold flex items-center gap-1">
                      <span class="material-symbols-outlined text-[12px]">
                        ${m.category === 'AUDIO' ? 'mic' : m.category === 'CAPSULES' ? 'lock_clock' : 'history_edu'}
                      </span>
                      <span>${m.type || 'LORE'}</span>
                    </span>
                    ${m.duration ? `
                      <span class="text-[10px] font-mono text-gray-400 bg-surface-bright px-2 py-0.5 rounded-md">${m.duration}</span>
                    ` : ''}
                  </div>
                  <span class="text-[10px] text-gray-400 font-mono">${m.timestamp || 'Archived'}</span>
                </div>

                <h5 class="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>${m.title || 'Squad Lore Entry'}</span>
                </h5>

                <div class="p-3.5 rounded-2xl bg-canvas/60 border border-border/80">
                  <p class="text-xs text-gray-200 italic leading-relaxed">
                    &ldquo;${m.quote || m.details || 'Confidential squad record.'}&rdquo;
                  </p>
                </div>
              </div>

              <div class="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">person</span>
                  <span>From: <strong class="text-white">${m.author || userName}</strong></span>
                </span>

                ${m.isLocked ? `
                  <span class="text-[11px] font-mono text-sunset-coral flex items-center gap-1 font-bold">
                    <span class="material-symbols-outlined text-[14px]">timer</span>
                    <span>Sealed</span>
                  </span>
                ` : `
                  <button class="btn-vault-play-in-game text-amber-gold hover:text-sunset-coral font-bold transition-colors flex items-center gap-1 text-xs" data-title="${m.title || 'Memory'}" data-quote="${m.quote || ''}" data-author="${m.author || userName}">
                    <span>Play in Live Game</span>
                    <span class="material-symbols-outlined text-[14px]">sports_esports</span>
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="p-8 rounded-3xl bg-surface border-2 border-dashed border-amber-gold/30 text-center flex flex-col items-center justify-center gap-3 mb-8">
          <div class="w-16 h-16 rounded-2xl bg-amber-gold/15 text-amber-gold flex items-center justify-center border border-amber-gold/30">
            <span class="material-symbols-outlined text-3xl">inventory_2</span>
          </div>
          <h3 class="font-display text-lg font-bold text-white">No entries found in this category</h3>
          <p class="text-xs text-gray-300 max-w-sm leading-relaxed">
            Archive your squad inside jokes, voice notes, or seal a time capsule to keep your squad lore alive forever.
          </p>
          <button id="btn-empty-add-memory" class="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Add to Squad Vault</span>
          </button>
        </div>
      `}

      <!-- Toast Feedback -->
      <div id="vault-toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-surface-bright border border-amber-gold/50 shadow-2xl text-xs font-bold text-white flex items-center gap-2 opacity-0 pointer-events-none transition-all duration-300">
        <span class="material-symbols-outlined text-amber-gold text-[18px]">verified</span>
        <span id="vault-toast-msg">Added to Game Deck!</span>
      </div>

      <!-- Add Lore or Time Capsule Modal -->
      <div id="add-memory-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" style="display: none;">
        <div class="w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-border">
            <h3 class="font-display text-base font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-[20px]">note_add</span>
              <span>Add to Squad Vault</span>
            </h3>
            <button id="btn-close-memory-modal" class="text-gray-400 hover:text-white p-1">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1">Title or Incident Name</label>
              <input type="text" id="custom-memory-title" placeholder="e.g. 3 AM Maggi Incident, The Airport Run" class="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none" />
            </div>

            <div>
              <label class="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1">Quote, Joke Story or Secret Note</label>
              <textarea id="custom-memory-quote" placeholder="What was said or what happened? (Auto-adapted into live trivia rounds)" rows="3" class="w-full p-3.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none"></textarea>
            </div>

            <div>
              <label class="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1">Who Said or Did This?</label>
              <input type="text" id="custom-memory-author" value="${userName}" placeholder="Camper Name" class="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none" />
            </div>

            <!-- Time Capsule Toggle -->
            <div class="p-3 rounded-2xl bg-canvas border border-border/80 flex items-center justify-between">
              <div class="space-y-0.5">
                <label class="text-xs font-bold text-white flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-sunset-coral">lock_clock</span>
                  <span>Seal as Time Capsule</span>
                </label>
                <p class="text-[10px] text-gray-400">Lock this memory until a future reunion or date</p>
              </div>
              <input type="checkbox" id="custom-memory-capsule-toggle" class="w-4 h-4 rounded border-border accent-sunset-coral cursor-pointer" />
            </div>

            <div id="capsule-date-container" class="space-y-1 hidden">
              <label class="text-[11px] font-mono text-sunset-coral uppercase font-bold block">Unlock Target Event or Date</label>
              <input type="text" id="custom-memory-unlock-date" placeholder="e.g. Goa Reunion 2027, New Year 2027" class="w-full px-3.5 py-2 rounded-xl bg-canvas border border-sunset-coral/40 text-sm text-white placeholder:text-gray-500 focus:outline-none" />
            </div>
          </div>

          <button id="btn-save-custom-memory" class="w-full py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>Seal into Vault</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function showVaultToast(msg) {
  const toast = document.getElementById('vault-toast');
  const toastMsg = document.getElementById('vault-toast-msg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none');
      toast.classList.remove('opacity-100');
    }, 2500);
  }
}

export function bindVaultEvents() {
  if (!confetti) {
    confetti = new ConfettiEngine('confetti-canvas');
  }

  // Bind file upload events from subcomponent
  bindVaultUploadEvents();

  // Jump to Photo Book button
  const jumpPhotobookBtn = document.getElementById('btn-jump-to-photobook');
  if (jumpPhotobookBtn) {
    jumpPhotobookBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('YEARBOOK');
      window.location.hash = '#/YEARBOOK';
    });
  }

  // Category filter tabs
  const catBtns = document.querySelectorAll('.btn-vault-cat');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      activeVaultCategory = btn.dataset.cat;
      store.setView('MEMORIES');
    });
  });

  // Modal open / close
  const openModalBtn = document.getElementById('btn-open-add-memory-modal');
  const emptyAddBtn = document.getElementById('btn-empty-add-memory');
  const modal = document.getElementById('add-memory-modal');
  const closeModalBtn = document.getElementById('btn-close-memory-modal');
  const saveMemoryBtn = document.getElementById('btn-save-custom-memory');
  const capsuleToggle = document.getElementById('custom-memory-capsule-toggle');
  const capsuleDateBox = document.getElementById('capsule-date-container');

  if (capsuleToggle && capsuleDateBox) {
    capsuleToggle.addEventListener('change', () => {
      if (capsuleToggle.checked) {
        capsuleDateBox.classList.remove('hidden');
      } else {
        capsuleDateBox.classList.add('hidden');
      }
    });
  }

  const handleOpenModal = () => {
    audio.playClick();
    if (modal) {
      modal.style.display = 'flex';
      const titleInput = document.getElementById('custom-memory-title');
      if (titleInput) titleInput.focus();
    }
  };

  if (openModalBtn) openModalBtn.addEventListener('click', handleOpenModal);
  if (emptyAddBtn) emptyAddBtn.addEventListener('click', handleOpenModal);

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      audio.playClick();
      modal.style.display = 'none';
    });
  }

  // Save custom memory
  if (saveMemoryBtn && modal) {
    saveMemoryBtn.addEventListener('click', () => {
      const title = document.getElementById('custom-memory-title')?.value.trim();
      const quote = document.getElementById('custom-memory-quote')?.value.trim();
      const author = document.getElementById('custom-memory-author')?.value.trim();
      const isTimeCapsule = !!document.getElementById('custom-memory-capsule-toggle')?.checked;
      const unlockDate = document.getElementById('custom-memory-unlock-date')?.value.trim() || 'Future Reunion';

      if (!title || !quote) {
        audio.playTick();
        return;
      }

      audio.playCorrect();
      confetti.burst(50);
      store.addCustomMemory({
        title,
        quote,
        author: author || 'Squad Camper',
        type: isTimeCapsule ? 'TIME CAPSULE' : 'INSIDE JOKE',
        category: isTimeCapsule ? 'CAPSULES' : 'QUOTES',
        isTimeCapsule,
        isLocked: isTimeCapsule,
        unlockDate: isTimeCapsule ? unlockDate : null,
      });
      modal.style.display = 'none';
      store.setView('MEMORIES');
    });
  }

  // Play in game button -> injects into game deck & provides smooth routing
  const playBtns = document.querySelectorAll('.btn-vault-play-in-game');
  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const title = btn.dataset.title;
      const quote = btn.dataset.quote;
      const author = btn.dataset.author;

      if (title && quote) {
        store.addCustomMemory({
          title,
          quote,
          author: author || 'Squad Camper',
          type: 'PARTY TRIVIA',
          category: 'QUOTES',
        });
      }

      showVaultToast(`"${title}" loaded into Live Party Game!`);
      setTimeout(() => {
        store.setView('ARCADE');
        window.location.hash = '#/ARCADE';
      }, 700);
    });
  });
}
