// ==============================================================================
// BONDFIRE 2.0 ENTERTAINMENT NETWORK & ROOM OS TYPES
// ==============================================================================

export type RoomTemplateType =
  | 'SQUAD_NIGHT'
  | 'COUPLE_DATE'
  | 'FAMILY_ADDA'
  | 'COLLEGE_HOSTEL'
  | 'WEDDING_HOUSE'
  | 'CREATOR_LIVE'
  | 'WATCH_PARTY'
  | 'CRICKET_PREDICTION';

export type HumorTone =
  | 'FAMILY_SAFE'
  | 'LIGHT_TEASING'
  | 'FRIENDLY_ROAST'
  | 'SAVAGE_ROAST'
  | 'ROMANTIC'
  | 'EMOTIONAL';

export type ShowStepType =
  | 'WELCOME'
  | 'WARMUP'
  | 'GAME_ROUND'
  | 'REACTION'
  | 'MEMORY_MOMENT'
  | 'FINALE';

export type WatchPlayCardType =
  | 'GUESS_THE_ENDING'
  | 'CHOOSE_NEXT_SCENE'
  | 'COMPLETE_THE_LYRIC'
  | 'REEL_COURT'
  | 'PREDICT_WINNER'
  | 'CAPTION_THIS'
  | 'SPOT_HIDDEN';

export type MemoryGraphCategory =
  | 'PEOPLE'
  | 'PLACES'
  | 'EVENTS'
  | 'QUOTES'
  | 'RUNNING_JOKES'
  | 'FOOD'
  | 'SONGS';

export type MemoryNodeStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'IGNORED' | 'DELETED';

export interface MemoryGraphNode {
  id: string;
  groupId: string;
  category: MemoryGraphCategory;
  title: string;
  contextSnippet?: string;
  mediaUrl?: string;
  eventDate?: string;
  sentimentTag: string;
  status: MemoryNodeStatus;
  createdByUserId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ShowRunnerStep {
  stepIndex: number;
  stepType: ShowStepType;
  title: string;
  subtitle?: string;
  gameMode?: string;
  promptQuestion?: string;
  options?: string[];
  correctOptionIndex?: number;
  mediaUrl?: string;
  timeLimitSeconds: number;
  exhibitSnippet?: string;
  soundCue?: string; // 'buzzer' | 'fanfare' | 'drumroll' | 'crickets'
}

export interface RoomOSSession {
  id: string;
  groupId?: string;
  roomCode: string;
  templateType: RoomTemplateType;
  hostUserId: string;
  status: 'LOBBY' | 'IN_SHOW' | 'COMPLETED';
  humorTone: HumorTone;
  selectedLanguage: string;
  durationMinutes: number;
  playerCount: number;
  currentStepIndex: number;
  totalSteps: number;
  steps: ShowRunnerStep[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface PlayerHumorFlag {
  id: string;
  roomSessionId: string;
  playerUserId: string;
  flagType: 'TOO_PERSONAL' | 'NOT_FUNNY' | 'REMOVE_PROMPT' | 'REPORT';
  promptId: string;
  createdAt: Date;
}

export interface WatchPlayCard {
  id: string;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  cardType: WatchPlayCardType;
  title: string;
  description?: string;
  mediaUrl: string;
  pauseTimestampSeconds: number;
  promptQuestion: string;
  options: Array<{ id: string; label: string; isCorrect?: boolean }>;
  revealExplanation?: string;
  language: string;
  tags: string[];
  likesCount: number;
}
