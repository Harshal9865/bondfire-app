// ==============================================================================
// GAME ENGINE SERVICE
// State Machine, Round Timers, Vote Scoring & Reveal Logic
// ==============================================================================

import { GameSession, GameRound, PlayerVote } from '../types';

export class GameEngine {
  private static sessions = new Map<string, GameSession>();
  private static rounds = new Map<string, GameRound[]>();
  private static votes = new Map<string, PlayerVote[]>(); // Keyed by roundId

  /**
   * Initializes a game session with pre-generated memory cards
   */
  public static startSession(podId: string, hostUserId: string, mockCards?: Array<{ prompt: string; answer: string; options: string[] }>): GameSession {
    const sessionId = `game_${Date.now()}`;
    const session: GameSession = {
      id: sessionId,
      podId,
      hostUserId,
      mode: 'WHO_SAID_THIS',
      status: 'IN_PROGRESS',
      totalRounds: mockCards ? mockCards.length : 5,
      currentRoundIndex: 1,
      startedAt: new Date(),
    };

    this.sessions.set(sessionId, session);

    // Initialize rounds
    const defaultDeck = mockCards || [
      {
        prompt: 'Who sent this message at 2:43 AM without any context: "If I eat one more samosa I am legally changing my name to potato and moving into the fridge"?',
        answer: 'Liam',
        options: ['Maya', 'Liam', 'Sarah', 'Alex'],
      },
      {
        prompt: 'Who claimed the Google Maps navigation lady was actively crying in the car?',
        answer: 'Alex',
        options: ['Rohan', 'Alex', 'Liam', 'Arjun'],
      },
      {
        prompt: 'Who spent 45 minutes trying to find their sunglasses while wearing them on their head?',
        answer: 'Sarah',
        options: ['Sarah', 'Maya', 'Rohan', 'Liam'],
      },
    ];

    const sessionRounds: GameRound[] = defaultDeck.map((card, idx) => ({
      id: `round_${sessionId}_${idx + 1}`,
      gameSessionId: sessionId,
      roundNumber: idx + 1,
      questionPrompt: card.prompt,
      correctAnswer: card.answer,
      options: card.options,
      timeLimitSeconds: 20,
      startedAt: idx === 0 ? new Date() : undefined,
    }));

    this.rounds.set(sessionId, sessionRounds);
    return session;
  }

  /**
   * Retrieves active round for a game session
   */
  public static getActiveRound(sessionId: string): GameRound | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const rounds = this.rounds.get(sessionId);
    if (!rounds) return null;

    return rounds.find((r) => r.roundNumber === session.currentRoundIndex) || null;
  }

  /**
   * Records a player's vote and computes points using speed multiplier
   */
  public static castVote(roundId: string, userId: string, selectedOption: string, responseTimeMs: number): { isCorrect: boolean; points: number } {
    const roundVotes = this.votes.get(roundId) || [];
    const alreadyVoted = roundVotes.some((v) => v.userId === userId);
    if (alreadyVoted) {
      return { isCorrect: false, points: 0 };
    }

    // Find round to check answer
    let targetRound: GameRound | undefined;
    for (const rList of this.rounds.values()) {
      const found = rList.find((r) => r.id === roundId);
      if (found) {
        targetRound = found;
        break;
      }
    }

    if (!targetRound) return { isCorrect: false, points: 0 };

    const isCorrect = targetRound.correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
    // Speed multiplier: max 1000 points, decaying by response time
    const points = isCorrect ? Math.max(100, Math.round(1000 - responseTimeMs / 25)) : 0;

    const vote: PlayerVote = {
      id: `vote_${Date.now()}_${userId}`,
      gameRoundId: roundId,
      userId,
      selectedOption,
      isCorrect,
      pointsAwarded: points,
      responseTimeMs,
      votedAt: new Date(),
    };

    roundVotes.push(vote);
    this.votes.set(roundId, roundVotes);

    return { isCorrect, points };
  }

  /**
   * Advances to next round
   */
  public static nextRound(sessionId: string): { session: GameSession | null; isGameOver: boolean } {
    const session = this.sessions.get(sessionId);
    if (!session) return { session: null, isGameOver: true };

    if (session.currentRoundIndex >= session.totalRounds) {
      session.status = 'COMPLETED';
      session.completedAt = new Date();
      return { session, isGameOver: true };
    }

    session.currentRoundIndex += 1;
    session.status = 'IN_PROGRESS';

    const rounds = this.rounds.get(sessionId);
    const nextRound = rounds?.find((r) => r.roundNumber === session.currentRoundIndex);
    if (nextRound) {
      nextRound.startedAt = new Date();
    }

    return { session, isGameOver: false };
  }

  /**
   * Retrieves summary leaderboard for a session
   */
  public static getSessionScores(sessionId: string): Array<{ userId: string; score: number; correctCount: number }> {
    const rounds = this.rounds.get(sessionId) || [];
    const scoreMap = new Map<string, { score: number; correctCount: number }>();

    for (const round of rounds) {
      const roundVotes = this.votes.get(round.id) || [];
      for (const v of roundVotes) {
        const curr = scoreMap.get(v.userId) || { score: 0, correctCount: 0 };
        curr.score += v.pointsAwarded;
        if (v.isCorrect) curr.correctCount += 1;
        scoreMap.set(v.userId, curr);
      }
    }

    return Array.from(scoreMap.entries()).map(([userId, stats]) => ({
      userId,
      score: stats.score,
      correctCount: stats.correctCount,
    }));
  }
}
