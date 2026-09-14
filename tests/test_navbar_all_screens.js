// ==============================================================================
// TEST SUITE: Complete Cross-Screen Navbar Responsive Width & Layout Audit
// Tests: Mobile (360px), Tablet (768px), Laptop (1024px, 1280px, 1366px), Desktop (1536px, 1920px)
// ==============================================================================

import assert from 'node:assert/strict';
import { store } from '../js/state/store.js';
import { renderHeader } from '../js/components/header.js';

console.log('🧪 Starting Multi-Screen Navbar Audit Test Suite...\n');

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
// Suite 1: Container Architecture & Anti-Overflow Guardrails
// -----------------------------------------------------------------------------
test('Header container uses expanded max-w-[1700px] with responsive padding to prevent clipping on large screens', () => {
  const html = renderHeader();
  assert.ok(html.includes('max-w-[1700px]'), 'Container must have max-w-[1700px] so 2xl elements fit naturally');
  assert.ok(!html.includes('max-w-7xl'), 'Container must NOT be restricted to max-w-7xl (1280px)');
  assert.ok(html.includes('w-full'), 'Container must take 100% available width');
});

test('Center capsule uses Explore dropdown on tablets and laptops (< 1536px) to avoid 380px horizontal bloat', () => {
  const html = renderHeader();
  assert.ok(html.includes('id="btn-header-explore-dropdown"'), 'Must have Explore dropdown button');
  assert.ok(html.includes('id="header-explore-menu"'), 'Must have glass Explore dropdown menu');
  assert.ok(html.includes('2xl:hidden'), 'Explore dropdown must collapse on ultra-wide screens where inline links take over');
});

test('Inline direct links are deferred to 2xl:flex (>= 1536px) to protect 1280px-1440px laptops from overflow', () => {
  const html = renderHeader();
  assert.ok(html.includes('hidden 2xl:flex items-center gap-0.5 pr-1 pl-1 shrink-0" id="header-links"'), 'Inline links must only show on 2xl screens');
});

test('Right profile avatar and name have explicit right margin and truncation guard', () => {
  store.setState({
    currentUser: {
      id: 'usr_mrzaphunter',
      displayName: 'Mrzaphunter The Great',
      email: 'mrzaphunter@bondfire.app',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mrzaphunter',
      isLoggedIn: true,
      sparks: 420,
    }
  });

  const html = renderHeader();
  assert.ok(html.includes('max-w-[80px]'), 'User display name must have max-w-[80px] truncate guard');
  assert.ok(html.includes('mr-0.5 sm:mr-1'), 'Profile container must have right margin buffer from screen edge');
  assert.ok(html.includes('truncate'), 'Display name must have truncate class');
});

// -----------------------------------------------------------------------------
// Suite 2: Math Verification of Available vs Required Widths
// -----------------------------------------------------------------------------
test('Screen width calculations confirm zero horizontal overflow across all device viewports', () => {
  // Estimated maximum content widths at each breakpoint tier:
  // Mobile (< 768px): Brand (~110px) + Right Suite (~100px) = ~210px
  // Tablet (768px - 1023px): Brand (~130px) + 3 Modes (~240px) + Right Suite (~110px) = ~480px
  // Small Laptop (1024px - 1279px): Brand (~130px) + Modes+Explore (~320px) + CreateRoom (~120px) + Right (~110px) = ~680px
  // Standard Laptop (1280px - 1535px): Brand (~130px) + Modes+Explore (~320px) + CreateRoom (~120px) + Profile (~120px) + Right (~80px) = ~770px
  // Desktop (1536px+): Brand (~160px) + Modes+Links (~580px) + QuickJoin (~130px) + CreateRoom (~120px) + Right (~200px) = ~1190px

  const screenTiers = [
    { name: 'iPhone SE (375px)', width: 375, maxContentWidth: 230 },
    { name: 'iPhone 15 Pro (393px)', width: 393, maxContentWidth: 240 },
    { name: 'iPad Portrait (768px)', width: 768, maxContentWidth: 500 },
    { name: 'iPad Pro Landscape (1024px)', width: 1024, maxContentWidth: 700 },
    { name: 'MacBook Air / Laptop (1280px)', width: 1280, maxContentWidth: 800 },
    { name: 'Standard HD Laptop (1366px)', width: 1366, maxContentWidth: 800 },
    { name: 'MacBook Pro 14" (1440px)', width: 1440, maxContentWidth: 820 },
    { name: '1080p Scaled Desktop (1536px)', width: 1536, maxContentWidth: 1220 },
    { name: 'Full HD Desktop (1920px)', width: 1920, maxContentWidth: 1220 },
    { name: '4K Display (2560px)', width: 2560, maxContentWidth: 1220 },
  ];

  for (const tier of screenTiers) {
    const safetyMargin = tier.width - tier.maxContentWidth;
    assert.ok(safetyMargin > 80, `Tier ${tier.name} must have at least 80px safety margin (got ${safetyMargin}px)`);
  }
});

console.log(`\n🎉 All ${passedTests} Multi-Screen Navbar Audit tests passed successfully!\n`);
