// ==============================================================================
// BONDFIRE ARCADE: NEVER HAVE I EVER (HUMAN PARTY DECK)
// 100% Relatable, funny, squad & dating situations — zero robotic/AI jargon
// ==============================================================================

export const NEVER_HAVE_I_EVER_DECKS = {
  CHAOS: [
    { id: 'nhie_c1', text: "Never have I ever pretended to be typing a message just to avoid making eye contact with someone.", category: "Everyday Quirks", spice: "MILD" },
    { id: 'nhie_c2', text: "Never have I ever replied 'LOL' or 'Haha' with a completely deadpan, expressionless face in real life.", category: "Chat Habits", spice: "MILD" },
    { id: 'nhie_c3', text: "Never have I ever said 'I'm 5 minutes away' when I hadn't even found my socks yet.", category: "Time Crimes", spice: "SPICY" },
    { id: 'nhie_c4', text: "Never have I ever stalked someone's Spotify or Instagram activity to see if they're ignoring my text.", category: "Petty Detective", spice: "SAVAGE" },
    { id: 'nhie_c5', text: "Never have I ever taken a screenshot of a chat to send to someone else, but accidentally sent it back to the same person.", category: "Nightmare Fuel", spice: "SAVAGE" },
    { id: 'nhie_c6', text: "Never have I ever ordered food on Swiggy or Zomato while in the middle of cooking because I gave up.", category: "Adulting", spice: "MILD" },
    { id: 'nhie_c7', text: "Never have I ever pulled an 'Irish Exit' and slipped out of a party without saying goodbye to anyone.", category: "Social Battery", spice: "SPICY" },
    { id: 'nhie_c8', text: "Never have I ever rehearsed an entire imaginary phone call or confrontation in the shower.", category: "Shower Thoughts", spice: "MILD" },
    { id: 'nhie_c9', text: "Never have I ever bought something online at 2 AM that I had zero practical use for when the box arrived.", category: "Late Night Regret", spice: "MILD" },
    { id: 'nhie_c10', text: "Never have I ever skipped someone's song in the car while pretend-looking for the air conditioning button.", category: "Aux Cord Wars", spice: "SPICY" }
  ],
  DATING_CRUSHES: [
    { id: 'nhie_d1', text: "Never have I ever asked my friend to call me with a fake emergency so I could escape a bad date.", category: "Escape Route", spice: "SPICY" },
    { id: 'nhie_d2', text: "Never have I ever stalked someone's old Instagram photos from 2017 and lived in fear of double-tapping by mistake.", category: "Stalking 101", spice: "SAVAGE" },
    { id: 'nhie_d3', text: "Never have I ever drafted a risky text in my Notes app and had two friends review it before hitting send.", category: "Group Council", spice: "MILD" },
    { id: 'nhie_d4', text: "Never have I ever pretended to like a niche band, anime, or sports team just because my crush was into it.", category: "Simp Confessions", spice: "SPICY" },
    { id: 'nhie_d5', text: "Never have I ever checked someone's follower count to see if it went up by 1 after they left me on delivered.", category: "FBI Mode", spice: "SAVAGE" },
    { id: 'nhie_d6', text: "Never have I ever sent a risky message at 3 AM and immediately put my phone into Airplane Mode.", category: "Panic Button", spice: "SAVAGE" },
    { id: 'nhie_d7', text: "Never have I ever gone to an event purely because I knew one specific person was going to show up.", category: "The Bait", spice: "SPICY" }
  ],
  COLLEGE_HOSTEL: [
    { id: 'nhie_h1', text: "Never have I ever eaten Maggi or noodles directly out of the electric kettle because there were no clean bowls.", category: "Hostel Gourmet", spice: "MILD" },
    { id: 'nhie_h2', text: "Never have I ever attended an 8 AM lecture in my pajamas while praying the professor wouldn't ask me to turn on my mic.", category: "Survival", spice: "MILD" },
    { id: 'nhie_h3', text: "Never have I ever blamed a weird room smell on my roommate when it was definitely my gym laundry.", category: "Roommate Treason", spice: "SPICY" },
    { id: 'nhie_h4', text: "Never have I ever studied an entire semester's syllabus in the 4 hours before the exam on 1.75x YouTube.", category: "One Night Stand", spice: "MILD" },
    { id: 'nhie_h5', text: "Never have I ever 'borrowed' a charger, hoodie, or lighter and completely adopted it as my own property.", category: "Hostel Taxes", spice: "SPICY" }
  ]
};

// Flattened helper for rapid shuffle
export function getRandomNhiePrompt(category = 'ALL') {
  let pool = [];
  if (category === 'ALL') {
    pool = [...NEVER_HAVE_I_EVER_DECKS.CHAOS, ...NEVER_HAVE_I_EVER_DECKS.DATING_CRUSHES, ...NEVER_HAVE_I_EVER_DECKS.COLLEGE_HOSTEL];
  } else if (NEVER_HAVE_I_EVER_DECKS[category]) {
    pool = NEVER_HAVE_I_EVER_DECKS[category];
  } else {
    pool = NEVER_HAVE_I_EVER_DECKS.CHAOS;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
