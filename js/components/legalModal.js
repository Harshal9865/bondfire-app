// ==============================================================================
// BONDFIRE LEGAL & COMPLIANCE CENTER MODAL (js/components/legalModal.js)
// Terms of Service, Privacy Policy, YouTube API Disclosure, Spotify Terms & DMCA
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';

let activeTab = 'terms'; // 'terms' | 'privacy' | 'dmca' | 'platforms'

export function openLegalModal(tab = 'terms') {
  activeTab = tab;
  const modalMount = document.getElementById('modal-mount');
  if (!modalMount) return;

  modalMount.innerHTML = renderLegalModalMarkup(activeTab);
  bindLegalModalEvents();
  audio.playClick();
}

export function closeLegalModal() {
  const modalMount = document.getElementById('modal-mount');
  if (modalMount) {
    modalMount.innerHTML = '';
  }
}

function renderLegalModalMarkup(tab) {
  return `
    <div id="legal-modal-backdrop" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div class="relative w-full max-w-2xl bg-surface-container-low border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/90 text-on-surface overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-border/70 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-mint-green/10 border border-mint-green/30 flex items-center justify-center text-mint-green">
              <span class="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base sm:text-lg font-bold text-white tracking-tight">Legal & Compliance Center</h3>
              <p class="text-[11px] text-gray-400 font-mono">BONDFIRE USER AGREEMENT & PRIVACY STANDARDS</p>
            </div>
          </div>
          <button id="btn-close-legal-modal" class="w-8 h-8 rounded-full bg-surface border border-border/80 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 py-3 border-b border-border/50 shrink-0 overflow-x-auto no-scrollbar">
          <button class="btn-legal-tab px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'terms' ? 'bg-amber-gold text-canvas' : 'bg-surface hover:bg-surface-bright text-gray-300'}" data-tab="terms">
            Terms of Service
          </button>
          <button class="btn-legal-tab px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'privacy' ? 'bg-mint-green text-canvas' : 'bg-surface hover:bg-surface-bright text-gray-300'}" data-tab="privacy">
            Privacy Policy
          </button>
          <button class="btn-legal-tab px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'platforms' ? 'bg-sunset-coral text-canvas' : 'bg-surface hover:bg-surface-bright text-gray-300'}" data-tab="platforms">
            Streaming & Third Parties
          </button>
          <button class="btn-legal-tab px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'dmca' ? 'bg-blue-500 text-canvas' : 'bg-surface hover:bg-surface-bright text-gray-300'}" data-tab="dmca">
            DMCA & Copyright
          </button>
        </div>

        <!-- Tab Content Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto py-4 text-xs sm:text-sm text-gray-300 space-y-4 pr-1 leading-relaxed">
          ${renderTabContent(tab)}
        </div>

        <!-- Footer Actions -->
        <div class="pt-4 border-t border-border/60 flex items-center justify-between shrink-0 text-xs">
          <span class="text-gray-500 font-mono text-[11px]">Last Updated: September 2026</span>
          <button id="btn-accept-legal-modal" class="px-5 py-2 rounded-xl bg-surface-bright hover:bg-surface-container-high border border-border text-white font-bold transition-all cursor-pointer">
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  `;
}

