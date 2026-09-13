// ==============================================================================
// COUPLES "US MODE" COMPONENT (Screen 3)
// Intimate Date Night Space: Room Creation/Join, Cross-Device Sync, 0 Mock Bots
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let currentQuizIndex = 0;
let isFlippedThen = false;
let isFlippedNow = false;
let confetti = null;

const DATE_NIGHT_QUESTIONS = [
  {
    round: 1,
    title: 'The First Spark',
    question: 'According to your memory archives: Who suggested the first weekend getaway?',
    clue: 'Sent on a Tuesday afternoon with “PACK YOUR BAGS NOW”.',
    p1Quote: '“I booked the stay!”',
    p2Quote: '“I sent the reel first!”',
  },
  {
    round: 2,
    title: 'Airport Routine',
    question: 'Who takes longer to finish packing their bags before a trip or flight?',
    clue: 'Usually involves 4 outfit changes 20 minutes before the cab arrives.',
    p1Quote: '“I’m packed 2 days early.”',
    p2Quote: '“I’m curating the aesthetic!”',
  },
  {
    round: 3,
    title: 'Movie Night Drift',
    question: 'Who is more likely to fall asleep first during a late-night movie marathon?',
    clue: 'Asleep 18 minutes into the opening credits with popcorn in hand.',
    p1Quote: '“I was just resting my eyes!”',
    p2Quote: '“You were asleep by minute 10.”',
  },
  {
    round: 4,
    title: 'Spontaneous Souvenirs',
    question: 'Who is more likely to buy a totally random souvenir or decor item?',
    clue: 'Found in a quirky boutique in the middle of nowhere.',
    p1Quote: '“It matches our vibe!”',
    p2Quote: '“We had zero luggage space!”',
  },
];

function showToast(msg, type = 'mint') {
  const mount = document.getElementById('toast-mount');
  if (mount) {
    mount.innerHTML = `<div class="toast toast-${type} show"><span>${msg}</span></div>`;
    setTimeout(() => {
      if (mount.innerHTML.includes(msg)) mount.innerHTML = '';
    }, 3200);
  }
}

