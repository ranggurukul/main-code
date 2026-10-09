export interface Rasa {
  id: string;
  name: string;
  sanskrit: string;
  emotion: string;
  archetype: string;
  deity: string;
  colorName: string;
  hex: string;
  bgGlow: string;
  raga: string;
  mudra: string;
  description: string;
  theatricalManifestation: string;
  natyashastraExcerpt: string;
  chords: number[];
}

export interface Discipline {
  id: string;
  title: string;
  sanskritTitle: string;
  tagline: string;
  description: string;
  keyPractices: string[];
  facultyLead: string;
  duration: string;
  image: string;
  quote: string;
}

export interface Production {
  id: string;
  title: string;
  subTitle: string;
  genre: string;
  director: string;
  playwright: string;
  duration: string;
  status: 'Now Touring' | 'Upcoming Premiere' | 'In Rehearsal' | 'Archival Vault';
  statusColor: string;
  season: string;
  venue: string;
  dates: string;
  synopsis: string;
  directorNote: string;
  cast: { role: string; actor: string }[];
  accolades: string[];
  bannerImage: string;
  ticketPrice: string;
}

export interface AcademyProgram {
  id: string;
  title: string;
  sanskritName: string;
  category: 'Full-Time Internship' | 'Masterclass Intensive' | 'Summer Residency' | 'Folk Heritage Camp';
  duration: string;
  intake: string;
  mentor: string;
  dates: string;
  location: string;
  curriculum: string[];
  prerequisites: string;
  status: 'Applications Open' | 'Limited Seats' | 'Waitlist Only';
}

export interface ArchiveArtifact {
  id: string;
  title: string;
  era: string;
  origin: string;
  category: 'Masks & Costumery' | 'Ancient Scripts' | 'Acoustic Instruments' | 'Puppetry & Shadow' | 'Stage Blueprints';
  description: string;
  preservationStatus: string;
  archivalNotes: string;
  image: string;
}

export interface TourDate {
  id: string;
  city: string;
  country: string;
  hall: string;
  production: string;
  dates: string;
  time: string;
  availableTickets: number;
  priceRange: string;
  status: 'Selling Fast' | 'Few Passes Left' | 'Opening Soon';
}

