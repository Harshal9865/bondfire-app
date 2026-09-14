// ==============================================================================
// THE REAL PHOTO ALBUM & PHOTOBOOK STUDIO (Screen 3)
// 100% Real, Dynamic & Interactive Keepsake Studio:
// - Live Photo Uploads (File picker & Camera Capture)
// - Custom Captions, Camper Tags, Polaroid Themes (Warm, Cyber, Gold, Vintage)
// - 3D Layflat Book Flipping Mode + Polaroid Pinboard Collage Wall
// - Interactive Sticker Stamps (🔥, 💖, 💀, 🏆, 🤫, 🎉) & Heart Likes
// - Printable PDF Keepsake Export & Store Order Bridge
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';
import { openPaymentModal } from './demoPaymentModal.js';

let confettiInstance = null;
let currentSpread = 0; // 0: Pages 1-2 | 1: Pages 3-4 | etc.
let activeStudioMode = 'LAYFLAT'; // 'LAYFLAT' | 'PINBOARD'
let selectedUploadFile = null;
let activeLightboxMemory = null;

export function renderYearbookScreen() {
  const state = store.getState();
  const room = state.activeRoom || { id: 'BONDFIRE', podName: 'Our Squad Pod', roomCode: 'BOND' };
  const memories = state.albumMemories || store.getDefaultAlbumMemories();
  const totalSpreads = Math.max(1, Math.ceil(memories.length / 2));

  // Ensure currentSpread stays in bounds
  if (currentSpread >= totalSpreads) {
    currentSpread = Math.max(0, totalSpreads - 1);
  }

  // Get the 2 memories for current spread
  const leftMemory = memories[currentSpread * 2] || null;
  const rightMemory = memories[currentSpread * 2 + 1] || null;

  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto select-none" id="yearbook-root">
      
      <!-- Top Breadcrumb & Studio Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-[#262B40]/80 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>REAL PHOTO ALBUM STUDIO // ARCHIVAL KEEPSAKE</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ${room.podName || 'The Campfire'} Memory Studio
          </h1>
          <p class="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Room #${room.roomCode || 'BOND'} · ${memories.length} Real Memories Preserved · Archival 240GSM Luster
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <button id="btn-open-upload-modal" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs shadow-glow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>Drop Memory</span>
          </button>

          <button id="btn-print-keepsake" class="px-3.5 py-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="Print or Export PDF Keepsake">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span class="hidden sm:inline">Print Keepsake</span>
          </button>

          <a href="#/STORE" class="px-3.5 py-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-amber-gold border border-amber-gold/30 hover:border-amber-gold text-xs font-mono font-bold transition-all flex items-center gap-1.5" title="Order Physical Hardcover Edition">
            <span class="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span class="hidden sm:inline">Order Book</span>
          </a>

          <button id="btn-back-home" class="p-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-400 hover:text-white border border-[#2B3147] transition-colors cursor-pointer" title="Back to Home">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <!-- VIEW MODE SWITCHER & PAGE CONTROLS BAR -->
      <div class="flex flex-col sm:flex-row items-center justify-between bg-[#121522] border border-[#2B3147] p-3 rounded-2xl mb-6 gap-3">
        
        <!-- Mode Tabs -->
        <div class="flex items-center gap-1.5 bg-[#0B0E17] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
          <button id="tab-mode-layflat" class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeStudioMode === 'LAYFLAT' ? 'bg-amber-gold text-dark shadow-md' : 'text-gray-400 hover:text-white'}">
            <span class="material-symbols-outlined text-[15px]">menu_book</span>
            <span>3D Layflat Book</span>
          </button>
          <button id="tab-mode-pinboard" class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeStudioMode === 'PINBOARD' ? 'bg-amber-gold text-dark shadow-md' : 'text-gray-400 hover:text-white'}">
            <span class="material-symbols-outlined text-[15px]">grid_view</span>
            <span>Polaroid Pinboard</span>
          </button>
        </div>

        ${activeStudioMode === 'LAYFLAT' ? `
          <!-- Page Spread Controls -->
          <div class="flex items-center gap-3 justify-between w-full sm:w-auto">
            <button id="btn-prev-spread" class="px-3.5 py-1.5 rounded-xl bg-surface-bright hover:bg-[#202538] border border-border text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer ${currentSpread === 0 ? 'opacity-35 pointer-events-none' : ''}">
              <span class="material-symbols-outlined text-[16px]">chevron_left</span>
              <span>Prev</span>
            </button>

            <span class="text-xs font-mono font-bold text-amber-gold px-2">
              SPREAD ${currentSpread + 1} OF ${totalSpreads} (PAGES ${(currentSpread * 2) + 1}–${(currentSpread * 2) + 2})
            </span>

            <button id="btn-next-spread" class="px-3.5 py-1.5 rounded-xl bg-surface-bright hover:bg-[#202538] border border-border text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer ${currentSpread >= totalSpreads - 1 ? 'opacity-35 pointer-events-none' : ''}">
              <span>Next</span>
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        ` : `
          <div class="text-xs font-mono text-gray-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-mint-green animate-pulse"></span>
            <span>INTERACTIVE PINBOARD // TAP ANY PHOTO TO ZOOM &amp; STAMP</span>
          </div>
        `}
      </div>

      <!-- MAIN STUDIO WORKSPACE -->
      <div id="photobook-print-region">
        ${activeStudioMode === 'LAYFLAT' ? renderLayflatSpread(leftMemory, rightMemory, currentSpread, totalSpreads) : renderPinboardWall(memories)}
      </div>

      <!-- ALBUM FOOTER QUICK BAR -->
      <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 mt-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold shrink-0">
            <span class="material-symbols-outlined text-[24px]">local_fire_department</span>
          </div>
          <div>
            <h4 class="font-display font-bold text-white text-base">Campfire Sparks Synced</h4>
            <p class="text-xs text-gray-400 font-mono mt-0.5">Every photo uploaded grants +25 Sparks to all room campers.</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-quick-add-bottom" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>Add Another Memory</span>
          </button>
        </div>
      </div>

      <!-- INTERACTIVE PHOTO UPLOAD MODAL -->
      <div id="modal-upload-memory" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-lg rounded-3xl bg-[#131726] border border-[#2B3147] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-2xl">add_a_photo</span>
              <h3 class="font-display text-xl font-bold text-white">Drop a Campfire Memory</h3>
            </div>
            <button id="btn-close-upload-modal" class="p-1.5 rounded-lg bg-surface-bright hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Image Drop / Picker Area -->
          <div id="dropzone-upload" class="border-2 border-dashed border-gray-600 hover:border-amber-gold rounded-2xl p-6 text-center cursor-pointer transition-colors mb-4 bg-[#0E111D] relative group">
            <input type="file" id="input-photo-file" accept="image/*" class="hidden" />
            
            <div id="upload-placeholder-content">
              <span class="material-symbols-outlined text-4xl text-gray-400 group-hover:text-amber-gold group-hover:scale-110 transition-transform">cloud_upload</span>
              <p class="text-sm font-bold text-gray-200 mt-2">Click to select photo or drag here</p>
              <p class="text-xs text-gray-500 font-mono mt-1">JPEG, PNG, WEBP, GIF up to 10MB</p>
            </div>

            <div id="upload-preview-container" class="hidden relative w-full h-48 rounded-xl overflow-hidden">
              <img id="upload-preview-img" src="" class="w-full h-full object-cover" alt="Preview" />
              <button id="btn-clear-preview" class="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-3.5 text-left">
            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Memory Title</label>
              <input type="text" id="input-memory-title" placeholder="e.g. 2 AM Maggie Noodles &amp; Spilled Chai" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Story / Quote / Confession</label>
              <textarea id="input-memory-caption" rows="3" placeholder="What happened here? What is the unedited squad verdict?" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none transition-colors"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Camper Tags</label>
                <input type="text" id="input-memory-tags" placeholder="Aarav, Priya, Host" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-xs outline-none" />
              </div>

              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Polaroid Theme</label>
                <select id="select-memory-theme" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-xs outline-none">
                  <option value="POLAROID_WARM">Warm Campfire Amber</option>
                  <option value="POLAROID_CYBER">Cyber Neon Cyan</option>
                  <option value="POLAROID_GOLD">24k Gold Luster</option>
                  <option value="POLAROID_VINTAGE">Vintage Sepia</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button id="btn-submit-memory" class="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-sm uppercase tracking-wider shadow-glow-coral hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">save</span>
            <span>Permanently Archive Memory</span>
          </button>
        </div>
      </div>

      <!-- LIGHTBOX MODAL FOR ZOOM & STICKERS -->
      <div id="modal-lightbox" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-2xl rounded-3xl bg-[#121522] border border-[#2B3147] p-6 sm:p-8 shadow-2xl relative" id="lightbox-content">
          <!-- Populated dynamically -->
        </div>
      </div>

    </div>
  `;
}

/**
 * Renders 3D Layflat Double-Page Spread
 */
function renderLayflatSpread(leftMem, rightMem, spreadIndex, totalSpreads) {
  const leftPageNum = (spreadIndex * 2) + 1;
  const rightPageNum = (spreadIndex * 2) + 2;

  return `
    <div class="relative w-full rounded-[36px] bg-gradient-to-b from-[#151928] to-[#0E121E] p-6 sm:p-10 border border-[#2B3147] shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_50px_rgba(255,183,3,0.1)] overflow-hidden">
      
      <!-- Book Spine Center Fold Simulation -->
      <div class="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/70 to-black/40 pointer-events-none z-30 shadow-inner"></div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-20">
        
        <!-- LEFT PAGE -->
        ${leftMem ? renderBookPage(leftMem, leftPageNum, 'left') : renderEmptyBookPage(leftPageNum)}

        <!-- RIGHT PAGE -->
        ${rightMem ? renderBookPage(rightMem, rightPageNum, 'right') : renderEmptyBookPage(rightPageNum)}

      </div>
    </div>
  `;
}

/**
 * Individual Photobook Page Markup
 */
function renderBookPage(mem, pageNum, side) {
  const themeClass = getThemeClass(mem.theme);

  return `
    <div class="rounded-2xl bg-[#181C2B] border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[500px]">
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

      <div>
        <div class="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
          <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">
            ARCHIVE ENTRY #${mem.id.slice(-4)} // ${mem.theme.replace('POLAROID_', '')}
          </span>
          <span class="text-xs font-mono text-gray-400">PAGE ${pageNum}</span>
        </div>

        <!-- Polaroid Visual Frame -->
        <div class="polaroid-card ${themeClass} p-3.5 pb-5 rounded-xl shadow-xl max-w-md mx-auto mb-5 cursor-pointer group hover:scale-[1.02] transition-transform" data-id="${mem.id}">
          <div class="polaroid-tape"></div>
          <div class="w-full h-56 rounded-lg overflow-hidden mb-3 bg-black relative">
            <img src="${mem.imageUrl}" alt="${mem.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-mono text-gray-300">
              ${mem.date}
            </div>
          </div>
          
          <h3 class="font-display font-black text-sm tracking-tight truncate">${mem.title}</h3>
          
          <!-- Camper Tags -->
          <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
            ${(mem.camperTags || []).map(t => `
              <span class="px-2 py-0.5 rounded-md bg-black/10 text-[9.5px] font-mono font-bold">${t}</span>
            `).join('')}
          </div>
        </div>

        <!-- Story Quote Box -->
        <div class="p-4 rounded-2xl bg-[#121522] border border-[#2B3147] relative">
          <p class="text-xs sm:text-sm text-gray-200 italic font-sans leading-relaxed">
            "${mem.caption || 'No caption recorded for this memory.'}"
          </p>
          <div class="flex items-center justify-between mt-3 text-[10px] font-mono text-gray-400">
            <span>By: <strong class="text-white">${mem.author || 'Squad'}</strong></span>
            <span class="text-amber-gold font-bold">VERIFIED MEMORY</span>
          </div>
        </div>

        <!-- Sticker Stamps Strip & Like Button -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono text-gray-500">Stamps:</span>
            ${(mem.stickers || []).map(stk => `
              <span class="text-sm bg-white/5 px-2 py-0.5 rounded-md border border-white/10" title="Squad stamp">${stk}</span>
            `).join('')}
            <button class="btn-stamp-picker text-xs font-mono text-amber-gold hover:text-white px-2 py-0.5 rounded bg-amber-gold/15 border border-amber-gold/30 hover:bg-amber-gold/25 cursor-pointer ml-1" data-id="${mem.id}">
              + Stamp
            </button>
          </div>

          <button class="btn-like-memory flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition-all cursor-pointer active:scale-90" data-id="${mem.id}">
            <span>❤️</span>
            <span>${mem.likes || 0}</span>
          </button>
        </div>

      </div>

      <div class="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
        <span>Bondfire Keepsake Vol. 1</span>
        <span>Layflat Double-Luster</span>
      </div>
    </div>
  `;
}

/**
 * Blank / Placeholder Page for odd counts
 */
function renderEmptyBookPage(pageNum) {
  return `
    <div class="rounded-2xl bg-[#141724] border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[500px]">
      <span class="material-symbols-outlined text-4xl text-gray-600 mb-3">add_photo_alternate</span>
      <h4 class="font-display font-bold text-gray-400 text-base">Empty Archival Page</h4>
      <p class="text-xs text-gray-500 font-mono max-w-xs mt-1">
        Page ${pageNum} is ready for new memories. Click "Drop Memory" above to add your photos.
      </p>
    </div>
  `;
}

/**
 * Freeform Polaroid Pinboard Wall
 */
function renderPinboardWall(memories) {
  const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[-3deg]'];

  return `
    <div class="w-full rounded-[36px] bg-[#121522]/90 border border-[#2B3147] p-6 sm:p-10 shadow-2xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${memories.map((mem, idx) => {
          const rot = rotations[idx % rotations.length];
          const themeClass = getThemeClass(mem.theme);

          return `
            <div class="polaroid-card ${themeClass} ${rot} p-3 pb-5 rounded-xl shadow-xl cursor-pointer group hover:scale-105 transition-all" data-id="${mem.id}">
              <div class="polaroid-tape"></div>
              
              <div class="w-full h-48 rounded-lg overflow-hidden mb-2.5 bg-black relative">
                <img src="${mem.imageUrl}" alt="${mem.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div class="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-gray-300">
                  ${mem.date}
                </div>
              </div>

              <h4 class="font-display font-black text-xs sm:text-sm tracking-tight truncate">${mem.title}</h4>
              <p class="text-[11px] font-sans line-clamp-2 opacity-80 mt-1">${mem.caption}</p>

              <!-- Footer with stamps & likes -->
              <div class="flex items-center justify-between mt-3 pt-2 border-t border-black/10 text-[10px] font-mono">
                <div class="flex items-center gap-1">
                  ${(mem.stickers || []).slice(0, 3).map(s => `<span>${s}</span>`).join('')}
                </div>
                <div class="flex items-center gap-1 text-rose-500 font-bold">
                  <span>❤️ ${mem.likes || 0}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function getThemeClass(theme) {
  switch (theme) {
    case 'POLAROID_CYBER': return 'polaroid-theme-cyber';
    case 'POLAROID_GOLD': return 'polaroid-theme-gold';
    case 'POLAROID_VINTAGE': return 'polaroid-theme-vintage';
    case 'POLAROID_WARM':
    default: return 'polaroid-theme-warm';
  }
}

export function bindYearbookEvents() {
  if (!confettiInstance) {
    confettiInstance = new ConfettiEngine('confetti-canvas');
  }

  // Back button
  const backBtn = document.getElementById('btn-back-home');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      audio.playClick();
      window.location.hash = '#/HOME';
    });
  }

  // View Mode Tabs
  const tabLayflat = document.getElementById('tab-mode-layflat');
  const tabPinboard = document.getElementById('tab-mode-pinboard');

  if (tabLayflat) {
    tabLayflat.addEventListener('click', () => {
      audio.playClick();
      activeStudioMode = 'LAYFLAT';
      reRenderStudio();
    });
  }

  if (tabPinboard) {
    tabPinboard.addEventListener('click', () => {
      audio.playClick();
      activeStudioMode = 'PINBOARD';
      reRenderStudio();
    });
  }

  // Spread Flipper Buttons
  const btnPrev = document.getElementById('btn-prev-spread');
  const btnNext = document.getElementById('btn-next-spread');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSpread > 0) {
        audio.playClick();
        currentSpread--;
        reRenderStudio();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const memories = store.getState().albumMemories || [];
      const totalSpreads = Math.max(1, Math.ceil(memories.length / 2));
      if (currentSpread < totalSpreads - 1) {
        audio.playClick();
        currentSpread++;
        reRenderStudio();
      }
    });
  }

  // Print Keepsake
  const printBtn = document.getElementById('btn-print-keepsake');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      audio.playChime();
      window.print();
    });
  }

  // Upload Modal Open & Close
  const modalUpload = document.getElementById('modal-upload-memory');
  const openUploadBtns = [
    document.getElementById('btn-open-upload-modal'),
    document.getElementById('btn-quick-add-bottom')
  ].filter(Boolean);

  openUploadBtns.forEach(b => {
    b.addEventListener('click', () => {
      audio.playClick();
      if (modalUpload) modalUpload.classList.remove('hidden');
    });
  });

  const closeUploadBtn = document.getElementById('btn-close-upload-modal');
  if (closeUploadBtn && modalUpload) {
    closeUploadBtn.addEventListener('click', () => {
      audio.playClick();
      modalUpload.classList.add('hidden');
    });
  }

  // Dropzone file handling
  const dropzone = document.getElementById('dropzone-upload');
  const fileInput = document.getElementById('input-photo-file');
  const placeholderContent = document.getElementById('upload-placeholder-content');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('upload-preview-img');
  const clearPreviewBtn = document.getElementById('btn-clear-preview');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target !== clearPreviewBtn && !clearPreviewBtn?.contains(e.target)) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageFile(file);
      }
    });

    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-amber-gold');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-amber-gold');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-amber-gold');
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleImageFile(file);
      }
    });
  }

  function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      selectedUploadFile = ev.target.result;
      if (previewImg) previewImg.src = selectedUploadFile;
      if (placeholderContent) placeholderContent.classList.add('hidden');
      if (previewContainer) previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  if (clearPreviewBtn) {
    clearPreviewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedUploadFile = null;
      if (fileInput) fileInput.value = '';
      if (placeholderContent) placeholderContent.classList.remove('hidden');
      if (previewContainer) previewContainer.classList.add('hidden');
    });
  }

  // Submit New Memory
  const submitBtn = document.getElementById('btn-submit-memory');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const titleInput = document.getElementById('input-memory-title');
      const captionInput = document.getElementById('input-memory-caption');
      const tagsInput = document.getElementById('input-memory-tags');
      const themeSelect = document.getElementById('select-memory-theme');

      const title = titleInput?.value.trim() || 'Campfire Memory Snap';
      const caption = captionInput?.value.trim() || 'Laughter and stories around the warm embers.';
      const tags = tagsInput?.value ? tagsInput.value.split(',').map(s => s.trim()).filter(Boolean) : ['Host (You)'];
      const theme = themeSelect?.value || 'POLAROID_WARM';

      // Default sample photo if no image was selected
      const samplePhotos = [
        'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
      ];
      const imageUrl = selectedUploadFile || samplePhotos[Math.floor(Math.random() * samplePhotos.length)];

      // Add to store
      audio.playCameraSnap();
      store.addAlbumMemory({
        title,
        caption,
        imageUrl,
        camperTags: tags,
        theme,
        stickers: ['🔥']
      });

      // Reward +25 sparks
      store.claimDailySparks();

      confettiInstance.burst(50, 1);
      if (modalUpload) modalUpload.classList.add('hidden');

      // Reset form
      if (titleInput) titleInput.value = '';
      if (captionInput) captionInput.value = '';
      if (tagsInput) tagsInput.value = '';
      selectedUploadFile = null;
      if (placeholderContent) placeholderContent.classList.remove('hidden');
      if (previewContainer) previewContainer.classList.add('hidden');

      reRenderStudio();
    });
  }

  // Like Memory Buttons
  const likeBtns = document.querySelectorAll('.btn-like-memory');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      audio.playChime();
      store.likeAlbumMemory(id);
      reRenderStudio();
    });
  });

  // Stamp Picker Buttons
  const stampBtns = document.querySelectorAll('.btn-stamp-picker');
  stampBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const stickers = ['🔥', '💖', '💀', '🏆', '🤫', '🎉'];
      const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
      audio.playClick();
      store.addAlbumMemorySticker(id, randomSticker);
      reRenderStudio();
    });
  });

  // Polaroid Card Click (Open Lightbox)
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      const id = p.dataset.id;
      const memory = (store.getState().albumMemories || []).find(m => m.id === id);
      if (memory) {
        openLightbox(memory);
      }
    });
  });

  function openLightbox(memory) {
    const modalLightbox = document.getElementById('modal-lightbox');
    const content = document.getElementById('lightbox-content');
    if (!modalLightbox || !content) return;

    audio.playClick();
    content.innerHTML = `
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <h3 class="font-display text-xl font-bold text-white">${memory.title}</h3>
        <button id="btn-close-lightbox" class="p-1.5 rounded-lg bg-surface-bright hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div class="w-full h-80 rounded-2xl overflow-hidden bg-black mb-4">
        <img src="${memory.imageUrl}" class="w-full h-full object-contain" alt="${memory.title}" />
      </div>

      <p class="text-sm text-gray-300 italic font-sans mb-4 leading-relaxed">"${memory.caption}"</p>

      <div class="flex items-center justify-between pt-4 border-t border-white/10">
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-gray-400">Add Stamp:</span>
          ${['🔥', '💖', '💀', '🏆', '🎉'].map(stk => `
            <button class="btn-lightbox-stamp text-lg p-1 hover:scale-125 transition-transform cursor-pointer" data-id="${memory.id}" data-sticker="${stk}">${stk}</button>
          `).join('')}
        </div>

        <button class="btn-delete-memory text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer" data-id="${memory.id}">
          <span class="material-symbols-outlined text-[16px]">delete</span>
          <span>Remove Photo</span>
        </button>
      </div>
    `;

    modalLightbox.classList.remove('hidden');

    const closeBtn = document.getElementById('btn-close-lightbox');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalLightbox.classList.add('hidden'));
    }

    const deleteBtn = content.querySelector('.btn-delete-memory');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        audio.playClick();
        store.deleteAlbumMemory(memory.id);
        modalLightbox.classList.add('hidden');
        reRenderStudio();
      });
    }

    const stampOptions = content.querySelectorAll('.btn-lightbox-stamp');
    stampOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const stk = opt.dataset.sticker;
        audio.playClick();
        store.addAlbumMemorySticker(memory.id, stk);
        modalLightbox.classList.add('hidden');
        reRenderStudio();
      });
    });
  }

  function reRenderStudio() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'YEARBOOK') {
      mount.innerHTML = renderYearbookScreen();
      bindYearbookEvents();
    }
  }
}
