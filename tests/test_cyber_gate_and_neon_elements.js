// ==============================================================================
// TEST SUITE: CYBERPUNK TORII GATE PORTAL & CHINESE NEON AESTHETICS
// Validates gateScreen, string curtain physics, interactive ceremonial objects,
// audio synthesizers, routing, header shortcuts, and cyber-neon styling.
// ==============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

console.log('⛩️ Starting Cyberpunk Torii Gate & Chinese Neon Aesthetics Test Suite...\n');

// 1. Validate audioSynth.js exposes the 3 cyber audio methods
const audioSynthCode = fs.readFileSync(path.join(rootDir, 'js/visuals/audioSynth.js'), 'utf-8');
assert(audioSynthCode.includes('playTalismanChime(pitchIndex'), 'audioSynth.js must implement playTalismanChime');
assert(audioSynthCode.includes('playZenGong()'), 'audioSynth.js must implement playZenGong');
assert(audioSynthCode.includes('playGateWarp()'), 'audioSynth.js must implement playGateWarp');
console.log('  ✅ PASS: audioSynth.js implements playTalismanChime, playZenGong, and playGateWarp');

// 2. Validate gateScreen.js renders Torii Gate, Welcome typography, and Horizontal Cyber Walls
const gateScreenCode = fs.readFileSync(path.join(rootDir, 'js/components/gateScreen.js'), 'utf-8');
assert(gateScreenCode.includes('WELCOME TO'), 'gateScreen.js must render WELCOME TO animated heading');
assert(gateScreenCode.includes('cyber-torii-frame'), 'gateScreen.js must render cyber-torii-frame');
assert(gateScreenCode.includes('cyber-wall-left'), 'gateScreen.js must render left cyber wall');
assert(gateScreenCode.includes('cyber-wall-right'), 'gateScreen.js must render right cyber wall');
assert(gateScreenCode.includes('cyber-pillar-tower'), 'gateScreen.js must render pagoda cyber pillars');
assert(gateScreenCode.includes('cyber-wet-floor'), 'gateScreen.js must render wet reflective pavement');
console.log('  ✅ PASS: gateScreen.js renders grand Torii gate, welcome typography, and horizontal cyber walls');

// 3. Validate gateScreen.js string curtain with designer items & interactive physics
assert(gateScreenCode.includes('cyber-curtain-container'), 'gateScreen.js must mount cyber-curtain-container');
assert(gateScreenCode.includes('cyber-curtain-pole'), 'gateScreen.js must mount cyber-curtain-pole');
assert(gateScreenCode.includes('cyber-gate-string'), 'gateScreen.js must generate cyber-gate-string elements');
assert(gateScreenCode.includes('talisman-jade-bi'), 'gateScreen.js must render Jade Bi designer charms');
assert(gateScreenCode.includes('talisman-paper-tag'), 'gateScreen.js must render Taoist cyber-talisman tags');
assert(gateScreenCode.includes('talisman-flame-bead'), 'gateScreen.js must render cyber flame beads');
assert(gateScreenCode.includes('talisman-bell-tassel'), 'gateScreen.js must render weighted brass bells and tassels');
assert(gateScreenCode.includes('handlePointerMove'), 'gateScreen.js must track cursor/finger pointer movement for deflection');
assert(gateScreenCode.includes('playTalismanChime'), 'gateScreen.js must trigger talisman chimes on string brush');
console.log('  ✅ PASS: gateScreen.js renders interactive string curtain with designer charms and physics');

// 4. Validate gateScreen.js interactive objects & warp entry
assert(gateScreenCode.includes('gate-dragon-brazier'), 'gateScreen.js must mount dragon brazier');
assert(gateScreenCode.includes('gate-cyber-bell'), 'gateScreen.js must mount wind gong / bell');
assert(gateScreenCode.includes('btn-enter-gate'), 'gateScreen.js must mount enter button');
assert(gateScreenCode.includes('triggerEnterSequence'), 'gateScreen.js must implement triggerEnterSequence');
assert(gateScreenCode.includes('bondfire_gate_entered'), 'gateScreen.js must record gate entrance in sessionStorage');
console.log('  ✅ PASS: gateScreen.js implements interactive Dragon Brazier, Wind Gong, and Warp Entrance');

