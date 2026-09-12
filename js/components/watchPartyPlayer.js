// ==============================================================================
// BONDFIRE INTERACTIVE WATCH PARTY STREAM PLAYER (js/components/watchPartyPlayer.js)
// Synchronized Video Stage + Floating Reaction Rain + Pause-and-Predict Overlays
// Supports: Direct MP4/WebM video streams & YouTube Embeds
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';
import { socketService } from '../services/socket.js';

export class WatchPartyPlayer {
  constructor(containerId, initialVideoUrl) {
    this.container = document.getElementById(containerId);
    this.videoUrl = initialVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-friends-sitting-on-a-curb-and-talking-41584-large.mp4';
    this.isHost = true;
    this.isPlaying = false;
    this.isMuted = false;
    this.reactions = [];

    if (this.container) {
      this.render();
      this.bindEvents();
    }
  }

  render() {
    const isYouTube = this.videoUrl.includes('youtube.com') || this.videoUrl.includes('youtu.be');
    let ytEmbedUrl = '';
    if (isYouTube) {
      const match = this.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const ytId = match ? match[1] : '';
      ytEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1&mute=0&controls=1`;
    }

    this.container.innerHTML = `
      <div class="relative w-full rounded-3xl overflow-hidden bg-black border border-border shadow-2xl flex flex-col group select-none">
        
        <!-- Stream Stage Viewport -->
        <div class="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden" id="stream-stage">
          ${isYouTube ? `
            <iframe 
              id="wp-yt-iframe" 
              src="${ytEmbedUrl}" 
              class="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          ` : `
            <video 
              id="wp-html-video" 
              src="${this.videoUrl}" 
              playsinline 
              class="w-full h-full object-contain"
            ></video>
          `}

          <!-- Floating Emoji Rain Canvas Overlay -->
          <canvas id="reaction-rain-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-20"></canvas>

          <!-- Host Play/Pause Big Center Overlay (HTML5 Video only) -->
          ${!isYouTube ? `
            <button id="btn-stream-playpause" class="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 z-20 group-hover:opacity-100 opacity-0">
              <span class="material-symbols-outlined text-[36px]" id="stream-play-icon">play_arrow</span>
            </button>
          ` : ''}

          <!-- Synchronized Pause & Predict Banner Overlay -->
          <div id="predict-overlay" class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0B141A]/95 backdrop-blur-xl border border-amber-gold/50 shadow-2xl hidden flex-col gap-2.5 z-30 animate-scaleUp">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold text-[10px] font-mono font-bold uppercase">
                ⏱️ PAUSE & PREDICT
              </span>
              <span class="text-xs text-mint-green font-mono font-bold" id="predict-timer">15s</span>
            </div>
            <h4 class="font-display text-sm sm:text-base font-bold text-white leading-snug" id="predict-question">
              What will happen in the next 5 seconds?
            </h4>
            <div class="grid grid-cols-2 gap-2" id="predict-options-grid">
              <!-- Options populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Controller & Action Console Bar -->
        <div class="p-4 bg-surface border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
          
          <!-- URL Swapper Input (Host only) -->
          <div class="flex items-center gap-2 w-full sm:w-auto flex-1">
            <div class="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-bright border border-border focus-within:border-sunset-coral">
              <span class="material-symbols-outlined text-[16px] text-gray-400">link</span>
              <input 
                type="text" 
                id="input-stream-url" 
                placeholder="Paste YouTube or video link..." 
                value="${this.videoUrl}" 
                class="w-full bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none font-mono"
              />
            </div>
            <button id="btn-load-stream-url" class="px-4 py-2 rounded-xl bg-sunset-coral text-white font-bold text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all shrink-0">
              Load Stream
            </button>
          </div>

          <!-- Live Reaction Buttons & Trigger Predict -->
          <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            ${['🔥', '😂', '💀', '🍿', '👏'].map((emoji) => `
              <button class="btn-stream-reaction w-9 h-9 rounded-full bg-surface-bright hover:bg-surface-container-high border border-border flex items-center justify-center text-base transition-transform active:scale-90" data-emoji="${emoji}">
                ${emoji}
              </button>
            `).join('')}

            <button id="btn-trigger-predict-modal" class="px-3 py-2 rounded-xl bg-amber-gold/20 border border-amber-gold text-amber-gold font-bold text-xs hover:bg-amber-gold/30 transition-all flex items-center gap-1.5 ml-1">
              <span>🎯</span>
              <span>Predict Round</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }

