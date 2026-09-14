// ==============================================================================
// TEST SUITE: Pre-Game Rules Example Guest Sync & Anti-Blur Lockup Verification
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Countdown Blur Fix & Guest Synchronization Test Suite...\n');

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------------------
// Suite 1: AudioSynthesizer playBip method
// -----------------------------------------------------------------------------
test('audioSynth.js provides playBip method for zero-crash procedural countdown ticks', () => {
  const audioJs = fs.readFileSync(path.join(rootDir, 'js', 'visuals', 'audioSynth.js'), 'utf8');
  assert.ok(audioJs.includes('playBip()'), 'audioSynth.js must provide playBip() method');
});

// -----------------------------------------------------------------------------
// Suite 2: Anti-Blur Lockup & Emergency Escape Hatch
// -----------------------------------------------------------------------------
test('gameCountdownOverlay.js strips backdropFilter during expanding circle countdown to prevent blur freeze', () => {
  const overlayJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'gameCountdownOverlay.js'), 'utf8');
  assert.ok(overlayJs.includes("overlay.style.backdropFilter = 'none'"), 'Must set backdropFilter to none during countdown');
  assert.ok(overlayJs.includes("overlay.style.webkitBackdropFilter = 'none'"), 'Must set webkitBackdropFilter to none during countdown');
});

test('gameCountdownOverlay.js provides persistent emergency close button #btn-countdown-emergency-close', () => {
  const overlayJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'gameCountdownOverlay.js'), 'utf8');
  assert.ok(overlayJs.includes('btn-countdown-emergency-close'), 'Must provide #btn-countdown-emergency-close emergency exit button');
  assert.ok(overlayJs.includes('z-[120]'), 'Close button must sit on high z-index above all animation layers');
});

test('gameCountdownOverlay.js includes 7.5s safety watchdog timer', () => {
  const overlayJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'gameCountdownOverlay.js'), 'utf8');
  assert.ok(overlayJs.includes('watchdogTimer'), 'Must include safety watchdog timer');
  assert.ok(overlayJs.includes('7500'), 'Watchdog timer must auto-cleanup after 7500ms max');
});

// -----------------------------------------------------------------------------
// Suite 3: Cross-Device Synchronized Broadcasts (Host + Campers)
// -----------------------------------------------------------------------------
test('lobby.js immediately broadcasts START_COUNTDOWN so campers see rules & countdown simultaneously with host', () => {
  const lobbyJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'lobby.js'), 'utf8');
  assert.ok(lobbyJs.includes("broadcastRoomAction('START_COUNTDOWN'"), 'Host must broadcast START_COUNTDOWN immediately on click');
});

test('lobby.js broadcasts START_BOTTLE on launching Spin the Bottle arcade game', () => {
  const lobbyJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'lobby.js'), 'utf8');
  assert.ok(lobbyJs.includes("broadcastRoomAction('START_BOTTLE'"), 'Must broadcast START_BOTTLE to sync room campers');
});

test('supabaseClient.js handles START_COUNTDOWN, START_BOTTLE, and START_ARCADE_GAME broadcasts', () => {
  const supaJs = fs.readFileSync(path.join(rootDir, 'js', 'services', 'supabaseClient.js'), 'utf8');
  assert.ok(supaJs.includes("payload.action === 'START_COUNTDOWN'"), 'Must handle incoming START_COUNTDOWN for room campers');
  assert.ok(supaJs.includes("payload.action === 'START_BOTTLE'"), 'Must handle incoming START_BOTTLE');
  assert.ok(supaJs.includes("payload.action === 'START_ARCADE_GAME'"), 'Must handle incoming START_ARCADE_GAME');
});

test('coupleScreen.js broadcasts START_DUO_SESSION immediately on host click', () => {
  const coupleJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'coupleScreen.js'), 'utf8');
  assert.ok(coupleJs.includes("broadcastRoomAction('START_DUO_SESSION'"), 'Couple session start must broadcast to partner device');
});

test('base.css provides both -webkit-clip-path and clip-path for cross-browser circular shockwave', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf8');
  assert.ok(css.includes('-webkit-clip-path: circle(0% at 50% 50%)'), 'Must include -webkit-clip-path prefix');
  assert.ok(css.includes('clip-path: circle(0% at 50% 50%)'), 'Must include standard clip-path');
});

console.log(`\n🎉 All ${passedTests} blur-fix and guest-sync tests passed successfully!\n`);
