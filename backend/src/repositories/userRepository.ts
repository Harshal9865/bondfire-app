// ==============================================================================
// TYPED USER REPOSITORY (Data Access Layer)
// Handles database operations for user profiles, Google identities, and settings
// ==============================================================================

export interface UserEntity {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export class UserRepository {
  // In-memory mock store for unit testing & local sandbox
  private static mockUsers: Map<string, UserEntity> = new Map();

  static async findById(id: string): Promise<UserEntity | null> {
    return this.mockUsers.get(id) || null;
  }

  static async findByEmail(email: string): Promise<UserEntity | null> {
    for (const u of this.mockUsers.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  static async create(user: Omit<UserEntity, 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const entity: UserEntity = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockUsers.set(entity.id, entity);
    return entity;
  }

  static async updateDisplayName(id: string, newName: string): Promise<UserEntity | null> {
    const user = await this.findById(id);
    if (!user) return null;
    user.displayName = newName;
    user.updatedAt = new Date().toISOString();
    return user;
  }

  static clearMock(): void {
    this.mockUsers.clear();
  }
}
