// ==============================================================================
// BONDFIRE 2.0 HUMOR CONSENT & SAFETY ENGINE (backend/src/services/humorEngine.ts)
// Zero-Tolerance Harassment Protection + Private Panic Button
// ==============================================================================

import { HumorTone, PlayerHumorFlag } from '../types/entertainment';

export class HumorEngineService {
  private static flags: PlayerHumorFlag[] = [];

  // Safe fallback prompts for immediate card swap
  private static readonly SAFE_FALLBACKS: Record<HumorTone, string[]> = {
    FAMILY_SAFE: [
      'Who in the family makes the most unforgettable festival snacks?',
      'Which family vacation had the most unexpected twist?',
      'Who is most likely to win an Antakshari singing round right now?',
    ],
    LIGHT_TEASING: [
      'Who takes 45 minutes to get ready and then wears a simple hoodie?',
      'Who has the most unread notifications on their phone right now?',
      'Who claims they "don’t watch reality TV" but knows all the tea?',
    ],
    FRIENDLY_ROAST: [
      'Who spends ₹500 on iced coffee after crying about their bank account?',
      'Who is the biggest backseat driver even when sitting in an auto?',
      'Who sends voice notes that should have been an official podcast episode?',
    ],
    SAVAGE_ROAST: [
      'Who is most likely to text their ex at 2:00 AM on a Tuesday?',
      'Whose search history would cause the most panic if projected on the TV right now?',
      'Who has ghosted someone for the most absurdly petty reason?',
    ],
    ROMANTIC: [
      'What was the exact moment you realized you had feelings for your partner?',
      'What is one song that instantly transports you back to your first date?',
      'Who is better at remembering important anniversaries and dates?',
    ],
    EMOTIONAL: [
      'What is one moment with this group that you will still remember at age 80?',
      'Who has secretly been the biggest pillar of support for everyone lately?',
      'What is one inside joke that nobody outside this room would ever understand?',
    ],
  };

  /**
   * Records a private player panic / flag trigger
   * Anonymously logs the event and returns a substitute prompt within 200ms
   */
  public static flagPrompt(
    roomSessionId: string,
    playerUserId: string,
    flagType: 'TOO_PERSONAL' | 'NOT_FUNNY' | 'REMOVE_PROMPT' | 'REPORT',
    promptId: string,
    tone: HumorTone = 'FRIENDLY_ROAST'
  ): { success: boolean; substitutePrompt: string } {
    const flag: PlayerHumorFlag = {
      id: `flag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      roomSessionId,
      playerUserId,
      flagType,
      promptId,
      createdAt: new Date(),
    };

    this.flags.push(flag);

    // Pick a safe substitute from the fallback bank
    const fallbacks = this.SAFE_FALLBACKS[tone] || this.SAFE_FALLBACKS.FRIENDLY_ROAST;
    const substitutePrompt = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    return {
      success: true,
      substitutePrompt,
    };
  }

  /**
   * Returns list of flags for audit / room host moderation review
   */
  public static getFlagsForSession(roomSessionId: string): PlayerHumorFlag[] {
    return this.flags.filter((f) => f.roomSessionId === roomSessionId);
  }
}
