// ==============================================================================
// TEST SUITE: Duo Mode Host Authority, Real Voice & Whisper Notes, Pod Chat & Jukebox
// ==============================================================================

import assert from 'node:assert/strict';
import { store } from '../js/state/store.js';
import { renderCoupleScreen } from '../js/components/coupleScreen.js';
import { renderLobby } from '../js/components/lobby.js';
import { renderVaultScreen } from '../js/components/vaultScreen.js';
import { renderHeader } from '../js/components/header.js';
import { renderSpotifyJukebox, FULL_SONG_PRESETS } from '../js/components/spotifyPlayer.js';

console.log('🧪 Starting Duo Mode, Real Voice Notes, Pod Chat & Jukebox Test Suite...\n');

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
// Suite 1: Duo Mode Room Creation, Instant Join & Host Authority
// -----------------------------------------------------------------------------
test('Duo Room creation sets isHost: true and mode: US', () => {
  const room = store.createDuoRoom('Priya & Rohan');
  assert.equal(room.mode, 'US');
  assert.equal(room.roomType, 'DUO');
  assert.equal(room.isHost, true);
  assert.equal(room.sessionStarted, false);
  assert.equal(room.players.length, 1);
  assert.equal(room.players[0].role, 'HOST');
});

test('Partner joining with code keeps Host and sets role: PARTNER with isHost: false', () => {
  const hostRoom = store.getState().activeRoom;
  const roomCode = hostRoom.roomCode;

  // Simulate partner joining from mobile device
  store.setState({
    activeRoom: {
      ...hostRoom,
      isHost: false, // On partner device
    },
    currentUser: {
      id: 'usr_partner_phone',
      displayName: 'Aarav',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
      isLoggedIn: true,
    },
  });

  const joinedRoom = store.joinRoomWithCode(roomCode, true);
  assert.equal(joinedRoom.roomCode, roomCode);
  assert.equal(joinedRoom.mode, 'US');
  assert.equal(joinedRoom.isHost, false, 'Guest partner must NOT be host');
  assert.equal(joinedRoom.players.length, 2, 'Should have both Host and Partner');
  assert.equal(joinedRoom.players[1].role, 'PARTNER');
});

test('Host authority in renderCoupleScreen: Only host sees Start Session button', () => {
  // 1. As Partner (Guest)
  store.setState({
    activeRoom: {
      ...store.getState().activeRoom,
      isHost: false,
      sessionStarted: false,
    },
  });
  const partnerHtml = renderCoupleScreen();
  assert.ok(partnerHtml.includes('Both Connected!'), 'Should show Both Connected');
  assert.ok(!partnerHtml.includes('id="btn-start-duo-session"'), 'Partner must NOT see start session button');
  assert.ok(partnerHtml.includes('Waiting for'), 'Partner sees waiting indicator');

  // 2. As Host
  store.setState({
    activeRoom: {
      ...store.getState().activeRoom,
      isHost: true,
      sessionStarted: false,
    },
  });
  const hostHtml = renderCoupleScreen();
  assert.ok(hostHtml.includes('id="btn-start-duo-session"'), 'Host must see start session button');
  assert.ok(hostHtml.includes('Start Date Night Session (Host)'));
});

// -----------------------------------------------------------------------------
// Suite 2: Real Voice Notes & Secret Whisper Notes with Wax Seal
// -----------------------------------------------------------------------------
test('Duo Voice Notes are stored and archived in vault', () => {
  const initialVnCount = (store.getState().duoVoiceNotes || []).length;
  const vn = store.addDuoVoiceNote({
    author: 'Rohan',
    audioUrl: 'data:audio/webm;base64,GkXfo59ChoEBQveBAU...',
    duration: '0:22',
  }, false);

  assert.equal(vn.author, 'Rohan');
  assert.equal(vn.duration, '0:22');
  assert.equal(store.getState().duoVoiceNotes.length, initialVnCount + 1);

  // Check vault auto-archive
  const vaultMemories = store.getState().vaultMemories;
  const archived = vaultMemories.find((m) => m.type === 'AUDIO' && m.title.includes('Rohan'));
  assert.ok(archived, 'Voice note should be auto-archived into vault');
});

test('Duo Whisper Notes support wax seal unsealing', () => {
  const initialWhisperCount = (store.getState().duoWhisperNotes || []).length;
  const note = store.addDuoWhisperNote({
    author: 'Priya',
    text: 'You are my favorite road trip passenger forever.',
  }, false);

  assert.equal(note.author, 'Priya');
  assert.equal(note.unsealed, false, 'Note starts sealed with wax');
  assert.equal(store.getState().duoWhisperNotes.length, initialWhisperCount + 1);

  // Unseal the note
  store.unsealDuoWhisperNote(note.id);
  const updatedNote = store.getState().duoWhisperNotes.find((n) => n.id === note.id);
  assert.equal(updatedNote.unsealed, true, 'Note should now be unsealed');
});