function renderCamperAvatar(avatar, name, sizeClass = 'w-12 h-12') {
  if (avatar && (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/'))) {
    return `<img src="${avatar}" alt="${name}" class="${sizeClass} rounded-full object-cover shrink-0 border border-border" />`;
  }
  if (avatar && avatar.match(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/u)) {
    return `<div class="${sizeClass} rounded-full bg-surface-bright flex items-center justify-center text-xl shrink-0 border border-border">${avatar}</div>`;
  }
  return `<div class="${sizeClass} rounded-full bg-duo-rose/20 text-duo-rose flex items-center justify-center text-base font-bold shrink-0 border border-duo-rose/40">${(name || 'P').substring(0, 1).toUpperCase()}</div>`;
}

export function renderCoupleScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const activeRoom = state.activeRoom;

  // Determine if in a real Duo Room
  const isDuoRoom = activeRoom && (activeRoom.mode === 'US' || activeRoom.roomType === 'DUO');

  // PHASE 1: NO ACTIVE DUO ROOM -> Entry & Setup Screen
  if (!isDuoRoom) {
    return `
      <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-8 pb-28 gap-6 relative select-none text-on-surface">
        <!-- Warm Glow Backgrounds -->
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-duo-rose/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div class="absolute top-80 -right-20 w-64 h-64 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <!-- Banner Header -->
        <div class="text-center space-y-3 pt-2">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-duo-rose/15 border border-duo-rose/30 text-duo-rose text-xs font-bold font-mono uppercase">
            <span class="material-symbols-outlined text-[15px]">favorite</span>
            <span>Us Mode · Private Couples Space</span>
          </div>
          <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            A private playground for the two of you.
          </h1>
          <p class="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Zero bots, zero strangers. Connect with your partner on mobile and laptop to play personalized date night quizzes, then-vs-now polaroids, and secret sealed notes.
          </p>
        </div>

        <!-- 2 Action Cards: Create or Join -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          
          <!-- Card 1: Create Duo Room -->
          <div class="p-6 rounded-3xl bg-surface border-2 border-duo-rose/50 hover:border-duo-rose shadow-xl flex flex-col justify-between transition-all group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-duo-rose/20 text-duo-rose flex items-center justify-center border border-duo-rose/40">
                <span class="material-symbols-outlined text-2xl">add_circle</span>
              </div>
              <h3 class="font-display text-lg font-bold text-white group-hover:text-duo-rose transition-colors">
                Create a Duo Room
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Generate a unique room code to invite your partner. She/he can join instantly from their phone.
              </p>
            </div>
            <button id="btn-create-duo-room" class="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-duo-rose to-sunset-coral text-white font-bold text-xs shadow-glow-rose hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span>Create Duo Room</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <!-- Card 2: Join with Code -->
          <div class="p-6 rounded-3xl bg-surface border border-border hover:border-amber-gold/60 shadow-xl flex flex-col justify-between transition-all group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-gold/20 text-amber-gold flex items-center justify-center border border-amber-gold/40">
                <span class="material-symbols-outlined text-2xl">favorite</span>
              </div>
              <h3 class="font-display text-lg font-bold text-white group-hover:text-amber-gold transition-colors">
                Join Partner's Room
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Did your partner already create a Duo room? Enter the 4-8 letter room code below.
              </p>
            </div>
            
            <div class="mt-4 space-y-2">
              <div class="flex items-center px-3.5 py-2.5 rounded-xl bg-canvas border border-border focus-within:border-amber-gold/80 transition-colors">
                <span class="text-sunset-coral font-bold mr-1.5 font-mono text-sm">#</span>
                <input id="duo-join-code-input" type="text" placeholder="ROOM CODE" maxlength="8" class="bg-transparent border-none text-white font-mono font-bold tracking-widest text-xs focus:outline-none w-full uppercase placeholder:text-gray-500" />
              </div>
              <button id="btn-join-duo-room" class="w-full py-3 rounded-2xl bg-surface-bright hover:bg-surface-container-high border border-border hover:border-amber-gold/40 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>Join Duo Space</span>
                <span class="material-symbols-outlined text-[16px]">key</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy & End-to-End Encryption Guarantee -->
        <div class="p-4 rounded-2xl bg-surface/70 border border-border/80 flex items-center justify-between text-xs text-gray-400 mt-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-mint-green text-[18px]">verified_user</span>
            <span>100% Private 2-Person Vault · Real Humans Only</span>
          </div>
          <span class="text-[10px] font-mono text-gray-500">Zero AI Training</span>
        </div>
      </div>
    `;
  }

  // PHASE 2: IN A DUO ROOM -> Real Human Campers
  const realPlayers = (activeRoom.players || []).filter((p) => !p.isBot);
  const hostPlayer = realPlayers.find((p) => p.role === 'HOST') || realPlayers[0] || {
    name: user?.displayName ? user.displayName.split(' ')[0] : 'You',
    avatar: user?.avatarUrl,
  };
  const partnerPlayer = realPlayers.find((p) => p !== hostPlayer);
  const isPartnerConnected = !!partnerPlayer;
  const sessionStarted = activeRoom.sessionStarted;

  // SUB-STATE A: WAITING FOR PARTNER (Partner not yet joined)
  if (!isPartnerConnected && !sessionStarted) {
    const inviteUrl = `${window.location.origin}${window.location.pathname}#/COUPLE?code=${activeRoom.roomCode}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Join our private Bondfire date night room here: ${inviteUrl}`)}`;

    return `
      <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-6 pb-28 gap-6 relative select-none text-on-surface">
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-duo-rose/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <!-- Top Status Bar -->
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-gold animate-ping"></span>
            <span class="text-xs font-mono font-bold text-gray-300">DUO ROOM: #${activeRoom.roomCode}</span>
          </div>
          <button id="btn-leave-duo-room" class="text-[11px] font-bold text-gray-400 hover:text-red-400 px-3 py-1 rounded-full bg-surface-bright border border-border transition-colors">
            Exit Room
          </button>
        </div>

        <!-- Main Waiting Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-surface border-2 border-duo-rose/40 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-duo-rose/20 text-duo-rose border border-duo-rose/40 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-3xl animate-pulse">favorite</span>
          </div>

          <div class="space-y-2">
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">Waiting for Your Partner...</h2>
            <p class="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto">
              Share your room code or invite link. When she/he opens it on mobile or laptop, your screens will sync live!
            </p>
          </div>

          <!-- Room Code Display Pill -->
          <div class="p-4 rounded-2xl bg-canvas border border-border inline-block max-w-xs w-full mx-auto">
            <span class="text-[10px] font-mono text-gray-400 block uppercase tracking-wider mb-1">Your Duo Room Code</span>
            <span class="text-3xl font-mono font-black text-amber-gold tracking-widest block font-room-code select-all">
              #${activeRoom.roomCode}
            </span>
          </div>

          <!-- Share Actions -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button id="btn-copy-duo-invite" class="w-full sm:w-auto px-6 py-3 rounded-full bg-duo-rose hover:bg-duo-rose/90 text-white font-bold text-xs shadow-glow-rose active:scale-95 transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy Invite Link</span>
            </button>
            <a href="${whatsappUrl}" target="_blank" class="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2 font-mono">
              <span class="material-symbols-outlined text-[16px]">send</span>
              <span>Send on WhatsApp</span>
            </a>
          </div>

          <!-- Real Player Slots (Strictly 2 Slots) -->
          <div class="pt-6 border-t border-border/80 grid grid-cols-2 gap-4 text-left">
            <!-- Slot 1: Host (You) -->
            <div class="p-3.5 rounded-2xl bg-surface-bright/70 border border-mint-green/40 flex items-center gap-3">
              ${renderCamperAvatar(hostPlayer.avatar, hostPlayer.name, 'w-10 h-10')}
              <div class="min-w-0">
                <span class="text-xs font-bold text-white block truncate">${hostPlayer.name}</span>
                <span class="text-[10px] font-mono text-mint-green font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
                  Ready (Host)
                </span>
              </div>
            </div>

            <!-- Slot 2: Partner (Waiting) -->
            <div class="p-3.5 rounded-2xl bg-surface-bright/30 border border-dashed border-duo-rose/50 flex items-center gap-3 animate-pulse">
              <div class="w-10 h-10 rounded-full bg-duo-rose/10 text-duo-rose flex items-center justify-center border border-duo-rose/30 shrink-0">
                <span class="material-symbols-outlined text-[18px]">hourglass_empty</span>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-medium text-gray-300 block truncate">Partner</span>
                <span class="text-[10px] font-mono text-duo-rose font-bold">Waiting to join...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // SUB-STATE B: BOTH CONNECTED, BUT SESSION NOT STARTED -> Ready Screen
  if (isPartnerConnected && !sessionStarted) {
    return `
      <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-6 pb-28 gap-6 relative select-none text-on-surface">
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-duo-rose/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <!-- Top Status Bar -->
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-mint-green animate-pulse"></span>
            <span class="text-xs font-mono font-bold text-white">DUO ROOM: #${activeRoom.roomCode}</span>
          </div>
          <button id="btn-leave-duo-room" class="text-[11px] font-bold text-gray-400 hover:text-red-400 px-3 py-1 rounded-full bg-surface-bright border border-border transition-colors">
            Exit Room
          </button>
        </div>

        <div class="p-6 sm:p-8 rounded-3xl bg-surface border-2 border-mint-green/50 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-mint-green/20 text-mint-green border border-mint-green/40 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-3xl">done_all</span>
          </div>

          <div class="space-y-2">
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">Both Connected!</h2>
            <p class="text-xs sm:text-sm text-mint-green font-semibold">
              ${hostPlayer.name} & ${partnerPlayer.name} are ready for Date Night!
            </p>
          </div>

          <!-- Both Campers Display -->
          <div class="grid grid-cols-2 gap-4 py-2">
            <div class="p-4 rounded-2xl bg-canvas border border-border text-center space-y-2">
              <div class="flex justify-center">${renderCamperAvatar(hostPlayer.avatar, hostPlayer.name, 'w-14 h-14')}</div>
              <span class="text-xs font-bold text-white block truncate">${hostPlayer.name}</span>
              <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface text-gray-400 border border-border uppercase">Player 1</span>
            </div>
            <div class="p-4 rounded-2xl bg-canvas border border-border text-center space-y-2">
              <div class="flex justify-center">${renderCamperAvatar(partnerPlayer.avatar, partnerPlayer.name, 'w-14 h-14')}</div>
              <span class="text-xs font-bold text-white block truncate">${partnerPlayer.name}</span>
              <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-duo-rose/20 text-duo-rose border border-duo-rose/40 uppercase">Player 2</span>
            </div>
          </div>

          <!-- Launch Button -->
          <button id="btn-start-duo-session" class="w-full py-4 rounded-full bg-gradient-to-r from-duo-rose via-sunset-coral to-amber-gold text-canvas font-extrabold text-sm sm:text-base shadow-glow-rose hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[20px]">local_fire_department</span>
            <span>Start Date Night Session</span>
          </button>
        </div>
      </div>
    `;
  }

  // SUB-STATE C: ACTIVE DATE NIGHT SESSION (Real 2 Players)
  const currentQuiz = DATE_NIGHT_QUESTIONS[currentQuizIndex % DATE_NIGHT_QUESTIONS.length];
  const partnerOne = hostPlayer.name;
  const partnerTwo = partnerPlayer ? partnerPlayer.name : 'Partner';

  return `
    <div class="flex flex-col w-full max-w-[640px] mx-auto px-4 pt-6 pb-28 gap-5 relative select-none text-on-surface">
      <!-- Glows -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-sunset-coral/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-[380px] -right-20 w-64 h-64 bg-amber-gold/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Header Bar with 2 Real Names -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-duo-rose/20 flex items-center justify-center shrink-0 border border-duo-rose/40">
            <span class="material-symbols-outlined text-duo-rose text-[20px]">favorite</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-headline-sm text-base sm:text-lg text-on-surface truncate font-bold">${partnerOne} &amp; ${partnerTwo}</span>
            <span class="font-caption text-xs text-mint-green tracking-wide uppercase truncate font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
              Private Synced Session (#${activeRoom.roomCode})
            </span>
          </div>
        </div>

        <button class="px-3.5 py-1.5 rounded-full bg-surface-bright hover:bg-surface border border-border text-xs text-gray-300 font-bold shrink-0 transition-colors" id="btn-couple-header-book" type="button">
          Us Album
        </button>
      </div>

      <!-- Activity 1: "Then vs. Now" 3D Flippable Comparison -->
      <div class="relative bg-surface rounded-2xl p-5 shadow-xl border border-border flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sunset-coral/20 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[18px]">history_toggle_off</span>
            </div>
            <div>
              <span class="text-[11px] text-sunset-coral tracking-wider uppercase block font-bold">Memories in Motion</span>
              <h2 class="font-headline-sm text-base sm:text-lg text-white font-bold">Then &amp; Now</h2>
            </div>
          </div>
          <span class="retro-pixel-badge px-2.5 py-1 rounded-full bg-surface-bright text-gray-300 text-[10px] font-bold border border-border/60 flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">flip</span>
            <span>Tap to Flip</span>
          </span>
        </div>

        <!-- Polaroids Side-by-Side Comparison Frame -->
        <div class="relative grid grid-cols-2 gap-3 pt-1 pb-4">
          <!-- THEN Polaroid -->
          <div class="cursor-pointer select-none group perspective-1000" id="polaroid-then-container">
            <div class="relative w-full transition-transform duration-500 transform-style-preserve-3d ${isFlippedThen ? 'rotate-y-180' : ''}" id="polaroid-then-card">
              <div class="flex flex-col bg-canvas p-2.5 rounded-xl shadow-lg -rotate-2 group-hover:rotate-0 transition-transform duration-300 border border-border backface-hidden">
                <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface">
                  <img alt="First Date" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80" />
                  <div class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm">
                    <span class="text-[10px] text-gray-300 font-bold">THEN</span>
                  </div>
                </div>
                <div class="pt-2 pb-0.5 px-0.5 text-center">
                  <p class="text-[11px] leading-tight text-white truncate font-bold">First Adventure</p>
                  <span class="text-[10px] text-gray-400 truncate block">Chapter 1</span>
                </div>
              </div>

              <!-- Back Side -->
              <div class="absolute inset-0 bg-surface border border-amber-gold/60 p-3 rounded-xl shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden text-left">
                <div>
                  <div class="flex items-center justify-between border-b border-border pb-1.5 mb-2">
                    <span class="retro-pixel-badge text-[9.5px] font-bold text-amber-gold flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">mic</span>
                      <span>Voice Note</span>
                    </span>
                    <span class="text-[10px] font-mono text-gray-400">0:24</span>
                  </div>
                  <p class="text-xs text-gray-200 italic leading-snug">“Remember how lost we got looking for the place? Best accidental detour ever.”</p>
                </div>
                <div class="text-[10px] text-right text-sunset-coral font-bold">— ${partnerTwo}</div>
              </div>
            </div>
          </div>

          <!-- NOW Polaroid -->
          <div class="cursor-pointer select-none group perspective-1000" id="polaroid-now-container">
            <div class="relative w-full transition-transform duration-500 transform-style-preserve-3d ${isFlippedNow ? 'rotate-y-180' : ''}" id="polaroid-now-card">
              <div class="flex flex-col bg-canvas p-2.5 rounded-xl shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-300 border border-border backface-hidden">
                <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface">
                  <img alt="Anniversary" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80" />
                  <div class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm">
                    <span class="text-[10px] text-mint-green font-bold">NOW</span>
                  </div>
                </div>
                <div class="pt-2 pb-0.5 px-0.5 text-center">
                  <p class="text-[11px] leading-tight text-white truncate font-bold">Recent Moments</p>
                  <span class="text-[10px] text-gray-400 truncate block">Latest Trip</span>
                </div>
              </div>

              <!-- Back Side -->
              <div class="absolute inset-0 bg-surface border border-mint-green/60 p-3 rounded-xl shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden text-left">
                <div>
                  <div class="flex items-center justify-between border-b border-border pb-1.5 mb-2">
                    <span class="retro-pixel-badge text-[9.5px] font-bold text-mint-green flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">mic</span>
                      <span>Voice Note</span>
                    </span>
                    <span class="text-[10px] font-mono text-gray-400">0:31</span>
                  </div>
                  <p class="text-xs text-gray-200 italic leading-snug">“Three years in and you still let me pick the road trip music. Here’s to many more.”</p>
                </div>
                <div class="text-[10px] text-right text-amber-gold font-bold">— ${partnerOne}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-1 text-center">
          <span class="text-xs text-gray-400 font-mono">Tap either polaroid to flip and listen to the voice note</span>
        </div>
      </div>

      <!-- Activity 2: Active Couple Date Night Quiz -->
      <div class="bg-surface rounded-2xl p-5 shadow-xl border border-border flex flex-col gap-4 relative">
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">
            <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span class="retro-pixel-badge text-[10px]">Round ${currentQuiz.round}/${DATE_NIGHT_QUESTIONS.length} · ${currentQuiz.title}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button type="button" id="btn-quiz-prev" class="p-1.5 rounded-lg bg-surface-bright hover:bg-surface text-gray-400 hover:text-white border border-border text-xs flex items-center justify-center">
              <span class="material-symbols-outlined text-[14px]">arrow_back</span>
            </button>
            <button type="button" id="btn-quiz-next" class="p-1.5 rounded-lg bg-surface-bright hover:bg-surface text-gray-400 hover:text-white border border-border text-xs flex items-center justify-center">
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="font-headline-sm text-base sm:text-lg text-white font-bold" id="couple-quiz-question">
            ${currentQuiz.question}
          </h3>
          <p class="text-xs text-gray-400">Lock in your answers together to unlock compatibility sparks.</p>
        </div>

        <!-- 2 Real Partner Choices -->
        <div class="flex flex-col gap-2.5" id="couple-quiz-options">
          <button class="couple-quiz-btn group w-full min-h-[58px] p-3 rounded-2xl bg-surface-bright hover:border-sunset-coral/50 active:scale-[0.98] transition-all flex items-center justify-between text-left border border-border" data-choice="${partnerOne}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-sunset-coral/30 flex items-center justify-center shrink-0 text-sunset-coral font-bold text-sm border border-sunset-coral/40">
                ${partnerOne.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs text-sunset-coral font-bold">${partnerOne}</span>
                <span class="text-xs text-gray-300 truncate">${currentQuiz.p1Quote}</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-surface flex items-center justify-center shrink-0 text-gray-500">
              <span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
            </div>
          </button>

          <button class="couple-quiz-btn group w-full min-h-[58px] p-3 rounded-2xl bg-surface-bright hover:border-amber-gold/50 active:scale-[0.98] transition-all flex items-center justify-between text-left border border-border" data-choice="${partnerTwo}" type="button">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-amber-gold/30 flex items-center justify-center shrink-0 text-amber-gold font-bold text-sm border border-amber-gold/40">
                ${partnerTwo.charAt(0).toUpperCase()}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs text-amber-gold font-bold">${partnerTwo}</span>
                <span class="text-xs text-gray-300 truncate">${currentQuiz.p2Quote}</span>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full bg-surface flex items-center justify-center shrink-0 text-gray-500">
              <span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
            </div>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-canvas flex items-center gap-2 border border-border">
          <span class="material-symbols-outlined text-amber-gold text-[20px] shrink-0">mark_chat_read</span>
          <span class="text-xs text-gray-300 flex-1">
            <strong class="text-amber-gold font-bold">Clue:</strong> <span id="couple-quiz-clue">${currentQuiz.clue}</span>
          </span>
        </div>
      </div>

      <!-- Activity 3: "Whisper Note" -->
      <div class="relative bg-surface rounded-2xl p-5 shadow-xl border border-border flex flex-col gap-3 overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-duo-rose/20 flex items-center justify-center text-duo-rose">
              <span class="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <h3 class="font-headline-sm text-base text-white font-bold">Secret Whisper Note</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-duo-rose/20 text-duo-rose text-[11px] font-bold border border-duo-rose/30">Tonight's Seal</span>
        </div>
        <p class="text-xs text-gray-300">
          Leave an affectionate note for <span class="text-amber-gold font-semibold">${partnerTwo}</span>. It will be sealed into your private vault.
        </p>

        <div class="relative rounded-xl bg-canvas p-3.5 flex flex-col gap-2 border border-border">
          <textarea id="whisper-input" class="w-full bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus:outline-none resize-none" placeholder="Write something sweet or funny..." rows="3"></textarea>
          <div class="flex items-center justify-between pt-1 border-t border-border/40">
            <span class="text-[11px] text-amber-gold font-mono flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px]">lock</span>
              Seals into Vault
            </span>
            <button class="px-4 py-1.5 rounded-full bg-gradient-to-r from-duo-rose to-sunset-coral text-white font-bold text-xs active:scale-95 transition-transform flex items-center gap-1 shadow" id="btn-seal-whisper" type="button">
              <span>Seal Note</span>
              <span class="material-symbols-outlined text-[14px]">done_all</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Floating Nav Bar -->
      <div class="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl px-4 py-3 border-t border-border">
        <div class="max-w-[640px] mx-auto flex items-center justify-between gap-3">
          <button class="px-4 py-2.5 rounded-full bg-surface-bright text-xs font-bold text-gray-300 hover:text-white border border-border transition-colors" id="btn-exit-duo-session">
            Exit Session
          </button>
          <button class="px-6 py-2.5 rounded-full bg-gradient-to-r from-duo-rose to-sunset-coral text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-rose active:scale-95 transition-all" id="btn-couple-next-memory" type="button">
            <span>Next Question</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindCoupleEvents() {
  if (!confetti) {
    confetti = new ConfettiEngine('confetti-canvas');
  }

  // 1. Create Duo Room
  const btnCreateDuo = document.getElementById('btn-create-duo-room');
  if (btnCreateDuo) {
    btnCreateDuo.addEventListener('click', () => {
      audio.playChime();
      store.createDuoRoom();
      store.setView('COUPLE');
    });
  }

  // 2. Join Duo Room with Code
  const btnJoinDuo = document.getElementById('btn-join-duo-room');
  const duoInput = document.getElementById('duo-join-code-input');
  if (btnJoinDuo && duoInput) {
    const handleJoin = () => {
      const code = duoInput.value.trim().toUpperCase();
      if (code.length >= 3) {
        audio.playChime();
        store.joinRoomWithCode(code, true);
        store.setView('COUPLE');
      } else {
        audio.playTick();
        duoInput.focus();
        duoInput.placeholder = 'ENTER CODE!';
      }
    };
    btnJoinDuo.addEventListener('click', handleJoin);
    duoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleJoin();
    });
  }

  // 3. Copy Duo Invite Link
  const btnCopyDuo = document.getElementById('btn-copy-duo-invite');
  if (btnCopyDuo) {
    btnCopyDuo.addEventListener('click', () => {
      const roomCode = store.getState().activeRoom?.roomCode;
      const url = `${window.location.origin}${window.location.pathname}#/COUPLE?code=${roomCode}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      }
      audio.playBip();
      showToast('Room invite link copied! Send it to your partner.', 'mint');
    });
  }

  // 4. Leave / Exit Room
  const btnLeaveDuo = document.getElementById('btn-leave-duo-room');
  const btnExitSession = document.getElementById('btn-exit-duo-session');
  const handleExit = () => {
    audio.playClick();
    store.leaveDuoRoom();
    store.setView('COUPLE');
  };
  if (btnLeaveDuo) btnLeaveDuo.addEventListener('click', handleExit);
  if (btnExitSession) btnExitSession.addEventListener('click', handleExit);

  // 5. Start Duo Session (When both connected)
  const btnStartSession = document.getElementById('btn-start-duo-session');
  if (btnStartSession) {
    btnStartSession.addEventListener('click', () => {
      audio.playCorrect();
      confetti.burst(60);
      const activeRoom = store.getState().activeRoom;
      store.setState({
        activeRoom: { ...activeRoom, sessionStarted: true },
      });

      // Broadcast to partner device
      import('../services/supabaseClient.js').then(({ broadcastRoomAction }) => {
        broadcastRoomAction('START_DUO_SESSION', { roomCode: activeRoom.roomCode });
      }).catch((e) => console.warn(e));

      store.setView('COUPLE');
    });
  }

  // 6. Flip Polaroids
  const polThenCard = document.getElementById('polaroid-then-card');
  const polNowCard = document.getElementById('polaroid-now-card');
  const polThenContainer = document.getElementById('polaroid-then-container');
  const polNowContainer = document.getElementById('polaroid-now-container');

  if (polThenContainer && polThenCard) {
    polThenContainer.addEventListener('click', () => {
      audio.playChime();
      isFlippedThen = !isFlippedThen;
      polThenCard.classList.toggle('rotate-y-180', isFlippedThen);
    });
  }

  if (polNowContainer && polNowCard) {
    polNowContainer.addEventListener('click', () => {
      audio.playChime();
      isFlippedNow = !isFlippedNow;
      polNowCard.classList.toggle('rotate-y-180', isFlippedNow);
    });
  }

  // 7. Couple Quiz Buttons
  const quizBtns = document.querySelectorAll('.couple-quiz-btn');
  quizBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playCorrect();
      quizBtns.forEach((b) => {
        b.classList.remove('border-sunset-coral', 'bg-sunset-coral/20', 'border-amber-gold', 'bg-amber-gold/20');
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'radio_button_unchecked';
      });
      btn.classList.add('border-sunset-coral', 'bg-sunset-coral/20');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'check_circle';

      store.addSparks(50);
      showToast('Answer locked! +50 Sparks added to your vault.', 'mint');
    });
  });

  // 8. Quiz Next / Prev
  const nextQuizBtn = document.getElementById('btn-quiz-next');
  const prevQuizBtn = document.getElementById('btn-quiz-prev');
  const nextMemBtn = document.getElementById('btn-couple-next-memory');

  const advanceQuiz = () => {
    audio.playClick();
    currentQuizIndex = (currentQuizIndex + 1) % DATE_NIGHT_QUESTIONS.length;
    store.setView('COUPLE');
  };

  if (nextQuizBtn) nextQuizBtn.addEventListener('click', advanceQuiz);
  if (nextMemBtn) nextMemBtn.addEventListener('click', advanceQuiz);
  if (prevQuizBtn) {
    prevQuizBtn.addEventListener('click', () => {
      audio.playClick();
      currentQuizIndex = (currentQuizIndex - 1 + DATE_NIGHT_QUESTIONS.length) % DATE_NIGHT_QUESTIONS.length;
      store.setView('COUPLE');
    });
  }

  // 9. Seal Whisper Note
  const sealWhisperBtn = document.getElementById('btn-seal-whisper');
  const whisperInput = document.getElementById('whisper-input');
  if (sealWhisperBtn && whisperInput) {
    sealWhisperBtn.addEventListener('click', () => {
      const text = whisperInput.value.trim();
      if (!text) {
        audio.playTick();
        whisperInput.focus();
        return;
      }
      audio.playCorrect();
      confetti.burst(40);
      store.addCustomMemory({
        title: 'Date Night Whisper Note',
        quote: text,
        type: 'WHISPER',
        category: 'LOVE',
      });
      whisperInput.value = '';
      showToast('Whisper note sealed into your private vault!', 'mint');
    });
  }

  // 10. Us Album header button
  const albumBtn = document.getElementById('btn-couple-header-book');
  if (albumBtn) {
    albumBtn.addEventListener('click', () => {
      audio.playClick();
      store.setView('YEARBOOK');
      window.location.hash = '#/YEARBOOK';
    });
  }
}
