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
    id: 'RED_FLAG_COURT',
    name: 'The Red Flag Courtroom',
    tagline: 'Trial of Shame & Roast Sentences',
    icon: 'gavel',
    emoji: '⚖️',
    color: 'sunset-coral',
    badgeText: 'HOT COURTROOM',
    description: 'Put your friends on trial for their most unhinged habits. Review Exhibit A, hear their desperate plea, and cast your jury verdict!',
  },
  {
    id: 'CONFESSION_VAULT',
    name: 'Anonymous Confession Vault',
    tagline: 'Whose Dark Secret Is This?',
    icon: 'lock_open',
    emoji: '🕵️',
    color: 'amber-gold',
    badgeText: 'DEEP & SPICY',
    description: 'Anonymous confessions pulled straight from the squad vault. Guess which camper did it before the dramatic reveal!',
  },
  {
    id: 'HOT_SEAT_ROULETTE',
    name: 'Hot Seat Roulette',
    tagline: 'Deep, Provocative & Friendship-Testing',
    icon: 'local_fire_department',
    emoji: '🎯',
    color: 'duo-rose',
    badgeText: 'INTIMATE',
    description: 'One camper in the hot seat each round answering unfiltered friendship questions. Rate their truthfulness on the lie detector!',
  },
  {
    id: 'MOST_LIKELY_TO',
    name: 'Most Likely To... Savage',
    tagline: 'Rapid-Fire Pointing with Zero Mercy',
    icon: 'bolt',
    emoji: '🎭',
    color: 'mint-green',
    badgeText: 'RAPID FIRE',
    description: '10-second shot clock scenario pointing. Crown the squad’s biggest chaos agents, voice of reason, and drama magnets.',
  },
  {
    id: 'INSIDE_JOKE_VAULT',
    name: 'Inside Joke Mystery Deck',
    tagline: 'Who Actually Said This in 2019?',
    icon: 'whatshot',
    emoji: '🎙️',
    color: 'secondary',
    badgeText: 'CLASSIC ARCHIVE',
    description: 'Real WhatsApp, Discord & iMessage quotes taken out of context. Detect the sender and bluff your friends.',
  },
];

// 1. THE RED FLAG COURTROOM (Trial of Shame)
export const RED_FLAG_COURT_DECK = [
  {
    round: 1,
    caseNumber: 'CASE #204',
    defendant: 'Liam',
    charge: 'The Phantom Texter Felony',
    details: 'Left a group question on "Read" for 11 consecutive days, but viewed 42 Instagram stories within 3 hours.',
    exhibitTitle: 'Exhibit A: Screenshot of Group Chat vs. IG Activity',
    exhibitSnippet: '“Guys are we still doing dinner tonight?” · Read by Liam at 11:42 PM · 0 Replies',
    defensePlea: '“I mentally drafted a 3-paragraph reply in my head and genuinely assumed I sent it with my mind.”',
    guiltyRoasts: [
      'Must change group chat nickname to "The Ghost of Goa" for 7 days',
      'Must buy the first round of drinks or snacks next meetup',
      'Must post Exhibit A to their close friends story with no context',
    ],
  },
  {
    round: 2,
    caseNumber: 'CASE #205',
    defendant: 'Sarah',
    charge: 'The "5 Minutes Away" Perjury',
    details: 'Sent "Just pulling into the parking lot now!" while still standing wrapped in a towel looking for missing socks.',
    exhibitTitle: 'Exhibit A: Live Location Ping',
    exhibitSnippet: 'Sarah location ping: 8.4 miles away on the expressway · ETA: 28 mins',
    defensePlea: '“Time is an arbitrary social construct and emotional punctuality counts more than physical presence.”',
    guiltyRoasts: [
      'Forced to arrive 15 minutes before everyone else to all future events',
      'Must surrender aux cord privileges for the first 30 minutes of the next road trip',
      'Must narrate their entire morning routine aloud like a nature documentary',
    ],
  },
  {
    round: 3,
    caseNumber: 'CASE #206',
    defendant: 'Alex',
    charge: 'Aux Cord Terrorism & Song-Skipping',
    details: 'Skipped 14 songs within 6 minutes, then forced the car to listen to a 9-minute experimental psychedelic drone track.',
    exhibitTitle: 'Exhibit A: Spotify Queue Log',
    exhibitSnippet: 'Played 0:18s -> Skipped -> Played 0:24s -> Skipped -> Now Playing: "Tibetan Throat Singing (Dubstep Edit)"',
    defensePlea: '“The vibe in the vehicle was stagnant and required acoustic spiritual elevation.”',
    guiltyRoasts: [
      'Banned from touching any audio cable, Bluetooth, or speaker for 1 month',
      'Must listen to Baby Shark on repeat for 10 minutes without making a face',
      'Must DJ a full set consisting entirely of 90s commercial jingles',
    ],
  },
  {
    round: 4,
    caseNumber: 'CASE #207',
    defendant: 'Rohan',
    charge: 'The French Exit Without Human Contact',
    details: 'Disappeared from the house party at 11:15 PM without saying goodbye to a single living person.',
    exhibitTitle: 'Exhibit A: Doorbell Cam Footage',
    exhibitSnippet: 'Motion detected at Front Porch: Figure in hoodie tip-toeing into Uber at 11:18 PM',
    defensePlea: '“Saying goodbye to 12 people takes 45 minutes of awkward hugs and promises to catch up soon.”',
    guiltyRoasts: [
      'Must give a 60-second farewell toast before leaving any gathering forever',
      'Must wear a high-vis neon vest at the next squad party',
      'Must write a heartfelt personalized farewell haiku for each camper',
    ],
  },
];

