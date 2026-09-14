// ==============================================================================
// TEST SUITE: ARCADE MODES (GROUP, DUOS, SOLO) & AESTHETIC EXAMPLES
// Validates:
// 1. Reactive Store arcadePlayMode state & mutation
// 2. Arcade Hub mode tabs & "How to Play (Example)" modals
// 3. Countdown & Example Engine 3-step visual breakdowns across all games
// 4. All 7 Arcade Games rendering & handling GROUP, DUOS, and SOLO modes
// ==============================================================================

import { strict as assert } from 'assert';
import { store } from '../js/state/store.js';
import { renderArcadeScreen } from '../js/components/arcadeScreen.js';
import {
  MODE_EXAMPLES,
  getExampleForMode,
  showGameExampleModal,
  buildExampleCardHtml
} from '../js/components/gameCountdownOverlay.js';
import { renderRajaMantriGame } from '../js/components/rajaMantriGame.js';
import { renderTambolaGame } from '../js/components/tambolaGame.js';
import { renderBollywoodGame } from '../js/components/bollywoodGame.js';
import { renderSpinBottleGame } from '../js/components/spinBottleGame.js';
import { renderNeverHaveIEverGame } from '../js/components/neverHaveIEverGame.js';
import { renderMostLikelyToGame } from '../js/components/mostLikelyToGame.js';
import { renderShowsScreen } from '../js/components/showsScreen.js';

console.log('🧪 Starting Arcade Modes and Aesthetic Examples Test Suite...\n');

// -----------------------------------------------------------------------------
// 1. Reactive Store Play Mode
// -----------------------------------------------------------------------------
console.log('1. Testing Reactive Store arcadePlayMode actions...');
assert.equal(store.getState().arcadePlayMode, 'GROUP', 'Default arcadePlayMode must be GROUP');

store.setArcadePlayMode('DUOS');
assert.equal(store.getState().arcadePlayMode, 'DUOS', 'arcadePlayMode should update to DUOS');

store.setArcadePlayMode('SOLO');
assert.equal(store.getState().arcadePlayMode, 'SOLO', 'arcadePlayMode should update to SOLO');

store.setArcadePlayMode('GROUP');
assert.equal(store.getState().arcadePlayMode, 'GROUP', 'arcadePlayMode should reset to GROUP');
console.log('   ✅ Reactive Store arcadePlayMode verified.\n');

// -----------------------------------------------------------------------------
// 2. Arcade Hub Screen Rendering & Mode Adaptations
// -----------------------------------------------------------------------------
console.log('2. Testing Arcade Hub Play Mode Selector & Example Triggers...');
store.setArcadePlayMode('GROUP');
let hubHtml = renderArcadeScreen();
assert.ok(hubHtml.includes('btn-arcade-mode-tab'), 'Hub must have mode switcher buttons');
assert.ok(hubHtml.includes('data-mode="GROUP"'), 'Hub must list Group tab');
assert.ok(hubHtml.includes('data-mode="DUOS"'), 'Hub must list Duos tab');
assert.ok(hubHtml.includes('data-mode="SOLO"'), 'Hub must list Solo tab');
assert.ok(hubHtml.includes('Group (Squad 3+)'), 'Hub must show Group mode badge when GROUP active');
assert.ok(hubHtml.includes('btn-game-example'), 'Hub must have dedicated How to Play example buttons');
assert.ok(hubHtml.includes('tips_and_updates'), 'Hub must include example icon');

// Check Duos Mode adaptation in Hub
store.setArcadePlayMode('DUOS');
hubHtml = renderArcadeScreen();
assert.ok(hubHtml.includes('Duos (2-Player 1v1)'), 'Hub must show Duos mode badge when DUOS active');
assert.ok(hubHtml.includes('1v1 Royal Duel'), 'Hub should show Duos badge for Raja Mantri');
assert.ok(hubHtml.includes('1v1 Filmi Battle'), 'Hub should show Duos badge for Bollywood');
assert.ok(hubHtml.includes('Play 1v1 Duel'), 'Hub should show Duos action label');

// Check Solo Mode adaptation in Hub
store.setArcadePlayMode('SOLO');
hubHtml = renderArcadeScreen();
assert.ok(hubHtml.includes('Solo (1 Player)'), 'Hub must show Solo mode badge when SOLO active');
assert.ok(hubHtml.includes('Solo Detective Run'), 'Hub should show Solo badge for Raja Mantri');
assert.ok(hubHtml.includes('Speed Caller Challenge'), 'Hub should show Solo badge for Tambola');
assert.ok(hubHtml.includes('15s Blitz Run'), 'Hub should show Solo badge for Bollywood');
console.log('   ✅ Arcade Hub mode tabs and dynamic adaptation verified.\n');

// -----------------------------------------------------------------------------
// 3. Aesthetic Examples & Rules Engine (3-Step Visual Breakdown)
// -----------------------------------------------------------------------------
console.log('3. Testing Aesthetic Examples & Rules Engine across all games...');
const gameModes = [
  'RAJA_MANTRI',
  'TAMBOLA',
  'BOLLYWOOD',
  'SPIN_BOTTLE',
  'NEVER_HAVE_I_EVER',
  'MOST_LIKELY_TO',
  'WATCH_PARTY'
];

