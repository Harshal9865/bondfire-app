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
    <!-- Floating Campfire Jukebox Widget (Full Song Player) -->
    <div id="spotify-jukebox-container" class="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      
      <!-- Collapsible Jukebox Panel -->
      <div id="spotify-jukebox-modal" class="w-80 sm:w-96 rounded-3xl bg-[#0e121e]/95 backdrop-blur-2xl border-2 border-amber-gold/50 shadow-2xl p-4 mb-2 flex flex-col gap-3 transition-all duration-300 ${isJukeboxOpen ? '' : 'hidden'}">
        
        <!-- Header with Mode Switcher -->
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-amber-gold/20 text-amber-gold border border-amber-gold/40 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">music_note</span>
            </div>
            <div>
              <span class="text-xs font-bold text-white tracking-wide uppercase font-mono">Campfire Jukebox</span>
              <span class="text-[9px] text-mint-green block font-mono font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
                <span>${playerMode === 'FULL_SONG' ? 'Full Songs · 100% Free & Legal' : 'Spotify Mode'}</span>
              </span>
            </div>
          </div>
          <button id="btn-close-jukebox" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors">
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

        <!-- Info & Custom Song Search -->
        <div class="flex items-center justify-between text-[10px] text-gray-400 font-mono px-1">
          <span>${currentPreset.tagline}</span>
          <span class="text-amber-gold font-bold">Volume: System / Player</span>
        </div>
      </div>

      <!-- Floating Launch Button -->
      <button id="btn-toggle-jukebox" class="px-3.5 py-2 rounded-full bg-surface border-2 border-amber-gold/60 shadow-[0_4px_25px_rgba(255,183,3,0.35)] hover:scale-105 active:scale-95 text-white flex items-center gap-2 transition-all cursor-pointer group" title="Open Campfire Jukebox">
        <span class="material-symbols-outlined text-amber-gold text-[18px] group-hover:rotate-12 transition-transform">music_note</span>
        <span class="text-xs font-bold text-gray-200" id="jukebox-toggle-label">Campfire Music</span>
        <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
      </button>
    </div>
  `;
}

export function bindSpotifyEvents() {
  const toggleBtn = document.getElementById('btn-toggle-jukebox');
  const closeBtn = document.getElementById('btn-close-jukebox');
  const modal = document.getElementById('spotify-jukebox-modal');
  const iframe = document.getElementById('jukebox-embed-iframe');
  const presetBtns = document.querySelectorAll('.btn-jukebox-preset');
  const modeFullSongBtn = document.getElementById('btn-mode-full-song');
  const modeSpotifyBtn = document.getElementById('btn-mode-spotify');
  const toggleLabel = document.getElementById('jukebox-toggle-label');

  if (toggleBtn && modal) {
    toggleBtn.addEventListener('click', () => {
      audio.playClick();
      isJukeboxOpen = !isJukeboxOpen;
      modal.classList.toggle('hidden', !isJukeboxOpen);
      if (toggleLabel) {
        toggleLabel.textContent = isJukeboxOpen ? 'Hide Music' : 'Campfire Music';
      }
    });
  }

  if (closeBtn && modal && toggleBtn) {
    closeBtn.addEventListener('click', () => {
      audio.playClick();
      isJukeboxOpen = false;
      modal.classList.add('hidden');
      if (toggleLabel) toggleLabel.textContent = 'Campfire Music';
    });
  }

  // Switch player mode: Full Song vs Spotify
  if (modeFullSongBtn && iframe) {
    modeFullSongBtn.addEventListener('click', () => {
      audio.playClick();
      playerMode = 'FULL_SONG';
      const preset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
      iframe.src = preset.ytEmbed;
      store.setView('ROOMS');
    });
  }

  if (modeSpotifyBtn && iframe) {
    modeSpotifyBtn.addEventListener('click', () => {
      audio.playClick();
      playerMode = 'SPOTIFY';
      const preset = FULL_SONG_PRESETS.find((p) => p.id === activePresetId) || FULL_SONG_PRESETS[0];
      iframe.src = preset.spotifyEmbed;
      store.setView('ROOMS');
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
    });
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
}