// 2. ANONYMOUS CONFESSION VAULT (Whose Dark Secret?)
export const CONFESSION_VAULT_DECK = [
  {
    round: 1,
    confessionId: 'CONFESSION #101',
    secretText: '“I dropped someone’s toothbrush behind the toilet during the 2023 cabin trip, rinsed it for 3 seconds under warm tap water, and put it back like nothing happened.”',
    submittedAt: 'Vault Sealed · Goa Cabin Trip',
    shockRating: '💀 CRITICAL BIOHAZARD',
    suspects: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    actualAuthor: 'Alex',
    confessionContext: '“I was in pure survival panic mode. If I confessed then, you guys would have thrown me into the woods.”',
  },
  {
    round: 2,
    confessionId: 'CONFESSION #102',
    secretText: '“I once faked food poisoning to skip a 3-hour Zoom birthday celebration, turned off my phone, and ate an entire family-size cheesecake in bed while watching Shrek 2.”',
    submittedAt: 'Vault Sealed · Lockdown 2021',
    shockRating: '🍰 INTROVERT CRIME',
    suspects: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    actualAuthor: 'Sarah',
    confessionContext: '“I don’t regret the cheesecake, but I do apologize for sending a picture of thermometer off Google Images.”',
  },
  {
    round: 3,
    confessionId: 'CONFESSION #103',
    secretText: '“I accidentally backed my car into Liam’s bumper at the supermarket parking lot, panicked, left a fake note with pizza delivery phone number, and drove away.”',
    submittedAt: 'Vault Sealed · Summer 2022',
    shockRating: '🚗 HIT & RUN HITMAN',
    suspects: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    actualAuthor: 'Rohan',
    confessionContext: '“Liam thought Domino’s Pizza had hit his car for 6 months until I bought him lunch.”',
  },
  {
    round: 4,
    confessionId: 'CONFESSION #104',
    secretText: '“I still have not watched a single episode of the anime/series that I have aggressively recommended to every single person in this room for over 2 years.”',
    submittedAt: 'Vault Sealed · Group Chat Lore',
    shockRating: '🍿 FRAUDULENT CRITIC',
    suspects: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    actualAuthor: 'Liam',
    confessionContext: '“I only watched YouTube video essays and TikTok clips. I was faking knowledge the whole time.”',
  },
];

