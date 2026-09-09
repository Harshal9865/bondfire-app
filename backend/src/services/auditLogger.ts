// ==============================================================================
// ENTERPRISE AUDIT LOGGER
// Emits structured JSON events with correlation IDs for security & compliance
// ==============================================================================

export type AuditAction =
  | 'POD_CREATED'
  | 'MEMBER_JOINED'
  | 'MEMORY_UPLOADED'
  | 'MEMORY_DELETED'
  | 'GAME_ROUND_COMPLETED'
  | 'YEARBOOK_ORDERED'
  | 'SECURITY_ALERT';

export interface AuditLogEntry {
  correlationId: string;
  timestamp: string;
  action: AuditAction;
  actorUserId: string;
  podId?: string;
  ipAddress?: string;
  metadata: Record<string, unknown>;
}

export class AuditLogger {
  private static logs: AuditLogEntry[] = [];

  static log(
    action: AuditAction,
    actorUserId: string,
    metadata: Record<string, unknown> = {},
    podId?: string,
    ipAddress?: string
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      correlationId: `cid_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      actorUserId,
      podId,
      ipAddress,
      metadata,
    };

    this.logs.push(entry);

    // In production, stream to Datadog / CloudWatch / stdout
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[AUDIT] ${JSON.stringify(entry)}`);
    }

    return entry;
  }

  static getRecentLogs(limit = 50): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }

  static clearLogs(): void {
    this.logs = [];
  }
}