export const NAVARASA_DATA: Rasa[] = [
  {
    id: 'shringara',
    name: 'Shringara',
    sanskrit: 'शृङ्गार',
    emotion: 'Love, Beauty & Aesthetic Eroticism',
    archetype: 'The Beloved / Devotion',
    deity: 'Vishnu (Preserver of Radiance)',
    colorName: 'Shyama (Luminous Indigo-Gold)',
    hex: '#D4AF37',
    bgGlow: 'rgba(212, 175, 55, 0.25)',
    raga: 'Kalyan & Bageshree',
    mudra: 'Hamsasya & Alapadma',
    description: 'The sovereign of all rasas. It reflects both Sambhoga (union in delight) and Vipralambha (ache of longing), transcending mere desire into cosmic devotion.',
    theatricalManifestation: 'Delicate eye movements (Drishti-bheda), undulating torso postures, soft footwork accompanied by bamboo flute and sarangi.',
    natyashastraExcerpt: 'शृङ्गारो हि शुचिः शुद्धः प्रज्वलितस्तथा। (Shringara is pure, radiant, and auspicious.)',
    chords: [277.18, 349.23, 415.3, 554.37], // C# maj triad
  },
  {
    id: 'hasya',
    name: 'Hasya',
    sanskrit: 'हास्य',
    emotion: 'Mirth, Irony & Cosmic Playfulness',
    archetype: 'The Jester (Vidushaka)',
    deity: 'Pramatha (Spirits of Shiva)',
    colorName: 'Shveta (Pearl Ivory)',
    hex: '#FAF7F2',
    bgGlow: 'rgba(250, 247, 242, 0.22)',
    raga: 'Kafi & Tilang',
    mudra: 'Kapittha & Mukula',
    description: 'Born from mimicry, distortion, and gentle satire. In Indian theatrical tradition, Hasya speaks truth to power through the sacred irreverence of the Vidushaka.',
    theatricalManifestation: 'Rhythmic eyebrow twitches, asymmetrical stance, syncopated comedic tala on the Ghatam and Mridangam.',
    natyashastraExcerpt: 'विकृतवेषाभिधायिभिर्हास्यः समुत्पद्यते। (Arises through playful dissonance of dress, speech, and gesture.)',
    chords: [293.66, 369.99, 440.0, 587.33], // D maj sparkling
  },
  {
    id: 'karuna',
    name: 'Karuna',
    sanskrit: 'करुण',
    emotion: 'Sorrow, Pathos & Universal Compassion',
    archetype: 'The Grieving Soul',
    deity: 'Yama (Witness of Impermanence)',
    colorName: 'Kapota (Ashen Dove Grey)',
    hex: '#B8A698',
    bgGlow: 'rgba(184, 166, 152, 0.2)',
    raga: 'Todi & Jog',
    mudra: 'Padmakosha & Shikhara (drooping)',
    description: 'The profound heart-rending realization of grief and impermanence, evolving into boundless empathy for all suffering beings.',
    theatricalManifestation: 'Sighs, tremors of the collarbone, trembling lips, and slow deliberate kneeling onto bare wood amidst solitary amber lighting.',
    natyashastraExcerpt: 'इष्टजनवियोगेन करुणः समुद्भवति। (Awakens upon separation from loved ones or loss of sanctuary.)',
    chords: [220.0, 261.63, 311.13, 392.0], // Minor lament
  },
  {
    id: 'raudra',
    name: 'Raudra',
    sanskrit: 'रौद्र',
    emotion: 'Fury, Righteous Wrath & Primordial Fire',
    archetype: 'The Destroyer / Avenger',
    deity: 'Rudra (Roaring Storm)',
    colorName: 'Rakta (Deep Crimson)',
    hex: '#C85A32',
    bgGlow: 'rgba(200, 90, 50, 0.35)',
    raga: 'Bhairav & Marwa',
    mudra: 'Mushti & Shakatamukhya',
    description: 'The explosive force of righteous fury sparked by insult, oppression, or broken oaths. Controlled aggression channeled into sharp choreographic geometry.',
    theatricalManifestation: 'Violent thumps of stamping heels (Padacheda), flared nostrils, wide piercing gaze, resonant thunder on the deep Chenda.',
    natyashastraExcerpt: 'क्रोधस्थायिभावको रौद्रः प्रकीर्तितः। (Raudra is rooted in fierce unyielding inner wrath.)',
    chords: [196.0, 246.94, 311.13, 392.0], // Augmented dramatic tension
  },
  {
    id: 'veera',
    name: 'Veera',
    sanskrit: 'वीर',
    emotion: 'Heroism, Valour & Unwavering Dignity',
    archetype: 'The Noble Warrior',
    deity: 'Indra (Thunderer)',
    colorName: 'Gaura (Radiant Terracotta Saffron)',
    hex: '#D96B27',
    bgGlow: 'rgba(217, 107, 39, 0.3)',
    raga: 'Darbari Kanada & Hindol',
    mudra: 'Pataka & Ardhapataka',
    description: 'Nobility in resolve. Encompasses Danaveera (generosity), Dharmaveera (moral righteousness), and Yuddhaveera (chivalric battlefield valour).',
    theatricalManifestation: 'Broad open chest, steadfast chin tilted slightly skyward, sweeping arms tracing majestic arcs, soaring conch vibrations.',
    natyashastraExcerpt: 'उत्साहस्थायिभावस्तु वीरो नाम विधीयते। (Veera thrives upon boundless vitality and relentless fortitude.)',
    chords: [261.63, 329.63, 392.0, 523.25], // Bold open C major
  },
  {
    id: 'bhayanaka',
    name: 'Bhayanaka',
    sanskrit: 'भयानक',
    emotion: 'Terror, Dread & Existential Awe',
    archetype: 'The Pursued / The Trembler',
    deity: 'Kala (Endless Time)',
    colorName: 'Krishna (Obsidian Black)',
    hex: '#4A121A',
    bgGlow: 'rgba(74, 18, 26, 0.35)',
    raga: 'Gurjari Todi',
    mudra: 'Suchimukha & Kartarimukha',
    description: 'The chilling confrontation with annihilation, monsters of the mind, or the terrifying majesty of cosmic infinity.',
    theatricalManifestation: 'Rapid shallow breathing, frozen glances darting across darkness, clutching of drapery, eerie dissonance of muted bells.',
    natyashastraExcerpt: 'भयप्रकृतिको ह्येष भयानक इति स्मृतः। (Arises from terror of the unfathomable unknown.)',
    chords: [185.0, 220.0, 277.18, 329.63], // Dark diminished
  },
  {
    id: 'bibhatsa',
    name: 'Bibhatsa',
    sanskrit: 'बीभत्स',
    emotion: 'Aversion, Disgust & Spiritual Detachment',
    archetype: 'The Renunciate / The Wary',
    deity: 'Mahakala (Lord of Disillusion)',
    colorName: 'Nila (Smoky Indigo)',
    hex: '#7A6B82',
    bgGlow: 'rgba(122, 107, 130, 0.25)',
    raga: 'Ahir Bhairav',
    mudra: 'Aralo & Katakamukha',
    description: 'Visceral revulsion towards corruption and decay, which philosophically leads to Vairagya (renunciation of mundane illusion).',
    theatricalManifestation: 'Shielding hands, averted head, contracted shoulders, sharp dissonant vocal gasps and sudden silence.',
    natyashastraExcerpt: 'जुगुप्सास्थायिभावस्तु बीभत्सः समुदाहृतः। (Rooted in the soul recoiling from corruption.)',
    chords: [207.65, 246.94, 293.66, 369.99], // Dissonant tension
  },
  {
    id: 'adbhuta',
    name: 'Adbhuta',
    sanskrit: 'अद्भुत',
    emotion: 'Wonder, Ecstasy & Cosmic Revelation',
    archetype: 'The Seeker / The Stargazer',
    deity: 'Brahma (The Architect)',
    colorName: 'Pita (Luminous Golden Amber)',
    hex: '#E5C158',
    bgGlow: 'rgba(229, 193, 88, 0.35)',
    raga: 'Yaman & Hansadhwani',
    mudra: 'Padmakosha & Shikhara',
    description: 'The jaw-dropping marvel of divine miracles, breathtaking visual spectacles, and realization of cosmic splendor beyond human imagination.',
    theatricalManifestation: 'Expansive wide eyes, suspended breath, hands held trembling in reverent suspension, resonant temple bells.',
    natyashastraExcerpt: 'विस्मयस्थायिभावस्तु ह्यद्भुतः परिकीर्तितः। (Flows from the sublime shock of the supernatural.)',
    chords: [293.66, 369.99, 440.0, 554.37], // Lydian wonder chord
  },
  {
    id: 'shanta',
    name: 'Shanta',
    sanskrit: 'शान्त',
    emotion: 'Tranquility, Stillness & Absolute Liberation',
    archetype: 'The Sage / The Enlightened Silence',
    deity: 'Parabrahman (The Unmanifest Infinite)',
    colorName: 'Sphatika (Crystal Clear Light)',
    hex: '#E8E1D5',
    bgGlow: 'rgba(232, 225, 213, 0.25)',
    raga: 'Bhairavi & Shankara',
    mudra: 'Dhyana & Chin Mudra',
    description: 'The supreme ninth rasa, added by philosopher Abhinavagupta. It is the peaceful ocean into which all other eight rasas ultimately dissolve.',
    theatricalManifestation: 'Unmoving spine, serene half-closed eyes (Sama-Drishti), motionless palms on lap, profound resonant tanpura silence.',
    natyashastraExcerpt: 'शान्तो हि नाम सर्वभावप्रशमोपेतः। (The eternal stillness where all transient desires cease.)',
    chords: [138.59, 207.65, 277.18, 415.3], // Meditative pure harmonics
  },
];

