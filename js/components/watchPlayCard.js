// ==============================================================================
// BONDFIRE WATCH-AND-PLAY CARD COMPONENT (js/components/watchPlayCard.js)
// 20-40s Short Video / Audio Interactive Episodes
// Video plays -> Auto-pauses at timestamp -> Audience votes -> Instant payoff reveal
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';

export function renderWatchPlayCard(card, state = {}) {
  const isVoted = !!card.userVote;
  const isCorrect = card.userVote && card.options.find((o) => o.id === card.userVote)?.isCorrect;

  return `
    <div class="p-5 rounded-3xl bg-surface border border-border shadow-2xl relative overflow-hidden flex flex-col gap-4 group" id="card-${card.id}">
      
      <!-- Creator Header Bar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="${card.creator.avatar}" class="w-10 h-10 rounded-full bg-surface-bright object-cover border border-sunset-coral/30" />
          <div>
            <h4 class="font-bold text-sm text-white">${card.creator.name}</h4>
            <span class="text-[11px] font-mono text-gray-400">${card.creator.handle}</span>
          </div>
        </div>
        
        <span class="px-2.5 py-0.5 rounded-full bg-sunset-coral/15 text-sunset-coral text-[10px] font-mono font-bold border border-sunset-coral/30 uppercase">
          ${card.badge}
        </span>
      </div>

      <!-- Video / Media Canvas Container -->
      <div class="relative w-full rounded-2xl overflow-hidden bg-black/90 aspect-video border border-border/80 group">
        <video 
          id="video-${card.id}" 
          src="${card.mediaUrl}" 
          poster="${card.posterUrl || ''}" 
          playsinline 
          class="w-full h-full object-cover"
        ></video>

        <!-- Overlay Play / Pause Control Button -->
        <button class="btn-play-pause-video absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-transform group-hover:scale-110 active:scale-95 z-10" data-card-id="${card.id}">
          <span class="material-symbols-outlined text-[32px] play-icon">play_arrow</span>
        </button>

        <!-- Auto-Pause Countdown / Timestamp indicator -->
        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-gold border border-amber-gold/30 flex items-center gap-1.5 z-10">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span>Stops at ${card.pauseTimestampSeconds}s for Verdict</span>
        </div>
      </div>

      <!-- Prompt Question -->
      <div>
        <h3 class="font-display text-base sm:text-lg font-bold text-white mb-1">${card.title}</h3>
        <p class="text-xs text-amber-gold font-mono font-bold leading-relaxed">${card.promptQuestion}</p>
      </div>

      <!-- Interactive Voting Options Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="options-${card.id}">
        ${card.options.map((opt, idx) => {
          const isSelected = card.userVote === opt.id;
          let btnStyle = 'bg-surface-bright/70 border-border text-gray-200 hover:border-sunset-coral/50';
          if (isVoted) {
            if (opt.isCorrect) btnStyle = 'bg-mint-green/20 border-mint-green text-mint-green font-bold shadow-sm';
            else if (isSelected) btnStyle = 'bg-sunset-coral/20 border-sunset-coral text-sunset-coral';
            else btnStyle = 'bg-surface-bright/30 border-border/40 text-gray-500 opacity-60';
          }

          return `
            <button class="btn-watch-play-vote p-3 rounded-xl border text-left text-xs font-bold transition-all active:scale-98 flex items-start gap-2.5 ${btnStyle}" data-card-id="${card.id}" data-opt-id="${opt.id}" ${isVoted ? 'disabled' : ''}>
              <span class="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-[10px] font-mono shrink-0">${String.fromCharCode(65 + idx)}</span>
              <span class="leading-snug">${opt.text}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Payoff Reveal Box -->
      ${isVoted ? `
        <div class="p-3.5 rounded-xl bg-[#0B141A] border border-mint-green/40 flex flex-col gap-1.5 animate-fadeIn">
          <div class="flex items-center gap-2 text-mint-green text-xs font-bold font-mono">
            <span>${isCorrect ? '🎉 SPOT ON!' : '❌ BUSTED!'}</span>
            <span>· Payoff Revealed</span>
          </div>
          <p class="text-xs text-gray-300 font-mono leading-relaxed">${card.revealText}</p>
        </div>
      ` : ''}

      <!-- Bottom Card Metadata & Likes -->
      <div class="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-gray-400 font-mono">
        <div class="flex items-center gap-3">
          <button class="btn-like-card flex items-center gap-1 hover:text-sunset-coral transition-colors" data-card-id="${card.id}">
            <span class="material-symbols-outlined text-[16px]">favorite</span>
            <span>${card.likesCount}</span>
          </button>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">forum</span>
            <span>420 Comments</span>
          </span>
        </div>

        <button class="btn-share-watch-card flex items-center gap-1 text-white hover:text-amber-gold transition-colors font-bold" data-card-id="${card.id}">
          <span class="material-symbols-outlined text-[16px]">share</span>
          <span>Challenge Group</span>
        </button>
      </div>

    </div>
  `;
}

export function bindWatchPlayCardEvents(container, onVoteCallback) {
  if (!container) return;

  // Play / Pause Video
  container.querySelectorAll('.btn-play-pause-video').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardId = btn.getAttribute('data-card-id');
      const video = document.getElementById(`video-${cardId}`);
      const icon = btn.querySelector('.play-icon');

      if (video) {
        if (video.paused) {
          audio.playClick();
          video.play();
          if (icon) icon.textContent = 'pause';
          btn.classList.add('opacity-0', 'hover:opacity-100');
        } else {
          video.pause();
          if (icon) icon.textContent = 'play_arrow';
          btn.classList.remove('opacity-0');
        }
      }
    });
  });

  // Vote Option
  container.querySelectorAll('.btn-watch-play-vote').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardId = btn.getAttribute('data-card-id');
      const optId = btn.getAttribute('data-opt-id');
      audio.playChime();
      if (onVoteCallback) onVoteCallback(cardId, optId);
    });
  });

  // Like button
  container.querySelectorAll('.btn-like-card').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playBip();
      const span = btn.querySelector('span:last-child');
      if (span) span.innerText = parseInt(span.innerText, 10) + 1;
      btn.classList.add('text-sunset-coral');
    });
  });
}
