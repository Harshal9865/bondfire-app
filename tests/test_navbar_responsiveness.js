// ==============================================================================
// TEST SUITE: Navbar Responsiveness, Anti-Overflow & Unified Navigation Architecture
// ==============================================================================

import assert from 'node:assert/strict';
import { store } from '../js/state/store.js';
import { renderHeader } from '../js/components/header.js';

console.log('🧪 Starting Navbar Responsiveness & Overflow Prevention Test Suite...\n');

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
// Suite 1: Unified Single-Deck Glass Capsule & Anti-Overflow Architecture
// -----------------------------------------------------------------------------
test('Unified central capsule houses both Mode Switcher and direct links without separate floating pills', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('glass-pill'), 'Header must contain central glass-pill capsule');
  assert.ok(headerHtml.includes('id="header-mode-switcher"'), 'Mode switcher must be inside header navigation');
  assert.ok(headerHtml.includes('id="header-links"'), 'Direct links must be inside header navigation');
  
  // Verify mode switcher is inside the central navigation capsule
  const navCapsuleIndex = headerHtml.indexOf('class="hidden md:flex items-center p-1 rounded-full glass-pill');
  const modeSwitcherIndex = headerHtml.indexOf('id="header-mode-switcher"');
  const headerLinksIndex = headerHtml.indexOf('id="header-links"');
  
  assert.ok(navCapsuleIndex !== -1, 'Nav capsule must be defined with md:flex');
  assert.ok(modeSwitcherIndex > navCapsuleIndex, 'Mode switcher must be nested inside glass-pill');
  assert.ok(headerLinksIndex > modeSwitcherIndex, 'Direct links must be nested inside glass-pill after mode switcher');
});

test('Brand identity contains shrink-0 and whitespace-nowrap to prevent vertical text squishing', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('id="nav-brand-logo"'), 'Brand logo exists');
  assert.ok(headerHtml.includes('whitespace-nowrap'), 'Brand logo text must be whitespace-nowrap');
  assert.ok(headerHtml.includes('shrink-0'), 'Brand logo container must be shrink-0');
});

test('Room Code Quick Pill is deferred to 2xl:flex to prevent horizontal overflow on standard laptops', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('hidden 2xl:flex items-center p-1 rounded-full bg-surface border'), 'Room code input must use 2xl:flex breakpoint');
});

test('Create Room button uses hidden lg:flex with whitespace-nowrap', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('id="btn-header-create-room"'), 'Create room button exists');
  assert.ok(headerHtml.includes('hidden lg:flex'), 'Create room must be hidden on mobile/small screens');
  assert.ok(headerHtml.includes('whitespace-nowrap'), 'Create room button must have whitespace-nowrap');
});

test('Google Sign-In button and Citizen Profile are shrink-0 and compact on mobile', () => {
  // Guest state
  store.setState({ currentUser: store.getDefaultGuestUser() });
  const guestHeader = renderHeader();
  assert.ok(guestHeader.includes('btn-google-sign-in'), 'Guest has google sign-in');
  assert.ok(guestHeader.includes('shrink-0'), 'Sign-in button has shrink-0');

  // Authenticated state
  store.setState({
    currentUser: {
      id: 'usr_test',
      displayName: 'Harshal Patel',
      email: 'harshal@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/avatar',
      isLoggedIn: true,
    }
  });
  const authHeader = renderHeader();
  assert.ok(authHeader.includes('id="header-user-profile"'), 'Auth user has profile container');
  assert.ok(authHeader.includes('shrink-0'), 'Profile container has shrink-0');
});

// -----------------------------------------------------------------------------
// Suite 2: Mobile vs Desktop Breakpoint Alignment (md:hidden)
// -----------------------------------------------------------------------------
test('Mobile subheader category tabs use md:hidden to prevent duplicate navbars on tablets', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('class="md:hidden w-full overflow-x-auto'), 'Mobile category bar must be md:hidden');
  assert.ok(!headerHtml.includes('class="lg:hidden w-full overflow-x-auto'), 'Must not use lg:hidden for mobile category bar');
});

test('Mobile bottom command dock and restore pill use md:hidden', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('id="mobile-bottom-nav" class="md:hidden fixed bottom-0'), 'Bottom dock must be md:hidden');
  assert.ok(headerHtml.includes('id="btn-restore-bottom-nav" class="md:hidden fixed bottom-4'), 'Restore button must be md:hidden');
  assert.ok(headerHtml.includes('id="mobile-explore-sheet-backdrop" class="bottom-sheet-backdrop fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end md:hidden select-none"'), 'Explore sheet must be md:hidden');
});

console.log(`\n🎉 All ${passedTests} Navbar Responsiveness & Overflow tests passed successfully!\n`);
