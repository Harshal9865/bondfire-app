// ==============================================================================
// THE REAL PHOTO ALBUM & PHOTOBOOK STUDIO (Screen 3)
// 100% Real, Dynamic, User-Driven Memory Engine:
// 1. First asks user to upload photos (multi-file dropzone & camera)
// 2. Automatically generates 3D Layflat Photobook & Polaroid Pinboard
// 3. Empowers user to write memory stories, titles, camper tags & stickers
// 4. ZERO HARDCODED MOCKS - Everything is generated from user photos!
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;
let currentSpread = 0; // 0: Pages 1-2 | 1: Pages 3-4 | etc.
let activeStudioMode = 'LAYFLAT'; // 'LAYFLAT' | 'PINBOARD'
let queuedPhotos = []; // Array of DataURLs/files selected before generating
let editingMemoryId = null; // Memory currently open in the Story Writer modal

export function renderYearbookScreen() {
  const state = store.getState();
  const memories = state.albumMemories || [];
  const albumTitle = state.albumTitle || 'Our Squad Keepsake Album';

  // If user has not uploaded any photos yet, prompt them to upload and auto-generate!
  if (memories.length === 0) {
    return renderUploadOnboarding(state);
  }

  // Calculate spreads
  const totalSpreads = Math.max(1, Math.ceil(memories.length / 2));
  if (currentSpread >= totalSpreads) {
    currentSpread = Math.max(0, totalSpreads - 1);
  }

  const leftMemory = memories[currentSpread * 2] || null;
  const rightMemory = memories[currentSpread * 2 + 1] || null;

  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-6 pb-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto select-none" id="yearbook-root">
      
      <!-- Top Breadcrumb & Studio Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-[#262B40]/80 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span class="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>SQUAD PHOTOBOOK STUDIO</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ${albumTitle}
          </h1>
          <p class="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            ${memories.length} photos curated · Double-page 3D layflat &amp; polaroid wall
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <button id="btn-add-more-photos" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-xs shadow-glow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>+ Add Photos</span>
          </button>

          <button id="btn-print-keepsake" class="px-3.5 py-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-gray-300 hover:text-white border border-[#2B3147] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="Print or Export PDF Keepsake">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span class="hidden sm:inline">Print Keepsake</span>
          </button>

          <button id="btn-start-new-album" class="px-3.5 py-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="Create New Album">
            <span class="material-symbols-outlined text-[16px]">refresh</span>
            <span class="hidden sm:inline">New Album</span>
          </button>

          <a href="#/STORE" class="px-3.5 py-2.5 rounded-xl bg-[#141826] hover:bg-[#202538] text-amber-gold border border-amber-gold/30 hover:border-amber-gold text-xs font-mono font-bold transition-all flex items-center gap-1.5" title="Order Physical Hardcover Edition">
            <span class="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span class="hidden sm:inline">Order Book ($38)</span>
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
            <span>INTERACTIVE PINBOARD // CLICK "WRITE STORY" ON ANY CARD</span>
          </div>
        `}
      </div>

      <!-- MAIN STUDIO WORKSPACE -->
      <div id="photobook-print-region">
        ${activeStudioMode === 'LAYFLAT' ? renderLayflatSpread(leftMemory, rightMemory, currentSpread, totalSpreads) : renderPinboardWall(memories)}
      </div>

      <!-- INLINE STORY WRITER MODAL -->
      <div id="modal-edit-story" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-lg rounded-3xl bg-[#131726] border border-[#2B3147] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-gold text-2xl">edit_note</span>
              <h3 class="font-display text-xl font-bold text-white">Write Memory Story</h3>
            </div>
            <button id="btn-close-story-modal" class="p-1.5 rounded-lg bg-surface-bright hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Memory Preview Mini Thumbnail -->
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#0B0E17] border border-white/5 mb-4">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0">
              <img id="story-modal-thumb" src="" class="w-full h-full object-cover" alt="Thumb" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-mono text-gray-400 uppercase">ARCHIVED ENTRY</span>
              <h4 id="story-modal-heading" class="font-display font-bold text-white text-sm truncate">Memory Title</h4>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 text-left">
            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Memory Title</label>
              <input type="text" id="input-edit-title" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none" placeholder="e.g. 3 AM Chai Incident" />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase">What happened here? (Story / Quote)</label>
              </div>
              <textarea id="input-edit-caption" rows="3" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none leading-relaxed" placeholder="Write the inside joke, confession, or what made this moment unforgettable..."></textarea>
              
              <!-- Quick Prompt Suggestions -->
              <div class="flex items-center gap-1.5 flex-wrap mt-2">
                <span class="text-[10px] font-mono text-gray-500">Quick Sparks:</span>
                <button class="btn-prompt-chip text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-amber-gold border border-white/10 cursor-pointer" data-text="The moment we realized nobody knew the route back.">"The moment we realized..."</button>
                <button class="btn-prompt-chip text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-sunset-coral border border-white/10 cursor-pointer" data-text="Unanimous verdict: officially the funniest memory of the trip.">"Unanimous verdict..."</button>
                <button class="btn-prompt-chip text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-mint-green border border-white/10 cursor-pointer" data-text="3 AM confession: someone lost the room keycard inside the sand.">"3 AM confession..."</button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Camper Tags</label>
                <input type="text" id="input-edit-tags" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-xs outline-none" placeholder="Aarav, Priya, Host" />
              </div>

              <div>
                <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Polaroid Theme</label>
                <select id="select-edit-theme" class="w-full px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-xs outline-none">
                  <option value="POLAROID_WARM">Warm Campfire Amber</option>
                  <option value="POLAROID_CYBER">Cyber Neon Cyan</option>
                  <option value="POLAROID_GOLD">24k Gold Luster</option>
                  <option value="POLAROID_VINTAGE">Vintage Sepia</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button id="btn-save-story" class="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-black text-sm uppercase tracking-wider shadow-glow-coral hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">check</span>
            <span>Save Memory Story</span>
          </button>
        </div>
      </div>

      <!-- ADD MORE PHOTOS MODAL -->
      <div id="modal-add-more" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="w-full max-w-lg rounded-3xl bg-[#131726] border border-[#2B3147] p-6 sm:p-8 shadow-2xl relative">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <h3 class="font-display text-xl font-bold text-white">Add More Photos to Album</h3>
            <button id="btn-close-add-more" class="p-1.5 rounded-lg bg-surface-bright text-gray-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div id="dropzone-add-more" class="border-2 border-dashed border-gray-600 hover:border-amber-gold rounded-2xl p-6 text-center cursor-pointer transition-colors mb-4 bg-[#0E111D]">
            <input type="file" id="input-add-more-files" multiple accept="image/*" class="hidden" />
            <span class="material-symbols-outlined text-4xl text-gray-400">cloud_upload</span>
            <p class="text-sm font-bold text-gray-200 mt-2">Select photos to append to this album</p>
            <p class="text-xs text-gray-500 font-mono mt-1">Upload any number of pictures</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * Step 1: Onboarding Stage - Prompts User to Upload Photos First
 */
function renderUploadOnboarding(state) {
  const room = state.activeRoom || {};

  return `
    <div class="min-h-screen bg-[#0B0E17] text-white pt-8 pb-28 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto select-none">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-gold/15 border border-amber-gold/30 text-amber-gold text-xs font-mono font-bold tracking-widest uppercase mb-4">
          <span class="material-symbols-outlined text-[16px]">auto_stories</span>
          <span>SQUAD PHOTOBOOK STUDIO</span>
        </div>
        
        <h1 class="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Create Your Squad Photobook
        </h1>
        
        <p class="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          Select photos from your device. Bondfire automatically curates them into an elegant 3D layflat album and polaroid pinboard, ready for your stories and keepsakes.
        </p>

        <!-- 3-Step Simple Flow Guide -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6 text-left">
          <div class="p-3 rounded-2xl bg-surface border border-border/80 flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-gold/15 text-amber-gold border border-amber-gold/30 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">1. Select Photos</div>
              <div class="text-[10px] text-gray-400">Add any pictures from your device</div>
            </div>
          </div>
          <div class="p-3 rounded-2xl bg-surface border border-border/80 flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-sunset-coral/15 text-sunset-coral border border-sunset-coral/30 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">2. Auto-Arrangement</div>
              <div class="text-[10px] text-gray-400">3D layflat book &amp; polaroid wall</div>
            </div>
          </div>
          <div class="p-3 rounded-2xl bg-surface border border-border/80 flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-mint-green/15 text-mint-green border border-mint-green/30 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">3. Write Stories</div>
              <div class="text-[10px] text-gray-400">Add inside jokes &amp; print PDF</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Generator Card -->
      <div class="rounded-3xl bg-[#121522] border border-[#2B3147] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        <!-- Multi-Photo Dropzone -->
        <div id="onboarding-dropzone" class="border-2 border-dashed border-gray-600 hover:border-amber-gold rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-[#0B0E17] group mb-6">
          <input type="file" id="onboarding-file-input" multiple accept="image/*" class="hidden" />
          
          <div class="w-16 h-16 rounded-2xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-3xl">add_photo_alternate</span>
          </div>

          <h3 class="font-display font-bold text-lg sm:text-xl text-white mb-1">
            Choose Photos from Your Device
          </h3>
          <p class="text-xs sm:text-sm text-gray-400 font-mono mb-4">
            Click here or drag &amp; drop photos (Select 1, 4, 10 or more images)
          </p>

          <span class="px-4 py-2 rounded-full bg-surface-bright border border-white/10 text-xs font-mono text-gray-300 group-hover:border-amber-gold transition-colors inline-block">
            Browse Photo Files
          </span>
        </div>

        <!-- Thumbnails of Selected Photos -->
        <div id="queued-photos-container" class="hidden mb-6">
          <div class="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span class="text-xs font-mono font-bold text-amber-gold uppercase tracking-wider" id="queued-count-badge">
              0 PHOTOS SELECTED
            </span>
            <button id="btn-clear-queued" class="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer">
              Clear All
            </button>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-6 gap-3" id="queued-thumbnails-grid">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Album Metadata Form -->
        <div class="space-y-4 text-left border-t border-white/10 pt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Album Title</label>
              <input type="text" id="input-album-title" value="${room.podName ? `${room.podName} Keepsake` : 'Campfire Memories 2026'}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none" placeholder="e.g. Goa Trip &amp; Late Night Banter" />
            </div>

            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Album Style Theme</label>
              <select id="select-album-theme" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-sm outline-none">
                <option value="POLAROID_WARM">Warm Campfire Amber (Kodak Luster)</option>
                <option value="POLAROID_CYBER">Cyber Neon Cyan (Midnight Luster)</option>
                <option value="POLAROID_GOLD">24k Gold Obsidian (Debossed Foil)</option>
                <option value="POLAROID_VINTAGE">Vintage Sepia (Nostalgic Grain)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">Campers Present</label>
            <input type="text" id="input-album-campers" value="${(room.players || []).map(p => p.name).join(', ') || 'Host (You)'}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E17] border border-[#2B3147] focus:border-amber-gold text-white text-xs outline-none" placeholder="Aarav, Priya, Sneha" />
          </div>
        </div>

        <!-- Submit Button -->
        <button id="btn-generate-album" class="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-black text-sm uppercase tracking-wider shadow-glow-coral hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>Generate Photobook Album Now</span>
        </button>

      </div>

      <!-- Quick Back Button -->
      <div class="text-center mt-6">
        <a href="#/HOME" class="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to Campfire Home
        </a>
      </div>

    </div>
  `;
}

/**
 * 3D Layflat Double-Page Spread
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
        ${leftMem ? renderBookPage(leftMem, leftPageNum) : renderEmptyBookPage(leftPageNum)}

        <!-- RIGHT PAGE -->
        ${rightMem ? renderBookPage(rightMem, rightPageNum) : renderEmptyBookPage(rightPageNum)}
      </div>
    </div>
  `;
}

/**
 * Individual Page Markup with Inline Story Writer
 */
function renderBookPage(mem, pageNum) {
  const themeClass = getThemeClass(mem.theme);
  const hasStory = mem.caption && mem.caption.trim().length > 0;

  return `
    <div class="rounded-2xl bg-[#181C2B] border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[520px]">
      <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

      <div>
        <div class="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
          <span class="text-xs font-mono text-amber-gold font-bold uppercase tracking-wider">
            ENTRY #${mem.id.slice(-4)} // USER MEMORY
          </span>
          <span class="text-xs font-mono text-gray-400">PAGE ${pageNum}</span>
        </div>

        <!-- Polaroid Frame -->
        <div class="polaroid-card ${themeClass} p-3.5 pb-5 rounded-xl shadow-xl max-w-md mx-auto mb-5 group">
          <div class="polaroid-tape"></div>
          <div class="w-full h-56 rounded-lg overflow-hidden mb-3 bg-black relative">
            <img src="${mem.imageUrl}" alt="${mem.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-mono text-gray-300">
              ${mem.date}
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <h3 class="font-display font-black text-sm tracking-tight truncate">${mem.title}</h3>
            <button class="btn-trigger-edit-story text-xs font-mono text-amber-gold hover:underline flex items-center gap-1 cursor-pointer" data-id="${mem.id}">
              <span class="material-symbols-outlined text-[14px]">edit</span>
              <span>Edit Story</span>
            </button>
          </div>
          
          <!-- Camper Tags -->
          <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
            ${(mem.camperTags || []).map(t => `
              <span class="px-2 py-0.5 rounded-md bg-black/10 text-[9.5px] font-mono font-bold">${t}</span>
            `).join('')}
          </div>
        </div>

        <!-- User Written Story / Memory Box -->
        <div class="p-4 rounded-2xl bg-[#121522] border border-[#2B3147] relative">
          ${hasStory ? `
            <p class="text-xs sm:text-sm text-gray-200 italic font-sans leading-relaxed">
              "${mem.caption}"
            </p>
          ` : `
            <div class="text-center py-2">
              <p class="text-xs text-gray-400 font-mono mb-2">No story written yet for this photo.</p>
              <button class="btn-trigger-edit-story px-3.5 py-1.5 rounded-xl bg-amber-gold/15 text-amber-gold border border-amber-gold/30 text-xs font-mono font-bold hover:bg-amber-gold/25 transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto" data-id="${mem.id}">
                <span class="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Write Memory Story</span>
              </button>
            </div>
          `}
          
          <div class="flex items-center justify-between mt-3 text-[10px] font-mono text-gray-400 border-t border-white/5 pt-2">
            <span>Author: <strong class="text-white">${mem.author || 'Host'}</strong></span>
            <span class="text-amber-gold font-bold">Archived Keepsake</span>
          </div>
        </div>

        <!-- Stickers & Likes -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono text-gray-500">Stamps:</span>
            ${(mem.stickers || []).map(stk => `
              <span class="text-sm bg-white/5 px-2 py-0.5 rounded-md border border-white/10">${stk}</span>
            `).join('')}
            <button class="btn-stamp-picker text-xs font-mono text-amber-gold hover:text-white px-2 py-0.5 rounded bg-amber-gold/15 border border-amber-gold/30 hover:bg-amber-gold/25 cursor-pointer ml-1" data-id="${mem.id}">
              + Stamp
            </button>
          </div>

          <button class="btn-like-memory flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition-all cursor-pointer active:scale-90" data-id="${mem.id}">
            <span class="material-symbols-outlined text-[15px]">favorite</span>
            <span>${mem.likes || 0}</span>
          </button>
        </div>

      </div>

      <div class="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
        <span>Bondfire Photobook</span>
        <span>Archival Luster</span>
      </div>
    </div>
  `;
}

function renderEmptyBookPage(pageNum) {
  return `
    <div class="rounded-2xl bg-[#141724] border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[520px]">
      <span class="material-symbols-outlined text-4xl text-gray-600 mb-3">add_photo_alternate</span>
      <h4 class="font-display font-bold text-gray-400 text-base">Empty Archival Page</h4>
      <p class="text-xs text-gray-500 font-mono max-w-xs mt-1">
        Page ${pageNum} is open. Click "+ Add Photos" above to add more memories.
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
            <div class="polaroid-card ${themeClass} ${rot} p-3 pb-5 rounded-xl shadow-xl transition-all" data-id="${mem.id}">
              <div class="polaroid-tape"></div>
              
              <div class="w-full h-48 rounded-lg overflow-hidden mb-2.5 bg-black relative">
                <img src="${mem.imageUrl}" alt="${mem.title}" class="w-full h-full object-cover" />
                <div class="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-gray-300">
                  ${mem.date}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <h4 class="font-display font-black text-xs sm:text-sm tracking-tight truncate">${mem.title}</h4>
                <button class="btn-trigger-edit-story text-[11px] font-mono text-amber-gold hover:underline cursor-pointer" data-id="${mem.id}">
                  Write
                </button>
              </div>

              <p class="text-[11px] font-sans line-clamp-2 opacity-80 mt-1">
                ${mem.caption || 'Tap Write to record memory story.'}
              </p>

              <!-- Footer with stamps & likes -->
              <div class="flex items-center justify-between mt-3 pt-2 border-t border-black/10 text-[10px] font-mono">
                <div class="flex items-center gap-1">
                  ${(mem.stickers || []).slice(0, 3).map(s => `<span class="material-symbols-outlined text-[13px] text-amber-gold">${s}</span>`).join('')}
                </div>
                <div class="flex items-center gap-1 text-rose-500 font-bold">
                  <span class="material-symbols-outlined text-[13px] text-rose-500">favorite</span>
                  <span>${mem.likes || 0}</span>
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

  // Mode tabs
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

  // Spread flipper buttons
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

  // Print keepsake
  const printBtn = document.getElementById('btn-print-keepsake');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      audio.playChime();
      window.print();
    });
  }

  // Start new album / reset
  const startNewBtn = document.getElementById('btn-start-new-album');
  if (startNewBtn) {
    startNewBtn.addEventListener('click', () => {
      if (confirm('Start a fresh photobook? Your current album can be cleared or re-uploaded.')) {
        audio.playClick();
        store.clearAlbum();
        queuedPhotos = [];
        reRenderStudio();
      }
    });
  }

  // Onboarding File Upload Handling (Step 1)
  const onboardingDropzone = document.getElementById('onboarding-dropzone');
  const onboardingFileInput = document.getElementById('onboarding-file-input');
  const queuedContainer = document.getElementById('queued-photos-container');
  const queuedGrid = document.getElementById('queued-thumbnails-grid');
  const queuedBadge = document.getElementById('queued-count-badge');
  const clearQueuedBtn = document.getElementById('btn-clear-queued');
  const generateAlbumBtn = document.getElementById('btn-generate-album');

  if (onboardingDropzone && onboardingFileInput) {
    onboardingDropzone.addEventListener('click', () => {
      onboardingFileInput.click();
    });

    onboardingFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length) {
        processFiles(files);
      }
    });

    onboardingDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      onboardingDropzone.classList.add('border-amber-gold');
    });

    onboardingDropzone.addEventListener('dragleave', () => {
      onboardingDropzone.classList.remove('border-amber-gold');
    });

    onboardingDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      onboardingDropzone.classList.remove('border-amber-gold');
      const files = Array.from(e.dataTransfer.files || []);
      if (files.length) {
        processFiles(files);
      }
    });
  }

  function processFiles(files) {
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        queuedPhotos.push({
          imageUrl: ev.target.result,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        });
        loaded++;
        if (loaded === files.length) {
          renderQueuedThumbnails();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function renderQueuedThumbnails() {
    if (!queuedContainer || !queuedGrid) return;

    if (queuedPhotos.length === 0) {
      queuedContainer.classList.add('hidden');
      return;
    }

    queuedContainer.classList.remove('hidden');
    if (queuedBadge) queuedBadge.textContent = `${queuedPhotos.length} PHOTOS READY`;

    queuedGrid.innerHTML = queuedPhotos.map((photo, idx) => `
      <div class="relative w-full h-20 rounded-xl overflow-hidden bg-black border border-white/10 group">
        <img src="${photo.imageUrl}" class="w-full h-full object-cover" alt="Preview" />
        <button class="btn-remove-queued absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-500 text-white text-[10px] flex items-center justify-center cursor-pointer" data-index="${idx}">
          ✕
        </button>
      </div>
    `).join('');

    const removeBtns = queuedGrid.querySelectorAll('.btn-remove-queued');
    removeBtns.forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(b.dataset.index, 10);
        queuedPhotos.splice(idx, 1);
        renderQueuedThumbnails();
      });
    });
  }

  if (clearQueuedBtn) {
    clearQueuedBtn.addEventListener('click', () => {
      queuedPhotos = [];
      renderQueuedThumbnails();
    });
  }

  // Generate Photobook CTA
  if (generateAlbumBtn) {
    generateAlbumBtn.addEventListener('click', () => {
      const titleInput = document.getElementById('input-album-title');
      const themeSelect = document.getElementById('select-album-theme');
      const campersInput = document.getElementById('input-album-campers');

      const title = titleInput?.value.trim() || 'Our Squad Keepsake';
      const theme = themeSelect?.value || 'POLAROID_WARM';
      const campers = campersInput?.value ? campersInput.value.split(',').map(s => s.trim()).filter(Boolean) : ['Host (You)'];

      if (queuedPhotos.length === 0) {
        alert('Please select at least 1 photo to generate your photobook!');
        return;
      }

      audio.playCameraSnap();
      store.createAlbumFromUploads({
        albumTitle: title,
        theme,
        photos: queuedPhotos,
        camperTags: campers
      });

      confettiInstance.burst(60, 1);
      queuedPhotos = [];
      reRenderStudio();
    });
  }

  // Add More Photos Modal
  const addMoreBtn = document.getElementById('btn-add-more-photos');
  const addMoreModal = document.getElementById('modal-add-more');
  const closeAddMoreBtn = document.getElementById('btn-close-add-more');
  const dropzoneAddMore = document.getElementById('dropzone-add-more');
  const addMoreFilesInput = document.getElementById('input-add-more-files');

  if (addMoreBtn && addMoreModal) {
    addMoreBtn.addEventListener('click', () => {
      audio.playClick();
      addMoreModal.classList.remove('hidden');
    });
  }

  if (closeAddMoreBtn && addMoreModal) {
    closeAddMoreBtn.addEventListener('click', () => {
      addMoreModal.classList.add('hidden');
    });
  }

  if (dropzoneAddMore && addMoreFilesInput) {
    dropzoneAddMore.addEventListener('click', () => addMoreFilesInput.click());

    addMoreFilesInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      let loaded = 0;
      const newItems = [];
      files.forEach(f => {
        const r = new FileReader();
        r.onload = (ev) => {
          newItems.push({
            imageUrl: ev.target.result,
            title: f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          });
          loaded++;
          if (loaded === files.length) {
            audio.playCameraSnap();
            store.createAlbumFromUploads({
              albumTitle: store.getState().albumTitle || 'Squad Photobook',
              photos: newItems
            });
            confettiInstance.burst(40, 1);
            addMoreModal.classList.add('hidden');
            reRenderStudio();
          }
        };
        r.readAsDataURL(f);
      });
    });
  }

  // Story Writer Modal
  const storyModal = document.getElementById('modal-edit-story');
  const closeStoryBtn = document.getElementById('btn-close-story-modal');
  const saveStoryBtn = document.getElementById('btn-save-story');

  const editStoryBtns = document.querySelectorAll('.btn-trigger-edit-story');
  editStoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const mem = (store.getState().albumMemories || []).find(m => m.id === id);
      if (!mem || !storyModal) return;

      editingMemoryId = id;
      audio.playClick();

      const thumbEl = document.getElementById('story-modal-thumb');
      const headingEl = document.getElementById('story-modal-heading');
      const titleInput = document.getElementById('input-edit-title');
      const captionInput = document.getElementById('input-edit-caption');
      const tagsInput = document.getElementById('input-edit-tags');
      const themeSelect = document.getElementById('select-edit-theme');

      if (thumbEl) thumbEl.src = mem.imageUrl;
      if (headingEl) headingEl.textContent = mem.title;
      if (titleInput) titleInput.value = mem.title || '';
      if (captionInput) captionInput.value = mem.caption || '';
      if (tagsInput) tagsInput.value = (mem.camperTags || []).join(', ');
      if (themeSelect) themeSelect.value = mem.theme || 'POLAROID_WARM';

      storyModal.classList.remove('hidden');
    });
  });

  if (closeStoryBtn && storyModal) {
    closeStoryBtn.addEventListener('click', () => {
      storyModal.classList.add('hidden');
    });
  }

  // Quick Prompt Chips
  const promptChips = document.querySelectorAll('.btn-prompt-chip');
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const captionInput = document.getElementById('input-edit-caption');
      if (captionInput) {
        captionInput.value = chip.dataset.text;
        audio.playClick();
      }
    });
  });

  // Save Story Button
  if (saveStoryBtn && storyModal) {
    saveStoryBtn.addEventListener('click', () => {
      if (!editingMemoryId) return;

      const titleInput = document.getElementById('input-edit-title');
      const captionInput = document.getElementById('input-edit-caption');
      const tagsInput = document.getElementById('input-edit-tags');
      const themeSelect = document.getElementById('select-edit-theme');

      const title = titleInput?.value.trim() || 'Untitled Memory';
      const caption = captionInput?.value.trim() || '';
      const tags = tagsInput?.value ? tagsInput.value.split(',').map(s => s.trim()).filter(Boolean) : ['Host'];
      const theme = themeSelect?.value || 'POLAROID_WARM';

      audio.playChime();
      store.updateAlbumMemory(editingMemoryId, {
        title,
        caption,
        camperTags: tags,
        theme
      });

      storyModal.classList.add('hidden');
      editingMemoryId = null;
      reRenderStudio();
    });
  }

  // Sticker Stamps
  const stampBtns = document.querySelectorAll('.btn-stamp-picker');
  stampBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const stickers = ['local_fire_department', 'favorite', 'emoji_events', 'verified', 'star', 'celebration'];
      const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
      audio.playClick();
      store.addAlbumMemorySticker(id, randomSticker);
      reRenderStudio();
    });
  });

  // Like Buttons
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

  function reRenderStudio() {
    const mount = document.getElementById('app-mount');
    if (mount && store.getState().currentView === 'YEARBOOK') {
      mount.innerHTML = renderYearbookScreen();
      bindYearbookEvents();
    }
  }
}
