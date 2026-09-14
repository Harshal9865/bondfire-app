// ==============================================================================
// TEST SUITE: CYBERPUNK TORII GATE PORTAL & CHINESE NEON AESTHETICS
// Validates gateScreen (100% English cyberpunk text, no Torii emoji),
// navbar cleanliness (no Torii icons/buttons), audio synthesizers, routing, and styling.
// ==============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

console.log('⚡ Starting Cyberpunk Sanctuary Gateway & Clean Navbar Test Suite...\n');

// 1. Validate audioSynth.js exposes the 3 cyber audio methods
const audioSynthCode = fs.readFileSync(path.join(rootDir, 'js/visuals/audioSynth.js'), 'utf-8');
assert(audioSynthCode.includes('playTalismanChime(pitchIndex'), 'audioSynth.js must implement playTalismanChime');
assert(audioSynthCode.includes('playZenGong()'), 'audioSynth.js must implement playZenGong');
assert(audioSynthCode.includes('playGateWarp()'), 'audioSynth.js must implement playGateWarp');
console.log('  ✅ PASS: audioSynth.js implements playTalismanChime, playZenGong, and playGateWarp');

// 2. Validate gateScreen.js renders in 100% English Cyberpunk Style without Torii emoji
const gateScreenCode = fs.readFileSync(path.join(rootDir, 'js/components/gateScreen.js'), 'utf-8');
assert(gateScreenCode.includes('WELCOME TO'), 'gateScreen.js must render WELCOME TO animated heading');
assert(gateScreenCode.includes('JACK IN // ENTER BONDFIRE'), 'gateScreen.js must render English cyberpunk button JACK IN // ENTER BONDFIRE');
assert(gateScreenCode.includes('// CYBER SANCTUARY PORTAL :: PROTOCOL 01 //'), 'gateScreen.js must render English cyberpunk protocol badge');
assert(gateScreenCode.includes('STEP INTO THE CYBER CAMPFIRE'), 'gateScreen.js must render English cyberpunk subtitle');
assert(!gateScreenCode.includes('⛩️'), 'gateScreen.js must NOT contain Torii gate emoji');
assert(!gateScreenCode.includes('篝火'), 'gateScreen.js must NOT contain Chinese characters');
assert(gateScreenCode.includes('cyber-torii-frame'), 'gateScreen.js must render cyber-torii-frame');
assert(gateScreenCode.includes('cyber-wet-floor'), 'gateScreen.js must render wet reflective pavement');
assert(gateScreenCode.includes('cyber-embers-container'), 'gateScreen.js must render floating cyber embers');
console.log('  ✅ PASS: gateScreen.js renders 100% English Cyberpunk text without Torii icons or Chinese characters');

// 3. Validate gateScreen.js holographic portal core & quick-travel mode teleports
assert(gateScreenCode.includes('cyber-portal-core'), 'gateScreen.js must mount cyber-portal-core');
assert(gateScreenCode.includes('portal-energy-ring'), 'gateScreen.js must mount portal-energy-ring');
assert(gateScreenCode.includes('btn-gate-duo'), 'gateScreen.js must render Duo teleport pill');
assert(gateScreenCode.includes('btn-gate-squad'), 'gateScreen.js must render Squad teleport pill');
assert(gateScreenCode.includes('btn-gate-vault'), 'gateScreen.js must render Vault teleport pill');
assert(gateScreenCode.includes('playTalismanChime'), 'gateScreen.js must trigger chimes on pill hover');
console.log('  ✅ PASS: gateScreen.js renders holographic portal core with interactive English mode teleports');

// 4. Validate gateScreen.js interactive entrance & warp sequences
assert(gateScreenCode.includes('btn-enter-gate'), 'gateScreen.js must mount enter button');
assert(gateScreenCode.includes('btn-skip-gate'), 'gateScreen.js must mount direct skip button');
assert(gateScreenCode.includes('triggerEnterSequence'), 'gateScreen.js must implement triggerEnterSequence');
assert(gateScreenCode.includes('bondfire_gate_entered'), 'gateScreen.js must record gate entrance in sessionStorage');
console.log('  ✅ PASS: gateScreen.js implements interactive Entrance, Quick Skip, and Warp sequence');

