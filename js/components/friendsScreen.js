// ==============================================================================
// FRIENDS & SQUADS LOUNGE COMPONENT (Screen 6)
// Social Hub: Online Campers, 1-Click Pod Invites, Sparks Gifting, Squad Circles
// Matches Google Stitch Warm Analog Cyber Design System
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { generateRoomCode } from '../config.js';

let activeFilter = 'ALL'; // 'ALL' | 'ONLINE' | 'IN_GAME'
let activeTab = 'CAMPERS'; // 'CAMPERS' | 'SQUADS' | 'DISCOVER'

export function renderFriendsScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const friends = state.friendsList || [];
  const squads = state.squadsList || [];
  const requests = state.friendRequests?.incoming || [];

  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName : 'Guest Citizen';
  const userHandle = (user && user.email) ? `@${user.email.split('@')[0]}` : '@citizen_you';
  const citizenId = `#BF-${(user && user.id ? user.id.slice(-4) : '8842').toUpperCase()}`;

  const onlineCount = friends.filter((f) => f.status === 'ONLINE' || f.status === 'IN_GAME').length;
  const inGameCount = friends.filter((f) => f.status === 'IN_GAME').length;

  const filteredFriends = friends.filter((f) => {
    if (activeFilter === 'ONLINE') return f.status === 'ONLINE' || f.status === 'IN_GAME';
    if (activeFilter === 'IN_GAME') return f.status === 'IN_GAME';
    return true;
  });

  return `
    <div class="flex flex-col w-full max-w-5xl mx-auto px-4 py-6 pb-28 select-none text-on-surface">
      <!-- Atmospheric Ambient Glow -->
      <div class="absolute top-12 left-1/3 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div class="absolute top-96 right-10 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Header & Identity Bento Slab -->
      <div class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-container-low border border-border/80 shadow-2xl mb-6 relative overflow-hidden">
        <div class="absolute -right-16 -bottom-16 w-48 h-48 bg-gradient-to-tl from-sunset-coral/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center gap-4 min-w-0">
          <div class="w-14 h-14 rounded-2xl bg-surface-container-high border-2 border-sunset-coral/40 flex items-center justify-center text-sunset-coral shrink-0 shadow-lg relative overflow-hidden">
            <span class="material-symbols-outlined text-[30px]" style="font-variation-settings: 'FILL' 1;">diversity_3</span>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="font-headline-md text-headline-md font-bold text-white tracking-tight">${userName}'s Squad Lounge</h1>
              <span class="px-2.5 py-0.5 rounded-full bg-mint-green/10 text-mint-green font-mono text-[11px] font-bold border border-mint-green/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
                ${onlineCount} Campers Active
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
              <span class="text-amber-gold font-bold">${userHandle}</span>
              <span>•</span>
              <span class="text-gray-300">ID: ${citizenId}</span>
              <span>•</span>
              <span class="text-sunset-coral flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
                ${user.sparks || 120} Sparks
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Social Actions -->
        <div class="flex items-center gap-2.5 w-full md:w-auto">
          <button id="btn-share-citizen-link" class="flex-1 md:flex-none px-4 py-2.5 rounded-full bg-surface border border-border/80 hover:border-sunset-coral/60 text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm" type="button">
            <span class="material-symbols-outlined text-[16px] text-sunset-coral">share</span>
            <span id="share-link-label">Share Pass</span>
          </button>
          <button id="btn-open-add-camper-modal" class="flex-1 md:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-glow-coral transition-transform active:scale-95 flex items-center justify-center gap-2" type="button">
            <span class="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ Add Camper</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs Strip -->
      <div class="flex items-center justify-between gap-2 border-b border-border/70 pb-3 mb-6 flex-wrap">
        <div class="flex items-center gap-2">
          <button class="friends-nav-tab px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'CAMPERS' ? 'bg-surface-bright text-white shadow-sm border border-sunset-coral/40' : 'text-gray-400 hover:text-white'}" data-tab="CAMPERS" type="button">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">group</span>
              <span>My Campers</span>
              <span class="px-2 py-0.2 rounded-full bg-surface text-[10px] font-mono text-amber-gold font-bold ml-1">${friends.length}</span>
            </span>
          </button>

          <button class="friends-nav-tab px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'SQUADS' ? 'bg-surface-bright text-white shadow-sm border border-sunset-coral/40' : 'text-gray-400 hover:text-white'}" data-tab="SQUADS" type="button">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">diversity_2</span>
              <span>Pod Squads</span>
              <span class="px-2 py-0.2 rounded-full bg-surface text-[10px] font-mono text-tertiary font-bold ml-1">${squads.length}</span>
            </span>
          </button>

          <button class="friends-nav-tab px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'DISCOVER' ? 'bg-surface-bright text-white shadow-sm border border-sunset-coral/40' : 'text-gray-400 hover:text-white'}" data-tab="DISCOVER" type="button">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">explore</span>
              <span>Requests & Discover</span>
              ${requests.length > 0 ? `<span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>` : ''}
            </span>
          </button>
        </div>

        <!-- Filter Sub-Pills (Visible when in Campers Tab) -->
        ${activeTab === 'CAMPERS' ? `
          <div class="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-full border border-border/60 text-xs">
            <button class="camper-filter-btn px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeFilter === 'ALL' ? 'bg-sunset-coral text-canvas' : 'text-gray-400 hover:text-white'}" data-filter="ALL">All</button>
            <button class="camper-filter-btn px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeFilter === 'ONLINE' ? 'bg-mint-green text-canvas' : 'text-gray-400 hover:text-white'}" data-filter="ONLINE">Online (${onlineCount})</button>
            <button class="camper-filter-btn px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeFilter === 'IN_GAME' ? 'bg-tertiary text-canvas' : 'text-gray-400 hover:text-white'}" data-filter="IN_GAME">In Room (${inGameCount})</button>
          </div>
        ` : ''}
      </div>

      <!-- MAIN CONTENT STAGE -->
      <div id="friends-stage-container">
        ${activeTab === 'CAMPERS' ? renderCampersRoster(filteredFriends) : ''}
        ${activeTab === 'SQUADS' ? renderSquadsList(squads) : ''}
        ${activeTab === 'DISCOVER' ? renderDiscoverTab(requests, citizenId, userHandle) : ''}
      </div>

      <!-- Add Camper Modal Container (Rendered dynamically) -->
      <div id="add-camper-modal-mount"></div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// TAB 1: CAMPERS ROSTER VIEW
// ------------------------------------------------------------------------------
function renderCampersRoster(friends) {
  if (!friends || friends.length === 0) {
    return `
      <div class="p-12 text-center rounded-3xl bg-surface-container-low border border-border flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-[48px] text-gray-500 mb-3">person_off</span>
        <h3 class="font-headline-sm text-headline-sm font-bold text-white mb-1">No Campers Found</h3>
        <p class="text-xs text-gray-400 max-w-xs mb-4">You haven't added anyone matching this filter yet. Invite your group chat crew!</p>
        <button id="btn-empty-invite" class="px-5 py-2.5 rounded-full bg-sunset-coral text-canvas font-bold text-xs shadow-glow-coral">
          + Add First Camper
        </button>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      ${friends.map((friend) => {
        const isLive = friend.status === 'IN_GAME';
        const isOnline = friend.status === 'ONLINE' || isLive;

        return `
          <div class="p-4 rounded-2xl bg-surface-container-low border border-border/80 hover:border-sunset-coral/50 transition-all shadow-md flex flex-col justify-between gap-3 group relative overflow-hidden">
            ${isLive ? `<div class="absolute top-0 right-0 w-24 h-24 bg-mint-green/5 rounded-full blur-xl pointer-events-none"></div>` : ''}

            <!-- Card Header: Avatar & Identity -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="relative w-12 h-12 rounded-xl bg-surface-container-high border border-border overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                  <img src="${friend.avatarUrl}" alt="${friend.name}" class="w-full h-full object-cover" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(friend.name)}'" />
                  <span class="w-3 h-3 rounded-full border-2 border-surface-container-low absolute -bottom-0.5 -right-0.5 ${isLive ? 'bg-mint-green animate-ping' : isOnline ? 'bg-mint-green' : 'bg-gray-600'}" title="${friend.status}"></span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-label-lg text-label-lg font-bold text-white truncate">${friend.name}</span>
                    ${isLive ? `
                      <span class="px-1.5 py-0.2 rounded bg-mint-green/20 text-mint-green text-[10px] font-mono font-bold tracking-tight">LIVE</span>
                    ` : ''}
                  </div>
                  <div class="text-[11px] text-gray-400 font-mono flex items-center gap-1.5 truncate">
                    <span>@${friend.username}</span>
                    <span>•</span>
                    <span class="text-amber-gold">${friend.role || 'Camper'}</span>
                  </div>
                </div>
              </div>

              <!-- Spark Karma Metric -->
              <div class="text-right shrink-0">
                <div class="font-mono text-xs font-extrabold text-amber-gold flex items-center justify-end gap-1">
                  <span>${friend.sparks}</span>
                  <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
                </div>
                <div class="text-[10px] text-gray-500 font-mono">${friend.mutualGames} games</div>
              </div>
            </div>

            <!-- Context Status Banner -->
            <div class="p-2.5 rounded-xl bg-surface border border-border/50 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 truncate">
                <span class="material-symbols-outlined text-[16px] ${isLive ? 'text-mint-green' : isOnline ? 'text-amber-gold' : 'text-gray-500'}">
                  ${isLive ? 'videogame_asset' : isOnline ? 'schedule' : 'history'}
                </span>
                <span class="text-gray-300 font-medium truncate">
                  ${isLive ? `Playing in Pod #${friend.currentRoom || store.getState().activeRoom.roomCode}` : friend.lastActive}
                </span>
              </div>

              <!-- Sparks Gifting Action -->
              <button class="btn-gift-sparks px-2.5 py-1 rounded-full bg-surface-bright hover:bg-amber-gold hover:text-canvas text-amber-gold text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 ${friend.giftedToday ? 'opacity-50 pointer-events-none' : ''}" data-id="${friend.id}" data-name="${friend.name}" type="button" title="Gift 20 Sparks">
                <span class="material-symbols-outlined text-[13px]">volunteer_activism</span>
                <span>${friend.giftedToday ? 'Gifted' : '+20 Sparks'}</span>
              </button>
            </div>

            <!-- Card Bottom Quick Action Suite -->
            <div class="flex items-center gap-2 pt-1 border-t border-border/40">
              ${isLive ? `
                <button class="btn-join-friend-room flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5" data-room="${friend.currentRoom || store.getState().activeRoom.roomCode}" type="button">
                  <span class="material-symbols-outlined text-[16px]">meeting_room</span>
                  <span>Join Room #${friend.currentRoom || store.getState().activeRoom.roomCode}</span>
                </button>
              ` : `
                <button class="btn-invite-friend-room flex-1 py-2 px-3 rounded-xl bg-surface-bright hover:bg-sunset-coral hover:text-white text-gray-200 font-bold text-xs border border-border/80 transition-all active:scale-95 flex items-center justify-center gap-1.5" data-id="${friend.id}" data-name="${friend.name}" type="button">
                  <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
                  <span>Invite to Pod</span>
                </button>
              `}
              <button class="btn-duel-friend py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-bright text-gray-300 hover:text-white text-xs font-semibold border border-border/60 transition-colors active:scale-95 flex items-center gap-1" data-id="${friend.id}" data-name="${friend.name}" title="Challenge to 1v1 Memory Duel" type="button">
                <span class="material-symbols-outlined text-[15px] text-amber-gold">bolt</span>
                <span>Duel</span>
              </button>
              <button class="btn-remove-friend p-2 rounded-xl bg-surface hover:bg-rose-950/40 text-gray-500 hover:text-sunset-coral text-xs transition-colors" data-id="${friend.id}" title="Remove Friend" type="button">
                <span class="material-symbols-outlined text-[16px]">person_remove</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ------------------------------------------------------------------------------
// TAB 2: POD SQUADS (CIRCLES) VIEW
// ------------------------------------------------------------------------------
function renderSquadsList(squads) {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-headline-sm text-headline-sm font-bold text-white">Your Saved Circles</h2>
          <p class="text-xs text-gray-400">Squads sync their private WhatsApp screenshots and inside joke decks automatically.</p>
        </div>
        <button id="btn-create-new-squad" class="px-4 py-2 rounded-full bg-surface-bright hover:bg-sunset-coral hover:text-white text-xs font-bold text-gray-200 border border-border transition-all active:scale-95 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">group_add</span>
          <span>+ New Squad Circle</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${squads.map((sq) => `
          <div class="p-5 rounded-3xl bg-surface-container-low border border-border hover:border-amber-gold/50 transition-all shadow-lg flex flex-col justify-between gap-4 relative overflow-hidden group">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-2xl border border-border/60 shadow-inner">
                ${sq.emoji}
              </div>
              ${sq.activeRoomCode ? `
                <span class="px-2.5 py-1 rounded-full bg-mint-green/10 border border-mint-green/30 text-mint-green text-[11px] font-mono font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-ping"></span>
                  Lobby #${sq.activeRoomCode}
                </span>
              ` : `
                <span class="px-2 py-0.5 rounded-md bg-surface text-gray-400 text-[10px] font-mono font-bold">SAVED</span>
              `}
            </div>

            <div>
              <h3 class="font-headline-sm text-base font-bold text-white mb-1 group-hover:text-sunset-coral transition-colors">${sq.name}</h3>
              <div class="text-xs text-gray-400 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px] text-tertiary">videogame_asset</span>
                <span class="truncate">${sq.deckName}</span>
              </div>
            </div>

            <!-- Member Avatars Row -->
            <div class="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <div class="flex items-center -space-x-2">
                <div class="w-7 h-7 rounded-full bg-sunset-coral text-canvas flex items-center justify-center font-bold text-[10px] border-2 border-surface-container-low">YOU</div>
                <div class="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px] border-2 border-surface-container-low">LM</div>
                <div class="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-[10px] border-2 border-surface-container-low">SC</div>
                <div class="w-7 h-7 rounded-full bg-surface-bright text-gray-300 flex items-center justify-center font-bold text-[10px] border-2 border-surface-container-low">+${sq.membersCount - 1}</div>
              </div>
              <span class="text-gray-400 font-mono text-[11px]">${sq.membersCount} Campers</span>
            </div>

            <!-- Squad Ignition Button -->
            <button class="btn-ignite-squad w-full py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold hover:brightness-110 text-canvas font-bold text-xs shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2" data-squad="${sq.name}" data-code="${sq.activeRoomCode || generateRoomCode()}" type="button">
              <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>Ignite Squad Pod</span>
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// TAB 3: DISCOVER & FRIEND REQUESTS VIEW
// ------------------------------------------------------------------------------
function renderDiscoverTab(requests, citizenId, userHandle) {
  return `
    <div class="flex flex-col gap-6">
      <!-- Search & Add Bar -->
      <div class="p-6 rounded-3xl bg-surface-container-low border border-border/80 shadow-lg">
        <h3 class="font-headline-sm text-headline-sm font-bold text-white mb-1">Add Camper by Citizen ID</h3>
        <p class="text-xs text-gray-400 mb-4">Enter your friend's handle (e.g. <code class="text-amber-gold font-mono">@alex_r</code>) or Citizen Passcode.</p>

        <form id="form-search-camper" class="flex items-center gap-2">
          <div class="relative flex-1">
            <span class="material-symbols-outlined absolute left-3.5 top-3 text-gray-400 text-[18px]">search</span>
            <input type="text" id="input-camper-query" placeholder="e.g. @devon_v or #BF-9428" required class="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface border border-border/80 focus:border-sunset-coral text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors font-mono" />
          </div>
          <button type="submit" class="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-sunset-coral/90 text-white font-bold text-xs shadow-glow-coral active:scale-95 transition-transform flex items-center gap-1.5 shrink-0">
            <span class="material-symbols-outlined text-[16px]">send</span>
            <span>Send Request</span>
          </button>
        </form>
      </div>

      <!-- Incoming Requests Slab -->
      <div class="p-6 rounded-3xl bg-surface-container-low border border-border/80 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="font-headline-sm text-headline-sm font-bold text-white">Pending Requests</h3>
            <span class="px-2 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral text-xs font-mono font-bold">${requests.length}</span>
          </div>
          <span class="text-xs text-gray-500 font-mono">Realtime Sync</span>
        </div>

        ${requests.length === 0 ? `
          <div class="py-6 text-center text-xs text-gray-400">
            No incoming friend requests at the moment. Share your link below!
          </div>
        ` : `
          <div class="flex flex-col gap-2.5">
            ${requests.map((req) => `
              <div class="p-3.5 rounded-2xl bg-surface border border-border/70 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-surface-container overflow-hidden shrink-0">
                    <img src="${req.avatarUrl}" alt="${req.name}" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-sm text-white truncate">${req.name}</div>
                    <div class="text-[11px] text-gray-400 font-mono">@${req.username} · ${req.mutualFriends} mutual friends · ${req.time}</div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button class="btn-accept-request px-4 py-1.5 rounded-full bg-mint-green hover:bg-mint-green/90 text-canvas text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow" data-id="${req.id}">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                    <span>Accept</span>
                  </button>
                  <button class="btn-decline-request px-3 py-1.5 rounded-full bg-surface-bright text-gray-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center" data-id="${req.id}">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Campers You Recently Played With (Real People Only) -->
      <div class="p-6 rounded-3xl bg-surface-container-low border border-border/80 shadow-lg">
        <h3 class="font-headline-sm text-headline-sm font-bold text-white mb-1">Campers You Recently Played With</h3>
        <p class="text-xs text-gray-400 mb-4">Real people who joined your room lobbies or campfire sessions.</p>

        ${(() => {
          const currentUserName = (state.currentUser && state.currentUser.displayName) ? state.currentUser.displayName : 'Host';
          const existingFriendNames = new Set((state.friendsList || []).map((f) => (f.name || '').toLowerCase()));
          const roomCampers = (state.activeRoom?.players || []).filter((p) =>
            !p.isBot &&
            p.name !== currentUserName &&
            !p.name.includes('(Host)') &&
            !p.name.includes('(You)') &&
            !existingFriendNames.has((p.name || '').toLowerCase())
          );

          if (roomCampers.length === 0) {
            return `
              <div class="p-6 rounded-2xl bg-surface border border-dashed border-border/80 text-center">
                <span class="material-symbols-outlined text-2xl text-sunset-coral mb-2">groups</span>
                <div class="font-bold text-sm text-white mb-1">No Recent Campers Yet</div>
                <p class="text-xs text-gray-400 max-w-sm mx-auto mb-3">Real people who join your room lobbies via code or link will appear here so you can add them to your squad list.</p>
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-bright text-xs font-mono text-amber-gold border border-amber-gold/30">
                  <span>Room Code: #${state.activeRoom?.roomCode || 'BONDFIRE'}</span>
                </div>
              </div>
            `;
          }

          return `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              ${roomCampers.map((p) => `
                <div class="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-9 h-9 rounded-lg bg-surface-bright overflow-hidden shrink-0">
                      <img src="${p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`}" alt="${p.name}" class="w-full h-full object-cover" />
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-xs text-white truncate">${p.name}</div>
                      <div class="text-[10px] text-gray-500 font-mono">Real Room Camper</div>
                    </div>
                  </div>
                  <button class="btn-quick-add-recent px-3 py-1 rounded-full bg-sunset-coral text-canvas text-[11px] font-bold active:scale-95 shrink-0" data-name="${p.name}" data-user="${p.name.toLowerCase().replace(/\s+/g, '_')}">
                    + Add
                  </button>
                </div>
              `).join('')}
            </div>
          `;
        })()}
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// EVENT BINDINGS FOR FRIENDS SCREEN
// ------------------------------------------------------------------------------
export function bindFriendsEvents() {
  // Navigation Tabs
  const navTabs = document.querySelectorAll('.friends-nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      audio.playClick();
      activeTab = tab.dataset.tab;
      store.setView('FRIENDS');
    });
  });

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.camper-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      activeFilter = btn.dataset.filter;
      store.setView('FRIENDS');
    });
  });

  // Share Friend Pass Link
  const shareBtn = document.getElementById('btn-share-citizen-link');
  const shareLabel = document.getElementById('share-link-label');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      audio.playChime();
      const code = store.getState().currentUser?.id ? store.getState().currentUser.id.slice(-4).toUpperCase() : '8842';
      const url = `https://bondfire.app/u/BF-${code}`;
      navigator.clipboard?.writeText(url);
      if (shareLabel) {
        shareLabel.textContent = 'Copied Link!';
        setTimeout(() => (shareLabel.textContent = 'Share Pass'), 2000);
      }
    });
  }

  // Gift Sparks Button
  const giftBtns = document.querySelectorAll('.btn-gift-sparks');
  giftBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playCorrect();
      const friendId = btn.dataset.id;
      const friendName = btn.dataset.name;
      store.sendSparkGift(friendId);
      btn.innerHTML = '<span>Gifted</span>';
      btn.classList.add('opacity-50', 'pointer-events-none');

      // Toast feedback
      const toastMount = document.getElementById('toast-mount');
      if (toastMount) {
        toastMount.innerHTML = `<div class="toast toast-mint show"><span class="material-symbols-outlined text-sm text-mint-green mr-1 align-middle">auto_awesome</span><span>+20 Sparks sent to ${friendName}! You gained +5 Karma Sparks!</span></div>`;
        setTimeout(() => (toastMount.innerHTML = ''), 3000);
      }
    });
  });

  // Join Room from Friend
  const joinBtns = document.querySelectorAll('.btn-join-friend-room');
  joinBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomCode = btn.dataset.room || store.getState().activeRoom?.roomCode || generateRoomCode();
      audio.playChime();
      store.setRoomCode(roomCode);
      store.setView('LOBBY');
    });
  });

  // Invite Friend to Room
  const inviteBtns = document.querySelectorAll('.btn-invite-friend-room');
  inviteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const friendName = btn.dataset.name;
      const currentCode = store.getState().activeRoom?.roomCode || generateRoomCode();
      const toastMount = document.getElementById('toast-mount');
      if (toastMount) {
        toastMount.innerHTML = `<div class="toast toast-amber show"><span class="material-symbols-outlined text-sm text-amber-gold mr-1 align-middle">confirmation_number</span><span>Room #${currentCode} invite dispatched to ${friendName}!</span></div>`;
        setTimeout(() => (toastMount.innerHTML = ''), 3000);
      }
    });
  });

  // Challenge to Duel
  const duelBtns = document.querySelectorAll('.btn-duel-friend');
  duelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playTick();
      const friendName = btn.dataset.name;
      const toastMount = document.getElementById('toast-mount');
      if (toastMount) {
        toastMount.innerHTML = `<div class="toast toast-coral show"><span class="material-symbols-outlined text-sm text-sunset-coral mr-1 align-middle">bolt</span><span>1v1 Memory Duel request fired to ${friendName}!</span></div>`;
        setTimeout(() => (toastMount.innerHTML = ''), 3000);
      }
    });
  });

  // Remove Friend
  const removeBtns = document.querySelectorAll('.btn-remove-friend');
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const friendId = btn.dataset.id;
      store.removeFriend(friendId);
      store.setView('FRIENDS');
    });
  });

  // Ignite Squad
  const igniteBtns = document.querySelectorAll('.btn-ignite-squad');
  igniteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const squadName = btn.dataset.squad;
      const code = btn.dataset.code || generateRoomCode();
      const currentRoom = store.getState().activeRoom;
      store.setState({
        activeRoom: {
          ...currentRoom,
          roomCode: code,
          podName: squadName,
        },
      });
      store.setView('LOBBY');
    });
  });

  // Accept Request
  const acceptBtns = document.querySelectorAll('.btn-accept-request');
  acceptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      const reqId = btn.dataset.id;
      store.acceptFriendRequest(reqId);
      store.setView('FRIENDS');
    });
  });

  // Decline Request
  const declineBtns = document.querySelectorAll('.btn-decline-request');
  declineBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const reqId = btn.dataset.id;
      store.declineFriendRequest(reqId);
      store.setView('FRIENDS');
    });
  });

  // Quick Add from Recent
  const quickAddBtns = document.querySelectorAll('.btn-quick-add-recent');
  quickAddBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      const name = btn.dataset.name;
      const user = btn.dataset.user;
      store.addFriend({
        id: `fr_${Date.now()}`,
        name,
        username: user,
        status: 'ONLINE',
        currentRoom: null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        sparks: 120,
        mutualGames: 2,
        role: 'Camper',
        lastActive: 'Just now',
      });
      btn.textContent = 'Added';
      btn.classList.add('opacity-60', 'pointer-events-none');
    });
  });

  // Search Camper Form Submit
  const searchForm = document.getElementById('form-search-camper');
  const searchInput = document.getElementById('input-camper-query');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        audio.playChime();
        store.sendFriendRequest(query);
        searchInput.value = '';
        const toastMount = document.getElementById('toast-mount');
        if (toastMount) {
          toastMount.innerHTML = `<div class="toast toast-mint show"><span class="material-symbols-outlined text-sm text-mint-green mr-1 align-middle">mark_email_read</span><span>Friend Request dispatched to ${query}!</span></div>`;
          setTimeout(() => (toastMount.innerHTML = ''), 3000);
        }
      }
    });
  }

  // Add Camper Modal Trigger
  const openAddBtn = document.getElementById('btn-open-add-camper-modal');
  const emptyInviteBtn = document.getElementById('btn-empty-invite');
  const handleOpenAdd = () => {
    audio.playClick();
    activeTab = 'DISCOVER';
    store.setView('FRIENDS');
  };
  if (openAddBtn) openAddBtn.addEventListener('click', handleOpenAdd);
  if (emptyInviteBtn) emptyInviteBtn.addEventListener('click', handleOpenAdd);

  // Create Squad Modal Trigger
  const createSquadBtn = document.getElementById('btn-create-new-squad');
  if (createSquadBtn) {
    createSquadBtn.addEventListener('click', () => {
      audio.playClick();
      const squadName = prompt('Enter a name for your new Pod Squad (e.g. Weekend Gamers, Hiking Squad):');
      if (squadName && squadName.trim()) {
        audio.playCorrect();
        store.createSquad({
          name: squadName.trim(),
          icon: 'bolt',
          deckName: 'Custom Inside Joke Deck',
        });
        store.setView('FRIENDS');
      }
    });
  }
}
