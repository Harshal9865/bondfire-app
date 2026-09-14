// ==============================================================================
// CLIENT CONFIGURATION
// ==============================================================================

export function generateRoomCode() {
  const words = ['NOVA', 'PEAK', 'WAVE', 'CAMP', 'GLOW', 'ZEST', 'EMBER', 'CHILL', 'BEACON', 'FLAME', 'DRIFT', 'LUNA', 'SPARK'];
  return words[Math.floor(Math.random() * words.length)];
}

export const CONFIG = {
  APP_NAME: 'Bondfire',
  TAGLINE: 'Party games made from your own memories.',
  API_BASE_URL: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000/api' : '/api',
  WS_BASE_URL: (typeof window !== 'undefined' && window.BONDFIRE_WS_URL) ? window.BONDFIRE_WS_URL : null,
  GOOGLE_CLIENT_ID: '351619761732-7mepeos0hjhnmngidle1mch3ttu3m8bb.apps.googleusercontent.com',
  SUPABASE_URL: 'https://eiiojowfawxhvtugdplf.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaW9qb3dmYXd4aHZ0dWdkcGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NzAzNzUsImV4cCI6MjEwNDU0NjM3NX0.pxeEaSM-ojvjxBgyXiTcXHDMSuLPK-FOhfVswDsJ5dA',
  GEMINI_API_KEY: (function() {
    if (typeof window !== 'undefined' && window.BONDFIRE_GEMINI_KEY) return window.BONDFIRE_GEMINI_KEY;
    try {
      return atob('QVEuQWI4Uk42SWhEbWNaREpnbUp6c3R1S21kOGRGQnhDMDhpTE1CY2Zza0hDS1ppVEphVWc=');
    } catch {
      return '';
    }
  })(),
  DEFAULT_ROOM_CODE: generateRoomCode(),
  STORAGE_KEY_SESSION: 'BONDFIRE_SESSION_V2',
  STORAGE_KEY_SETTINGS: 'BONDFIRE_SETTINGS_V1',
};
