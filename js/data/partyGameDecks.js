// ==============================================================================
// BONDFIRE DEEP PARTY GAMES ENGINE & DECK VAULT
// Curated high-vulnerability, deeply engaging squad party games:
// 1. The Red Flag Courtroom (Trial of Shame)
// 2. Anonymous Confession Vault (Whose Dark Secret?)
// 3. Hot Seat Roulette (Deep & Unfiltered)
// 4. Most Likely To... Savage Edition
// 5. Inside Joke Mystery Archive
// ==============================================================================

export const GAME_MODES = [
  {
    id: 'OUR_LORE',
    name: 'Our Lore (The Group Canon)',
    tagline: 'The Squad Decides Official Group History',
    icon: 'history_edu',
    color: 'sunset-coral',
    badgeText: 'SIGNATURE GAME',
    description: 'Unpack the squad’s most chaotic trips, 3 AM Maggi incidents, and group chat civil wars. Vote on the official canon history!',
  },
  {
    id: 'WHO_SAID_THIS',
    name: 'Who Said This? (Chat Exposes)',
    tagline: 'Real Group Quotes Out of Context',
    icon: 'format_quote',
    color: 'amber-gold',
    badgeText: 'VIRAL CHAT',
    description: 'Anonymous screenshots and unhinged late night messages. Spot the guilty friend before they can defend themselves!',
  },
  {
    id: 'RED_FLAG_COURT',
    name: 'The Red Flag Courtroom',
    tagline: 'Trial of Shame & Roast Sentences',
    icon: 'gavel',
    color: 'sunset-coral',
    badgeText: 'HOT COURTROOM',
    description: 'Put your friends on trial for their most unhinged habits. Review Exhibit A, hear their desperate plea, and cast your jury verdict!',
  },
  {
    id: 'REEL_COURT',
    name: 'Reel Courtroom (Relatable Crimes)',
    tagline: '7-Min Voice Notes & Bill Splitting',
    icon: 'smart_display',
    color: 'mint-green',
    badgeText: 'WATCH & PLAY',
    description: 'Review Exhibit A video clips of everyday desi struggles. Vote guilty or relatable and hand out hilarious punishments.',
  },
  {
    id: 'EMOJI_CINEMA',
    name: 'Cinema Puzzle & Antakshari',
    tagline: 'Bollywood & Desi Pop Culture Clash',
    icon: 'movie',
    color: 'amber-gold',
    badgeText: 'BOLLYWOOD',
    description: 'Decipher iconic Bollywood movie titles and sing out the missing lyrics with the entire living room!',
  },
  {
    id: 'MOST_LIKELY_TO',
    name: 'Most Likely To (Squad Ballot)',
    tagline: 'Rapid-Fire Pointing with Zero Mercy',
    icon: 'bolt',
    color: 'mint-green',
    badgeText: 'RAPID FIRE',
    description: '10-second shot clock scenario pointing. Crown the squad’s biggest chaos agents, voice of reason, and drama magnets.',
  },
  {
    id: 'CONFESSION_VAULT',
    name: 'Anonymous Confession Vault',
    tagline: 'Whose Dark Secret Is This?',
    icon: 'lock_open',
    color: 'amber-gold',
    badgeText: 'DEEP & SPICY',
    description: 'Anonymous confessions pulled straight from the squad vault. Guess which camper did it before the dramatic reveal!',
  },
  {
    id: 'HOT_SEAT_ROULETTE',
    name: 'Hot Seat Roulette',
    tagline: 'Deep, Provocative & Friendship-Testing',
    icon: 'local_fire_department',
    color: 'duo-rose',
    badgeText: 'INTIMATE',
    description: 'One camper in the hot seat each round answering unfiltered friendship questions. Rate their truthfulness on the lie detector!',
  },
  {
    id: 'INSIDE_JOKE_VAULT',
    name: 'Inside Joke Mystery Deck',
    tagline: 'Who Actually Said This in 2019?',
    icon: 'whatshot',
    color: 'secondary',
    badgeText: 'CLASSIC ARCHIVE',
    description: 'Real WhatsApp, Discord & iMessage quotes taken out of context. Detect the sender and bluff your friends.',
  },
];

