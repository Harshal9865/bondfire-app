// ==============================================================================
// BONDFIRE 2.0 INDIAN CULTURE & MEME GAME DECKS (js/data/indianCultureDecks.js)
// Culturally authentic, Hinglish-native, relatable party formats:
// 1. OUR LORE (The Group's Official Historical Canon)
// 2. WHO SAID THIS? (Unfiltered Chat Exposes)
// 3. MOST LIKELY TO... (Hostel, Wedding, College, Office Chaos)
// 4. THE REEL COURTROOM (Relatable vs Petty Crimes)
// 5. EMOJI CINEMA & ANTAKSHARI CLASH
// ==============================================================================

// 1. OUR LORE (Signature Game)
export const OUR_LORE_DECK = [
  {
    round: 1,
    title: 'The Goa Trip That Was Supposed to Be Relaxing',
    category: 'TRIP_CHAOS',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    exhibitDate: 'October 2024',
    prompt: 'What was the EXACT sequence of events on Night 2 when the Airbnb key vanished?',
    options: [
      'Left inside the rented Activa helmet box',
      'Dropped in the sand at Thalassa shack',
      'Accidentally thrown in the trash with Domino’s boxes',
      'Kabir secretly kept it in his pocket and forgot for 4 hours'
    ],
    officialCanon: 'Kabir had the key the whole time while the rest of the squad searched the beach with phone torches.',
    groupBadge: 'The Beach Torch Investigators'
  },
  {
    round: 2,
    title: 'The 3:00 AM Hostel Maggi Rebellion',
    category: 'COLLEGE_LORE',
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    exhibitDate: 'December 2023',
    prompt: 'How did Room 304 avoid getting caught by the warden during the electric kettle blackout?',
    options: [
      'Pretended to be asleep and snored in unison',
      'Hid the kettle behind 14 textbook stacks',
      'Blamed the floor trip switch on heavy rainfall',
      'Bribed the security guard with two warm bowls of Maggi'
    ],
    officialCanon: 'The legendary two-bowl Maggi peace treaty saved Room 304 from suspension.',
    groupBadge: 'The Smuggling Chefs'
  },
  {
    round: 3,
    title: 'The Biryani vs Pulao Group Chat Civil War',
    category: 'FOOD_DEBATE',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
    exhibitDate: 'August 2024',
    prompt: 'Who typed a 600-word essay arguing that Veg Biryani is scientifically just flavored pulao?',
    options: ['Aarav', 'Priya', 'Kabir', 'Rohan'],
    officialCanon: 'Aarav sent 22 consecutive WhatsApp voice notes defending Lucknowi dum cooking.',
    groupBadge: 'Culinary Extremists'
  }
];

// 2. WHO SAID THIS? (Chat Exposes)
export const WHO_SAID_THIS_DECK = [
  {
    round: 1,
    quote: '“Bhai main literally 2 minute mein gate pe hoon, auto wale bhaiya se ladai chal rahi hai.”',
    context: 'Timestamp: 10:45 PM · Actually sitting in towel eating bhujia at home',
    suspects: ['Aarav', 'Liam', 'Sarah', 'Priya'],
    correctSuspect: 'Sarah',
    revealedSnippet: 'Sarah location 15 mins later: 4.8 km away at home.'
  },
  {
    round: 2,
    quote: '“Ek baat batao, if we start a chai startup right now in Bengaluru, will we get Y Combinator funding by Thursday?”',
    context: 'Timestamp: 3:42 AM · 1 day before Final Semester Exam',
    suspects: ['Kabir', 'Rohan', 'Alex', 'Aarav'],
    correctSuspect: 'Kabir',
    revealedSnippet: 'Kabir registered 3 domain names that night and never opened them again.'
  },
  {
    round: 3,
    quote: '“I don’t care about society, but if my wedding entry doesn’t have dry ice fog and 4 dhol walas, I’m boycotting.”',
    context: 'Sent in family cousins group chat with zero irony',
    suspects: ['Priya', 'Meera', 'Rohan', 'Sarah'],
    correctSuspect: 'Priya',
    revealedSnippet: 'Priya has already choreographed a 12-minute Sangeet solo for an imaginary groom.'
  }
];

