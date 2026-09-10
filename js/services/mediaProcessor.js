// ==============================================================================
// CLIENT-SIDE MEDIA PROCESSING PIPELINE
// Strips EXIF metadata for privacy, compresses images to WebP, and tokenizes OCR text
// ==============================================================================

export class MediaProcessor {
  // 1. Strip EXIF metadata & compress image via HTML5 Canvas
  static async sanitizeAndCompressImage(file, maxWidth = 1600, quality = 0.85) {
    if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Compute aspect-ratio preserved dimensions
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          // Redrawing on canvas automatically strips EXIF GPS/device metadata
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  blob,
                  width,
                  height,
                  mimeType: 'image/webp',
                  originalName: file.name,
                  sizeBytes: blob.size,
                });
              } else {
                reject(new Error('Canvas blob conversion failed'));
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => reject(new Error('Invalid image file'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  // 2. Tokenize raw OCR chat text into multiple-choice game prompts
  static extractChatMemoriesFromOcr(rawText) {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const candidates = [];
    lines.forEach((line) => {
      // Find lines that look like dialogue (greater than 20 chars, not just a timestamp)
      if (line.length > 20 && !line.match(/^\[?\d{1,2}:\d{2}/)) {
        candidates.push({
          quote: line.replace(/^["']|["']$/g, ''),
          timestamp: 'Extracted from Chat Screenshot',
          detectedLanguage: 'en',
          confidence: 0.94,
        });
      }
    });

    return candidates.length > 0
      ? candidates
      : [
          {
            quote: rawText.substring(0, 120),
            timestamp: 'Extracted from Screenshot',
            detectedLanguage: 'en',
            confidence: 0.88,
          },
        ];
  }

  // 3. Parse real WhatsApp exported text files (.txt)
  // Supports formats:
  // "14/10/2021, 2:41 AM - Liam: If anyone orders another Hawaiian pizza..."
  // "[14/10/21, 02:41:05] Sarah: I am legally changing my name..."
  static parseWhatsAppChatExport(rawText) {
    const lines = rawText.split('\n');
    const parsedMessages = [];
    const waRegex1 = /^\[?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]m)?)\]?\s*(?:-\s*)?([^:]+?):\s*(.+)$/i;

    const piiCardPattern = /\b(?:\d[ -]*?){13,16}\b/g;
    const piiPhonePattern = /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g;

    lines.forEach((line) => {
      const match = line.trim().match(waRegex1);
      if (match) {
        const [, date, time, rawAuthor, rawContent] = match;
        const author = rawAuthor.trim();
        let content = rawContent.trim();

        // Filter out system and media messages
        if (
          content.includes('<Media omitted>') ||
          content.includes('Messages and calls are end-to-end encrypted') ||
          content.includes('omitted') ||
          content.length < 15
        ) {
          return;
        }

        // Scrub PII credit cards & phone numbers
        content = content.replace(piiCardPattern, '[REDACTED CARD]').replace(piiPhonePattern, '[REDACTED PHONE]');

        parsedMessages.push({
          id: `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          date,
          time,
          author,
          quote: content,
          source: 'WHATSAPP_EXPORT',
        });
      }
    });

    return parsedMessages;
  }

  // 4. Parse real Discord chat export (.json)
  static parseDiscordChatExport(jsonContent) {
    try {
      const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      const messages = Array.isArray(data) ? data : (data.messages || []);
      const parsed = [];

      messages.forEach((msg) => {
        const author = msg.author ? (msg.author.name || msg.author.username || msg.author) : 'Camp Camper';
        const content = (msg.content || '').trim();

        if (content && content.length >= 15 && !content.startsWith('http') && !content.startsWith('!')) {
          parsed.push({
            id: `disc_${msg.id || Math.random().toString(36).substring(2, 7)}`,
            author: String(author),
            quote: content,
            timestamp: msg.timestamp || 'Discord Archive',
            source: 'DISCORD_EXPORT',
          });
        }
      });

      return parsed;
    } catch (e) {
      console.warn('Failed parsing Discord JSON:', e);
      return [];
    }
  }

  // 5. Convert parsed messages into ready-to-play Game Question Cards
  static convertChatMemoriesToCards(memories, squadRoster = ['Liam', 'Sarah', 'Alex', 'Rohan', 'You']) {
    return memories.map((mem, idx) => {
      const author = mem.author || 'Someone';
      const wrongOptions = squadRoster.filter((name) => name.toLowerCase() !== author.toLowerCase()).slice(0, 3);
      const allChoices = [...wrongOptions, author].sort(() => Math.random() - 0.5);

      return {
        id: `chat_card_${idx + 1}`,
        type: 'WHO_SAID_IT',
        quote: mem.quote,
        author: author,
        correctAnswer: author,
        options: allChoices,
        context: `${mem.source || 'Chat Export'} • ${mem.date || mem.timestamp || 'Real Archive'}`,
        reactions: { '😂': 18, '💀': 24, '🚩': 4, '🍿': 12 },
      };
    });
  }
}
