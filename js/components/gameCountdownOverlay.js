// ==============================================================================
// FULLSCREEN GAME COUNTDOWN & RULES EXAMPLE ENGINE (js/components/gameCountdownOverlay.js)
// 1. Interactive "How It Works" visual card with dynamic rules, sample round & normal timer
// 2. Full-screen center-to-corner expanding circular wave countdown (5-4-3-2-1)
// ==============================================================================

import { store } from '../state/store.js';
import { audio } from '../visuals/audioSynth.js';
import { ConfettiEngine } from '../visuals/confetti.js';

let confettiInstance = null;

/**
 * Returns dynamic, authentic, highly engaging game examples for each game mode.
 * Dynamically uses real connected player names from the room instead of bot placeholders.
 */
/**
 * Returns dynamic, authentic, highly engaging game examples for each game mode.
 * Dynamically uses real connected player names from the room instead of bot placeholders.
 * Formatted with 3-step visual rules (Setup, Action, Win) and Group/Duos/Solo play modes.
 */
export function getExampleForMode(modeKey, customTitle, currentPlayMode = null) {
  const state = store.getState();
  const playMode = currentPlayMode || state.arcadePlayMode || 'GROUP';
  const roomCampers = state.activeRoom?.players || state.activeRoom?.campers || [];
  const camperNames = roomCampers.map((c) => c.name).filter(Boolean);
  const currentUserName = state.currentUser?.displayName ? state.currentUser.displayName.split(' ')[0] : 'Host (You)';
  const activeRoster = camperNames.length > 0 ? camperNames : [currentUserName, 'Player 2'];

  const p1 = activeRoster[0] || currentUserName;
  const p2 = activeRoster[1] || (activeRoster.length > 1 ? activeRoster[1] : 'Partner');
  const p3 = activeRoster[2] || 'Camper 3';

  const normalized = (modeKey || 'SQUAD').toUpperCase();

  switch (normalized) {
    case 'RAJA_MANTRI':
      return {
        icon: 'crown',
        themeColor: 'amber-gold',
        badge: 'Raja Mantri Chor Sipahi · Imperial Chits',
        title: 'Raja Mantri Chor Sipahi',
        tagline: 'The iconic 4-player royal chit bluffing game from childhood!',
        summary: 'Secret royal chits are shuffled: Raja (1000 pts), Mantri (800 pts), Chor (0 pts), Sipahi (500 pts). The Mantri must deduce and catch the Chor!',
        steps: [
          { num: '1', title: 'Royal Chits', desc: '4 secret digital chits are dealt: Raja (1000), Mantri (800), Sipahi (500), Chor (0).' },
          { num: '2', title: 'The Proclamation', desc: 'Raja asks “Mera Mantri Kaun?!” Mantri steps forward to inspect the suspects.' },
          { num: '3', title: 'The Verdict', desc: 'Catch the Chor = Mantri keeps 800 pts. Wrong guess = Chor steals all 800 pts!' }
        ],
        playModes: {
          GROUP: '4 Campers · Secret phone chits and live living room accusations.',
          DUOS: '1v1 Royal Duel · Human Mantri vs Human Chor hiding behind 2 court suspects.',
          SOLO: 'Detective Run · Play as Mantri deducing the Chor from behavioral tells.'
        },
        sampleCard: {
          tag: 'Live Sample · Royal Court Dilemma',
          question: 'Mantri ji, inspect the suspects! Who is the Chor hiding among us?',
          options: [`${p2} (Nervous Smile)`, `${p3} (Calm Sipahi)`, 'Suspect C (Shifty Eyes)'],
          correctIndex: 0,
        },
        scoringHint: 'Correct identification awards the Mantri 800 pts. A wrong guess transfers the bounty to the Chor!',
      };

    case 'TAMBOLA':
    case 'HOUSIE':
      return {
        icon: 'casino',
        themeColor: '[#06D6A0]',
        badge: 'Desi Tambola · Indian Housie 1-90',
        title: 'Desi Tambola Housie',
        tagline: 'Authentic 90-coin Indian Housie with rhymes and live tickets!',
        summary: 'Numbers 1 to 90 are called live with authentic Hindi & English rhymes. Tap your 3x9 ticket numbers to daub them and claim Early 5, Lines, Corners, or Full House!',
        steps: [
          { num: '1', title: '3x9 Ticket', desc: 'Every camper gets an authentic ticket with 15 randomized numbers (5 per row).' },
          { num: '2', title: 'Live Caller', desc: 'Tokens 1–90 are drawn with authentic rhymes (“Sweet 16”, “Two Little Ducks”).' },
          { num: '3', title: 'Claim Rewards', desc: 'Tap numbers to daub. Claim Jaldi 5, Lines, or Full House for the room jackpot!' }
        ],
        playModes: {
          GROUP: 'Party Room · Multi-ticket squad session with live room caller.',
          DUOS: '1v1 Ticket Clash · Head-to-head race to claim Jaldi 5 first.',
          SOLO: 'Speed Caller · Daub against automated caller to set personal speed record.'
        },
        sampleCard: {
          tag: 'Live Sample · Next Token Draw',
          question: 'Caller shouts: "Sweet Sixteen · Sone Pe Suhaga · Number 16!" Daub your ticket!',
          options: ['Mark Number 16', 'Claim Jaldi 5', 'Claim Corners', 'Claim Full House'],
          correctIndex: 0,
        },
        scoringHint: 'Be the first to claim authentic winning combinations to claim the room jackpot!',
      };

    case 'BOLLYWOOD':
    case 'ANTAKSHARI':
      return {
        icon: 'movie',
        themeColor: 'rose-400',
        badge: 'Bollywood Antakshari · Filmi Masala',
        title: 'Bollywood Antakshari & Masala',
        tagline: 'Rapid-fire Bollywood showdown with iconic songs and dialogues!',
        summary: 'Fast-paced Bollywood showdown with 15s shot clock! Solve Antakshari letter chains, decipher iconic dialogues, and guess movie titles from emoji clues!',
        steps: [
          { num: '1', title: 'Filmi Clue', desc: 'Receive an Antakshari letter chain (“A se”), dialogue quote, or emoji riddle.' },
          { num: '2', title: '15s Shot Clock', desc: 'Beat the clock and pick the correct track, actor, or dialogue completion.' },
          { num: '3', title: 'Sparks Bonus', desc: 'Maintain your answer streak for 2x combo multipliers and Campfire Sparks!' }
        ],
        playModes: {
          GROUP: 'Squad Relay · Campers collaborate or pass \'n play on every clue.',
          DUOS: '1v1 Filmi Showdown · Alternating turns with live head-to-head scoreboard.',
          SOLO: '15s Blitz Run · Solo trivia sprint to climb the Shehenshah leaderboard.'
        },
        sampleCard: {
          tag: 'Live Sample · Letter "A" Hook',
          question: 'Antakshari Letter "A" - The viral 2024 chartbuster track featuring Tamannaah Bhatia:',
          options: ['Aaj Ki Raat (Stree 2)', 'Apna Bana Le (Bhediya)', 'Aayi Nai (Stree 2)', 'Aankh Marey'],
          correctIndex: 0,
        },
        scoringHint: 'Fast answers earn speed streak bonuses and Campfire Sparks!',
      };

    case 'BOTTLE':
      return {
        icon: 'wine_bar',
        themeColor: 'sunset-coral',
        badge: 'Spin The Bottle · Party Arcade',
        title: 'Spin the Bottle',
        tagline: 'Real inertia bottle physics spinning in the living room!',
        summary: 'A digital 3D retro bottle spins with real physics synced across all phones and laptops. Whoever the bottle points to faces Truth, Dare, or Roast!',
        steps: [
          { num: '1', title: 'Swipe to Spin', desc: 'Flick or tap the 3D vintage bottle with realistic momentum deceleration.' },
          { num: '2', title: 'Points at Camper', desc: 'The bottle neck stops pointing directly at a camper in your circle.' },
          { num: '3', title: 'Truth or Dare', desc: 'Pick your challenge level: Mild, Spicy, or Savage to earn Campfire Sparks!' }
        ],
        playModes: {
          GROUP: 'Party Circle · All room campers arranged evenly in 360° arena.',
          DUOS: '2-Player Intimate Duel · Bottle spins strictly between You & Your Partner.',
          SOLO: 'Daily Dare Wheel · Spin for a personal spicy truth or daily creative dare.'
        },
        sampleCard: {
          tag: 'Live Sample · The Bottle Stopped On You',
          question: 'The bottle pointed at you! Choose your fate:',
          options: ['Confess your most embarrassing search query', 'Do your best 10s impression of host', 'Show your last 3 camera roll photos'],
          correctIndex: 0,
        },
        scoringHint: 'Real-time synced physics across all devices. Zero bots, pure laughter!',
      };

    case 'NHIE':
      return {
        icon: 'pan_tool',
        themeColor: 'duo-rose',
        badge: 'Never Have I Ever · 5 Fingers Up',
        title: 'Never Have I Ever',
        tagline: '10-finger stamina survivor arena for friend groups!',
        summary: 'Everyone holds up 5 fingers. When a prompt applies to you, tap \'I Have\' to drop a finger and take a sip! Last camper standing wins.',
        steps: [
          { num: '1', title: '10 Fingers Up', desc: 'Every camper begins with 10 stamina fingers visible on screen.' },
          { num: '2', title: 'Wild Statement', desc: 'An unfiltered everyday confession appears (dating, college lore, secrets).' },
          { num: '3', title: 'Drop a Finger', desc: 'If guilty, tap “I Have” to drop a finger! Last camper with fingers wins.' }
        ],
        playModes: {
          GROUP: 'Squad Survivor · Live grid tracking all campers\' remaining fingers.',
          DUOS: '1v1 Bestie / Couples Showdown · Side-by-side meters, see who drops first!',
          SOLO: 'Guilt Meter & Confessional · Rate 10 prompts to calculate your Innocence Score.'
        },
        sampleCard: {
          tag: 'Live Sample · 5 Fingers Up',
          question: 'Never Have I Ever re-gifted a birthday present to someone in this very friend group.',
          options: ['I Have (Drop 1 Finger)', 'Never In My Life'],
          correctIndex: 0,
        },
        scoringHint: 'Clean, unfiltered, synced live across all phones in the room.',
      };

    case 'MOST_LIKELY_TO':
      return {
        icon: 'how_to_vote',
        themeColor: 'amber-gold',
        badge: 'Most Likely To... · Savage Ballot',
        title: 'Most Likely To',
        tagline: 'Secret ballot voting and roast consensus with live percentages!',
        summary: 'A wild superlative appears on all screens simultaneously. Everyone votes for the squad member who fits the description best!',
        steps: [
          { num: '1', title: 'The Superlative', desc: 'A hilarious roast statement appears on all campers\' screens simultaneously.' },
          { num: '2', title: 'Secret Ballot', desc: 'Everyone taps the camper who fits best without seeing others\' votes.' },
          { num: '3', title: 'Live Verdict', desc: 'Percentage bars reveal the consensus roasted winner with confetti fire!' }
        ],
        playModes: {
          GROUP: 'Squad Ballot · Room consensus with animated percentage bars.',
          DUOS: 'Who\'s More Likely? · 2-player debate (You vs Partner); matching votes win Sparks!',
          SOLO: 'Roast Archive · Assign prompts to your favorite memories and archetypes.'
        },
        sampleCard: {
          tag: 'Live Sample · Group Chat Lore',
          question: 'Who is most likely to text "I\'m 5 mins away" while still in bed wrapped in a blanket?',
          options: [p1, p2, p3, 'The Whole Squad'],
          correctIndex: 0,
        },
        scoringHint: 'Fastest matching votes earn combo multiplier fire and Sparks!',
      };

    case 'WATCH':
    case 'SHOWS':
    case 'ARCADE':
      return {
        icon: 'movie',
        themeColor: '[#7C4DFF]',
        badge: 'Retro Pixel Glade · Arcade Party',
        title: 'Watch Party & Stream',
        tagline: 'Synchronized stream viewing with live reaction bursts!',
        summary: 'Multiplayer party spinners, rapid buzzers, and retro mini-games synced with zero latency across all devices.',
        steps: [
          { num: '1', title: 'Shared Stream', desc: 'Paste any video link to watch synchronized with friends room-wide.' },
          { num: '2', title: 'Reaction Bursts', desc: 'Tap floating reaction tokens and sound effects that burst on all screens.' },
          { num: '3', title: 'Pause & Predict', desc: 'Host can pause at cliffhangers and trigger instant squad predictions!' }
        ],
        playModes: {
          GROUP: 'Squad Cinema · Big screen synced room with floating emoji bursts.',
          DUOS: 'Date Lounge · Private 2-player synced cinema with shared notes.',
          SOLO: 'Personal Cinema · Ad-free lounge with personal reaction timestamps.'
        },
        sampleCard: {
          tag: 'Live Sample · Speed Buzzer',
          question: 'Rapid Fire: Tap your buzzer the instant you hear the campfire chime!',
          options: ['Buzzer 1 (Ready)', 'Buzzer 2 (Locked In)'],
          correctIndex: 0,
        },
        scoringHint: 'Tap the buzzer first to win bonus combo multipliers!',
      };

    case 'RED_FLAG_COURT':
      return {
        icon: 'gavel',
        themeColor: 'amber-gold',
        badge: 'The Red Flag Courtroom · Party Trial',
        title: 'The Red Flag Courtroom',
        tagline: 'Living room trial of petty friendship crimes!',
        summary: 'A petty crime or red flag is brought to the bench. The jury hears the exhibit, examines the defendant, and casts a verdict: Guilty, Innocent, or Community Service!',
        steps: [
          { num: '1', title: 'The Indictment', desc: 'A hilarious friendship crime and evidence exhibit is read aloud.' },
          { num: '2', title: 'Defendant Plea', desc: 'The accused camper gives their desperate 20-second defense.' },
          { num: '3', title: 'Jury Sentence', desc: 'Squad votes Guilty or Innocent; majority vote enforces the roast penalty!' }
        ],
        playModes: {
          GROUP: 'Full Courtroom · Host is Judge, campers are Jury casting live verdicts.',
          DUOS: '1v1 Couples Trial · Debate petty crimes with mutual veto power.',
          SOLO: 'Docket Review · Inspect funny case archives and vote on guilty verdicts.'
        },
        sampleCard: {
          tag: 'Sample Case #204 · Kitchen Felony',
          question: `Defendant left an empty milk carton back in the fridge. How does the squad plead?`,
          options: ['Guilty: 20 Squats / Pushups', 'Innocent: There was 1 drop left', 'Sentence: Make Chai For All', 'Mistrial: We all did this'],
          correctIndex: 0,
        },
        scoringHint: 'Majority vote passes the binding squad sentence and earns 100+ Sparks!',
      };

    case 'CONFESSION_VAULT':
      return {
        icon: 'lock',
        themeColor: 'duo-rose',
        badge: 'Anonymous Confession Vault · Secret Whodunit',
        title: 'Anonymous Confession Vault',
        tagline: 'Guess which friend in the room wrote the anonymous secret!',
        summary: 'A spicy, funny, or chaotic secret appears on all screens completely anonymously. Everyone must guess which squad camper wrote it!',
        steps: [
          { num: '1', title: 'Unsealed Secret', desc: 'An anonymous confession appears on all screens simultaneously.' },
          { num: '2', title: 'Detective Guess', desc: 'Inspect your friends\' reactions and secretly vote on the author.' },
          { num: '3', title: 'The Unmasking', desc: 'Correct detective deductions earn 150 Sparks and bragging rights!' }
        ],
        playModes: {
          GROUP: 'Squad Whodunit · All room campers vote on who among them is the culprit.',
          DUOS: 'Partner Secrets · Guess which couple memory or secret belongs to whom.',
          SOLO: 'Archive Detective · Read vaults secrets and test your deductive intuition.'
        },
        sampleCard: {
          tag: 'Sample Secret · 100% Anonymous',
          question: '“I once muted a work meeting to sing along full-volume to Choo Lo, not realizing my mic was on.”',
          options: [p1, p2, p3, 'A Mysterious Guest'],
          correctIndex: 1,
        },
        scoringHint: 'Guess the real culprit! Accurate detective votes earn 150 Sparks.',
      };

    case 'HOT_SEAT':
      return {
        icon: 'local_fire_department',
        themeColor: 'sunset-coral',
        badge: 'Hot Seat Roulette · Deep & Unfiltered',
        title: 'Hot Seat Roulette',
        tagline: 'One camper on the hot seat with 30s to answer or take a penalty!',
        summary: 'The wheel picks one camper for the hot seat. The squad fires an unfiltered dilemma. The hot seat camper has 30 seconds to answer or take a penalty!',
        steps: [
          { num: '1', title: 'Wheel Spins', desc: 'The roulette wheel lands on one camper to take the hot seat.' },
          { num: '2', title: 'Deep Dilemma', desc: 'An unfiltered, deep question is presented with a 30s countdown.' },
          { num: '3', title: 'Truth or Pass', desc: 'Answer truthfully for +150 Sparks or take the squad dare penalty!' }
        ],
        playModes: {
          GROUP: 'Full Hot Seat · Entire squad watches the timer and rates the answer honesty.',
          DUOS: 'Couples Deep Talk · Intimate back-and-forth deep questions with zero pressure.',
          SOLO: 'Self Reflection · 30s journaling reflection prompt for personal growth.'
        },
        sampleCard: {
          tag: 'Sample Round · Unfiltered Truth',
          question: '“If this squad was stuck on an island, who is the first person you would NOT trust to build the shelter?”',
          options: ['The Over-Confident Architect', 'The One Who Gets Tired in 5 Mins', 'The Group Chat Lurker', 'Take a Sip / Pass'],
          correctIndex: 0,
        },
        scoringHint: '30 seconds on the hot seat. No dodging, 100% real bonding!',
      };

    case 'INSIDE_JOKES':
      return {
        icon: 'history_edu',
        themeColor: 'amber-gold',
        badge: 'Inside Joke Mystery · Vault Flashback',
        title: 'Inside Joke Mystery Deck',
        tagline: 'Memories and quotes from your shared vault turned into trivia!',
        summary: 'Memories, quotes, and funny inside jokes from your shared vault are turned into playable trivia rounds with real photos and voice notes.',
        steps: [
          { num: '1', title: 'Vault Archive', desc: 'Real photos, screenshots, and quotes are pulled from your squad vault.' },
          { num: '2', title: 'Guess Lore', desc: 'Guess who said it, which trip it occurred on, or how the disaster ended.' },
          { num: '3', title: 'Yearbook Card', desc: 'Winning answers earn custom digital stickers for your photo yearbook!' }
        ],
        playModes: {
          GROUP: 'Squad Memories · Nostalgic trip down memory lane with live roasts.',
          DUOS: 'Relationship Timeline · Reminisce over shared dates, trips, and milestones.',
          SOLO: 'Time Capsule · Browse your saved memory vault and test your memory.'
        },
        sampleCard: {
          tag: 'Sample Round · Archive Flashback',
          question: '“Who said: \'Bro tension mat le, main sambhal loonga\' 5 minutes before absolute disaster?”',
          options: [p1, p2, p3, 'Nobody Admits It'],
          correctIndex: 0,
        },
        scoringHint: 'Guess the author or the trip date to unlock custom yearbook superlatives!',
      };

    case 'US':
    case 'COUPLE':
      return {
        icon: 'favorite',
        themeColor: 'duo-rose',
        badge: 'Us Mode · Couples Date Night',
        title: 'Couples Date Night',
        tagline: 'Answer relationship lore questions privately and see if you match!',
        summary: 'Answer personalized questions about your relationship lore. Lock in your choices privately to see if your answers match when revealed!',
        steps: [
          { num: '1', title: 'Private Choice', desc: 'A question about your relationship lore appears on both phones.' },
          { num: '2', title: 'Lock In', desc: 'Both partners pick their answer privately without peeking.' },
          { num: '3', title: 'The Match', desc: 'Answers reveal simultaneously; matches earn Compatibility Sparks!' }
        ],
        playModes: {
          GROUP: 'Double Date · Couples compete against each other to see who matches most.',
          DUOS: 'Private Date Night · 1v1 intimate connection, shared notes, and memory unlocks.',
          SOLO: 'Love Notes · Prepare answers and love letters to send to your partner.'
        },
        sampleCard: {
          tag: 'Sample Memory · Chapter 1: The Spark',
          question: 'Who takes longer to pack their bags before a weekend getaway?',
          options: [p1, p2],
          correctIndex: 1,
        },
        scoringHint: 'Matching answers unlock Compatibility Sparks and unseal secret vault notes!',
      };

    case 'SOLO':
      return {
        icon: 'person',
        themeColor: 'mint-green',
        badge: 'Solo Mode · Memory Quest',
        title: 'Solo Reflection',
        tagline: 'Journey through your personal memory archives at your own pace!',
        summary: 'Journey through your personal memory archives, past adventures, and daily reflection prompts at your own pace.',
        steps: [
          { num: '1', title: 'Daily Prompt', desc: 'A thoughtful reflection or time capsule prompt is revealed.' },
          { num: '2', title: 'Answer & Archiving', desc: 'Record your memories, upload photo receipts, and log your thoughts.' },
          { num: '3', title: 'Citizen Rank', desc: 'Earn daily Sparks to unlock custom themes, perks, and yearbook designs.' }
        ],
        playModes: {
          GROUP: 'Solo in Room · Compare your daily reflections with friends later in vault.',
          DUOS: 'Partner Reflection · Share answers with your favorite person.',
          SOLO: 'Personal Vault · Private journaling and time capsule storage.'
        },
        sampleCard: {
          tag: 'Sample Prompt · Time Capsule 2024',
          question: 'What was your single most spontaneous trip or decision this past year?',
          options: ['Midnight Road Trip', 'Surprise Concert', 'New Career Pivot', 'Random Weekend Stay'],
          correctIndex: 0,
        },
        scoringHint: 'Complete daily prompts to level up your Citizen tier and unlock custom yearbook covers!',
      };

    default:
      return {
        icon: 'local_fire_department',
        themeColor: 'sunset-coral',
        badge: 'Squad Party Mode · Real-time Multiplayer',
        title: customTitle || 'How Squad Games Work',
        tagline: 'Synced living room multiplayer with zero latency!',
        summary: 'Questions and dilemma cards appear on all connected screens at the exact same moment. Lock in your choice before the timer expires!',
        steps: [
          { num: '1', title: 'Screen Sync', desc: 'Cards and timers appear on all connected screens in real time.' },
          { num: '2', title: 'Vote Fast', desc: 'Lock in your answer before the shot clock timer runs down.' },
          { num: '3', title: 'Win Sparks', desc: 'Consensus votes and correct guesses award room combo fire and Sparks!' }
        ],
        playModes: {
          GROUP: 'Squad Room · 3+ campers connected with real-time audio and voting.',
          DUOS: 'Head-to-Head · 2-player duel with instant comparison and score tracking.',
          SOLO: 'Solo Practice · Single player challenge to sharpen your reflexes.'
        },
        sampleCard: {
          tag: 'Sample Round · Living Room Trial',
          question: 'Who is most likely to check their phone 40 times during a movie and then ask "Wait what happened?"',
          options: [p1, p2, p3, 'The Whole Squad'],
          correctIndex: 0,
        },
        scoringHint: 'Fastest matching votes earn 100+ Sparks and combo multiplier fire!',
      };
  }
}