  bindEvents() {
    const video = document.getElementById('wp-html-video');
    const playPauseBtn = document.getElementById('btn-stream-playpause');
    const playIcon = document.getElementById('stream-play-icon');
    const btnLoad = document.getElementById('btn-load-stream-url');
    const inputUrl = document.getElementById('input-stream-url');
    const btnPredict = document.getElementById('btn-trigger-predict-modal');
    const predictOverlay = document.getElementById('predict-overlay');

    // HTML5 Video Play / Pause
    if (playPauseBtn && video) {
      playPauseBtn.addEventListener('click', () => {
        audio.playClick();
        if (video.paused) {
          video.play();
          if (playIcon) playIcon.textContent = 'pause';
        } else {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      });
    }

    // Load new URL
    if (btnLoad && inputUrl) {
      btnLoad.addEventListener('click', () => {
        const val = inputUrl.value.trim();
        if (!val) return;
        audio.playChime();
        this.videoUrl = val;
        this.render();
        this.bindEvents();
      });
    }

    // Reaction Blast (Spawn floating emojis)
    document.querySelectorAll('.btn-stream-reaction').forEach((btn) => {
      btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-emoji');
        audio.playBip();
        this.spawnReaction(emoji);
      });
    });

    // Trigger Pause & Predict
    if (btnPredict && predictOverlay) {
      btnPredict.addEventListener('click', () => {
        audio.playChime();
        if (video && !video.paused) video.pause();
        this.showPredictCard();
      });
    }

    // Init Floating Emoji Canvas
    this.initCanvas();
  }

  showPredictCard() {
    const overlay = document.getElementById('predict-overlay');
    const optionsGrid = document.getElementById('predict-options-grid');
    if (!overlay || !optionsGrid) return;

    optionsGrid.innerHTML = `
      <button class="btn-predict-vote p-3 rounded-xl bg-surface border border-border hover:border-amber-gold text-left text-xs font-bold text-white transition-all active:scale-95" data-opt="A">
        A) Everything goes according to plan
      </button>
      <button class="btn-predict-vote p-3 rounded-xl bg-surface border border-border hover:border-amber-gold text-left text-xs font-bold text-white transition-all active:scale-95" data-opt="B">
        B) Absolute chaotic failure
      </button>
    `;

    overlay.classList.remove('hidden');

    overlay.querySelectorAll('.btn-predict-vote').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playChime();
        btn.className = 'btn-predict-vote p-3 rounded-xl bg-amber-gold text-canvas border border-amber-gold text-left text-xs font-bold shadow-sm';
        setTimeout(() => {
          overlay.classList.add('hidden');
          const video = document.getElementById('wp-html-video');
          if (video) video.play();
        }, 1200);
      });
    });
  }

  initCanvas() {
    const canvas = document.getElementById('reaction-rain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];

    this.spawnReaction = (emoji) => {
      for (let i = 0; i < 6; i++) {
        particles.push({
          emoji,
          x: canvas.width * 0.3 + Math.random() * (canvas.width * 0.4),
          y: canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: -(6 + Math.random() * 6),
          size: 24 + Math.random() * 12,
          opacity: 1
        });
      }
    };

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.015;

        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.emoji, p.x, p.y);

        if (p.opacity <= 0 || p.y < -50) {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }
}
