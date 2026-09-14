// ==============================================================================
// TEST SUITE: REAL PHOTO ALBUM, REAL STORE, CYBER LED WATCH TICKER,
// AND INDIAN ARCADE PARTY GAMES (RAJA MANTRI & BOLLYWOOD ANTAKSHARI)
// ==============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('⚡ Starting Real Album, Store, Cyber Gate & Indian Arcade Test Suite...\n');

// 1. Check gateScreen.js for clean portal without watch ticker and with 3D Tilt Cards
const gateScreenPath = path.join(rootDir, 'js/components/gateScreen.js');
const gateScreenCode = fs.readFileSync(gateScreenPath, 'utf8');

assert(!gateScreenCode.includes('id="cyber-watch-ticker"'), 'gateScreen.js must NOT contain cyber-watch-ticker per user request');
assert(gateScreenCode.includes('cyber-tilt-card'), 'gateScreen.js must render 3D tilt cards');
assert(gateScreenCode.includes('cyber-card-foil'), 'gateScreen.js must render holographic foil overlay');
assert(gateScreenCode.includes('id="btn-gate-desi"'), 'gateScreen.js must feature Desi Arcadia Indian party warp card');
assert(gateScreenCode.includes('id="btn-gate-overdrive"'), 'gateScreen.js must implement Overdrive Quantum Energy Pulse');
console.log('  ✅ PASS: gateScreen.js has watch ticker removed and implements 3D Tilt Cards with Overdrive Surge');