// 3. HOT SEAT ROULETTE (Deep & Unfiltered)
export const HOT_SEAT_DECK = [
  {
    round: 1,
    seatTarget: 'Liam',
    theme: '🔥 APOCALYPSE TIER',
    question: '“If our entire squad was trapped on a deserted island with limited rations, who is the FIRST person you are voting off the island and why?”',
    promptHint: 'Name one camper in this room. No diplomatic non-answers allowed.',
    ratings: [
      { id: 'HONEST', label: '100% Brutal Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Sugarcoated Cap', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Unhinged Emotional Grenade', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 2,
    seatTarget: 'Sarah',
    theme: '🧠 PSYCHOLOGICAL TRUTH',
    question: '“What was your honest first impression of everyone here when you first joined this group, and who surprised you the most?”',
    promptHint: 'Be brutally specific about who you thought was intimidating or weird.',
    ratings: [
      { id: 'HONEST', label: '100% Brutal Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Sugarcoated Cap', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Unhinged Emotional Grenade', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 3,
    seatTarget: 'Alex',
    theme: '💣 THE SQUAD MIRROR',
    question: '“If you were forced to switch bank accounts, career, and romantic life with one person in this room for an entire year, who are you picking?”',
    promptHint: 'Explain the trade-offs. Who has the most chaotic life right now?',
    ratings: [
      { id: 'HONEST', label: '100% Brutal Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Sugarcoated Cap', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Unhinged Emotional Grenade', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
  {
    round: 4,
    seatTarget: 'Rohan',
    theme: '🚨 POLICE REPORT',
    question: '“If you received a phone call at 3 AM that someone in this room was arrested with zero explanation, who is it and what crime did they commit?”',
    promptHint: 'Don’t hold back on the exact fictional crime scenario.',
    ratings: [
      { id: 'HONEST', label: '100% Brutal Truth', color: 'mint-green', icon: 'verified', xp: 350 },
      { id: 'CAP', label: 'Sugarcoated Cap', color: 'sunset-coral', icon: 'sentiment_dissatisfied', xp: 50 },
      { id: 'GRENADE', label: 'Unhinged Emotional Grenade', color: 'amber-gold', icon: 'bomb', xp: 500 },
    ],
  },
];

// 4. MOST LIKELY TO... SAVAGE EDITION
export const MOST_LIKELY_TO_DECK = [
  {
    round: 1,
    category: 'SQUAD CHAOS',
    scenario: '“Most likely to accidentally start a spiritual wellness cult while trying to do a 3-day detox retreat.”',
    candidates: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    crownTitle: 'The Cult Leader',
  },
  {
    round: 2,
    category: 'LEGAL DANGER',
    scenario: '“Most likely to get interrogated at airport customs because they argued about whether shampoo is technically a fluid.”',
    candidates: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    crownTitle: 'TSA’s Worst Nightmare',
  },
  {
    round: 3,
    category: 'FRIENDSHIP CRIMES',
    scenario: '“Most likely to RSVP "Yes" to a destination wedding, buy flight tickets, and cancel 3 hours before boarding.”',
    candidates: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    crownTitle: 'The Flake Sovereign',
  },
  {
    round: 4,
    category: 'WEALTH & FAME',
    scenario: '“Most likely to accidentally strike oil or become a billionaire and immediately pretend they don’t recognize our phone numbers.”',
    candidates: ['Liam', 'Sarah', 'Alex', 'Rohan'],
    crownTitle: 'The Fickle Tycoon',
  },
];

// 5. INSIDE JOKE MYSTERY DECK (Upgraded classic)
export const INSIDE_JOKE_DECK = [
  {
    round: 1,
    timestamp: 'Oct 14, 2019 · 2:43 AM',
    quote: 'If I eat one more samosa I am legally changing my name to potato and moving into the fridge.',
    correctAnswer: 'Rohan',
    options: [
      { name: 'Sarah', role: 'Trivia Legend' },
      { name: 'Rohan', role: 'Foodie Captain' },
      { name: 'Alex', role: 'Late Night Owl' },
      { name: 'Liam', role: 'Campfire Guitarist' },
    ],
    context: 'Sent during semester final exams at 2:43 AM after ordering 18 street samosas.',
  },
  {
    round: 2,
    timestamp: 'July 14, 2019 · 2:41 AM',
    quote: 'If anyone orders another Hawaiian pizza tonight I am literally revoking my Netflix password for all 5 of you.',
    correctAnswer: 'Liam',
    options: [
      { name: 'Liam', role: 'Campfire Guitarist' },
      { name: 'Sarah', role: 'Trivia Legend' },
      { name: 'Alex', role: 'Late Night Owl' },
      { name: 'Rohan', role: 'Foodie Captain' },
    ],
    context: 'Austin Airbnb trip 2:41 AM dispute over late night pizza toppings.',
  },
  {
    round: 3,
    timestamp: 'Aug 18, 2022 · 11:22 PM',
    quote: 'Guys the Google Maps lady is crying. She literally has no idea where this road leads and neither do I.',
    correctAnswer: 'Alex',
    options: [
      { name: 'Alex', role: 'Late Night Owl' },
      { name: 'Liam', role: 'Campfire Guitarist' },
      { name: 'Sarah', role: 'Trivia Legend' },
      { name: 'Rohan', role: 'Foodie Captain' },
    ],
    context: 'Lost in the Anjuna Forest backroads with 3% phone battery.',
  },
];

export function getDeckForMode(modeId) {
  switch (modeId) {
    case 'RED_FLAG_COURT':
      return RED_FLAG_COURT_DECK;
    case 'CONFESSION_VAULT':
      return CONFESSION_VAULT_DECK;
    case 'HOT_SEAT_ROULETTE':
      return HOT_SEAT_DECK;
    case 'MOST_LIKELY_TO':
      return MOST_LIKELY_TO_DECK;
    case 'INSIDE_JOKE_VAULT':
    default:
      return INSIDE_JOKE_DECK;
  }
}
