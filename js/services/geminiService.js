// ==============================================================================
// BONDFIRE GEMINI AI SERVICE (Dynamic Party Game Generator)
// ==============================================================================

import { CONFIG } from '../config.js';

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

/**
 * Helper to call Gemini Flash API
 */
async function callGemini(promptText) {
  if (!CONFIG.GEMINI_API_KEY) {
    console.warn('No Gemini API key configured.');
    return null;
  }

  const url = `${GEMINI_ENDPOINT}?key=${CONFIG.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 1200,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return rawOutput;
}

/**
 * Generate dynamic custom game deck using Google Gemini
 * @param {string} modeId The game mode (RED_FLAG_COURT, CONFESSION_VAULT, HOT_SEAT_ROULETTE, MOST_LIKELY_TO, etc.)
 * @param {string[]} playerNames Real player names in the room
 * @param {string} customTopic Optional user-provided topic or inside joke
 */
export async function generateDynamicGameDeck(modeId, playerNames = ['Player 1', 'Player 2'], customTopic = '') {
  const namesStr = playerNames.length > 0 ? playerNames.join(', ') : 'Friends';

  const systemInstruction = `You are a hilarious, witty party game writer for "Bondfire", a viral friendship party game. 
You are writing a custom deck for a game between friends named: [${namesStr}].
${customTopic ? `Theme / Inside Joke topic: "${customTopic}".` : 'Theme: Relatable, modern friendship chaos, unhinged habits, wholesome roasts.'}

IMPORTANT RULES:
1. Always return a raw valid JSON array of 4 rounds. Do NOT include markdown code fences or backticks, just the pure JSON array.
2. Tone must be playful, witty, human, and fun. Absolutely no generic corporate or robotic text.
3. Feature the real player names from [${namesStr}].
`;

  let modePrompt = '';

  if (modeId === 'RED_FLAG_COURT') {
    modePrompt = `${systemInstruction}
Generate 4 rounds for "The Red Flag Courtroom".
Format each round as an object:
{
  "round": 1,
  "defendant": "one name from [${namesStr}]",
  "defendantCrime": "short punchy title of ridiculous crime (e.g., Sends 7-Minute Voice Notes Instead of Typing)",
  "exhibitSnippet": "A hilarious quote or evidence snippet representing their habit",
  "defensePlea": "Their funny desperate defense plea in quotes",
  "guiltyRoasts": ["Roast punishment 1", "Roast punishment 2"]
}`;
  } else if (modeId === 'CONFESSION_VAULT') {
    modePrompt = `${systemInstruction}
Generate 4 rounds for "Anonymous Confession Vault".
Format each round as an object:
{
  "round": 1,
  "confessionId": "CONFESSION #101",
  "secretText": "A hilarious, slightly embarrassing secret (food theft, fake excuses, guilty pleasures)",
  "submittedAt": "Funny sealed timestamp (e.g. 2 AM Maggi Panic, Summer Trip)",
  "shockRating": "PUNCHY TWO-WORD RATING (e.g. CRITICAL BIOHAZARD, INTROVERT CRIME)",
  "suspects": ${JSON.stringify(playerNames.slice(0, 4))},
  "actualAuthor": "one name from suspects",
  "confessionContext": "The funny backstory of why they did it in quotes"
}`;
  } else if (modeId === 'HOT_SEAT_ROULETTE') {
    modePrompt = `${systemInstruction}
Generate 4 rounds for "Hot Seat Roulette".
Format each round as an object:
{
  "round": 1,
  "seatTarget": "one name from [${namesStr}]",
  "theme": "TWO-WORD DRAMATIC THEME",
  "question": "A provocative, funny, or deep question about their friendship dynamics or habits",
  "promptHint": "One line instruction on how brutally honest they must be"
}`;
  } else if (modeId === 'MOST_LIKELY_TO') {
    modePrompt = `${systemInstruction}
Generate 4 rounds for "Most Likely To... Rapid Fire".
Format each round as an object:
{
  "round": 1,
  "scenario": "Who is most likely to [hilarious relatable chaotic scenario]?",
  "category": "TWO-WORD CATEGORY",
  "crownTitle": "Funny crown title for whoever wins",
  "candidates": ${JSON.stringify(playerNames.slice(0, 4))}
}`;
  } else {
    modePrompt = `${systemInstruction}
Generate 4 rounds for "Who Said This? Chat Lore".
Format each round as an object:
{
  "round": 1,
  "quote": "An unhinged, out-of-context late-night text message",
  "author": "one name from [${namesStr}]",
  "context": "Funny context of when this was allegedly said",
  "suspects": ${JSON.stringify(playerNames.slice(0, 4))}
}`;
  }

  try {
    const raw = await callGemini(modePrompt);
    if (!raw) return null;

    // Clean any markdown fences if present
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log(`[Gemini AI] Successfully synthesized ${parsed.length} custom rounds for ${modeId}!`);
      return parsed;
    }
  } catch (err) {
    console.warn('[Gemini AI] Deck generation error or parse issue:', err.message);
  }

  return null;
}
