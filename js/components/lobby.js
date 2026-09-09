// ==============================================================================
// ROOM LOBBY COMPONENT (Screen 1)
// Active Lobby Room matching Google Stitch Warm Analog Cyber design
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { GAME_MODES } from '../data/partyGameDecks.js';

export function renderLobby() {
  const state = store.getState();
  const room = state.activeRoom;
  const user = state.currentUser;
  const hostName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Host';

  return `
    <div class="flex flex-col w-full max-w-[620px] mx-auto px-4 pt-6 pb-28 relative select-none">
      <!-- Ambient Ember Glow Backdrops -->
      <div class="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-44 bg-primary-container/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-80 right-2 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Room Quick Bar -->
      <section class="pt-1 pb-3 flex items-center justify-between gap-2">
        <!-- Tap to Copy Room Code Pill -->
        <button class="flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full shadow-md active:scale-95 transition-all text-left group border border-border/60" id="copy-code-btn" type="button">
          <span class="material-symbols-outlined text-secondary text-[18px] transition-transform group-hover:rotate-12" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
          <div class="flex flex-col">
            <span class="font-label-md text-caption text-secondary-fixed uppercase tracking-wider font-bold">Room Code</span>
            <div class="flex items-center gap-1">
              <span class="font-room-code text-headline-sm text-on-surface tracking-widest leading-none">${room.roomCode}</span>
              <span class="material-symbols-outlined text-secondary text-[16px] ml-1" id="copy-icon">content_copy</span>
            </div>
          </div>
        </button>

        <!-- Leave Room Pill -->
        <button class="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container border border-border/50 px-3.5 py-2 rounded-full transition-colors active:scale-95 text-on-surface-variant" id="btn-leave-lobby" type="button">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span class="font-label-md text-label-md">Leave</span>
        </button>
      </section>

      <!-- Pod Identity Hero Bento Slab -->
      <section class="mb-5">
        <div class="relative overflow-hidden bg-surface-container rounded-2xl p-5 shadow-xl border border-border/80">
          <div class="absolute -right-8 -top-8 w-36 h-36 bg-gradient-to-bl from-primary-container/20 to-transparent rounded-full blur-xl pointer-events-none"></div>
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ff5a5f_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

          <div class="relative flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full border border-border/60">
                <span class="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                <span class="font-caption text-caption text-tertiary-fixed-dim uppercase tracking-wider font-bold">Host: ${hostName} · ${room.players.length} Players</span>
              </div>
              <span class="font-caption text-caption text-secondary-fixed flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">
                <span class="material-symbols-outlined text-[14px]">lock_open</span> Pod Public
              </span>
            </div>

            <h2 class="font-headline-md text-headline-md text-on-surface tracking-tight mt-1">
              ${room.podName} 🏖️
            </h2>

            <div class="flex items-center justify-between bg-surface-container-lowest/80 rounded-xl p-2.5 mt-1 border border-border/60 hover:border-sunset-coral/50 transition-colors cursor-pointer" id="btn-active-deck-trigger">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-xl flex-shrink-0">${(GAME_MODES.find((m) => m.id === (room.selectedGameMode || 'RED_FLAG_COURT')) || GAME_MODES[0]).emoji}</span>
                <div class="truncate">
                  <div class="flex items-center gap-1.5">
                    <span class="font-caption text-caption text-on-surface-variant uppercase font-bold">Active Game Mode</span>
                    <span class="px-1.5 py-0.2 rounded bg-sunset-coral/20 text-sunset-coral text-[9px] font-bold font-mono uppercase">${(GAME_MODES.find((m) => m.id === (room.selectedGameMode || 'RED_FLAG_COURT')) || GAME_MODES[0]).badgeText}</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface truncate block font-bold">${(GAME_MODES.find((m) => m.id === (room.selectedGameMode || 'RED_FLAG_COURT')) || GAME_MODES[0]).name}</span>
                </div>
              </div>
              <button class="flex-shrink-0 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center gap-1 text-xs text-on-surface font-semibold hover:text-amber-gold transition-colors" title="Customize Game Mode" id="btn-tune-deck">
                <span class="material-symbols-outlined text-[15px]">tune</span>
                <span>Change</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Player Roster Grid -->
      <section class="mb-5">
        <div class="flex items-center justify-between mb-2 px-1">
          <div class="flex items-center gap-1.5">
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Campers</h3>
            <span class="font-caption text-caption bg-surface-container px-2.5 py-0.5 rounded-full text-secondary font-mono">${room.players.length} / 8</span>
          </div>
          <span class="font-caption text-caption text-tertiary flex items-center gap-1.5 font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Ready to Fire
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2" id="lobby-player-grid">
          ${room.players.map((p, index) => {
            const isHost = p.role === 'HOST';
            const isCurrentUser = isHost || p.name === 'Host (You)';
            const displayName = isCurrentUser ? (user && user.isLoggedIn && user.displayName ? `${user.displayName.split(' ')[0]} (Host)` : 'You (Host)') : p.name;
            const avatar = isCurrentUser && user && user.avatarUrl ? user.avatarUrl : (p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`);

            return `
              <div class="bg-surface-container rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden shadow-md border border-border/80">
                <div class="flex items-center justify-between">
                  ${isHost ? `
                    <span class="inline-flex items-center gap-1 bg-secondary/15 text-secondary px-1.5 py-0.5 rounded font-caption text-caption font-semibold">
                      <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">crown</span> HOST
                    </span>
                  ` : `
                    <span class="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-caption text-caption">#0${index + 1}</span>
                  `}
                  <span class="w-2 h-2 rounded-full ${p.isReady ? 'bg-tertiary' : 'bg-secondary animate-pulse'}"></span>
                </div>
                <div class="flex items-center gap-2.5">
                  <div class="w-11 h-11 rounded-xl overflow-hidden bg-surface-container-high flex-shrink-0 shadow-inner flex items-center justify-center">
                    <img class="w-full h-full object-cover" alt="${displayName}" src="${avatar}" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}'" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-label-lg text-label-lg text-on-surface block truncate font-bold">${displayName}</span>
                    <span class="font-caption text-caption ${p.isReady ? 'text-tertiary' : 'text-secondary'} block font-bold">${p.isReady ? 'READY ✨' : 'SYNCING...'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}

          <!-- Slot 7: Invite Camper -->
          <button class="bg-surface-container-low hover:bg-surface-container rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center min-h-[92px] transition-colors active:scale-95 group border border-dashed border-border" id="slot-invite-player" type="button">
            <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <span class="font-label-md text-label-md text-on-surface-variant font-semibold">Invite Camper</span>
          </button>

          <!-- Slot 8: Share Pass -->
          <button class="bg-surface-container-low hover:bg-surface-container rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center min-h-[92px] transition-colors active:scale-95 group border border-dashed border-border" id="slot-share-pass" type="button">
            <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[20px]">qr_code_2</span>
            </div>
            <span class="font-label-md text-label-md text-on-surface-variant font-semibold">Share Pass</span>
          </button>
        </div>
      </section>

      <!-- Drop a Memory Micro-Uploader Bento Slab -->
      <section class="mb-5">
        <div class="bg-surface-container rounded-2xl p-5 relative overflow-hidden shadow-lg border border-border/80">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container flex-shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">add_photo_alternate</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <h4 class="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                Secret Memory Drop
              </h4>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Drop 1 screenshot or photo to roast or test someone tonight. Sealed until round 2!
              </p>
            </div>
          </div>

          <!-- Polaroid Upload Preview Slab -->
          <div class="mt-4 bg-surface-container-lowest rounded-xl p-2 flex items-center justify-between gap-3 border border-border/60">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-high relative flex-shrink-0 shadow">
                <img class="w-full h-full object-cover filter blur-[2px]" alt="Sealed memory" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwqep1yJ8phmXEVa2tFNOjpjX3GDmGGCBwmpIgD9r36e79eJRKiSgUDoLZOTR1G_TAyyBTiKz19DIxiSoB9uzUbCJiWkv4tf3agGw1Qh0lNTUBXyk0F-s1dQZ5HvW4JPCeXxxBgCiuy31OSwZd2P4wEgqZcYG1qwB_7gTxBpZp-mh4P24LuSlYmEvUQPL6OhxFA0aZcJ76vy-ug49xaOm0Qh8I9Hv87Ob7rLOj66bzGHM-_HHlY477Kw" />
                <div class="absolute inset-0 bg-surface-container-lowest/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary text-[20px]" style="font-variation-settings: 'FILL' 1;">lock</span>
                </div>
              </div>
              <div class="min-w-0">
                <span class="font-label-md text-label-md text-secondary-fixed block truncate font-bold">1 Memory Sealed 🔒</span>
                <span class="font-caption text-caption text-tertiary block mt-0.5">Encrypted to this session</span>
              </div>
            </div>
            <button class="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors active:scale-95 flex-shrink-0 border border-border/70" id="btn-lobby-upload" type="button">
              Swap
            </button>
          </div>

          <div class="flex items-center justify-between mt-3 pt-2 text-xs">
            <span class="font-caption text-caption text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">shield</span> Private to Goa Pod
            </span>
            <span class="font-caption text-caption text-secondary font-semibold">Ready for ignition</span>
          </div>
        </div>
      </section>

      <!-- Fixed Bottom Command Bar -->
      <aside class="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl border-t border-border/80">
        <div class="flex flex-col gap-1.5 max-w-[620px] mx-auto">
          <div class="flex items-center justify-between px-1 text-xs">
            <span class="font-caption text-caption text-on-surface-variant flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> ${hostName} controls countdown
            </span>
            <span class="font-caption text-caption text-secondary font-bold">${room.players.length}/${room.players.length} CAMPERS READY</span>
          </div>
          <button class="w-full bg-primary-container text-on-primary-container py-3.5 px-6 rounded-full font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-[0px_8px_24px_-4px_rgba(255,90,95,0.45)] hover:brightness-110 active:scale-98 transition-all font-bold" id="start-game-btn" type="button">
            <span>IGNITE BONDFIRE (6/6)</span>
            <span class="material-symbols-outlined text-[24px]">local_fire_department</span>
          </button>
        </div>
      </aside>

      <!-- Copy Toast Notification -->
      <div class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-tertiary text-on-tertiary px-4 py-2 rounded-full font-label-md text-label-md shadow-lg flex items-center gap-2 pointer-events-none opacity-0 transition-opacity duration-300" id="toast">
        <span class="material-symbols-outlined text-[16px]">check_circle</span>
        <span>Room Code "${room.roomCode}" Copied!</span>
      </div>

      <!-- Invite Friends Modal with QR Code -->
      <div id="invite-modal" class="fixed inset-0 bg-canvas/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="max-w-md w-full rounded-2xl bg-surface-container p-6 border border-border shadow-2xl text-center">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-headline-sm text-headline-sm text-sunset-coral font-bold flex items-center gap-2">
              <span>🎟️</span> Invite Squad to ${room.roomCode}
            </h3>
            <button class="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-white" id="btn-close-invite-modal">✕</button>
          </div>

          <div class="bg-white p-4 rounded-xl w-44 h-44 mx-auto mb-4 flex flex-col items-center justify-center shadow-lg">
            <div class="font-room-code text-3xl font-extrabold text-black tracking-widest">${room.roomCode}</div>
            <div class="text-[10px] font-bold text-gray-600 uppercase mt-1">Scan to Join</div>
            <div class="text-[8px] text-gray-500 mt-1">bondfire.app/join/${room.roomCode}</div>
          </div>

          <p class="text-xs text-gray-400 mb-4">
            Friends join instantly on mobile web. Zero app download, zero signup required.
          </p>

          <div class="flex flex-col gap-2.5">
            <button class="w-full py-3 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-sm flex items-center justify-center gap-2 shadow-glow-coral hover:brightness-110 transition-all active:scale-95" id="btn-invite-from-friends" type="button">
              <span class="material-symbols-outlined text-[18px]">diversity_3</span>
              <span>Invite from Friends & Squads</span>
            </button>
            <button class="w-full py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 shadow hover:brightness-105 transition-all" id="btn-share-whatsapp" type="button">
              <span>💬</span> Share to WhatsApp Group
            </button>
            <button class="w-full py-2.5 rounded-full bg-surface-bright text-white font-bold text-sm" id="btn-copy-link-modal" type="button">
              📋 Copy Room Link
            </button>
          </div>
        </div>
      </div>

      <!-- Game Mode & Deck Selector Modal -->
      <div id="deck-modal" class="fixed inset-0 bg-canvas/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="max-w-lg w-full rounded-2xl bg-surface-container p-5 sm:p-6 border border-border shadow-2xl">
          <div class="flex justify-between items-center pb-3 mb-4 border-b border-border/80">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🎮</span>
              <div>
                <h3 class="font-headline-sm text-base sm:text-lg text-white font-bold">Select Squad Party Game</h3>
                <p class="text-xs text-on-surface-variant">Choose the vibe for tonight's pod session</p>
              </div>
            </div>
            <button class="w-8 h-8 rounded-full bg-surface-bright hover:bg-surface-container-high flex items-center justify-center text-white" id="btn-close-deck-modal">✕</button>
          </div>

          <div class="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            ${GAME_MODES.map((mode) => {
              const isSelected = mode.id === (room.selectedGameMode || 'RED_FLAG_COURT');
              return `
                <button class="btn-select-deck text-left p-3.5 rounded-xl border ${isSelected ? 'bg-primary-container/15 border-sunset-coral shadow-glow-coral' : 'bg-surface-container-lowest/80 border-border/70 hover:border-border hover:bg-surface-container-high'} transition-all active:scale-[0.99] flex items-start gap-3 group cursor-pointer" data-mode="${mode.id}">
                  <span class="text-2xl shrink-0 mt-0.5">${mode.emoji}</span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="font-headline-sm text-sm font-bold text-white group-hover:text-sunset-coral transition-colors">${mode.name}</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${isSelected ? 'bg-sunset-coral text-canvas' : 'bg-surface-container-high text-gray-400'}">${mode.badgeText}</span>
                    </div>
                    <p class="text-xs text-amber-gold/90 font-medium mb-1">${mode.tagline}</p>
                    <p class="text-[11px] text-gray-400 leading-relaxed">${mode.description}</p>
                  </div>
                  <div class="shrink-0 mt-1">
                    <span class="material-symbols-outlined text-[18px] ${isSelected ? 'text-sunset-coral' : 'text-gray-600'}">${isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindLobbyEvents() {
  const codeBtn = document.getElementById('copy-code-btn');
  const copyIcon = document.getElementById('copy-icon');
  const toast = document.getElementById('toast');

  const copyRoomCode = () => {
    audio.playClick();
    const code = store.getState().activeRoom.roomCode;
    navigator.clipboard?.writeText(code);
    if (copyIcon) copyIcon.textContent = 'done';
    if (toast) {
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        if (copyIcon) copyIcon.textContent = 'content_copy';
      }, 2000);
    }
  };

  if (codeBtn) {
    codeBtn.addEventListener('click', copyRoomCode);
  }

  // Leave Room
  const leaveBtn = document.getElementById('btn-leave-lobby');
  if (leaveBtn) {
    leaveBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('HERO');
    });
  }

  // Start Countdown and Ignite Game
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      audio.playChime();
      startBtn.innerHTML = '<span>IGNITING POD... 3</span><span class="material-symbols-outlined text-[24px] animate-spin">rotate_right</span>';
      startBtn.classList.add('brightness-125');
      let count = 2;
      const interval = setInterval(() => {
        if (count > 0) {
          audio.playTick();
          startBtn.innerHTML = `<span>IGNITING POD... ${count}</span><span class="material-symbols-outlined text-[24px] animate-spin">rotate_right</span>`;
          count--;
        } else {
          clearInterval(interval);
          audio.playCorrect();
          startBtn.innerHTML = '<span>DEALING CARDS! 🔥</span>';
          setTimeout(() => {
            store.setState({
              activeGame: {
                sessionId: `game_${Date.now()}`,
                roundIndex: 1,
                totalRounds: 5,
                score: 0,
                selectedOption: null,
                isAnswerRevealed: false,
                timeRemaining: 20,
              },
            });
            store.setView('GAME');
          }, 600);
        }
      }, 700);
    });
  }

  // Upload memory placeholder
  const uploadBtn = document.getElementById('btn-lobby-upload');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('VAULT');
    });
  }

  // Invite Modal Logic
  const inviteSlot = document.getElementById('slot-invite-player');
  const sharePassSlot = document.getElementById('slot-share-pass');
  const inviteModal = document.getElementById('invite-modal');
  const closeInviteBtn = document.getElementById('btn-close-invite-modal');
  const copyLinkModalBtn = document.getElementById('btn-copy-link-modal');
  const whatsappBtn = document.getElementById('btn-share-whatsapp');

  const openInvite = () => {
    audio.playClick();
    if (inviteModal) inviteModal.style.display = 'flex';
  };

  if (inviteSlot) inviteSlot.addEventListener('click', openInvite);
  if (sharePassSlot) sharePassSlot.addEventListener('click', openInvite);

  if (closeInviteBtn && inviteModal) {
    closeInviteBtn.addEventListener('click', () => {
      audio.playClick();
      inviteModal.style.display = 'none';
    });
  }

  const inviteFriendsBtn = document.getElementById('btn-invite-from-friends');
  if (inviteFriendsBtn) {
    inviteFriendsBtn.addEventListener('click', () => {
      audio.playClick();
      if (inviteModal) inviteModal.style.display = 'none';
      store.setView('FRIENDS');
    });
  }

  if (copyLinkModalBtn) {
    copyLinkModalBtn.addEventListener('click', () => {
      audio.playClick();
      const code = store.getState().activeRoom.roomCode;
      navigator.clipboard?.writeText(`https://bondfire.app/join/${code}`);
      copyLinkModalBtn.textContent = '✓ Link Copied!';
      setTimeout(() => (copyLinkModalBtn.textContent = '📋 Copy Room Link'), 2000);
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      audio.playClick();
      const code = store.getState().activeRoom.roomCode;
      const text = encodeURIComponent(`Come roast and remember with code ${code} on Bondfire!\nhttps://bondfire.app/join/${code}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  // Deck & Game Mode Selection Logic
  const deckModal = document.getElementById('deck-modal');
  const tuneDeckBtn = document.getElementById('btn-tune-deck');
  const deckTrigger = document.getElementById('btn-active-deck-trigger');
  const closeDeckBtn = document.getElementById('btn-close-deck-modal');

  const openDeckModal = () => {
    audio.playClick();
    if (deckModal) deckModal.style.display = 'flex';
  };

  if (tuneDeckBtn) tuneDeckBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDeckModal();
  });
  if (deckTrigger) deckTrigger.addEventListener('click', openDeckModal);

  if (closeDeckBtn && deckModal) {
    closeDeckBtn.addEventListener('click', () => {
      audio.playClick();
      deckModal.style.display = 'none';
    });
  }

  const deckBtns = document.querySelectorAll('.btn-select-deck');
  deckBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const mode = btn.dataset.mode;
      store.setGameMode(mode);
      if (deckModal) deckModal.style.display = 'none';
      store.setView('LOBBY');
    });
  });
}
