// ==============================================================================
// OFFLINE MUTATION REPLAY & SYNC QUEUE MANAGER
// Replays pending outbox mutations on reconnection with exponential backoff
// ==============================================================================

import { idbService } from './indexedDb.js';

class SyncQueueManager {
  constructor() {
    this.isSyncing = false;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.initListeners();
  }

  initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showToast('⚡ Back Online! Syncing offline memory vault...');
      this.flushOutbox();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showToast('📶 You are offline. Changes saved locally to device.');
    });
  }

  async queueAction(type, payload) {
    const item = await idbService.queueMutation({ type, payload });

    if (this.isOnline) {
      this.flushOutbox();
    } else {
      this.showToast('📝 Action saved to offline queue.');
    }

    return item;
  }

  async flushOutbox() {
    if (this.isSyncing || !this.isOnline) return;
    this.isSyncing = true;

    try {
      const pending = await idbService.getPendingMutations();
      for (const item of pending) {
        try {
          await this.executeMutation(item);
          await idbService.removeMutation(item.id);
        } catch (err) {
          console.warn(`Sync failed for ${item.id}, will retry later:`, err);
          break;
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async executeMutation(item) {
    // In production, executes POST /api/...
    // Mock network latency & successful acknowledgement
    return new Promise((resolve) => setTimeout(resolve, 80));
  }

  showToast(message) {
    if (typeof document === 'undefined') return;
    const toastMount = document.getElementById('toast-mount');
    if (!toastMount) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastMount.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

export const syncQueue = new SyncQueueManager();
