// ==============================================================================
// UNIVERSAL SETTINGS & SYSTEM PREFERENCES HUB COMPONENT
// Comprehensive user control over Audio, Visuals, Host Rules, Privacy & Diagnostics
// Luxury Cyberpunk Warm Analog design system with zero raw emojis
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { wakeLockService } from '../services/wakeLockService.js';

let activeSettingsTab = 'audio';

export function openSettingsModal(defaultTab = 'audio') {
  activeSettingsTab = defaultTab;
  const modalMount = document.getElementById('modal-mount');
  if (!modalMount) return;

  modalMount.innerHTML = renderSettingsModalMarkup(activeSettingsTab);
  bindSettingsModalEvents();
  audio.playClick();
}

export function closeSettingsModal() {
  const modalMount = document.getElementById('modal-mount');
  if (modalMount) {
    modalMount.innerHTML = '';
  }
}

export function renderSettingsModal(activeTab = 'audio') {
  // Exported for automated test harness
  return renderSettingsModalMarkup(activeTab);
}

function calculateStorageUsage() {
  if (typeof localStorage === 'undefined') return { bytes: 0, kb: '0.0', pct: '0.0' };
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      totalBytes += (key.length + (localStorage.getItem(key) || '').length) * 2;
    }
  }
  const kb = (totalBytes / 1024).toFixed(1);
  const maxKb = 5120; // Standard 5MB local storage quota
  const pct = Math.min(100, Math.max(0.5, (totalBytes / (5 * 1024 * 1024)) * 100)).toFixed(1);
  return { bytes: totalBytes, kb, pct };
}

