// ==============================================================================
// ENTERPRISE OFFLINE-FIRST INDEXEDDB STORAGE ENGINE
// Stores offline media, game sessions, and outbox mutation queue
// Exceeds 5MB localStorage limits with asynchronous binary storage
// ==============================================================================

const DB_NAME = 'bondfire_local_v1';
const DB_VERSION = 1;

class IndexedDbService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    if (typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not supported in this runtime environment.');
      return null;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 1. Vault Media Store (Offline photos, voice recordings, screenshots)
        if (!db.objectStoreNames.contains('vault_media')) {
          const mediaStore = db.createObjectStore('vault_media', { keyPath: 'id' });
          mediaStore.createIndex('by_type', 'type', { unique: false });
          mediaStore.createIndex('by_timestamp', 'timestamp', { unique: false });
        }

        // 2. Offline Sync Outbox (Pending votes, notes, uploaded items)
        if (!db.objectStoreNames.contains('sync_outbox')) {
          const outboxStore = db.createObjectStore('sync_outbox', { keyPath: 'id' });
          outboxStore.createIndex('by_created_at', 'createdAt', { unique: false });
        }

        // 3. Game Sessions Store (Offline cache for active game state)
        if (!db.objectStoreNames.contains('game_sessions')) {
          db.createObjectStore('game_sessions', { keyPath: 'sessionId' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.initPromise;
  }

  // --- VAULT MEDIA OPERATIONS ---

  async saveMedia(item) {
    const db = await this.init();
    if (!db) return item;

    return new Promise((resolve, reject) => {
      const tx = db.transaction('vault_media', 'readwrite');
      const store = tx.objectStore('vault_media');
      const req = store.put({
        ...item,
        updatedAt: Date.now(),
      });

      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async getMedia(id) {
    const db = await this.init();
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const tx = db.transaction('vault_media', 'readonly');
      const store = tx.objectStore('vault_media');
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async listMedia() {
    const db = await this.init();
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction('vault_media', 'readonly');
      const store = tx.objectStore('vault_media');
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- SYNC OUTBOX OPERATIONS ---

  async queueMutation(mutation) {
    const db = await this.init();
    const item = {
      id: `outbox_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
      retries: 0,
      ...mutation,
    };

    if (!db) return item;

    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_outbox', 'readwrite');
      const store = tx.objectStore('sync_outbox');
      const req = store.put(item);

      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async getPendingMutations() {
    const db = await this.init();
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_outbox', 'readonly');
      const store = tx.objectStore('sync_outbox');
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async removeMutation(id) {
    const db = await this.init();
    if (!db) return;

    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_outbox', 'readwrite');
      const store = tx.objectStore('sync_outbox');
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const idbService = new IndexedDbService();