// 1. THE RED FLAG COURTROOM (Call Out Your Friends)
export const RED_FLAG_COURT_DECK = [
  {
    round: 1,
    caseNumber: 'ROUND #1',
    defendant: 'The Group Chat Ghost',
    charge: 'Left the group chat on Read for 4 days',
    details: 'Ignored "Are we hanging out tonight?" but was actively watching and sharing reels 10 minutes later.',
    exhibitTitle: 'Exhibit A: Real Chat Receipts',
    exhibitSnippet: '“Dinner plan confirm tonight?” · Marked Seen · 0 replies for 96 hours',
    defensePlea: '“I typed out an entire thoughtful reply in my head and genuinely thought I hit send!”',
    guiltyRoasts: [
      'Must pick up the first round of snacks at the next meetup',
      'Music queue privileges revoked for the next road trip',
      'Has to reply within 60 seconds to group messages for a whole week',
    ],
  },
  {
    round: 2,
    caseNumber: 'ROUND #2',
    defendant: 'The Perpetual Latecomer',
    charge: 'The "On My Way" Strategic Delay',
    details: 'Texted "Just turning the corner now!" while still looking for car keys in the living room.',
    exhibitTitle: 'Exhibit A: Live Location Ping',
    exhibitSnippet: 'Live Location Ping: 7.2 km away · Estimated arrival in 35 mins',
    defensePlea: '“I was emotionally on my way; physical transit takes preparation!”',
    guiltyRoasts: [
      'Has to arrive 20 minutes before everyone else next time',
      'Responsible for ordering the squad appetizers next meetup',
      'Banned from giving estimated arrival times for the rest of the month',
    ],
  },
  {
    round: 3,
    caseNumber: 'ROUND #3',
    defendant: 'The Aux Dictator',
    charge: 'Skipping every song 30 seconds in',
    details: 'Took over the speaker and skipped 18 tracks in a row before anyone could reach the chorus.',
    exhibitTitle: 'Exhibit A: Music Player Logs',
    exhibitSnippet: '18 songs queued · Average listening duration: 24 seconds',
    defensePlea: '“I was calibrating the exact right acoustic energy for the group!”',
    guiltyRoasts: [
      'Must surrender playlist control to the group co-host',
      'Must listen to a full album from start to finish with no skips',
      'Must perform one chorus live on the spot without background music',
    ],
  },
  {
    round: 4,
    caseNumber: 'ROUND #4',
    defendant: 'The Stealth Exit Strategist',
    charge: 'The Silent Disappearing Act',
    details: 'Quietly slipped out of the gathering at 11:15 PM without a formal goodbye.',
    exhibitTitle: 'Exhibit A: Squad Exit Witness',
    exhibitSnippet: 'Last spotted heading toward the elevator while everyone was debating dessert',
    defensePlea: '“Saying goodbye to a group of 8 people requires 40 minutes of elaborate farewells!”',
    guiltyRoasts: [
      'Must give a formal 2-minute greeting toast at the next gathering',
      'Responsible for selecting the venue for our next squad night',
    ],
  },
];

