// ==============================================================================
// POD & ROOM SERVICE
// Manages Room Codes, Pod Creation, Memberships, and Empty Room Auto-Deletion (2 Mins)
// ==============================================================================

import { Pod, PodMemberSummary, PodType } from '../types';
import { GameEngine } from './gameEngine';

export class PodService {
  private static podsByCode = new Map<string, Pod>();
  private static emptyRoomTimers = new Map<string, NodeJS.Timeout>();
  private static emptyTimeoutMs = 2 * 60 * 1000; // 2 minutes (120,000 ms)

  /**
   * Configures empty room timeout in milliseconds (default: 120,000 ms / 2 minutes)
   */
  public static setEmptyRoomTimeout(ms: number): void {
    this.emptyTimeoutMs = ms;
  }

  /**
   * Retrieves current empty room timeout in milliseconds
   */
  public static getEmptyRoomTimeout(): number {
    return this.emptyTimeoutMs;
  }

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
    const members: PodMemberSummary[] = hostUserId ? [
      {
        userId: hostUserId,
        displayName: hostName,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'HOST',
        scoreAllTime: 0,
        isReady: true,
      },
    ] : [];

    const newPod: Pod = {
      id: `pod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      type,
      roomCode,
      isPro: false,
      createdBy: hostUserId,
      activeMembers: members,
      createdAt: new Date(),
      emptySince: members.length === 0 ? new Date() : null,
      scheduledDeletionAt: members.length === 0 ? new Date(Date.now() + this.emptyTimeoutMs) : null,
    };

    this.podsByCode.set(roomCode, newPod);

    // If created with 0 members, start the 2-minute empty room countdown
    if (members.length === 0) {
      this.scheduleEmptyRoomDeletion(roomCode);
    }

    return newPod;
  }

  /**
   * Resolves a room by its 4-letter code
   */
  public static getPodByRoomCode(roomCode: string): Pod | null {
    if (!roomCode) return null;
    return this.podsByCode.get(roomCode.trim().toUpperCase()) || null;
  }

  /**
   * Retrieves all currently active pods
   */
  public static getAllPods(): Pod[] {
    return Array.from(this.podsByCode.values());
  }

  /**
   * Adds a player to a room lobby (cancels empty deletion countdown)
   */
  public static joinPod(roomCode: string, userId: string, displayName: string, avatarUrl?: string): Pod | null {
    const pod = this.getPodByRoomCode(roomCode);
    if (!pod) return null;

    // A member is present: cancel pending empty deletion countdown
    this.cancelEmptyRoomDeletion(pod.roomCode);
    pod.emptySince = null;
    pod.scheduledDeletionAt = null;

    if (!pod.activeMembers) {
      pod.activeMembers = [];
    }

    const existingMember = pod.activeMembers.find((m) => m.userId === userId);
    if (!existingMember) {
      pod.activeMembers.push({
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
   * Removes a member from a room lobby.
   * If 0 members remain, schedules auto-deletion after 2 minutes.
   */
  public static leavePod(roomCode: string, userId: string): Pod | null {
    const pod = this.getPodByRoomCode(roomCode);
    if (!pod) return null;

    if (pod.activeMembers) {
      pod.activeMembers = pod.activeMembers.filter((m) => m.userId !== userId);
      if (pod.activeMembers.length === 0) {
        pod.emptySince = new Date();
        pod.scheduledDeletionAt = new Date(Date.now() + this.emptyTimeoutMs);
        this.scheduleEmptyRoomDeletion(pod.roomCode);
      }
    }

    return pod;
  }

  /**
   * Schedules a room deletion timer if no members are present
   */
  public static scheduleEmptyRoomDeletion(roomCode: string, customMs?: number): void {
    const code = roomCode.trim().toUpperCase();
    this.cancelEmptyRoomDeletion(code);

    const ms = typeof customMs === 'number' ? customMs : this.emptyTimeoutMs;
    const pod = this.getPodByRoomCode(code);
    if (pod) {
      pod.emptySince = pod.emptySince || new Date();
      pod.scheduledDeletionAt = new Date(Date.now() + ms);
    }

    const timer = setTimeout(() => {
      this.checkAndDeleteIfEmpty(code);
    }, ms);

    if (timer && timer.unref) {
      timer.unref();
    }

    this.emptyRoomTimers.set(code, timer);
  }

  /**
   * Cancels scheduled empty room deletion when a member joins
   */
  public static cancelEmptyRoomDeletion(roomCode: string): void {
    const code = roomCode.trim().toUpperCase();
    const timer = this.emptyRoomTimers.get(code);
    if (timer) {
      clearTimeout(timer);
      this.emptyRoomTimers.delete(code);
    }
  }

  /**
   * Verifies if room is still empty and deletes it if 0 members are present
   */
  public static checkAndDeleteIfEmpty(roomCode: string): boolean {
    const code = roomCode.trim().toUpperCase();
    const pod = this.getPodByRoomCode(code);
    if (!pod) return false;

    if (!pod.activeMembers || pod.activeMembers.length === 0) {
      console.log(`🧹 PodService: Room #${code} deleted: No members present after 2 minutes.`);
      this.deletePod(code);
      return true;
    }

    // Members joined in the meantime
    this.cancelEmptyRoomDeletion(code);
    pod.emptySince = null;
    pod.scheduledDeletionAt = null;
    return false;
  }

  /**
   * Deletes a pod and cleans up any related active game session
   */
  public static deletePod(roomCode: string): boolean {
    const code = roomCode.trim().toUpperCase();
    this.cancelEmptyRoomDeletion(code);
    const pod = this.podsByCode.get(code);
    if (!pod) return false;

    this.podsByCode.delete(code);

    try {
      GameEngine.deleteSessionByPodId(pod.id);
    } catch (_) {}

    return true;
  }

  /**
   * Checks if an empty deletion countdown is currently active for a room
   */
  public static isDeletionScheduled(roomCode: string): boolean {
    const code = roomCode.trim().toUpperCase();
    return this.emptyRoomTimers.has(code);
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

  /**
   * Clears all pods and active timers (for test isolation)
   */
  public static clearAllPods(): void {
    for (const timer of this.emptyRoomTimers.values()) {
      clearTimeout(timer);
    }
    this.emptyRoomTimers.clear();
    this.podsByCode.clear();
  }
}
