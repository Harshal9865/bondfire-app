// ==============================================================================
// TEST SUITE: UNIVERSAL SETTINGS & SYSTEM PREFERENCES HUB
// Validates settings schema, persistence, audio volume, data export, and UI triggers
// ==============================================================================

import assert from 'assert';

// Mock Browser Environment
global.window = {
  location: { hostname: 'localhost', hash: '#/HOME' },
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.document = {
  body: {
    classList: {
      toggle: () => {},
      add: () => {},
      remove: () => {},
    },
    setAttribute: () => {},
    appendChild: () => {},
    removeChild: () => {},
  },
  createElement: () => ({
    href: '',
    download: '',
    click: () => {},
    setAttribute: () => {},
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
};
try {
  Object.defineProperty(global.navigator, 'vibrate', {
    value: (dur) => { global.__lastVibration = dur; return true; },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(global.navigator, 'wakeLock', {
    value: { request: async () => ({ released: false, release: async () => {} }) },
    configurable: true,
    writable: true,
  });
} catch (_) {}
global.Blob = class {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }
};
global.URL = {
  createObjectURL: () => 'blob:mock-url',
  revokeObjectURL: () => {},
};

// Mock LocalStorage
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  get length() { return storageMap.size; },
  key: (idx) => Array.from(storageMap.keys())[idx] || null,
};
global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  clear: () => {},
};

async function runTests() {
  console.log('⚡ Starting Universal Settings & System Preferences Test Suite...\n');

  const { store } = await import('../js/state/store.js');
  const { CONFIG } = await import('../js/config.js');
  const { audio } = await import('../js/visuals/audioSynth.js');
  const { renderSettingsModal } = await import('../js/components/settingsModal.js');
  const { renderHeader } = await import('../js/components/header.js');
  const { renderFooter } = await import('../js/components/footer.js');
  const { renderProfileScreen } = await import('../js/components/profileScreen.js');

  // Test 1: Default Settings Schema
  const defaultSettings = store.getDefaultSettings();
  assert.strictEqual(typeof defaultSettings, 'object', 'Default settings must be an object');
  assert.strictEqual(defaultSettings.masterVolume, 80, 'Default master volume should be 80%');
  assert.strictEqual(defaultSettings.sfxEnabled, true, 'Default SFX should be enabled');
  assert.strictEqual(defaultSettings.musicEnabled, true, 'Default Music should be enabled');
  assert.strictEqual(defaultSettings.hapticsEnabled, true, 'Default Haptics should be enabled');
  assert.strictEqual(defaultSettings.cyberGlowIntensity, 'FULL', 'Default glow intensity should be FULL');
  assert.strictEqual(defaultSettings.reducedMotion, false, 'Default reduced motion should be false');
  assert.strictEqual(defaultSettings.defaultShotClock, 20, 'Default shot clock should be 20s');
  assert.strictEqual(defaultSettings.humorSensitivity, 'FRIENDLY_ROAST', 'Default roast tone should be FRIENDLY_ROAST');
  assert.strictEqual(defaultSettings.piiRedaction, true, 'Default PII redaction should be true');
  console.log('  ✅ PASS: Default settings schema matches requirements');

  // Test 2: Update Settings & Persistence
  store.updateSettings({
    masterVolume: 45,
    themeAccent: 'CYBER_NEON',
    reducedMotion: true,
  });
  const currentSettings = store.getSettings();
  assert.strictEqual(currentSettings.masterVolume, 45, 'Updated master volume should be 45');
  assert.strictEqual(currentSettings.themeAccent, 'CYBER_NEON', 'Updated theme accent should be CYBER_NEON');
  assert.strictEqual(currentSettings.reducedMotion, true, 'Updated reduced motion should be true');

  const persistedSettingsStr = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
  assert.ok(persistedSettingsStr, 'Settings must be persisted to CONFIG.STORAGE_KEY_SETTINGS');
  const persistedSettings = JSON.parse(persistedSettingsStr);
  assert.strictEqual(persistedSettings.masterVolume, 45, 'Persisted master volume must match');
  console.log('  ✅ PASS: updateSettings modifies state and persists to localStorage');

  // Test 3: Audio Synthesizer Master Volume Control
  assert.strictEqual(typeof audio.setMasterVolume, 'function', 'audioSynth must implement setMasterVolume');
  audio.setMasterVolume(60);
  assert.strictEqual(audio.isEnabled(), true, 'Audio should be enabled at 60%');
  audio.setMasterVolume(0);
  store.updateSettings({ masterVolume: 0 });
  assert.strictEqual(audio.isEnabled(), false, 'Audio should report disabled when master volume is 0%');

  // Re-enable volume
  store.updateSettings({ masterVolume: 75, sfxEnabled: true });
  assert.strictEqual(audio.isEnabled(), true, 'Audio should re-enable when volume > 0 and sfxEnabled');
  console.log('  ✅ PASS: audioSynth respects master volume slider and mute thresholds');

  // Test 4: Haptic Vibration Toggle Guard
  global.__lastVibration = null;
  store.updateSettings({ hapticsEnabled: false });
  audio.triggerHaptic(50);
  assert.strictEqual(global.__lastVibration, null, 'Haptic vibration must be suppressed when hapticsEnabled is false');

  store.updateSettings({ hapticsEnabled: true });
  audio.triggerHaptic(30);
  assert.strictEqual(global.__lastVibration, 30, 'Haptic vibration must fire when hapticsEnabled is true');
  console.log('  ✅ PASS: Haptic vibration respects user haptics toggle');

  // Test 5: User Data Export JSON Archive
  const exportPayload = store.exportUserData();
  assert.strictEqual(exportPayload.app, 'Bondfire Social Memory Engine', 'Export app title');
  assert.ok(exportPayload.user, 'Export must include user passport');
  assert.ok(exportPayload.settings, 'Export must include user settings');
  assert.ok(Array.isArray(exportPayload.vaultMemories), 'Export must include vault memories array');
  assert.ok(Array.isArray(exportPayload.albumMemories), 'Export must include album memories array');
  console.log('  ✅ PASS: exportUserData produces complete JSON backup archive');

  // Test 6: Clear Session & Wipe Cache
  store.setState({ customGameDeck: [{ id: 'test_card_1', title: 'Test Card' }], vaultMemories: [{ id: 'v1' }] });
  assert.strictEqual(store.getState().customGameDeck.length, 1);
  assert.strictEqual(store.getState().vaultMemories.length, 1);
  store.clearUserCache();
  assert.strictEqual(store.getState().customGameDeck.length, 0, 'Custom deck should be purged');
  assert.strictEqual(store.getState().vaultMemories.length, 0, 'Vault memories should be purged');
  assert.strictEqual(store.getState().currentView, 'HOME', 'Current view reset to HOME');
  console.log('  ✅ PASS: clearUserCache purges session and restores clean guest state');

  // Test 7: Universal Settings Modal Rendering across all 5 Tabs
  const audioMarkup = renderSettingsModal('audio');
  assert.ok(audioMarkup.includes('Master Sound Volume'), 'Audio tab must render volume control');
  assert.ok(audioMarkup.includes('Tactile SFX'), 'Audio tab must render SFX toggle');
  assert.ok(audioMarkup.includes('slider-master-volume'), 'Audio tab must render slider input');

  const visualsMarkup = renderSettingsModal('visuals');
  assert.ok(visualsMarkup.includes('Atmosphere Color Accent'), 'Visuals tab must render color swatches');
  assert.ok(visualsMarkup.includes('Reduced Motion'), 'Visuals tab must render reduced motion toggle');
  assert.ok(visualsMarkup.includes('Keep Screen Awake'), 'Visuals tab must render screen wake lock toggle');

  const rulesMarkup = renderSettingsModal('rules');
  assert.ok(rulesMarkup.includes('Default Shot Clock Timer'), 'Rules tab must render timer options');
  assert.ok(rulesMarkup.includes('AI Roast Calibration'), 'Rules tab must render roast calibration');
  assert.ok(rulesMarkup.includes('Auto-Advance'), 'Rules tab must render auto-advance toggle');

  const privacyMarkup = renderSettingsModal('privacy');
  assert.ok(privacyMarkup.includes('Client-Side PII Redaction Filter'), 'Privacy tab must render PII filter');
  assert.ok(privacyMarkup.includes('Export My Data'), 'Privacy tab must render export button');
  assert.ok(privacyMarkup.includes('Local Storage Footprint'), 'Privacy tab must render storage meter');

  const systemMarkup = renderSettingsModal('system');
  assert.ok(systemMarkup.includes('Bondfire Engine v2.4.0'), 'System tab must render version badge');
  assert.ok(systemMarkup.includes('Run Live Self-Test Verification'), 'System tab must render self-test button');
  console.log('  ✅ PASS: renderSettingsModal renders all 5 tabs with comprehensive controls');

  // Test 8: Header Triggers
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('id="btn-header-settings"'), 'Header must contain #btn-header-settings button');
  assert.ok(headerHtml.includes('id="btn-sheet-settings"'), 'Mobile explore sheet must contain #btn-sheet-settings');
  console.log('  ✅ PASS: header.js contains desktop and mobile settings triggers');

  // Test 9: Profile Triggers
  const profileHtml = renderProfileScreen();
  assert.ok(profileHtml.includes('id="btn-profile-settings"'), 'Profile must contain #btn-profile-settings button');
  assert.ok(profileHtml.includes('id="btn-profile-open-settings"'), 'Profile must contain #btn-profile-open-settings deep link');
  console.log('  ✅ PASS: profileScreen.js contains top action and privacy deep link triggers');

  // Test 10: Footer Triggers
  const footerHtml = renderFooter();
  assert.ok(footerHtml.includes('id="btn-footer-settings"'), 'Footer must contain #btn-footer-settings in bottom bar');
  assert.ok(footerHtml.includes('id="btn-footer-open-settings"'), 'Footer must contain #btn-footer-open-settings link');
  console.log('  ✅ PASS: footer.js contains system preferences triggers');

  console.log('\n🎉 ALL 10 UNIVERSAL SETTINGS TESTS PASSED FLAWLESSLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Settings test failed:', err);
  process.exit(1);
});
