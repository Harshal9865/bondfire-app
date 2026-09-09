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
});
