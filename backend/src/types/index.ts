// ==============================================================================
// BONDFIRE DOMAIN TYPES & INTERFACES (TypeScript Enterprise Types)
// ==============================================================================

export type PodType = 'SOLO' | 'COUPLE' | 'SQUAD';
export type PodRole = 'HOST' | 'ADMIN' | 'PLAYER' | 'GUEST';
export type MediaType = 'PHOTO' | 'CHAT_SCREENSHOT' | 'VOICE_NOTE' | 'TEXT_SNIPPET';
export type GameMode = 'WHO_SAID_THIS' | 'THEN_VS_NOW' | 'MOST_LIKELY_TO' | 'BLUFF_CAPTION';
export type GameStatus = 'LOBBY' | 'IN_PROGRESS' | 'ROUND_REVEAL' | 'COMPLETED' | 'ABANDONED';

export interface User {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  isVerified: boolean;
  role: 'SUPERADMIN' | 'MEMBER';
  createdAt: Date;
}

export interface Pod {
  id: string;
  name: string;
  type: PodType;
  roomCode: string;
  isPro: boolean;
  proExpiresAt?: Date;
  createdBy?: string;
  activeMembers?: PodMemberSummary[];
  createdAt: Date;
}

export interface PodMemberSummary {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: PodRole;
  scoreAllTime: number;
  isReady?: boolean;
}

export interface Memory {
  id: string;
  podId: string;
  createdBy?: string;
  title: string;
  rawText?: string;
  ocrExtractedText?: string;
  eventTimestamp?: Date;
  isPlayable: boolean;
  isPrivateToOwner: boolean;
  mediaFiles?: MemoryMedia[];
  createdAt: Date;
}

export interface MemoryMedia {
  id: string;
  memoryId: string;
  mediaType: MediaType;
  storageKey: string;
  blurHash?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  waveformData?: number[];
  createdAt: Date;
}

export interface GameSession {
  id: string;
  podId: string;
  hostUserId: string;
  mode: GameMode;
  status: GameStatus;
  totalRounds: number;
  currentRoundIndex: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface GameRound {
  id: string;
  gameSessionId: string;
  memoryId?: string;
  roundNumber: number;
  questionPrompt: string;
  correctAnswer: string;
  options: string[];
  timeLimitSeconds: number;
  startedAt?: Date;
  revealedAt?: Date;
}

export interface PlayerVote {
  id: string;
  gameRoundId: string;
  userId: string;
  selectedOption: string;
  isCorrect: boolean;
  pointsAwarded: number;
  responseTimeMs: number;
  votedAt: Date;
}

// WebSocket Event Protocol Messages
export type ClientMessageType = 
  | 'CLIENT_JOIN_ROOM' 
  | 'CLIENT_TOGGLE_READY' 
  | 'CLIENT_CAST_VOTE' 
  | 'CLIENT_EMOJI_REACTION' 
  | 'CLIENT_HOST_START_GAME' 
  | 'CLIENT_HOST_NEXT_ROUND';

export type ServerMessageType = 
  | 'SERVER_ROOM_STATE' 
  | 'SERVER_PLAYER_JOINED' 
  | 'SERVER_PLAYER_LEFT' 
  | 'SERVER_PLAYER_READY_CHANGED' 
  | 'SERVER_ROUND_STARTED' 
  | 'SERVER_VOTE_RECORDED' 
  | 'SERVER_ROUND_REVEALED' 
  | 'SERVER_GAME_OVER' 
  | 'SERVER_EMOJI_BURST' 
  | 'SERVER_ERROR';

export interface WSMessage<T = unknown> {
  type: ClientMessageType | ServerMessageType;
  payload: T;
  timestamp: number;
}