export const DISCIPLINES_DATA: Discipline[] = [
  {
    id: 'theatre',
    title: 'Classical & Contemporary Theatre',
    sanskritTitle: 'नाट्य & रंगमंच',
    tagline: 'Bridging Ancient Dramaturgy with Modern Vanguard Playwriting',
    description: 'We dismantle the false division between classical Sanskrit staging conventions and radical 21st-century physical theatre. Students explore text deconstruction, physical voice modulation, chorus dynamics, and experimental spatial dramaturgy.',
    keyPractices: [
      'Natyashastra Fourfold Abhinaya (Angika, Vachika, Aharya, Sattvika)',
      'Brechtian alienation fused with Sanskrit Kudiyattam dramaturgy',
      'Site-specific staging in historic amphitheaters and open earth',
      'Textual translations of Kalidasa, Bhasa, Karnad, and modern postcolonial writers'
    ],
    facultyLead: 'Padmashri Anuradha Sen & Maestro Devrat Joshi',
    duration: '2-Year Intensive / Masterclass Cohorts',
    image: '/assets/hero.jpg',
    quote: 'The actor is not an imitator of reality, but an incendiary flame illuminating the unseen.',
  },
  {
    id: 'movement',
    title: 'Movement, Kudiyattam & Natya',
    sanskritTitle: 'आङ्गिक अभिनय',
    tagline: 'The Body as a Sacred Instrument of Narrative Geometry',
    description: 'Rooted in the rigorous physical disciplines of Chhau, Kathakali footwork, and Kalaripayattu martial balance, our movement school crafts performers with razor-sharp kinesthetic presence and deep spinal alignment.',
    keyPractices: [
      'Seraikella & Mayurbhanj Chhau martial torso articulations',
      'Eye and eyebrow isolation technique (Netra-Vyayama)',
      'Mudras as symbolic spatial syntax and energetic conduits',
      'Contemporary floorwork anchored in gravitational surrender'
    ],
    facultyLead: 'Guru Madhava Chakyar & Vani Pillai',
    duration: '1-Year Diploma & Seasonal Residencies',
    image: '/assets/hero.jpg',
    quote: 'Where the hand goes, the gaze must follow; where the gaze goes, the mind awakens.',
  },
  {
    id: 'music',
    title: 'Dhrupad, Tala & Acoustic Soundscapes',
    sanskritTitle: 'ध्रुवपद & नाद ब्रह्म',
    tagline: 'The Architecture of Pure Resonance and Cyclical Rhythms',
    description: 'Sound is not merely accompaniment; it is the metaphysical landscape upon which theatrical truth unfolds. We train vocalists and percussionists in contemplative Dhrupad microtones, Pakhawaj bol recitations, and indigenous folk polyrhythms.',
    keyPractices: [
      'Pranayama breath control and Naad Yoga fundamental resonance',
      'Microtonal intonations (Shrutis) of morning and midnight ragas',
      'Tala system deconstruction (Chautala, Dhamar, Tintala)',
      'Acoustic design using temple bells, clay pots, and aged cedar string instruments'
    ],
    facultyLead: 'Ustad Farhan Dagar & Vidushi Kamala Iyer',
    duration: 'Ongoing Gurukul Apprenticeship',
    image: '/assets/craft.jpg',
    quote: 'The silence between two beats of the Pakhawaj holds the entire universe.',
  },
  {
    id: 'crafts',
    title: 'Handcrafted Heritage, Masks & Aharya',
    sanskritTitle: 'आहार्य & लोक शिल्पकला',
    tagline: 'Costumery, Ceremonial Masks & Living Sacred Material Culture',
    description: 'Aharya Abhinaya — the art of costume, ornament, stage sculpture, and ceremonial transformation. Our artisans preserve endangered natural dye extraction, papier-mâché mask craft, and wooden puppet sculpting in collaboration with indigenous master guilds.',
    keyPractices: [
      'Mukhamudra: Traditional papier-mâché and clay mask sculpting',
      'Organic botanical pigment preparation (indigo, madder, turmeric)',
      'Handloom weaving and ceremonial textile draping',
      'Natural material stage architecture using bamboo, jute, and earthen plaster'
    ],
    facultyLead: 'Master Craftsman Biren Mahapatra',
    duration: 'Apprenticeships & 6-Week Studios',
    image: '/assets/craft.jpg',
    quote: 'To place on a mask is to surrender the mortal ego to a mythic divinity.',
  },
  {
    id: 'puppetry',
    title: 'Puppetry & Folk Narratives',
    sanskritTitle: 'सूत्रधार & कठपुतली',
    tagline: 'Shadow, String, and the Ancient Alchemy of Animation',
    description: 'India boasts one of the worlds oldest unbroken traditions of puppetry. From the translucent leather shadows of Tholu Bommalata to the wooden marionettes of Rajasthan, we teach the sacred metaphysics of the Sutradhar (the string-puller).',
    keyPractices: [
      'Translucent deer-hide shadow puppet perforation and natural tinting',
      'Multi-string wood marionette kinetics and weight transfer',
      'Oral balladeering, improvisation, and community engagement',
      'Cross-disciplinary shadow-theatre productions with live shadowplay'
    ],
    facultyLead: 'Sutradhar Ramdas Bhatt & Suniti Rao',
    duration: '3-Month Immersion',
    image: '/assets/craft.jpg',
    quote: 'In the hands of the puppeteer, wood breathes and leather speaks epics.',
  },
  {
    id: 'dramaturgy',
    title: 'Dramatic Literature, Epics & Playwriting',
    sanskritTitle: 'साहित्य & नाट्यशास्त्र',
    tagline: 'Deconstructing the Mahabharata and Crafting Contemporary Canon',
    description: 'Words that shake marble. We dissect the dramaturgy of Kalidasa, Bhavabhuti, and the oral folk epics of Bengal and Karnataka, while mentoring playwrights to author original works dealing with contemporary socio-political realities.',
    keyPractices: [
      'Comparative analysis of Sanskrit dramaturgy versus Aristotle and Brecht',
      'Oral history recording and folk ballad transcription',
      'Polyphonic scriptwriting with multilingual poetic dialogues',
      'Dramaturgical workshops with actors in live rehearsal labs'
    ],
    facultyLead: 'Dr. Siddharth Narayan & Shailaja Murthy',
    duration: '9-Month Internship',
    image: '/assets/hero.jpg',
    quote: 'A play is not written for the quiet page; it is written for the human throat.',
  },
];

