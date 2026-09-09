// ==============================================================================
// TYPED POD REPOSITORY (Data Access Layer)
// Handles database operations for rooms, memberships, and memory decks
// ==============================================================================

export interface PodEntity {
  id: string;
  roomCode: string;
  name: string;
  mode: 'SOLO' | 'US' | 'PODS';
  hostUserId: string;
  memberCount: number;
  createdAt: string;
}

export class PodRepository {
  private static mockPods: Map<string, PodEntity> = new Map();

  static async findByRoomCode(code: string): Promise<PodEntity | null> {
    const upper = code.toUpperCase();
    for (const pod of this.mockPods.values()) {
      if (pod.roomCode === upper) return pod;
    }
    return null;
  }

  static async create(pod: Omit<PodEntity, 'createdAt'>): Promise<PodEntity> {
    const entity: PodEntity = {
      ...pod,
      createdAt: new Date().toISOString(),
    };
    this.mockPods.set(entity.id, entity);
    return entity;
  }

  static async listByHost(hostUserId: string): Promise<PodEntity[]> {
    return Array.from(this.mockPods.values()).filter((p) => p.hostUserId === hostUserId);
  }

  static clearMock(): void {
    this.mockPods.clear();
  }
}