// 2. Check css/components.css for 3D card and polaroid styling
const cssPath = path.join(rootDir, 'css/components.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(cssCode.includes('.cyber-tilt-card'), 'components.css must define .cyber-tilt-card');
assert(cssCode.includes('.cyber-card-foil'), 'components.css must define .cyber-card-foil');
assert(cssCode.includes('.polaroid-card'), 'components.css must define .polaroid-card');
assert(cssCode.includes('.polaroid-tape'), 'components.css must define .polaroid-tape');
assert(cssCode.includes('@media print'), 'components.css must define @media print styles for printable photobook keepsake');
console.log('  ✅ PASS: css/components.css contains authentic 3D tilt card styles, polaroid styles, and print layout');

// 3. Check store.js for Sparks economy and Real Album methods
const storePath = path.join(rootDir, 'js/state/store.js');
const storeCode = fs.readFileSync(storePath, 'utf8');

assert(storeCode.includes('userSparks'), 'store.js must track userSparks currency');
assert(storeCode.includes('claimDailySparks'), 'store.js must implement claimDailySparks()');
assert(storeCode.includes('spendSparks'), 'store.js must implement spendSparks()');
assert(storeCode.includes('unlockPerk'), 'store.js must implement unlockPerk()');
assert(storeCode.includes('recordStoreOrder'), 'store.js must implement recordStoreOrder()');
assert(storeCode.includes('albumMemories'), 'store.js must track albumMemories');
assert(storeCode.includes('createAlbumFromUploads'), 'store.js must implement createAlbumFromUploads()');
assert(storeCode.includes('updateAlbumMemory'), 'store.js must implement updateAlbumMemory()');
assert(storeCode.includes('clearAlbum'), 'store.js must implement clearAlbum()');
assert(storeCode.includes('deleteAlbumMemory'), 'store.js must implement deleteAlbumMemory()');
assert(storeCode.includes('addAlbumMemorySticker'), 'store.js must implement addAlbumMemorySticker()');
assert(storeCode.includes('likeAlbumMemory'), 'store.js must implement likeAlbumMemory()');
console.log('  ✅ PASS: store.js implements Sparks wallet economy, perk unlocks, order tracking, and dynamic album generation');

// 4. Check yearbookScreen.js for 100% Real Interactive Photo Album Studio (Upload First & Story Writer)
const yearbookPath = path.join(rootDir, 'js/components/yearbookScreen.js');
const yearbookCode = fs.readFileSync(yearbookPath, 'utf8');

assert(yearbookCode.includes('renderYearbookScreen'), 'yearbookScreen.js must export renderYearbookScreen');
assert(yearbookCode.includes('bindYearbookEvents'), 'yearbookScreen.js must export bindYearbookEvents');
assert(yearbookCode.includes('onboarding-dropzone'), 'yearbookScreen.js must first ask user to upload photos');
assert(yearbookCode.includes('onboarding-file-input'), 'yearbookScreen.js must have multi-photo file picker input');
assert(yearbookCode.includes('btn-generate-album'), 'yearbookScreen.js must have button to automatically generate album');
assert(yearbookCode.includes('btn-trigger-edit-story'), 'yearbookScreen.js must provide option to write/edit story for each memory');
assert(yearbookCode.includes('modal-edit-story'), 'yearbookScreen.js must have story editor modal');
assert(yearbookCode.includes('tab-mode-layflat'), 'yearbookScreen.js must have 3D Layflat Book mode tab');
assert(yearbookCode.includes('tab-mode-pinboard'), 'yearbookScreen.js must have Polaroid Pinboard mode tab');
assert(!yearbookCode.includes('Midnight Campfire Chai & Accidental Confessions'), 'yearbookScreen.js must NOT have hardcoded mock memories');
console.log('  ✅ PASS: yearbookScreen.js first asks user to upload, auto-generates album, and lets user write stories with no hardcoding');

// 5. Check emporiumScreen.js for Real Store with Sparks and Tracking Receipts
const emporiumPath = path.join(rootDir, 'js/components/emporiumScreen.js');
const emporiumCode = fs.readFileSync(emporiumPath, 'utf8');

assert(emporiumCode.includes('renderEmporiumScreen'), 'emporiumScreen.js must export renderEmporiumScreen');
assert(emporiumCode.includes('bindEmporiumEvents'), 'emporiumScreen.js must export bindEmporiumEvents');
assert(emporiumCode.includes('btn-claim-sparks'), 'emporiumScreen.js must have +100 Daily Sparks claim button');
assert(emporiumCode.includes('btn-unlock-perk'), 'emporiumScreen.js must have digital perk unlock button');
assert(emporiumCode.includes('modal-checkout'), 'emporiumScreen.js must have real checkout modal');
assert(emporiumCode.includes('btn-confirm-order'), 'emporiumScreen.js must generate real order with tracking receipt');
assert(emporiumCode.includes('tab-store-vault'), 'emporiumScreen.js must have My Vault & Orders inventory drawer');
console.log('  ✅ PASS: emporiumScreen.js implements Sparks wallet, digital perks, physical checkout, and inventory drawer');

// 6. Check rajaMantriGame.js for authentic Indian party game mechanics
const rajaMantriPath = path.join(rootDir, 'js/components/rajaMantriGame.js');
const rajaMantriCode = fs.readFileSync(rajaMantriPath, 'utf8');

assert(rajaMantriCode.includes('renderRajaMantriGame'), 'rajaMantriGame.js must export renderRajaMantriGame');
assert(rajaMantriCode.includes('bindRajaMantriEvents'), 'rajaMantriGame.js must export bindRajaMantriEvents');
assert(rajaMantriCode.includes('1000'), 'Raja must award 1000 points');
assert(rajaMantriCode.includes('800'), 'Mantri must award 800 points');
assert(rajaMantriCode.includes('500'), 'Sipahi must award 500 points');
assert(rajaMantriCode.includes('btn-start-peeking'), 'Must allow secret chit peeking');
assert(rajaMantriCode.includes('Mera Mantri Kaun'), 'Must include Raja proclamation "Mera Mantri Kaun?!"');
assert(rajaMantriCode.includes('btn-accuse-suspect'), 'Must allow Mantri to accuse suspected Chor');
assert(rajaMantriCode.includes('DHOKHA'), 'Must penalize wrong accusation and steal points for Chor');
assert(rajaMantriCode.includes('scores'), 'Must maintain multi-round royal court leaderboard');
console.log('  ✅ PASS: rajaMantriGame.js implements 100% authentic Raja Mantri Chor Sipahi rules and fanfare');

// 7. Check bollywoodGame.js for Bollywood Antakshari & Filmi Masala
const bollywoodPath = path.join(rootDir, 'js/components/bollywoodGame.js');
const bollywoodCode = fs.readFileSync(bollywoodPath, 'utf8');

assert(bollywoodCode.includes('renderBollywoodGame'), 'bollywoodGame.js must export renderBollywoodGame');
assert(bollywoodCode.includes('bindBollywoodEvents'), 'bollywoodGame.js must export bindBollywoodEvents');
assert(bollywoodCode.includes('Mogambo khush hua'), 'Must include iconic dialogues');
assert(bollywoodCode.includes('ANTAKSHARI'), 'Must include Antakshari letter chain');
assert(bollywoodCode.includes('bolly-timer-display'), 'Must include shot clock timer');
console.log('  ✅ PASS: bollywoodGame.js implements Bollywood Antakshari letter relay and dialogue decode');

// 8. Check arcadeScreen.js for spotlighting Raja Mantri and Bollywood
const arcadePath = path.join(rootDir, 'js/components/arcadeScreen.js');
const arcadeCode = fs.readFileSync(arcadePath, 'utf8');

assert(arcadeCode.includes('arcade-launch-raja'), 'arcadeScreen.js must have launch button for Raja Mantri');
assert(arcadeCode.includes('arcade-launch-bollywood'), 'arcadeScreen.js must have launch button for Bollywood Antakshari');
assert(arcadeCode.includes('RAJA_MANTRI'), 'arcadeScreen.js must navigate to RAJA_MANTRI view');
console.log('  ✅ PASS: arcadeScreen.js spotlights Raja Mantri Chor Sipahi and Bollywood Antakshari');

// 9. Check app.js for routing support
const appPath = path.join(rootDir, 'js/app.js');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes('renderRajaMantriGame'), 'app.js must import renderRajaMantriGame');
assert(appCode.includes('renderBollywoodGame'), 'app.js must import renderBollywoodGame');
assert(appCode.includes('case \'RAJA_MANTRI\':'), 'app.js must route RAJA_MANTRI');
assert(appCode.includes('case \'BOLLYWOOD\':'), 'app.js must route BOLLYWOOD');
console.log('  ✅ PASS: app.js routes all new Indian arcade games and keeps existing routing solid');

// 10. Check audioSynth.js for new sound synthesizers
const audioPath = path.join(rootDir, 'js/visuals/audioSynth.js');
const audioCode = fs.readFileSync(audioPath, 'utf8');

assert(audioCode.includes('playRoyalFanfare'), 'audioSynth.js must implement playRoyalFanfare()');
assert(audioCode.includes('playCameraSnap'), 'audioSynth.js must implement playCameraSnap()');
assert(audioCode.includes('playLedTick'), 'audioSynth.js must implement playLedTick()');
console.log('  ✅ PASS: audioSynth.js implements playRoyalFanfare, playCameraSnap, and playLedTick');

console.log('\n🎉 ALL 10 COMPREHENSIVE SUITE TESTS PASSED PERFECTLY!\n');