gameModes.forEach((modeKey) => {
  ['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
    const example = getExampleForMode(modeKey, 'Test Game', pm);
    assert.ok(example.tagline || example.summary, `Example for ${modeKey} (${pm}) must have a tagline or summary`);
    assert.ok(example.steps && example.steps.length === 3, `Example for ${modeKey} (${pm}) must have a 3-step visual breakdown`);
    
    example.steps.forEach((st, idx) => {
      assert.ok(st.num, `Step ${idx + 1} of ${modeKey} (${pm}) must have a number`);
      assert.ok(st.title, `Step ${idx + 1} of ${modeKey} (${pm}) must have a title`);
      assert.ok(st.desc, `Step ${idx + 1} of ${modeKey} (${pm}) must have a description`);
    });

    const cardHtml = buildExampleCardHtml(example, 'Test Game', pm);
    assert.ok(cardHtml.includes('How It Plays (3 Simple Steps)'), `Example card for ${modeKey} (${pm}) must render 3-Step breakdown`);
    assert.ok(cardHtml.includes('Live Sample'), `Example card for ${modeKey} (${pm}) must render Live Sample`);
  });
});
console.log('   ✅ 3-Step Visual Examples verified across all 7 games for Group, Duos, and Solo.\n');

// -----------------------------------------------------------------------------
// 4. All 7 Arcade Games Mode Integration Tests
// -----------------------------------------------------------------------------
console.log('4. Testing individual Arcade Games for Group, Duos, and Solo...');

// Game 1: Raja Mantri Chor Sipahi
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderRajaMantriGame();
  assert.ok(html.includes('btn-raja-mode'), `Raja Mantri must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('1v1 Royal Duel'), 'Raja Mantri must render 1v1 Royal Duel in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('Solo Detective Run'), 'Raja Mantri must render Solo Detective Run in SOLO');
  }
});
console.log('   ✅ Raja Mantri Chor Sipahi verified for GROUP, DUOS, and SOLO.');

// Game 2: Desi Tambola Housie
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderTambolaGame();
  assert.ok(html.includes('btn-tambola-mode'), `Tambola must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('btn-switch-ticket'), 'Tambola must support ticket switching in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('Speed Goal') || html.includes('Speed Caller'), 'Tambola must render Speed Challenge in SOLO');
  }
});
console.log('   ✅ Desi Tambola Housie verified for GROUP, DUOS, and SOLO.');

// Game 3: Bollywood Antakshari & Filmi Masala
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderBollywoodGame();
  assert.ok(html.includes('btn-bolly-mode'), `Bollywood must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('Active Turn:'), 'Bollywood must show active turn in DUOS');
  }
});
console.log('   ✅ Bollywood Antakshari verified for GROUP, DUOS, and SOLO.');

// Game 4: Spin the Bottle
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderSpinBottleGame();
  assert.ok(html.includes('btn-bottle-mode'), `Spin the Bottle must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('Partner'), 'Spin the Bottle must have Partner in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('Solo (Dare Wheel)'), 'Spin the Bottle must show Dare Wheel in SOLO');
  }
});
console.log('   ✅ Spin the Bottle verified for GROUP, DUOS, and SOLO.');

// Game 5: Never Have I Ever
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderNeverHaveIEverGame();
  assert.ok(html.includes('btn-nhie-mode'), `Never Have I Ever must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('btn-nhie-partner-drop'), 'Never Have I Ever must render partner drop in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('Solo Guilt Calibration'), 'Never Have I Ever must render Guilt Calibration in SOLO');
  }
});
console.log('   ✅ Never Have I Ever verified for GROUP, DUOS, and SOLO.');

// Game 6: Most Likely To
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderMostLikelyToGame();
  assert.ok(html.includes('btn-mlt-mode'), `Most Likely To must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('Duos Face-off Ballot'), 'Most Likely To must render Duos Face-off Ballot in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('btn-solo-guilty'), 'Most Likely To must render solo guilty button in SOLO');
    assert.ok(html.includes('btn-solo-notme'), 'Most Likely To must render solo not-me button in SOLO');
  }
});
console.log('   ✅ Most Likely To verified for GROUP, DUOS, and SOLO.');

// Game 7: Watch & Play Stream Stage
['GROUP', 'DUOS', 'SOLO'].forEach((pm) => {
  store.setArcadePlayMode(pm);
  const html = renderShowsScreen();
  assert.ok(html.includes('btn-shows-mode'), `Shows Screen must render mode switcher in ${pm}`);
  if (pm === 'DUOS') {
    assert.ok(html.includes('Duos Date Lounge'), 'Shows Screen must render Duos Date Lounge in DUOS');
  } else if (pm === 'SOLO') {
    assert.ok(html.includes('Solo Cinema'), 'Shows Screen must render Solo Cinema in SOLO');
  }
});
console.log('   ✅ Watch & Play Stream Stage verified for GROUP, DUOS, and SOLO.');

console.log('\n🎉 ALL ARCADE MODES & AESTHETIC EXAMPLES TESTS PASSED PERFECTLY!\n');
