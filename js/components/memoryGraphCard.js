// ==============================================================================
// BONDFIRE MEMORY GRAPH CARD COMPONENT (js/components/memoryGraphCard.js)
// Human-Meaning Structured Memory Node with User-Controlled Consent:
// Approve, Edit, Ignore, Delete
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';
import { MemoryGraphService } from '../services/memoryGraphService.js';

export function renderMemoryGraphNode(node) {
  const isApproved = node.status === 'APPROVED';
  const isPending = node.status === 'PENDING_APPROVAL';
  const isIgnored = node.status === 'IGNORED';

  const categoryIcons = {
    QUOTES: 'format_quote',
    FOOD: 'restaurant',
    RUNNING_JOKES: 'sentiment_very_satisfied',
    PLACES: 'pin_drop',
    SONGS: 'music_note',
    PEOPLE: 'person',
    EVENTS: 'celebration'
  };

  const categoryColors = {
    QUOTES: 'text-amber-gold bg-amber-gold/15 border-amber-gold/30',
    FOOD: 'text-sunset-coral bg-sunset-coral/15 border-sunset-coral/30',
    RUNNING_JOKES: 'text-mint-green bg-mint-green/15 border-mint-green/30',
    PLACES: 'text-blue-400 bg-blue-400/15 border-blue-400/30',
    SONGS: 'text-purple-400 bg-purple-400/15 border-purple-400/30',
    PEOPLE: 'text-pink-400 bg-pink-400/15 border-pink-400/30',
    EVENTS: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/30'
  };

  const catStyle = categoryColors[node.category] || 'text-gray-300 bg-white/10 border-white/20';
  const catIcon = categoryIcons[node.category] || 'memory';

  return `
    <div class="p-4 rounded-2xl bg-surface border ${isApproved ? 'border-border' : isPending ? 'border-amber-gold/50 bg-amber-gold/5 shadow-glow-amber' : 'border-border/40 opacity-60'} transition-all flex flex-col justify-between gap-3 group" data-node-id="${node.id}">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border flex items-center gap-1 ${catStyle}">
            <span class="material-symbols-outlined text-[13px]">${catIcon}</span>
            <span>${node.category}</span>
          </span>
          <span class="text-[10px] font-mono text-gray-500">${node.eventDate || 'Verified 2024'}</span>
        </div>

        <h4 class="font-bold text-sm text-white leading-snug mb-1 group-hover:text-amber-gold transition-colors">${node.title}</h4>
        ${node.contextSnippet ? `<p class="text-xs text-gray-400 font-mono leading-relaxed line-clamp-2">${node.contextSnippet}</p>` : ''}
      </div>

      <!-- Action Consent Chips: Approve / Ignore / Delete -->
      <div class="pt-2.5 border-t border-border/60 flex items-center justify-between gap-1 flex-wrap">
        <div class="flex items-center gap-1">
          ${isPending ? `
            <button class="btn-node-approve px-2.5 py-1 rounded-lg bg-mint-green/20 hover:bg-mint-green/30 text-mint-green font-bold text-[10px] border border-mint-green/40 transition-all active:scale-95 flex items-center gap-1" data-id="${node.id}">
              <span class="material-symbols-outlined text-[12px]">check</span>
              <span>Approve</span>
            </button>
          ` : `
            <span class="text-[10px] font-mono text-mint-green flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]">verified</span>
              <span>In Lore</span>
            </span>
          `}

          <button class="btn-node-ignore px-2 py-1 rounded-lg bg-surface-bright hover:bg-surface-container-high text-gray-400 hover:text-white font-bold text-[10px] border border-border transition-all active:scale-95" data-id="${node.id}">
            ${isIgnored ? 'Unhide' : 'Hide'}
          </button>
        </div>

        <button class="btn-node-delete text-gray-500 hover:text-red-400 p-1 rounded transition-colors" data-id="${node.id}" title="Permanently remove">
          <span class="material-symbols-outlined text-[15px]">delete</span>
        </button>
      </div>
    </div>
  `;
}

export function bindMemoryGraphEvents(container) {
  if (!container) return;

  container.querySelectorAll('.btn-node-approve').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      audio.playChime();
      MemoryGraphService.approveNode(id);
    });
  });

  container.querySelectorAll('.btn-node-ignore').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      audio.playBip();
      MemoryGraphService.ignoreNode(id);
    });
  });

  container.querySelectorAll('.btn-node-delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      audio.playClick();
      MemoryGraphService.deleteNode(id);
    });
  });
}
