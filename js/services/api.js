// ==============================================================================
// API SERVICE (REST CLIENT WITH LOCAL FALLBACK)
// ==============================================================================

import { CONFIG } from '../config.js';

export class ApiService {
  /**
   * Fetches room by room code
   */
  static async getRoom(code) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/pods/${code}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Backend offline, using client-side mock for room:', code);
      return {
        pod: {
          name: 'The Goa Trip Crew 🏖️',
          roomCode: code.toUpperCase(),
          isPro: true,
          type: 'SQUAD',
        },
      };
    }
  }

  /**
   * Creates a new Pod
   */
  static async createPod(name, type, hostName) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/pods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, hostName }),
      });
      if (!res.ok) throw new Error('Creation failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend offline, generating local room...');
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let roomCode = '';
      for (let i = 0; i < 4; i++) roomCode += chars.charAt(Math.floor(Math.random() * chars.length));

      return {
        pod: {
          id: `pod_${Date.now()}`,
          name,
          type,
          roomCode,
          isPro: false,
        },
        hostUserId: `usr_${Date.now()}`,
      };
    }
  }
}