export const MODE_EXAMPLES = getExampleForMode;

const COUNTDOWN_STEPS = [
  {
    num: '5',
    sub: 'GET READY',
    bgColor: '#7209B7', // Deep Electric Violet
    textColor: '#E0AAFF',
    accentColor: '#C77DFF',
    desc: 'Connect all campers',
  },
  {
    num: '4',
    sub: 'SCREENS SYNCED',
    bgColor: '#06D6A0', // Cyan / Cyber Aqua / Mint #06D6A0
    textColor: '#0B0E17',
    accentColor: '#00F5D4',
    desc: 'Audio & buzzers active',
  },
  {
    num: '3',
    sub: 'LOCK IN FOCUS',
    bgColor: '#FFB703', // Amber Gold
    textColor: '#0B0E17',
    accentColor: '#FFE494',
    desc: 'Hands on buttons',
  },
  {
    num: '2',
    sub: 'BUZZERS LIVE',
    bgColor: '#FF5A5F', // Sunset Coral
    textColor: '#FFFFFF',
    accentColor: '#FFA39E',
    desc: 'First to vote wins bonus',
  },
  {
    num: '1',
    sub: 'IGNITE!',
    bgColor: '#F72585', // Hot Flame Rose
    textColor: '#FFFFFF',
    accentColor: '#FF70A6',
    desc: 'Game starting now!',
  },
];

