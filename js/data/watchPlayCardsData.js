// ==============================================================================
// BONDFIRE WATCH-AND-PLAY INTERACTIVE CARDS DATA (js/data/watchPlayCardsData.js)
// 20-40 second participatory short video & audio cards
// Formats: Guess the Ending, Reel Courtroom, Complete the Lyric, Predict the Winner
// ==============================================================================

export const WATCH_PLAY_CARDS = [
  {
    id: 'wp_reel_court_1',
    cardType: 'REEL_COURT',
    badge: 'REEL COURTROOM',
    title: 'Exhibit A: The "Bas Signal Pe Hoon" Text',
    creator: {
      name: 'Rohan Joshi & The Squad',
      handle: '@rohan_adda',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'
    },
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-sitting-on-a-curb-and-talking-41584-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    pauseTimestampSeconds: 6.5,
    promptQuestion: 'Defendant texted "Main bas auto mein baitha hoon". What is their ACTUAL real-time status?',
    options: [
      { id: 'opt_1', text: 'Still standing wrapped in towel drying hair', isCorrect: true },
      { id: 'opt_2', text: 'Actually sitting in the auto on route', isCorrect: false },
      { id: 'opt_3', text: 'Frantically looking for lost left sneaker', isCorrect: false },
      { id: 'opt_4', text: 'Ordering Swiggy snacks before leaving', isCorrect: false }
    ],
    revealText: 'GUILTY! Location ping revealed they had not even stepped outside their apartment building door.',
    likesCount: 3840,
    tags: ['Hinglish', 'SquadRoast', 'LateArrival']
  },
  {
    id: 'wp_lyric_2',
    cardType: 'COMPLETE_THE_LYRIC',
    badge: 'ANTAKSHARI',
    title: 'Late Night Road Trip Sing-Along: Ilahi',
    creator: {
      name: 'Campfire Music Jam',
      handle: '@campfire_jam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music'
    },
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-people-singing-in-a-car-42777-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    pauseTimestampSeconds: 8.0,
    promptQuestion: 'Sing out loud! What comes immediately after “Shaamein malang si…”?',
    options: [
      { id: 'opt_1', text: 'Raatein surmayi, ilahi mera jee aaye aaye', isCorrect: true },
      { id: 'opt_2', text: 'Badalon ke paar ek naya aasmaan', isCorrect: false },
      { id: 'opt_3', text: 'Mera safar le chal mujhe aisi jagah', isCorrect: false },
      { id: 'opt_4', text: 'Subah ki pehli dhoop rang de zameen', isCorrect: false }
    ],
    revealText: 'Correct: "Raatein surmayi, ilahi mera jee aaye aaye!" The entire car explodes in chorus.',
    likesCount: 5120,
    tags: ['Bollywood', 'YJHD', 'RoadTrip']
  },
  {
    id: 'wp_ending_3',
    cardType: 'GUESS_THE_ENDING',
    badge: 'GUESS THE ENDING',
    title: 'The Viral Street Chai Fumble',
    creator: {
      name: 'Tapri Diaries',
      handle: '@tapri_tales',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chai'
    },
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-hot-cups-of-coffee-41589-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    pauseTimestampSeconds: 7.2,
    promptQuestion: 'What happens 1 second after the waiter balances 6 cutting chai glasses on one tray?',
    options: [
      { id: 'opt_1', text: 'A stray cricket ball knocks the entire tray over', isCorrect: false },
      { id: 'opt_2', text: 'He smoothly slides them all onto the wooden bench without spilling a single drop', isCorrect: true },
      { id: 'opt_3', text: 'A friendly dog distracts him and eats a bun maska', isCorrect: false },
      { id: 'opt_4', text: 'An uncle demands no-sugar ginger tea at the last second', isCorrect: false }
    ],
    revealText: 'Absolute Masterclass! He slid all 6 glasses with surgical precision. Tapri bhaiya level 100.',
    likesCount: 2950,
    tags: ['ChaiCulture', 'IndiaStreet', 'Relatable']
  }
];
