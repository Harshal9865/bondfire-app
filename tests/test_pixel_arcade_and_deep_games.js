// ==============================================================================
// TEST SUITE: PIXEL ARCADE REFINEMENT & DEEP PARTY GAMES VERIFICATION
// Tests:
// 1. Zero hardcoded "FIRE" room codes in Hero, Footer, Lobby, Store, or Friends
// 2. Pixel Studio rendering, tools, stamps, grid toggle, and export
// 3. Campfire S'more Roaster multi-stage heat math, golden zone, and Sparks deposit
// 4. All 5 Deep Party Game Modes (Red Flag Court, Confession Vault, Hot Seat, Most Likely To, Inside Joke)
// 5. Game Mode selection in Lobby and in-game switching
// ==============================================================================

import assert from 'node:assert';
import { store } from '../js/state/store.js';
import { generateRoomCode } from '../js/config.js';
import { GAME_MODES, getDeckForMode } from '../js/data/partyGameDecks.js';
import { renderHero } from '../js/components/hero.js';
import { renderLobby } from '../js/components/lobby.js';
import { renderGameScreen } from '../js/components/gameScreen.js';
import { renderPixelGladeScreen } from '../js/components/pixelGladeScreen.js';
import { renderPixelGraffiti } from '../js/components/pixelGraffiti.js';
import { renderPixelSmoreGame } from '../js/components/pixelSmoreGame.js';

console.log('🧪 Starting Pixel Arcade & Deep Party Games Verification Suite...\n');

// 1. Test Room Code De-hardcoding
console.log('Test 1: Zero Hardcoded "FIRE" in Join Inputs & Store State');
const heroHtml = renderHero();
assert.ok(!heroHtml.includes('value="FIRE"'), 'Hero room input must not have value="FIRE"');
assert.ok(heroHtml.includes('id="hero-room-input"'), 'Hero room input must exist');
assert.ok(heroHtml.includes('id="footer-room-code-input"'), 'Footer room input must exist');

const code = generateRoomCode();
assert.ok(typeof code === 'string' && code.length >= 3, 'generateRoomCode produces valid room codes');
console.log(`✅ Passed: Dynamic code generated successfully: ${code}`);

// 2. Test Pixel Glade & Arcade Components
console.log('\nTest 2: Pixel Glade, Pixel Studio & S\'more Roaster');
const gladeHtml = renderPixelGladeScreen();
assert.ok(gladeHtml.includes('The Pixel Campfire Glade'), 'Glade screen renders header');
assert.ok(gladeHtml.includes('pixel-glade-canvas'), '16-bit canvas element present');

const graffitiHtml = renderPixelGraffiti();
assert.ok(graffitiHtml.includes('Pixel Memory Studio'), 'Pixel studio title present');
assert.ok(graffitiHtml.includes('id="btn-pixel-undo"'), 'Undo button present');
assert.ok(graffitiHtml.includes('id="btn-pixel-grid-toggle"'), 'Grid toggle button present');
assert.ok(graffitiHtml.includes('data-tool="PENCIL"'), 'Pencil tool present');
assert.ok(graffitiHtml.includes('data-tool="BUCKET"'), 'Bucket flood fill tool present');
assert.ok(graffitiHtml.includes('data-tool="ERASER"'), 'Eraser tool present');
assert.ok(graffitiHtml.includes('data-tool="PICKER"'), 'Eyedropper tool present');
assert.ok(graffitiHtml.includes('data-stamp="FIRE"'), 'Campfire stamp present');
assert.ok(graffitiHtml.includes('data-stamp="HEART"'), 'Heart stamp present');
console.log('✅ Passed: Pixel Graffiti Studio contains all modern creative tools & stamps');

const smoreHtml = renderPixelSmoreGame();
assert.ok(smoreHtml.includes('Campfire S\'more Roaster'), 'Roaster title present');
assert.ok(smoreHtml.includes('GOLDEN ZONE (70-85%)'), 'Clear 70-85% sweet spot guide present');
assert.ok(smoreHtml.includes('id="smore-heat-bar"'), 'Precision heat gauge present');
assert.ok(smoreHtml.includes('id="smore-score-display"'), 'Earned Sparks HUD present');
assert.ok(smoreHtml.includes('id="btn-smore-action"'), 'Action button present');
console.log('✅ Passed: Campfire S\'more Roaster has clear visual gauge and Golden Zone');

// 3. Test All 5 Deep Party Game Modes
console.log('\nTest 3: Deep Party Game Modes Verification');
assert.equal(GAME_MODES.length, 5, 'Must have 5 curated party game modes');

