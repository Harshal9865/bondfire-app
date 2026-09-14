// ==============================================================================
// BONDFIRE CAMPFIRE JUKEBOX & ANTAKSHARI PLAYER (js/components/spotifyPlayer.js)
// 100% Free Full Song Streaming (via YouTube Official Embeds) + Spotify Mode
// Zero API keys, zero paid accounts required for full length listening
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export const FULL_SONG_PRESETS = [
  {
    id: 'antakshari',
    name: 'Antakshari & Bollywood',
    tagline: 'Sing-along Bollywood hits for late night games',
    ytEmbed: 'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk?autoplay=1',
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM?utm_source=generator&theme=0',
    icon: 'music_note',
    color: '#06D6A0',
  },
  {
    id: 'punjabi',
    name: 'Punjabi Dhol & Hype',
    tagline: 'Diljit, AP Dhillon, Karan Aujla party hits',
    ytEmbed: 'https://www.youtube-nocookie.com/embed/hS5CfP8n_mM?autoplay=1',
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5cZuTvnNXUt?utm_source=generator&theme=0',
    icon: 'local_fire_department',
    color: '#F72585',
  },
  {
    id: 'coke_studio',
    name: 'Coke Studio & Sufi',
    tagline: 'Soulful acoustic, Pasoori, Ali Sethi & Amit Trivedi',
    ytEmbed: 'https://www.youtube-nocookie.com/embed/5Eqb_-j3FDA?autoplay=1',
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWVUpZ9yP0nB1?utm_source=generator&theme=0',
    icon: 'spa',
    color: '#7209B7',
  },
  {
    id: 'lofi',
    name: 'Campfire Chai Lo-Fi',
    tagline: 'Mellow chill beats & acoustic guitar',
    ytEmbed: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1',
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0',
    icon: 'nightlight',
    color: '#FFB703',
  },
  {
    id: 'indie',
    name: 'Hindi Indie & 90s Hits',
    tagline: 'Lucky Ali, KK, Prateek Kuhad, Anuv Jain',
    ytEmbed: 'https://www.youtube-nocookie.com/embed/p8npG30cMlc?autoplay=1',
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXd8cOUiye1o2?utm_source=generator&theme=0',
    icon: 'history',
    color: '#FF5A5F',
  },
];

let playerMode = 'FULL_SONG'; // 'FULL_SONG' (YouTube 100% Free Full) | 'SPOTIFY'
let activePresetId = 'antakshari';
let isJukeboxOpen = false;

export function renderSpotifyJukebox() {
  const currentPreset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
  const activeUrl = playerMode === 'FULL_SONG' ? currentPreset.ytEmbed : currentPreset.spotifyEmbed;

  return `
    <!-- Top-Right Jukebox Dropdown (Triggered from Navbar Spotify Button) -->
    <div id="spotify-jukebox-container" class="fixed top-14 sm:top-16 right-3 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      
      <!-- Collapsible Jukebox Panel -->
      <div id="spotify-jukebox-modal" class="w-[calc(100vw-24px)] max-w-sm sm:w-96 rounded-3xl bg-[#0e121e]/98 backdrop-blur-2xl border-2 border-[#1DB954]/50 shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-3.5 sm:p-4 mb-2 flex flex-col gap-3 transition-all duration-300 max-h-[75vh] overflow-y-auto ${isJukeboxOpen ? '' : 'hidden'}">
        
        <!-- Header with Mode Switcher & Room Sync Badge -->
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40 flex items-center justify-center">
              <svg class="w-4 h-4 fill-current text-[#1DB954]" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <div>
              <span class="text-xs font-bold text-white tracking-wide uppercase font-mono">Campfire Jukebox</span>
              <span class="text-[9.5px] text-[#1DB954] block font-mono font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
                <span>Room Audio Synced Live</span>
              </span>
            </div>
          </div>
          <button id="btn-close-jukebox" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <!-- Mode Toggle: Full Song (Free) vs Spotify -->
        <div class="grid grid-cols-2 p-1 rounded-xl bg-surface border border-border">
          <button id="btn-mode-full-song" class="py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${playerMode === 'FULL_SONG' ? 'bg-amber-gold text-canvas font-extrabold shadow' : 'text-gray-400 hover:text-white'}">
            <span class="material-symbols-outlined text-[13px]">play_circle</span>
            <span>Free Full Songs</span>
          </button>
          <button id="btn-mode-spotify" class="py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${playerMode === 'SPOTIFY' ? 'bg-[#1DB954] text-black font-extrabold shadow' : 'text-gray-400 hover:text-white'}">
            <span class="material-symbols-outlined text-[13px]">graphic_eq</span>
            <span>Spotify Embed</span>
          </button>
        </div>

        <!-- Playlist Preset Selector Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          ${FULL_SONG_PRESETS.map((p) => `
            <button class="btn-jukebox-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${p.id === activePresetId ? 'bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas shadow font-extrabold' : 'bg-surface-bright text-gray-300 hover:bg-surface border border-border'}" data-preset-id="${p.id}">
              ${p.name}
            </button>
          `).join('')}
        </div>

        <!-- Active Player Embed Frame -->
        <div class="rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-inner h-44 relative">
          <iframe id="jukebox-embed-iframe" src="${activeUrl}" width="100%" height="100%" frameborder="0" allowtransparency="true" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="w-full h-full"></iframe>
        </div>

        <!-- Info & Sync Notice -->
        <div class="flex items-center justify-between text-[10px] text-gray-400 font-mono px-1">
          <span>${currentPreset.tagline}</span>
          <span class="text-[#1DB954] font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">group</span>
            <span>Party In-Sync</span>
          </span>
        </div>
      </div>
    </div>
  `;
}

