// ==============================================================================
// MEMORY VAULT COMPONENT (Screen 5)
// Easy to Understand Squad Vault: Photos, Chat Quotes, Inside Jokes & Highlights
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { renderVaultUpload, bindVaultUploadEvents } from './uploadVaultInteraction.js';

let confetti = null;
let activeVaultCategory = 'ALL'; // 'ALL' | 'PHOTOS' | 'QUOTES' | 'AWARDS' | 'AUDIO'

const SAMPLE_VAULT_PHOTOS = [
  {
    id: 's_photo_1',
    category: 'PHOTOS',
    title: 'Campfire Gathering',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80',
    caption: 'Campfire evening under the stars with marshmallows and stories.',
    tag: 'Campfire Moments',
    badge: 'Ready for Game',
  },
  {
    id: 's_photo_2',
    category: 'PHOTOS',
    title: 'Scenic Road Trip Overlook',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    caption: 'The spontaneous scenic stop on the way to the weekend cabin.',
    tag: 'Adventures',
    badge: 'Archived',
  },
];

export function renderVaultScreen() {
  const state = store.getState();
  const room = state.activeRoom || { roomCode: 'BONDFIRE', podName: 'Our Squad' };
  const user = state.currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';

  // Real Dynamic User Memories Aggregated from Store
  const userCustomMemories = state.vaultMemories || [];
  const duoWhispers = (state.duoWhisperNotes || []).map((n) => ({
    id: n.id,
    category: 'QUOTES',
    type: 'WHISPER NOTE',
    title: `Whisper Note from ${n.author}`,
    quote: n.text,
    author: n.author,
    timestamp: n.timestamp,
  }));
  const duoVoices = (state.duoVoiceNotes || []).map((v) => ({
    id: v.id,
    category: 'AUDIO',
    type: 'VOICE NOTE',
    title: `Voice Note from ${v.author} (${v.duration || '0:15'})`,
    quote: `Audio recording saved during Date Night session (${v.duration || '0:15'})`,
    author: v.author,
    timestamp: v.timestamp,
    audioUrl: v.audioUrl,
  }));
  const squadCards = (state.customGameDeck || []).map((c) => ({
    id: c.id,
    category: 'QUOTES',
    type: 'INSIDE JOKE',
    title: c.title || 'Squad Inside Joke',
    quote: c.prompt || c.quote,
    author: c.author || 'Squad Camper',
    timestamp: c.timestamp || 'Squad Live',
  }));

  const allDynamicMemories = [
    ...userCustomMemories.map((m) => ({
      ...m,
      category: m.category === 'LOVE' ? 'QUOTES' : (m.category || 'QUOTES'),
      type: m.type || 'CUSTOM MEMORY',
    })),
    ...duoWhispers,
    ...duoVoices,
    ...squadCards,
  ];

  const filteredMemories = allDynamicMemories.filter((m) => {
    if (activeVaultCategory === 'ALL') return true;
    return m.category === activeVaultCategory;
  });

  const hasAnyMemories = allDynamicMemories.length > 0;

  return `
    <div class="flex flex-col w-full max-w-[840px] mx-auto px-4 py-6 relative select-none text-on-surface">
      <!-- Glow -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-48 bg-amber-gold/10 rounded-full blur-[110px] pointer-events-none -z-10"></div>

      <!-- Top Header & Room Badge -->
      <div class="flex flex-col gap-3 mb-6 relative">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-surface-bright font-mono text-xs text-amber-gold border border-amber-gold/30 tracking-wider uppercase font-bold">
              SQUAD MEMORY VAULT
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-mint-green font-mono text-xs font-bold border border-mint-green/30">
              <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
              Encrypted &amp; Private
            </span>
          </div>

          <div class="font-mono text-xs text-sunset-coral font-bold bg-surface px-3 py-1 rounded-full border border-sunset-coral/30 flex items-center gap-1">
            <span>Room:</span>
            <span class="text-white">#${room.roomCode}</span>
          </div>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-4 pt-1">
          <div>
            <h1 class="font-display text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
              Our Squad Vault
            </h1>
            <p class="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl leading-relaxed">
              Your private archive for real moments, voice recordings, and inside jokes. Everything saved here auto-generates your live party game rounds and memory albums.
            </p>
          </div>

          <button id="btn-open-add-memory-modal" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Memory</span>
          </button>
        </div>
      </div>

      <!-- Quick Upload Drop Zone -->
      ${renderVaultUpload()}

      <!-- 4 Clean Category Filter Tabs -->
      <div class="my-6">
        <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Browse Memories by Category</h3>
          <span class="text-xs font-mono text-amber-gold">${allDynamicMemories.length + SAMPLE_VAULT_PHOTOS.length} Memories Archived</span>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'ALL' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="ALL">
            <span class="material-symbols-outlined text-[15px]">apps</span>
            <span>All Memories</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'PHOTOS' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="PHOTOS">
            <span class="material-symbols-outlined text-[15px]">photo_library</span>
            <span>Photos (${SAMPLE_VAULT_PHOTOS.length})</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'QUOTES' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="QUOTES">
            <span class="material-symbols-outlined text-[15px]">chat</span>
            <span>Jokes &amp; Quotes (${allDynamicMemories.filter(m => m.category === 'QUOTES').length})</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'AUDIO' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="AUDIO">
            <span class="material-symbols-outlined text-[15px]">mic</span>
            <span>Voice Notes (${duoVoices.length})</span>
          </button>
        </div>
      </div>

      <!-- Real User Dynamic Memories Grid -->
      ${filteredMemories.length > 0 ? `
        <div class="mb-6 space-y-3">
          <h4 class="text-xs font-mono font-bold text-mint-green uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-mint-green"></span>
            <span>Live Vault Entries (${filteredMemories.length})</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${filteredMemories.map(m => `
              <div class="p-5 rounded-3xl bg-surface border-2 border-border hover:border-amber-gold/50 shadow-lg flex flex-col justify-between gap-3 transition-all">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold font-bold">
                      ${m.type || 'MEMORY'}
                    </span>
                    <span class="text-[10px] text-gray-400 font-mono">${m.timestamp || 'Today'}</span>
                  </div>
                  <h5 class="text-sm font-bold text-white">${m.title || 'Squad Memory'}</h5>
                  <p class="text-xs text-gray-200 italic leading-relaxed">“${m.quote || m.details || ''}”</p>
                </div>
                <div class="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400">
                  <span>From: <strong class="text-white">${m.author || userName}</strong></span>
                  <button class="btn-vault-play-in-game text-sunset-coral font-bold hover:underline" data-title="${m.title}">
                    Play in Game →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : (!hasAnyMemories && activeVaultCategory !== 'PHOTOS') ? `
        <!-- Warm Friendly Interactive Empty State -->
        <div class="p-8 rounded-3xl bg-surface border-2 border-dashed border-amber-gold/30 text-center flex flex-col items-center justify-center gap-3 mb-6">
          <div class="w-16 h-16 rounded-2xl bg-amber-gold/15 text-amber-gold flex items-center justify-center border border-amber-gold/30">
            <span class="material-symbols-outlined text-3xl">inventory_2</span>
          </div>
          <h3 class="font-display text-lg font-bold text-white">Your Vault is ready to archive memories</h3>
          <p class="text-xs text-gray-300 max-w-sm leading-relaxed">
            No mock quotes here! Store your real inside jokes, voice memories, and trip photos, or play a round in Solo, Duo, or Squad to seal moments here.
          </p>
          <button id="btn-empty-add-memory" class="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Add Your First Memory</span>
          </button>
        </div>
      ` : ''}

      <!-- Vault Cards Grid: Photos -->
      ${(activeVaultCategory === 'ALL' || activeVaultCategory === 'PHOTOS') ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10" id="vault-items-container">
          ${SAMPLE_VAULT_PHOTOS.map(p => `
            <div class="rounded-3xl bg-surface border border-border p-3.5 flex flex-col justify-between shadow-lg group hover:border-amber-gold/50 transition-all">
              <div class="relative w-full h-48 rounded-2xl overflow-hidden bg-canvas mb-3">
                <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-mono text-amber-gold border border-amber-gold/30">
                  ${p.tag}
                </div>
                <div class="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-mono text-mint-green border border-mint-green/30">
                  ${p.badge}
                </div>
              </div>
              <div class="px-1 space-y-1">
                <h4 class="text-sm font-bold text-white group-hover:text-amber-gold transition-colors">${p.title}</h4>
                <p class="text-xs text-gray-300 leading-relaxed">${p.caption}</p>
              </div>
              <div class="mt-3 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-gray-400">
                <span class="font-mono text-[10px]">Tagged: ${userName}, Room Campers</span>
                <button class="btn-vault-play-in-game text-sunset-coral font-bold hover:underline" data-title="${p.title}">
                  Play in Game →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Add Custom Memory Modal -->
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
              <input type="text" id="custom-memory-title" placeholder="e.g. 3 AM Maggi Incident, The Rental Car Mystery" class="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none" />
            </div>

            <div>
              <label class="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1">Quote or Inside Joke Story</label>
              <textarea id="custom-memory-quote" placeholder="What was said or what happened? (This gets auto-adapted into live trivia rounds)" rows="3" class="w-full p-3.5 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none"></textarea>
            </div>

            <div>
              <label class="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1">Who Said or Did This?</label>
              <input type="text" id="custom-memory-author" value="${userName}" placeholder="Camper Name" class="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:border-amber-gold text-sm text-white placeholder:text-gray-500 focus:outline-none" />
            </div>
          </div>

          <button id="btn-save-custom-memory" class="w-full py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>Save to Room Vault</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindVaultEvents() {
  if (!confetti) {
    confetti = new ConfettiEngine('confetti-canvas');
  }

  // Bind file upload events from subcomponent
  bindVaultUploadEvents();

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
        type: 'CUSTOM',
        category: 'JOKES',
      });
      modal.style.display = 'none';
      store.setView('MEMORIES');
    });
  }

  // Play in game button -> launch game with this item
  const playBtns = document.querySelectorAll('.btn-vault-play-in-game');
  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playChime();
      store.setView('LOBBY');
      window.location.hash = '#/LOBBY';
    });
  });
}
