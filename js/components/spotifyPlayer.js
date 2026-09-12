// ==============================================================================
// BONDFIRE SPOTIFY SQUAD JUKEBOX & ANTAKSHARI PLAYER (js/components/spotifyPlayer.js)
// Real-time music player widget for Campfire vibes, Antakshari & Guess the Song
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';

export const SPOTIFY_PRESETS = [
  {
    id: 'antakshari',
    name: 'Antakshari & Bollywood Classics',
    tagline: 'Sing-along essentials for squad road trips',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM?utm_source=generator&theme=0',
    icon: 'music_note',
    color: '#06D6A0',
  },
  {
    id: 'lofi',
    name: 'Late Night Chai Lo-Fi',
    tagline: 'Ambient beats for deep confessions & hot seat',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0',
    icon: 'nightlight',
    color: '#FFB703',
  },
  {
    id: 'nostalgia',
    name: '2000s Nostalgia Rewind',
    tagline: 'School & college era throwback anthems',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4o1oenSJRJd?utm_source=generator&theme=0',
    icon: 'history',
    color: '#FF5A5F',
  },
  {
    id: 'party',
    name: 'Hype Squad Bangers',
    tagline: 'High energy party hits for roast verdicts',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXa2PvU927Am1?utm_source=generator&theme=0',
    icon: 'local_fire_department',
    color: '#7209B7',
  },
];

let activePresetId = 'antakshari';
let currentEmbedUrl = SPOTIFY_PRESETS[0].embedUrl;
let isJukeboxOpen = false;

export function renderSpotifyJukebox() {
  return `
    <!-- Floating Spotify Squad Jukebox Widget -->
    <div id="spotify-jukebox-container" class="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      
      <!-- Collapsible Jukebox Panel -->
      <div id="spotify-jukebox-panel" class="w-80 sm:w-96 rounded-2xl bg-[#121212]/95 backdrop-blur-xl border border-[#1DB954]/40 shadow-2xl p-4 mb-2 flex-col gap-3 transition-all duration-300" style="display: ${isJukeboxOpen ? 'flex' : 'none'};">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <div>
              <span class="text-xs font-bold text-white tracking-wide uppercase font-mono">Squad Jukebox</span>
              <span class="text-[9px] text-[#1DB954] block font-mono">Spotify Live Sync</span>
            </div>
          </div>
          <button id="btn-close-jukebox" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <!-- Playlist Preset Selector Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          ${SPOTIFY_PRESETS.map((p) => `
            <button class="btn-spotify-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${p.id === activePresetId ? 'bg-[#1DB954] text-black shadow-glow-mint' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}" data-preset-id="${p.id}" data-url="${p.embedUrl}">
              ${p.name}
            </button>
          `).join('')}
        </div>

        <!-- Spotify Embed Frame -->
        <div class="rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-inner h-40">
          <iframe id="spotify-embed-iframe" src="${currentEmbedUrl}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="w-full h-full"></iframe>
        </div>

        <!-- Custom Track / Playlist Link Input -->
        <form id="form-custom-spotify" class="flex items-center gap-1.5 pt-1">
          <input type="text" id="input-spotify-url" placeholder="Paste song / playlist link..." class="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 font-mono focus:outline-none focus:border-[#1DB954]" />
          <button type="submit" class="px-3 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs shrink-0 transition-colors">
            Play
          </button>
        </form>
      </div>

      <!-- Floating Launch Button -->
      <button id="btn-toggle-jukebox" class="px-3.5 py-2 rounded-full bg-[#121212]/90 border border-[#1DB954]/50 shadow-[0_4px_20px_rgba(29,185,84,0.3)] hover:scale-105 active:scale-95 text-white flex items-center gap-2 transition-all cursor-pointer group" title="Open Spotify Squad Jukebox">
        <svg class="w-4 h-4 text-[#1DB954] group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span class="text-xs font-bold text-gray-200">Squad Jukebox</span>
        <span class="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
      </button>
    </div>
  `;
}

export function bindSpotifyEvents() {
  const toggleBtn = document.getElementById('btn-toggle-jukebox');
  const closeBtn = document.getElementById('btn-close-jukebox');
  const panel = document.getElementById('spotify-jukebox-panel');
  const iframe = document.getElementById('spotify-embed-iframe');
  const presetBtns = document.querySelectorAll('.btn-spotify-preset');
  const customForm = document.getElementById('form-custom-spotify');
  const customInput = document.getElementById('input-spotify-url');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      audio.playClick();
      isJukeboxOpen = !isJukeboxOpen;
      panel.style.display = isJukeboxOpen ? 'flex' : 'none';
      const label = toggleBtn.querySelector('span:first-of-type');
      if (label) label.textContent = isJukeboxOpen ? 'Hide Music' : 'Squad Jukebox';
    });
  }

  if (closeBtn && panel && toggleBtn) {
    closeBtn.addEventListener('click', () => {
      audio.playClick();
      isJukeboxOpen = false;
      panel.style.display = 'none';
      const label = toggleBtn.querySelector('span:first-of-type');
      if (label) label.textContent = 'Squad Jukebox';
    });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const presetId = btn.dataset.presetId;
      const url = btn.dataset.url;
      if (url && iframe) {
        activePresetId = presetId;
        currentEmbedUrl = url;
        iframe.src = url;

        presetBtns.forEach((b) => {
          b.className = 'btn-spotify-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10';
        });
        btn.className = 'btn-spotify-preset px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all bg-[#1DB954] text-black shadow-glow-mint';
      }
    });
  });

  if (customForm && customInput && iframe) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawUrl = customInput.value.trim();
      if (!rawUrl) return;

      audio.playChime();
      let embedTarget = rawUrl;
      if (rawUrl.includes('open.spotify.com/')) {
        const parts = rawUrl.split('open.spotify.com/')[1].split('?')[0];
        embedTarget = `https://open.spotify.com/embed/${parts}?utm_source=generator&theme=0`;
      }

      currentEmbedUrl = embedTarget;
      iframe.src = embedTarget;
      customInput.value = '';
    });
  }
}

export function playSongOnSpotify(queryOrUrl) {
  const panel = document.getElementById('spotify-jukebox-panel');
  const iframe = document.getElementById('spotify-embed-iframe');
  if (!panel || !iframe) return;

  isJukeboxOpen = true;
  panel.style.display = 'flex';

  if (queryOrUrl && queryOrUrl.startsWith('http')) {
    let embed = queryOrUrl;
    if (queryOrUrl.includes('open.spotify.com/')) {
      const parts = queryOrUrl.split('open.spotify.com/')[1].split('?')[0];
      embed = `https://open.spotify.com/embed/${parts}?utm_source=generator&theme=0`;
    }
    iframe.src = embed;
  } else {
    iframe.src = SPOTIFY_PRESETS[0].embedUrl;
  }
}