// -----------------------------------------------------------------------------
// Suite 3: Squad Pods Live Banter & Custom Trivia Card Bridge
// -----------------------------------------------------------------------------
test('Squad Pod Chat sends real-time messages and bridges to playable deck', () => {
  const initialMsgCount = (store.getState().podChatMessages || []).length;
  const msg = store.addPodChatMessage({
    senderName: 'Kabir',
    text: 'Remember when Arjun booked an Airbnb with no roof?',
  }, false);

  assert.equal(msg.senderName, 'Kabir');
  assert.equal(store.getState().podChatMessages.length, initialMsgCount + 1);

  // Turn chat message into custom trivia card
  const initialDeckCount = store.getState().customGameDeck.length;
  const card = store.addCustomRoomCard({
    title: `${msg.senderName}'s Inside Joke`,
    prompt: msg.text,
    quote: msg.text,
    author: msg.senderName,
  });

  assert.equal(card.title, "Kabir's Inside Joke");
  assert.equal(card.author, 'Kabir');
  assert.equal(store.getState().customGameDeck.length, initialDeckCount + 1);

  // Verify render in Lobby
  const lobbyHtml = renderLobby();
  assert.ok(lobbyHtml.includes('Live Squad Banter'), 'Lobby contains Live Squad Banter');
  assert.ok(lobbyHtml.includes('btn-chat-to-card'), 'Lobby contains turn into card button');
  assert.ok(lobbyHtml.includes('bottom-[68px] lg:bottom-0'), 'Lobby footer is elevated above mobile bottom nav');
});

// -----------------------------------------------------------------------------
// Suite 4: Memory Vault De-hardcoding & Dynamic Rendering
// -----------------------------------------------------------------------------
test('Vault Screen contains zero mock hardcoded quotes and renders real user memories', () => {
  const vaultHtml = renderVaultScreen();
  // Ensure old static mock strings are gone
  assert.ok(!vaultHtml.includes('“If anyone asks for another scenic detour'), 'Old mock quote must be removed');
  assert.ok(!vaultHtml.includes('“On my way, literally turning onto your street'), 'Old mock quote must be removed');
  assert.ok(!vaultHtml.includes('SAMPLE_VAULT_AWARDS'), 'Sample mock awards should not be present');

  // Ensure real user memories are rendered
  assert.ok(vaultHtml.includes('Live Vault Entries'), 'Shows live vault entries');
  assert.ok(vaultHtml.includes('You are my favorite road trip passenger'), 'Shows real whisper note');
  assert.ok(vaultHtml.includes('Voice Note from Rohan'), 'Shows real voice note entry');
});

// -----------------------------------------------------------------------------
// Suite 5: Mobile Filter Pills & Campfire Jukebox
// -----------------------------------------------------------------------------
test('Header renders mobile-filter-pill buttons including Friends and Jukebox toggle', () => {
  const headerHtml = renderHeader();
  assert.ok(headerHtml.includes('data-view="FRIENDS"'), 'Header has Friends link');
  assert.ok(headerHtml.includes('id="btn-header-jukebox"'), 'Header has Jukebox button');
  assert.ok(headerHtml.includes('class="mobile-filter-pill'), 'Header has mobile filter pills');
});

test('Campfire Jukebox supports Full Songs and Spotify mode', () => {
  assert.ok(FULL_SONG_PRESETS.length >= 4, 'Has full song presets');
  assert.ok(FULL_SONG_PRESETS.some((p) => p.id === 'antakshari'), 'Has Antakshari preset');
  assert.ok(FULL_SONG_PRESETS.some((p) => p.id === 'punjabi'), 'Has Punjabi preset');

  const jukeboxHtml = renderSpotifyJukebox();
  assert.ok(jukeboxHtml.includes('Campfire Jukebox'), 'Renders Campfire Jukebox');
  assert.ok(jukeboxHtml.includes('Free Full Songs'), 'Renders Free Full Songs mode button');
  assert.ok(jukeboxHtml.includes('Spotify Embed'), 'Renders Spotify Embed mode button');
  assert.ok(jukeboxHtml.includes('id="jukebox-embed-iframe"'), 'Renders embed iframe');
});

console.log(`\n🎉 All ${passedTests} Duo, Chat, Vault & Jukebox Tests Passed Successfully!\n`);
