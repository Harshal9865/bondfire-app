// ==============================================================================
// VAULT UPLOAD INTERACTION (Bondfire 2.0)
// Drag & Drop zones, scanning animations for memory extraction
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { uploadCloudMedia, saveCloudMemory } from '../services/supabaseClient.js';

export function renderVaultUpload() {
  return `
    <div class="relative w-full max-w-2xl mx-auto mt-8 z-20">
      <!-- Drag & Drop Zone -->
      <div id="vault-drop-zone" class="w-full rounded-[32px] border-2 border-dashed border-border/80 bg-surface/40 hover:bg-surface/80 backdrop-blur-md p-10 flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-pointer relative overflow-hidden">
        
        <div class="absolute inset-0 bg-gradient-to-b from-amber-gold/5 to-sunset-coral/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-surface-bright border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg relative z-10">
          <span class="material-symbols-outlined text-[32px] text-amber-gold">add_photo_alternate</span>
        </div>
        
        <h3 class="font-display text-xl font-bold text-white mb-2 relative z-10">Drop Screenshots & Photos</h3>
        <p class="text-sm text-gray-400 max-w-sm relative z-10">
          Upload group chats or photos. Stored securely in your Squad Cloud Vault and automatically parsed into game roast cards.
        </p>
        
        <div class="mt-6 flex gap-3 relative z-10">
          <button class="px-5 py-2.5 rounded-full bg-surface-bright text-white text-sm font-bold shadow-sm border border-border/80 hover:border-amber-gold/50 transition-colors">
            Browse Files
          </button>
        </div>
        
        <!-- Hidden File Input -->
        <input type="file" id="vault-file-input" class="hidden" multiple accept="image/*, .pdf" />

        <!-- Scanning Overlay (Hidden by default) -->
        <div id="vault-scanning-overlay" class="absolute inset-0 bg-surface/95 flex flex-col items-center justify-center opacity-0 pointer-events-none transition-opacity z-20">
          <div class="w-full max-w-xs relative h-32 flex items-center justify-center">
            <!-- Simulated image stack -->
            <div class="absolute w-24 h-24 bg-surface-bright rounded-lg border border-border/50 shadow-xl rotate-[-10deg]"></div>
            <div class="absolute w-24 h-24 bg-surface-bright rounded-lg border border-border/50 shadow-xl rotate-[5deg]"></div>
            <div class="absolute w-24 h-24 bg-surface-bright rounded-lg border border-border/50 shadow-xl z-10 overflow-hidden" id="scan-preview-img"></div>
            
            <!-- Scanning Laser Line -->
            <div class="absolute top-0 left-0 w-full h-0.5 bg-sunset-coral shadow-[0_0_15px_rgba(255,90,95,1)] animate-scan z-20"></div>
          </div>
          <span class="mt-6 font-mono text-xs text-sunset-coral font-bold uppercase tracking-widest animate-pulse" id="scan-status-text">Uploading to Cloud Storage...</span>
        </div>
      </div>
      
      <!-- Recent Uploads Preview Gallery -->
      <div class="mt-8 hidden" id="vault-recent-uploads">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-display text-sm font-bold text-gray-400 uppercase tracking-widest">Saved in Cloud Vault</h4>
          <span class="text-[11px] text-mint-green font-mono flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">cloud_done</span> Supabase Storage Sync</span>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar" id="vault-gallery-track">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  `;
}

export function bindVaultUploadEvents() {
  const dropZone = document.getElementById('vault-drop-zone');
  const fileInput = document.getElementById('vault-file-input');
  const scanOverlay = document.getElementById('vault-scanning-overlay');
  const scanStatus = document.getElementById('scan-status-text');
  const recentUploads = document.getElementById('vault-recent-uploads');
  const galleryTrack = document.getElementById('vault-gallery-track');

  if (!dropZone || !fileInput) return;

  // Browse click
  dropZone.addEventListener('click', (e) => {
    if (scanOverlay.style.opacity === '1') return;
    fileInput.click();
  });

  // Drag Events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-amber-gold', 'bg-surface/80');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-amber-gold', 'bg-surface/80');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-amber-gold', 'bg-surface/80');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  });

  async function handleFiles(files) {
    audio.playClick();
    
    // UI: Show Scanning
    scanOverlay.style.opacity = '1';
    scanStatus.textContent = 'Uploading to Cloud Media Storage...';
    
    const fileList = Array.from(files);
    for (const file of fileList) {
      try {
        scanStatus.textContent = `Uploading ${file.name}...`;
        const uploadResult = await uploadCloudMedia(file, 'vault-media', 'squad_photos');
        
        // Save into reactive store and cloud database
        const state = store.getState();
        const userName = state.currentUser?.displayName || 'Camper';
        const newMemory = {
          type: 'PHOTO',
          title: file.name.split('.')[0] || 'Squad Photo',
          quote: `Photo uploaded by ${userName}`,
          author: userName,
          imageUrl: uploadResult.url,
          source: uploadResult.source,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };

        store.addCustomMemory(newMemory);
        saveCloudMemory({
          podId: state.activeRoom?.roomCode,
          title: newMemory.title,
          rawText: newMemory.quote,
          structuredData: { imageUrl: uploadResult.url, source: uploadResult.source },
        });

        addFileToGallery(file, uploadResult.url);
      } catch (err) {
        console.warn('Error processing upload:', err);
      }
    }

    audio.playCorrect();
    scanOverlay.style.opacity = '0';
  }

  function addFileToGallery(file, uploadedUrl) {
    recentUploads.classList.remove('hidden');
    
    const src = uploadedUrl || (file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
    const el = document.createElement('div');
    el.className = "w-32 h-40 shrink-0 bg-surface rounded-xl border border-border overflow-hidden relative group shadow-md";
    el.innerHTML = `
      ${src ? `<img src="${src}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />` : `<div class="w-full h-full flex flex-col items-center justify-center bg-surface-bright"><span class="material-symbols-outlined text-[24px] text-gray-500 mb-2">description</span><span class="text-[10px] text-gray-400 px-2 truncate w-full text-center">${file.name}</span></div>`}
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
        <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-[12px] text-mint-green">cloud_done</span><span class="retro-pixel-badge text-[8px] text-mint-green">Stored</span></span>
      </div>
    `;
    galleryTrack.prepend(el);
  }
}
