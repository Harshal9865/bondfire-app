// ==============================================================================
// MASTER APPLICATION CONTROLLER & ROUTER
// Orchestrates views, state synchronization, and audio/canvas rendering
// ==============================================================================

import { store } from './state/store.js';
import { FluidCanvas } from './visuals/fluidCanvas.js';
import { GoogleAuthService } from './services/googleAuth.js';
import { getAuthUser } from './services/supabaseClient.js';
import { socketService } from './services/socket.js';

// Components
import { renderHeader, bindHeaderEvents } from './components/header.js';
import { renderHero, bindHeroEvents } from './components/hero.js';
import { renderLobby, bindLobbyEvents } from './components/lobby.js';
import { renderGameScreen, bindGameEvents } from './components/gameScreen.js';
import { renderVaultScreen, bindVaultEvents } from './components/vaultScreen.js';
import { renderYearbookScreen, bindYearbookEvents } from './components/yearbookScreen.js';
import { renderProfileScreen, bindProfileEvents } from './components/profileScreen.js';
import { renderFriendsScreen, bindFriendsEvents } from './components/friendsScreen.js';
import { renderShowsScreen, bindShowsEvents } from './components/showsScreen.js';
import { renderSpinBottleGame, bindSpinBottleEvents } from './components/spinBottleGame.js';
import { renderNeverHaveIEverGame, bindNeverHaveIEverEvents } from './components/neverHaveIEverGame.js';
import { renderMostLikelyToGame, bindMostLikelyToEvents } from './components/mostLikelyToGame.js';
import { renderArcadeScreen, bindArcadeEvents } from './components/arcadeScreen.js';
import { renderEmporiumScreen, bindEmporiumEvents } from './components/emporiumScreen.js';
import { renderTvModeScreen, bindTvModeEvents } from './components/tvModeScreen.js';
import { renderSoloScreen, bindSoloEvents } from './components/soloScreen.js';
import { renderCoupleScreen, bindCoupleEvents } from './components/coupleScreen.js';
import { renderFooter, bindFooterEvents } from './components/footer.js';
import { renderSpotifyJukebox, bindSpotifyEvents } from './components/spotifyPlayer.js';
import { renderRoomsHub, bindRoomsHubEvents } from './components/roomsHubScreen.js';
import { renderGateScreen, bindGateScreenEvents } from './components/gateScreen.js';
import { renderRajaMantriGame, bindRajaMantriEvents } from './components/rajaMantriGame.js';
import { renderBollywoodGame, bindBollywoodEvents } from './components/bollywoodGame.js';
import { renderTambolaGame, bindTambolaEvents } from './components/tambolaGame.js';

class BondfireApp {
  constructor() {
    this.appMount = document.getElementById('app-mount');
    this.headerMount = document.getElementById('header-mount');
    this.footerMount = document.getElementById('footer-mount');
  }