export const PRODUCTIONS_DATA: Production[] = [
  {
    id: 'the-celestial-loom',
    title: 'The Celestial Loom (Vichitra)',
    subTitle: 'An Epic Retelling of the Mahabharata through Chhau & Physical Theatre',
    genre: 'Physical Dance-Theatre & Live Dhrupad',
    director: 'Anuradha Sen',
    playwright: 'Dr. Siddharth Narayan',
    duration: '110 minutes (with interval)',
    status: 'Now Touring',
    statusColor: '#D4AF37',
    season: '2026-2027 World Tour',
    venue: 'Kamani Auditorium, New Delhi & Barbican Center, London',
    dates: 'October 12 – 28, 2026',
    synopsis: 'Vichitra reimagines the dice game and cosmic battlefield of Kurukshetra not as a conflict of men, but as an ancient cosmic loom where fates are woven by unseen hands. Staged with twenty-four Chhau martial performers, towering bamboo scaffolding, and a live four-piece Dhrupad ensemble, it is a visceral meditation on duty, grief, and destiny.',
    directorNote: 'We stripped away the decorative romance often draped over the epic to expose its raw, bone-white moral tragedy. Every sword stroke is a metronome counting down the end of an era.',
    cast: [
      { role: 'Karna', actor: 'Devrat Joshi' },
      { role: 'Draupadi', actor: 'Vani Pillai' },
      { role: 'Yudhishthira', actor: 'Tushar Mukherjee' },
      { role: 'The Sutradhar (Time)', actor: 'Sutradhar Ramdas Bhatt' },
    ],
    accolades: [
      'Winner: National Sangeet Natak Akademi Production of the Year',
      'Official Selection: Edinburgh Fringe International Showcase',
      'Critique Choice: "A breathtaking monumental triumph of movement" — The Stage'
    ],
    bannerImage: '/assets/hero.jpg',
    ticketPrice: '₹750 – ₹3,200 / £25 – £65',
  },
  {
    id: 'shakuntala-unbound',
    title: 'Shakuntala Unbound',
    subTitle: 'Kalidasas Masterpiece Reclaimed by the Wilderness',
    genre: 'Classical Sanskrit Deconstruction & Eco-Poetics',
    director: 'Devrat Joshi',
    playwright: 'Kalidasa (Re-imagined by Shailaja Murthy)',
    duration: '95 minutes',
    status: 'Upcoming Premiere',
    statusColor: '#C85A32',
    season: 'Spring Equinox Premiere',
    venue: 'The Forest Amphitheatre, Rang Gurukul Campus',
    dates: 'November 18 – 24, 2026',
    synopsis: 'In Kalidasas Abhijnanasakuntalam, the hermitage forest is not mere passive backdrop; it is an active sentient character that weeps leaves when Shakuntala departs. This revolutionary production brings the plants, deer, and river Malini alive using kinetic bamboo puppetry and vocal polyphony.',
    directorNote: 'What happens when nature remembers the promises men so easily forget? Shakuntala is not a helpless victim; she is the living spirit of the ancient soil claiming her truth.',
    cast: [
      { role: 'Shakuntala', actor: 'Aarohi Nair' },
      { role: 'Dushyanta', actor: 'Samar Pratap' },
      { role: 'Kanva Sage', actor: 'Prof. Harishankar' },
      { role: 'Anasuya & Priyamvada', actor: 'Meera Iyer & Nupur Das' },
    ],
    accolades: [
      'Commissioned by the Indira Gandhi National Centre for the Arts',
      'Selected for World Theatre Festival Paris 2027'
    ],
    bannerImage: '/assets/hero.jpg',
    ticketPrice: '₹600 – ₹2,500',
  },
  {
    id: 'bhoomi-songs-of-clay',
    title: 'Bhoomi: Songs of the Clay',
    subTitle: 'Folk Ballads of Resistance and Agrarian Memory',
    genre: 'Folk Theatre, Baul Chants & Shadow Puppetry',
    director: 'Sutradhar Ramdas Bhatt',
    playwright: 'Collective Creation with Rural Guilds',
    duration: '85 minutes',
    status: 'Now Touring',
    statusColor: '#D4AF37',
    season: 'National Repertory Tour',
    venue: 'Prithvi Theatre, Mumbai & Ravindra Bhavan, Bhopal',
    dates: 'December 4 – 15, 2026',
    synopsis: 'A mesmerizing tapestry of regional Indian folklore woven from Bengali Baul mystic poetry, Warli tribal creation myths, and the haunting rhythms of the Dotara and Dholak. A vibrant celebration of ordinary farmers and potters who guard sacred memory through song.',
    directorNote: 'The stories of our land do not live in libraries; they live in the hands that turn the potter wheel and the throats that sing when the monsoon breaks.',
    cast: [
      { role: 'The Potter / Baul Singer', actor: 'Sanatan Mondal' },
      { role: 'The Earth Spirit', actor: 'Pooja Barman' },
      { role: 'The Elder Storyteller', actor: 'Gopal Gond' }
    ],
    accolades: [
      'Folk Art Preservation Heritage Medal 2025',
      'Standing ovation at Kerala International Theatre Festival (ITFoK)'
    ],
    bannerImage: '/assets/craft.jpg',
    ticketPrice: '₹400 – ₹1,800',
  },
  {
    id: 'silence-of-karna',
    title: 'The Silence of Karna',
    subTitle: 'Monologue on Nobility, Rejection, and Unshakable Dignity',
    genre: 'Solo Theatrical Masterpiece',
    director: 'Padmashri Anuradha Sen',
    playwright: 'Devrat Joshi',
    duration: '75 minutes',
    status: 'Archival Vault',
    statusColor: '#6D1A24',
    season: 'Special Retrospective Screening & Live Reading',
    venue: 'Rang Gurukul Black Box Studio',
    dates: 'January 9 – 12, 2027',
    synopsis: 'A raw, spellbinding solo performance examining the final twilight hours of Karna on the battlefield of Kurukshetra. Stripped of armor, divine weapons, and lineage, a solitary warrior speaks with his conscience in the falling dust.',
    directorNote: 'A tour de force of vocal range, Kudiyattam eye isolation, and quiet tragic majesty.',
    cast: [
      { role: 'Karna', actor: 'Devrat Joshi' }
    ],
    accolades: [
      'Mahindra Excellence in Theatre Awards (META) Best Actor',
      'Critically reviewed as "the definitive Karna of our generation"'
    ],
    bannerImage: '/assets/hero.jpg',
    ticketPrice: '₹500 – ₹2,000',
  },
];