// 3. MOST LIKELY TO... (Indian & Universal Edition)
export const MOST_LIKELY_TO_INDIAN_DECK = [
  {
    round: 1,
    prompt: 'Who is most likely to order ₹400 dessert on Swiggy after complaining that their bank balance is ₹82?',
    theme: 'FINANCIAL_DELUSION',
    sound: 'cash_register'
  },
  {
    round: 2,
    prompt: 'Who will silently view everyone’s Instagram story within 90 seconds, but take 4 working days to reply to “Dinner plan?” on WhatsApp?',
    theme: 'PHANTOM_TEXTER',
    sound: 'ghost_woosh'
  },
  {
    round: 3,
    prompt: 'Who will get into a 15-minute emotional conversation with the cab driver and know his entire family backstory before reaching the destination?',
    theme: 'UBER_THERAPY',
    sound: 'car_horn'
  },
  {
    round: 4,
    prompt: 'Who is most likely to say “Main drink nahi karunga aaj” and then end up dancing on a plastic chair by 11:30 PM?',
    theme: 'PARTY_PROMISES',
    sound: 'dhol_beat'
  },
  {
    round: 5,
    prompt: 'Who will be the first one to move to Canada or Germany and suddenly start asking for “authentic chai” in Hindi accent?',
    theme: 'NRI_SYNDROME',
    sound: 'airplane'
  },
  {
    round: 6,
    prompt: 'Who is most likely to disappear from a house party at 11:30 PM without saying goodbye to a single person?',
    theme: 'IRISH_EXIT',
    sound: 'ghost_woosh'
  },
  {
    round: 7,
    prompt: 'Who is most likely to start a business idea at 2 AM, make a logo on Canva, and completely abandon it by morning?',
    theme: '2AM_ENTREPRENEUR',
    sound: 'cash_register'
  }
];

// Export alias for Most Likely To game engine
export const MOST_LIKELY_TO_DECK = MOST_LIKELY_TO_INDIAN_DECK;

// 4. THE REEL COURTROOM (Relatable Crimes)
export const REEL_COURTROOM_DECK = [
  {
    round: 1,
    caseTitle: 'The 7-Minute Voice Note Felony',
    accused: 'The Squad Podcaster',
    charge: 'Sending a podcast episode instead of typing “Reach safely”',
    exhibit: 'Audio file length: 06:48 · 90% is background traffic honking',
    plea: '“My emotional nuance cannot be captured by mere alphabets.”',
    punishments: [
      'Must transcribe the next 3 group chat plans manually',
      'Aux cord revoked for the next 2 weekend drives',
      'Must buy everybody cutting chai at the tapri'
    ]
  },
  {
    round: 2,
    caseTitle: 'The Sneaky Bill Split Calculation',
    accused: 'The Financial Auditor',
    charge: 'Deducting ₹14 because they “didn’t touch the garlic bread basket”',
    exhibit: 'Splitwise note: "Itemized breakdown: Aarav had 2 extra sips of Coke Zero"',
    plea: '“Accuracy is not stinginess, it is economic discipline!”',
    punishments: [
      'Must round up and pay the entire tip next dinner',
      'Assigned group title: "The GST Officer of Bandra"',
      'Must surrender Splitwise admin rights forever'
    ]
  }
];

// 5. EMOJI CINEMA
export const EMOJI_CINEMA_DECK = [
  {
    round: 1,
    icons: ['train', 'air', 'directions_run', 'man', 'handshake', 'local_florist'],
    prompt: 'Guess the iconic Bollywood film from the vector clue sequence:',
    options: ['Dilwale Dulhania Le Jayenge', 'Jab We Met', 'Chennai Express', 'Gadar'],
    correctIndex: 0,
    iconicDialogue: '“Ja Simran ja, jee le apni zindagi!”'
  },
  {
    round: 2,
    icons: ['backpack', 'landscape', 'music_note', 'wine_bar', 'wb_twilight', 'heart_broken'],
    prompt: 'Which coming-of-age friendship classic is this?',
    options: ['Yeh Jawaani Hai Deewani', 'Zindagi Na Milegi Dobara', 'Dil Chahta Hai', 'Rockstar'],
    correctIndex: 0,
    iconicDialogue: '“Kahin pahunchne ke liye, kahin se nikalna bahut zaroori hota hai.”'
  },
  {
    round: 3,
    icons: ['directions_car', 'flight', 'scuba_diving', 'restaurant', 'paragliding', 'diamond'],
    prompt: 'Identify the bachelor road trip masterpiece:',
    options: ['Zindagi Na Milegi Dobara', 'Dil Dhadakne Do', 'Queen', 'Karwaan'],
    correctIndex: 0,
    iconicDialogue: '“Seize the day my friend, pehle is din ko poori tarah jiyo.”'
  }
];
