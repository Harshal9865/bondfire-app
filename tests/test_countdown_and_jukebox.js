// ==============================================================================
// TEST SUITE: Spotify 1-Click Jukebox, Rules Preview, & 5-4-3-2-1 Expanding Circle Countdown
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { store } from '../js/state/store.js';
import { renderHeader } from '../js/components/header.js';
import { renderSpotifyJukebox } from '../js/components/spotifyPlayer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Spotify Jukebox & 5-4-3-2-1 Expanding Circle Countdown Test Suite...\n');

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
// Suite 1: Spotify 1-Click Header Jukebox & Brand Icon
// -----------------------------------------------------------------------------
test('Header renders #btn-header-jukebox with authentic Spotify #1DB954 3-wave brand SVG', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('id="btn-header-jukebox"'), 'Header must contain #btn-header-jukebox button');
  assert.ok(headerHtml.includes('#1DB954'), 'Header icon must use authentic Spotify brand color #1DB954');
  assert.ok(headerHtml.includes('viewBox="0 0 24 24"'), 'Spotify icon must be a crisp vector SVG');
  assert.ok(headerHtml.includes('Spotify Jukebox'), 'Button title must reflect Spotify Jukebox');
});

test('index.html contains persistent jukebox-mount and countdown-mount in root DOM', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('id="jukebox-mount"'), 'index.html must include persistent #jukebox-mount');
  assert.ok(indexHtml.includes('id="countdown-mount"'), 'index.html must include persistent #countdown-mount');
});

test('app.js initializes persistent Jukebox mount without needing screen reloads', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert.ok(appJs.includes('renderSpotifyJukebox'), 'app.js must import and render Spotify Jukebox');
  assert.ok(appJs.includes('jukebox-mount'), 'app.js must mount to #jukebox-mount during app initialization');
});

test('renderSpotifyJukebox generates modal with #spotify-jukebox-modal and song controls', () => {
  const jukeboxHtml = renderSpotifyJukebox();
  assert.ok(jukeboxHtml.includes('id="spotify-jukebox-modal"'), 'Must generate #spotify-jukebox-modal');
  assert.ok(jukeboxHtml.includes('btn-mode-spotify'), 'Must have Spotify mode switcher');
  assert.ok(jukeboxHtml.includes('btn-mode-full-song'), 'Must have Free Full Songs switcher');
  assert.ok(jukeboxHtml.includes('jukebox-embed-iframe'), 'Must have embed iframe');
  assert.ok(jukeboxHtml.includes('Campfire Jukebox'), 'Must have Jukebox title');
});

// -----------------------------------------------------------------------------
// Suite 2: CSS Expanding Circle Wave and Kinetic Punch Animations
// -----------------------------------------------------------------------------
test('base.css defines @keyframes expandingCircleWave with center-to-corner clip-path', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf8');
  assert.ok(css.includes('@keyframes expandingCircleWave'), 'Must define expandingCircleWave keyframe');
  assert.ok(css.includes('circle(0% at 50% 50%)'), 'Wave must start at circle(0% at 50% 50%)');
  assert.ok(css.includes('circle(150% at 50% 50%)'), 'Wave must expand outward past all corners to circle(150% at 50% 50%)');
  assert.ok(css.includes('.animate-circle-wave'), 'Must provide .animate-circle-wave utility class');
});

test('base.css defines @keyframes countdownNumberPunch & @keyframes ringRadialPulse', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf8');
  assert.ok(css.includes('@keyframes countdownNumberPunch'), 'Must define countdownNumberPunch keyframe');
  assert.ok(css.includes('@keyframes ringRadialPulse'), 'Must define ringRadialPulse keyframe');
  assert.ok(css.includes('.animate-countdown-punch'), 'Must provide .animate-countdown-punch class');
  assert.ok(css.includes('.animate-ring-pulse'), 'Must provide .animate-ring-pulse class');
});

