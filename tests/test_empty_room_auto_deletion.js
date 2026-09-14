// ==============================================================================
// TEST SUITE: ACTIVE ROOM 2-MINUTE EMPTY AUTO-DELETION
// Verifies empty room detection, cancellation on camper join, 2-minute deletion,
// and localStorage expired room purge across tab reloads.
// ==============================================================================

import assert from 'assert';

// 1. Mock Browser Environment
global.window = {
  location: { hostname: 'localhost', hash: '#/LOBBY', origin: 'http://localhost:3000', pathname: '/' },
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  showToast: (msg, type) => { global.__lastToast = { msg, type }; },
};

global.document = {
  body: {
    classList: { toggle: () => {}, add: () => {}, remove: () => {} },
    setAttribute: () => {},
    appendChild: () => {},
    removeChild: () => {},
  },
  createElement: () => ({
    href: '',
    download: '',
    click: () => {},
    setAttribute: () => {},
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => [],
};

const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  get length() { return storageMap.size; },
  key: (idx) => Array.from(storageMap.keys())[idx] || null,
};
global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  clear: () => {},
};

global.fetch = async () => ({ ok: true, json: async () => ({}) });

async function runTests() {
  console.log('🔥 Starting Active Room 2-Minute Auto-Deletion Test Suite...\n');

  const { store } = await import('../js/state/store.js');
  const { renderLobby } = await import('../js/components/lobby.js');
  const { renderRoomsHub } = await import('../js/components/roomsHubScreen.js');

  // Test 1: Active room initialized with default timeout of 2 minutes (120,000 ms)
  console.log('Test 1: Verifying default emptyTimeoutMs configuration...');
  assert.strictEqual(store.emptyTimeoutMs, 120000, 'Default empty timeout must be 2 minutes (120,000 ms)');
  console.log('✅ Test 1 Passed: store.emptyTimeoutMs is 120,000 ms.\n');

  // Test 2: Removing all campers triggers empty room detection & schedules deletion
  console.log('Test 2: Removing all campers from room...');
  store.createNewRoom('Auto-Delete Test Pod');
  const initialCode = store.getState().activeRoom.roomCode;
  const initialPlayers = store.getState().activeRoom.players;
  assert.ok(initialPlayers.length > 0, 'Should start with host player');

  // Remove the host camper to make room empty
  store.removeRoomPlayer(initialPlayers[0].id);
  const stateAfterRemoval = store.getState();
  assert.strictEqual(stateAfterRemoval.activeRoom.players.length, 0, 'Room must have 0 players');
  assert.ok(stateAfterRemoval.activeRoom.emptySince, 'emptySince timestamp must be set');
  assert.ok(stateAfterRemoval.activeRoom.scheduledDeletionAt, 'scheduledDeletionAt timestamp must be set');
  assert.ok(store.emptyRoomTimeout !== null, 'emptyRoomTimeout timer must be scheduled');
  console.log('✅ Test 2 Passed: Empty room detected and deletion scheduled.\n');

  // Test 3: Adding a camper cancels empty deletion timer
  console.log('Test 3: Camper joins before timeout elapses...');
  const newPlayer = store.addRoomPlayer('Alex Rivera');
  const stateAfterJoin = store.getState();
  assert.strictEqual(stateAfterJoin.activeRoom.players.length, 1, 'Room should have 1 player now');
  assert.strictEqual(stateAfterJoin.activeRoom.emptySince, null, 'emptySince must be cleared to null');
  assert.strictEqual(stateAfterJoin.activeRoom.scheduledDeletionAt, null, 'scheduledDeletionAt must be cleared to null');
  assert.strictEqual(store.emptyRoomTimeout, null, 'emptyRoomTimeout timer must be cancelled');
  console.log('✅ Test 3 Passed: Timer cancelled when member joined.\n');

  // Test 4: Auto-deletion triggers when 2-minute timer fires
  console.log('Test 4: Auto-deletion deletes empty room when timeout elapses...');
  store.setEmptyRoomTimeout(60); // 60ms for fast test execution
  store.setRoomPlayers([]); // Empties room
  const codeBeforeExpiry = store.getState().activeRoom.roomCode;
  assert.ok(store.emptyRoomTimeout !== null, 'Timer must be active');

  await new Promise((resolve) => setTimeout(resolve, 100));

  const stateAfterExpiry = store.getState();
  assert.notStrictEqual(stateAfterExpiry.activeRoom.roomCode, codeBeforeExpiry, 'Room code should be newly generated after deletion');
  assert.strictEqual(stateAfterExpiry.activeRoom.emptySince, null, 'emptySince must be reset to null');
  assert.strictEqual(stateAfterExpiry.activeRoom.scheduledDeletionAt, null, 'scheduledDeletionAt must be reset to null');
  assert.strictEqual(store.emptyRoomTimeout, null, 'emptyRoomTimeout should be null after firing');
  store.setEmptyRoomTimeout(120000); // Reset to default 2 minutes
  console.log('✅ Test 4 Passed: Room successfully auto-deleted after timeout.\n');

  // Test 5: store.leaveRoom() leaves the room and triggers empty detection if last player
  console.log('Test 5: store.leaveRoom() triggers empty room detection...');
  store.createNewRoom('Leaving Test Pod');
  const hostId = store.getState().activeRoom.players[0].id;
  // Ensure store.state.currentUser.id matches
  store.setState({ currentUser: { ...store.getState().currentUser, id: hostId } });

  store.leaveRoom();
  const stateAfterLeave = store.getState();
  assert.strictEqual(stateAfterLeave.activeRoom.players.length, 0, 'Room players should be 0 after leaving');
  assert.ok(stateAfterLeave.activeRoom.emptySince, 'emptySince must be set after leaveRoom');
  assert.ok(store.emptyRoomTimeout !== null, 'Deletion timer must be scheduled after leaveRoom');
  console.log('✅ Test 5 Passed: store.leaveRoom() triggered empty room timer.\n');

  const { CONFIG } = await import('../js/config.js');

  // Test 6: Purge of expired empty room on initial load
  console.log('Test 6: loadInitialState() purges room left empty >2 minutes ago...');
  const expiredMockRoom = {
    roomCode: 'OLD1',
    podName: 'Abandoned Room',
    players: [],
    emptySince: Date.now() - 150000, // 2.5 minutes ago (> 2 mins)
    scheduledDeletionAt: Date.now() - 30000,
  };
  storageMap.set(CONFIG.STORAGE_KEY_SESSION, JSON.stringify({
    currentUser: { id: 'usr_test', displayName: 'Test Camper' },
    activeRoom: expiredMockRoom,
  }));

  const loadedState = store.loadInitialState();
  assert.notStrictEqual(loadedState.activeRoom.roomCode, 'OLD1', 'Expired room OLD1 must be deleted and replaced');
  assert.strictEqual(loadedState.activeRoom.emptySince, null, 'New room emptySince must be null');
  console.log('✅ Test 6 Passed: Expired empty room purged from storage.\n');

  // Test 7: Lobby UI renders warning banner when room is empty
  console.log('Test 7: renderLobby() displays warning banner for empty rooms...');
  store.setRoomPlayers([]);
  const html = renderLobby();
  assert.ok(html.includes('Empty Room · Auto-Delete in 2 Mins'), 'Lobby must contain 2-minute auto-delete warning banner');
  assert.ok(html.includes('btn-rejoin-empty-room'), 'Lobby must contain Re-join button');
  assert.ok(html.includes('btn-lobby-leave-room'), 'Lobby must contain Leave Room button');
  console.log('✅ Test 7 Passed: Lobby UI displays empty warning banner and action buttons.\n');

  // Test 8: Rooms Hub UI renders Cancel Room button and store.cancelActiveRoom() dismisses session
  console.log('Test 8: renderRoomsHub() displays Cancel Room button on active session banner...');
  store.createNewRoom('Active Squad Pod');
  const hubHtmlWithActiveRoom = renderRoomsHub();
  assert.ok(hubHtmlWithActiveRoom.includes('btn-cancel-active-room'), 'Rooms Hub banner must include Cancel Room button');
  assert.ok(hubHtmlWithActiveRoom.includes('Cancel Room'), 'Rooms Hub banner must have Cancel Room label');
  assert.ok(hubHtmlWithActiveRoom.includes('btn-resume-active-room'), 'Rooms Hub banner must include Resume Current Room button');

  // Cancel the active room
  store.cancelActiveRoom();
  const hubHtmlAfterCancel = renderRoomsHub();
  assert.ok(!hubHtmlAfterCancel.includes('id="active-room-banner"'), 'Banner must be dismissed after cancelActiveRoom()');
  console.log('✅ Test 8 Passed: Cancel Room button verified and active session banner cleanly dismissed.\n');

  console.log('🎉 ALL 8 TESTS PASSED SUCCESSFULLY! The active room lifecycle & cancel controls are rock solid.\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
