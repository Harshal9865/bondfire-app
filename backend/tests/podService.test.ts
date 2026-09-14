// ==============================================================================
// POD SERVICE UNIT TEST SUITE
// Verifies room code collision resistance, Pod creation, and member ready toggling
// ==============================================================================

import { describe, it, expect } from 'vitest';
import { PodService } from '../src/services/podService';

describe('PodService', () => {
  it('should generate a 4-letter uppercase code with no ambiguous characters', () => {
    const code = PodService.generateRoomCode();
    expect(code).toHaveLength(4);
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
    // Disallowed ambiguous characters
    expect(code).not.toContain('0');
    expect(code).not.toContain('O');
    expect(code).not.toContain('1');
    expect(code).not.toContain('I');
  });

  it('should create a Pod and assign creator as HOST', () => {
    const pod = PodService.createPod('The Goa Crew', 'SQUAD', 'user_creator_1', 'Maya');
    expect(pod).toBeDefined();
    expect(pod.name).toBe('The Goa Crew');
    expect(pod.roomCode).toHaveLength(4);
    expect(pod.activeMembers).toHaveLength(1);
    expect(pod.activeMembers?.[0].role).toBe('HOST');
    expect(pod.activeMembers?.[0].isReady).toBe(true);
  });

  it('should allow joining an existing room by code', () => {
    const created = PodService.createPod('College Gang', 'SQUAD', 'user_host_1', 'Alex');
    const joined = PodService.joinPod(created.roomCode, 'user_guest_1', 'Rohan');

    expect(joined).toBeDefined();
    expect(joined?.activeMembers).toHaveLength(2);
    const guest = joined?.activeMembers?.find((m) => m.userId === 'user_guest_1');
    expect(guest).toBeDefined();
    expect(guest?.displayName).toBe('Rohan');
    expect(guest?.role).toBe('PLAYER');
    expect(guest?.isReady).toBe(false);
  });

  it('should toggle player ready state accurately', () => {
    const pod = PodService.createPod('Work Pod', 'SQUAD', 'user_host_9', 'Sarah');
    PodService.joinPod(pod.roomCode, 'user_guest_9', 'Liam');

    // Toggle Liam to ready
    const readyState1 = PodService.togglePlayerReady(pod.roomCode, 'user_guest_9');
    expect(readyState1).toBe(true);

    // Toggle Liam back to unready
    const readyState2 = PodService.togglePlayerReady(pod.roomCode, 'user_guest_9');
    expect(readyState2).toBe(false);
  });

  it('should schedule empty room deletion when all members leave', () => {
    const pod = PodService.createPod('Squad Pod', 'SQUAD', 'user_host_10', 'Devon');
    expect(PodService.getPodByRoomCode(pod.roomCode)).toBeDefined();

    // Host leaves -> 0 members remain
    PodService.leavePod(pod.roomCode, 'user_host_10');
    expect(pod.activeMembers).toHaveLength(0);
    expect(pod.emptySince).toBeInstanceOf(Date);
    expect(pod.scheduledDeletionAt).toBeInstanceOf(Date);
    expect(PodService.isDeletionScheduled(pod.roomCode)).toBe(true);
  });

  it('should cancel empty room deletion when a member joins before expiration', () => {
    const pod = PodService.createPod('Party Pod', 'SQUAD', 'user_host_11', 'Ananya');
    PodService.leavePod(pod.roomCode, 'user_host_11');
    expect(PodService.isDeletionScheduled(pod.roomCode)).toBe(true);

    // New member joins
    PodService.joinPod(pod.roomCode, 'user_guest_11', 'Sam');
    expect(PodService.isDeletionScheduled(pod.roomCode)).toBe(false);
    expect(pod.emptySince).toBeNull();
    expect(pod.scheduledDeletionAt).toBeNull();
    expect(pod.activeMembers).toHaveLength(1);
  });

  it('should automatically delete active room after timeout if no members are present', async () => {
    // Configure fast 50ms timeout for test execution
    PodService.setEmptyRoomTimeout(50);
    const pod = PodService.createPod('Expiring Pod', 'SQUAD', 'user_host_12', 'Zara');
    const roomCode = pod.roomCode;

    PodService.leavePod(roomCode, 'user_host_12');
    expect(PodService.getPodByRoomCode(roomCode)).toBeDefined();

    // Wait 70ms for the 50ms timeout to fire
    await new Promise((resolve) => setTimeout(resolve, 70));

    // Room must be deleted
    expect(PodService.getPodByRoomCode(roomCode)).toBeNull();

    // Restore default 2-minute timeout
    PodService.setEmptyRoomTimeout(2 * 60 * 1000);
  });
});