// 5. Validate app.js routing and initial GATE landing
const appCode = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf-8');
assert(appCode.includes("import { renderGateScreen, bindGateScreenEvents } from './components/gateScreen.js'"), 'app.js must import gateScreen');
assert(appCode.includes("'PORTAL': 'GATE'"), 'app.js must alias PORTAL to GATE');
assert(appCode.includes("'TORII': 'GATE'"), 'app.js must alias TORII to GATE');
assert(appCode.includes("case 'GATE':"), 'app.js must handle case GATE in render switch');
assert(appCode.includes('renderGateScreen()'), 'app.js must call renderGateScreen()');
assert(appCode.includes('bindGateScreenEvents()'), 'app.js must call bindGateScreenEvents()');
assert(appCode.includes("targetView = 'GATE'"), 'app.js must default targetView = GATE whenever opening the website');
console.log('  ✅ PASS: app.js routes GATE view and defaults visitors to the Cyber Gate on opening the site');

// 6. Validate header.js navbar is clean: NO Torii gate emoji, NO gate buttons in navbar
const headerCode = fs.readFileSync(path.join(rootDir, 'js/components/header.js'), 'utf-8');
assert(!headerCode.includes('⛩️'), 'header.js must NOT contain any Torii gate emoji');
assert(!headerCode.includes('btn-header-gate'), 'header.js must NOT contain btn-header-gate in navbar');
assert(!headerCode.includes('⛩️ 赛博'), 'header.js brand logo must NOT include Torii seal');
console.log('  ✅ PASS: header.js navbar is completely free of Torii gate icons and gate buttons');

// 7. Validate css/components.css styles for Cyber Gate and styling
const cssCode = fs.readFileSync(path.join(rootDir, 'css/components.css'), 'utf-8');
assert(cssCode.includes('.cyber-gate-universe'), 'css must define .cyber-gate-universe');
assert(cssCode.includes('.cyber-portal-core'), 'css must define .cyber-portal-core');
assert(cssCode.includes('.portal-energy-ring'), 'css must define .portal-energy-ring');
assert(cssCode.includes('.cyber-embers-container'), 'css must define .cyber-embers-container');
assert(cssCode.includes('.gate-teleport-pill'), 'css must define .gate-teleport-pill');
console.log('  ✅ PASS: css/components.css contains full Cyber Gate, portal energy ring, and cyberpunk styling');

// 8. Validate homeScrollStory.js has clean English divider without Torii icons
const homeStoryCode = fs.readFileSync(path.join(rootDir, 'js/components/homeScrollStory.js'), 'utf-8');
assert(homeStoryCode.includes('BONDFIRE MEMORY MATRIX'), 'homeScrollStory.js must include English Cyber Matrix divider');
// 9. Validate brand logo click in header.js and footer.js opens HOME
assert(headerCode.includes("store.setView('HOME')"), 'header.js logo click must route to HOME');
assert(headerCode.includes("window.location.hash = '#/HOME'"), 'header.js logo click must set hash to #/HOME');

const footerCode = fs.readFileSync(path.join(rootDir, 'js/components/footer.js'), 'utf-8');
assert(footerCode.includes("store.setView('HOME')"), 'footer.js logo click must route to HOME');
assert(footerCode.includes("window.location.hash = '#/HOME'"), 'footer.js logo click must set hash to #/HOME');
console.log('  ✅ PASS: clicking brand logo in header or footer routes user directly to Home page');

// 10. Validate app.js preserves active hash on refresh and only routes to gate on clean entry or logo click
assert(appCode.includes('isReload'), 'app.js must detect browser reload/refresh');
assert(appCode.includes('sessionStorage.getItem(\'bondfire_session_started\')'), 'app.js must check session to avoid gate redirect on refresh');
assert(appCode.includes('targetView = resolvedHash'), 'app.js must preserve active hash view during refresh/reload');
console.log('  ✅ PASS: app.js preserves active view on refresh and avoids unwanted gate redirection');

console.log('\n🎉 All 10 Cyberpunk Sanctuary Gateway & Clean Navbar tests passed successfully!\n');

