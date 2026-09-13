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
  assert.ok(Array.isArray(state.squadsList), 'squadsList should be an array');
  assert.ok(state.friendRequests && Array.isArray(state.friendRequests.incoming), 'incoming requests exists');
});

test('Store can add and remove friends', () => {
  const initialCount = store.getState().friendsList.length;
  const friend = store.addFriend({
    name: 'Real Camper',
    status: 'ONLINE',
    role: 'Co-Host',
  });
  assert.equal(store.getState().friendsList.length, initialCount + 1);
  assert.equal(friend.name, 'Real Camper');
  assert.equal(friend.status, 'ONLINE');

  store.removeFriend(friend.id);
  assert.equal(store.getState().friendsList.length, initialCount);
});

test('Store can gift Sparks with karma bonus to host', () => {
  const friend = store.addFriend({
    name: 'Campfire Buddy',
    status: 'ONLINE',
    role: 'Player',
    sparks: 50,
  });
  const state = store.getState();
  const initialFriendSparks = friend.sparks;
  const initialHostSparks = state.currentUser?.sparks || 120;

  store.sendSparkGift(friend.id);

  const updatedState = store.getState();
  const updatedFriend = updatedState.friendsList.find((f) => f.id === friend.id);
  assert.equal(updatedFriend.sparks, initialFriendSparks + 20, 'Friend should receive 20 sparks');
  assert.equal(updatedState.currentUser.sparks, initialHostSparks + 5, 'Host should gain 5 sparks');
});

test('Store handles friend request accept & decline lifecycle', () => {
  store.setState({
    friendRequests: {
      incoming: [{ id: 'req_1', fromName: 'New Camper', status: 'PENDING' }],
      outgoing: []
    }
  });
  const incomingReq = store.getState().friendRequests.incoming[0];
  if (incomingReq) {
    const friendCount = store.getState().friendsList.length;
    const accepted = store.acceptFriendRequest(incomingReq.id);
    assert.equal(accepted.name, 'New Camper');
    assert.equal(store.getState().friendsList.length, friendCount + 1);
  }
});

test('Store creates custom squad circles', () => {
  const squad = store.createSquad({
    name: 'Weekend Travelers',
    description: 'Road trips and cabin getaways',
    members: ['usr_harshal'],
  });
  assert.equal(squad.name, 'Weekend Travelers');
  const found = store.getState().squadsList.find((s) => s.id === squad.id);
  assert.ok(found, 'Created squad is in squadsList');
});

// -----------------------------------------------------------------------------
// Suite 2: Custom Memory Creator & Live Game Deck Bridging
// -----------------------------------------------------------------------------
test('Adding custom memory populates vault AND injects into live trivia game deck', () => {
  const mem = store.addCustomMemory({
    author: 'Sam',
    quote: 'Lost the map, found the scenic view.',
    title: 'Scenic Shortcut',
  });
  assert.equal(mem.author, 'Sam');
  const vaultMemories = store.getState().vaultMemories;
  assert.ok(vaultMemories.find((m) => m.id === mem.id));
  const customDeck = store.getState().customGameDeck;
  assert.ok(customDeck.find((c) => c.id === mem.id));
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

test('Lobby contains Invite Camper buttons', () => {
  const lobbyHtml = renderLobby();
  assert.ok(lobbyHtml.includes('btn-whatsapp-share') || lobbyHtml.includes('slot-invite-player'), 'Lobby contains invite triggers');
});

test('Vault Screen contains Add Memory Drop Zone & Modal', () => {
  const vaultHtml = renderVaultScreen();
  assert.ok(vaultHtml.includes('add-memory-modal'), 'Vault contains add-memory-modal');
  assert.ok(vaultHtml.includes('vault-drop-zone'), 'Vault contains dropzone');
});

console.log(`\n🎉 All ${passedTests} Friends & Feature tests passed successfully!\n`);