export const ACADEMY_PROGRAMS: AcademyProgram[] = [
  {
    id: 'contemporary-natyashastra-internship',
    title: 'Residential Internship in Contemporary Natyashastra',
    sanskritName: 'नाट्यशास्त्र अध्येता वृत्ति',
    category: 'Full-Time Internship',
    duration: '1 Academic Year (Full Boarding)',
    intake: '16 Selected Interns Only',
    mentor: 'Padmashri Anuradha Sen & Visiting International Masters',
    dates: 'August 2026 – June 2027',
    location: 'Rang Gurukul Sanctum Campus, Dehradun Foothills',
    curriculum: [
      'Comprehensive Sanskrit dramaturgy and rasa-bhava theory',
      'Daily 3-hour dawn physical training (Chhau & Kalaripayattu)',
      'Voice projection, Naad yoga, and multilingual scene work',
      'Staging of a graduation masterwork on the campus amphitheatre'
    ],
    prerequisites: 'Prior experience in physical theatre, classical dance, or dramatic arts. Audition and interview mandatory.',
    status: 'Applications Open',
  },
  {
    id: 'dhrupad-voice-pakhawaj-intensive',
    title: 'Guru-Shishya Classical Dhrupad & Tala Intensive',
    sanskritName: 'ध्रुवपद एवं पखावज साधना',
    category: 'Masterclass Intensive',
    duration: '12 Weeks (Immersion)',
    intake: '12 Apprentices',
    mentor: 'Ustad Farhan Dagar',
    dates: 'October 1 – December 24, 2026',
    location: 'Riyaaz Pavilion, Rang Gurukul',
    curriculum: [
      'Dawn Kharaj (sub-bass vocal practice) and microtonal accuracy',
      'Nom-Tom alaap development across foundational Ragas',
      'Pakhawaj syllable articulation and complex Layakari',
      'Vocal accompaniment for Natya and stage movement'
    ],
    prerequisites: 'Basic grounding in Indian classical notes (Swaras) or percussion.',
    status: 'Limited Seats',
  },
  {
    id: 'chhau-mask-crafting-residency',
    title: 'Chhau Martial Movement & Mask Crafting Residency',
    sanskritName: 'छऊ मुखौटा एवं युद्ध कला',
    category: 'Summer Residency',
    duration: '6 Weeks',
    intake: '20 Participants',
    mentor: 'Master Craftsman Biren Mahapatra & Guru Madhava Chakyar',
    dates: 'May 15 – June 30, 2027',
    location: 'Artisans Courtyard, Rang Gurukul',
    curriculum: [
      'Hands-on clay modeling, papier-mâché layering, and earth pigment finishing',
      'Mask balance, sightline calibration, and breath channels',
      'Chhau basic Topka and Ufli step patterns',
      'Final costumed performance for the Summer Solstice festival'
    ],
    prerequisites: 'Open to visual artists, sculptors, dancers, and actors.',
    status: 'Applications Open',
  },
  {
    id: 'folk-shadow-puppetry-camp',
    title: 'Tholu Bommalata & Kathputli Folk Arts Camp',
    sanskritName: 'लोक छाया नाटक एवं सूत्रधार',
    category: 'Folk Heritage Camp',
    duration: '3 Weeks',
    intake: '25 Participants (All Ages 16+)',
    mentor: 'Sutradhar Ramdas Bhatt',
    dates: 'February 10 – March 2, 2027',
    location: 'Folk Guilds Studio, Rang Gurukul',
    curriculum: [
      'Traditional puppet making and joint linkages',
      'Manipulation of light, translucent skin, and flame shadows',
      'Folk storytelling cadences and vocal characterization',
      'Community village square puppet showcase'
    ],
    prerequisites: 'Curiosity and passion for Indian folklore and craft traditions.',
    status: 'Waitlist Only',
  },
];