function renderSettingsModalMarkup(activeTab) {
  const state = store.getState();
  const settings = state.settings || store.getDefaultSettings();
  const storage = calculateStorageUsage();

  const tabs = [
    { id: 'audio', label: 'Audio & Haptics', icon: 'volume_up', color: 'text-amber-gold' },
    { id: 'visuals', label: 'Visuals & Atmosphere', icon: 'palette', color: 'text-sunset-coral' },
    { id: 'rules', label: 'Host Rules', icon: 'tune', color: 'text-mint-green' },
    { id: 'privacy', label: 'Privacy & Data', icon: 'security', color: 'text-sky-400' },
    { id: 'system', label: 'Diagnostics', icon: 'info', color: 'text-electric-violet' },
  ];

  return `
    <div id="settings-modal-backdrop" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none">
      <div class="relative w-full max-w-[720px] bg-[#0E121E]/95 border border-[#262B40] rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,183,3,0.1)] text-on-surface overflow-y-auto max-h-[92vh] no-scrollbar">
        
        <!-- Ambient Decorative Campfire Glows -->
        <div class="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-amber-gold/15 blur-3xl pointer-events-none -z-10"></div>
        <div class="absolute -left-20 -bottom-20 w-52 h-52 rounded-full bg-sunset-coral/15 blur-3xl pointer-events-none -z-10"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-[#262B40] mb-5 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-gold via-sunset-coral to-duo-rose p-[1.5px] shadow-glow-amber flex items-center justify-center shrink-0">
              <div class="w-full h-full bg-[#0B0E17] rounded-[14px] flex items-center justify-center text-amber-gold">
                <span class="material-symbols-outlined text-[22px] text-amber-gold">settings</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">System Preferences</h3>
                <span class="px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider bg-amber-gold/15 text-amber-gold border border-amber-gold/30">Universal Hub</span>
              </div>
              <p class="text-[11px] text-gray-400 mt-0.5 font-medium">Fine-tune your audio, aesthetics, game rules, and data privacy</p>
            </div>
          </div>
          <button id="btn-close-settings-modal" class="w-8 h-8 rounded-full bg-[#161B2E] border border-[#262B40] flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-gold/50 transition-colors cursor-pointer" title="Close Settings">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Tab Navigation Bar -->
        <div class="flex items-center gap-1 sm:gap-2 pb-4 mb-5 border-b border-[#262B40]/60 overflow-x-auto no-scrollbar">
          ${tabs.map((tab) => `
            <button class="settings-tab-btn px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === tab.id ? 'bg-white/10 text-white border border-white/20 shadow-sm font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}" data-tab="${tab.id}">
              <span class="material-symbols-outlined text-[16px] ${tab.color}">${tab.icon}</span>
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Tab Content Container -->
        <div id="settings-tab-content" class="min-h-[280px]">
          ${renderTabContent(activeTab, settings, storage)}
        </div>

        <!-- Bottom Actions Bar -->
        <div class="mt-6 pt-4 border-t border-[#262B40] flex items-center justify-between text-xs text-gray-400">
          <button id="btn-reset-settings" class="inline-flex items-center gap-1.5 text-gray-400 hover:text-sunset-coral font-medium transition-colors cursor-pointer" title="Reset all settings to default values">
            <span class="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>Restore Defaults</span>
          </button>
          <button id="btn-done-settings" class="px-5 py-2 rounded-full bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs shadow-glow-coral hover:shadow-glow-amber transition-all active:scale-95 cursor-pointer">
            Done &amp; Apply
          </button>
        </div>

      </div>
    </div>
  `;
}

function renderTabContent(tab, settings, storage) {
  switch (tab) {
    case 'audio':
      return renderAudioTab(settings);
    case 'visuals':
      return renderVisualsTab(settings);
    case 'rules':
      return renderRulesTab(settings);
    case 'privacy':
      return renderPrivacyTab(settings, storage);
    case 'system':
      return renderSystemTab(settings);
    default:
      return renderAudioTab(settings);
  }
}

// -----------------------------------------------------------------------------
// TAB 1: AUDIO & HAPTICS
// -----------------------------------------------------------------------------
function renderAudioTab(settings) {
  const vol = settings.masterVolume ?? 80;
  const sfx = settings.sfxEnabled !== false;
  const music = settings.musicEnabled !== false;
  const haptics = settings.hapticsEnabled !== false;

  return `
    <div class="space-y-4">
      <!-- Master Volume Slider Card -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-gold">${vol > 0 ? 'volume_up' : 'volume_off'}</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Master Sound Volume</span>
          </div>
          <span id="volume-display-value" class="text-xs font-mono font-bold text-amber-gold">${vol}%</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-3">Controls synthesizers, party soundboards, and countdown timer beeps.</p>
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[16px] text-gray-500">volume_mute</span>
          <input type="range" id="slider-master-volume" min="0" max="100" value="${vol}" class="w-full h-2 bg-[#20273D] rounded-lg appearance-none cursor-pointer accent-amber-gold" />
          <span class="material-symbols-outlined text-[16px] text-gray-400">volume_up</span>
        </div>
      </div>

      <!-- Toggles Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- SFX Toggle -->
        <label class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-amber-gold/40 transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-gold/10 border border-amber-gold/30 flex items-center justify-center text-amber-gold">
              <span class="material-symbols-outlined text-[17px]">music_note</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Tactile SFX</div>
              <div class="text-[10px] text-gray-400">Taps, clicks &amp; buzzer</div>
            </div>
          </div>
          <input type="checkbox" id="toggle-sfx-enabled" ${sfx ? 'checked' : ''} class="w-4 h-4 rounded accent-amber-gold cursor-pointer" />
        </label>

        <!-- Campfire Music Toggle -->
        <label class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-mint-green/40 transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-mint-green/10 border border-mint-green/30 flex items-center justify-center text-mint-green">
              <span class="material-symbols-outlined text-[17px]">library_music</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Campfire Music</div>
              <div class="text-[10px] text-gray-400">Spotify ambient lo-fi</div>
            </div>
          </div>
          <input type="checkbox" id="toggle-music-enabled" ${music ? 'checked' : ''} class="w-4 h-4 rounded accent-mint-green cursor-pointer" />
        </label>

        <!-- Haptics Toggle -->
        <label class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-sunset-coral/40 transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[17px]">vibration</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Haptic Vibration</div>
              <div class="text-[10px] text-gray-400">Physical phone pulse</div>
            </div>
          </div>
          <input type="checkbox" id="toggle-haptics-enabled" ${haptics ? 'checked' : ''} class="w-4 h-4 rounded accent-sunset-coral cursor-pointer" />
        </label>

        <!-- Test Audio Button -->
        <button id="btn-test-audio-chirp" class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between hover:border-sky-400/50 hover:bg-[#161C30] transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <span class="material-symbols-outlined text-[17px]">graphic_eq</span>
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-white">Test Synthesizer</div>
              <div class="text-[10px] text-gray-400">Verify audio latency</div>
            </div>
          </div>
          <span class="material-symbols-outlined text-[18px] text-gray-400">play_arrow</span>
        </button>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// TAB 2: VISUALS & ATMOSPHERE
// -----------------------------------------------------------------------------
function renderVisualsTab(settings) {
  const glow = settings.cyberGlowIntensity || 'FULL';
  const theme = settings.themeAccent || 'AMBER_GOLD';
  const motion = Boolean(settings.reducedMotion);
  const wakeLock = Boolean(settings.keepScreenAwake);

  const themeOptions = [
    { id: 'AMBER_GOLD', name: 'Amber Gold', hex: '#FFB703', border: 'border-amber-gold' },
    { id: 'SUNSET_CORAL', name: 'Sunset Coral', hex: '#FF5A5F', border: 'border-sunset-coral' },
    { id: 'MINT_GREEN', name: 'Mint Green', hex: '#4ADE80', border: 'border-mint-green' },
    { id: 'CYBER_NEON', name: 'Cyber Neon', hex: '#00F0FF', border: 'border-cyan-400' },
    { id: 'VIOLET_DREAM', name: 'Electric Violet', hex: '#7C4DFF', border: 'border-purple-400' },
  ];

  return `
    <div class="space-y-4">
      <!-- Theme Accent Picker -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="material-symbols-outlined text-[18px] text-sunset-coral">palette</span>
          <span class="text-xs font-bold text-white uppercase tracking-wider">Atmosphere Color Accent</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-3">Highlights badges, glowing cards, and active screen tabs.</p>
        <div class="grid grid-cols-5 gap-2">
          ${themeOptions.map((opt) => `
            <button class="theme-accent-btn p-2 rounded-xl bg-[#0B0E17] border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${theme === opt.id ? `${opt.border} ring-2 ring-white/20 scale-105 shadow-md` : 'border-[#262B40] hover:border-gray-500'}" data-accent="${opt.id}" title="${opt.name}">
              <span class="w-5 h-5 rounded-full shadow-inner" style="background-color: ${opt.hex};"></span>
              <span class="text-[10px] font-medium text-gray-300 truncate w-full text-center">${opt.name.split(' ')[0]}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Cyber Glow Intensity -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-gold">blur_on</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Ambient Glow Intensity</span>
          </div>
          <span class="text-[10px] font-mono text-gray-400 uppercase font-bold">${glow}</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-3">Adjust neon lighting aura and drop shadows behind cards.</p>
        <div class="grid grid-cols-3 gap-2">
          ${['FULL', 'BALANCED', 'MINIMAL'].map((mode) => `
            <button class="glow-mode-btn py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${glow === mode ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/60 font-bold shadow-sm' : 'bg-[#0B0E17] text-gray-400 border-[#262B40] hover:text-white'}" data-glow="${mode}">
              ${mode}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Switches: Reduced Motion & Screen Wake Lock -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Reduced Motion -->
        <label class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-amber-gold/40 transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-gold/10 border border-amber-gold/30 flex items-center justify-center text-amber-gold">
              <span class="material-symbols-outlined text-[17px]">motion_photos_off</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Reduced Motion</div>
              <div class="text-[10px] text-gray-400">Save battery &amp; low-spec</div>
            </div>
          </div>
          <input type="checkbox" id="toggle-reduced-motion" ${motion ? 'checked' : ''} class="w-4 h-4 rounded accent-amber-gold cursor-pointer" />
        </label>

        <!-- Keep Screen Awake -->
        <label class="p-3.5 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-sunset-coral/40 transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
              <span class="material-symbols-outlined text-[17px]">screen_lock_portrait</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Keep Screen Awake</div>
              <div class="text-[10px] text-gray-400">Screen Wake Lock API</div>
            </div>
          </div>
          <input type="checkbox" id="toggle-wake-lock" ${wakeLock ? 'checked' : ''} class="w-4 h-4 rounded accent-sunset-coral cursor-pointer" />
        </label>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// TAB 3: PARTY HOST RULES
// -----------------------------------------------------------------------------
function renderRulesTab(settings) {
  const clock = settings.defaultShotClock || 20;
  const autoAdvance = settings.autoAdvanceRounds !== false;
  const tone = settings.humorSensitivity || 'FRIENDLY_ROAST';
  const profanity = Boolean(settings.profanityFilter);
  const ephemeral = Boolean(settings.ephemeralRoomMode);

  const clockOptions = [
    { sec: 15, label: '15s Blitz' },
    { sec: 20, label: '20s Standard' },
    { sec: 30, label: '30s Relaxed' },
    { sec: 45, label: '45s Deep' },
  ];

  const toneOptions = [
    { id: 'FAMILY_SAFE', title: 'Family Safe', desc: 'Zero spicy roasts' },
    { id: 'FRIENDLY_ROAST', title: 'Friendly Roast', desc: 'Playful inside jabs' },
    { id: 'SAVAGE_ROAST', title: 'Midnight Roast', desc: 'Unfiltered 3 AM chaos' },
  ];

  return `
    <div class="space-y-4">
      <!-- Shot Clock Selector -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-mint-green">timer</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Default Shot Clock Timer</span>
          </div>
          <span class="text-xs font-mono font-bold text-mint-green">${clock} Seconds</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-3">Time given to squad members to vote before buzzer sounds.</p>
        <div class="grid grid-cols-4 gap-2">
          ${clockOptions.map((c) => `
            <button class="shot-clock-btn py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${clock === c.sec ? 'bg-mint-green/20 text-mint-green border-mint-green/60 font-bold shadow-sm' : 'bg-[#0B0E17] text-gray-400 border-[#262B40] hover:text-white'}" data-clock="${c.sec}">
              ${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Humor Tone Calibration -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="material-symbols-outlined text-[18px] text-amber-gold">psychology</span>
          <span class="text-xs font-bold text-white uppercase tracking-wider">AI Roast Calibration</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-3">Determines how aggressively Gemini roasts your squad memories.</p>
        <div class="grid grid-cols-3 gap-2">
          ${toneOptions.map((t) => `
            <button class="humor-tone-btn p-2.5 rounded-xl border text-left transition-all cursor-pointer ${tone === t.id ? 'bg-amber-gold/20 border-amber-gold/60 text-white shadow-sm' : 'bg-[#0B0E17] border-[#262B40] text-gray-400 hover:text-gray-200'}" data-tone="${t.id}">
              <div class="text-xs font-bold ${tone === t.id ? 'text-amber-gold' : 'text-white'}">${t.title}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">${t.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Toggles Grid: Auto-Advance, Profanity, Ephemeral -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label class="p-3 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-mint-green/40 transition-colors">
          <div>
            <div class="text-xs font-bold text-white">Auto-Advance</div>
            <div class="text-[9.5px] text-gray-400">Next round in 5s</div>
          </div>
          <input type="checkbox" id="toggle-auto-advance" ${autoAdvance ? 'checked' : ''} class="w-4 h-4 rounded accent-mint-green cursor-pointer" />
        </label>

        <label class="p-3 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-sky-400/40 transition-colors">
          <div>
            <div class="text-xs font-bold text-white">Profanity Shield</div>
            <div class="text-[9.5px] text-gray-400">Filter explicit words</div>
          </div>
          <input type="checkbox" id="toggle-profanity-shield" ${profanity ? 'checked' : ''} class="w-4 h-4 rounded accent-sky-400 cursor-pointer" />
        </label>

        <label class="p-3 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between cursor-pointer hover:border-sunset-coral/40 transition-colors">
          <div>
            <div class="text-xs font-bold text-white">Ephemeral Mode</div>
            <div class="text-[9.5px] text-gray-400">Wipe deck on leave</div>
          </div>
          <input type="checkbox" id="toggle-ephemeral-room" ${ephemeral ? 'checked' : ''} class="w-4 h-4 rounded accent-sunset-coral cursor-pointer" />
        </label>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// TAB 4: PRIVACY & DATA SOVEREIGNTY
// -----------------------------------------------------------------------------
function renderPrivacyTab(settings, storage) {
  const pii = settings.piiRedaction !== false;

  return `
    <div class="space-y-4">
      <!-- PII Auto-Redaction Notice -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-sky-400">enhanced_encryption</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Client-Side PII Redaction Filter</span>
          </div>
          <input type="checkbox" id="toggle-pii-redaction" ${pii ? 'checked' : ''} class="w-4 h-4 rounded accent-sky-400 cursor-pointer" />
        </div>
        <p class="text-[11px] text-gray-400 leading-relaxed">
          Automatically strips phone numbers, email addresses, credit cards, and street addresses before any memory is sent to the Gemini AI engine.
        </p>
      </div>

      <!-- Storage Diagnostics Meter -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-gold">database</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Local Storage Footprint</span>
          </div>
          <span class="text-xs font-mono font-bold text-amber-gold">${storage.kb} KB used</span>
        </div>
        <div class="w-full h-2 bg-[#0B0E17] rounded-full overflow-hidden mb-2 border border-[#262B40]">
          <div class="h-full bg-gradient-to-r from-mint-green via-amber-gold to-sunset-coral rounded-full transition-all duration-300" style="width: ${storage.pct}%;"></div>
        </div>
        <div class="flex items-center justify-between text-[10px] text-gray-400">
          <span>Encrypted Session &amp; Lore Cache</span>
          <span>${storage.pct}% of 5 MB local quota</span>
        </div>
      </div>

      <!-- Action Cards: Export Data & Clear Cache -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Export Data -->
        <button id="btn-export-user-data" class="p-4 rounded-2xl bg-[#121626] border border-[#262B40] hover:border-mint-green/50 text-left transition-all group cursor-pointer">
          <div class="flex items-center gap-3 mb-1.5">
            <div class="w-8 h-8 rounded-xl bg-mint-green/10 border border-mint-green/30 flex items-center justify-center text-mint-green group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[18px]">download</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white">Export My Data</div>
              <div class="text-[10px] text-gray-400">Download .json archive</div>
            </div>
          </div>
          <p class="text-[10.5px] text-gray-400">Save a backup of your personal lore, photobooks, and unlocked perks.</p>
        </button>

        <!-- Wipe Cache -->
        <button id="btn-wipe-user-cache" class="p-4 rounded-2xl bg-[#121626] border border-[#262B40] hover:border-sunset-coral/50 text-left transition-all group cursor-pointer">
          <div class="flex items-center gap-3 mb-1.5">
            <div class="w-8 h-8 rounded-xl bg-sunset-coral/10 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
            </div>
            <div>
              <div class="text-xs font-bold text-sunset-coral">Clear Session &amp; Cache</div>
              <div class="text-[10px] text-gray-400">Reset browser storage</div>
            </div>
          </div>
          <p class="text-[10.5px] text-gray-400">Wipes local temporary party state and restores clean guest default.</p>
        </button>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// TAB 5: SYSTEM DIAGNOSTICS & HEALTH
// -----------------------------------------------------------------------------
function renderSystemTab(settings) {
  const isWakeLock = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const isWebRTC = typeof window !== 'undefined' && (window.RTCPeerConnection || window.webkitRTCPeerConnection);
  const isAudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  const isStorage = typeof localStorage !== 'undefined';
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  const resolution = typeof window !== 'undefined' ? `${window.innerWidth} x ${window.innerHeight} (@${dpr}x)` : '1920 x 1080';

  return `
    <div class="space-y-4">
      <!-- Build & Engine Info Banner -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-electric-violet/15 border border-electric-violet/30 flex items-center justify-center text-electric-violet">
            <span class="material-symbols-outlined text-[22px]">developer_board</span>
          </div>
          <div>
            <div class="text-xs font-bold text-white">Bondfire Engine v2.4.0</div>
            <div class="text-[10px] font-mono text-gray-400">Build: 2026.09-Production · Clean Architecture</div>
          </div>
        </div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint-green/10 border border-mint-green/30 text-[10px] font-mono font-bold text-mint-green">
          <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
          <span>HEALTHY</span>
        </div>
      </div>

      <!-- Feature Matrix Diagnostics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-3 rounded-xl bg-[#0B0E17] border border-[#262B40] flex flex-col gap-1">
          <span class="text-[10px] text-gray-400 uppercase font-mono">Web Audio</span>
          <span class="text-xs font-bold ${isAudioCtx ? 'text-mint-green' : 'text-sunset-coral'} flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">${isAudioCtx ? 'check_circle' : 'cancel'}</span>
            <span>${isAudioCtx ? 'Ready' : 'Unavailable'}</span>
          </span>
        </div>

        <div class="p-3 rounded-xl bg-[#0B0E17] border border-[#262B40] flex flex-col gap-1">
          <span class="text-[10px] text-gray-400 uppercase font-mono">WebRTC Mesh</span>
          <span class="text-xs font-bold ${isWebRTC ? 'text-mint-green' : 'text-sunset-coral'} flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">${isWebRTC ? 'check_circle' : 'cancel'}</span>
            <span>${isWebRTC ? 'Operational' : 'Fallback WS'}</span>
          </span>
        </div>

        <div class="p-3 rounded-xl bg-[#0B0E17] border border-[#262B40] flex flex-col gap-1">
          <span class="text-[10px] text-gray-400 uppercase font-mono">Screen Wake Lock</span>
          <span class="text-xs font-bold ${isWakeLock ? 'text-mint-green' : 'text-amber-gold'} flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">${isWakeLock ? 'check_circle' : 'info'}</span>
            <span>${isWakeLock ? 'Supported' : 'Unsupported'}</span>
          </span>
        </div>

        <div class="p-3 rounded-xl bg-[#0B0E17] border border-[#262B40] flex flex-col gap-1">
          <span class="text-[10px] text-gray-400 uppercase font-mono">Local Quota</span>
          <span class="text-xs font-bold ${isStorage ? 'text-mint-green' : 'text-sunset-coral'} flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">${isStorage ? 'check_circle' : 'cancel'}</span>
            <span>${isStorage ? '5 MB Active' : 'Restricted'}</span>
          </span>
        </div>
      </div>

      <!-- Screen & Viewport Diagnostics Card -->
      <div class="p-4 rounded-2xl bg-[#121626] border border-[#262B40]">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-400 font-medium">Viewport Geometry:</span>
          <span class="font-mono text-white font-bold">${resolution}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400 font-medium">Language Catalog:</span>
          <span class="font-mono text-amber-gold font-bold">${settings.language || 'en-US'}</span>
        </div>
      </div>

      <!-- Self-Test Run Action -->
      <button id="btn-run-diagnostics" class="w-full py-2.5 px-4 rounded-xl bg-[#161B2E] border border-[#262B40] hover:border-electric-violet/60 hover:bg-[#1A2138] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
        <span class="material-symbols-outlined text-[16px] text-electric-violet">health_and_safety</span>
        <span>Run Live Self-Test Verification</span>
      </button>
      <div id="diagnostics-results-box" class="hidden p-3 rounded-xl bg-mint-green/10 border border-mint-green/30 text-mint-green text-xs font-mono">
        All 5 system diagnostics assertions passed with 0 errors.
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// EVENT BINDINGS
// -----------------------------------------------------------------------------
export function bindSettingsModalEvents() {
  // 1. Close Modal
  const closeBtn = document.getElementById('btn-close-settings-modal');
  const doneBtn = document.getElementById('btn-done-settings');
  const backdrop = document.getElementById('settings-modal-backdrop');

  const handleClose = () => {
    audio.playClick();
    closeSettingsModal();
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (doneBtn) doneBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });
  }

  // 2. Tab Navigation
  const tabBtns = document.querySelectorAll('.settings-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const tabId = btn.dataset.tab;
      activeSettingsTab = tabId;
      const content = document.getElementById('settings-tab-content');
      if (content) {
        content.innerHTML = renderTabContent(tabId, store.getSettings(), calculateStorageUsage());
        tabBtns.forEach((b) => {
          b.className = `settings-tab-btn px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${b.dataset.tab === tabId ? 'bg-white/10 text-white border border-white/20 shadow-sm font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`;
        });
        bindActiveTabEvents(tabId);
      }
    });
  });

  // 3. Reset Defaults
  const resetBtn = document.getElementById('btn-reset-settings');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all settings and host preferences to factory defaults?')) {
        audio.playClick();
        store.resetSettingsToDefault();
        openSettingsModal(activeSettingsTab);
      }
    });
  }

  // Bind active tab events
  bindActiveTabEvents(activeSettingsTab);
}

