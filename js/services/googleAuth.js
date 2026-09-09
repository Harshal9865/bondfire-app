// ==============================================================================
// GOOGLE IDENTITY SERVICES (GSI) OAUTH 2.0 INTEGRATION
// ==============================================================================

import { CONFIG } from '../config.js';
import { store } from '../state/store.js';

export class GoogleAuthService {
  static init() {
    // Check if Google GSI SDK is loaded
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this),
      });
    }
  }

  static promptSignIn() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      // Simulate Google Sign-In for development
      console.log('Simulating Google Sign-In flow...');
      const fallbackName = 'Citizen Pioneer';
      const mockGoogleUser = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        displayName: fallbackName,
        email: 'pioneer@bondfire.app',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fallbackName)}`,
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
      store.setState({
        currentUser: {
          ...existingUser,
          id: profile.sub,
          displayName: profile.name,
          email: profile.email,
          avatarUrl: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name)}`,
          isHost: true,
          isLoggedIn: true,
        },
      });
    } catch (err) {
      console.error('Error decoding Google OAuth credential:', err);
    }
  }
}