function renderTabContent(tab) {
  switch (tab) {
    case 'terms':
      return `
        <div>
          <h4 class="font-bold text-white text-sm sm:text-base mb-2">1. Acceptance of Terms</h4>
          <p class="mb-3 text-gray-300">
            By creating a room, joining a campfire session, uploading squad memories, or accessing Bondfire ("we", "us", or "our"), you agree to abide by these Terms of Service. If you do not agree, you must discontinue using Bondfire.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">2. Permitted Use & Squad Rooms</h4>
          <p class="mb-3 text-gray-300">
            Bondfire is designed for authentic social gaming between real friends, couples, and social pods. You agree NOT to:
          </p>
          <ul class="list-disc pl-5 space-y-1 mb-3 text-gray-400">
            <li>Upload non-consensual imagery, sexually explicit media, harassment, hate speech, or defaming material.</li>
            <li>Attempt to reverse-engineer, decompile, or scrape proprietary gameplay algorithms or prompt decks.</li>
            <li>Use automated bots, headless crawlers, or spoof user traffic on multiplayer rooms.</li>
          </ul>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">3. User-Generated Content & Vault Memories</h4>
          <p class="mb-3 text-gray-300">
            You retain 100% intellectual property ownership of any images, chats, or inside jokes you upload to the Memory Vault. You grant Bondfire a limited, royalty-free license solely to display and format your content for the participants in your private room.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">4. Limitation of Liability</h4>
          <p class="text-gray-400">
            Bondfire provides party game decks, prompts, and roasts for entertainment purposes only. Users participate voluntarily and are responsible for maintaining a supportive and consensual squad environment.
          </p>
        </div>
      `;

    case 'privacy':
      return `
        <div>
          <h4 class="font-bold text-mint-green text-sm sm:text-base mb-2">1. Our Core Privacy Philosophy</h4>
          <p class="mb-3 text-gray-300">
            Your private friendship memories and inside jokes belong to you and your friends. We believe in minimal data collection and zero surveillance capitalism.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">2. Live Voice Chat (WebRTC P2P)</h4>
          <div class="p-3 rounded-xl bg-mint-green/10 border border-mint-green/30 text-mint-green mb-3">
            <div class="font-bold mb-1 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">mic</span>
              <span>Zero-Storage Voice Guarantee</span>
            </div>
            <p class="text-xs text-gray-300">
              Live squad voice calls are transmitted end-to-end via direct browser-to-browser WebRTC peer connections. We NEVER record, transcribe, listen to, or store your voice audio on any server. Once a voice call ends, the audio is permanently gone.
            </p>
          </div>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">3. Zero AI Training on Private Chats</h4>
          <p class="mb-3 text-gray-300">
            When you export WhatsApp chat snippets or photo memories to generate inside joke questions, the text is processed in-memory solely for that round. Your private chats are NEVER sold, shared with third parties, or used to train public Large Language Models.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">4. Client-Side EXIF & PII Scrubbing</h4>
          <p class="mb-3 text-gray-300">
            Before any squad photo is saved to the cloud, Bondfire automatically scrubs all GPS geolocation coordinates, camera serial numbers, and EXIF metadata in your local browser using HTML5 Canvas pixel sanitization.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">5. User Data Rights & Erasure (GDPR / DPDP)</h4>
          <p class="text-gray-400">
            You can delete any photo, memory, or your entire account at any moment through the Profile Settings. Cloud files in Supabase are immediately purged.
          </p>
        </div>
      `;

    case 'platforms':
      return `
        <div>
          <h4 class="font-bold text-sunset-coral text-sm sm:text-base mb-2">Third-Party Platforms & Streaming Compliance</h4>
          <p class="mb-3 text-gray-300">
            Bondfire integrates with external multimedia platforms strictly through authorized, official embed players and APIs:
          </p>

          <div class="p-3.5 rounded-xl bg-surface border border-border/80 mb-3 space-y-2">
            <div class="flex items-center gap-2 text-white font-bold">
              <span class="material-symbols-outlined text-red-500">smart_display</span>
              <span>YouTube API Services & Embed Terms</span>
            </div>
            <p class="text-xs text-gray-300">
              Watch Party video streams are rendered exclusively through the official YouTube Iframe Player (<code class="text-amber-gold font-mono">youtube-nocookie.com/embed/</code>).
            </p>
            <ul class="list-disc pl-5 text-xs text-gray-400 space-y-1">
              <li>By using YouTube-powered Watch Party features, users agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" class="text-amber-gold underline">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-amber-gold underline">Google Privacy Policy</a>.</li>
              <li>Bondfire does not download, rip, or re-encode YouTube media streams.</li>
              <li>Official advertisements served by YouTube are unaltered, ensuring content creators receive all legitimate view counts and ad revenues.</li>
            </ul>
          </div>

          <div class="p-3.5 rounded-xl bg-surface border border-border/80 mb-3 space-y-2">
            <div class="flex items-center gap-2 text-white font-bold">
              <span class="material-symbols-outlined text-[#1DB954]">graphic_eq</span>
              <span>Spotify Developer Policy Compliance</span>
            </div>
            <p class="text-xs text-gray-300">
              Music and party playlists in the Jukebox are rendered via official Spotify Embed Widgets. Bondfire does not extract, decrypt, or record audio streams. All sound recordings remain the exclusive property of their respective artists and record labels.
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-surface border border-border/80 space-y-2">
            <div class="flex items-center gap-2 text-white font-bold">
              <span class="material-symbols-outlined text-blue-400">trademark</span>
              <span>Trademark Disclaimers</span>
            </div>
            <p class="text-xs text-gray-400">
              YouTube is a registered trademark of Google LLC. Spotify is a registered trademark of Spotify AB. Bondfire is an independent social gaming application and is not sponsored, endorsed, or affiliated with Google LLC, YouTube, or Spotify AB.
            </p>
          </div>
        </div>
      `;

    case 'dmca':
      return `
        <div>
          <h4 class="font-bold text-blue-400 text-sm sm:text-base mb-2">DMCA & Copyright Takedown Notice</h4>
          <p class="mb-3 text-gray-300">
            Bondfire operates as an online service provider and intermediary under the Digital Millennium Copyright Act (17 U.S.C. § 512) and Section 79 of the Indian Information Technology Act. We respect the intellectual property of creators and rights holders.
          </p>

          <h4 class="font-bold text-white text-sm sm:text-base mb-2">Filing a Copyright Takedown Request</h4>
          <p class="mb-3 text-gray-300">
            If you are a copyright owner or an authorized agent and believe that content stored in a Bondfire memory vault infringes your copyright, please submit a written notification with:
          </p>
          <ol class="list-decimal pl-5 space-y-1 mb-3 text-gray-400 text-xs">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material to be removed, including room URL or storage identifier.</li>
            <li>Your contact information (legal name, address, phone number, and email address).</li>
            <li>A statement that you have a good-faith belief that the use of the material is not authorized by the copyright owner.</li>
            <li>A statement made under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the owner.</li>
          </ol>

          <div class="p-3 rounded-xl bg-surface-bright border border-border flex items-center justify-between">
            <div>
              <div class="font-bold text-white">Designated Copyright Agent</div>
              <div class="text-gray-400 text-xs font-mono">legal@bondfire.app</div>
            </div>
            <a href="mailto:legal@bondfire.app?subject=DMCA%20Takedown%20Notice" class="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold hover:bg-blue-500/30 transition-colors">
              Submit Notice
            </a>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

function bindLegalModalEvents() {
  const closeBtn = document.getElementById('btn-close-legal-modal');
  const acceptBtn = document.getElementById('btn-accept-legal-modal');
  const backdrop = document.getElementById('legal-modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', () => closeLegalModal());
  if (acceptBtn) acceptBtn.addEventListener('click', () => closeLegalModal());
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeLegalModal();
    });
  }

  const tabBtns = document.querySelectorAll('.btn-legal-tab');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      openLegalModal(tab);
    });
  });
}
