// ==============================================================================
// API SERVICE (REST CLIENT WITH LOCAL FALLBACK)
// ==============================================================================

import { CONFIG } from '../config.js';
import { getCloudPod, createCloudPod } from './supabaseClient.js';

export class ApiService {
  /**
   * Fetches room by room code (Cloud Supabase first, then local fallback)
   */
  static async getRoom(code) {
    // 1. Try Supabase Cloud Pod
    try {
      const cloudPod = await getCloudPod(code);
      if (cloudPod) {
        return {
          pod: {
            id: cloudPod.id,
            name: cloudPod.name,
            roomCode: cloudPod.room_code,
            isPro: cloudPod.is_pro || false,
            type: cloudPod.type || 'SQUAD',
          },
        };
      }
    } catch (err) {
      console.warn('Supabase pod query error, checking local fallback:', err);
    }

    // 2. Try REST backend if reachable
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/pods/${code}`);
      if (res.ok) return await res.json();
    } catch (err) {
      // Local fallback
    }

    return {
      pod: {
        name: 'The Squad Room',
        roomCode: code.toUpperCase(),
        isPro: false,
        type: 'SQUAD',
      },
    };
  }

  /**
   * Creates a new Pod (Saved to Supabase Cloud)
   */
  static async createPod(name, type, hostName) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let roomCode = '';
    for (let i = 0; i < 4; i++) roomCode += chars.charAt(Math.floor(Math.random() * chars.length));

    // 1. Try saving to Supabase Cloud
    try {
      const savedCloud = await createCloudPod({
        name,
        type: type || 'SQUAD',
        roomCode,
      });

      if (savedCloud) {
        return {
          pod: {
            id: savedCloud.id,
            name: savedCloud.name,
            type: savedCloud.type,
            roomCode: savedCloud.room_code,
            isPro: savedCloud.is_pro || false,
          },
          hostUserId: `usr_${Date.now()}`,
        };
      }
    } catch (err) {
      console.warn('Could not save to Supabase, falling back to local room:', err);
    }

    // 2. Local fallback room
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
