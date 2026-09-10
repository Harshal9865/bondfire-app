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
import { renderCoupleScreen, bindCoupleEvents } from './components/coupleScreen.js';
import { renderSoloScreen, bindSoloEvents } from './components/soloScreen.js';
import { renderVaultScreen, bindVaultEvents } from './components/vaultScreen.js';
import { renderYearbookScreen, bindYearbookEvents } from './components/yearbookScreen.js';
import { renderStoreScreen, bindStoreEvents } from './components/storeScreen.js';
import { renderPixelGladeScreen, bindPixelGladeEvents } from './components/pixelGladeScreen.js';
import { renderProfileScreen, bindProfileEvents } from './components/profileScreen.js';
import { renderPricingScreen, bindPricingEvents } from './components/pricingScreen.js';
import { renderFriendsScreen, bindFriendsEvents } from './components/friendsScreen.js';
import { renderTvModeScreen, bindTvModeEvents } from './components/tvModeScreen.js';
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
        .then((reg) => console.log('⚡ Bondfire PWA Service Worker registered:', reg.scope))
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
    const validViews = ['HERO', 'LOBBY', 'GAME', 'COUPLE', 'SOLO', 'VAULT', 'YEARBOOK', 'STORE', 'GLADE', 'PROFILE', 'PRICING', 'FRIENDS', 'TV_MODE'];
    const targetView = validViews.includes(hash) ? hash : 'HERO';

    if (store.getState().currentView !== targetView) {
      store.setState({ currentView: targetView });
    } else {
      this.render(store.getState());
    }
  }

  render(state) {
    // 1. Render Global Header
    if (this.headerMount) {
      this.headerMount.innerHTML = renderHeader();
      bindHeaderEvents();
    }

    // 2. Render Active View
    if (!this.appMount) return;

    switch (state.currentView) {
      case 'LOBBY':
        this.appMount.innerHTML = renderLobby();
        bindLobbyEvents();
        break;

      case 'GAME':
        this.appMount.innerHTML = renderGameScreen();
        bindGameEvents();
        break;

      case 'COUPLE':
        this.appMount.innerHTML = renderCoupleScreen();
        bindCoupleEvents();
        break;

      case 'SOLO':
        this.appMount.innerHTML = renderSoloScreen();
        bindSoloEvents();
        break;

      case 'VAULT':
        this.appMount.innerHTML = renderVaultScreen();
        bindVaultEvents();
        break;

      case 'YEARBOOK':
        this.appMount.innerHTML = renderYearbookScreen();
        bindYearbookEvents();
        break;

      case 'STORE':
        this.appMount.innerHTML = renderStoreScreen();
        bindStoreEvents();
        break;

      case 'GLADE':
        this.appMount.innerHTML = renderPixelGladeScreen();
        bindPixelGladeEvents();
        break;

      case 'PROFILE':
        this.appMount.innerHTML = renderProfileScreen();
        bindProfileEvents();
        break;

      case 'PRICING':
        this.appMount.innerHTML = renderPricingScreen();
        bindPricingEvents();
        break;

      case 'FRIENDS':
        this.appMount.innerHTML = renderFriendsScreen();
        bindFriendsEvents();
        break;

      case 'TV_MODE':
        this.appMount.innerHTML = renderTvModeScreen();
        bindTvModeEvents();
        if (this.headerMount) this.headerMount.innerHTML = '';
        if (this.footerMount) this.footerMount.innerHTML = '';
        return; // TV Mode manages its own full-viewport layout

      case 'HERO':
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
