import assert from 'assert';
import { store } from '../js/state/store.js';
import { renderHeader } from '../js/components/header.js';
import { renderSoloScreen } from '../js/components/soloScreen.js';
import { renderLobby } from '../js/components/lobby.js';
import { renderCoupleScreen } from '../js/components/coupleScreen.js';
import { renderGameScreen } from '../js/components/gameScreen.js';
import { renderVaultScreen } from '../js/components/vaultScreen.js';
import { renderYearbookScreen } from '../js/components/yearbookScreen.js';

console.log('🧪 Testing Navbar Profile Icon and Screen De-Hardcoding...\n');

// 1. GUEST STATE (Default)
console.log('Test 1: Guest State Navbar Profile Icon');
store.setState({ currentUser: store.getDefaultGuestUser() });
const guestHeader = renderHeader();
assert(guestHeader.includes('Sign In'), 'Guest navbar must have a "Sign In" button');
assert(guestHeader.includes('viewBox="0 0 24 24"'), 'Guest navbar must have Google logo SVG');
assert(!guestHeader.includes('photo-1494790108377-be9c29b29330'), 'Guest navbar MUST NOT contain Maya Lin Unsplash photo');
assert(!guestHeader.includes('title="Sign In with Google" class="w-9 h-9 rounded-full'), 'Guest navbar must not render avatar image container');
console.log('✅ Passed: Guest navbar correctly displays [ G Sign In ] pill without any mock photo\n');

// 2. SIGNED-IN STATE
console.log('Test 2: Authenticated State Navbar Profile Icon');
store.setState({
  currentUser: {
    id: 'usr_harshal_123',
    displayName: 'Harshal Patel',
    email: 'harshal@gmail.com',
    avatarUrl: 'https://lh3.googleusercontent.com/a/harshal-avatar',
    isLoggedIn: true,
    tier: 'PRO',
    sparks: 450,
  }
});
const authHeader = renderHeader();
assert(authHeader.includes('Harshal Patel'), 'Authenticated navbar must show user display name');
assert(authHeader.includes('https://lh3.googleusercontent.com/a/harshal-avatar'), 'Authenticated navbar must render real user avatarUrl');
assert(authHeader.includes('title="Verified Online"'), 'Authenticated navbar must show online status indicator');
console.log('✅ Passed: Authenticated navbar correctly renders user avatar and online status\n');

// 3. SOLO SCREEN
console.log('Test 3: Solo Screen Dynamic Greeting & Visuals');
const soloHtml = renderSoloScreen();
assert(soloHtml.includes('Harshal</h2>'), 'Solo screen must dynamically greet Harshal');
assert(!soloHtml.includes('Good evening, Maya'), 'Solo screen must NOT say "Good evening, Maya"');
assert(!soloHtml.includes('photo-1506744038136-46273834b3fb'), 'Solo screen must NOT use hardcoded Unsplash image');
console.log('✅ Passed: Solo screen uses dynamic greeting and cyberpunk card\n');

// 4. LOBBY SCREEN
console.log('Test 4: Lobby Screen Dynamic Host & Campers');
const lobbyHtml = renderLobby();
assert(lobbyHtml.includes('Host: <span class="text-white font-bold">Harshal</span>'), 'Lobby must show dynamic host name Harshal');
assert(!lobbyHtml.includes('Host: Maya'), 'Lobby must not say Host: Maya');
assert(!lobbyHtml.includes('Maya controls countdown'), 'Lobby must not say Maya controls countdown');
console.log('✅ Passed: Lobby screen dynamically reflects active user as host\n');

// 5. COUPLE SCREEN
console.log('Test 5: Couple Screen Setup & Dynamic Partner Names');
const coupleSetupHtml = renderCoupleScreen();
assert(coupleSetupHtml.includes('A private playground for the two of you.'), 'Couple setup screen must show private space intro');
assert(coupleSetupHtml.includes('Create a Duo Room'), 'Couple setup screen must show create room option');
assert(coupleSetupHtml.includes('Join Partner\'s Room'), 'Couple setup screen must show join room option');
assert(!coupleSetupHtml.includes('Maya & Arjun'), 'Couple setup screen must not say Maya & Arjun');

store.setState({
  activeRoom: {
    roomCode: 'LOVE24',
    mode: 'US',
    roomType: 'DUO',
    players: [
      { id: 'usr_harshal_123', name: 'Harshal', role: 'HOST' },
      { id: 'usr_partner_456', name: 'Partner', role: 'PARTNER' }
    ]
  }
});
const coupleActiveHtml = renderCoupleScreen();
assert(coupleActiveHtml.includes('Harshal & Partner'), 'Active couple screen must show Harshal & Partner');
assert(!coupleActiveHtml.includes('Maya & Arjun'), 'Active couple screen must not say Maya & Arjun');
console.log('✅ Passed: Couple screen verifies zero-bot setup and dynamic active room\n');

// 6. GAME SCREEN
console.log('Test 6: Gameplay Screen Dynamic Choices');
const gameHtml = renderGameScreen();
assert(gameHtml.includes('data-option="Harshal"'), 'Game options must include Harshal instead of Maya');
assert(!gameHtml.includes('data-option="Maya"'), 'Game options must NOT include Maya');
console.log('✅ Passed: Game screen options dynamically replaced with Harshal\n');

// 7. VAULT SCREEN
console.log('Test 7: Vault Screen Dynamic Tags & Speakers');
const vaultHtml = renderVaultScreen();
assert(vaultHtml.includes('Tagged: Harshal, Room Campers'), 'Vault tag must say Tagged: Harshal, Room Campers');
assert(!vaultHtml.includes('Tagged: Maya, Rohan'), 'Vault must not say Tagged: Maya, Rohan');
assert(!vaultHtml.includes('Speaker: Maya K.'), 'Vault must not say Speaker: Maya K.');
console.log('✅ Passed: Vault screen dynamically tags active user\n');

// 8. YEARBOOK SCREEN
console.log('Test 8: Yearbook Screen Dynamic Superlatives');
const yearbookHtml = renderYearbookScreen();
assert(yearbookHtml.includes('Harshal</h4>'), 'Yearbook award must show Harshal');
assert(!yearbookHtml.includes('Maya K.'), 'Yearbook must not show Maya K.');
console.log('✅ Passed: Yearbook superlatives dynamically award Harshal\n');

console.log('🎉 ALL NAVBAR AND SCREEN DE-HARDCODING CHECKS PASSED 100%!');