/**
 * Triggers the full game start sequence:
 * 1. Shows "How It Works" visual card with rules, sample question & normal 5s timer
 * 2. Runs the 5-4-3-2-1 center-to-corner expanding circular shockwave countdown covering 100% of screen
 * 3. Calls onComplete() to load active game screen
 */
export function triggerGameCountdown({ mode = 'SQUAD', title, onComplete, skipExample = false }) {
  const mount = document.getElementById('countdown-mount') || document.body;
  if (!confettiInstance && typeof ConfettiEngine !== 'undefined') {
    try {
      confettiInstance = new ConfettiEngine('confetti-canvas');
    } catch (_) {}
  }

  const exampleData = getExampleForMode(mode, title);

  // Clean any existing overlay
  const existing = document.getElementById('game-countdown-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'game-countdown-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden';
  overlay.style.backgroundColor = 'rgba(11, 14, 23, 0.96)';
  overlay.style.backdropFilter = 'blur(20px)';
  overlay.style.webkitBackdropFilter = 'blur(20px)';
  mount.appendChild(overlay);

  // Persistent Emergency Skip/Close button
  const emergencyCloseBtn = document.createElement('button');
  emergencyCloseBtn.id = 'btn-countdown-emergency-close';
  emergencyCloseBtn.type = 'button';
  emergencyCloseBtn.className = 'absolute top-4 right-4 z-[120] p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-lg backdrop-blur-md active:scale-95 group';
  emergencyCloseBtn.title = 'Skip & Jump to Game';
  emergencyCloseBtn.innerHTML = `
    <span class="material-symbols-outlined text-lg sm:text-xl group-hover:rotate-90 transition-transform">close</span>
  `;
  emergencyCloseBtn.addEventListener('click', () => {
    try { audio.playClick(); } catch (_) {}
    overlay.remove();
    if (typeof onComplete === 'function') {
      try { onComplete(); } catch (err) { console.error(err); }
    }
  });
  overlay.appendChild(emergencyCloseBtn);

  if (skipExample) {
    runExpandingCircleCountdown(overlay, onComplete);
  } else {
    renderExampleStage(overlay, exampleData, title, onComplete);
  }
}

/**
 * Builds the redesigned aesthetic visual example card HTML.
 * Includes 3-step visual guide, active play mode pill, and interactive live sample card.
 */
export function buildExampleCardHtml(exampleData, customTitle, activePlayMode, isCountdown = true, secondsRemaining = 5) {
  const modeKey = activePlayMode || 'GROUP';
  const modeText = (exampleData.playModes && exampleData.playModes[modeKey]) 
    ? exampleData.playModes[modeKey] 
    : (exampleData.summary || 'Real-time party multiplayer on all screens.');

  const modeBadge = modeKey === 'SOLO' 
    ? { icon: 'person', label: 'Solo Practice Run', color: 'text-mint-green bg-mint-green/15 border-mint-green/30' }
    : modeKey === 'DUOS'
      ? { icon: 'people', label: '1v1 Head-to-Head Duel', color: 'text-duo-rose bg-duo-rose/15 border-duo-rose/30' }
      : { icon: 'groups', label: 'Squad Living Room Party', color: 'text-amber-gold bg-amber-gold/15 border-amber-gold/30' };

  return `
    <!-- Ambient Glow Behind Card -->
    <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-sunset-coral/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

    <!-- Top Header: Badge, Title & Timer/Close -->
    <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-amber-gold/20 border border-amber-gold/40 flex items-center justify-center text-amber-gold shrink-0 shadow-sm">
          <span class="material-symbols-outlined text-2xl">${exampleData.icon || 'tips_and_updates'}</span>
        </div>
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${modeBadge.color} text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
            <span class="material-symbols-outlined text-[13px]">${modeBadge.icon}</span>
            <span>${modeBadge.label}</span>
          </div>
          <h2 class="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            ${customTitle || exampleData.title}
          </h2>
        </div>
      </div>
      
      ${isCountdown ? `
        <!-- Normal Countdown Timer Pill -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-bright border border-border text-xs font-mono font-bold text-white shrink-0 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-sunset-coral animate-ping"></span>
          <span>Starts in <strong id="example-timer-count" class="text-sunset-coral font-black">${secondsRemaining}s</strong></span>
        </div>
      ` : `
        <button id="btn-close-example-modal" type="button" class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      `}
    </div>

    ${isCountdown ? `
      <!-- Linear Progress Bar on Example -->
      <div class="w-full bg-surface-bright/80 rounded-full h-1.5 overflow-hidden border border-border/80">
        <div id="example-timer-bar" class="h-full bg-gradient-to-r from-sunset-coral via-amber-gold to-duo-rose transition-all duration-1000 ease-linear rounded-full" style="width: 100%;"></div>
      </div>
    ` : ''}

    <!-- Tagline & Active Mode Rule Banner -->
    <div class="p-3 rounded-2xl bg-surface-bright/60 border border-white/5 flex items-center gap-2.5">
      <span class="material-symbols-outlined text-amber-gold text-lg shrink-0">info</span>
      <p class="text-xs text-gray-200 font-sans leading-relaxed">
        <strong class="text-white">${exampleData.tagline || exampleData.summary}</strong>
        <span class="text-gray-300 block mt-0.5 font-mono text-[11px]">${modeText}</span>
      </p>
    </div>

    <!-- 3-Step Visual Breakdown: Setup -> Action -> Win -->
    ${exampleData.steps && exampleData.steps.length === 3 ? `
      <div>
        <span class="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-2">How It Plays (3 Simple Steps)</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${exampleData.steps.map((st) => `
            <div class="p-2.5 rounded-xl bg-canvas/80 border border-white/10 flex flex-col gap-1">
              <div class="flex items-center gap-1.5 text-amber-gold">
                <span class="w-4 h-4 rounded-full bg-amber-gold text-dark font-black text-[10px] flex items-center justify-center font-mono shrink-0">${st.num}</span>
                <span class="text-xs font-bold font-sans text-white tracking-tight">${st.title}</span>
              </div>
              <p class="text-[11px] text-gray-300 leading-snug font-sans">${st.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Interactive Live Micro-Demo Card -->
    <div class="p-3.5 sm:p-4 rounded-2xl bg-canvas border border-amber-gold/30 flex flex-col gap-2.5 shadow-inner">
      <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span class="text-[10px] font-mono text-amber-gold uppercase font-bold tracking-wider flex items-center gap-1">
          <span class="material-symbols-outlined text-[13px]">touch_app</span>
          <span>${exampleData.sampleCard.tag || 'Interactive Live Sample'}</span>
        </span>
        <span class="text-[10px] font-mono text-mint-green font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"></span>
          Live Sample
        </span>
      </div>
      <p class="text-xs sm:text-sm text-white font-bold italic leading-snug">
        “${exampleData.sampleCard.question}”
      </p>
      <div class="grid grid-cols-2 gap-2 pt-1" id="example-options-grid">
        ${exampleData.sampleCard.options.map((opt, idx) => `
          <button type="button" class="btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${idx === exampleData.sampleCard.correctIndex ? 'bg-sunset-coral/20 border-sunset-coral text-white font-bold shadow-sm' : 'bg-surface-bright/60 border-border/60 text-gray-300 hover:bg-surface-bright'}" data-index="${idx}">
            <span class="truncate">${opt}</span>
            ${idx === exampleData.sampleCard.correctIndex ? '<span class="material-symbols-outlined text-[14px] text-sunset-coral shrink-0">check_circle</span>' : ''}
          </button>
        `).join('')}
      </div>
      <div class="text-[10.5px] font-mono text-gray-400 flex items-center justify-between pt-1 border-t border-white/5">
        <div class="flex items-center gap-1 truncate mr-2">
          <span class="material-symbols-outlined text-amber-gold text-[14px] shrink-0">electric_bolt</span>
          <span class="truncate">${exampleData.scoringHint}</span>
        </div>
        <span id="sample-demo-status" class="text-[10px] text-mint-green font-bold font-mono shrink-0">Tap an option to test!</span>
      </div>
    </div>

    <!-- Footer & Action Controls -->
    <div class="flex items-center justify-between pt-1 flex-wrap gap-2">
      <span class="text-[10px] font-mono text-gray-400">
        ${isCountdown ? 'Auto-advances to fullscreen countdown' : 'Ready to begin your session?'}
      </span>
      <button id="btn-skip-example" type="button" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-sunset-coral via-[#FF7064] to-amber-gold text-canvas font-black text-xs shadow-glow-coral hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
        <span>${isCountdown ? 'Skip & Start Now' : 'Play Now'}</span>
        <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
      </button>
    </div>
  `;
}

/**
 * Stage 1: How It Works Visual Card with Normal Timer & Interactive Choices
 */
function renderExampleStage(overlay, exampleData, customTitle, onComplete) {
  let secondsRemaining = 5;
  const totalSeconds = 5;
  let timerInterval = null;
  const activePlayMode = store.getState().arcadePlayMode || 'GROUP';

  const cardContainer = document.createElement('div');
  cardContainer.id = 'countdown-card-container';
  cardContainer.className = 'relative w-full max-w-xl mx-4 p-5 sm:p-7 rounded-3xl bg-surface border-2 border-amber-gold/50 shadow-2xl flex flex-col gap-3.5 text-on-surface transform transition-all duration-300 animate-countdown-punch select-none z-[105]';

  cardContainer.innerHTML = buildExampleCardHtml(exampleData, customTitle, activePlayMode, true, secondsRemaining);
  overlay.appendChild(cardContainer);

  const countEl = cardContainer.querySelector('#example-timer-count');
  const barEl = cardContainer.querySelector('#example-timer-bar');
  const skipBtn = cardContainer.querySelector('#btn-skip-example');
  const statusEl = cardContainer.querySelector('#sample-demo-status');

  // Interactive sample choices click handling
  const optionBtns = cardContainer.querySelectorAll('.btn-sample-option');
  optionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      optionBtns.forEach((b) => {
        b.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-surface-bright/60 border-border/60 text-gray-300';
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.remove();
      });

      if (idx === exampleData.sampleCard.correctIndex) {
        try { audio.playChime(); } catch (_) {}
        btn.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-mint-green/20 border-mint-green text-mint-green font-bold shadow-sm';
        btn.innerHTML = `<span class="truncate">${btn.textContent.trim()}</span><span class="material-symbols-outlined text-[14px] text-mint-green shrink-0">check_circle</span>`;
        if (statusEl) {
          statusEl.textContent = '✨ Great Choice! +100 Sparks';
          statusEl.className = 'text-[10px] text-mint-green font-bold font-mono shrink-0';
        }
      } else {
        try { audio.playClick(); } catch (_) {}
        btn.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-sunset-coral/20 border-sunset-coral text-white font-bold shadow-sm';
        btn.innerHTML = `<span class="truncate">${btn.textContent.trim()}</span><span class="material-symbols-outlined text-[14px] text-sunset-coral shrink-0">check_circle</span>`;
        if (statusEl) {
          statusEl.textContent = '⚡ Choice Locked In';
          statusEl.className = 'text-[10px] text-amber-gold font-bold font-mono shrink-0';
        }
      }
    });
  });

  const proceedToCountdown = () => {
    if (timerInterval) clearInterval(timerInterval);
    try { audio.playClick(); } catch (_) {}
    runExpandingCircleCountdown(overlay, onComplete);
  };

  if (skipBtn) skipBtn.addEventListener('click', proceedToCountdown);

  timerInterval = setInterval(() => {
    secondsRemaining--;
    if (countEl) countEl.textContent = `${secondsRemaining}s`;
    if (barEl) {
      const pct = Math.max(0, (secondsRemaining / totalSeconds) * 100);
      barEl.style.width = `${pct}%`;
    }
    try { audio.playTick(); } catch (_) {}
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      runExpandingCircleCountdown(overlay, onComplete);
    }
  }, 1000);
}