  init() {
    console.log('🔥 Initializing Bondfire Social Memory Engine...');

    // 1. Initialize Fluid Particle Canvas (OpenAI/Gemini background)
    new FluidCanvas('bg-canvas');

    // 2. Initialize Google Identity Services
    GoogleAuthService.init();

    // 2b. Check & restore live Supabase Cloud Session
    getAuthUser().then((cloudUser) => {
      if (cloudUser) {
        console.log('✅ Supabase Auth user restored:', cloudUser.name);
        store.updateUserProfile({
          isLoggedIn: true,
          displayName: cloudUser.name,
          email: cloudUser.email,
          avatarUrl: cloudUser.avatarUrl,
        });
      }
    });

    // 3. Connect Real-time WebSocket Service
    socketService.connect();

    // 4. Register PWA Service Worker for offline resilience
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('⚡ Bondfire PWA Service Worker registered:', reg.scope);
          reg.update();
        })
        .catch((err) => console.warn('PWA Service Worker registration warning:', err));
    }

    // 4b. Mount Global Campfire Jukebox
    const jukeboxMount = document.getElementById('jukebox-mount');
    if (jukeboxMount) {
      jukeboxMount.innerHTML = renderSpotifyJukebox();
      bindSpotifyEvents();
    }

    // 5. Bind Store updates to re-render
    store.subscribe((state) => {
      this.render(state);
    });

    // 6. Hash Routing Handling
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // 7. Initial Route Resolution (Gate is always first front door when opening the website)
    this.isInitialBoot = true;
    this.handleHashChange();
  }

  handleHashChange() {
    let roomCodeFromUrl = null;

    // 1. Check query params in search (?code=XXXX or ?room=XXXX)
    if (typeof window !== 'undefined' && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      roomCodeFromUrl = urlParams.get('code') || urlParams.get('room');
    }

    // 2. Check query params or hash routing in window.location.hash
    if (!roomCodeFromUrl && typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.replace(/^#\/?/, '');
      if (cleanHash.startsWith('room=') || cleanHash.startsWith('code=')) {
        const hashParams = new URLSearchParams(cleanHash);
        roomCodeFromUrl = hashParams.get('room') || hashParams.get('code');
      } else {
        const [hashPath, hashQuery] = cleanHash.split('?');
        if (hashQuery) {
          const hashParams = new URLSearchParams(hashQuery);
          roomCodeFromUrl = hashParams.get('code') || hashParams.get('room');
        }
      }
    }

    if (roomCodeFromUrl) {
      roomCodeFromUrl = roomCodeFromUrl.trim().toUpperCase();
    }

    const rawHash = (typeof window !== 'undefined' && window.location.hash) 
      ? window.location.hash.replace(/^#\/?/, '').split('?')[0] 
      : '';
    const hash = (rawHash || '').toUpperCase();
    const aliasMap = {
      'VAULT': 'MEMORIES',
      'PHOTOBOOK': 'YEARBOOK',
      'EMPORIUM': 'STORE',
      'US': 'COUPLE',
      'COUPLES': 'COUPLE',
      'TIME_CAPSULE': 'SOLO',
      'SOLO': 'SOLO',
      'PODS': 'ROOMS',
      'SQUAD': 'ROOMS',
      'PIXEL_GLADE': 'ARCADE',
      'GLADE': 'ARCADE',
      'HERO': 'HOME',
      'PORTAL': 'GATE',
      'TORII': 'GATE',
      'CHOR_SIPAHI': 'RAJA_MANTRI',
      'RAJA': 'RAJA_MANTRI',
      'MANTRI': 'RAJA_MANTRI',
      'ANTAKSHARI': 'BOLLYWOOD',
      'FILMI': 'BOLLYWOOD',
      'HOUSIE': 'TAMBOLA',
      'TAMBOLA': 'TAMBOLA',
    };
    const resolvedHash = aliasMap[hash] || hash;
    const validViews = ['GATE', 'HOME', 'HERO', 'ROOMS', 'MEMORIES', 'SHOWS', 'FRIENDS', 'PROFILE', 'TV_MODE', 'GAME', 'LOBBY', 'YEARBOOK', 'STORE', 'BOTTLE', 'ARCADE', 'NHIE', 'MOST_LIKELY_TO', 'SOLO', 'COUPLE', 'GLADE', 'RAJA_MANTRI', 'BOLLYWOOD', 'TAMBOLA'];
    
    // Check if the current page load is a browser reload/refresh
    const isReload = (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function')
      ? performance.getEntriesByType('navigation')[0]?.type === 'reload'
      : (typeof performance !== 'undefined' && performance.navigation)
        ? performance.navigation.type === 1
        : false;

    // Check if user has an active session in this browser tab
    let hasSession = false;
    try {
      hasSession = !!sessionStorage.getItem('bondfire_session_started');
    } catch (_) {}

    // Check if this is the initial boot of opening the website
    const isBoot = this.isInitialBoot;
    this.isInitialBoot = false;

    let targetView;
    if (isBoot) {
      try {
        sessionStorage.setItem('bondfire_session_started', 'true');
      } catch (_) {}

      // Case A: Opening via room invite link (?join=CODE or ?room=CODE)
      if (roomCodeFromUrl && roomCodeFromUrl.length >= 3) {
        targetView = resolvedHash === 'COUPLE' ? 'COUPLE' : 'LOBBY';
      }
      // Case B: Explicitly requested GATE view (e.g. #/GATE)
      else if (resolvedHash === 'GATE') {
        targetView = 'GATE';
        if (typeof window !== 'undefined' && window.location.hash !== '#/GATE') {
          try { window.history.replaceState(null, '', '#/GATE'); } catch (_) {}
        }
      }
      // Case C: Page Refresh / Reload while browsing
      // If user refreshed the browser and has an active view, KEEP them on that view!
      else if ((isReload || hasSession) && rawHash && validViews.includes(resolvedHash)) {
        targetView = resolvedHash;
      }
      // Case D: Opening the website from link / clean visit for the first time
      else if (!isReload && (!hasSession || !rawHash || hash === '' || hash === '#')) {
        targetView = 'GATE';
        if (typeof window !== 'undefined' && window.location.hash !== '#/GATE') {
          try {
            window.history.replaceState(null, '', '#/GATE');
          } catch (_) {}
        }
      }
      // Case E: Direct link with a specific valid view
      else if (validViews.includes(resolvedHash)) {
        targetView = resolvedHash;
      }
      // Fallback: Default to GATE
      else {
        targetView = 'GATE';
        if (typeof window !== 'undefined' && window.location.hash !== '#/GATE') {
          try {
            window.history.replaceState(null, '', '#/GATE');
          } catch (_) {}
        }
      }
    } else {
      if (resolvedHash === 'GATE') {
        targetView = 'GATE';
      } else if (hash === '' || hash === '#' || !rawHash) {
        targetView = 'HOME';
      } else {
        targetView = validViews.includes(resolvedHash) ? resolvedHash : 'HOME';
      }
    }

    // If an invite code was present, automatically join that room!
    if (roomCodeFromUrl && roomCodeFromUrl.length >= 3) {
      if (resolvedHash === 'COUPLE') {
        targetView = 'COUPLE';
        store.joinRoomWithCode(roomCodeFromUrl, true);
      } else {
        targetView = 'LOBBY';
        store.joinRoomWithCode(roomCodeFromUrl, false);
      }
    }

    if (store.getState().currentView !== targetView) {
      store.setState({ currentView: targetView });
    } else {
      this.render(store.getState());
    }
  }

  render(state) {
    try {
      // 1. Render Global Header
      if (this.headerMount && state.currentView !== 'TV_MODE' && state.currentView !== 'GAME' && state.currentView !== 'GATE') {
        this.headerMount.innerHTML = renderHeader();
        bindHeaderEvents();
      } else if (this.headerMount) {
        this.headerMount.innerHTML = '';
      }

      // 2. Render Active View
      if (!this.appMount) return;

      // Apply global dark mode class for the new aesthetic
      document.body.classList.add('dark');

      switch (state.currentView) {
      case 'ARCADE':
      case 'GLADE':
      case 'PIXEL_GLADE':
        this.appMount.innerHTML = renderArcadeScreen();
        bindArcadeEvents();
        break;

      case 'BOTTLE':
        this.appMount.innerHTML = renderSpinBottleGame();
        bindSpinBottleEvents();
        break;

      case 'NHIE':
        this.appMount.innerHTML = renderNeverHaveIEverGame();
        bindNeverHaveIEverEvents();
        break;

      case 'MOST_LIKELY_TO':
        this.appMount.innerHTML = renderMostLikelyToGame();
        bindMostLikelyToEvents();
        break;

      case 'RAJA_MANTRI':
      case 'CHOR_SIPAHI':
        this.appMount.innerHTML = renderRajaMantriGame();
        bindRajaMantriEvents();
        break;

      case 'BOLLYWOOD':
      case 'ANTAKSHARI':
        this.appMount.innerHTML = renderBollywoodGame();
        bindBollywoodEvents();
        break;

      case 'TAMBOLA':
      case 'HOUSIE':
        this.appMount.innerHTML = renderTambolaGame();
        bindTambolaEvents();
        break;

      case 'ROOMS':
        this.appMount.innerHTML = renderRoomsHub();
        bindRoomsHubEvents();
        break;

      case 'LOBBY':
        this.appMount.innerHTML = renderLobby();
        bindLobbyEvents();
        break;

      case 'GAME':
        this.appMount.innerHTML = renderGameScreen();
        bindGameEvents();
        break;

      case 'MEMORIES':
      case 'VAULT':
        this.appMount.innerHTML = renderVaultScreen();
        bindVaultEvents();
        break;

      case 'YEARBOOK':
      case 'PHOTOBOOK':
        this.appMount.innerHTML = renderYearbookScreen();
        bindYearbookEvents();
        break;

      case 'SHOWS':
        this.appMount.innerHTML = renderShowsScreen();
        bindShowsEvents();
        break;

      case 'FRIENDS':
        this.appMount.innerHTML = renderFriendsScreen();
        bindFriendsEvents();
        break;

      case 'STORE':
      case 'EMPORIUM':
        this.appMount.innerHTML = renderEmporiumScreen();
        bindEmporiumEvents();
        break;

      case 'PROFILE':
        this.appMount.innerHTML = renderProfileScreen();
        bindProfileEvents();
        break;

      case 'TV_MODE':
        this.appMount.innerHTML = renderTvModeScreen();
        bindTvModeEvents();
        if (this.footerMount) this.footerMount.innerHTML = '';
        return; // TV Mode manages its own full-viewport layout

      case 'SOLO':
        this.appMount.innerHTML = renderSoloScreen();
        bindSoloEvents();
        break;

      case 'COUPLE':
      case 'US':
        this.appMount.innerHTML = renderCoupleScreen();
        bindCoupleEvents();
        break;

      case 'GATE':
        this.appMount.innerHTML = renderGateScreen();
        bindGateScreenEvents();
        if (this.footerMount) this.footerMount.innerHTML = '';
        return; // Fullscreen gate experience

      case 'HERO':
      case 'HOME':
      default:
        this.appMount.innerHTML = renderHero();
        bindHeroEvents();
        break;
    }

      // 3. Render Global Footer
      if (this.footerMount && state.currentView !== 'GATE') {
        this.footerMount.innerHTML = renderFooter();
        bindFooterEvents();
      } else if (this.footerMount) {
        this.footerMount.innerHTML = '';
      }

      // Scroll to top on view transition
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('⚠️ Critical view render caught error:', err);
      if (this.appMount) {
        this.appMount.innerHTML = renderHero();
        try { bindHeroEvents(); } catch {}
      }
    }
  }
}

// Bootstrap Application when DOM is ready
function bootstrapApp() {
  try {
    const app = new BondfireApp();
    app.init();
  } catch (err) {
    console.error('Bondfire initialization error:', err);
    const mount = document.getElementById('app-mount');
    if (mount && mount.innerHTML.trim() === '') {
      mount.innerHTML = renderHero();
      try { bindHeroEvents(); } catch {}
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
