// ==============================================================================
// MASTER APPLICATION CONTROLLER & ROUTER
// Orchestrates views, state synchronization, and audio/canvas rendering
// ==============================================================================

import { store } from './state/store.js';
import { FluidCanvas } from './visuals/fluidCanvas.js';
import { GoogleAuthService } from './services/googleAuth.js';
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

    // 5. Bind Store updates to re-render
    store.subscribe((state) => {
      this.render(state);
    });

    // 6. Hash Routing Handling
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // 7. Initial Route Resolution
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#/', '').toUpperCase();
    const aliasMap = {
      'VAULT': 'MEMORIES',
      'PHOTOBOOK': 'YEARBOOK',
      'EMPORIUM': 'STORE',
      'US': 'COUPLE',
      'COUPLES': 'COUPLE',
      'TIME_CAPSULE': 'SOLO',
      'SOLO': 'SOLO',
      'PODS': 'ROOMS'
    };
    const resolvedHash = aliasMap[hash] || hash;
    const validViews = ['HOME', 'ROOMS', 'MEMORIES', 'SHOWS', 'FRIENDS', 'PROFILE', 'TV_MODE', 'GAME', 'LOBBY', 'YEARBOOK', 'STORE', 'BOTTLE', 'ARCADE', 'NHIE', 'MOST_LIKELY_TO', 'SOLO', 'COUPLE'];
    const targetView = validViews.includes(resolvedHash) ? resolvedHash : 'HOME';

    if (store.getState().currentView !== targetView) {
      store.setState({ currentView: targetView });
    } else {
      this.render(store.getState());
    }
  }

  render(state) {
    // 1. Render Global Header
    if (this.headerMount && state.currentView !== 'TV_MODE' && state.currentView !== 'GAME') {
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

      case 'ROOMS':
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

      case 'HOME':
      default:
        this.appMount.innerHTML = renderHero();
        bindHeroEvents();
        break;
    }

    // 3. Render Global Footer
    if (this.footerMount) {
      this.footerMount.innerHTML = renderFooter();
      bindFooterEvents();
    }

    // Scroll to top on view transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new BondfireApp();
  app.init();
});
