// ==============================================================================
// BOLLYWOOD ANTAKSHARI & FILMI MASALA MASTER DATASET (js/data/bollywoodQuizData.js)
// Comprehensive Indian Cinema trivia covering:
// - Famous Recent Blockbusters (2020-2025): Stree 2, Animal, Jawan, 12th Fail, Bad Newz, Brahmāstra, etc.
// - 2010s Modern Cult Classics: YJHD, ZNMD, 3 Idiots, Gangs of Wasseypur, Kabir Singh, Dangal, etc.
// - 2000s Millennial Gems: Jab We Met, Om Shanti Om, Dil Chahta Hai, K3G, Chak De! India, etc.
// - 90s & Retro Gold: DDLJ, Sholay, Don, Deewar, Mr. India, Jo Jeeta Wohi Sikandar, etc.
// ==============================================================================

export const BOLLYWOOD_ERAS = [
  { id: 'ALL', label: 'All Masala Mix', icon: 'auto_awesome' },
  { id: 'RECENT', label: 'Recent Hits (2020–2025)', icon: 'local_fire_department' },
  { id: '2010s', label: '2010s Cult Classics', icon: 'movie_filter' },
  { id: '2000s', label: '2000s Millennial Hits', icon: 'star' },
  { id: 'RETRO', label: '90s & Retro Gold', icon: 'history_edu' },
  { id: 'ANTAKSHARI_ONLY', label: 'Antakshari Songs Only', icon: 'music_note' },
];

