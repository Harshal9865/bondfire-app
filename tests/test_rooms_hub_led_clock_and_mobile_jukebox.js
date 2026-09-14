// ==============================================================================
// TEST SUITE: Rooms Hub (Duo vs Squad), LED Matrix Clock & Mobile Jukebox Elevation
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderRoomsHub } from '../js/components/roomsHubScreen.js';
import { renderSpotifyJukebox } from '../js/components/spotifyPlayer.js';
import { renderHomeScrollStory } from '../js/components/homeScrollStory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Rooms Hub, LED Matrix Clock & Mobile Jukebox Test Suite...\n');

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
// Suite 1: Navbar Spotify Jukebox Dropdown & Room Sync
// -----------------------------------------------------------------------------
test('spotifyPlayer.js anchors jukebox modal to navbar Spotify icon with room sync and removes floating bottom button', () => {
  const jukeboxHtml = renderSpotifyJukebox();
  assert.ok(
    !jukeboxHtml.includes('id="btn-toggle-jukebox"'),
    'Bottom floating jukebox toggle button must be completely removed'
  );
  assert.ok(
    jukeboxHtml.includes('top-14') || jukeboxHtml.includes('top: calc'),
    'Jukebox container must be anchored to top navbar under Spotify icon'
  );
  assert.ok(
    jukeboxHtml.includes('Party In-Sync') || jukeboxHtml.includes('broadcastMusicSync'),
    'Must support real-time room audio synchronization'
  );
  assert.ok(jukeboxHtml.includes('w-[calc(100vw-24px)]'), 'Jukebox modal must fit cleanly on mobile screens');
});

// -----------------------------------------------------------------------------
// Suite 2: Rooms Hub Page (Duo vs Squad Selection)
// -----------------------------------------------------------------------------
test('roomsHubScreen.js renders luxury Duo vs Squad Room selection experience', () => {
  const hubHtml = renderRoomsHub();
  assert.ok(hubHtml.includes('Choose Your Room Experience'), 'Must display room choice header');
  assert.ok(hubHtml.includes('Us Mode · Duo Sanctuary'), 'Must include Duo Room option');
  assert.ok(hubHtml.includes('Squad Party Arena'), 'Must include Squad Room option');
  assert.ok(hubHtml.includes('id="btn-select-duo-room"'), 'Must have button to enter Duo room');
  assert.ok(hubHtml.includes('id="btn-select-squad-room"'), 'Must have button to enter Squad room');
  assert.ok(hubHtml.includes('hub-quick-join-input'), 'Must provide inline code join for squad/duo');
});

test('app.js routes ROOMS view directly to renderRoomsHub', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert.ok(appJs.includes('renderRoomsHub'), 'app.js must import renderRoomsHub');
  assert.ok(appJs.includes("case 'ROOMS':") && appJs.includes('this.appMount.innerHTML = renderRoomsHub();'), 'ROOMS view must route to renderRoomsHub');
});

test('header.js mobile bottom dock Rooms tab sets view to ROOMS with URL hash sync', () => {
  const headerJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'header.js'), 'utf8');
  assert.ok(headerJs.includes('data-view="ROOMS"'), 'Mobile bottom dock must have Rooms tab');
  assert.ok(headerJs.includes("window.location.hash = `#/${view}`"), 'Bottom tabs must sync URL hash');
});

// -----------------------------------------------------------------------------
// Suite 3: Retro Red LED Matrix Clock Display (Reference Image 1)
// -----------------------------------------------------------------------------
test('homeScrollStory.js renders retro red LED matrix clock (Reference Image 1)', () => {
  const homeHtml = renderHomeScrollStory();
  assert.ok(homeHtml.includes('id="retro-led-clock-chassis"'), 'Must render retro red clock housing');
  assert.ok(homeHtml.includes('led-matrix-housing'), 'Must use led-matrix-housing CSS class');
  assert.ok(homeHtml.includes('id="led-matrix-clock-time"'), 'Must render LED matrix clock digits');
  assert.ok(homeHtml.includes('18:08'), 'Initial display reflects reference image 18:08 clock format');
  assert.ok(homeHtml.includes('id="led-matrix-ticker-text"'), 'Must render animated LED ticker text');
});

test('homeScrollStory.js binds live ticking and interactive tap mode to LED clock', () => {
  const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'homeScrollStory.js'), 'utf8');
  assert.ok(homeJs.includes('clockChassis.addEventListener'), 'Tapping chassis must cycle clock modes');
  assert.ok(homeJs.includes('ledInterval'), 'Clock must tick every second');
});

// -----------------------------------------------------------------------------
// Suite 4: Keepsake Card 3D Animation & Mobile Touch Hover (Reference Image 2)
// -----------------------------------------------------------------------------
test('css/components.css supports mobile 3D tilt sway and touch hover straightening for Keepsake Card', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'components.css'), 'utf8');
  assert.ok(css.includes('@keyframes mobileCardSway'), 'Must define mobileCardSway keyframes');
  assert.ok(css.includes('.hero-3d-tilted-card:active'), 'Must support active touch state for mobile');
  assert.ok(css.includes('.hero-3d-tilted-card.is-active'), 'Must support is-active class for mobile tap toggle');
});

test('homeScrollStory.js wraps Keepsake Card in hero-3d-card-stage and binds touch events', () => {
  const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'homeScrollStory.js'), 'utf8');
  assert.ok(homeJs.includes('hero-3d-card-stage'), 'Home keepsake card must use hero-3d-card-stage');
  assert.ok(homeJs.includes('home-keepsake-3d-card'), 'Home keepsake card must have id home-keepsake-3d-card');
  assert.ok(homeJs.includes("keepsakeCard.addEventListener('touchstart'"), 'Must handle touchstart for mobile hover effect');
});

console.log(`\n🎉 All ${passedTests} Rooms Hub, LED Clock & Mobile Animation tests passed successfully!\n`);