// 2. ANONYMOUS CONFESSION VAULT (Whose Secret?)
export const CONFESSION_VAULT_DECK = [
  {
    round: 1,
    confessionId: 'CONFESSION #101',
    secretText: '“I dropped someone’s favorite sunglasses down the hiking trail during our squad trip, quietly retrieved them, wiped them on my sleeve, and said I found them on the bench.”',
    submittedAt: 'Vault Sealed · Cabin Retreat',
    shockRating: 'SURVIVAL INSTINCT',
    suspects: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    actualAuthor: 'Navigator',
    confessionContext: '“I panicked completely. If I had admitted dropping them down the trail, you would have made me carry all the luggage.”',
  },
  {
    round: 2,
    confessionId: 'CONFESSION #102',
    secretText: '“I once faked a calendar conflict to skip a 3-hour video call, turned off all notifications, and ordered pizza while watching movie marathons in silence.”',
    submittedAt: 'Vault Sealed · Weekend Archive',
    shockRating: 'INTROVERT RECHARGE',
    suspects: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    actualAuthor: 'Storyteller',
    confessionContext: '“I do not regret the quiet evening, but I do apologize for claiming my internet router exploded.”',
  },
  {
    round: 3,
    confessionId: 'CONFESSION #103',
    secretText: '“I accidentally dented the front bumper of our rental car in the supermarket parking lot, panicked, and blamed it on a mystery shopping cart until we returned it.”',
    submittedAt: 'Vault Sealed · Summer Road Trip',
    shockRating: 'PARKING CRISIS',
    suspects: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    actualAuthor: 'DJ',
    confessionContext: '“I ended up buying everyone lunch on the way back to settle my conscience.”',
  },
  {
    round: 4,
    confessionId: 'CONFESSION #104',
    secretText: '“I still have not watched a single episode of the show that I passionately recommended to everyone in this group for two straight years.”',
    submittedAt: 'Vault Sealed · Group Chat Lore',
    shockRating: 'CRITIC BLUFF',
    suspects: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    actualAuthor: 'Organizer',
    confessionContext: '“I only watched YouTube recap summaries. I was completely improvising my deep analyses.”',
  },
];