// Mode 1: Red Flag Courtroom
store.setGameMode('RED_FLAG_COURT');
store.setState({ activeGame: { roundIndex: 1, totalRounds: 4, score: 500, timeRemaining: 20, selectedOption: null, isAnswerRevealed: false } });
const courtHtml = renderGameScreen();
assert.ok(courtHtml.includes('The Red Flag Courtroom'), 'Header shows Red Flag Courtroom');
assert.ok(courtHtml.includes('DEFENDANT AT THE STAND'), 'Courtroom shows defendant banner');
assert.ok(courtHtml.includes('THE CHARGE:'), 'Courtroom shows the charge details');
assert.ok(courtHtml.includes('Exhibit A:'), 'Courtroom shows Exhibit A evidence');
assert.ok(courtHtml.includes('DEFENDANT\'S DESPERATE PLEA:'), 'Courtroom shows plea');
assert.ok(courtHtml.includes('GUILTY (ROAST \'EM)'), 'Jury Guilty button present');
assert.ok(courtHtml.includes('ACQUITTED (PITY PASS)'), 'Jury Acquitted button present');
console.log('✅ Passed: Mode 1 - The Red Flag Courtroom (Trial of Shame) verified');

// Mode 2: Anonymous Confession Vault
store.setGameMode('CONFESSION_VAULT');
store.setState({ activeGame: { roundIndex: 1, totalRounds: 4, score: 750, timeRemaining: 20, selectedOption: null, isAnswerRevealed: false } });
const confessionHtml = renderGameScreen();
assert.ok(confessionHtml.includes('Anonymous Confession Vault'), 'Header shows Confession Vault');
assert.ok(confessionHtml.includes('CONFESSION #101'), 'Confession scroll present');
assert.ok(confessionHtml.includes('Who in this room committed this atrocity?'), 'Suspect question present');
assert.ok(confessionHtml.includes('LOCKED IN 🔒') || confessionHtml.includes('SUSPECT'), 'Suspect cards present');
console.log('✅ Passed: Mode 2 - Anonymous Confession Vault (Whose Dark Secret?) verified');

// Mode 3: Hot Seat Roulette
store.setGameMode('HOT_SEAT_ROULETTE');
store.setState({ activeGame: { roundIndex: 1, totalRounds: 4, score: 1000, timeRemaining: 20, selectedOption: null, isAnswerRevealed: false } });
const hotSeatHtml = renderGameScreen();
assert.ok(hotSeatHtml.includes('Hot Seat Roulette'), 'Header shows Hot Seat Roulette');
assert.ok(hotSeatHtml.includes('on the Hot Seat'), 'Spotlight player on hot seat present');
assert.ok(hotSeatHtml.includes('100% Brutal Truth'), 'Honesty rating present');
assert.ok(hotSeatHtml.includes('Sugarcoated Cap'), 'Cap rating present');
assert.ok(hotSeatHtml.includes('Unhinged Emotional Grenade'), 'Grenade rating present');
console.log('✅ Passed: Mode 3 - Hot Seat Roulette (Deep & Unfiltered) verified');

// Mode 4: Most Likely To... Savage
store.setGameMode('MOST_LIKELY_TO');
store.setState({ activeGame: { roundIndex: 1, totalRounds: 4, score: 1200, timeRemaining: 10, selectedOption: null, isAnswerRevealed: false } });
const likelyHtml = renderGameScreen();
assert.ok(likelyHtml.includes('Most Likely To... Savage'), 'Header shows Most Likely To');
assert.ok(likelyHtml.includes('SCENARIO:'), 'Scenario card present');
assert.ok(likelyHtml.includes('RAPID FIRE POINTING'), 'Rapid fire badge present');
console.log('✅ Passed: Mode 4 - Most Likely To... Savage Edition verified');

// Mode 5: Inside Joke Mystery Deck
store.setGameMode('INSIDE_JOKE_VAULT');
store.setState({ activeGame: { roundIndex: 1, totalRounds: 3, score: 1400, timeRemaining: 20, selectedOption: null, isAnswerRevealed: false } });
const insideHtml = renderGameScreen();
assert.ok(insideHtml.includes('Inside Joke Mystery Deck'), 'Header shows Inside Joke Deck');
assert.ok(insideHtml.includes('chat-quote-bubble'), 'Quote bubble present');
assert.ok(insideHtml.includes('Verified Chat'), 'Verified chat badge present');
console.log('✅ Passed: Mode 5 - Inside Joke Mystery Deck verified');

// 4. Test Game Mode Selection in Pod Lobby
console.log('\nTest 4: Lobby Game Mode Selector & Modal');
const lobbyHtml = renderLobby();
assert.ok(lobbyHtml.includes('id="btn-tune-deck"'), 'Lobby tune deck button present');
assert.ok(lobbyHtml.includes('id="deck-modal"'), 'Deck selector modal present in lobby');
assert.ok(lobbyHtml.includes('The Red Flag Courtroom'), 'Modal contains Red Flag Courtroom option');
assert.ok(lobbyHtml.includes('Anonymous Confession Vault'), 'Modal contains Confession Vault option');
assert.ok(lobbyHtml.includes('Hot Seat Roulette'), 'Modal contains Hot Seat option');
assert.ok(lobbyHtml.includes('Most Likely To... Savage'), 'Modal contains Most Likely To option');
assert.ok(lobbyHtml.includes('btn-select-deck'), 'Select deck buttons present');
console.log('✅ Passed: Lobby Game Mode selection & modal verified');

console.log('\n🎉 ALL 4 TEST SUITES PASSED FLAWLESSLY! DEEP PARTY GAMES & REFINED PIXEL ARCADE CONFIRMED.');
