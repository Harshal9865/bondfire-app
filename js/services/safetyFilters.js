// ==============================================================================
// SAFETY & TONE FILTERS
// Handles explicit humor-control (Family-safe, Roast, Romantic) 
// and privacy fallbacks for the AI generation pipeline.
// ==============================================================================

export const TONE_MODES = {
  ROAST: {
    id: 'ROAST',
    label: 'Brutal Roast',
    emoji: '🔥',
    promptModifier: 'Be absolutely savage and unapologetic. Roast the participants based on this context. Keep it edgy but fun.',
    allowNSFW: false // We still block explicit NSFW, but allow edgy humor
  },
  FAMILY: {
    id: 'FAMILY',
    label: 'Family Safe',
    emoji: '🧸',
    promptModifier: 'Keep the humor extremely light, wholesome, and PG-rated. Avoid any mature themes, swearing, or edgy jokes.',
    allowNSFW: false
  },
  ROMANTIC: {
    id: 'ROMANTIC',
    label: 'Date Night',
    emoji: '🍷',
    promptModifier: 'Focus on relationship quirks, romantic tension, and cute couple habits. Make it slightly flirty but tasteful.',
    allowNSFW: false
  }
};

class SafetyFilterService {
  constructor() {
    this.currentTone = TONE_MODES.ROAST;
  }

  setToneMode(modeId) {
    if (TONE_MODES[modeId]) {
      this.currentTone = TONE_MODES[modeId];
      console.log(`[SafetyFilters] Tone set to ${this.currentTone.label}`);
      return true;
    }
    return false;
  }

  getTonePromptModifier() {
    return this.currentTone.promptModifier;
  }

  // Local fallback logic to strip out AI content if user flags it
  stripSensitiveContent(card) {
    console.warn('[SafetyFilters] Stripping sensitive content from card due to user flag.');
    
    // Replace potentially sensitive AI-generated text with safe fallbacks
    return {
      ...card,
      question: 'This question was hidden for privacy.',
      details: 'Content redacted by safety filter.',
      quote: '*** redacted ***',
      secretText: 'This secret has been permanently locked away.',
      isRedacted: true
    };
  }

  // Simulate a quick regex-based profanity check for Family mode
  validateContent(text) {
    if (this.currentTone.id === 'FAMILY') {
      const forbiddenWords = ['fuck', 'shit', 'bitch', 'ass'];
      const hasProfanity = forbiddenWords.some(word => text.toLowerCase().includes(word));
      if (hasProfanity) {
        return { isSafe: false, reason: 'Profanity detected in Family Mode.' };
      }
    }
    return { isSafe: true };
  }
}

export const safetyFilters = new SafetyFilterService();
