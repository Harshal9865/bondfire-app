// ==============================================================================
// CLIENT CONFIGURATION
// ==============================================================================

export const CONFIG = {
  APP_NAME: 'Bondfire',
  TAGLINE: 'Party games made from your own memories.',
  API_BASE_URL: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api' : '/api',
  WS_BASE_URL: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'ws://localhost:4000/ws' : (typeof window !== 'undefined' ? `wss://${window.location.host}/ws` : 'ws://localhost:4000/ws'),
  GOOGLE_CLIENT_ID: '351619761732-7mepeos0hjhnmngidle1mch3ttu3m8bb.apps.googleusercontent.com',
  DEFAULT_ROOM_CODE: 'FIRE',
  STORAGE_KEY_SESSION: 'BONDFIRE_SESSION_V1',
  STORAGE_KEY_SETTINGS: 'BONDFIRE_SETTINGS_V1',
};
