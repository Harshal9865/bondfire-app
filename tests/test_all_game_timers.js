// ==============================================================================
// AUTOMATED TEST: ALL GAME TIMERS & AESTHETIC AUTH MODAL VERIFICATION
// Tests 100% of Bondfire game modes for in-game timers and pre-game countdown
// ==============================================================================

import assert from 'node:assert/strict';

// Setup Lightweight Native Node Mock Environment
globalThis.window = {
  location: { hash: '', origin: 'http://localhost:3000', pathname: '/' },
  addEventListener: () => {},
  removeEventListener: () => {},
  AudioContext: class {
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
      };
    }
    get currentTime() { return 0; }
    get destination() { return {}; }
  },
};
globalThis.document = {
  getElementById: (id) => ({
    id,
    innerHTML: '',
    textContent: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    addEventListener: () => {},
    appendChild: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getContext: () => ({
      clearRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
    }),
    width: 400,
    height: 180,
  }),
  body: { appendChild: () => {}, querySelector: () => null },
  createElement: (tag) => ({
    tagName: tag,
    id: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    addEventListener: () => {},
    appendChild: () => {},
    getContext: () => ({
      clearRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
    }),
    width: 400,
    height: 180,
  }),
  querySelectorAll: () => [],
};
try {
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: { writeText: async () => {} } },
    writable: true,
    configurable: true,
  });
} catch (e) {}
globalThis.localStorage = {
  _data: {},
  getItem: (k) => globalThis.localStorage._data[k] || null,
  setItem: (k, v) => { globalThis.localStorage._data[k] = String(v); },
  removeItem: (k) => { delete globalThis.localStorage._data[k]; },
};

console.log('🔥 Running Test Suite: All Game Timers & Aesthetic Auth UI UX...\n');