function updateHeaderMusicIndicator(isPlaying) {
  const headerBtn = document.getElementById('btn-header-jukebox');
  if (headerBtn) {
    if (isPlaying) {
      headerBtn.classList.add('ring-2', 'ring-[#1DB954]', 'shadow-[0_0_16px_rgba(29,185,84,0.6)]');
    } else {
      headerBtn.classList.remove('ring-2', 'ring-[#1DB954]', 'shadow-[0_0_16px_rgba(29,185,84,0.6)]');
    }
  }
}

export function bindSpotifyEvents() {
  const closeBtn = document.getElementById('btn-close-jukebox');
  const modal = document.getElementById('spotify-jukebox-modal');
  const iframe = document.getElementById('jukebox-embed-iframe');
  const presetBtns = document.querySelectorAll('.btn-jukebox-preset');
  const modeFullSongBtn = document.getElementById('btn-mode-full-song');
  const modeSpotifyBtn = document.getElementById('btn-mode-spotify');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      audio.playClick();
      isJukeboxOpen = false;
      modal.classList.add('hidden');
      updateHeaderMusicIndicator(false);
    });
  }

  // Switch player mode: Full Song vs Spotify
  if (modeFullSongBtn && iframe) {
    modeFullSongBtn.addEventListener('click', () => {
      audio.playClick();
      playerMode = 'FULL_SONG';
      const preset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
      iframe.src = preset.ytEmbed;
      broadcastMusicSync(activePresetId, playerMode, true);
    });
  }

  if (modeSpotifyBtn && iframe) {
    modeSpotifyBtn.addEventListener('click', () => {
      audio.playClick();
      playerMode = 'SPOTIFY';
      const preset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
      iframe.src = preset.spotifyEmbed;
      broadcastMusicSync(activePresetId, playerMode, true);
    });
  }

  // Preset buttons
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const presetId = btn.dataset.presetId;
      activePresetId = presetId;
      const preset = FULL_SONG_PRESETS.find((p) => p.id === presetId) || FULL_SONG_PRESETS[0];
      const targetUrl = playerMode === 'FULL_SONG' ? preset.ytEmbed : preset.spotifyEmbed;
      if (iframe) iframe.src = targetUrl;

      presetBtns.forEach((b) => {
        b.className = 'btn-jukebox-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-surface-bright text-gray-300 hover:bg-surface border border-border';
      });
      btn.className = 'btn-jukebox-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas shadow font-extrabold';

      updateHeaderMusicIndicator(true);
      broadcastMusicSync(presetId, playerMode, true);
    });
  });
}

function broadcastMusicSync(presetId, mode, isPlaying) {
  const roomCode = store.getState().activeRoom?.roomCode;
  if (roomCode) {
    import('../services/supabaseClient.js').then(({ broadcastRoomAction }) => {
      broadcastRoomAction('SYNC_ROOM_MUSIC', {
        presetId,
        mode,
        isPlaying,
        roomCode,
        timestamp: Date.now()
      });
    }).catch(() => {});
  }
}

export function applyRemoteMusicSync(payload) {
  if (!payload || !payload.presetId) return;
  activePresetId = payload.presetId;
  if (payload.mode) playerMode = payload.mode;

  const preset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
  const targetUrl = playerMode === 'FULL_SONG' ? preset.ytEmbed : preset.spotifyEmbed;

  const modal = document.getElementById('spotify-jukebox-modal');
  const iframe = document.getElementById('jukebox-embed-iframe');
  if (iframe) iframe.src = targetUrl;
  if (payload.isPlaying && modal) {
    isJukeboxOpen = true;
    modal.classList.remove('hidden');
    updateHeaderMusicIndicator(true);
  }

  // Update preset buttons UI if modal is rendered
  const presetBtns = document.querySelectorAll('.btn-jukebox-preset');
  presetBtns.forEach((b) => {
    if (b.dataset.presetId === activePresetId) {
      b.className = 'btn-jukebox-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas shadow font-extrabold';
    } else {
      b.className = 'btn-jukebox-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-surface-bright text-gray-300 hover:bg-surface border border-border';
    }
  });
}

export function playSongOnSpotify(queryOrUrl) {
  const modal = document.getElementById('spotify-jukebox-modal');
  const iframe = document.getElementById('jukebox-embed-iframe');
  if (!modal || !iframe) return;

  isJukeboxOpen = true;
  modal.classList.remove('hidden');

  const q = (queryOrUrl || '').toLowerCase();
  let matched = FULL_SONG_PRESETS[0];
  if (q.includes('punjabi') || q.includes('diljit') || q.includes('dhol')) matched = FULL_SONG_PRESETS[1];
  else if (q.includes('coke') || q.includes('sufi') || q.includes('pasoori')) matched = FULL_SONG_PRESETS[2];
  else if (q.includes('lofi') || q.includes('chai') || q.includes('chill')) matched = FULL_SONG_PRESETS[3];
  else if (q.includes('indie') || q.includes('90s') || q.includes('lucky')) matched = FULL_SONG_PRESETS[4];

  activePresetId = matched.id;
  iframe.src = playerMode === 'FULL_SONG' ? matched.ytEmbed : matched.spotifyEmbed;
  updateHeaderMusicIndicator(true);
  broadcastMusicSync(matched.id, playerMode, true);
}
