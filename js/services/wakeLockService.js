// ==============================================================================
// SCREEN WAKE LOCK SERVICE
// Prevents mobile screens from dimming or locking during party games
// Powered by the native Screen Wake Lock Web API with visibilitychange resilience
// ==============================================================================

class WakeLockService {
  constructor() {
    this.sentinel = null;
    this.isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
    this.requested = false;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.requested) {
          this.request();
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.__bondfireWakeLock = this;
    }
  }

  /**
   * Requests a screen wake lock
   * @returns {Promise<boolean>} Whether lock was successfully acquired
   */
  async request() {
    this.requested = true;
    if (!this.isSupported) {
      return false;
    }

    try {
      if (this.sentinel && !this.sentinel.released) {
        return true;
      }
      this.sentinel = await navigator.wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {
        // Lock released (e.g. system power save or tab switch)
        if (this.requested && document.visibilityState === 'visible') {
          this.request().catch(() => {});
        }
      });
      return true;
    } catch (err) {
      console.warn('Wake Lock request warning:', err?.message || err);
      return false;
    }
  }

  /**
   * Releases the active screen wake lock
   */
  async release() {
    this.requested = false;
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch (_) {}
      this.sentinel = null;
    }
  }

  /**
   * Returns current active status of the wake lock
   */
  isActive() {
    return Boolean(this.sentinel && !this.sentinel.released);
  }
}

export const wakeLockService = new WakeLockService();
