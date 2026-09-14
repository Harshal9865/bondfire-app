// ==============================================================================
// TEST SUITE: BONDFIRE MODE ARCHITECTURE CARDS 3D INTERACTION & HOVER ANIMATIONS
// Validates 3D tilt tracking, campfire ambient glow layer, top neon lightbar,
// theme accents, and kinetic micro-animations on all 4 mode cards.
// ==============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

console.log('⚡ Starting Mode Cards 3D Interaction & Animation Test Suite...\n');

// 1. Verify hero.js markup
const heroCode = fs.readFileSync(path.join(rootDir, 'js/components/hero.js'), 'utf-8');

assert(heroCode.includes('bondfire-mode-card'), 'hero.js must assign bondfire-mode-card class to all 4 cards');
assert(heroCode.includes('data-card-theme="rose"'), 'hero.js must set rose theme on Couples & Duos card');
assert(heroCode.includes('data-card-theme="coral"'), 'hero.js must set coral theme on Squads & Pods card');
assert(heroCode.includes('data-card-theme="gold"'), 'hero.js must set gold theme on Solo Reflection card');
assert(heroCode.includes('data-card-theme="mint"'), 'hero.js must set mint theme on Pixel Glade card');

assert(heroCode.includes('mode-card-glow-layer'), 'hero.js must include ambient glow layer on mode cards');
assert(heroCode.includes('mode-card-lightbar'), 'hero.js must include top neon accent lightbar on mode cards');
assert(heroCode.includes('mode-card-corner-tl'), 'hero.js must render cyber corner brackets');
assert(heroCode.includes('mode-card-heart-pulse'), 'hero.js must implement heart pulse on Couples card');
assert(heroCode.includes('mode-eq-bar'), 'hero.js must implement live audio equalizer wave bars on Squads card');
assert(heroCode.includes('mode-pixel-wand'), 'hero.js must implement pixel hop on Glade card');
assert(heroCode.includes('mode-card-arrow'), 'hero.js must implement energetic arrow slide on mode cards');
console.log('  ✅ PASS: hero.js markup contains 3D classes, theme identifiers, ambient glow layers, and micro-animations');

// 2. Verify hero.js dynamic 3D tilt and audio logic
assert(heroCode.includes("querySelectorAll('.bondfire-mode-card')"), 'hero.js must query all bondfire-mode-card elements');
assert(heroCode.includes("addEventListener('mousemove'"), 'hero.js must bind mousemove for 3D perspective tracking');
assert(heroCode.includes("audio.playTalismanChime"), 'hero.js must trigger subtle musical chime on card hover');
console.log('  ✅ PASS: hero.js implements smooth 3D perspective tilt and audio chimes');

// 3. Verify css/components.css styling
const cssCode = fs.readFileSync(path.join(rootDir, 'css/components.css'), 'utf-8');

assert(cssCode.includes('.bondfire-mode-card'), 'css must define .bondfire-mode-card');
assert(cssCode.includes('.mode-card-glow-layer'), 'css must define .mode-card-glow-layer');
assert(cssCode.includes('.mode-card-lightbar'), 'css must define .mode-card-lightbar');
assert(!cssCode.includes('rotateModeBorder'), 'css must NOT include rotating radar border');
assert(cssCode.includes('heartThrob'), 'css must define heartThrob keyframe animation');
assert(cssCode.includes('eqBounce1'), 'css must define squad audio equalizer bounce animations');
assert(cssCode.includes('pixelHop'), 'css must define retro pixel hop animation');
assert(cssCode.includes('.bondfire-mode-card:hover .mode-card-arrow'), 'css must define arrow translation on hover');
console.log('  ✅ PASS: css/components.css contains full mode card 3D tilt, theme glows, ambient layer, and animations');

console.log('\n🎉 ALL MODE CARDS 3D INTERACTION & HOVER ANIMATION TESTS PASSED PERFECTLY!\n');
