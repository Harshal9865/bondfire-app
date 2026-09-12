// ==============================================================================
// BONDFIRE TRUTH OR DARE DATASET (Real Human Situations & Dares)
// Zero robotic jargon. Authentic friend & couple party moments.
// Levels: MILD (Icebreaker), SPICY (Juicy/Awkward), CHAOS (Unhinged Dares)
// ==============================================================================

export const TRUTHS_DATA = {
  MILD: [
    'What is the most embarrassing thing currently in your browser search history?',
    'Have you ever pretended to be sick just to avoid hanging out with someone in this room?',
    'What is one lie you told on your resume or in a job interview that you still pray nobody verifies?',
    'What was your first impression of the host when you first met them?',
    'Who in this room would you trust the least to babysit your dog or watch your phone for an hour?',
    'What is the longest you have gone without showering and what was the excuse?',
    'Have you ever sent a screenshot of a conversation back to the person you took the screenshot of?'
  ],
  SPICY: [
    'Who in this room would you least want to be stuck in an elevator with for 6 hours?',
    'Have you ever stalked an ex’s new partner on Instagram using a fake account?',
    'What is something petty that someone did years ago that you secretly still have not forgiven them for?',
    'What is the worst text message you have ever sent to the completely wrong person?',
    'If you had to delete one person in this room from the group chat forever, who would cause the least drama?',
    'Have you ever ghosted someone and then bumped into them in person at a grocery store or cafe?',
    'What is a secret opinion about someone in this group that you have never said out loud?'
  ],
  SAVAGE: [
    'Read out loud the last 3 direct messages you received on Instagram or WhatsApp with zero context.',
    'Who in this room do you think has the absolute worst taste in romantic partners?',
    'Have you ever secretly disliked a gift someone in this room gave you and re-gifted or hid it?',
    'What is the biggest red flag about yourself that you actively hide when dating someone new?'
  ]
};

export const DARES_DATA = {
  MILD: [
    'Do your absolute best 30-second dramatic impression of the person to your left ordering coffee or food.',
    'Let the group pick any emoji and send it with no explanation to your 3rd most recent chat.',
    'Speak only in rhymes for the next 2 full rounds of the game.',
    'Show the group the most unhinged candid photo in your camera roll right now.',
    'Drink a glass of water without using your hands.'
  ],
  SPICY: [
    'Let the person on your right write any 3-word message and send it to your close friends story.',
    'Call a random pizza or fast food place and ask if they sell emotional validation.',
    'Put your phone on speaker and call a friend to tell them you just adopted a pet goat.',
    'Swap one article of clothing (jacket, hat, or shoes) with the player opposite you for the rest of the game.',
    'Let the squad go through your photo gallery for exactly 45 seconds while you stay silent.'
  ],
  CHAOS: [
    'Let the group dictate your WhatsApp status for the next 1 hour.',
    'Do 15 pushups or eat a spoonful of hot sauce / raw lemon wedge right now.',
    'Send a voice note to the host singing the chorus of any Bollywood song like an opera singer.',
    'Post an extreme close-up of your forehead on Instagram with the caption: “Big announcements coming soon.”'
  ]
};

export function getRandomTruth(level = 'MILD') {
  const list = TRUTHS_DATA[level] || TRUTHS_DATA.MILD;
  return list[Math.floor(Math.random() * list.length)];
}

export function getRandomDare(level = 'MILD') {
  const list = DARES_DATA[level] || DARES_DATA.MILD;
  return list[Math.floor(Math.random() * list.length)];
}
