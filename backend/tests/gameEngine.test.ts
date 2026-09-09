// ==============================================================================
// GAME ENGINE UNIT TEST SUITE
// Verifies round initialization, speed scoring decay, and anti-duplicate logic
// ==============================================================================

import { describe, it, expect } from 'vitest';
import { GameEngine } from '../src/services/gameEngine';

describe('GameEngine Service', () => {
  it('should initialize a game session with rounds', () => {
    const session = GameEngine.startSession('pod_100', 'user_host_1');
    expect(session).toBeDefined();
    expect(session.id).toMatch(/^game_/);
    expect(session.status).toBe('IN_PROGRESS');
    expect(session.currentRoundIndex).toBe(1);

    const activeRound = GameEngine.getActiveRound(session.id);
    expect(activeRound).toBeDefined();
    expect(activeRound?.roundNumber).toBe(1);
    expect(activeRound?.options).toHaveLength(4);
  });

  it('should compute speed-decayed points for correct answers', () => {
    const session = GameEngine.startSession('pod_101', 'user_host_2', [
      {
        prompt: 'Who sent the 2 AM samosa message?',
        answer: 'Liam',
        options: ['Maya', 'Liam', 'Sarah', 'Alex'],
      },
    ]);

    const activeRound = GameEngine.getActiveRound(session.id)!;

    // Fast response (500ms) -> Higher score
    const fastVote = GameEngine.castVote(activeRound.id, 'user_fast', 'Liam', 500);
    expect(fastVote.isCorrect).toBe(true);
    expect(fastVote.points).toBeGreaterThan(950);

    // Slower response (10,000ms) -> Decayed score
    const slowVote = GameEngine.castVote(activeRound.id, 'user_slow', 'Liam', 10000);
    expect(slowVote.isCorrect).toBe(true);
    expect(slowVote.points).toBeLessThan(fastVote.points);
  });

  it('should award 0 points for incorrect answers', () => {
    const session = GameEngine.startSession('pod_102', 'user_host_3', [
      {
        prompt: 'Who was lost in Anjuna forest?',
        answer: 'Alex',
        options: ['Rohan', 'Alex', 'Liam', 'Arjun'],
      },
    ]);

    const activeRound = GameEngine.getActiveRound(session.id)!;
    const wrongVote = GameEngine.castVote(activeRound.id, 'user_wrong', 'Rohan', 1000);
    expect(wrongVote.isCorrect).toBe(false);
    expect(wrongVote.points).toBe(0);
  });

  it('should prevent duplicate votes from the same player in a single round', () => {
    const session = GameEngine.startSession('pod_103', 'user_host_4', [
      {
        prompt: 'Test question',
        answer: 'Sarah',
        options: ['Sarah', 'Maya', 'Rohan', 'Liam'],
      },
    ]);

    const activeRound = GameEngine.getActiveRound(session.id)!;
    const firstVote = GameEngine.castVote(activeRound.id, 'user_repeat', 'Sarah', 1200);
    expect(firstVote.isCorrect).toBe(true);

    const secondVote = GameEngine.castVote(activeRound.id, 'user_repeat', 'Sarah', 1500);
    expect(secondVote.points).toBe(0);
  });

  it('should advance to next round and terminate on completion', () => {
    const session = GameEngine.startSession('pod_104', 'user_host_5', [
      { prompt: 'Q1', answer: 'A', options: ['A', 'B', 'C', 'D'] },
      { prompt: 'Q2', answer: 'B', options: ['A', 'B', 'C', 'D'] },
    ]);

    expect(session.currentRoundIndex).toBe(1);

    // Advance to round 2
    const step1 = GameEngine.nextRound(session.id);
    expect(step1.isGameOver).toBe(false);
    expect(step1.session?.currentRoundIndex).toBe(2);

    // Advance beyond round 2 -> Game over
    const step2 = GameEngine.nextRound(session.id);
    expect(step2.isGameOver).toBe(true);
    expect(step2.session?.status).toBe('COMPLETED');
  });
});
