// ==============================================================================
// BONDFIRE 2.0 SHOW RUNNER ENGINE (backend/src/services/showRunner.ts)
// Dynamic Hosted Show sequence:
// Welcome -> Warm-up -> Game Rounds -> Reaction Moment -> Memory Moment -> Show Finale
// ==============================================================================

import { RoomOSSession, RoomTemplateType, HumorTone, ShowRunnerStep } from '../types/entertainment';

export class ShowRunnerService {
  private static activeSessions = new Map<string, RoomOSSession>();

  /**
   * Generates a tailor-made show runner sequence for a given room template
   */
  public static generateSteps(
    template: RoomTemplateType,
    humor: HumorTone,
    language: string
  ): ShowRunnerStep[] {
    const isHinglish = language === 'hi-IN' || language === 'hinglish';

    return [
      // 1. WELCOME
      {
        stepIndex: 0,
        stepType: 'WELCOME',
        title: isHinglish ? 'Welcome to the Adda!' : 'Welcome to the Campfire!',
        subtitle: 'Get comfortable. Tonight is about real stories, roasts, and zero filters.',
        timeLimitSeconds: 15,
        soundCue: 'fanfare',
      },

      // 2. WARMUP
      {
        stepIndex: 1,
        stepType: 'WARMUP',
        title: isHinglish ? 'Garama-Garam Warm-Up' : 'Rapid Icebreaker',
        promptQuestion: isHinglish
          ? 'Sach batao: Who in this group currently replied "5 mins" while still in bed?'
          : 'Truth time: Who in this group replied "5 mins away" while still in pajamas?',
        options: ['Defendant 1', 'Defendant 2', 'Defendant 3', 'Everyone is innocent (Lie)'],
        timeLimitSeconds: 20,
        soundCue: 'drumroll',
      },

      // 3. GAME ROUND 1: WHO SAID THIS?
      {
        stepIndex: 2,
        stepType: 'GAME_ROUND',
        title: 'Round 1: Who Said This?',
        gameMode: 'WHO_SAID_THIS',
        subtitle: 'Taken straight out of context from the squad group chat.',
        promptQuestion: '“Maine pehle hi bola tha ki plan cancel hoga, ab sab mujhe biryani khilao.”',
        options: ['Aarav', 'Priya', 'Kabir', 'Rohan'],
        correctOptionIndex: 2,
        timeLimitSeconds: 25,
        soundCue: 'buzzer',
      },

      // 4. GAME ROUND 2: REEL COURTROOM / WATCH-AND-PLAY
      {
        stepIndex: 3,
        stepType: 'GAME_ROUND',
        title: 'Round 2: The Reel Courtroom',
        gameMode: 'REEL_COURT',
        subtitle: 'Review Exhibit A: The Unforgivable Instagram Story.',
        promptQuestion: 'Guilty or Relatable: Sending a 4-minute voice note instead of a single 3-word text?',
        options: [
          'Guilty as charged! (Fine: 1 Samosa)',
          '100% Relatable & Justified',
          'Straight to Jail (No Aux Cord)',
          'Needs 7-Day Probation',
        ],
        timeLimitSeconds: 25,
        soundCue: 'drumroll',
      },

      // 5. GAME ROUND 3: OUR LORE
      {
        stepIndex: 4,
        stepType: 'GAME_ROUND',
        title: 'Round 3: Our Lore (The Official Canon)',
        gameMode: 'OUR_LORE',
        subtitle: 'The squad decides the official historical truth of what happened.',
        promptQuestion: 'What ACTUALLY happened to the Airbnb keys during the Goa trip?',
        options: [
          'Left inside the rented scooter',
          'Dropped in the beach shack sand',
          'Accidentally thrown in the trash bag',
          'Still with Kabir in Mumbai',
        ],
        timeLimitSeconds: 30,
        soundCue: 'fanfare',
      },

      // 6. REACTION MOMENT
      {
        stepIndex: 5,
        stepType: 'REACTION',
        title: 'Reaction Soundboard & Halchal',
        subtitle: '15 seconds to spam live soundboard cues, emoji confetti, and defense pleas!',
        timeLimitSeconds: 15,
        soundCue: 'fanfare',
      },

      // 7. MEMORY MOMENT & FINALE
      {
        stepIndex: 6,
        stepType: 'MEMORY_MOMENT',
        title: 'Seal the Group Memory',
        subtitle: 'Approve tonight’s funniest quote into the Group Memory Graph forever.',
        promptQuestion: 'Add “The Phantom Texter of Goa” to the Official Group Lore?',
        options: ['Hell Yes (Approved)', 'Edit Quote First', 'Veto (Burn this)'],
        timeLimitSeconds: 20,
        soundCue: 'fanfare',
      },
    ];
  }

  /**
   * Start a new Room OS session
   */
  public static startSession(
    roomCode: string,
    hostUserId: string,
    template: RoomTemplateType = 'SQUAD_NIGHT',
    humor: HumorTone = 'FRIENDLY_ROAST',
    language: string = 'hi-IN',
    groupId?: string
  ): RoomOSSession {
    const steps = this.generateSteps(template, humor, language);
    const session: RoomOSSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      groupId,
      roomCode,
      templateType: template,
      hostUserId,
      status: 'IN_SHOW',
      humorTone: humor,
      selectedLanguage: language,
      durationMinutes: 20,
      playerCount: 1,
      currentStepIndex: 0,
      totalSteps: steps.length,
      steps,
      startedAt: new Date(),
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  /**
   * Advance to next step in the show runner
   */
  public static advanceStep(sessionId: string): { session: RoomOSSession | null; currentStep: ShowRunnerStep | null } {
    const session = this.activeSessions.get(sessionId);
    if (!session) return { session: null, currentStep: null };

    if (session.currentStepIndex < session.totalSteps - 1) {
      session.currentStepIndex += 1;
    } else {
      session.status = 'COMPLETED';
      session.completedAt = new Date();
    }

    return {
      session,
      currentStep: session.steps[session.currentStepIndex] || null,
    };
  }

  /**
   * Get active session by ID or Room Code
   */
  public static getSessionByCode(roomCode: string): RoomOSSession | undefined {
    return Array.from(this.activeSessions.values()).find((s) => s.roomCode === roomCode);
  }
}