/**
 * Standalone Example Modal: Allows viewing rules & interactive demo directly from Arcade cards.
 */
export function showGameExampleModal({ mode = 'SQUAD', playMode = null, onLaunch = null }) {
  const mount = document.getElementById('countdown-mount') || document.body;
  const activeMode = playMode || store.getState().arcadePlayMode || 'GROUP';
  const exampleData = getExampleForMode(mode, null, activeMode);

  // Clean any existing modal
  const existing = document.getElementById('game-example-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'game-example-modal-backdrop';
  backdrop.className = 'fixed inset-0 z-[100] flex items-center justify-center select-none overflow-y-auto p-4';
  backdrop.style.backgroundColor = 'rgba(11, 14, 23, 0.88)';
  backdrop.style.backdropFilter = 'blur(16px)';
  backdrop.style.webkitBackdropFilter = 'blur(16px)';

  const cardContainer = document.createElement('div');
  cardContainer.id = 'countdown-card-container';
  cardContainer.className = 'relative w-full max-w-xl p-5 sm:p-7 rounded-3xl bg-surface border-2 border-amber-gold/50 shadow-2xl flex flex-col gap-3.5 text-on-surface transform transition-all duration-300 animate-countdown-punch select-none z-[105] my-auto';

  cardContainer.innerHTML = buildExampleCardHtml(exampleData, null, activeMode, false, 0);
  backdrop.appendChild(cardContainer);
  mount.appendChild(backdrop);

  // Close handlers
  const closeBtn = cardContainer.querySelector('#btn-close-example-modal');
  const closeModal = () => {
    try { audio.playClick(); } catch (_) {}
    backdrop.remove();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Launch button handler
  const launchBtn = cardContainer.querySelector('#btn-skip-example');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      closeModal();
      if (typeof onLaunch === 'function') {
        onLaunch();
      }
    });
  }

  // Interactive sample choices click handling
  const optionBtns = cardContainer.querySelectorAll('.btn-sample-option');
  const statusEl = cardContainer.querySelector('#sample-demo-status');
  optionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      optionBtns.forEach((b) => {
        b.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-surface-bright/60 border-border/60 text-gray-300';
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.remove();
      });

      if (idx === exampleData.sampleCard.correctIndex) {
        try { audio.playChime(); } catch (_) {}
        btn.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-mint-green/20 border-mint-green text-mint-green font-bold shadow-sm';
        btn.innerHTML = `<span class="truncate">${btn.textContent.trim()}</span><span class="material-symbols-outlined text-[14px] text-mint-green shrink-0">check_circle</span>`;
        if (statusEl) {
          statusEl.textContent = '✨ Great Choice! +100 Sparks';
          statusEl.className = 'text-[10px] text-mint-green font-bold font-mono shrink-0';
        }
      } else {
        try { audio.playClick(); } catch (_) {}
        btn.className = 'btn-sample-option p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer bg-sunset-coral/20 border-sunset-coral text-white font-bold shadow-sm';
        btn.innerHTML = `<span class="truncate">${btn.textContent.trim()}</span><span class="material-symbols-outlined text-[14px] text-sunset-coral shrink-0">check_circle</span>`;
        if (statusEl) {
          statusEl.textContent = '⚡ Choice Locked In';
          statusEl.className = 'text-[10px] text-amber-gold font-bold font-mono shrink-0';
        }
      }
    });
  });
}

