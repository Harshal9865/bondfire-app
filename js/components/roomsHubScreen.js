// ==============================================================================
// BONDFIRE MULTIPLAYER ROOMS HUB (js/components/roomsHubScreen.js)
// Luxury Room Mode Selection Hub: Duo Sanctuary (Us Mode) vs Squad Party Pod
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export function renderRoomsHub() {
  const state = store.getState();
  const currentRoom = state.activeRoom || {};
  const hasActiveRoom = Boolean(currentRoom.roomCode);
  const activeRoomCode = currentRoom.roomCode || '';
  const activeRoomName = currentRoom.podName || 'Campfire Room';
  const isDuoActive = currentRoom.selectedGameMode === 'US' || state.currentMode === 'US';

  return `
    <div class="relative min-h-[90vh] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-start select-none">
      
      <!-- Top Ambient Atmosphere Glows -->
      <div class="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-sunset-coral/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-10 right-1/4 translate-x-1/2 w-96 h-96 bg-duo-rose/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Active Room Resume Banner (If user has joined/created a room) -->
      ${hasActiveRoom ? `
        <div class="w-full mb-8 p-4 rounded-3xl bg-surface/90 border-2 border-mint-green/50 shadow-glow-mint backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-mint-green/20 text-mint-green border border-mint-green/40 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl animate-pulse">sensors</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-mint-green animate-ping"></span>
                <span class="text-[11px] font-mono text-mint-green uppercase font-bold tracking-wider">Active Session in Progress</span>
              </div>
              <h3 class="font-display font-bold text-white text-base sm:text-lg">
                ${activeRoomName} <span class="font-mono text-amber-gold ml-1">#${activeRoomCode}</span>
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button id="btn-resume-active-room" class="w-full sm:w-auto px-5 py-2.5 rounded-full bg-mint-green text-canvas font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Resume Current Room</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Screen Header -->
      <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset-coral/15 border border-sunset-coral/30 text-sunset-coral text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-sm">
          <span class="material-symbols-outlined text-[15px]">meeting_room</span>
          <span>BONDFIRE ROOM SELECTION</span>
        </div>
        <h1 class="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Choose Your Room Experience
        </h1>
        <p class="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
          Select whether you are playing an intimate 1-on-1 date night or hosting a lively squad campfire party with friends.
        </p>
      </div>

      <!-- Master 2-Card Selection Grid: Duo Sanctuary vs Squad Arena -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        
        <!-- CARD 1: DUO SANCTUARY (US MODE · 2 PLAYERS) -->
        <div class="relative rounded-3xl bg-gradient-to-b from-[#1C1322]/90 via-[#140F1D]/90 to-[#0C0B12]/95 border-2 border-duo-rose/50 hover:border-duo-rose p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_35px_rgba(247,37,133,0.15)] hover:shadow-[0_15px_45px_rgba(247,37,133,0.3)] transition-all duration-300 transform hover:-translate-y-1.5 group">
          
          <!-- Top Badge & Icon -->
          <div>
            <div class="flex items-center justify-between mb-5">
              <div class="w-14 h-14 rounded-2xl bg-duo-rose/20 border border-duo-rose/40 text-duo-rose flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-duo-rose/15 text-duo-rose text-[10px] font-mono font-extrabold uppercase tracking-wider border border-duo-rose/30 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-duo-rose animate-pulse"></span>
                <span>2 Campers · 1-on-1</span>
              </span>
            </div>

            <!-- Title & Description -->
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Us Mode · Duo Sanctuary
            </h2>
            <p class="text-xs font-mono text-duo-rose/90 uppercase tracking-wide font-bold mt-0.5 mb-3">
              Couples, Dates &amp; Best Friends
            </p>
            <p class="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
              Private intimate questions, synchronized memory timelines, encrypted whisper notes, and polaroid unsealing. Zero bots, 100% genuine connection.
            </p>

            <!-- Feature Pills List -->
            <div class="space-y-2.5 mb-8">
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-duo-rose/20 text-duo-rose flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">lock</span>
                </span>
                <span>100% Private, Encrypted 2-Person Sanctuary</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-duo-rose/20 text-duo-rose flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">sync</span>
                </span>
                <span>Real-Time Answer Reveal &amp; Compatibility Sparks</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-duo-rose/20 text-duo-rose flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">mic</span>
                </span>
                <span>Secret Whisper Notes &amp; Voice Memo Capsules</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="space-y-3 pt-2 border-t border-white/10">
            <button id="btn-select-duo-room" type="button" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-duo-rose via-[#FF4081] to-sunset-coral text-white font-black text-sm shadow-[0_4px_25px_rgba(247,37,133,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-lg">favorite</span>
              <span>Enter Duo Room</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <p class="text-[10px] text-center font-mono text-gray-400">
              Starts or joins a private couple session
            </p>
          </div>
        </div>

        <!-- CARD 2: SQUAD ARENA (CAMPFIRE POD PARTY · 3-12 PLAYERS) -->
        <div class="relative rounded-3xl bg-gradient-to-b from-[#221814]/90 via-[#181210]/90 to-[#0D0A0E]/95 border-2 border-sunset-coral/50 hover:border-sunset-coral p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_35px_rgba(255,90,95,0.15)] hover:shadow-[0_15px_45px_rgba(255,90,95,0.3)] transition-all duration-300 transform hover:-translate-y-1.5 group">
          
          <!-- Top Badge & Icon -->
          <div>
            <div class="flex items-center justify-between mb-5">
              <div class="w-14 h-14 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/40 text-sunset-coral flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">local_fire_department</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-sunset-coral/15 text-sunset-coral text-[10px] font-mono font-extrabold uppercase tracking-wider border border-sunset-coral/30 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
                <span>3 to 12 Campers</span>
              </span>
            </div>

            <!-- Title & Description -->
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Squad Party Arena
            </h2>
            <p class="text-xs font-mono text-amber-gold uppercase tracking-wide font-bold mt-0.5 mb-3">
              Friend Groups, Pods &amp; Cabin Hangouts
            </p>
            <p class="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
              Red Flag Courtroom trials, Hot Seat Roulette, Confession Vault whodunits, and synchronized 3D Spin the Bottle arcade. Full multiplayer chaos!
            </p>

            <!-- Feature Pills List -->
            <div class="space-y-2.5 mb-8">
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-sunset-coral/20 text-sunset-coral flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">gavel</span>
                </span>
                <span>Live Squad Verdicts &amp; Penalty Sentences</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-sunset-coral/20 text-sunset-coral flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">sports_bar</span>
                </span>
                <span>Synced 3D Spin the Bottle &amp; Retro Arcade</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-200">
                <span class="w-5 h-5 rounded-full bg-sunset-coral/20 text-sunset-coral flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[14px]">share</span>
                </span>
                <span>Instant 1-Click Code &amp; Link Sharing for Friends</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons & Quick Code Join -->
          <div class="space-y-3 pt-2 border-t border-white/10">
            <button id="btn-select-squad-room" type="button" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-black text-sm shadow-[0_4px_25px_rgba(255,90,95,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-lg">groups</span>
              <span>Enter Squad Room</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <!-- Inline Quick Code Join Bar -->
            <div class="flex items-center gap-2 pt-1">
              <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">vpn_key</span>
                <input id="hub-quick-join-input" type="text" placeholder="HAVE A CODE? ENTER HERE" class="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-white placeholder:text-gray-500 uppercase tracking-wider focus:outline-none focus:border-amber-gold" maxlength="8" />
              </div>
              <button id="btn-hub-quick-join" type="button" class="px-4 py-2 rounded-xl bg-surface-bright hover:bg-amber-gold hover:text-canvas text-gray-200 font-bold text-xs border border-border/80 transition-all active:scale-95 shrink-0 cursor-pointer">
                Join
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Help Note -->
      <div class="mt-8 text-center text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-amber-gold text-[16px]">lightbulb</span>
        <span>You can switch between Duo and Squad rooms at any time without losing saved vault memories.</span>
      </div>

    </div>
  `;
}

export function bindRoomsHubEvents() {
  const btnDuo = document.getElementById('btn-select-duo-room');
  const btnSquad = document.getElementById('btn-select-squad-room');
  const btnResume = document.getElementById('btn-resume-active-room');
  const quickJoinBtn = document.getElementById('btn-hub-quick-join');
  const quickJoinInput = document.getElementById('hub-quick-join-input');

  // 1. Enter Duo Room
  if (btnDuo) {
    btnDuo.addEventListener('click', () => {
      audio.playClick();
      store.setMode('US');
      store.setView('COUPLE');
      window.location.hash = '#/COUPLE';
    });
  }

  // 2. Enter Squad Room
  if (btnSquad) {
    btnSquad.addEventListener('click', () => {
      audio.playClick();
      store.setMode('PODS');
      store.setView('LOBBY');
      window.location.hash = '#/LOBBY';
    });
  }

  // 3. Resume Active Session
  if (btnResume) {
    btnResume.addEventListener('click', () => {
      audio.playChime();
      const state = store.getState();
      const currentRoom = state.activeRoom || {};
      if (currentRoom.selectedGameMode === 'US' || state.currentMode === 'US') {
        store.setView('COUPLE');
        window.location.hash = '#/COUPLE';
      } else {
        store.setView('LOBBY');
        window.location.hash = '#/LOBBY';
      }
    });
  }

  // 4. Quick Join Code
  if (quickJoinBtn && quickJoinInput) {
    const handleQuickJoin = () => {
      const code = quickJoinInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        store.joinRoomWithCode(code);
        store.setView('LOBBY');
        window.location.hash = '#/LOBBY';
      } else {
        audio.playClick();
        quickJoinInput.classList.add('border-sunset-coral');
        setTimeout(() => quickJoinInput.classList.remove('border-sunset-coral'), 1200);
      }
    };

    quickJoinBtn.addEventListener('click', handleQuickJoin);
    quickJoinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleQuickJoin();
    });
  }
}