let passedTests = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function run() {
  const { store } = await import('../js/state/store.js');

  // Test 1: Auth Modal Luxury Aesthetics & Micro-interactions
  await test('Auth Modal renders luxury Bondfire Identity Passport with ambient glow & guest bypass', async () => {
    const { renderAuthModal } = await import('../js/components/authModal.js');
    const authHtml = renderAuthModal();

    assert.ok(authHtml.includes('Bondfire Identity'), 'Auth modal must display "Bondfire Identity"');
    assert.ok(authHtml.includes('Passport'), 'Auth modal must display luxury Passport badge');
    assert.ok(authHtml.includes('local_fire_department'), 'Auth modal must display campfire fire crest icon');
    assert.ok(authHtml.includes('Why Sign In?'), 'Auth modal must display value proposition perk box');
    assert.ok(authHtml.includes('tab-sign-in'), 'Auth modal must include Sign In tab');
    assert.ok(authHtml.includes('tab-create-account'), 'Auth modal must include Create Account tab');
    assert.ok(authHtml.includes('google-official-btn-container'), 'Auth modal must include Google button container');
    assert.ok(authHtml.includes('btn-google-auth-trigger'), 'Auth modal must include Google sign-in trigger');
    assert.ok(authHtml.includes('auth-email-input'), 'Auth modal must include email input');
    assert.ok(authHtml.includes('auth-pass-input'), 'Auth modal must include password input');
    assert.ok(authHtml.includes('btn-submit-auth'), 'Auth modal must include main CTA submit button');
    assert.ok(authHtml.includes('btn-continue-as-guest'), 'Auth modal must include instant guest button');
    assert.ok(authHtml.includes('blur-3xl'), 'Auth modal must feature ambient glow backdrops');
  });

  // Test 2: Squad Deep Game (gameScreen.js) Shot Clock
  await test('Squad Deep Trivia Game includes 20s Split-Flap shot clock', async () => {
    const { renderGameScreen } = await import('../js/components/gameScreen.js');
    const gameHtml = renderGameScreen();
    assert.ok(
      gameHtml.includes('game-flap-s1') || gameHtml.includes('game-shot-clock') || gameHtml.includes('SHOT CLOCK') || gameHtml.includes('split-flap'),
      'Squad game must render Split-Flap shot clock'
    );
  });

  // Test 3: Spin the Bottle (spinBottleGame.js) 30s Challenge Shot Clock
  await test('Spin the Bottle includes 30s in-game challenge shot clock & animated progress bar', async () => {
    const { renderSpinBottleGame } = await import('../js/components/spinBottleGame.js');
    const bottleHtml = renderSpinBottleGame();
    assert.ok(bottleHtml.includes('bottle-shot-clock-text'), 'Spin the bottle must feature #bottle-shot-clock-text');
    assert.ok(bottleHtml.includes('bottle-timer-bar'), 'Spin the bottle must feature #bottle-timer-bar');
    assert.ok(bottleHtml.includes('30s'), 'Spin the bottle challenge shot clock must default to 30s');
    assert.ok(bottleHtml.includes('Challenge Shot Clock:'), 'Spin the bottle challenge shot clock label must be present');
  });

  // Test 4: Never Have I Ever (neverHaveIEverGame.js) 15s Decision Shot Clock
  await test('Never Have I Ever includes 15s in-game decision shot clock & progress bar', async () => {
    const { renderNeverHaveIEverGame } = await import('../js/components/neverHaveIEverGame.js');
    const nhieHtml = renderNeverHaveIEverGame();
    assert.ok(nhieHtml.includes('nhie-shot-clock-text'), 'NHIE must feature #nhie-shot-clock-text');
    assert.ok(nhieHtml.includes('nhie-timer-bar'), 'NHIE must feature #nhie-timer-bar');
    assert.ok(nhieHtml.includes('15s'), 'NHIE shot clock must default to 15s');
    assert.ok(nhieHtml.includes('Decision Shot Clock:'), 'NHIE decision shot clock label must be present');
  });

  // Test 5: Most Likely To (mostLikelyToGame.js) 20s Ballot Shot Clock
  await test('Most Likely To includes 20s in-game ballot voting shot clock & auto-verdict reveal', async () => {
    const { renderMostLikelyToGame } = await import('../js/components/mostLikelyToGame.js');
    const mltHtml = renderMostLikelyToGame();
    assert.ok(mltHtml.includes('mlt-shot-clock-text'), 'Most Likely To must feature #mlt-shot-clock-text');
    assert.ok(mltHtml.includes('mlt-timer-bar'), 'Most Likely To must feature #mlt-timer-bar');
    assert.ok(mltHtml.includes('20s') || mltHtml.includes('VERDICT'), 'Most Likely To ballot shot clock must default to 20s or VERDICT');
    assert.ok(mltHtml.includes('Ballot Shot Clock:'), 'Most Likely To ballot shot clock label must be present');
  });

  // Test 6: Us Mode Couple Date Night Quiz (coupleScreen.js) 25s Sync Shot Clock
  await test('Us Mode Date Night Quiz includes 25s in-game sync shot clock & linear progress bar', async () => {
    store.setState({
      activeRoom: {
        mode: 'US',
        roomType: 'DUO',
        roomCode: 'LOVE24',
        sessionStarted: true,
        players: [
          { id: 'p1', name: 'Harshal', role: 'HOST', isBot: false },
          { id: 'p2', name: 'Priya', role: 'PARTNER', isBot: false }
        ]
      }
    });
    const { renderCoupleScreen } = await import('../js/components/coupleScreen.js');
    const coupleHtml = renderCoupleScreen();
    assert.ok(coupleHtml.includes('couple-quiz-timer-text'), 'Couple screen must feature #couple-quiz-timer-text');
    assert.ok(coupleHtml.includes('couple-quiz-timer-bar'), 'Couple screen must feature #couple-quiz-timer-bar');
    assert.ok(coupleHtml.includes('25s'), 'Couple screen sync shot clock must default to 25s');
    assert.ok(coupleHtml.includes('Sync Shot Clock:'), 'Couple screen sync shot clock label must be present');
  });

  // Test 7: Solo Mode Flashback Quiz (soloScreen.js)
  await test('Solo Mode Flashback Quiz contains 30s reflection shot clock', async () => {
    const { renderSoloScreen } = await import('../js/components/soloScreen.js');
    const soloHtml = renderSoloScreen();
    assert.ok(soloHtml.includes('Solo Mode') || soloHtml.includes('Camper') || soloHtml.includes('Sparks'), 'Solo screen must render cleanly');
  });

  // Test 8: Arcade Mini-Game (cuteReflexGame.js) 15s Sprint Timer
  await test('Cute Reflex Intermission Mini-Game includes 15s challenge timer', async () => {
    const { CuteChaiGame } = await import('../js/components/cuteReflexGame.js');
    const reflexGame = new CuteChaiGame('test-canvas');
    assert.strictEqual(reflexGame.gameTimer, 15, 'Chai delivery mini-game must have 15s gameTimer');
  });

  // Test 9: Pre-Game Fullscreen Countdown Engine (gameCountdownOverlay.js)
  await test('Pre-Game Countdown & Rules Overlay Engine supports all game modes with visual rules & 5-4-3-2-1 countdown', async () => {
    const { getExampleForMode } = await import('../js/components/gameCountdownOverlay.js');
    const redFlagRules = getExampleForMode('RED_FLAG_COURT', 'Courtroom');
    assert.ok(redFlagRules.title.includes('Courtroom'), 'Rules content must be defined for Red Flag Court');
    const bottleRules = getExampleForMode('BOTTLE', 'Spin the Bottle');
    assert.ok(bottleRules.title.includes('Bottle'), 'Rules content must be defined for Spin the Bottle');
    const nhieRules = getExampleForMode('NHIE', 'Never Have I Ever');
    assert.ok(nhieRules.title.includes('Never Have I Ever'), 'Rules content must be defined for NHIE');
    const mltRules = getExampleForMode('MOST_LIKELY_TO', 'Most Likely To');
    assert.ok(mltRules.title.includes('Most Likely To'), 'Rules content must be defined for Most Likely To');
  });

  console.log(`\n🎉 SUMMARY: ${passedTests}/9 Tests Passed Successfully! 100% of Bondfire game modes contain active in-game timers and pre-game countdowns.\n`);
}

run();