export const ARCHIVE_ARTIFACTS: ArchiveArtifact[] = [
  {
    id: 'artifact-1',
    title: '18th Century Kathakali Kireedam (Golden Crown)',
    era: 'c. 1780 CE, Travancore Royal Atelier',
    origin: 'Kerala, South India',
    category: 'Masks & Costumery',
    description: 'Carved from single block of lightweight Kumizhu timber, inlaid with iridescent beetle wings (kanchana-vandu) and 24-carat beaten gold leaf. Worn by Paccha (noble hero) characters.',
    preservationStatus: 'Restored & Climate-Preserved in Vault 3',
    archivalNotes: 'Donated by the royal family of Kodungallur. Still possesses original natural resin gumming.',
    image: '/assets/craft.jpg',
  },
  {
    id: 'artifact-2',
    title: 'Palm-Leaf Natyashastra Manuscript with Commentary',
    era: '16th Century CE, Grantha Script',
    origin: 'Tanjore Saraswathi Mahal Tradition',
    category: 'Ancient Scripts',
    description: 'Rare folios containing chapters 6 and 7 (Rasa & Bhava) with marginalia containing performance cues from medieval temple dancer-scholars.',
    preservationStatus: 'Micro-Digitized & Sealed in Argon Glass Case',
    archivalNotes: 'Features rare illustrations of 108 Karanas (sculptural dance postures) matching the Chidambaram temple friezes.',
    image: '/assets/hero.jpg',
  },
  {
    id: 'artifact-3',
    title: 'Antique Teak & Rosewood Saraswati Veena',
    era: 'c. 1895 CE, Mysore Palace Guild',
    origin: 'Mysore, Karnataka',
    category: 'Acoustic Instruments',
    description: 'Masterwork instrument crafted from 100-year-old aged jackfruit wood with repoussé silver yali dragon head. Tuning pegs hold tension with precision.',
    preservationStatus: 'Acoustically Active & Seasonally Played',
    archivalNotes: 'Used in legendary historical concerts by court vidwans before entering the Gurukul permanent collection.',
    image: '/assets/craft.jpg',
  },
  {
    id: 'artifact-4',
    title: 'Tholu Bommalata Translucent Leather Puppet of Ravana',
    era: 'c. 1910 CE, Nimmalakunta Artisan Clan',
    origin: 'Andhra Pradesh',
    category: 'Puppetry & Shadow',
    description: 'Standing 5 feet tall with 10 articulated heads, dyed with extracted madder root, pomegranate rind, and indigo. Casts spectacular stained-glass-like shadows on illuminated muslin screens.',
    preservationStatus: 'Mounted with non-invasive magnetic frame',
    archivalNotes: 'One of only twelve surviving complete ten-headed Ravana shadow puppets of this scale.',
    image: '/assets/craft.jpg',
  },
];

