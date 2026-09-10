// ==============================================================================
// MEMORY VAULT COMPONENT (Screen 5)
// The Goa Crew Vault matching Google Stitch Warm Analog Cyber design
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { MediaProcessor } from '../services/mediaProcessor.js';

export function renderVaultScreen() {
  const state = store.getState();
  const memories = state.vaultMemories;
  const user = state.currentUser;
  const userName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'You';

  return `
    <div class="flex flex-col w-full max-w-[780px] mx-auto px-4 py-6 relative select-none text-on-surface">
      <!-- Atmospheric Glow Effect -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Header & Title Area -->
      <div class="flex flex-col gap-3 mb-6 relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-surface-container font-label-md text-caption text-on-surface-variant tracking-wider uppercase font-bold">Pod Archive</span>
            <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-tertiary font-label-md text-caption font-bold">
              <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              Mesh Ingest Sync
            </span>
          </div>
          <div class="font-room-code text-label-lg text-secondary font-bold">ID: #GOA-8842</div>
        </div>

        <div class="flex items-baseline justify-between gap-4">
          <h1 class="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2 font-bold tracking-tight">
            The Goa Crew Vault 🗄️ <span class="font-headline-sm text-headline-sm text-on-surface-variant">(${memories.length + 144} Memories)</span>
          </h1>
          <button class="shrink-0 p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-border" title="Vault Settings" id="btn-vault-settings">
            <span class="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>

        <!-- Privacy Shield Banner -->
        <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface-container-low border border-border text-tertiary shadow-sm">
          <span class="material-symbols-outlined text-[18px] text-tertiary shrink-0">verified_user</span>
          <p class="font-caption text-caption text-tertiary-fixed font-medium truncate">
            Zero-AI-Training Guaranteed • End-to-End Encrypted • Only your Pod can view this media.
          </p>
          <span class="ml-auto material-symbols-outlined text-[16px] text-tertiary-fixed-dim">lock</span>
        </div>
      </div>

      <!-- Multi-Format Ingestion Zone -->
      <div class="mb-8 rounded-2xl bg-surface-container-low p-5 shadow-lg border border-border relative group" id="vault-dropzone">
        <div class="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-surface-container border border-border/80">
          <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 text-primary border border-border">
            <span class="material-symbols-outlined text-[24px]">cloud_upload</span>
          </div>
          <p class="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">Feed the Memory Engine</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-5">
            Drag & drop files or forward screenshots to your private Pod WhatsApp bot.
          </p>

          <!-- Quick Action Buttons -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
            <button class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-high hover:bg-surface-variant transition-colors border border-border group/btn" id="btn-vault-browse">
              <span class="material-symbols-outlined text-primary text-[22px] group-hover/btn:scale-110 transition-transform">add_photo_alternate</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">Photos & Memes</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-high hover:bg-surface-variant transition-colors border border-border group/btn" id="btn-vault-chat-import">
              <span class="material-symbols-outlined text-mint-green text-[22px] group-hover/btn:scale-110 transition-transform">chat</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">Import Chat (.txt/.json)</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-high hover:bg-surface-variant transition-colors border border-border group/btn" id="btn-vault-ocr">
              <span class="material-symbols-outlined text-secondary text-[22px] group-hover/btn:scale-110 transition-transform">document_scanner</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">Screenshots</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-high hover:bg-surface-variant transition-colors border border-border group/btn" id="btn-vault-quote">
              <span class="material-symbols-outlined text-primary-fixed text-[22px] group-hover/btn:scale-110 transition-transform">format_quote</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">Inside Joke</span>
            </button>
          </div>

          <div class="flex items-center gap-3 mt-4 text-outline font-caption text-caption">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">smartphone</span> WhatsApp: +1 (555) 462-8321</span>
            <span>•</span>
            <span>Max Ingestion Payload 100MB</span>
          </div>
        </div>
      </div>

      <!-- Ingested Media Masonry Grid -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
          Recent Sparks <span class="text-caption font-caption bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant">Live Ingestion Flow</span>
        </h2>
        <div class="flex gap-1.5 bg-surface-container-low p-1 rounded-lg border border-border">
          <button class="px-3 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-caption font-bold">All</button>
          <button class="px-3 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-md text-caption font-bold">Pending OCR</button>
          <button class="px-3 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-md text-caption font-bold">Voice</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <!-- Tile 1: Old Party Photo -->
        <div class="rounded-2xl bg-surface-container-low p-3 flex flex-col gap-3 shadow-md border border-border hover:border-primary-container/40 transition-all group">
          <div class="relative w-full h-52 rounded-xl overflow-hidden bg-surface-container">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Baga Beach Bonfire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmTvkxTpmNJFJSFINhAeLGm8sUBPCJkNY2tvuprYLpPtmpoZGndhi9Y8iVIN8gzZUXAug0Hrygmir0VhptFCHbHiqbt-Fex-S19G0c04ZLgJeDlK2yqcf46pVxEj5y4zJDYSxjc_1ZTHm1cq-b44hlgJTQDrgAV7SgJD7lw-2lIM2_odAZ4394Hxx_Ai5YmMbghI34_YJ4zCvNTdL1r0XI7en4Sy6nFawO7B3U8BovJmj26dnk879lPA" />
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent"></div>
            <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center gap-1 text-primary-fixed text-xs font-mono">
              <span class="material-symbols-outlined text-[14px]">photo_camera</span>
              <span>Canon G7X</span>
            </div>
          </div>
          <div class="px-1 flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="font-label-md text-caption text-secondary flex items-center gap-1 font-bold">
                <span class="material-symbols-outlined text-[16px]">local_activity</span>
                Trivia Ingest Complete
              </span>
              <span class="font-caption text-caption text-on-surface-variant">2h ago</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface font-medium">Baga Beach Midnight Bonfire</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-caption text-caption">Tagged: ${userName}, Rohan</span>
              <span class="px-2 py-0.5 rounded-md bg-primary-container/20 text-primary font-caption text-caption font-semibold">Ready for Trivia</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: WhatsApp Chat Screenshot with OCR -->
        <div class="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between gap-4 shadow-md border border-border group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined text-[16px]">chat</span>
              </div>
              <span class="font-label-md text-label-md text-on-surface font-bold">WhatsApp Screenshot</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-caption text-caption flex items-center gap-1 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              Auto-OCR
            </span>
          </div>

          <!-- OCR Extracted Visual Bubble -->
          <div class="relative p-4 rounded-xl bg-surface-container flex flex-col gap-3 border border-border">
            <div class="flex items-center justify-between text-outline text-caption font-caption">
              <span>Goa Squad '22 Chat</span>
              <span>11:42 PM</span>
            </div>
            <div class="p-3 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm shadow-inner">
              <p class="text-secondary font-label-md text-label-md mb-1 font-bold">Rohan V.</p>
              <p class="italic">“If anyone orders Hawaiian pizza again I'm revoking Netflix.”</p>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tertiary-container/20 text-tertiary-fixed font-caption text-caption font-bold">
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Text extracted: 4 Q&A cards created!</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <div class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">R</div>
              <div class="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] text-on-secondary font-bold">M</div>
              <div class="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-[10px] text-on-tertiary font-bold">S</div>
            </div>
            <button class="font-label-md text-label-md text-primary hover:text-primary-fixed flex items-center gap-0.5 font-bold" id="btn-review-ocr">
              Review Cards <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Tile 3: 15-second Voice Note -->
        <div class="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between gap-4 shadow-md border border-border">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-[16px]">graphic_eq</span>
              </div>
              <span class="font-label-md text-label-md text-on-surface font-bold">Voice Note (0:15)</span>
            </div>
            <span class="font-room-code text-caption text-secondary font-bold">#AUDIO-71</span>
          </div>

          <!-- Waveform Simulation -->
          <div class="p-3 rounded-xl bg-surface-container flex flex-col gap-2 border border-border">
            <div class="flex items-center gap-3">
              <button class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform" id="btn-play-voice" type="button">
                <span class="material-symbols-outlined text-[20px]" id="voice-play-icon">play_arrow</span>
              </button>
              <div class="flex items-center gap-1 h-8 flex-1">
                <div class="w-1 bg-secondary rounded-full h-3"></div>
                <div class="w-1 bg-secondary rounded-full h-5"></div>
                <div class="w-1 bg-secondary rounded-full h-7"></div>
                <div class="w-1 bg-secondary rounded-full h-4"></div>
                <div class="w-1 bg-secondary rounded-full h-8"></div>
                <div class="w-1 bg-secondary rounded-full h-6"></div>
                <div class="w-1 bg-secondary rounded-full h-3"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-5"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-7"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-4"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-6"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-2"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-5"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-3"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-6"></div>
                <div class="w-1 bg-secondary/40 rounded-full h-2"></div>
              </div>
              <span class="font-caption text-caption text-on-surface-variant font-mono">0:15</span>
            </div>
            <div class="pt-2">
              <p class="font-caption text-caption text-outline uppercase tracking-wider mb-0.5">Transcription snippet</p>
              <p class="font-body-sm text-body-sm text-on-surface italic">
                “${userName} laughing uncontrollably at the train station when the coconut dropped...”
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between text-caption font-caption text-on-surface-variant">
            <span>Speaker: ${userName}</span>
            <span class="text-tertiary flex items-center gap-1 font-bold"><span class="material-symbols-outlined text-[14px]">check_circle</span> Soundbite Isolated</span>
          </div>
        </div>

        <!-- Tile 4: Tilted Polaroid with Date Stamp -->
        <div class="rounded-2xl bg-surface-container-low p-4 flex flex-col items-center justify-center shadow-md border border-border relative overflow-hidden">
          <div class="bg-surface-container-highest p-3 pb-4 rounded-lg shadow-xl -rotate-2 hover:rotate-0 transition-transform duration-300 w-full max-w-[280px] border border-border">
            <div class="relative w-full h-40 bg-surface-container rounded-sm overflow-hidden mb-2.5">
              <img class="w-full h-full object-cover" alt="Goa Sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGH6yEwA909wOyLkmZfOcLEXZ0vjO3uMaDFegMm6wF5v4lQA1wqbOz6aLw_0TlQJH185KKyqI9cA881f85FEyfYZ-tsIwGyEQEYdSgJKhV9CfKpgCtM32ALPbFdkZc6OWElg6g37Kbrm0XQUzOxRmO0yArFpdI7JwqKE-eMb4D8nK56sGPeDi8d4lHJkxJP2qgfzzFMZr-90DmWTlrtgx7pOtEoPWeZtMvmhSpTjKPyrsRFJ2ug4iObQ" />
              <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-surface-container-lowest/70 backdrop-blur rounded text-[10px] font-room-code text-secondary font-bold">
                AUG 2022
              </div>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-headline-sm text-headline-sm text-primary tracking-wide italic font-serif">First Goa Sunset</span>
              <span class="font-caption text-caption text-on-surface-variant mt-0.5">Vagator Hilltop Cafe</span>
            </div>
          </div>
          <div class="w-full flex items-center justify-between mt-3 pt-2 text-xs">
            <span class="font-caption text-caption text-on-surface-variant">Polaroid Scan • 300 DPI</span>
            <button class="text-primary font-label-md text-label-md flex items-center gap-1 font-bold" id="btn-spark-polaroid">
              <span class="material-symbols-outlined text-[16px]">favorite</span> 12 Sparks
            </button>
          </div>
        </div>
      </div>

      <!-- AI Game Card Generator Status (Sticky Bottom Floating Pod) -->
      <div class="sticky bottom-4 z-40 w-full rounded-2xl bg-surface-container/95 backdrop-blur-xl p-4 shadow-[0px_16px_36px_rgba(0,0,0,0.6)] border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0 text-secondary">
            <span class="material-symbols-outlined text-[22px] animate-pulse">bolt</span>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">32 Playable Cards</span>
              <span class="px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-label-md text-caption font-bold">Ready</span>
            </div>
            <p class="font-caption text-caption text-on-surface-variant truncate">
              Engine processed: 4 voice soundbites, 12 photos, 16 chat prompts.
            </p>
          </div>
        </div>

        <!-- CTA Pill in Amber Gold -->
        <button class="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-[0px_4px_20px_rgba(255,183,3,0.35)] hover:scale-105 active:scale-95 transition-all" id="btn-vault-preview-cards">
          <span>Preview Game Cards</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      <!-- Inside Joke / Custom Memory Creator Modal -->
      <div id="inside-joke-modal" class="fixed inset-0 bg-canvas/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="max-w-md w-full rounded-2xl bg-surface-container p-6 border border-border shadow-2xl relative">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[24px]">format_quote</span>
              <h3 class="font-headline-sm text-headline-sm text-white font-bold">Record Inside Joke</h3>
            </div>
            <button type="button" class="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-white" id="btn-close-joke-modal">✕</button>
          </div>

          <p class="text-xs text-on-surface-variant mb-4">
            Add a funny quote, pod moment, or legendary meme. It instantly drops into your pod's live trivia roast deck!
          </p>

          <form id="form-inside-joke" class="flex flex-col gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Memory / Joke Title</label>
              <input type="text" id="input-joke-title" placeholder="e.g. The 2 AM Samosa Heist" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">The Exact Quote or Unhinged Line</label>
              <textarea id="input-joke-quote" rows="3" placeholder="e.g. “If anyone orders Hawaiian pizza again I’m revoking Netflix for all 5 of you.”" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Who Said It / Star of the Roast</label>
              <input type="text" id="input-joke-author" value="${userName !== 'You' ? userName : 'Sarah K.'}" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary" />
            </div>

            <button type="submit" class="mt-2 w-full py-3 rounded-full bg-primary-container text-on-primary-container font-bold text-sm flex items-center justify-center gap-2 shadow-[0px_8px_24px_-4px_rgba(255,90,95,0.45)] hover:brightness-110 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[20px]">local_fire_department</span>
              <span>Deposit to Vault & Trivia Deck</span>
            </button>
          </form>
      <!-- Real WhatsApp / Discord Chat Importer Modal -->
      <div id="chat-importer-modal" class="fixed inset-0 bg-canvas/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4" style="display: none;">
        <div class="max-w-lg w-full rounded-2xl bg-surface-container p-6 border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-3 pb-3 border-b border-border/80">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-mint-green text-[26px]">chat</span>
              <div>
                <h3 class="font-headline-sm text-base sm:text-lg text-white font-bold">Import Real Group Chat</h3>
                <p class="text-[11px] text-on-surface-variant">WhatsApp (.txt) or Discord (.json) Export</p>
              </div>
            </div>
            <button type="button" class="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-white" id="btn-close-chat-modal">✕</button>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low border border-border/60 text-xs text-on-surface-variant mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-mint-green text-[18px] shrink-0">shield</span>
            <span>100% Client-Side Privacy: Your chat export is parsed purely in-browser. Financial PII is automatically redacted.</span>
          </div>

          <!-- Drag and Drop File Target -->
          <div id="chat-file-drop-target" class="border-2 border-dashed border-border hover:border-mint-green/80 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-surface-container-lowest/60 mb-4">
            <input type="file" id="chat-file-input" accept=".txt,.json" class="hidden" />
            <span class="material-symbols-outlined text-4xl text-mint-green mb-2">upload_file</span>
            <p class="font-headline-sm text-sm text-white font-bold">Choose or Drop WhatsApp / Discord File</p>
            <p class="text-xs text-gray-400 mt-1">Accepts "_chat.txt", "export.txt", or Discord "messages.json"</p>
          </div>

          <!-- Quick Paste Text Fallback -->
          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Or Paste Sample Chat Log Directly</label>
            <textarea id="chat-paste-area" rows="4" placeholder="14/10/2021, 2:41 AM - Liam: If anyone orders another Hawaiian pizza tonight I am literally revoking Netflix for all 5 of you.&#10;14/10/2021, 2:43 AM - Sarah: Challenge accepted." class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-border text-xs text-white placeholder:text-gray-500 font-mono focus:outline-none focus:border-mint-green"></textarea>
          </div>

          <button id="btn-parse-chat-text" class="w-full py-3 rounded-full bg-gradient-to-r from-mint-green to-emerald-400 text-canvas font-bold text-sm shadow-glow-mint hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>Auto-Generate Trivia Roast Cards</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindVaultEvents() {
  const browseBtn = document.getElementById('btn-vault-browse');
  const ocrBtn = document.getElementById('btn-vault-ocr');
  const quoteBtn = document.getElementById('btn-vault-quote');
  const jokeModal = document.getElementById('inside-joke-modal');
  const closeJokeModalBtn = document.getElementById('btn-close-joke-modal');
  const jokeForm = document.getElementById('form-inside-joke');

  const addSimulatedMemory = (type, title, quote) => {
    audio.playChime();
    const newMem = store.addCustomMemory({
      type,
      title,
      quote,
      author: store.getState().currentUser?.displayName || 'Host',
    });

    const dropzone = document.getElementById('vault-dropzone');
    if (dropzone) {
      const originalHtml = dropzone.innerHTML;
      dropzone.innerHTML = `
        <div class="p-6 text-center text-secondary flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-4xl animate-bounce">auto_awesome</span>
          <div class="font-headline-sm font-bold">Encrypted & Ingested into Deck!</div>
          <p class="text-xs text-on-surface-variant font-medium">"${title}" will appear in tonight's trivia round.</p>
        </div>
      `;
      setTimeout(() => {
        dropzone.innerHTML = originalHtml;
        store.setView('VAULT');
      }, 1500);
    }
  };

  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      addSimulatedMemory('PHOTO', 'Anjuna Beach Sunset Party', 'The evening we watched the sun dip into the Arabian Sea.');
    });
  }

  // Real Chat Log Importer (WhatsApp / Discord)
  const chatImportBtn = document.getElementById('btn-vault-chat-import');
  const chatModal = document.getElementById('chat-importer-modal');
  const closeChatModalBtn = document.getElementById('btn-close-chat-modal');
  const chatDropTarget = document.getElementById('chat-file-drop-target');
  const chatFileInput = document.getElementById('chat-file-input');
  const chatPasteArea = document.getElementById('chat-paste-area');
  const parseChatBtn = document.getElementById('btn-parse-chat-text');

  if (chatImportBtn && chatModal) {
    chatImportBtn.addEventListener('click', () => {
      audio.playClick();
      chatModal.style.display = 'flex';
    });
  }

  if (closeChatModalBtn && chatModal) {
    closeChatModalBtn.addEventListener('click', () => {
      audio.playClick();
      chatModal.style.display = 'none';
    });
  }

  const processChatText = (text, filename = 'Chat Export') => {
    let parsed = [];
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      parsed = MediaProcessor.parseDiscordChatExport(text);
    } else {
      parsed = MediaProcessor.parseWhatsAppChatExport(text);
    }

    if (parsed.length === 0) {
      // Fallback: tokenize general text lines
      parsed = MediaProcessor.extractChatMemoriesFromOcr(text);
    }

    const cards = MediaProcessor.convertChatMemoriesToCards(parsed);

    // Ingest into vault memories and custom game deck
    parsed.slice(0, 10).forEach((item) => {
      store.addCustomMemory({
        type: 'CHAT_SCREENSHOT',
        title: `Export: ${item.author || 'Squad Quote'}`,
        quote: item.quote,
        author: item.author || 'Camp Camper',
      });
    });

    audio.playFanfare();
    if (chatModal) chatModal.style.display = 'none';

    const dropzone = document.getElementById('vault-dropzone');
    if (dropzone) {
      dropzone.innerHTML = `
        <div class="p-6 text-center text-mint-green flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-5xl animate-bounce">verified</span>
          <div class="font-headline-sm font-bold">${parsed.length} Real Chat Memories Ingested!</div>
          <p class="text-xs text-on-surface-variant font-medium">Auto-generated ${cards.length} new Who-Said-It trivia roast cards into tonight's deck.</p>
        </div>
      `;
      setTimeout(() => store.setView('VAULT'), 1800);
    }
  };

  if (chatDropTarget && chatFileInput) {
    chatDropTarget.addEventListener('click', () => chatFileInput.click());
    chatFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => processChatText(evt.target.result, file.name);
        reader.readAsText(file);
      }
    });

    chatDropTarget.addEventListener('dragover', (e) => {
      e.preventDefault();
      chatDropTarget.classList.add('border-mint-green', 'bg-mint-green/10');
    });
    chatDropTarget.addEventListener('dragleave', () => {
      chatDropTarget.classList.remove('border-mint-green', 'bg-mint-green/10');
    });
    chatDropTarget.addEventListener('drop', (e) => {
      e.preventDefault();
      chatDropTarget.classList.remove('border-mint-green', 'bg-mint-green/10');
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => processChatText(evt.target.result, file.name);
        reader.readAsText(file);
      }
    });
  }

  if (parseChatBtn && chatPasteArea) {
    parseChatBtn.addEventListener('click', () => {
      const text = chatPasteArea.value.trim();
      if (text.length > 10) {
        processChatText(text, 'Pasted Chat Transcript');
      } else {
        audio.playWrongBuzzer();
        chatPasteArea.placeholder = 'PLEASE PASTE A CHAT LOG FIRST!';
      }
    });
  }

  if (ocrBtn) {
    ocrBtn.addEventListener('click', () => {
      addSimulatedMemory('CHAT_SCREENSHOT', 'WhatsApp Group Chat', '“If anyone orders Hawaiian pizza again I’m revoking Netflix.”');
    });
  }

  if (quoteBtn && jokeModal) {
    quoteBtn.addEventListener('click', () => {
      audio.playClick();
      jokeModal.style.display = 'flex';
    });
  }

  if (closeJokeModalBtn && jokeModal) {
    closeJokeModalBtn.addEventListener('click', () => {
      audio.playClick();
      jokeModal.style.display = 'none';
    });
  }

  if (jokeForm && jokeModal) {
    jokeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.playCorrect();
      const titleInput = document.getElementById('input-joke-title');
      const quoteInput = document.getElementById('input-joke-quote');
      const authorInput = document.getElementById('input-joke-author');

      const title = titleInput ? titleInput.value.trim() : 'Inside Joke';
      const quote = quoteInput ? quoteInput.value.trim() : '';
      const author = authorInput ? authorInput.value.trim() : 'Pod Camper';

      store.addCustomMemory({
        type: 'INSIDE_JOKE',
        title,
        quote,
        author,
      });

      jokeModal.style.display = 'none';

      const dropzone = document.getElementById('vault-dropzone');
      if (dropzone) {
        dropzone.innerHTML = `
          <div class="p-6 text-center text-secondary flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-4xl animate-bounce">auto_awesome</span>
            <div class="font-headline-sm font-bold">Inside Joke Ingested into Live Roast Deck!</div>
            <p class="text-xs text-on-surface-variant font-medium">“${quote}” deposited into the Vault.</p>
          </div>
        `;
        setTimeout(() => {
          store.setView('VAULT');
        }, 1200);
      }
    });
  }

  // Live Voice Note Recording
  const recordBtn = document.getElementById('btn-vault-record-voice');
  const recordIcon = document.getElementById('voice-record-icon');
  const recordText = document.getElementById('voice-record-text');
  let mediaRecorder = null;
  let isRecording = false;

  if (recordBtn) {
    recordBtn.addEventListener('click', async () => {
      audio.playClick();
      if (!isRecording) {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
          }
        } catch (e) {
          console.warn('Microphone permission denied, using analog simulation:', e);
        }

        isRecording = true;
        if (recordIcon) recordIcon.textContent = 'radio_button_checked';
        if (recordText) recordText.textContent = 'REC (TAP STOP)';
        recordBtn.classList.add('bg-primary-container/30', 'text-primary');

        setTimeout(() => {
          if (isRecording) stopAndSaveRecording();
        }, 5000);
      } else {
        stopAndSaveRecording();
      }
    });

    const stopAndSaveRecording = () => {
      isRecording = false;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      audio.playCorrect();
      if (recordIcon) recordIcon.textContent = 'check';
      if (recordText) recordText.textContent = 'SAVED!';

      const newVoiceMem = {
        id: `mem_${Date.now()}`,
        type: 'VOICE_NOTE',
        title: 'Fresh Voice Soundbite',
        quote: 'Audio recording captured · Auto-transcribing inside joke...',
        author: store.getState().currentUser.displayName,
        timestamp: 'Just now',
        isPlayable: true,
      };

      const current = store.getState().vaultMemories;
      store.setState({ vaultMemories: [newVoiceMem, ...current] });

      setTimeout(() => {
        store.setView('VAULT');
      }, 1000);
    };
  }

  // Voice Note Play Audio toggle
  const playVoiceBtn = document.getElementById('btn-play-voice');
  const playVoiceIcon = document.getElementById('voice-play-icon');
  let isPlayingVoice = false;
  if (playVoiceBtn) {
    playVoiceBtn.addEventListener('click', () => {
      audio.playClick();
      isPlayingVoice = !isPlayingVoice;
      if (playVoiceIcon) {
        playVoiceIcon.textContent = isPlayingVoice ? 'pause' : 'play_arrow';
      }
      if (isPlayingVoice) {
        audio.playChime();
        setTimeout(() => {
          if (playVoiceIcon) playVoiceIcon.textContent = 'play_arrow';
          isPlayingVoice = false;
        }, 3000);
      }
    });
  }

  // Preview Game Cards button -> Go to Lobby or Game
  const previewCardsBtn = document.getElementById('btn-vault-preview-cards');
  if (previewCardsBtn) {
    previewCardsBtn.addEventListener('click', () => {
      audio.playChime();
      store.setView('LOBBY');
    });
  }
}
