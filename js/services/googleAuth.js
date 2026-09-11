// ==============================================================================
// GOOGLE IDENTITY SERVICES (GSI) OAUTH 2.0 INTEGRATION
// ==============================================================================

import { CONFIG } from '../config.js';
import { store } from '../state/store.js';

export class GoogleAuthService {
  static init() {
    // Check if Google GSI SDK is loaded
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false, // Prevents auto-locking into a single default account
        cancel_on_tap_outside: true,
      });
    }
  }

  static renderSignInButton(elementId) {
    if (typeof window !== 'undefined' && window.google && window.google.accounts && document.getElementById(elementId)) {
      try {
        const container = document.getElementById(elementId);
        // Calculate responsive button width: 220px on small mobile up to 360px on tablet/desktop
        const screenWidth = window.innerWidth || 360;
        const targetWidth = Math.min(Math.max(screenWidth - 72, 220), 360);

        window.google.accounts.id.renderButton(
          container,
          {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'pill',
            width: targetWidth,
            logo_alignment: 'left',
          }
        );
      } catch (e) {
        console.warn('Google renderButton notice:', e);
      }
    }
  }

  static promptSignIn(customEmail = null) {
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap suppressed or dismissed; use standard button or email form.');
        }
      });
    } else {
      // Simulate Google Sign-In for development / offline
      console.log('Simulating Google Sign-In flow...');
      const email = customEmail || prompt('Enter test Google email (e.g. player2@gmail.com):', 'friend@gmail.com') || 'pioneer@bondfire.app';
      const fallbackName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
      const mockGoogleUser = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        displayName: formattedName,
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
        isHost: true,
        isLoggedIn: true,
      };
      store.setState({ currentUser: mockGoogleUser });
      return mockGoogleUser;
    }
  }

  static handleCredentialResponse(response) {
    try {
      // Decode JWT token payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const profile = JSON.parse(jsonPayload);
      const existingUser = store.getState().currentUser || {};
      const updatedUser = {
        ...existingUser,
        id: profile.sub,
        displayName: profile.name,
        email: profile.email,
        avatarUrl: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name)}`,
        isHost: true,
        isLoggedIn: true,
      };

      // 1. Update store state (triggers header and profile view re-render)
      store.setState({
        currentUser: updatedUser,
      });

      // 2. Automatically close the modal
      const modalMount = document.getElementById('modal-mount');
      if (modalMount) {
        modalMount.innerHTML = '';
      }

      console.log('✅ Google Authentication successful for:', profile.email);
    } catch (err) {
      console.error('Error decoding Google OAuth credential:', err);
    }
  }
}