export const TOUR_DATES: TourDate[] = [
  {
    id: 'tour-1',
    city: 'New Delhi',
    country: 'India',
    hall: 'Kamani Auditorium, Mandi House',
    production: 'The Celestial Loom (Vichitra)',
    dates: 'October 12 – 18, 2026',
    time: '19:00 IST',
    availableTickets: 42,
    priceRange: '₹800 – ₹3,000',
    status: 'Selling Fast',
  },
  {
    id: 'tour-2',
    city: 'Mumbai',
    country: 'India',
    hall: 'Prithvi Theatre & NCPA Tata Theatre',
    production: 'Bhoomi: Songs of the Clay',
    dates: 'November 5 – 12, 2026',
    time: '20:00 IST',
    availableTickets: 18,
    priceRange: '₹500 – ₹2,200',
    status: 'Few Passes Left',
  },
  {
    id: 'tour-3',
    city: 'London',
    country: 'United Kingdom',
    hall: 'Barbican Centre, Silk Street',
    production: 'The Celestial Loom (Vichitra)',
    dates: 'December 2 – 7, 2026',
    time: '19:30 GMT',
    availableTickets: 65,
    priceRange: '£28 – £75',
    status: 'Opening Soon',
  },
  {
    id: 'tour-4',
    city: 'Bengaluru',
    country: 'India',
    hall: 'Ranga Shankara, J.P. Nagar',
    production: 'Shakuntala Unbound',
    dates: 'December 18 – 23, 2026',
    time: '19:00 IST',
    availableTickets: 24,
    priceRange: '₹600 – ₹2,000',
    status: 'Few Passes Left',
  },
  {
    id: 'tour-5',
    city: 'Varanasi',
    country: 'India',
    hall: 'Assi Ghat Open Stone Amphitheatre',
    production: 'Ghungroo Symphony & Dhrupad Night',
    dates: 'January 14 – 16, 2027',
    time: '18:30 IST',
    availableTickets: 110,
    priceRange: 'Complimentary with Donor Pass',
    status: 'Selling Fast',
  },
  {
    id: 'tour-6',
    city: 'Paris',
    country: 'France',
    hall: 'Théâtre de la Ville',
    production: 'Shakuntala Unbound',
    dates: 'February 20 – 26, 2027',
    time: '20:00 CET',
    availableTickets: 80,
    priceRange: '€30 – €85',
    status: 'Opening Soon',
  },
];

export const INSTITUTIONAL_FACTS = [
  { value: '38+', label: 'Years of Unbroken Gurukul Lineage' },
  { value: '420+', label: 'Stage Productions & World Tours' },
  { value: '48', label: 'Endangered Folk Traditions Documented' },
  { value: '1,200+', label: 'Interns, Actors & Artisans Trained' },
  { value: '18', label: 'Countries Represented in Global Repertoire' },
];