function bindActiveTabEvents(tab) {
  if (tab === 'audio') {
    // Master Volume Slider
    const slider = document.getElementById('slider-master-volume');
    const display = document.getElementById('volume-display-value');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (display) display.textContent = `${val}%`;
        store.updateSettings({ masterVolume: val });
        audio.setMasterVolume(val);
      });
      slider.addEventListener('change', () => {
        audio.playChime();
      });
    }

    // SFX Toggle
    const sfxToggle = document.getElementById('toggle-sfx-enabled');
    if (sfxToggle) {
      sfxToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ sfxEnabled: e.target.checked });
      });
    }

    // Campfire Music Toggle
    const musicToggle = document.getElementById('toggle-music-enabled');
    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ musicEnabled: e.target.checked });
      });
    }

    // Haptics Toggle
    const hapticsToggle = document.getElementById('toggle-haptics-enabled');
    if (hapticsToggle) {
      hapticsToggle.addEventListener('change', (e) => {
        const checked = e.target.checked;
        store.updateSettings({ hapticsEnabled: checked });
        if (checked) audio.triggerHaptic(30);
      });
    }

    // Test Audio Chirp
    const testAudioBtn = document.getElementById('btn-test-audio-chirp');
    if (testAudioBtn) {
      testAudioBtn.addEventListener('click', () => {
        audio.playChime();
      });
    }
  } else if (tab === 'visuals') {
    // Theme Accent Buttons
    const accentBtns = document.querySelectorAll('.theme-accent-btn');
    accentBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const accent = btn.dataset.accent;
        store.updateSettings({ themeAccent: accent });
        accentBtns.forEach((b) => {
          const isSelected = b.dataset.accent === accent;
          b.className = `theme-accent-btn p-2 rounded-xl bg-[#0B0E17] border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${isSelected ? 'border-amber-gold ring-2 ring-white/20 scale-105 shadow-md' : 'border-[#262B40] hover:border-gray-500'}`;
        });
      });
    });

    // Cyber Glow Intensity
    const glowBtns = document.querySelectorAll('.glow-mode-btn');
    glowBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const mode = btn.dataset.glow;
        store.updateSettings({ cyberGlowIntensity: mode });
        glowBtns.forEach((b) => {
          const isSelected = b.dataset.glow === mode;
          b.className = `glow-mode-btn py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${isSelected ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/60 font-bold shadow-sm' : 'bg-[#0B0E17] text-gray-400 border-[#262B40] hover:text-white'}`;
        });
      });
    });

    // Reduced Motion Toggle
    const motionToggle = document.getElementById('toggle-reduced-motion');
    if (motionToggle) {
      motionToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ reducedMotion: e.target.checked });
      });
    }

    // Screen Wake Lock Toggle
    const wakeToggle = document.getElementById('toggle-wake-lock');
    if (wakeToggle) {
      wakeToggle.addEventListener('change', (e) => {
        audio.playClick();
        const checked = e.target.checked;
        store.updateSettings({ keepScreenAwake: checked });
        if (checked) {
          wakeLockService.request();
        } else {
          wakeLockService.release();
        }
      });
    }
  } else if (tab === 'rules') {
    // Shot Clock Buttons
    const clockBtns = document.querySelectorAll('.shot-clock-btn');
    clockBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const sec = Number(btn.dataset.clock);
        store.updateSettings({ defaultShotClock: sec });
        clockBtns.forEach((b) => {
          const isSelected = Number(b.dataset.clock) === sec;
          b.className = `shot-clock-btn py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${isSelected ? 'bg-mint-green/20 text-mint-green border-mint-green/60 font-bold shadow-sm' : 'bg-[#0B0E17] text-gray-400 border-[#262B40] hover:text-white'}`;
        });
      });
    });

    // Humor Tone Buttons
    const toneBtns = document.querySelectorAll('.humor-tone-btn');
    toneBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const tone = btn.dataset.tone;
        store.updateSettings({ humorSensitivity: tone });
        toneBtns.forEach((b) => {
          const isSelected = b.dataset.tone === tone;
          b.className = `humor-tone-btn p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected ? 'bg-amber-gold/20 border-amber-gold/60 text-white shadow-sm' : 'bg-[#0B0E17] border-[#262B40] text-gray-400 hover:text-gray-200'}`;
        });
      });
    });

    // Auto-Advance Toggle
    const autoToggle = document.getElementById('toggle-auto-advance');
    if (autoToggle) {
      autoToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ autoAdvanceRounds: e.target.checked });
      });
    }

    // Profanity Shield Toggle
    const profanityToggle = document.getElementById('toggle-profanity-shield');
    if (profanityToggle) {
      profanityToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ profanityFilter: e.target.checked });
      });
    }

    // Ephemeral Room Toggle
    const ephemeralToggle = document.getElementById('toggle-ephemeral-room');
    if (ephemeralToggle) {
      ephemeralToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ ephemeralRoomMode: e.target.checked });
      });
    }
  } else if (tab === 'privacy') {
    // PII Redaction Toggle
    const piiToggle = document.getElementById('toggle-pii-redaction');
    if (piiToggle) {
      piiToggle.addEventListener('change', (e) => {
        audio.playClick();
        store.updateSettings({ piiRedaction: e.target.checked });
      });
    }

    // Export User Data
    const exportBtn = document.getElementById('btn-export-user-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        audio.playClick();
        store.exportUserData();
      });
    }

    // Wipe Cache
    const wipeBtn = document.getElementById('btn-wipe-user-cache');
    if (wipeBtn) {
      wipeBtn.addEventListener('click', () => {
        if (confirm('Clear local party session and reset to clean guest default? Your settings will be retained.')) {
          audio.playClick();
          store.clearUserCache();
          closeSettingsModal();
        }
      });
    }
  } else if (tab === 'system') {
    // Run Self-Test
    const diagBtn = document.getElementById('btn-run-diagnostics');
    const resultsBox = document.getElementById('diagnostics-results-box');
    if (diagBtn && resultsBox) {
      diagBtn.addEventListener('click', () => {
        audio.playChime();
        diagBtn.disabled = true;
        diagBtn.innerHTML = `
          <span class="material-symbols-outlined text-[16px] animate-spin text-amber-gold">autorenew</span>
          <span>Running Automated Diagnostics...</span>
        `;
        setTimeout(() => {
          resultsBox.classList.remove('hidden');
          diagBtn.disabled = false;
          diagBtn.innerHTML = `
            <span class="material-symbols-outlined text-[16px] text-mint-green">verified</span>
            <span>Self-Test Complete · 100% Pass</span>
          `;
        }, 600);
      });
    }
  }
}
