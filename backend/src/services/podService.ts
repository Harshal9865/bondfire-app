// ==============================================================================
// POD & ROOM SERVICE
// Manages Room Codes, Pod Creation, Memberships, and Verification
// ==============================================================================

import { Pod, PodMemberSummary, PodType } from '../types';

export class PodService {
  private static podsByCode = new Map<string, Pod>();

  /**
   * Generates a collision-resistant 4-letter uppercase room code
   */
  public static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0, O, 1, I)
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new Pod workspace
   */
  public static createPod(name: string, type: PodType, hostUserId: string, hostName: string, avatarUrl?: string): Pod {
    const roomCode = this.generateRoomCode();
    const newPod: Pod = {
      id: `pod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      type,
      roomCode,
      isPro: false,
      createdBy: hostUserId,
      activeMembers: [
        {
          userId: hostUserId,
          displayName: hostName,
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          role: 'HOST',
          scoreAllTime: 0,
          isReady: true,
        },
      ],
      createdAt: new Date(),
    };

    this.podsByCode.set(roomCode, newPod);
    return newPod;
  }

  /**
   * Resolves a room by its 4-letter code
   */
  public static getPodByRoomCode(roomCode: string): Pod | null {
    return this.podsByCode.get(roomCode.trim().toUpperCase()) || null;
  }

  /**
   * Adds a player to a room lobby
   */
  public static joinPod(roomCode: string, userId: string, displayName: string, avatarUrl?: string): Pod | null {
    const pod = this.getPodByRoomCode(roomCode);
    if (!pod) return null;

    const existingMember = pod.activeMembers?.find((m) => m.userId === userId);
    if (!existingMember) {
      pod.activeMembers?.push({
        userId,
        displayName,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'PLAYER',
        scoreAllTime: 0,
        isReady: false,
      });
    }

    return pod;
  }

  /**
   * Toggles ready state for a player
   */
  public static togglePlayerReady(roomCode: string, userId: string): boolean {
    const pod = this.getPodByRoomCode(roomCode);
    if (!pod || !pod.activeMembers) return false;

    const member = pod.activeMembers.find((m) => m.userId === userId);
    if (!member) return false;

    member.isReady = !member.isReady;
    return member.isReady;
  }
}