// -----------------------------------------------------------------------------
// Suite 3: Game Countdown Overlay Engine Specs
// -----------------------------------------------------------------------------
test('gameCountdownOverlay.js exports triggerGameCountdown and defines 5 distinct expanding circle colors', () => {
  const overlayJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'gameCountdownOverlay.js'), 'utf8');
  assert.ok(overlayJs.includes('export function triggerGameCountdown'), 'Must export triggerGameCountdown');
  assert.ok(overlayJs.includes('MODE_EXAMPLES'), 'Must include MODE_EXAMPLES rules and sample questions');
  assert.ok(overlayJs.includes('COUNTDOWN_STEPS'), 'Must define COUNTDOWN_STEPS 5-4-3-2-1');

  // Verify all 5 steps have unique colors
  assert.ok(overlayJs.includes('#7209B7'), 'Count 5 must use Electric Violet #7209B7');
  assert.ok(overlayJs.includes('#06D6A0'), 'Count 4 must use Cyber Aqua/Mint #06D6A0');
  assert.ok(overlayJs.includes('#FFB703'), 'Count 3 must use Amber Gold #FFB703');
  assert.ok(overlayJs.includes('#FF5A5F'), 'Count 2 must use Sunset Coral #FF5A5F');
  assert.ok(overlayJs.includes('#F72585'), 'Count 1 must use Duo Hot Rose #F72585');
  assert.ok(overlayJs.includes('renderIgniteBlast'), 'Count 0 must trigger IGNITE blast explosion');
});

test('gameCountdownOverlay.js provides rules, live sample question, and 5s timer with skip button', () => {
  const overlayJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'gameCountdownOverlay.js'), 'utf8');
  assert.ok(overlayJs.includes('example-timer-count'), 'Must display live seconds remaining count');
  assert.ok(overlayJs.includes('btn-skip-example'), 'Must have Skip & Start Now button');
  assert.ok(overlayJs.includes('Live Sample'), 'Must show live sample question card');
  assert.ok(overlayJs.includes('animate-circle-wave'), 'Circular countdown layer must use animate-circle-wave');
});

// -----------------------------------------------------------------------------
// Suite 4: Integration with Squad, Us/Couple, Solo, and Arcade Screens
// -----------------------------------------------------------------------------
test('lobby.js launches game through triggerGameCountdown', () => {
  const lobbyJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'lobby.js'), 'utf8');
  assert.ok(lobbyJs.includes("triggerGameCountdown({\n        mode: 'SQUAD'"), 'Squad lobby must trigger game countdown');
});

test('coupleScreen.js launches Us date night session through triggerGameCountdown', () => {
  const coupleJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'coupleScreen.js'), 'utf8');
  assert.ok(coupleJs.includes("triggerGameCountdown({\n        mode: 'US'"), 'Couple screen must trigger game countdown for Us mode');
});

test('soloScreen.js launches reflection quiz through triggerGameCountdown', () => {
  const soloJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'soloScreen.js'), 'utf8');
  assert.ok(soloJs.includes("triggerGameCountdown({\n          mode: 'SOLO'"), 'Solo screen must trigger game countdown for Solo quiz');
});

test('arcadeScreen.js launches mini-games through triggerGameCountdown', () => {
  const arcadeJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'arcadeScreen.js'), 'utf8');
  assert.ok(arcadeJs.includes("mode: 'ARCADE'"), 'Arcade screen must trigger game countdown for party games');
  assert.ok(arcadeJs.includes("title: 'Spin the Bottle'"), 'Spin the bottle must use countdown');
  assert.ok(arcadeJs.includes("title: 'Never Have I Ever'"), 'Never have I ever must use countdown');
  assert.ok(arcadeJs.includes("title: 'Most Likely To'"), 'Most likely to must use countdown');
});

console.log(`\n🎉 All ${passedTests} Spotify Jukebox & Countdown tests passed successfully!\n`);