/**
 * Stage 2: Fullscreen 5-4-3-2-1 Center-to-Corner Expanding Circular Shockwave Countdown
 * Expands in a circle from center (50%, 50%) until it covers 100% of all screens in 5 distinct colors.
 */
function runExpandingCircleCountdown(overlay, onComplete) {
  try { audio.playChime(); } catch (_) {}
  let stepIndex = 0;
  let isDone = false;

  // Crucial: Strip backdropFilter so screen NEVER locks in a blur!
  overlay.style.backdropFilter = 'none';
  overlay.style.webkitBackdropFilter = 'none';
  overlay.style.backgroundColor = 'transparent';

  // Remove the example card container, keeping emergency close button
  const existingCard = document.getElementById('countdown-card-container');
  if (existingCard) existingCard.remove();

  // Safety watchdog timer: guarantees overlay is cleaned up within 7.5s no matter what
  const watchdogTimer = setTimeout(() => {
    if (!isDone) {
      console.warn('[Bondfire Countdown] Safety watchdog triggered, completing countdown.');
      finishSequence();
    }
  }, 7500);

  function finishSequence() {
    if (isDone) return;
    isDone = true;
    clearTimeout(watchdogTimer);
    try {
      overlay.style.transition = 'opacity 0.3s ease-out';
      overlay.style.opacity = '0';
      setTimeout(() => {
        try { overlay.remove(); } catch (_) {}
        if (typeof onComplete === 'function') {
          try { onComplete(); } catch (err) { console.error('[Countdown] onComplete error:', err); }
        }
      }, 300);
    } catch (_) {
      try { overlay.remove(); } catch (_) {}
      if (typeof onComplete === 'function') {
        try { onComplete(); } catch (err) { console.error('[Countdown] onComplete error:', err); }
      }
    }
  }

  function playNextStep() {
    if (isDone) return;

    if (stepIndex >= COUNTDOWN_STEPS.length) {
      // Finished 1 -> Flash Ignite Burst!
      renderIgniteBlast(overlay, finishSequence);
      return;
    }

    const step = COUNTDOWN_STEPS[stepIndex];
    stepIndex++;

    // Procedural synth audio tick for each number with safe fallback
    try {
      if (typeof audio.playBip === 'function') {
        audio.playBip();
      } else if (typeof audio.playTick === 'function') {
        audio.playTick();
      }
    } catch (_) {}

    // Create expanding circular wave layer starting at center (50%, 50%) and expanding to all 4 corners
    const circleWaveLayer = document.createElement('div');
    circleWaveLayer.className = 'absolute inset-0 flex items-center justify-center animate-circle-wave overflow-hidden pointer-events-none';
    circleWaveLayer.style.backgroundColor = step.bgColor;
    circleWaveLayer.style.zIndex = stepIndex * 10;

    // Center Radial Rings & Number Container
    circleWaveLayer.innerHTML = `
      <!-- Animated Concentric Shockwave Rings radiating from center -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-white/40 animate-ring-pulse pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white/20 animate-ring-pulse pointer-events-none" style="animation-delay: 0.2s;"></div>

      <!-- Center Bouncing Kinetic Number & Label -->
      <div class="relative flex flex-col items-center justify-center text-center animate-countdown-punch pointer-events-none">
        <span class="font-display font-black text-8xl sm:text-[160px] leading-none tracking-tighter drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]" style="color: ${step.textColor};">
          ${step.num}
        </span>
        <div class="mt-2 px-5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full animate-ping" style="background-color: ${step.accentColor};"></span>
          <span class="font-mono text-sm sm:text-base font-extrabold tracking-widest uppercase text-white drop-shadow">
            ${step.sub}
          </span>
        </div>
        <span class="font-mono text-xs text-white/80 mt-2 font-bold tracking-wider uppercase">
          ${step.desc}
        </span>
      </div>
    `;

    overlay.appendChild(circleWaveLayer);

    // Run each step for ~950ms, then launch next expanding circle
    setTimeout(playNextStep, 950);
  }

  playNextStep();
}

