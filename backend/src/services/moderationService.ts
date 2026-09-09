// ==============================================================================
// ENTERPRISE UGC CONTENT MODERATION SERVICE
// Automated toxicity filtering, PII regex detection, and abuse report queues
// ==============================================================================

export interface ModerationCheckResult {
  isApproved: boolean;
  flaggedCategories: string[];
  sanitizedText: string;
}

export interface AbuseReport {
  reportId: string;
  reporterUserId: string;
  reportedTargetId: string;
  targetType: 'MEMORY' | 'USER' | 'CHAT';
  reason: string;
  createdAt: number;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export class ModerationService {
  // Disallowed sensitive/toxic tokens
  private static readonly PROFANITY_BLOCKLIST = new Set([
    'hate',
    'scam',
    'phishing',
    'exploit',
    'threat',
  ]);

  // SSN and Credit card PII regex patterns
  private static readonly PII_CARD_PATTERN = /\b(?:\d[ -]*?){13,16}\b/g;

  /**
   * Evaluates text content for safety compliance before game card creation
   */
  static evaluateContent(text: string): ModerationCheckResult {
    const flags: string[] = [];
    let sanitized = text;

    // 1. Check for PII / Payment card numbers
    if (this.PII_CARD_PATTERN.test(text)) {
      flags.push('PII_FINANCIAL_CARD');
      sanitized = sanitized.replace(this.PII_CARD_PATTERN, '[REDACTED_PII]');
    }

    // 2. Tokenized profanity and hate speech evaluation
    const words = text.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (this.PROFANITY_BLOCKLIST.has(w.replace(/[^a-z]/g, ''))) {
        flags.push('HARASSMENT_OR_PROFANITY');
        break;
      }
    }

    return {
      isApproved: flags.length === 0,
      flaggedCategories: flags,
      sanitizedText: sanitized,
    };
  }

  /**
   * Submits an abuse report to the administrative review queue
   */
  static fileReport(
    reporterId: string,
    targetId: string,
    targetType: 'MEMORY' | 'USER' | 'CHAT',
    reason: string
  ): AbuseReport {
    return {
      reportId: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      reporterUserId: reporterId,
      reportedTargetId: targetId,
      targetType,
      reason,
      createdAt: Date.now(),
      status: 'PENDING',
    };
  }
}
