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
    title: 'Midnight Beach Bonfire',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80',
    caption: '3:15 AM deck fire. Burnt the marshmallows in 4 seconds.',
    tag: 'Group Trip',
    badge: 'Ready for Trivia',
  },
  {
    id: 's_photo_2',
    category: 'PHOTOS',
    title: 'Hawaiian Pizza Delivery Scandal',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    caption: 'The pineapple that divided the entire Airbnb squad.',
    tag: 'Food Lore',
    badge: 'Archived',
  },
];

const SAMPLE_VAULT_QUOTES = [
  {
    id: 's_quote_1',
    category: 'QUOTES',
    author: 'Harshal',
    quote: '“If anyone orders another Hawaiian pizza tonight I am revoking my Netflix password for all 5 of you.”',
    context: 'Austin Airbnb Trip · Group Chat Archive',
    reactions: '8 reactions 🔥',
  },
  {
    id: 's_quote_2',
    category: 'QUOTES',
    author: 'Sam',
    quote: '“Bas 5 minute mein aa raha hoon!” (Standing in towel scrolling Reels for 40 minutes)',
    context: 'Friday Dinner Group Chat',
    reactions: '12 reactions 😂',
  },
];

const SAMPLE_VAULT_AWARDS = [
  {
    id: 's_award_1',
    category: 'AWARDS',
    title: 'MVP Lore Master',
    winner: 'Harshal',
    icon: 'hotel_class',
    description: 'Scored 1,420 points in Roast Tribunal round',
  },
  {
    id: 's_award_2',
    category: 'AWARDS',
    title: 'First Asleep on Couch',
    winner: 'Sam',
    icon: 'bedtime',
    description: 'Asleep 12 minutes into the movie with popcorn in hand',
  },
];

export function renderVaultScreen() {
  const state = store.getState();
  const room = state.activeRoom || { roomCode: 'BONDFIRE', podName: 'Our Squad' };
  const customMemories = state.vaultMemories || [];
  const user = state.currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';

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
              Your safe deposit box for photos, unedited chat quotes, and inside jokes. Everything saved here auto-generates your party game rounds and custom hardcover yearbooks.
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
          <span class="text-xs font-mono text-amber-gold">${SAMPLE_VAULT_PHOTOS.length + SAMPLE_VAULT_QUOTES.length + SAMPLE_VAULT_AWARDS.length + customMemories.length} Memories Available</span>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'ALL' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="ALL">
            <span class="material-symbols-outlined text-[15px]">apps</span>
            <span>All Memories</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'PHOTOS' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="PHOTOS">
            <span class="material-symbols-outlined text-[15px]">photo_library</span>
            <span>Photos &amp; Moments</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'QUOTES' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="QUOTES">
            <span class="material-symbols-outlined text-[15px]">chat</span>
            <span>Chat Quotes &amp; Jokes</span>
          </button>
          <button class="btn-vault-cat px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeVaultCategory === 'AWARDS' ? 'bg-amber-gold text-canvas shadow' : 'bg-surface text-gray-300 border border-border hover:text-white'}" data-cat="AWARDS">
            <span class="material-symbols-outlined text-[15px]">emoji_events</span>
            <span>Game Highlights</span>
          </button>
        </div>
      </div>

      <!-- Real User-Added Custom Memories Grid -->
      ${customMemories.length > 0 ? `
        <div class="mb-6 space-y-3">
          <h4 class="text-xs font-mono font-bold text-mint-green uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-mint-green"></span>
            <span>Recently Added by Room Campers (${customMemories.length})</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${customMemories.map(m => `
              <div class="p-4 rounded-2xl bg-surface border-2 border-mint-green/40 shadow-lg flex flex-col justify-between gap-3">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint-green/20 text-mint-green font-bold">CUSTOM MEMORY</span>
                    <span class="text-[10px] text-gray-400 font-mono">${m.timestamp || 'Today'}</span>
                  </div>
                  <h5 class="text-sm font-bold text-white mb-1">${m.title || 'Squad Memory'}</h5>
                  <p class="text-xs text-gray-200 italic leading-relaxed">“${m.quote || m.details || ''}”</p>
                </div>
                <div class="pt-2 border-t border-border flex items-center justify-between text-xs text-gray-400">
                  <span>Author: <strong class="text-amber-gold">${m.author || userName}</strong></span>
                  <span class="text-mint-green font-mono font-bold">Live in Game Deck</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Vault Cards Grid (Photos, Quotes, Awards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10" id="vault-items-container">
        <!-- Photo Cards -->
        ${(activeVaultCategory === 'ALL' || activeVaultCategory === 'PHOTOS') ? SAMPLE_VAULT_PHOTOS.map(p => `
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
              <span class="font-mono text-[10px]">Tagged: ${userName}, Marcus</span>
              <button class="btn-vault-play-in-game text-sunset-coral font-bold hover:underline" data-title="${p.title}">
                Play in Game →
              </button>
            </div>
          </div>
        `).join('') : ''}

        <!-- Quote Cards -->
        ${(activeVaultCategory === 'ALL' || activeVaultCategory === 'QUOTES') ? SAMPLE_VAULT_QUOTES.map(q => `
          <div class="rounded-3xl bg-surface border border-border p-5 flex flex-col justify-between shadow-lg group hover:border-sunset-coral/50 transition-all">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span class="flex items-center gap-1.5 font-mono text-[11px] text-sunset-coral font-bold">
                  <span class="material-symbols-outlined text-[16px]">chat</span>
                  <span>Group Chat Archive</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-surface-bright border border-border text-[10px] font-mono">Unedited</span>
              </div>
              <p class="text-sm font-medium text-gray-100 italic leading-relaxed">
                ${q.quote}
              </p>
              <div class="flex items-center justify-between text-xs font-mono text-amber-gold">
                <span>Author: <strong class="text-white">${q.author}</strong></span>
                <span class="text-sunset-coral font-bold">${q.reactions}</span>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-gray-400">
              <span class="font-mono text-[10px] truncate max-w-[180px]">${q.context}</span>
              <button class="btn-vault-play-in-game text-sunset-coral font-bold hover:underline" data-title="${q.author}'s Quote">
                Play in Game →
              </button>
            </div>
          </div>
        `).join('') : ''}

        <!-- Award Cards -->
        ${(activeVaultCategory === 'ALL' || activeVaultCategory === 'AWARDS') ? SAMPLE_VAULT_AWARDS.map(a => `
          <div class="rounded-3xl bg-surface border border-border p-5 flex items-center gap-4 shadow-lg group hover:border-mint-green/50 transition-all">
            <div class="w-14 h-14 rounded-2xl bg-amber-gold/15 text-amber-gold border border-amber-gold/30 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-3xl">${a.icon}</span>
            </div>
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-center justify-between">
                <h4 class="font-display text-sm font-bold text-white truncate">${a.title}</h4>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint-green/20 text-mint-green font-bold">VERIFIED</span>
              </div>
              <p class="text-xs text-amber-gold font-semibold">Awarded to: ${a.winner}</p>
              <p class="text-xs text-gray-400 truncate">${a.description}</p>
            </div>
          </div>
        `).join('') : ''}
      </div>

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
  const modal = document.getElementById('add-memory-modal');
  const closeModalBtn = document.getElementById('btn-close-memory-modal');
  const saveMemoryBtn = document.getElementById('btn-save-custom-memory');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      audio.playClick();
      modal.style.display = 'flex';
      const titleInput = document.getElementById('custom-memory-title');
      if (titleInput) titleInput.focus();
    });
  }

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