/**
 * Stage 3: The IGNITE explosion on 0
 */
function renderIgniteBlast(overlay, onFinish) {
  try { audio.playCorrect(); } catch (_) {}
  try { audio.playChime(); } catch (_) {}
  if (confettiInstance) {
    try { confettiInstance.burst(80); } catch (_) {}
  }

  const blastLayer = document.createElement('div');
  blastLayer.className = 'absolute inset-0 flex items-center justify-center animate-circle-wave z-[90] overflow-hidden pointer-events-none';
  blastLayer.style.background = 'radial-gradient(circle at 50% 50%, #FFB703 0%, #FF5A5F 50%, #0B0E17 100%)';

  blastLayer.innerHTML = `
    <div class="relative flex flex-col items-center justify-center text-center animate-countdown-punch pointer-events-none">
      <span class="material-symbols-outlined text-white text-6xl sm:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-pulse">
        local_fire_department
      </span>
      <h1 class="font-display font-black text-5xl sm:text-8xl text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)] mt-2">
        IGNITE!
      </h1>
      <span class="font-mono text-sm sm:text-lg font-extrabold text-amber-gold tracking-widest uppercase mt-2">
        Let The Games Begin!
      </span>
    </div>
  `;

  overlay.appendChild(blastLayer);

  // Smooth dissolve and finish
  setTimeout(() => {
    if (typeof onFinish === 'function') {
      onFinish();
    }
  }, 900);
}