export const BOLLYWOOD_QUESTIONS = [
  // ============================================================================
  // 1. FAMOUS RECENT BLOCKBUSTERS (2020 - 2025)
  // ============================================================================
  {
    id: 'rec_stree2_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2024 Monster Blockbuster',
    letter: 'A',
    prompt: 'Antakshari Letter "A" - The viral 2024 chartbuster track featuring Tamannaah Bhatia in Chanderi:',
    options: ['Aaj Ki Raat (Stree 2)', 'Apna Bana Le (Bhediya)', 'Aayi Nai (Stree 2)', 'Aankh Marey (Simmba)'],
    correct: 0,
    hint: 'Sung by Madhubanti Bagchi & Divya Kumar; composed by Sachin-Jigar.',
    songSnippet: '“Aaj ki raat maza husn ka aankhon se lijiye...”'
  },
  {
    id: 'rec_stree2_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2024 Horror Comedy Universe',
    prompt: '“Woh Stree hai... woh kuch bhi kar sakti hai!”',
    options: ['Rudra Bhaiya (Pankaj Tripathi in Stree)', 'Vicky (Rajkummar Rao)', 'Bittu (Aparshakti Khurana)', 'Jana (Abhishek Banerjee)'],
    correct: 0,
    hint: 'Spoken by the philosophical Chanderi bookshop owner who decodes paranormal lore.'
  },
  {
    id: 'rec_animal_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2023 Pan-India Phenomenon',
    letter: 'P',
    prompt: 'Antakshari Letter "P" - The haunting, viral 2023 slow-burn love ballad by Vishal Mishra:',
    options: ['Pehle Bhi Main (Animal)', 'Pee Loon (Once Upon A Time)', 'Phir Aur Kya Chahiye (Zara Hatke)', 'Paani Paani (Badshah)'],
    correct: 0,
    hint: 'Ranbir Kapoor & Triptii Dimri\'s soul-stirring track composed by Harshavardhan Rameshwar.',
    songSnippet: '“Pehle bhi main tumse mila hoon... pehli dafa hi milke laga...”'
  },
  {
    id: 'rec_animal_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2023 Action Thriller',
    prompt: '“Sunai de raha hai mujhe... behra nahi hoon main!”',
    options: ['Ranvijay Singh (Ranbir Kapoor in Animal)', 'Abrar Haque (Bobby Deol)', 'Balbir Singh (Anil Kapoor)', 'Freddy'],
    correct: 0,
    hint: 'The intense conference room face-off that spawned millions of internet memes.'
  },
  {
    id: 'rec_jawan_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2023 All-Time Record Opener',
    prompt: '“Bete ko haath lagane se pehle... baap se baat kar!”',
    options: ['Vikram Rathore (Shah Rukh Khan in Jawan)', 'Tiger (Salman Khan)', 'Kabir (Hrithik Roshan)', 'Rocky Bhai (KGF 2)'],
    correct: 0,
    hint: 'Said by SRK in military uniform over the radio before the high-octane climax shootout.'
  },
  {
    id: 'rec_jawan_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2023 Chartbuster Hit',
    letter: 'C',
    prompt: 'Antakshari Letter "C" - The global viral groove by Anirudh Ravichander featuring SRK & Nayanthara:',
    options: ['Chaleya (Jawan)', 'Chaiyya Chaiyya (Dil Se)', 'Channa Mereya (ADHM)', 'Chammak Challo (Ra.One)'],
    correct: 0,
    hint: 'Arijit Singh & Shilpa Rao\'s breezy, addictive romantic earworm.',
    songSnippet: '“Ishq mein dil bana hai, ishq mein dil fana hai... chaleya!”'
  },
  {
    id: 'rec_12thfail_visual',
    type: 'VISUAL',
    era: 'RECENT',
    eraLabel: '2023 Inspirational Masterpiece',
    prompt: 'Atta Chakki (Flour Mill) · Chambal Ravines · UPSC Library · Restart Slogan',
    icons: ['agriculture', 'landscape', 'menu_book', 'restart_alt'],
    options: ['12th Fail (Manoj Kumar Sharma)', 'Super 30', 'Kota Factory', 'Taare Zameen Par'],
    correct: 0,
    hint: 'Directed by Vidhu Vinod Chopra starring Vikrant Massey as an unstoppable IPS aspirant.'
  },
  {
    id: 'rec_12thfail_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2023 National Award Winning Gem',
    prompt: '“Agar ek bhi bacha bina rishwat ke IPS banta hai... toh desh badal sakta hai! RESTART!”',
    options: ['Gauri Bhaiya (12th Fail)', 'Pritam Pandey', 'DSP Dushyant Singh', 'Manoj Kumar Sharma'],
    correct: 0,
    hint: 'The beloved tea-stall mentor who supports underprivileged aspirants in Mukherjee Nagar.'
  },
  {
    id: 'rec_brahmastra_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2022 Fantasy Spectacular',
    letter: 'K',
    prompt: 'Antakshari Letter "K" - The saffron-soaked Varanasi love anthem that ruled playlists worldwide:',
    options: ['Kesariya (Brahmāstra)', 'Kabira (YJHD)', 'Kun Faya Kun (Rockstar)', 'Kal Ho Naa Ho'],
    correct: 0,
    hint: 'Pritam composition penned by Amitabh Bhattacharya and sung by Arijit Singh for Ranbir & Alia.',
    songSnippet: '“Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun...”'
  },
  {
    id: 'rec_badnewz_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2024 Viral Reel Sensation',
    letter: 'T',
    prompt: 'Antakshari Letter "T" - Vicky Kaushal\'s viral smooth hook-step Punjabi anthem sung by Karan Aujla:',
    options: ['Tauba Tauba (Bad Newz)', 'Tarasti Hai Nigahein', 'Tera Yaar Hoon Main', 'Tujh Mein Rab Dikhta Hai'],
    correct: 0,
    hint: 'The electrifying track that generated millions of dance covers on Instagram in July 2024.',
    songSnippet: '“Husn tera tauba tauba, nakhra tera tauba tauba...”'
  },
  {
    id: 'rec_pathaan_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2023 Spy Universe Blockbuster',
    prompt: '“Apni kursi ki peti baandh lijiye... mausam bigadne wala hai!”',
    options: ['Pathaan (Shah Rukh Khan)', 'Kabir (War)', 'Jim (John Abraham)', 'Tiger (Salman Khan)'],
    correct: 0,
    hint: 'Spoken right before jumping out of the flying helicopter.'
  },
  {
    id: 'rec_shershaah_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2021 Patriotic Masterpiece',
    letter: 'R',
    prompt: 'Antakshari Letter "R" - The evergreen romantic track dedicated to Captain Vikram Batra & Dimple:',
    options: ['Raataan Lambiyan (Shershaah)', 'Raanjhanaa (Raanjhanaa)', 'Rasiya (Brahmāstra)', 'Roop Tera Mastana'],
    correct: 0,
    hint: 'Tanishk Bagchi, Jubin Nautiyal & Asees Kaur\'s multi-billion stream celebration.',
    songSnippet: '“Kattey kattey na katte re s協力... raataan lambiyan lambiyan re...”'
  },
  {
    id: 'rec_crew_song',
    type: 'ANTAKSHARI',
    era: 'RECENT',
    eraLabel: '2024 Peppy Heist Soundtrack',
    letter: 'N',
    prompt: 'Antakshari Letter "N" - The glamorous, smooth flight attendant groove by Diljit Dosanjh & Badshah:',
    options: ['Naina (Crew)', 'Namo Namo (Kedarnath)', 'Naacho Naacho (RRR)', 'Nadiyon Paar (Roohi)'],
    correct: 0,
    hint: 'Starring Tabu, Kareena Kapoor Khan, and Kriti Sanon in Dubai heist glam.',
    songSnippet: '“Akhiyan gulabi, naina sharabi...”'
  },
  {
    id: 'rec_stree2_visual',
    type: 'VISUAL',
    era: 'RECENT',
    eraLabel: '2024 All-Time Blockbuster',
    prompt: 'Braided Hair · Red Chunari · Headless Ghost (Sarkata) · Chanderi Haveli',
    icons: ['content_cut', 'female', 'visibility_off', 'castle'],
    options: ['Stree 2', 'Bhool Bhulaiyaa 2', 'Bhediya', 'Munjya'],
    correct: 0,
    hint: 'Vicky, Jana, and Bittu battle against the headless supernatural entity Sarkata.'
  },
  {
    id: 'rec_gadar2_dialogue',
    type: 'DIALOGUE',
    era: 'RECENT',
    eraLabel: '2023 Mega Blockbuster',
    prompt: '“Hindustan Zindabad tha, Zindabad hai, aur Zindabad rahega!”',
    options: ['Tara Singh (Sunny Deol in Gadar 2)', 'Jeete (Utkarsh Sharma)', 'Major Malik', 'Ashraf Ali'],
    correct: 0,
    hint: 'The iconic roar delivered with thunderous conviction in Lahore.'
  },

  // ============================================================================
  // 2. 2010s MODERN CULT CLASSICS
  // ============================================================================
  {
    id: 'mod_yjhd_visual',
    type: 'VISUAL',
    era: '2010s',
    eraLabel: '2013 Youth Cultural Touchstone',
    prompt: 'Trekking Backpack · Manali Snow Peaks · Udaipur Sangeet · Midnight Balcony',
    icons: ['backpack', 'landscape', 'celebration', 'wb_twilight'],
    options: ['Yeh Jawaani Hai Deewani', 'Zindagi Na Milegi Dobara', 'Tamasha', 'Cocktail'],
    correct: 0,
    hint: 'Bunny, Naina, Avi & Aditi discovering the beauty of memories, travel, and finding home.'
  },
  {
    id: 'mod_yjhd_dialogue',
    type: 'DIALOGUE',
    era: '2010s',
    eraLabel: '2013 Classic',
    prompt: '“Main udna chahta hoon, daudna chahta hoon, girna bhi chahta hoon... bas rukna nahi chahta.”',
    options: ['Kabir \'Bunny\' Thapar (Ranbir Kapoor)', 'Avi (Aditya Roy Kapur)', 'Imraan (ZNMD)', 'Sid (Wake Up Sid)'],
    correct: 0,
    hint: 'Spoken on the quiet temple steps in Manali while looking up at the night sky.'
  },
  {
    id: 'mod_yjhd_song',
    type: 'ANTAKSHARI',
    era: '2010s',
    eraLabel: '2013 Party Anthem',
    letter: 'B',
    prompt: 'Antakshari Letter "B" - The wildest cocktail party dance track with Ranbir\'s suspenders step:',
    options: ['Badtameez Dil (YJHD)', 'Balam Pichkari (YJHD)', 'Baby Doll (Ragini MMS)', 'Bulleya (ADHM)'],
    correct: 0,
    hint: 'Benny Dayal\'s high-energy vocals and Pritam\'s iconic brass section.',
    songSnippet: '“Badtameez dil maane na, maane na...”'
  },
  {
    id: 'mod_wasseypur_dialogue',
    type: 'DIALOGUE',
    era: '2010s',
    eraLabel: '2012 Cult Classic',
    prompt: '“Baap ka, dada ka, bhai ka... sabka badla lega re tera Faizal!”',
    options: ['Faizal Khan (Nawazuddin Siddiqui)', 'Sardar Khan (Manoj Bajpayee)', 'Perpendicular', 'Definite'],
    correct: 0,
    hint: 'Anurag Kashyap\'s gritty Coal Capital revenge saga delivered through Ray-Ban sunglasses.'
  },
  {
    id: 'mod_aashiqui2_song',
    type: 'ANTAKSHARI',
    era: '2010s',
    eraLabel: '2013 Love Revolution',
    letter: 'T',
    prompt: 'Antakshari Letter "T" - The song that established Arijit Singh as the definitive voice of romantic India:',
    options: ['Tum Hi Ho (Aashiqui 2)', 'Tujhe Bhula Diya (Anjaana Anjaani)', 'Tum Mile (Tum Mile)', 'Tera Ban Jaunga (Kabir Singh)'],
    correct: 0,
    hint: 'Composed by Mithoon; Rahul Jaykar and Aarohi under the rain-soaked coat.'
  },
  {
    id: 'mod_znmd_visual',
    type: 'VISUAL',
    era: '2010s',
    eraLabel: '2011 Friendship Masterpiece',
    prompt: 'Spain Convertible · Skydiving · Tomatina Tomatoes · Running with the Bulls',
    icons: ['directions_car', 'paragliding', 'set_meal', 'pets'],
    options: ['Zindagi Na Milegi Dobara', 'Dil Dhadakne Do', 'Bang Bang', 'War'],
    correct: 0,
    hint: 'Arjun, Kabir, and Imraan conquering their deepest personal fears across Costa Brava and Seville.'
  },
  {
    id: 'mod_znmd_dialogue',
    type: 'DIALOGUE',
    era: '2010s',
    eraLabel: '2011 Philosophy',
    prompt: '“Insaan ko dibbe mein sirf tab hona chahiye jab woh mar chuka ho.”',
    options: ['Laila (Katrina Kaif in ZNMD)', 'Arjun (Hrithik Roshan)', 'Imraan (Farhan Akhtar)', 'Kabir (Abhay Deol)'],
    correct: 0,
    hint: 'Said on the beach at night, urging Arjun to break free from his corporate box.'
  },
  {
    id: 'mod_znmd_song',
    type: 'ANTAKSHARI',
    era: '2010s',
    eraLabel: '2011 Spanish Fiesta',
    letter: 'S',
    prompt: 'Antakshari Letter "S" - The flamenco street party number sung by Hrithik, Farhan & Abhay:',
    options: ['Senorita (ZNMD)', 'Subhanallah (YJHD)', 'Sooraj Ki Baahon Mein', 'Suno Aisha'],
    correct: 0,
    hint: 'Composed by Shankar-Ehsaan-Loy featuring Spanish flamenco singer María del Mar Fernández.',
    songSnippet: '“Kiske dil ko shiqwa hai, kiske dil ko gila hai... Senorita!”'
  },
  {
    id: 'mod_kabirsingh_song',
    type: 'ANTAKSHARI',
    era: '2010s',
    eraLabel: '2019 Heartbreak Anthem',
    letter: 'B',
    prompt: 'Antakshari Letter "B" - The rock anthem of intense grief and despair that took over concerts in 2019:',
    options: ['Bekhayali (Kabir Singh)', 'Bulleya (Sultan)', 'Banjaara (Ek Villain)', 'Baarish (Half Girlfriend)'],
    correct: 0,
    hint: 'Sachet Tandon\'s vocal range combined with heavy electric guitar riffs.',
    songSnippet: '“Bekhayali mein bhi tera hi khayal aaye... kyun bichhadna hai zaroori ye sawaal aaye...”'
  },
  {
    id: 'mod_dangal_visual',
    type: 'VISUAL',
    era: '2010s',
    eraLabel: '2016 Worldwide Triumph',
    prompt: 'Mud Wrestling Ring · Stopwatch · Gold Medal · National Anthem in Melbourne',
    icons: ['sports_kabaddi', 'timer', 'military_tech', 'flag'],
    options: ['Dangal', 'Sultan', 'Chak De! India', 'Bhaag Milkha Bhaag'],
    correct: 0,
    hint: 'Mahavir Singh Phogat coaching Geeta & Babita to Commonwealth Games glory.'
  },
  {
    id: 'mod_3idiots_dialogue',
    type: 'DIALOGUE',
    era: '2010s',
    eraLabel: 'All-Time Blockbuster',
    prompt: '“Kaabil bano, kaamyabi toh jhak maarke peeche aayegi!”',
    options: ['Rancho (Aamir Khan in 3 Idiots)', 'Farhan Qureshi', 'Raju Rastogi', 'Virus (Boman Irani)'],
    correct: 0,
    hint: 'Said to Farhan and Raju at the imperial Delhi engineering hostel.'
  },
  {
    id: 'mod_queen_song',
    type: 'ANTAKSHARI',
    era: '2010s',
    eraLabel: '2014 Wedding Sensation',
    letter: 'L',
    prompt: 'Antakshari Letter "L" - The viral Delhi Punjabi wedding anthem by Amit Trivedi that rocks every sangeet:',
    options: ['London Thumakda (Queen)', 'Lungi Dance (Chennai Express)', 'Laung Da Lashkara (Patiala House)', 'Laila Main Laila (Raees)'],
    correct: 0,
    hint: 'Kangana Ranaut\'s Rani dancing her heart out in Rajouri Garden before heading to Paris.',
    songSnippet: '“O baari barsi khatan gaya si khat ke leyaandi tikki... London thumakda!”'
  },

  // ============================================================================
  // 3. 2000s MILLENNIAL FAVORITES
  // ============================================================================
  {
    id: 'mil_jwm_dialogue',
    type: 'DIALOGUE',
    era: '2000s',
    eraLabel: '2007 Romance Classic',
    prompt: '“Main apni favorite hoon!”',
    options: ['Geet Dhillon (Kareena Kapoor in Jab We Met)', 'Poo (K3G)', 'Naina (YJHD)', 'Simran (DDLJ)'],
    correct: 0,
    hint: 'Said in the Ratlam hotel room while lecturing Aditya about taking life easy.'
  },
  {
    id: 'mil_jwm_song',
    type: 'ANTAKSHARI',
    era: '2000s',
    eraLabel: '2007 Energetic Dhol Beat',
    letter: 'M',
    prompt: 'Antakshari Letter "M" - The electrifying Punjabi celebration track sung by Mika Singh in end credits:',
    options: ['Mauja Hi Mauja (Jab We Met)', 'Mitwa (KANK)', 'Main Aisa Kyun Hoon (Lakshya)', 'Mahi Ve (Kal Ho Naa Ho)'],
    correct: 0,
    hint: 'Pritam\'s explosive bhangra anthem with Shahid & Kareena\'s matching red and black suits.',
    songSnippet: '“Jithe vi tu jaave othe pauga tamaasha... Mauja hi mauja!”'
  },
  {
    id: 'mil_oso_dialogue',
    type: 'DIALOGUE',
    era: '2000s',
    eraLabel: '2007 Masala Classic',
    prompt: '“Itni shiddat se maine tumhe paane ki koshish ki hai... ki har zarre ne mujhe tumse milane ki saazish ki hai.”',
    options: ['Om Prakash Makhija (Shah Rukh Khan in Om Shanti Om)', 'Rahul (K3G)', 'Devdas', 'Veer Pratap Singh'],
    correct: 0,
    hint: 'The iconic Filmfare trophy acceptance speech delivered under spotlight.'
  },
  {
    id: 'mil_oso_song',
    type: 'ANTAKSHARI',
    era: '2000s',
    eraLabel: '2007 Dream Debut Track',
    letter: 'A',
    prompt: 'Antakshari Letter "A" - The magical red carpet introduction song for Deepika Padukone in a pink lehenga:',
    options: ['Aankhon Mein Teri (Om Shanti Om)', 'Aahun Aahun (Love Aaj Kal)', 'Agar Tum Saath Ho (Tamasha)', 'Aao Milo Chalo (Jab We Met)'],
    correct: 0,
    hint: 'Vishal-Shekhar composition sung by KK with acoustic guitar as Shantipriya waves in slow motion.',
    songSnippet: '“Aankhon mein teri, ajab si ajab si adayein hain...”'
  },
  {
    id: 'mil_dch_visual',
    type: 'VISUAL',
    era: '2000s',
    eraLabel: '2001 Friendship Landmark',
    prompt: 'Goa Chapora Fort · Red Mercedes 300SL · Sydney Opera House · Soul Patch Beard',
    icons: ['fort', 'directions_car', 'beach_access', 'diversity_3'],
    options: ['Dil Chahta Hai', 'Zindagi Na Milegi Dobara', 'Rock On!!', 'Dostana'],
    correct: 0,
    hint: 'Farhan Akhtar\'s directorial debut starring Aamir Khan, Saif Ali Khan, and Akshaye Khanna.'
  },
  {
    id: 'mil_k3g_dialogue',
    type: 'DIALOGUE',
    era: '2000s',
    eraLabel: '2001 Family Epic',
    prompt: '“Keh diya na... bas keh diya!”',
    options: ['Yashvardhan Raichand (Amitabh Bachchan in K3G)', 'Narayan Shankar (Mohabbatein)', 'Baghban Father', 'Baldev Singh (DDLJ)'],
    correct: 0,
    hint: 'The definitive patriarch decree delivered with chilling authority in the Raichand mansion.'
  },
  {
    id: 'mil_k3g_song',
    type: 'ANTAKSHARI',
    era: '2000s',
    eraLabel: '2001 Karwa Chauth Anthem',
    letter: 'B',
    prompt: 'Antakshari Letter "B" - The all-star Karwa Chauth family gathering song featuring SRK, Kajol, Hrithik & Kareena:',
    options: ['Bole Chudiyan (K3G)', 'Bumbro (Mission Kashmir)', 'Barso Re (Guru)', 'Bairi Piya (Devdas)'],
    correct: 0,
    hint: 'Jatin-Lalit composition with legendary synchronization and golden outfits.',
    songSnippet: '“Bole chudiyan, bole kangna... haan sang sang chalu tere sajna...”'
  },
  {
    id: 'mil_chakde_dialogue',
    type: 'DIALOGUE',
    era: '2000s',
    eraLabel: '2007 Sports Drama',
    prompt: '“Sattar minute, sattar minute hai tumhare paas... shayad tumhari zindagi ke sabse khaas sattar minute!”',
    options: ['Kabir Khan (Shah Rukh Khan in Chak De! India)', 'Milkha Singh Coach', 'Mahavir Phogat', 'Pravin Tambe'],
    correct: 0,
    hint: 'The electrifying locker-room motivation speech before the World Cup Hockey Final in Melbourne.'
  },

  // ============================================================================
  // 4. 90s & RETRO GOLD
  // ============================================================================
  {
    id: 'ret_ddlj_dialogue',
    type: 'DIALOGUE',
    era: 'RETRO',
    eraLabel: '1995 Golden Era Milestone',
    prompt: '“Bade bade deshon mein, aisi chhoti chhoti baatein hoti rehti hain, Senorita!”',
    options: ['Raj Malhotra (Shah Rukh Khan in DDLJ)', 'Prem (Hum Aapke Hain Koun)', 'Radhe', 'Raj (Mohabbatein)'],
    correct: 0,
    hint: 'Spoken in the European train and across scenic Swiss meadows.'
  },
  {
    id: 'ret_ddlj_song',
    type: 'ANTAKSHARI',
    era: 'RETRO',
    eraLabel: '1995 Sangeet Must-Play',
    letter: 'M',
    prompt: 'Antakshari Letter "M" - The single most played Indian wedding celebration track in history:',
    options: ['Mehndi Laga Ke Rakhna (DDLJ)', 'Main Koi Aisa Geet Gaoon (Yes Boss)', 'Mera Dil Bhi Kitna Pagal Hai (Saajan)', 'Mirchi Lagi Toh (Coolie No. 1)'],
    correct: 0,
    hint: 'Udit Narayan & Lata Mangeshkar duet while Raj playfully crashes Simran\'s pre-wedding function in Punjab.',
    songSnippet: '“Mehndi laga ke rakhna, doli saja ke rakhna... lene tujhe o gori, aayenge tere sajna!”'
  },
  {
    id: 'ret_sholay_dialogue',
    type: 'DIALOGUE',
    era: 'RETRO',
    eraLabel: '1975 Immortal Landmark',
    prompt: '“Yeh haath humko de de Thakur!”',
    options: ['Gabbar Singh (Amjad Khan in Sholay)', 'Kalia', 'Sambha', 'Bheema'],
    correct: 0,
    hint: 'Spoken on the rocky courtyard bridge before the tragic confrontation.'
  },
  {
    id: 'ret_sholay_song',
    type: 'ANTAKSHARI',
    era: 'RETRO',
    eraLabel: '1975 Dosti Anthem',
    letter: 'Y',
    prompt: 'Antakshari Letter "Y" - Jai and Veeru riding the vintage motorcycle with sidecar across Ramgarh:',
    options: ['Yeh Dosti Hum Nahi Todenge (Sholay)', 'Yaadon Ki Baaraat', 'Yeh Shaam Mastani (Kati Patang)', 'Yeh Jawaani Hai Deewani (Jawani Diwani)'],
    correct: 0,
    hint: 'Kishore Kumar and Manna Dey celebrating true brotherhood for R.D. Burman.',
    songSnippet: '“Yeh dosti hum nahi todenge, todenge dam magar tera saath na chhodenge...”'
  },
  {
    id: 'ret_mrindia_dialogue',
    type: 'DIALOGUE',
    era: 'RETRO',
    eraLabel: '1987 Sci-Fi Superhero Classic',
    prompt: '“Mogambo khush hua!”',
    options: ['Mogambo (Amrish Puri in Mr. India)', 'Gabbar Singh (Sholay)', 'Shaakaal (Shaan)', 'Dr. Dang (Karma)'],
    correct: 0,
    hint: 'Shekhar Kapur\'s sci-fi classic with the red-laser lair and invisible band.'
  },
  {
    id: 'ret_don_dialogue',
    type: 'DIALOGUE',
    era: 'RETRO',
    eraLabel: '1978 Action Thriller',
    prompt: '“Don ko pakadna mushkil hi nahi... namumkin hai!”',
    options: ['Don (Amitabh Bachchan)', 'Vijay', 'DSP D\'Silva', 'Vardhan'],
    correct: 0,
    hint: 'Salim-Javed\'s sharp dialogue for the kingpin who outsmarted 11 countries.'
  },
  {
    id: 'ret_don_song',
    type: 'ANTAKSHARI',
    era: 'RETRO',
    eraLabel: '1978 Evergreen Banarasi Masti',
    letter: 'K',
    prompt: 'Antakshari Letter "K" - The legendary paan-chewing dance number sung with betel leaf in mouth:',
    options: ['Khaike Paan Banaraswala (Don)', 'Kaho Naa Pyaar Hai', 'Kya Hua Tera Wada', 'Kuch Kuch Hota Hai'],
    correct: 0,
    hint: 'Kishore Kumar actually chewed real Banarasi paan in the recording studio for the authentic slur!',
    songSnippet: '“Khaike paan banaraswala, khul jaaye band akal ka taala!”'
  },
  {
    id: 'ret_deewar_dialogue',
    type: 'DIALOGUE',
    era: 'RETRO',
    eraLabel: '1975 Dramatic Pinnacle',
    prompt: '“Aaj mere paas bangla hai, gaadi hai, bank balance hai... tumhare paas kya hai? ... Mere paas maa hai.”',
    options: ['Ravi & Vijay (Shashi Kapoor & Amitabh Bachchan in Deewar)', 'Jai & Veeru (Sholay)', 'Ram & Lakhan', 'Karan & Arjun'],
    correct: 0,
    hint: 'The immortal bridge docks confrontation written by Salim-Javed.'
  },
  {
    id: 'ret_pehlannasha_song',
    type: 'ANTAKSHARI',
    era: 'RETRO',
    eraLabel: '1992 First Love Magic',
    letter: 'P',
    prompt: 'Antakshari Letter "P" - Slow-motion red dress fluttering in the breeze on Dehradun hills:',
    options: ['Pehla Nasha (Jo Jeeta Wohi Sikandar)', 'Pardesi Pardesi (Raja Hindustani)', 'Pehli Pehli Baar Mohabbat Ki Hai', 'Papa Kehte Hain (QSQT)'],
    correct: 0,
    hint: 'Udit Narayan & Sadhana Sargam\'s eternal ode to high school crushes composed by Jatin-Lalit.',
    songSnippet: '“Pehla nasha, pehla khumaar... naya pyaar hai naya intezaar...”'
  }
];

/**
 * Filters questions by category/era and returns a shuffled round deck of `limit` questions.
 */
export function getQuizDeck(era = 'ALL', limit = 10) {
  let pool = [...BOLLYWOOD_QUESTIONS];
  if (era === 'RECENT') {
    pool = pool.filter(q => q.era === 'RECENT');
  } else if (era === '2010s') {
    pool = pool.filter(q => q.era === '2010s');
  } else if (era === '2000s') {
    pool = pool.filter(q => q.era === '2000s');
  } else if (era === 'RETRO') {
    pool = pool.filter(q => q.era === 'RETRO');
  } else if (era === 'ANTAKSHARI_ONLY') {
    pool = pool.filter(q => q.type === 'ANTAKSHARI');
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(limit, pool.length));
}
