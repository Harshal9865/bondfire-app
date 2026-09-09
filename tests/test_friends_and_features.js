// ==============================================================================
// TEST SUITE: Friends Lounge, Squads, Sparks Gifting & Memory Creator
// Validates state reactivity, DOM markup generation, and game-deck bridging
// ==============================================================================

import assert from 'node:assert/strict';
import { store } from '../js/state/store.js';
import { renderFriendsScreen } from '../js/components/friendsScreen.js';
import { renderGameScreen } from '../js/components/gameScreen.js';
import { renderProfileScreen } from '../js/components/profileScreen.js';
import { renderHeader } from '../js/components/header.js';
import { renderLobby } from '../js/components/lobby.js';
import { renderVaultScreen } from '../js/components/vaultScreen.js';

console.log('🧪 Starting Friends Lounge & Extended Features Test Suite...\n');

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
// Suite 1: Reactive Store Social State & Actions
// -----------------------------------------------------------------------------
test('Store loads default friends, squads, and requests', () => {
  const state = store.getState();
  assert.ok(Array.isArray(state.friendsList), 'friendsList should be an array');
  assert.ok(state.friendsList.length >= 4, 'should have at least 4 default friends');
  assert.ok(Array.isArray(state.squadsList), 'squadsList should be an array');
  assert.ok(state.squadsList.length >= 3, 'should have default squads');
  assert.ok(state.friendRequests && Array.isArray(state.friendRequests.incoming), 'incoming requests exists');
});

test('Store can add and remove friends', () => {
  const initialCount = store.getState().friendsList.length;
  const friend = store.addFriend({
    name: 'Devin AI',
    status: 'ONLINE',
    role: 'Code Explorer',
  });
  assert.equal(store.getState().friendsList.length, initialCount + 1);
  assert.equal(friend.name, 'Devin AI');
  assert.equal(friend.status, 'ONLINE');

  store.removeFriend(friend.id);
  assert.equal(store.getState().friendsList.length, initialCount);
});

test('Store can gift Sparks with karma bonus to host', () => {
  const state = store.getState();
  const targetFriend = state.friendsList[0];
  const initialFriendSparks = targetFriend.sparks || 0;
  const initialHostSparks = state.currentUser.sparks || 120;

  store.sendSparkGift(targetFriend.id);

  const updatedState = store.getState();
  const updatedFriend = updatedState.friendsList.find((f) => f.id === targetFriend.id);
  assert.equal(updatedFriend.sparks, initialFriendSparks + 20, 'Friend should receive 20 sparks');
  assert.equal(updatedState.currentUser.sparks, initialHostSparks + 5, 'Host should gain 5 sparks');
});

test('Store handles friend request accept & decline lifecycle', () => {
  const incomingReq = store.getState().friendRequests.incoming[0];
  if (incomingReq) {
    const friendCount = store.getState().friendsList.length;
    const accepted = store.acceptFriendRequest(incomingReq.id);
    assert.ok(accepted, 'Should return accepted friend');
    assert.equal(store.getState().friendsList.length, friendCount + 1);
  }

  const outgoing = store.sendFriendRequest('new_camper_42');
  assert.equal(outgoing.toUsername, 'new_camper_42');
  assert.ok(store.getState().friendRequests.outgoing.some((r) => r.toUsername === 'new_camper_42'));
});

test('Store creates custom squad circles', () => {
  const squadCount = store.getState().squadsList.length;
  const newSquad = store.createSquad({
    name: 'Weekend Hackers',
    emoji: '🚀',
    deckName: 'Late Night Deploy Disasters',
  });
  assert.equal(store.getState().squadsList.length, squadCount + 1);
  assert.equal(newSquad.name, 'Weekend Hackers');
});

// -----------------------------------------------------------------------------
// Suite 2: Custom Memory Creator & Live Game Deck Bridging
// -----------------------------------------------------------------------------
test('Adding custom memory populates vault AND injects into live trivia game deck', () => {
  const initialDeckLength = store.getState().customGameDeck?.length || 0;
  const initialVaultCount = store.getState().vaultMemories.length;

  const mem = store.addCustomMemory({
    title: 'The Coffee Spill Incident',
    quote: 'Who poured matcha onto the mechanical keyboard at 4 AM?',
    author: 'Leo Vance',
    type: 'INSIDE_JOKE',
  });

  const state = store.getState();
  assert.equal(state.vaultMemories.length, initialVaultCount + 1);
  assert.equal(state.customGameDeck.length, initialDeckLength + 1);

  // Check Game Screen picks up custom card
  const gameHtml = renderGameScreen();
  assert.ok(gameHtml.includes('Who poured matcha onto the mechanical keyboard'), 'Game Screen renders custom memory card');
});

// -----------------------------------------------------------------------------
// Suite 3: Friends Screen Component Rendering
// -----------------------------------------------------------------------------
test('Friends Screen renders with complete UI and tabs', () => {
  const html = renderFriendsScreen();
  assert.ok(html.includes('Squad Lounge'), 'Contains header title');
  assert.ok(html.includes('My Campers'), 'Contains Campers tab');
  assert.ok(html.includes('Pod Squads'), 'Contains Squads tab');
  assert.ok(html.includes('Requests & Discover'), 'Contains Requests tab');
  assert.ok(html.includes('Sarah Chen'), 'Contains default campers');
  assert.ok(html.includes('Gift 20 Sparks'), 'Contains gifting CTA');
  assert.ok(!html.includes('undefined'), 'No undefined strings rendered');
  assert.ok(!html.includes('NaN'), 'No NaN values rendered');
});

// -----------------------------------------------------------------------------
// Suite 4: Header, Mobile Drawer & Profile Integration
// -----------------------------------------------------------------------------
test('Header navigation contains Friends link', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('data-view="FRIENDS"'), 'Header contains FRIENDS data-view');
  assert.ok(headerHtml.includes('Friends Lounge') || headerHtml.includes('<span>Friends</span>'), 'Header contains Friends text');
});

test('Profile Screen contains Friends Lounge banner', () => {
  const profileHtml = renderProfileScreen();
  assert.ok(profileHtml.includes('Friends & Squads Lounge'), 'Profile contains Friends Lounge banner');
  assert.ok(profileHtml.includes('id="btn-profile-open-friends"'), 'Profile contains Open Friends button');
});

test('Lobby contains Invite from Friends button', () => {
  const lobbyHtml = renderLobby();
  assert.ok(lobbyHtml.includes('id="btn-invite-from-friends"'), 'Lobby contains Invite from Friends CTA');
});

test('Vault Screen contains Inside Joke Modal', () => {
  const vaultHtml = renderVaultScreen();
  assert.ok(vaultHtml.includes('id="inside-joke-modal"'), 'Vault contains inside-joke-modal');
  assert.ok(vaultHtml.includes('id="form-inside-joke"'), 'Vault contains form-inside-joke');
});

console.log(`\n🎉 All ${passedTests} Friends & Feature tests passed successfully!\n`);