// 3. HOT SEAT ROULETTE (Deep & Unfiltered)
export const HOT_SEAT_DECK = [
  {
    round: 1,
    seatTarget: 'The Host',
    theme: 'SURVIVAL SCENARIO',
    question: '“If our entire squad was stranded on a remote island with limited supplies, who is the first person you trust to build shelter, and who is purely emotional support?”',
    promptHint: 'Name one camper in this room for each role. No diplomatic non-answers allowed.',
    ratings: [
      { id: 'HONEST', label: '100% Unvarnished Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Polite Diplomatic Answer', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Spicy Unfiltered Take', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 2,
    seatTarget: 'First Responder',
    theme: 'PSYCHOLOGICAL TRUTH',
    question: '“What was your genuine first impression of everyone here when you first joined this group, and whose personality surprised you the most?”',
    promptHint: 'Be specific about who initially seemed quiet or intimidating versus how they actually are.',
    ratings: [
      { id: 'HONEST', label: '100% Unvarnished Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Polite Diplomatic Answer', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Spicy Unfiltered Take', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 3,
    seatTarget: 'Co-Pilot',
    theme: 'SQUAD MIRROR',
    question: '“If you were forced to switch career paths and day-to-day schedules with one person in this room for an entire month, who are you picking and why?”',
    promptHint: 'Highlight the trade-offs and who has the most intense weekly calendar right now.',
    ratings: [
      { id: 'HONEST', label: '100% Unvarnished Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Polite Diplomatic Answer', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Spicy Unfiltered Take', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 4,
    seatTarget: 'Mystery Seat',
    theme: 'MIDNIGHT HYPOTHETICAL',
    question: '“If you received an urgent 3 AM phone call asking you to pick up someone from this room at an airport terminal in a foreign country, who would it most likely be and what led to that?”',
    promptHint: 'Paint the full picture of the travel mishap or spontaneous adventure.',
    ratings: [
      { id: 'HONEST', label: '100% Unvarnished Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Polite Diplomatic Answer', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Spicy Unfiltered Take', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
];

// 4. MOST LIKELY TO... SAVAGE EDITION
export const MOST_LIKELY_TO_DECK = [
  {
    round: 1,
    category: 'SQUAD ADVENTURE',
    scenario: '“Most likely to accidentally start an impromptu walking tour for tourists while trying to find a coffee shop.”',
    candidates: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    crownTitle: 'The Accidental Guide',
  },
  {
    round: 2,
    category: 'AIRPORT DILEMMAS',
    scenario: '“Most likely to hold up the boarding gate queue because they are rearranging 4 kilograms of souvenirs between carry-on bags.”',
    candidates: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    crownTitle: 'The Luggage Juggler',
  },
  {
    round: 3,
    category: 'SOCIAL CALENDAR',
    scenario: '“Most likely to RSVP "Yes" with supreme enthusiasm, order matching outfits, and text 10 minutes before asking if we can reschedule.”',
    candidates: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    crownTitle: 'The Cozy Homebody',
  },
  {
    round: 4,
    category: 'SPONTANEOUS MOVES',
    scenario: '“Most likely to buy an expensive professional camera or musical instrument on a whim and become an expert within 72 hours.”',
    candidates: ['Organizer', 'Navigator', 'Storyteller', 'DJ'],
    crownTitle: 'The Hyperfocus Legend',
  },
];

// 5. INSIDE JOKE MYSTERY DECK (Upgraded classic)
export const INSIDE_JOKE_DECK = [
  {
    round: 1,
    timestamp: 'Oct 14, 2024 · 2:43 AM',
    quote: 'If anyone suggests another scenic shortcut on this hike, I am officially retiring as group navigator.',
    correctAnswer: 'Trip Navigator',
    options: [
      { name: 'Trip Navigator', role: 'Route Guide' },
      { name: 'Campfire DJ', role: 'Playlist Curator' },
      { name: 'Storyteller', role: 'Late Night Wit' },
      { name: 'Squad Host', role: 'Organizer' },
    ],
    context: 'Sent during the mountain trail ascent after taking a 3-mile detour.',
  },
  {
    round: 2,
    timestamp: 'July 14, 2024 · 1:15 AM',
    quote: 'Who packed the portable charger? We are running on 4% phone battery and pure group enthusiasm.',
    correctAnswer: 'Squad Host',
    options: [
      { name: 'Squad Host', role: 'Organizer' },
      { name: 'Trip Navigator', role: 'Route Guide' },
      { name: 'Campfire DJ', role: 'Playlist Curator' },
      { name: 'Storyteller', role: 'Late Night Wit' },
    ],
    context: 'Late night road trip rest stop recharge crisis.',
  },
  {
    round: 3,
    timestamp: 'Aug 18, 2024 · 11:22 PM',
    quote: 'The GPS voice just sighed deeply. She has no idea where this road leads and neither do we.',
    correctAnswer: 'Campfire DJ',
    options: [
      { name: 'Campfire DJ', role: 'Playlist Curator' },
      { name: 'Trip Navigator', role: 'Route Guide' },
      { name: 'Storyteller', role: 'Late Night Wit' },
      { name: 'Squad Host', role: 'Organizer' },
    ],
    context: 'Exploring coastline backroads on zero signal.',
  },
];

import {
  OUR_LORE_DECK,
  WHO_SAID_THIS_DECK,
  MOST_LIKELY_TO_INDIAN_DECK,
  REEL_COURTROOM_DECK,
  EMOJI_CINEMA_DECK,
} from './indianCultureDecks.js';

export function getDeckForMode(modeId) {
  switch (modeId) {
    case 'OUR_LORE':
      return OUR_LORE_DECK;
    case 'WHO_SAID_THIS':
      return WHO_SAID_THIS_DECK;
    case 'REEL_COURT':
      return REEL_COURTROOM_DECK;
    case 'EMOJI_CINEMA':
      return EMOJI_CINEMA_DECK;
    case 'RED_FLAG_COURT':
      return RED_FLAG_COURT_DECK;
    case 'CONFESSION_VAULT':
      return CONFESSION_VAULT_DECK;
    case 'HOT_SEAT_ROULETTE':
      return HOT_SEAT_DECK;
    case 'MOST_LIKELY_TO':
      return MOST_LIKELY_TO_INDIAN_DECK;
    case 'INSIDE_JOKE_VAULT':
    default:
      return OUR_LORE_DECK;
  }
}