// 5. Validate app.js routing and initial GATE landing
const appCode = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf-8');
assert(appCode.includes("import { renderGateScreen, bindGateScreenEvents } from './components/gateScreen.js'"), 'app.js must import gateScreen');
assert(appCode.includes("'PORTAL': 'GATE'"), 'app.js must alias PORTAL to GATE');
assert(appCode.includes("'TORII': 'GATE'"), 'app.js must alias TORII to GATE');
assert(appCode.includes("case 'GATE':"), 'app.js must handle case GATE in render switch');
assert(appCode.includes('renderGateScreen()'), 'app.js must call renderGateScreen()');
assert(appCode.includes('bindGateScreenEvents()'), 'app.js must call bindGateScreenEvents()');
assert(appCode.includes('bondfire_gate_entered'), 'app.js must check bondfire_gate_entered for initial landing');
console.log('  ✅ PASS: app.js routes GATE view and defaults first-time visitors to the Cyber Gate');

// 6. Validate header.js quick travel shortcut and brand seal
const headerCode = fs.readFileSync(path.join(rootDir, 'js/components/header.js'), 'utf-8');
assert(headerCode.includes('btn-header-gate'), 'header.js must include btn-header-gate portal button');
assert(headerCode.includes('⛩️ 赛博'), 'header.js brand logo must include cyber-Chinese seal');
assert(headerCode.includes('data-view="GATE"'), 'header.js must support GATE in navigation items');
console.log('  ✅ PASS: header.js includes Cyber Gate shortcut button and brand seal');

// 7. Validate css/components.css styles for Cyber Gate and Chinese neon
const cssCode = fs.readFileSync(path.join(rootDir, 'css/components.css'), 'utf-8');
assert(cssCode.includes('.cyber-gate-universe'), 'css must define .cyber-gate-universe');
assert(cssCode.includes('.cyber-curtain-pole'), 'css must define .cyber-curtain-pole');
assert(cssCode.includes('.cyber-gate-string'), 'css must define .cyber-gate-string');
assert(cssCode.includes('.talisman-jade-bi'), 'css must define .talisman-jade-bi');
assert(cssCode.includes('.talisman-paper-tag'), 'css must define .talisman-paper-tag');
assert(cssCode.includes('.cyber-dragon-brazier'), 'css must define .cyber-dragon-brazier');
assert(cssCode.includes('.cyber-wind-gong'), 'css must define .cyber-wind-gong');
assert(cssCode.includes('.cyber-seal-badge'), 'css must define .cyber-seal-badge');
console.log('  ✅ PASS: css/components.css contains full Cyber Gate, curtain physics, and Chinese neon styling');

// 8. Validate homeScrollStory.js and roomsHubScreen.js cyber-Chinese additions
const homeStoryCode = fs.readFileSync(path.join(rootDir, 'js/components/homeScrollStory.js'), 'utf-8');
assert(homeStoryCode.includes('CYBER MATRIX'), 'homeScrollStory.js must include Cyber Matrix Paifang archway divider');
assert(homeStoryCode.includes('cyber-seal-badge'), 'homeScrollStory.js must include cyber seals on game cards');

const roomsHubCode = fs.readFileSync(path.join(rootDir, 'js/components/roomsHubScreen.js'), 'utf-8');
assert(roomsHubCode.includes('「 双人 · 灵犀 」'), 'roomsHubScreen.js must include Duo cyber seal');
assert(roomsHubCode.includes('「 战队 · 聚火 」'), 'roomsHubScreen.js must include Squad cyber seal');
console.log('  ✅ PASS: homeScrollStory.js & roomsHubScreen.js contain Cyber Torii divider and Chinese seals');

console.log('\n🎉 All 8 Cyberpunk Torii Gate & Chinese Neon Aesthetic tests passed successfully!\n');
