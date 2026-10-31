import type {
  MembershipPlan,
  MemberUser,
  ParticipationOpportunity,
  ParticipationRequest,
  Subscriber,
  EmailBroadcast,
  Workshop,
  WorkshopRegistration,
  GalleryPhoto,
  GalleryAlbum,
  AdminUser,
  AuthorizedAdminEmail,
  AdminAuditLog,
  AdminSession,
  HomepageConfig,
  SiteSettings,
  PaymentGatewayConfig,
  EmailProviderConfig,
  FormField,
  MediaItem,
  Discipline,
  Production,
  AcademyProgram,
  Story,
  TourDate,
} from '../types/database';
import { DISCIPLINES_DATA, PRODUCTIONS_DATA, ACADEMY_PROGRAMS, TOUR_DATES } from '../data/rangData';

export interface DatabaseSchema {
  membershipPlans: MembershipPlan[];
  members: MemberUser[];
  participationOpportunities: ParticipationOpportunity[];
  participationRequests: ParticipationRequest[];
  subscribers: Subscriber[];
  emailBroadcasts: EmailBroadcast[];
  workshops: Workshop[];
  workshopRegistrations: WorkshopRegistration[];
  galleryPhotos: GalleryPhoto[];
  galleryAlbums: GalleryAlbum[];
  mediaLibrary: MediaItem[];
  adminUsers: AdminUser[];
  authorizedAdminEmails: AuthorizedAdminEmail[];
  adminAuditLogs: AdminAuditLog[];
  adminSessions: AdminSession[];
  homepageConfig: HomepageConfig;
  siteSettings: SiteSettings;
  paymentConfig: PaymentGatewayConfig;
  emailConfig: EmailProviderConfig;
  disciplines: Discipline[];
  programs: AcademyProgram[];
  events: Production[];
  stories: Story[];
  tourDates?: TourDate[];
}

const STORAGE_KEY = 'rang_gurukul_db_v1';
const DB_CHANGE_EVENT = 'rang_gurukul_db_changed';

// Initial Seed Data
const INITIAL_DATABASE: DatabaseSchema = {
  disciplines: DISCIPLINES_DATA,
  programs: ACADEMY_PROGRAMS,
  events: PRODUCTIONS_DATA,
  tourDates: TOUR_DATES,
  stories: [
    {
      slug: 'fourfold-abhinaya-natyashastra',
      title: 'The Fourfold Abhinaya: Deconstructing Bharata Muni in the 21st Century',
      category: 'Natyashastra',
      author: 'Dr. Siddharth Narayan',
      authorRole: 'Head of Dramaturgy',
      date: 'February 15, 2026',
      readTime: '6 min read',
      coverImage: '/assets/hero.jpg',
      excerpt: 'How modern physical theatre collectives can dissolve the boundary between ancient Sanskrit aesthetics and visceral political drama.',
      content: [
        'In the sixth chapter of the Natyashastra, Bharata Muni asks a deceptively simple question: What is Rasa? The answer given is not an intellectual treatise, but a culinary metaphor: Vibhava-anubhava-vyabhichari-samyogad rasa-nishpattih.',
        'Just as a master chef harmonizes distinct spices, salts, and essences to produce a singular gastronomic ecstasy, the theatrical director harmonizes bodily posture (Angika), poetic meter (Vachika), material scenography (Aharya), and spontaneous emotional tremor (Sattvika).',
        'When our ensemble rehearses on the stone floor of the Maldevta amphitheatre, we discard the European proscenium arch. The audience does not sit in detached darkness; they are co-conspirators in an energetic circle.',
      ],
    },
    {
      slug: 'lost-pigments-aharya-masks',
      title: 'The Lost Pigments: Extracting Madder Root & Indigo for Sacred Masks',
      category: 'Aharya Craft',
      author: 'Master Craftsman Biren Mahapatra',
      authorRole: 'Guild Master',
      date: 'January 28, 2026',
      readTime: '5 min read',
      coverImage: '/assets/craft.jpg',
      excerpt: 'Chemical dyes destroy the sacred resonance of theatrical masks. An exploration of ancient botanical chemistry and earthen clays.',
      content: [
        'A synthetic acrylic mask reflects light with a plastic sheen that blinds the camera and insults the stage lighting. A mask tinted with fermented indigo, turmeric paste, and pomegranate rind absorbs light, drinking in the stage spotlights like aged temple stone.',
        'Our apprentices spend their first two weeks not sculpting, but grinding. In stone mortars with heavy wooden pestles, we grind aged riverbed clay mixed with rice husk ash and neem gum to deter insects.',
        'To hold a mask crafted in this parampara is to feel the weight of centuries. It ceases to be an object; it becomes a deity waiting for an actor breath to animate it.',
      ],
    },
    {
      slug: 'dhrupad-microtones-midnight-alaap',
      title: 'Dhrupad Microtones: The Architectural Geometry of the Midnight Alaap',
      category: 'Dhrupad Acoustics',
      author: 'Ustad Farhan Dagar',
      authorRole: 'Guru of Sacred Sound',
      date: 'December 20, 2025',
      readTime: '8 min read',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Why the 22 Shrutis of Indian classical music are not arbitrary frequencies, but precise emotional coordinates for theatrical catharsis.',
      content: [
        'Sound in Indian theatre was never conceived as background score. In Sanskrit staging, the singer is situated directly behind the actor, serving as their acoustic shadow.',
        'In Raga Darbari or Raga Todi, the oscillation of the Komal Gandhar (microtonal minor third) must dip below the standard tempered piano pitch by precisely 20 cents. It is in that infinitesimal fracture that grief (Karuna) is unlocked.',
        'We train our vocalists at 4:30 AM in the Kharaj register. When thirty voices resonate at fundamental sub-bass frequencies, the stone pavilion begins to vibrate in sympathetic resonance.',
      ],
    },
  ],
  membershipPlans: [
    {
      id: 'plan-1yr',
      name: '1 Year Classical Internship',
      duration: '1 Year',
      durationMonths: 12,
      price: 2499,
      description: 'An essential gateway into the Gurukul cultural sphere with priority ticketing and private updates.',
      benefits: [
        'Personal Rang Gurukul contact number',
        'Early event registration (48h advance window)',
        'Member-only quarterly cultural announcements',
        '10% exclusive discount on all Gurukul workshops',
        'Digital access to curated Natyashastra archive excerpts',
      ],
      status: 'active',
      order: 1,
      badge: 'Entry Internship',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'plan-2yr',
      name: '2 Years Patron Circle',
      duration: '2 Years',
      durationMonths: 24,
      price: 4499,
      description: 'Extended kinship with the master practitioners, direct coordinator messaging, and rehearsal invites.',
      benefits: [
        'Personal Rang Gurukul contact number',
        'Direct WhatsApp connection with Sansthan coordinator',
        'Priority workshop access with reserved seat buffer',
        'Invitations to closed dress rehearsals (twice yearly)',
        '15% discount on all production passes and merchandise',
        'Member-only seasonal newsletters with director notes',
      ],
      status: 'active',
      order: 2,
      badge: 'Popular Circle',
      isPopular: false,
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'plan-3yr',
      name: '3 Years Rasika Vanguard',
      duration: '3 Years',
      durationMonths: 36,
      price: 6999,
      description: 'Deep immersion for dedicated rasikas, offering stage participation opportunities and master salons.',
      benefits: [
        'Personal Rang Gurukul contact number',
        'Direct WhatsApp connection with senior faculty liaison',
        'Opportunity to audition/participate in selected acts & chorus performances',
        'Priority workshop access (guaranteed seat in masterclasses)',
        'Invitations to private member-only cultural programs & baithaks',
        'Special cultural programs and exclusive campus retreats',
        '20% concession on international tour passes',
      ],
      status: 'active',
      order: 3,
      isPopular: true,
      badge: 'Most Valued',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'plan-5yr',
      name: '5 Years Parampara Benefactor',
      duration: '5 Years',
      durationMonths: 60,
      price: 10999,
      description: 'The highest tier of cultural patronage, actively supporting rare Indian traditions with lifelong privileges.',
      benefits: [
        'Personal Rang Gurukul contact number & direct WhatsApp access',
        'Priority participation review for stage productions and folk ensembles',
        'Complimentary invitations to all premiere nights & royal baithaks',
        'Annual weekend residential retreat at Dehradun Foothills Sanctum',
        'Full archival access to digitized palm manuscripts & sound vaults',
        'Name inscribed on the Patronage Wall of Living Heritage',
        'Private one-on-one session with Gurukul artistic directors',
      ],
      status: 'active',
      order: 4,
      badge: 'Master Patron',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
  ],

  members: [
    {
      id: 'mem-1',
      membershipId: 'RG-M-2026-8492',
      name: 'Aarav Shastri',
      email: 'member@ranggurukul.org',
      phone: '+91 98450 12891',
      planId: 'plan-3yr',
      planName: '3 Years Rasika Vanguard',
      startDate: '2026-02-10T10:00:00Z',
      expiryDate: '2029-02-10T10:00:00Z',
      status: 'active',
      amountPaid: 6999,
      paymentMethod: 'Razorpay UPI (GooglePay)',
      transactionId: 'pay_RG20260210A849',
      address: '42 Heritage Enclave, Civil Lines',
      city: 'New Delhi',
      bio: 'Lifelong classical theatre enthusiast and amateur tabla player trained in Farrukhabad gharana.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      notificationPreferences: { email: true, whatsapp: true },
      createdAt: '2026-02-10T10:00:00Z',
    },
    {
      id: 'mem-2',
      membershipId: 'RG-M-2026-3108',
      name: 'Dr. Meenakshi Sundaram',
      email: 'meenakshi.s@heritagearts.in',
      phone: '+91 94441 55210',
      planId: 'plan-5yr',
      planName: '5 Years Parampara Benefactor',
      startDate: '2026-01-05T12:00:00Z',
      expiryDate: '2031-01-05T12:00:00Z',
      status: 'active',
      amountPaid: 10999,
      paymentMethod: 'Stripe Card (HDFC Visa)',
      transactionId: 'ch_3N8201K72091',
      address: '14 Luz Church Road, Mylapore',
      city: 'Chennai',
      bio: 'Sanskrit scholar researching Natyashastra dramaturgy and temple architecture.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      notificationPreferences: { email: true, whatsapp: true },
      createdAt: '2026-01-05T12:00:00Z',
    },
  ],

  participationOpportunities: [
    {
      id: 'part-1',
      title: 'Chorus & Chhau Movement Ensemble (Kurukshetra Act)',
      productionId: 'the-celestial-loom',
      productionTitle: 'The Celestial Loom (Vichitra)',
      roleType: 'Physical Movement & Chhau Chorus',
      dates: 'Rehearsals: Nov 15 – 30, 2026 | Shows: Dec 2026',
      location: 'Rang Gurukul Sanctum & Kamani Auditorium, Delhi',
      description: 'Open to members with rhythm and body coordination to join the 12-member warrior chorus. Training provided in basic Chhau stance.',
      eligiblePlans: ['plan-3yr', 'plan-5yr'],
      status: 'open',
    },
    {
      id: 'part-2',
      title: 'Acoustic Soundscape: Pakhawaj & Temple Bell Resonance',
      productionId: 'silence-of-karna',
      productionTitle: 'The Silence of Karna',
      roleType: 'Acoustic Percussionist Apprentice',
      dates: 'Jan 4 – 12, 2027',
      location: 'Rang Gurukul Black Box Studio',
      description: 'Looking for 2 percussionist members to support the live sound texture under the guidance of Ustad Farhan Dagar.',
      eligiblePlans: ['plan-2yr', 'plan-3yr', 'plan-5yr'],
      status: 'open',
    },
    {
      id: 'part-3',
      title: 'Stage Aharya & Mukhamudra Mask Crafting Crew',
      productionId: 'shakuntala-unbound',
      productionTitle: 'Shakuntala Unbound',
      roleType: 'Artisan & Scenic Craft Assistant',
      dates: 'Oct 20 – Nov 10, 2026',
      location: 'Artisans Courtyard, Rang Gurukul',
      description: 'Hands-on participation in live mask painting, botanical dye preparation, and botanical costume rigging.',
      eligiblePlans: ['plan-1yr', 'plan-2yr', 'plan-3yr', 'plan-5yr'],
      status: 'open',
    },
  ],

  participationRequests: [
    {
      id: 'req-1',
      memberId: 'mem-1',
      memberName: 'Aarav Shastri',
      memberEmail: 'member@ranggurukul.org',
      opportunityId: 'part-1',
      opportunityTitle: 'Chorus & Chhau Movement Ensemble (Kurukshetra Act)',
      statement: 'I have practiced basic Kalaripayattu and would love to commit 2 weeks to the warrior chorus.',
      experienceNotes: '3 years training in physical theatre; comfortable with demanding choreography.',
      status: 'Audition Scheduled',
      appliedAt: '2026-02-14T09:30:00Z',
    },
  ],

  subscribers: [
    {
      id: 'sub-1',
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@gmail.com',
      status: 'active',
      subscribedAt: '2026-01-20T11:20:00Z',
      source: 'Homepage Footer',
      interests: ['Workshops', 'Theatre', 'Folk Heritage'],
      unsubscribeToken: 'unsub_token_9821_rohan',
    },
    {
      id: 'sub-2',
      name: 'Sunita Ramanathan',
      email: 'sunita.ram@outlook.com',
      status: 'active',
      subscribedAt: '2026-02-01T15:45:00Z',
      source: 'Newsletter Modal',
      interests: ['Performances', 'Music'],
      unsubscribeToken: 'unsub_token_4812_sunita',
    },
    {
      id: 'sub-3',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@artscouncil.org',
      status: 'active',
      subscribedAt: '2026-02-18T08:12:00Z',
      source: 'Gallery Archive',
      interests: ['New Story / Article', 'New Gallery'],
      unsubscribeToken: 'unsub_token_7129_vikram',
    },
    {
      id: 'sub-4',
      name: 'Priyanka Kaul',
      email: 'priyanka.kaul@natyashala.in',
      status: 'active',
      subscribedAt: '2026-03-05T19:00:00Z',
      source: 'Dedicated Subscribe Page',
      interests: ['New Event', 'New Workshop', 'Important Announcement'],
      unsubscribeToken: 'unsub_token_3391_priyanka',
    },
    {
      id: 'sub-5',
      name: 'Kabir Sengupta',
      email: 'kabir.sen@theatrecritique.co',
      status: 'active',
      subscribedAt: '2026-03-12T14:30:00Z',
      source: 'Homepage Section',
      interests: ['All Updates'],
      unsubscribeToken: 'unsub_token_1092_kabir',
    },
  ],

  emailBroadcasts: [
    {
      id: 'broad-1',
      title: '2026-2027 World Tour Passes Announced',
      subject: 'The Celestial Loom & Shakuntala Unbound: Global Staging Calendar',
      preheader: 'Secure early patron passes across Kamani Delhi, Barbican London, and Paris.',
      body: 'Dear Rasika,\n\nWe are overjoyed to unveil the 2026-2027 Season Calendar for Rang Gurukul. Padmashri Anuradha Sen brings 24 Chhau performers to the stage alongside live Dhrupad masters. Member presale is now live.\n\nWarm regards,\nRang Gurukul Secretariat',
      type: 'New Event',
      recipientCount: 540,
      targetAudience: 'all',
      status: 'sent',
      sentAt: '2026-02-15T18:00:00Z',
      provider: 'Resend',
      openRateEstimated: '64.8%',
    },
    {
      id: 'broad-2',
      title: 'Summer 2027 Masterclass Intensives Opened',
      subject: 'Master Craftsman Biren Mahapatra on Mask Sculpting & Aharya',
      preheader: 'Limited to 15 residential interns at the Dehradun Foothills Sanctum.',
      body: 'Salutations,\n\nApplications are officially invited for our 6-Week Chhau Mask Sculpting & Martial Movement residency. Discover ancient natural pigment extraction and dramatic facial kinetics.\n\nWith reverence,\nRang Gurukul Academy',
      type: 'New Workshop',
      recipientCount: 552,
      targetAudience: 'all',
      status: 'sent',
      sentAt: '2026-03-01T11:00:00Z',
      provider: 'SendGrid',
      openRateEstimated: '59.2%',
    },
  ],

  workshops: [
    {
      id: 'ws-1',
      title: 'Natyashastra: The Navarasa Body & Voice Intensive',
      subtitle: '4-Day Immersive Masterclass in Sanskrit Dramaturgy & Kinetic Rasa',
      description: 'Dismantle classical theory into explosive physical staging. Explore the 4-fold Abhinaya (Angika, Vachika, Aharya, Sattvika), Kudiyattam eye isolation techniques, and voice modulation anchored in ancient breathwork.',
      instructor: 'Padmashri Anuradha Sen',
      instructorBio: 'Dean of Dramatic Expression at Rang Gurukul with 40 years of international stage direction.',
      instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      date: 'November 14 – 17, 2026',
      time: '09:00 AM – 04:30 PM IST Daily',
      duration: '4 Days (28 Hours Total)',
      location: 'The Black Box Studio, Rang Gurukul Campus, Dehradun',
      isOnline: false,
      price: 3500,
      maxParticipants: 20,
      availableSeats: 6,
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
      requirements: [
        'Open to actors, classical dancers, storytellers and performance practitioners',
        'Comfortable loose black cotton riyaaz attire',
        'Prior memorization of an 8-line monologue or verse (provided upon registration)',
      ],
      benefits: [
        'Official Rang Gurukul Certificate of Masterclass Completion',
        'Personal one-on-one diagnostic feedback session with Anuradha Sen',
        'Full boarding and organic sattvic meals during the 4 days',
        'Direct eligibility for future production casting calls',
      ],
      status: 'Filling Fast',
      category: 'Theatre',
      requiredMembershipTier: 'all',
      createdAt: '2026-01-10T10:00:00Z',
      formFields: [
        {
          id: 'field_name',
          label: 'Full Legal Name',
          type: 'text',
          placeholder: 'Enter your full name',
          required: true,
          order: 1,
        },
        {
          id: 'field_email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'your.name@example.com',
          required: true,
          order: 2,
        },
        {
          id: 'field_phone',
          label: 'WhatsApp Phone Number',
          type: 'phone',
          placeholder: '+91 98765 43210',
          required: true,
          order: 3,
        },
        {
          id: 'field_age',
          label: 'Age Group',
          type: 'dropdown',
          required: true,
          options: ['18–25', '26–35', '36–50', '50+'],
          order: 4,
          helperText: 'Cohorts are curated across diverse generational perspectives.',
        },
        {
          id: 'field_discipline',
          label: 'Primary Discipline of Practice',
          type: 'radio',
          required: true,
          options: ['Theatre / Acting', 'Classical Dance (Kathak, Bharatanatyam, Odissi)', 'Classical Vocal / Music', 'Movement / Martial Arts', 'Directing / Playwriting'],
          order: 5,
        },
        {
          id: 'field_experience',
          label: 'Brief Artistic Background & Prior Training',
          type: 'longtext',
          placeholder: 'Describe your training lineage, teachers, major productions or years of practice...',
          required: true,
          order: 6,
        },
        {
          id: 'field_accommodation',
          label: 'Do you require on-campus boarding at the Gurukul Sanctum?',
          type: 'radio',
          required: true,
          options: ['Yes — On-campus residential hostel', 'No — Arranging independent stay'],
          order: 7,
        },
        {
          id: 'field_emergency',
          label: 'Emergency Contact Person & Phone',
          type: 'emergency_contact',
          placeholder: 'Name, Relationship, Contact Number',
          required: true,
          order: 8,
        },
      ],
    },
    {
      id: 'ws-2',
      title: 'Chhau Martial Mask Sculpting & Aharya Arts',
      subtitle: 'Hands-on Clay Modeling, Papier-Mâché & Botanical Pigment Alchemy',
      description: 'Aharya Abhinaya is the sacred science of aesthetic transformation. Work alongside master guild artisans to sculpt authentic Seraikella and Mayurbhanj masks from earthen clay, layering botanical pastes, and extracting madder, indigo, and turmeric pigments.',
      instructor: 'Master Craftsman Biren Mahapatra',
      instructorBio: 'National Heritage Artisan Awardee with five generations of ceremonial mask sculpting heritage.',
      instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      date: 'December 5 – 8, 2026',
      time: '10:00 AM – 05:00 PM IST',
      duration: '4 Days (Full Studio Immersion)',
      location: 'Artisans Courtyard, Rang Gurukul Campus, Dehradun',
      isOnline: false,
      price: 4200,
      maxParticipants: 16,
      availableSeats: 4,
      image: '/assets/craft.jpg',
      requirements: [
        'Open to visual artists, sculptors, theatrical designers, and craft enthusiasts',
        'All raw materials (aged clay, natural gums, mineral pigments) provided in kit',
      ],
      benefits: [
        'Take home 2 fully functional, wearable ceremonial masks created by your hands',
        'Handbook of ancient botanical pigment formulas and preservation techniques',
        'Exhibition of student masks during the Winter Solstice baithak',
      ],
      status: 'Filling Fast',
      category: 'Crafts',
      requiredMembershipTier: 'all',
      createdAt: '2026-01-12T10:00:00Z',
      formFields: [
        {
          id: 'field_name',
          label: 'Full Legal Name',
          type: 'text',
          placeholder: 'Your name',
          required: true,
          order: 1,
        },
        {
          id: 'field_email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'name@domain.com',
          required: true,
          order: 2,
        },
        {
          id: 'field_phone',
          label: 'Contact Number',
          type: 'phone',
          placeholder: '+91 98000 00000',
          required: true,
          order: 3,
        },
        {
          id: 'field_craft_level',
          label: 'Current Experience with Craft / Sculpture',
          type: 'dropdown',
          required: true,
          options: ['Complete Beginner with deep passion', 'Intermediate Hobbyist', 'Practicing Sculptor / Visual Artist', 'Costume / Stage Designer'],
          order: 4,
        },
        {
          id: 'field_dietary',
          label: 'Dietary Preferences (All meals provided)',
          type: 'radio',
          required: true,
          options: ['Sattvic Vegetarian', 'Standard Vegetarian', 'Jain Meal', 'Vegan'],
          order: 5,
        },
        {
          id: 'field_notes',
          label: 'Specific Interest / What draws you to mask craft?',
          type: 'longtext',
          placeholder: 'Tell us what you hope to explore or build...',
          required: false,
          order: 6,
        },
      ],
    },
    {
      id: 'ws-3',
      title: 'Classical Dhrupad Microtones & Naad Yoga',
      subtitle: 'Contemplative Vocal Sadhana, Kharaj Riyaz & Microtonal Precision',
      description: 'Sound as sacred geometry. Train in dawn breath regulation, nom-tom alaap progression across foundational ragas (Bhairav, Todi, Kalyan), and the spiritual mathematics of microtones (shrutis).',
      instructor: 'Ustad Farhan Dagar',
      instructorBio: 'Eminent representative of the Dagarvani Dhrupad tradition, visiting guru at Rang Gurukul.',
      date: 'January 18 – 21, 2027',
      time: '06:30 AM – 11:30 AM IST (Dawn Sessions)',
      duration: '4 Mornings (20 Hours)',
      location: 'Riyaaz Pavilion, Rang Gurukul Sanctum',
      isOnline: false,
      price: 2800,
      maxParticipants: 25,
      availableSeats: 9,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      requirements: ['Basic familiarity with Indian classical swaras (Sa Re Ga Ma) is beneficial but not strictly required.'],
      benefits: ['Tanpura tuning mastery', 'Daily vocal diagnostic recordings', 'Invitation to midnight Dhrupad baithak'],
      status: 'Open',
      category: 'Music',
      requiredMembershipTier: 'all',
      createdAt: '2026-01-14T10:00:00Z',
      formFields: [
        { id: 'f_name', label: 'Participant Name', type: 'text', required: true, order: 1 },
        { id: 'f_email', label: 'Email Address', type: 'email', required: true, order: 2 },
        { id: 'f_phone', label: 'Phone', type: 'phone', required: true, order: 3 },
        { id: 'f_vocal', label: 'Vocal Range / Gharana Background (if any)', type: 'text', required: false, order: 4 },
      ],
    },
    {
      id: 'ws-4',
      title: 'The Sacred Sutradhar: Shadow Puppetry & Flame Play',
      subtitle: 'Ancient Leather Perforation, Joint Animation & Oral Balladeering',
      description: 'Explore the metaphysics of Tholu Bommalata. Participants craft translucent goat-hide puppets, engineer intricate bamboo string linkages, and master dynamic light-and-flame manipulation behind illuminated muslin screens.',
      instructor: 'Sutradhar Ramdas Bhatt',
      instructorBio: 'Eighth-generation master puppeteer and storyteller from Nimmalakunta.',
      date: 'February 6 – 8, 2027',
      time: '01:00 PM – 06:30 PM IST',
      duration: '3 Days (16 Hours)',
      location: 'Folk Guilds Studio, Rang Gurukul',
      isOnline: false,
      price: 2200,
      maxParticipants: 18,
      availableSeats: 5,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      requirements: ['Patience for intricate cutting and manual craftsmanship. Open to all ages 16+.'],
      benefits: ['Craft your own illuminated shadow puppet to keep', 'Stage showcase for community audience'],
      status: 'Open',
      category: 'Puppetry',
      requiredMembershipTier: 'all',
      createdAt: '2026-01-18T10:00:00Z',
      formFields: [
        { id: 'f_name', label: 'Full Name', type: 'text', required: true, order: 1 },
        { id: 'f_email', label: 'Email', type: 'email', required: true, order: 2 },
        { id: 'f_phone', label: 'Phone Number', type: 'phone', required: true, order: 3 },
        { id: 'f_notes', label: 'Tell us why you want to learn shadow puppetry', type: 'longtext', required: true, order: 4 },
      ],
    },
  ],

  workshopRegistrations: [
    {
      id: 'wreg-1',
      registrationNumber: 'RG-WS-2026-0182',
      workshopId: 'ws-1',
      workshopTitle: 'Natyashastra: The Navarasa Body & Voice Intensive',
      participantName: 'Tanvi Chordia',
      participantEmail: 'tanvi.chordia@theatrearts.in',
      participantPhone: '+91 97123 45678',
      registrationDate: '2026-02-12T14:30:00Z',
      amountPaid: 3500,
      paymentStatus: 'Paid',
      registrationStatus: 'Approved',
      transactionId: 'pay_RGWS_0182_TXN',
      answers: {
        field_name: 'Tanvi Chordia',
        field_email: 'tanvi.chordia@theatrearts.in',
        field_phone: '+91 97123 45678',
        field_age: '26–35',
        field_discipline: 'Theatre / Acting',
        field_experience: 'Graduate of NSD regional workshop, 5 years active with Mumbai experimental theatre collectives.',
        field_accommodation: 'Yes — On-campus residential hostel',
        field_emergency: 'Kishore Chordia (Father), +91 98220 11223',
      },
    },
    {
      id: 'wreg-2',
      registrationNumber: 'RG-WS-2026-0183',
      workshopId: 'ws-1',
      workshopTitle: 'Natyashastra: The Navarasa Body & Voice Intensive',
      participantName: 'Sameer Sen',
      participantEmail: 'sameer.sen@creativemedia.com',
      participantPhone: '+91 98401 22334',
      registrationDate: '2026-02-18T10:15:00Z',
      amountPaid: 3500,
      paymentStatus: 'Paid',
      registrationStatus: 'Approved',
      transactionId: 'pay_RGWS_0183_TXN',
      answers: {
        field_name: 'Sameer Sen',
        field_email: 'sameer.sen@creativemedia.com',
        field_phone: '+91 98401 22334',
        field_age: '18–25',
        field_discipline: 'Classical Dance (Kathak, Bharatanatyam, Odissi)',
        field_experience: 'Trained under Guru Geetanjali Lal for 8 years in Lucknow Kathak.',
        field_accommodation: 'No — Arranging independent stay',
        field_emergency: 'Meera Sen (Mother), +91 98401 99887',
      },
    },
    {
      id: 'wreg-3',
      registrationNumber: 'RG-WS-2026-0204',
      workshopId: 'ws-2',
      workshopTitle: 'Chhau Martial Mask Sculpting & Aharya Arts',
      participantName: 'Devika Menon',
      participantEmail: 'devika.m@designstudio.org',
      participantPhone: '+91 99887 76655',
      registrationDate: '2026-03-01T16:20:00Z',
      amountPaid: 4200,
      paymentStatus: 'Paid',
      registrationStatus: 'Pending',
      transactionId: 'pay_RGWS_0204_TXN',
      answers: {
        field_name: 'Devika Menon',
        field_email: 'devika.m@designstudio.org',
        field_phone: '+91 99887 76655',
        field_craft_level: 'Practicing Sculptor / Visual Artist',
        field_dietary: 'Sattvic Vegetarian',
        field_notes: 'Researching ritual masks of South Asia for a museum installation.',
      },
    },
  ],

  galleryAlbums: [
    {
      id: 'alb-1',
      title: 'The Celestial Loom — World Premiere',
      description: 'Visual chronicles of our monumental 24-performer Chhau production at Kamani Auditorium.',
      coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
      category: 'Performances',
      year: '2026',
      photoCount: 8,
      createdAt: '2026-01-20T10:00:00Z',
    },
    {
      id: 'alb-2',
      title: 'Sanctum Aharya & Sacred Craft Guilds',
      description: 'Documenting the master sculptors of Mayurbhanj, natural pigment mills, and handloom weavers.',
      coverImage: '/assets/craft.jpg',
      category: 'Behind the Scenes',
      year: '2025',
      photoCount: 12,
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'alb-3',
      title: 'Natyashastra Internship Intensive Cohorts',
      description: 'Moments of dawn physical riyaaz, Kudiyattam eye isolations, and amphitheatrical rehearsals.',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      category: 'Workshops',
      year: '2026',
      photoCount: 10,
      createdAt: '2026-02-05T10:00:00Z',
    },
    {
      id: 'alb-4',
      title: 'Bhoomi: Agrarian Folk Theatre Repertoire',
      description: 'Baul mystic balladeers and Warli tribal artists performing on open earthen courtyards.',
      coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      category: 'Festivals',
      year: '2025',
      photoCount: 6,
      createdAt: '2026-01-02T10:00:00Z',
    },
  ],

  galleryPhotos: [
    {
      id: 'photo-1',
      title: 'Karna in the Twilight of Kurukshetra',
      caption: 'Maestro Devrat Joshi in the iconic confrontation scene, illuminated by amber sidelight.',
      category: 'Performances',
      albumId: 'alb-1',
      albumTitle: 'The Celestial Loom — World Premiere',
      tags: ['The Celestial Loom', 'Karna', 'Chhau', 'Costume', 'Mainstage'],
      imageUrl: '/assets/hero.jpg',
      aspectRatio: 'landscape',
      isFeatured: true,
      order: 1,
      year: '2026',
      credit: 'Archival Photography by Raghu Rai Atelier',
      createdAt: '2026-01-22T10:00:00Z',
    },
    {
      id: 'photo-2',
      title: 'The Golden Kathakali Kireedam Crown',
      caption: 'Handcrafted with natural beetle wings and gold foil from the royal Travancore collection.',
      category: 'Cultural Events',
      albumId: 'alb-2',
      albumTitle: 'Sanctum Aharya & Sacred Craft Guilds',
      tags: ['Kathakali', 'Masks & Costumery', 'Gold Leaf', 'Living Heritage'],
      imageUrl: '/assets/craft.jpg',
      aspectRatio: 'portrait',
      isFeatured: true,
      order: 2,
      year: '2025',
      credit: 'Heritage Preservation Vaults',
      createdAt: '2026-01-25T11:00:00Z',
    },
    {
      id: 'photo-3',
      title: 'Dawn Body Geometry at Foothills Amphitheatre',
      caption: 'Internship scholars practicing the Mayurbhanj Chhau Topka jump at first morning light.',
      category: 'Workshops',
      albumId: 'alb-3',
      albumTitle: 'Natyashastra Internship Intensive Cohorts',
      tags: ['Internship', 'Chhau', 'Riyaaz', 'Dehradun Campus'],
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'wide',
      isFeatured: true,
      order: 3,
      year: '2026',
      credit: 'Sansthan Media Unit',
      createdAt: '2026-02-01T12:00:00Z',
    },
    {
      id: 'photo-4',
      title: 'Sacred Mudra Syntax in Silhouette',
      caption: 'Alapadma and Hamsasya mudras traced against the flickering sacred oil lamps of the sanctum.',
      category: 'Artists',
      albumId: 'alb-1',
      albumTitle: 'The Celestial Loom — World Premiere',
      tags: ['Mudras', 'Natyashastra', 'Aesthetic', 'Lighting'],
      imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: 'portrait',
      isFeatured: false,
      order: 4,
      year: '2026',
      credit: 'Rang Gurukul Visual Archive',
      createdAt: '2026-02-04T14:00:00Z',
    },
    {
      id: 'photo-5',
      title: 'Ustad Farhan Dagar — The Midnight Alaap',
      caption: 'Pure microtonal Dhrupad acoustic resonance in the historic stone Riyaaz pavilion.',
      category: 'Theatre',
      albumId: 'alb-2',
      albumTitle: 'Sanctum Aharya & Sacred Craft Guilds',
      tags: ['Dhrupad', 'Music', 'Pakhawaj', 'Masters'],
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'landscape',
      isFeatured: true,
      order: 5,
      year: '2026',
      credit: 'Sansthan Photography Team',
      createdAt: '2026-02-10T16:00:00Z',
    },
    {
      id: 'photo-6',
      title: 'Tholu Bommalata — Ten-Headed Ravana Shadowplay',
      caption: 'Translucent dyed leather puppet radiating vibrant hues across muslin illuminated by flame.',
      category: 'Cultural Events',
      albumId: 'alb-4',
      albumTitle: 'Bhoomi: Agrarian Folk Theatre Repertoire',
      tags: ['Puppetry', 'Shadow', 'Folk Art', 'Folklore'],
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'square',
      isFeatured: true,
      order: 6,
      year: '2025',
      credit: 'Sutradhar Guild Archive',
      createdAt: '2026-02-12T10:00:00Z',
    },
    {
      id: 'photo-7',
      title: 'Artisans Grinding Natural Botanical Pigments',
      caption: 'Extracted madder root, indigo cake, and turmeric ground in stone pestles for theatrical masks.',
      category: 'Behind the Scenes',
      albumId: 'alb-2',
      albumTitle: 'Sanctum Aharya & Sacred Craft Guilds',
      tags: ['Aharya', 'Pigments', 'Masks', 'Artisans'],
      imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'landscape',
      isFeatured: false,
      order: 7,
      year: '2025',
      credit: 'Biren Mahapatra Studio',
      createdAt: '2026-02-15T09:00:00Z',
    },
    {
      id: 'photo-8',
      title: 'Draupadi Vow — Staging of Anguish & Fire',
      caption: 'Vani Pillai in an electrifying solo sequence from Vichitra, surrounded by 8-meter bamboo poles.',
      category: 'Performances',
      albumId: 'alb-1',
      albumTitle: 'The Celestial Loom — World Premiere',
      tags: ['Draupadi', 'The Celestial Loom', 'Raudra', 'Stage'],
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'portrait',
      isFeatured: true,
      order: 8,
      year: '2026',
      credit: 'Kamani Auditorium Press Archive',
      createdAt: '2026-02-18T18:00:00Z',
    },
    {
      id: 'photo-9',
      title: 'The Living Sanctum — Sacred Grove at Twilight',
      caption: 'The ancient Sal and Teak forest encompassing the Rang Gurukul open-air stage amphitheatre.',
      category: 'Rang Gurukul Memories',
      tags: ['Sanctum', 'Campus', 'Architecture', 'Nature'],
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'wide',
      isFeatured: false,
      order: 9,
      year: '2026',
      credit: 'Campus Sanctum Archives',
      createdAt: '2026-02-20T12:00:00Z',
    },
    {
      id: 'photo-10',
      title: 'Sutradhar Ramdas Bhatt with Wooden Marionette',
      caption: 'The master string-puller whispering the opening couplet of the Rajasthani epic.',
      category: 'Artists',
      albumId: 'alb-4',
      albumTitle: 'Bhoomi: Agrarian Folk Theatre Repertoire',
      tags: ['Sutradhar', 'Puppetry', 'Masters', 'Folklore'],
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: 'square',
      isFeatured: false,
      order: 10,
      year: '2025',
      credit: 'Heritage Folk Cell',
      createdAt: '2026-02-22T14:00:00Z',
    },
    {
      id: 'photo-11',
      title: 'Padmashri Anuradha Sen Directing Ensemble',
      caption: 'Intensive blockings during the final dress rehearsal of Shakuntala Unbound in Dehradun.',
      category: 'Behind the Scenes',
      albumId: 'alb-3',
      albumTitle: 'Natyashastra Internship Intensive Cohorts',
      tags: ['Anuradha Sen', 'Rehearsal', 'Direction', 'Theatre'],
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: 'portrait',
      isFeatured: false,
      order: 11,
      year: '2026',
      credit: 'Repertoire Journal Unit',
      createdAt: '2026-02-25T11:00:00Z',
    },
    {
      id: 'photo-12',
      title: 'Winter Solstice Baithak & Fire Ceremony',
      caption: 'Annual communion of rasikas, elders, and young disciples gathered around the holy agni.',
      category: 'Festivals',
      albumId: 'alb-4',
      albumTitle: 'Bhoomi: Agrarian Folk Theatre Repertoire',
      tags: ['Winter Solstice', 'Baithak', 'Parampara', 'Community'],
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'landscape',
      isFeatured: true,
      order: 12,
      year: '2025',
      credit: 'Gurukul Traditions Cell',
      createdAt: '2026-03-01T20:00:00Z',
    },
  ],

  adminUsers: [
    {
      id: 'adm-owner-mann',
      name: 'Mann Gor (Owner & Sansthan Trustee)',
      email: 'thematrix2741@gmail.com',
      role: 'OWNER',
      status: 'active',
      lastLogin: '2026-10-31T12:00:00Z',
      permissions: {
        canManageAdmins: true,
        canManageContent: true,
        canManageMembership: true,
        canManageWorkshops: true,
        canManageSubscribers: true,
        canManageGallery: true,
        canManageSettings: true,
        canManagePrices: true,
      },
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'adm-owner',
      name: 'Padmashri Anuradha Sen (Sansthan Trustee)',
      email: 'owner@ranggurukul.org',
      role: 'OWNER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      lastLogin: '2026-10-01T08:00:00Z',
      permissions: {
        canManageAdmins: true,
        canManageContent: true,
        canManageMembership: true,
        canManageWorkshops: true,
        canManageSubscribers: true,
        canManageGallery: true,
        canManageSettings: true,
        canManagePrices: true,
      },
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'adm-super',
      name: 'Devrat Joshi (Executive Director)',
      email: 'superadmin@ranggurukul.org',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      lastLogin: '2026-09-30T16:20:00Z',
      permissions: {
        canManageAdmins: false,
        canManageContent: true,
        canManageMembership: true,
        canManageWorkshops: true,
        canManageSubscribers: true,
        canManageGallery: true,
        canManageSettings: true,
        canManagePrices: true,
      },
      createdAt: '2025-02-01T00:00:00Z',
    },
    {
      id: 'adm-workshops',
      name: 'Shailaja Murthy (Academy Registrar)',
      email: 'workshops@ranggurukul.org',
      role: 'WORKSHOP_ADMIN',
      status: 'active',
      lastLogin: '2026-10-01T06:15:00Z',
      permissions: {
        canManageAdmins: false,
        canManageContent: false,
        canManageMembership: false,
        canManageWorkshops: true,
        canManageSubscribers: false,
        canManageGallery: false,
        canManageSettings: false,
        canManagePrices: false,
      },
      createdAt: '2025-04-10T00:00:00Z',
    },
    {
      id: 'adm-content',
      name: 'Dr. Siddharth Narayan (Dramaturgy Head)',
      email: 'content@ranggurukul.org',
      role: 'CONTENT_ADMIN',
      status: 'active',
      lastLogin: '2026-09-28T11:40:00Z',
      permissions: {
        canManageAdmins: false,
        canManageContent: true,
        canManageMembership: false,
        canManageWorkshops: false,
        canManageSubscribers: false,
        canManageGallery: true,
        canManageSettings: false,
        canManagePrices: false,
      },
      createdAt: '2025-05-15T00:00:00Z',
    },
    {
      id: 'adm-membership',
      name: 'Aishwarya Rao (Internship Coordinator)',
      email: 'membership@ranggurukul.org',
      role: 'MEMBERSHIP_ADMIN',
      status: 'active',
      lastLogin: '2026-09-25T14:10:00Z',
      permissions: {
        canManageAdmins: false,
        canManageContent: false,
        canManageMembership: true,
        canManageWorkshops: false,
        canManageSubscribers: false,
        canManageGallery: false,
        canManageSettings: false,
        canManagePrices: false,
      },
      createdAt: '2025-06-01T00:00:00Z',
    },
    {
      id: 'adm-comm',
      name: 'Karan Mehra (Communications Officer)',
      email: 'communication@ranggurukul.org',
      role: 'COMMUNICATION_ADMIN',
      status: 'active',
      lastLogin: '2026-09-29T10:00:00Z',
      permissions: {
        canManageAdmins: false,
        canManageContent: false,
        canManageMembership: false,
        canManageWorkshops: false,
        canManageSubscribers: true,
        canManageGallery: false,
        canManageSettings: false,
        canManagePrices: false,
      },
      createdAt: '2025-07-20T00:00:00Z',
    },
  ],

  authorizedAdminEmails: [
    {
      id: 'auth-email-mann',
      email: 'thematrix2741@gmail.com',
      name: 'Mann Gor (Owner & Sansthan Trustee)',
      role: 'OWNER',
      isPrimaryOwner: true,
      status: 'active',
      addedBy: 'Initial System Environment Config',
      addedAt: '2025-01-01T00:00:00Z',
      lastLogin: '2026-10-31T12:00:00Z',
      notes: 'Primary Website Owner & Sansthan Trustee',
    },
    {
      id: 'auth-email-owner',
      email: 'owner@ranggurukul.org',
      name: 'Padmashri Anuradha Sen (Sansthan Trustee)',
      role: 'OWNER',
      isPrimaryOwner: true,
      status: 'active',
      addedBy: 'Initial System Environment Config',
      addedAt: '2025-01-01T00:00:00Z',
      lastLogin: '2026-10-01T08:00:00Z',
      notes: 'Sansthan Trustee & Artistic Director',
    },
    {
      id: 'auth-email-super',
      email: 'superadmin@ranggurukul.org',
      name: 'Devrat Joshi (Executive Director)',
      role: 'SUPER_ADMIN',
      isPrimaryOwner: false,
      status: 'active',
      addedBy: 'owner@ranggurukul.org',
      addedAt: '2025-02-01T00:00:00Z',
      lastLogin: '2026-09-30T16:20:00Z',
      notes: 'Executive Administration & Systems',
    },
    {
      id: 'auth-email-workshops',
      email: 'workshops@ranggurukul.org',
      name: 'Shailaja Murthy (Academy Registrar)',
      role: 'WORKSHOP_ADMIN',
      isPrimaryOwner: false,
      status: 'active',
      addedBy: 'owner@ranggurukul.org',
      addedAt: '2025-04-10T00:00:00Z',
      lastLogin: '2026-10-01T06:15:00Z',
      notes: 'Academy Registrar',
    },
    {
      id: 'auth-email-content',
      email: 'content@ranggurukul.org',
      name: 'Dr. Siddharth Narayan (Dramaturgy Head)',
      role: 'CONTENT_ADMIN',
      isPrimaryOwner: false,
      status: 'active',
      addedBy: 'owner@ranggurukul.org',
      addedAt: '2025-05-15T00:00:00Z',
      lastLogin: '2026-09-28T11:40:00Z',
      notes: 'Dramaturgy Head & Archivist',
    },
    {
      id: 'auth-email-membership',
      email: 'membership@ranggurukul.org',
      name: 'Aishwarya Rao (Internship Coordinator)',
      role: 'MEMBERSHIP_ADMIN',
      isPrimaryOwner: false,
      status: 'active',
      addedBy: 'owner@ranggurukul.org',
      addedAt: '2025-06-01T00:00:00Z',
      lastLogin: '2026-09-25T14:10:00Z',
      notes: 'Internship Coordinator',
    },
    {
      id: 'auth-email-comm',
      email: 'communication@ranggurukul.org',
      name: 'Karan Mehra (Communications Officer)',
      role: 'COMMUNICATION_ADMIN',
      isPrimaryOwner: false,
      status: 'active',
      addedBy: 'owner@ranggurukul.org',
      addedAt: '2025-07-20T00:00:00Z',
      lastLogin: '2026-09-29T10:00:00Z',
      notes: 'Communications Officer',
    },
  ],

  adminAuditLogs: [
    {
      id: 'audit-log-init-1',
      timestamp: '2026-10-31T12:00:00Z',
      action: 'LOGIN_SUCCESS',
      actorEmail: 'thematrix2741@gmail.com',
      details: 'Primary Owner authenticated session via Password / Passcode',
      status: 'SUCCESS',
    },
    {
      id: 'audit-log-init-2',
      timestamp: '2026-10-30T09:15:00Z',
      action: 'LOGIN_SUCCESS',
      actorEmail: 'owner@ranggurukul.org',
      details: 'Sansthan Trustee authenticated session via Password',
      status: 'SUCCESS',
    },
    {
      id: 'audit-log-init-3',
      timestamp: '2026-10-29T14:22:10Z',
      action: 'GOOGLE_AUTH_DENIED',
      actorEmail: 'unknown.visitor@gmail.com',
      details: 'Unauthorized Google account attempted login. Blocked by owner email whitelist policy.',
      status: 'DENIED',
    },
  ],

  adminSessions: [],

  homepageConfig: {
    heroTitle: 'RANG GURUKUL',
    heroSubtitle: 'Sansthan for Art, Culture & Theatrical Vanguard',
    heroQuote: 'Where ancient Natyashastra dramaturgy ignites the contemporary theatrical soul. Tradition is not the worship of ashes, but the preservation of fire.',
    heroPrimaryCtaText: 'Explore Productions',
    heroSecondaryCtaText: 'Join Internship',
    heroImage: '/assets/hero.jpg',
    aboutImage: '/assets/craft.jpg',
    featuredEventImage: '/assets/hero.jpg',
    featuredProgramImage: '/assets/craft.jpg',
    featuredPerformanceImage: '/assets/hero.jpg',
    ctaImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
    galleryPreviewImages: [
      '/assets/hero.jpg',
      '/assets/craft.jpg',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80',
    ],
    threeStageEnabled: true,
    threeStageColorTheme: 'gold',
  },

  siteSettings: {
    sansthanName: 'Rang Gurukul Sansthan',
    logoImage: '/logo.png',
    tagline: 'Preserving Sacred Lineage • Pioneering Vanguard Indian Theatre',
    contactEmail: 'sansthan@ranggurukul.org',
    contactPhone: '+91 (0135) 289-4401',
    whatsappNumber: '+91 98234 18273',
    personalContactNumber: '+91 80092 11200',
    addressLine1: 'The Forest Sanctum, Maldevta Foothills',
    addressLine2: 'Post Office Raipur, Song River Valley',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248008',
    googleMapsUrl: 'https://maps.google.com',
    instagramUrl: 'https://instagram.com/ranggurukul',
    youtubeUrl: 'https://youtube.com/@ranggurukul',
    facebookUrl: 'https://facebook.com/ranggurukul',
    twitterUrl: 'https://x.com/ranggurukul',
    seoTitle: 'RANG GURUKUL — Premier Indian Performing Arts & Cultural Sansthan',
    seoDescription: 'Premier Indian cultural sansthan dedicated to classical dramaturgy, Natyashastra, Chhau martial arts, Dhrupad, and vanguard theatre productions.',
    seoKeywords: 'Rang Gurukul, Indian Theatre, Natyashastra, Chhau, Classical Music, Dhrupad, Culture, Academy, Membership',
    applicationPrograms: [
      'Residential Internship in Contemporary Natyashastra (1 Academic Year (Full Boarding))',
      'Kalaripayattu & Chhau Physical Mastery Cohort (6-Month Intensive)',
      'Classical Sanskrit Dramaturgy & Polyphonic Voice (9-Month Residency)',
      'Sacred Aharya, Mask Carving & Puppet Craftsmanship (4-Month Immersion)',
    ],
    applicationDisciplines: [
      'Classical & Physical Theatre',
      'Classical Dance (Kathak, Bharatanatyam, Chhau)',
      'Indian Classical Vocal / Dhrupad',
      'Percussion (Pakhawaj, Mridangam, Tabla)',
      'Mask Sculpting & Puppetry',
      'Dramatic Playwriting & Dramaturgy',
    ],
    applicationPriorTraining: [
      '1–2 Years',
      '3–5 Years',
      '5–8 Years',
      '8+ Years (Professional)',
      'Self-Taught / Folk Tradition',
    ],
    reservationCities: [
      'New Delhi',
      'Mumbai',
      'London',
      'Bengaluru',
      'Varanasi',
      'Dehradun',
    ],
    reservationTiers: [
      { name: 'Royal Patron Box', price: 3200 },
      { name: 'Grand Circle Stalls', price: 1600 },
      { name: 'Amphitheatre Earthen Tier', price: 850 },
      { name: 'Student / Artist Concession', price: 450 },
    ],
  },

  paymentConfig: {
    provider: 'Razorpay',
    testMode: true,
    currency: 'INR',
    razorpayKeyId: 'rzp_test_RangGurukul2026Live',
    stripePublishableKey: 'pk_test_51RangGurukulCulturalHeritage',
  },

  emailConfig: {
    provider: 'Resend',
    apiKeyMasked: 're_************************************',
    senderEmail: 'newsletter@ranggurukul.org',
    senderName: 'Rang Gurukul Sansthan',
    webhookEnabled: true,
  },

  mediaLibrary: [
    {
      id: 'media-seed-1',
      title: 'Karna in the Twilight of Kurukshetra',
      fileName: 'hero.jpg',
      fileType: 'image/jpeg',
      fileSize: 1420000,
      fileSizeFormatted: '1.4 MB',
      url: '/assets/hero.jpg',
      thumbnailUrl: '/assets/hero.jpg',
      mediumUrl: '/assets/hero.jpg',
      largeUrl: '/assets/hero.jpg',
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: '16:9',
      altText: 'Karna on Kurukshetra battlefield with amber lighting',
      caption: 'Maestro Devrat Joshi in the iconic confrontation scene from The Celestial Loom.',
      tags: ['Performances', 'The Celestial Loom', 'Chhau', 'Hero'],
      category: 'Performances',
      albumId: 'alb-1',
      albumTitle: 'The Celestial Loom — World Premiere',
      isFeatured: true,
      uploadedAt: '2026-01-22T10:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
    {
      id: 'media-seed-2',
      title: 'Sacred Kathakali Kireedam Crown',
      fileName: 'craft.jpg',
      fileType: 'image/jpeg',
      fileSize: 980000,
      fileSizeFormatted: '980 KB',
      url: '/assets/craft.jpg',
      thumbnailUrl: '/assets/craft.jpg',
      mediumUrl: '/assets/craft.jpg',
      largeUrl: '/assets/craft.jpg',
      dimensions: { width: 1200, height: 1600 },
      aspectRatio: '4:5',
      altText: 'Ornate Kathakali golden headgear with natural iridescent beetle wings',
      caption: 'Handcrafted crown from the sacred Aharya craft collection.',
      tags: ['Aharya', 'Crafts', 'Kathakali', 'Gold Leaf'],
      category: 'Workshops',
      albumId: 'alb-2',
      albumTitle: 'Sanctum Aharya & Sacred Craft Guilds',
      isFeatured: true,
      uploadedAt: '2026-01-25T11:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
    {
      id: 'media-seed-3',
      title: 'Amphitheatre Dawn Riyaaz',
      fileName: 'amphitheatre-riyaaz.jpg',
      fileType: 'image/jpeg',
      fileSize: 1850000,
      fileSizeFormatted: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
      mediumUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      largeUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1920&q=80',
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: '16:9',
      altText: 'Mayurbhanj Chhau Topka jump at dawn over Himalayan foothills',
      caption: 'Internship scholars training at first morning light in the open-air pavilion.',
      tags: ['Riyaaz', 'Foothills', 'Campus', 'Training'],
      category: 'Campus',
      albumId: 'alb-3',
      albumTitle: 'Natyashastra Internship Intensive Cohorts',
      isFeatured: true,
      uploadedAt: '2026-02-01T12:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
    {
      id: 'media-seed-4',
      title: 'Sacred Mudra Silhouette',
      fileName: 'mudra-silhouette.jpg',
      fileType: 'image/jpeg',
      fileSize: 1100000,
      fileSizeFormatted: '1.1 MB',
      url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=400&q=80',
      mediumUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80',
      largeUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1600&q=80',
      dimensions: { width: 1000, height: 1500 },
      aspectRatio: '4:5',
      altText: 'Alapadma hand gesture illuminated by temple oil lamps',
      caption: 'Subtle hand gestures forming geometric language in classical Sanskrit drama.',
      tags: ['Mudras', 'Natyashastra', 'Dance'],
      category: 'Artists',
      albumId: 'alb-1',
      albumTitle: 'The Celestial Loom — World Premiere',
      isFeatured: false,
      uploadedAt: '2026-02-04T14:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
    {
      id: 'media-seed-5',
      title: 'Dhrupad Acoustic Sanctum',
      fileName: 'dhrupad-acoustic.jpg',
      fileType: 'image/jpeg',
      fileSize: 1640000,
      fileSizeFormatted: '1.6 MB',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      mediumUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      largeUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80',
      dimensions: { width: 1920, height: 1280 },
      aspectRatio: '3:2',
      altText: 'Ustad Farhan Dagar performing midnight Dhrupad alaap',
      caption: 'Acoustic geometry and microtonal vocal practice in the stone sanctuary.',
      tags: ['Dhrupad', 'Music', 'Vocal', 'Naad'],
      category: 'Performances',
      albumId: 'alb-2',
      albumTitle: 'Sanctum Aharya & Sacred Craft Guilds',
      isFeatured: true,
      uploadedAt: '2026-02-08T09:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
    {
      id: 'media-seed-6',
      title: 'Shadow Puppetry & Flame Play',
      fileName: 'shadow-puppet.jpg',
      fileType: 'image/jpeg',
      fileSize: 1250000,
      fileSizeFormatted: '1.2 MB',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      mediumUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      largeUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: '16:9',
      altText: 'Illuminated leather puppets behind muslin screen',
      caption: 'Tholu Bommalata ancient perforated shadow puppets manipulated by flame.',
      tags: ['Puppetry', 'Folk', 'Illumination'],
      category: 'Workshops',
      albumId: 'alb-3',
      albumTitle: 'Natyashastra Internship Intensive Cohorts',
      isFeatured: true,
      uploadedAt: '2026-02-12T16:00:00Z',
      uploadedBy: 'Curator',
      storageProvider: 'local',
    },
  ],
};

export class DatabaseService {
  private static instance: DatabaseService;
  private cache: DatabaseSchema | null = null;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private ensureInitialized(): void {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        this.cache = INITIAL_DATABASE;
        this.syncGalleryWithMediaLibrary(this.cache);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } else {
        const migratedText = existing
          .replace(/Fellowship/g, 'Internship')
          .replace(/fellowship/g, 'internship')
          .replace(/FELLOWSHIP/g, 'INTERNSHIP')
          .replace(/Fellows/g, 'Interns')
          .replace(/fellows/g, 'interns')
          .replace(/FELLOWS/g, 'INTERNS')
          .replace(/Fellow/g, 'Intern')
          .replace(/fellow/g, 'intern')
          .replace(/FELLOW/g, 'INTERN');
        const parsed = JSON.parse(migratedText);
        if (!parsed.mediaLibrary || !Array.isArray(parsed.mediaLibrary)) {
          parsed.mediaLibrary = [...INITIAL_DATABASE.mediaLibrary];
        }
        if (!parsed.disciplines || !Array.isArray(parsed.disciplines) || parsed.disciplines.length === 0) {
          parsed.disciplines = [...INITIAL_DATABASE.disciplines];
        }
        if (!parsed.programs || !Array.isArray(parsed.programs) || parsed.programs.length === 0) {
          parsed.programs = [...INITIAL_DATABASE.programs];
        }
        if (!parsed.events || !Array.isArray(parsed.events) || parsed.events.length === 0) {
          parsed.events = [...INITIAL_DATABASE.events];
        }
        if (!parsed.stories || !Array.isArray(parsed.stories) || parsed.stories.length === 0) {
          parsed.stories = [...INITIAL_DATABASE.stories];
        }
        if (!parsed.tourDates || !Array.isArray(parsed.tourDates) || parsed.tourDates.length === 0) {
          parsed.tourDates = [...INITIAL_DATABASE.tourDates!];
        }
        if (parsed.siteSettings) {
          if (!Array.isArray(parsed.siteSettings.applicationPrograms)) {
            parsed.siteSettings.applicationPrograms = [...INITIAL_DATABASE.siteSettings.applicationPrograms!];
          }
          if (!Array.isArray(parsed.siteSettings.applicationDisciplines)) {
            parsed.siteSettings.applicationDisciplines = [...INITIAL_DATABASE.siteSettings.applicationDisciplines!];
          }
          if (!Array.isArray(parsed.siteSettings.applicationPriorTraining)) {
            parsed.siteSettings.applicationPriorTraining = [...INITIAL_DATABASE.siteSettings.applicationPriorTraining!];
          }
          if (!Array.isArray(parsed.siteSettings.reservationCities)) {
            parsed.siteSettings.reservationCities = [...INITIAL_DATABASE.siteSettings.reservationCities!];
          }
          if (!Array.isArray(parsed.siteSettings.reservationTiers)) {
            parsed.siteSettings.reservationTiers = [...INITIAL_DATABASE.siteSettings.reservationTiers!];
          }
          if (!parsed.siteSettings.logoImage) {
            parsed.siteSettings.logoImage = '/logo.png';
          }
        }
        if (parsed.adminUsers && Array.isArray(parsed.adminUsers)) {
          const hasOwner = parsed.adminUsers.some((u: any) => u.email?.toLowerCase() === 'owner@ranggurukul.org');
          if (!hasOwner) {
            parsed.adminUsers.push(INITIAL_DATABASE.adminUsers.find(u => u.email === 'owner@ranggurukul.org')!);
          }
          const hasMann = parsed.adminUsers.some((u: any) => u.email?.toLowerCase() === 'thematrix2741@gmail.com');
          if (!hasMann) {
            parsed.adminUsers.unshift(INITIAL_DATABASE.adminUsers[0]);
          }
        }
        if (!parsed.authorizedAdminEmails || !Array.isArray(parsed.authorizedAdminEmails) || parsed.authorizedAdminEmails.length === 0) {
          parsed.authorizedAdminEmails = [...INITIAL_DATABASE.authorizedAdminEmails];
        } else {
          const hasOwner = parsed.authorizedAdminEmails.some((u: any) => u.email?.toLowerCase() === 'owner@ranggurukul.org');
          if (!hasOwner) {
            parsed.authorizedAdminEmails.push(INITIAL_DATABASE.authorizedAdminEmails.find(u => u.email === 'owner@ranggurukul.org')!);
          }
          const hasMann = parsed.authorizedAdminEmails.some((u: any) => u.email?.toLowerCase() === 'thematrix2741@gmail.com');
          if (!hasMann) {
            parsed.authorizedAdminEmails.unshift(INITIAL_DATABASE.authorizedAdminEmails[0]);
          }
        }
        if (!parsed.adminAuditLogs || !Array.isArray(parsed.adminAuditLogs)) {
          parsed.adminAuditLogs = [...INITIAL_DATABASE.adminAuditLogs];
        }
        if (!parsed.adminSessions || !Array.isArray(parsed.adminSessions)) {
          parsed.adminSessions = [];
        }
        // Merge with initial in case new keys were added in schema
        this.cache = { ...INITIAL_DATABASE, ...parsed };
        this.syncGalleryWithMediaLibrary(this.cache!);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      }
    } catch {
      this.cache = INITIAL_DATABASE;
      this.syncGalleryWithMediaLibrary(this.cache!);
    }
  }

  private syncGalleryWithMediaLibrary(db: DatabaseSchema): void {
    if (!db.mediaLibrary) db.mediaLibrary = [];
    if (!db.galleryPhotos) db.galleryPhotos = [];

    // Ensure all galleryPhotos are represented in mediaLibrary
    const mediaUrls = new Set(db.mediaLibrary.map((m) => m.url));
    db.galleryPhotos.forEach((p) => {
      if (!mediaUrls.has(p.imageUrl)) {
        db.mediaLibrary.push({
          id: p.id || 'media-' + Math.random().toString(36).substr(2, 9),
          title: p.title,
          fileName: p.imageUrl.split('/').pop()?.split('?')[0] || 'photo.jpg',
          fileType: 'image/jpeg',
          fileSize: 1024 * 750,
          fileSizeFormatted: '750 KB',
          url: p.imageUrl,
          thumbnailUrl: p.imageUrl,
          mediumUrl: p.imageUrl,
          largeUrl: p.imageUrl,
          dimensions: { width: 1200, height: 800 },
          aspectRatio: p.aspectRatio === 'square' ? '1:1' : p.aspectRatio === 'portrait' ? '4:5' : '16:9',
          altText: p.title,
          caption: p.caption || '',
          tags: p.tags || ['Living Archive'],
          category: p.category || 'General',
          albumId: p.albumId,
          albumTitle: p.albumTitle,
          isFeatured: p.isFeatured,
          uploadedAt: p.createdAt || new Date().toISOString(),
          uploadedBy: 'Curator',
          storageProvider: 'local',
        });
        mediaUrls.add(p.imageUrl);
      }
    });

    // Ensure all mediaLibrary items are also represented in galleryPhotos
    const galleryUrls = new Set(db.galleryPhotos.map((p) => p.imageUrl));
    db.mediaLibrary.forEach((m, idx) => {
      if (!galleryUrls.has(m.url)) {
        db.galleryPhotos.push({
          id: 'photo-' + m.id,
          title: m.title,
          caption: m.caption || m.title,
          category: (m.category || 'General') as any,
          albumId: m.albumId,
          albumTitle: m.albumTitle,
          tags: m.tags || ['Archival'],
          imageUrl: m.url,
          aspectRatio: m.aspectRatio === '1:1' ? 'square' : m.aspectRatio === '4:5' ? 'portrait' : 'landscape',
          isFeatured: m.isFeatured || false,
          order: 100 + idx,
          year: '2026',
          credit: 'Rang Gurukul Media Vault',
          createdAt: m.uploadedAt || new Date().toISOString(),
        });
        galleryUrls.add(m.url);
      }
    });
  }

  private save(): void {
    if (!this.cache) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      window.dispatchEvent(
        new CustomEvent(DB_CHANGE_EVENT, {
          detail: { ...this.cache, mediaLibrary: [...(this.cache.mediaLibrary || [])] },
        })
      );
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  public getSnapshot(): DatabaseSchema {
    if (!this.cache) {
      this.ensureInitialized();
    }
    return this.cache!;
  }

  public resetToDefaults(): DatabaseSchema {
    this.cache = INITIAL_DATABASE;
    this.save();
    return this.cache;
  }

  // --- SUBSCRIBERS ---
  public getSubscribers(): Subscriber[] {
    return this.getSnapshot().subscribers;
  }

  public addSubscriber(name: string, email: string, source = 'Website', interests: string[] = ['All Updates']): { success: boolean; message: string; subscriber?: Subscriber } {
    const db = this.getSnapshot();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const existingIndex = db.subscribers.findIndex((s) => s.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      const existing = db.subscribers[existingIndex];
      if (existing.status === 'active') {
        return { success: false, message: 'This email is already actively subscribed to Rang Gurukul updates.' };
      }
      // Re-activate if was unsubscribed
      db.subscribers[existingIndex].status = 'active';
      db.subscribers[existingIndex].subscribedAt = new Date().toISOString();
      this.save();
      return { success: true, message: 'Welcome back! Your subscription has been re-activated.', subscriber: db.subscribers[existingIndex] };
    }

    const newSub: Subscriber = {
      id: 'sub-' + Date.now(),
      name: cleanName || 'Cultural Rasika',
      email: cleanEmail,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      source,
      interests,
      unsubscribeToken: 'unsub_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
    };

    db.subscribers.unshift(newSub);
    this.save();
    return { success: true, message: 'Thank you for joining the Rang Gurukul circle. You will receive rare cultural dispatches.', subscriber: newSub };
  }

  public unsubscribe(tokenOrEmail: string): boolean {
    const db = this.getSnapshot();
    const idx = db.subscribers.findIndex(
      (s) => s.unsubscribeToken === tokenOrEmail || s.email.toLowerCase() === tokenOrEmail.toLowerCase()
    );
    if (idx >= 0) {
      db.subscribers[idx].status = 'unsubscribed';
      this.save();
      return true;
    }
    return false;
  }

  public toggleSubscriberStatus(id: string): void {
    const db = this.getSnapshot();
    const sub = db.subscribers.find((s) => s.id === id);
    if (sub) {
      sub.status = sub.status === 'active' ? 'unsubscribed' : 'active';
      this.save();
    }
  }

  public deleteSubscriber(id: string): void {
    const db = this.getSnapshot();
    db.subscribers = db.subscribers.filter((s) => s.id !== id);
    this.save();
  }

  // --- EMAIL BROADCAST / ANNOUNCEMENTS ---
  public getEmailBroadcasts(): EmailBroadcast[] {
    return this.getSnapshot().emailBroadcasts;
  }

  public sendAnnouncement(data: Omit<EmailBroadcast, 'id' | 'sentAt' | 'recipientCount' | 'openRateEstimated' | 'provider'>): EmailBroadcast {
    const db = this.getSnapshot();
    const activeSubscribers = db.subscribers.filter((s) => s.status === 'active');
    const recipientCount = data.targetAudience === 'members_only' ? db.members.filter((m) => m.status === 'active').length : activeSubscribers.length;

    const newBroadcast: EmailBroadcast = {
      ...data,
      id: 'broad-' + Date.now(),
      sentAt: new Date().toISOString(),
      recipientCount,
      openRateEstimated: 'Sent successfully to ' + recipientCount + ' recipients via ' + db.emailConfig.provider,
      provider: db.emailConfig.provider,
    };

    db.emailBroadcasts.unshift(newBroadcast);
    this.save();
    return newBroadcast;
  }

  // --- MEMBERSHIP PLANS ---
  public getMembershipPlans(): MembershipPlan[] {
    return [...this.getSnapshot().membershipPlans].sort((a, b) => a.order - b.order);
  }

  public saveMembershipPlan(plan: Partial<MembershipPlan> & { name: string; price: number; duration: string }): MembershipPlan {
    const db = this.getSnapshot();
    const now = new Date().toISOString();

    if (plan.id) {
      const idx = db.membershipPlans.findIndex((p) => p.id === plan.id);
      if (idx >= 0) {
        db.membershipPlans[idx] = {
          ...db.membershipPlans[idx],
          ...plan,
          updatedAt: now,
        };
        this.save();
        return db.membershipPlans[idx];
      }
    }

    const newPlan: MembershipPlan = {
      id: plan.id || 'plan-' + Date.now(),
      name: plan.name,
      duration: plan.duration,
      durationMonths: plan.durationMonths || 12,
      price: plan.price,
      description: plan.description || '',
      benefits: plan.benefits || [],
      status: plan.status || 'active',
      order: plan.order ?? db.membershipPlans.length + 1,
      badge: plan.badge || 'Cultural Internship',
      isPopular: !!plan.isPopular,
      createdAt: now,
      updatedAt: now,
    };

    db.membershipPlans.push(newPlan);
    this.save();
    return newPlan;
  }

  public deleteMembershipPlan(id: string): void {
    const db = this.getSnapshot();
    db.membershipPlans = db.membershipPlans.filter((p) => p.id !== id);
    this.save();
  }

  public reorderMembershipPlans(orderedIds: string[]): void {
    const db = this.getSnapshot();
    orderedIds.forEach((id, index) => {
      const plan = db.membershipPlans.find((p) => p.id === id);
      if (plan) plan.order = index + 1;
    });
    this.save();
  }

  // --- MEMBERS ---
  public getMembers(): MemberUser[] {
    return this.getSnapshot().members;
  }

  public createMemberAccount(params: {
    name: string;
    email: string;
    phone: string;
    planId: string;
    paymentMethod: string;
    amountPaid: number;
    address?: string;
    city?: string;
  }): MemberUser {
    const db = this.getSnapshot();
    const plan = db.membershipPlans.find((p) => p.id === params.planId) || db.membershipPlans[0];
    const durationMonths = plan.durationMonths || 12;
    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + durationMonths);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const membershipId = `RG-M-2026-${randomSuffix}`;

    const newMember: MemberUser = {
      id: 'mem-' + Date.now(),
      membershipId,
      name: params.name,
      email: params.email.trim().toLowerCase(),
      phone: params.phone,
      planId: plan.id,
      planName: plan.name,
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      status: 'active',
      amountPaid: params.amountPaid || plan.price,
      paymentMethod: params.paymentMethod || 'Razorpay Online',
      transactionId: 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      address: params.address || '',
      city: params.city || '',
      bio: 'Honored Intern of Rang Gurukul',
      createdAt: now.toISOString(),
      notificationPreferences: { email: true, whatsapp: true },
    };

    db.members.unshift(newMember);

    // Also automatically subscribe member to communications
    this.addSubscriber(params.name, params.email, 'Membership Purchase', ['Member Updates', 'All Updates']);

    this.save();
    return newMember;
  }

  public updateMemberProfile(id: string, updates: Partial<MemberUser>): MemberUser | null {
    const db = this.getSnapshot();
    const idx = db.members.findIndex((m) => m.id === id);
    if (idx >= 0) {
      db.members[idx] = { ...db.members[idx], ...updates };
      this.save();
      return db.members[idx];
    }
    return null;
  }

  // --- PARTICIPATION REQUESTS ---
  public getParticipationOpportunities(): ParticipationOpportunity[] {
    return this.getSnapshot().participationOpportunities;
  }

  public getParticipationRequests(memberId?: string): ParticipationRequest[] {
    const all = this.getSnapshot().participationRequests;
    if (memberId) {
      return all.filter((r) => r.memberId === memberId);
    }
    return all;
  }

  public submitParticipationRequest(data: {
    memberId: string;
    memberName: string;
    memberEmail: string;
    opportunityId: string;
    opportunityTitle: string;
    statement: string;
    experienceNotes: string;
  }): ParticipationRequest {
    const db = this.getSnapshot();
    const newReq: ParticipationRequest = {
      ...data,
      id: 'req-' + Date.now(),
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };
    db.participationRequests.unshift(newReq);
    this.save();
    return newReq;
  }

  public updateParticipationRequestStatus(id: string, status: ParticipationRequest['status']): void {
    const db = this.getSnapshot();
    const req = db.participationRequests.find((r) => r.id === id);
    if (req) {
      req.status = status;
      this.save();
    }
  }

  // --- WORKSHOPS & FORM BUILDER ---
  public getWorkshops(): Workshop[] {
    return this.getSnapshot().workshops;
  }

  public getWorkshopById(id: string): Workshop | undefined {
    return this.getSnapshot().workshops.find((w) => w.id === id);
  }

  public saveWorkshop(workshop: Partial<Workshop> & { title: string; price: number }): Workshop {
    const db = this.getSnapshot();
    if (workshop.id) {
      const idx = db.workshops.findIndex((w) => w.id === workshop.id);
      if (idx >= 0) {
        db.workshops[idx] = { ...db.workshops[idx], ...workshop };
        this.save();
        return db.workshops[idx];
      }
    }

    const defaultFields: FormField[] = [
      { id: 'field_name', label: 'Full Legal Name', type: 'text', required: true, order: 1 },
      { id: 'field_email', label: 'Email Address', type: 'email', required: true, order: 2 },
      { id: 'field_phone', label: 'Contact Phone Number', type: 'phone', required: true, order: 3 },
      { id: 'field_background', label: 'Artistic Background / Prior Experience', type: 'longtext', required: true, order: 4 },
    ];

    const newWorkshop: Workshop = {
      id: workshop.id || 'ws-' + Date.now(),
      title: workshop.title,
      subtitle: workshop.subtitle || '',
      description: workshop.description || '',
      instructor: workshop.instructor || 'Sansthan Master Guru',
      instructorBio: workshop.instructorBio || '',
      instructorAvatar: workshop.instructorAvatar,
      date: workshop.date || 'TBA 2026',
      time: workshop.time || '10:00 AM – 04:00 PM IST',
      duration: workshop.duration || '3 Days',
      location: workshop.location || 'Rang Gurukul Sanctum Campus, Dehradun',
      isOnline: !!workshop.isOnline,
      price: workshop.price,
      maxParticipants: workshop.maxParticipants || 20,
      availableSeats: workshop.availableSeats ?? workshop.maxParticipants ?? 20,
      image: workshop.image || '/assets/craft.jpg',
      requirements: workshop.requirements || ['Passion for Indian classical arts and dedicated attendance.'],
      benefits: workshop.benefits || ['Certificate of Completion', 'Direct feedback from mentor'],
      status: workshop.status || 'Open',
      category: workshop.category || 'Theatre',
      requiredMembershipTier: workshop.requiredMembershipTier || 'all',
      formFields: workshop.formFields && workshop.formFields.length > 0 ? workshop.formFields : defaultFields,
      createdAt: new Date().toISOString(),
    };

    db.workshops.unshift(newWorkshop);
    this.save();
    return newWorkshop;
  }

  public deleteWorkshop(id: string): void {
    const db = this.getSnapshot();
    db.workshops = db.workshops.filter((w) => w.id !== id);
    this.save();
  }

  public updateWorkshopFormFields(workshopId: string, formFields: FormField[]): Workshop | null {
    const db = this.getSnapshot();
    const ws = db.workshops.find((w) => w.id === workshopId);
    if (ws) {
      ws.formFields = formFields;
      this.save();
      return ws;
    }
    return null;
  }

  // --- WORKSHOP REGISTRATIONS ---
  public getWorkshopRegistrations(workshopId?: string): WorkshopRegistration[] {
    const all = this.getSnapshot().workshopRegistrations;
    if (workshopId) {
      return all.filter((r) => r.workshopId === workshopId);
    }
    return all;
  }

  public submitWorkshopRegistration(params: {
    workshopId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    amountPaid: number;
    answers: Record<string, any>;
    paymentMethod?: string;
  }): WorkshopRegistration {
    const db = this.getSnapshot();
    const workshop = db.workshops.find((w) => w.id === params.workshopId);
    const regNum = `RG-WS-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReg: WorkshopRegistration = {
      id: 'wreg-' + Date.now(),
      registrationNumber: regNum,
      workshopId: params.workshopId,
      workshopTitle: workshop ? workshop.title : 'Workshop',
      participantName: params.participantName,
      participantEmail: params.participantEmail.trim().toLowerCase(),
      participantPhone: params.participantPhone,
      registrationDate: new Date().toISOString(),
      amountPaid: params.amountPaid,
      paymentStatus: 'Paid',
      registrationStatus: 'Approved',
      answers: params.answers,
      transactionId: 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    if (workshop && workshop.availableSeats > 0) {
      workshop.availableSeats -= 1;
      if (workshop.availableSeats === 0) {
        workshop.status = 'Sold Out';
      }
    }

    db.workshopRegistrations.unshift(newReg);
    this.addSubscriber(params.participantName, params.participantEmail, 'Workshop Registration', ['Workshops', 'All Updates']);
    this.save();
    return newReg;
  }

  public updateRegistrationStatus(id: string, status: WorkshopRegistration['registrationStatus']): void {
    const db = this.getSnapshot();
    const reg = db.workshopRegistrations.find((r) => r.id === id);
    if (reg) {
      reg.registrationStatus = status;
      this.save();
    }
  }

  public deleteRegistration(id: string): void {
    const db = this.getSnapshot();
    db.workshopRegistrations = db.workshopRegistrations.filter((r) => r.id !== id);
    this.save();
  }

  // --- GALLERY & MEDIA ---
  public getGalleryPhotos(category?: string, albumId?: string): GalleryPhoto[] {
    let photos = this.getSnapshot().galleryPhotos;
    if (albumId && albumId !== 'all') {
      photos = photos.filter((p) => p.albumId === albumId);
    }
    if (category && category !== 'All' && category !== 'all') {
      photos = photos.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return photos;
  }

  public getGalleryAlbums(): GalleryAlbum[] {
    return this.getSnapshot().galleryAlbums;
  }

  public saveGalleryPhoto(photo: Partial<GalleryPhoto> & { title: string; imageUrl: string }): GalleryPhoto {
    const db = this.getSnapshot();
    if (photo.id) {
      const idx = db.galleryPhotos.findIndex((p) => p.id === photo.id);
      if (idx >= 0) {
        db.galleryPhotos[idx] = { ...db.galleryPhotos[idx], ...photo };
        this.save();
        return db.galleryPhotos[idx];
      }
    }

    const newPhoto: GalleryPhoto = {
      id: 'photo-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: photo.title,
      caption: photo.caption || '',
      category: photo.category || 'Performances',
      albumId: photo.albumId,
      albumTitle: photo.albumTitle,
      tags: photo.tags || ['Rang Gurukul', 'Art Archive'],
      imageUrl: photo.imageUrl,
      aspectRatio: photo.aspectRatio || 'landscape',
      isFeatured: !!photo.isFeatured,
      order: photo.order ?? db.galleryPhotos.length + 1,
      year: photo.year || '2026',
      credit: photo.credit || 'Rang Gurukul Living Heritage Archive',
      createdAt: new Date().toISOString(),
    };

    db.galleryPhotos.unshift(newPhoto);

    // Update album count if associated
    if (newPhoto.albumId) {
      const album = db.galleryAlbums.find((a) => a.id === newPhoto.albumId);
      if (album) album.photoCount += 1;
    }

    this.save();
    return newPhoto;
  }

  public bulkAddPhotos(photosData: Array<{ title: string; imageUrl: string; category?: string; albumId?: string }>): number {
    const db = this.getSnapshot();
    let addedCount = 0;
    photosData.forEach((p) => {
      const newPhoto: GalleryPhoto = {
        id: 'photo-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        title: p.title || 'Cultural Archive Photo',
        caption: 'Archival capture from the Rang Gurukul living repertoire.',
        category: (p.category as any) || 'Performances',
        albumId: p.albumId,
        tags: ['Living Archive', 'Rang Gurukul'],
        imageUrl: p.imageUrl,
        aspectRatio: 'landscape',
        isFeatured: false,
        order: db.galleryPhotos.length + 1,
        year: '2026',
        createdAt: new Date().toISOString(),
      };
      db.galleryPhotos.unshift(newPhoto);
      addedCount++;
    });
    this.save();
    return addedCount;
  }

  public deleteGalleryPhoto(id: string): void {
    const db = this.getSnapshot();
    const photoToDelete = db.galleryPhotos.find((p) => p.id === id);
    db.galleryPhotos = db.galleryPhotos.filter((p) => p.id !== id);
    if (photoToDelete && db.mediaLibrary) {
      db.mediaLibrary = db.mediaLibrary.filter(
        (m) =>
          m.id !== id &&
          'photo-' + m.id !== id &&
          m.url !== photoToDelete.imageUrl &&
          m.largeUrl !== photoToDelete.imageUrl
      );
    }
    this.save();
  }

  public saveAlbum(album: Partial<GalleryAlbum> & { title: string }): GalleryAlbum {
    const db = this.getSnapshot();
    if (album.id) {
      const idx = db.galleryAlbums.findIndex((a) => a.id === album.id);
      if (idx >= 0) {
        db.galleryAlbums[idx] = { ...db.galleryAlbums[idx], ...album };
        this.save();
        return db.galleryAlbums[idx];
      }
    }

    const newAlbum: GalleryAlbum = {
      id: 'alb-' + Date.now(),
      title: album.title,
      description: album.description || '',
      coverImage: album.coverImage || '/assets/hero.jpg',
      category: album.category || 'Performances',
      year: album.year || '2026',
      photoCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.galleryAlbums.unshift(newAlbum);
    this.save();
    return newAlbum;
  }

  public deleteAlbum(id: string): void {
    const db = this.getSnapshot();
    db.galleryAlbums = (db.galleryAlbums || []).filter((a) => a.id !== id);
    if (db.galleryPhotos) {
      db.galleryPhotos = db.galleryPhotos.map((p) =>
        p.albumId === id ? { ...p, albumId: undefined, albumTitle: undefined } : p
      );
    }
    if (db.mediaLibrary) {
      db.mediaLibrary = db.mediaLibrary.map((m) =>
        m.albumId === id ? { ...m, albumId: undefined, albumTitle: undefined } : m
      );
    }
    this.save();
  }

  // --- HOMEPAGE & CONTENT IMAGE MANAGEMENT ---
  public getHomepageConfig(): HomepageConfig {
    return this.getSnapshot().homepageConfig;
  }

  public updateHomepageConfig(updates: Partial<HomepageConfig>): HomepageConfig {
    const db = this.getSnapshot();
    db.homepageConfig = { ...db.homepageConfig, ...updates };
    this.save();
    return db.homepageConfig;
  }

  // --- SETTINGS ---
  public getSiteSettings(): SiteSettings {
    return this.getSnapshot().siteSettings;
  }

  public updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
    const db = this.getSnapshot();
    db.siteSettings = { ...db.siteSettings, ...updates };
    this.save();
    return db.siteSettings;
  }

  public getPaymentConfig(): PaymentGatewayConfig {
    return this.getSnapshot().paymentConfig;
  }

  public updatePaymentConfig(updates: Partial<PaymentGatewayConfig>): PaymentGatewayConfig {
    const db = this.getSnapshot();
    db.paymentConfig = { ...db.paymentConfig, ...updates };
    this.save();
    return db.paymentConfig;
  }

  public getEmailConfig(): EmailProviderConfig {
    return this.getSnapshot().emailConfig;
  }

  public updateEmailConfig(updates: Partial<EmailProviderConfig>): EmailProviderConfig {
    const db = this.getSnapshot();
    db.emailConfig = { ...db.emailConfig, ...updates };
    this.save();
    return db.emailConfig;
  }

  // --- ADMIN USERS & ROLES ---
  public getAdminUsers(): AdminUser[] {
    return this.getSnapshot().adminUsers;
  }

  public saveAdminUser(admin: Partial<AdminUser> & { name: string; email: string; role: AdminUser['role'] }): AdminUser {
    const db = this.getSnapshot();
    if (admin.id) {
      const idx = db.adminUsers.findIndex((a) => a.id === admin.id);
      if (idx >= 0) {
        db.adminUsers[idx] = { ...db.adminUsers[idx], ...admin };
        this.save();
        return db.adminUsers[idx];
      }
    }

    const defaultPermissions = {
      canManageAdmins: admin.role === 'OWNER',
      canManageContent: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(admin.role),
      canManageMembership: ['OWNER', 'SUPER_ADMIN', 'MEMBERSHIP_ADMIN'].includes(admin.role),
      canManageWorkshops: ['OWNER', 'SUPER_ADMIN', 'WORKSHOP_ADMIN'].includes(admin.role),
      canManageSubscribers: ['OWNER', 'SUPER_ADMIN', 'COMMUNICATION_ADMIN'].includes(admin.role),
      canManageGallery: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(admin.role),
      canManageSettings: ['OWNER', 'SUPER_ADMIN'].includes(admin.role),
      canManagePrices: ['OWNER'].includes(admin.role),
    };

    const newAdmin: AdminUser = {
      id: 'adm-' + Date.now(),
      name: admin.name,
      email: admin.email.trim().toLowerCase(),
      role: admin.role,
      status: admin.status || 'active',
      avatar: admin.avatar,
      permissions: admin.permissions || defaultPermissions,
      createdAt: new Date().toISOString(),
    };

    db.adminUsers.push(newAdmin);
    this.save();
    return newAdmin;
  }

  public toggleAdminStatus(id: string, actorEmail?: string): { success: boolean; message: string } {
    const db = this.getSnapshot();
    if (actorEmail) {
      const actor = db.adminUsers.find((a) => a.email.toLowerCase() === actorEmail.toLowerCase() && a.status === 'active');
      if (!actor || actor.role !== 'OWNER') {
        return { success: false, message: 'Permission denied: Only the Primary Website Owner can toggle administrator status.' };
      }
    }
    const adm = db.adminUsers.find((a) => a.id === id);
    if (!adm) return { success: false, message: 'Administrator not found.' };

    if (adm.role === 'OWNER') {
      const activeOwners = db.adminUsers.filter((a) => a.role === 'OWNER' && a.status === 'active');
      if (adm.status === 'active' && activeOwners.length <= 1) {
        return { success: false, message: 'Operation blocked: Cannot disable the last remaining Primary Owner account.' };
      }
    }

    adm.status = adm.status === 'active' ? 'disabled' : 'active';
    // Sync with authorizedAdminEmails
    if (!db.authorizedAdminEmails) db.authorizedAdminEmails = [];
    const authEntry = db.authorizedAdminEmails.find((ae) => ae.email.toLowerCase() === adm.email.toLowerCase());
    if (authEntry) {
      authEntry.status = adm.status;
    }
    if (adm.status === 'disabled') {
      this.revokeAllSessionsForEmail(adm.email);
    }
    this.addAdminAuditLog({
      action: 'STATUS_CHANGED',
      actorEmail: actorEmail || 'system',
      targetEmail: adm.email,
      details: `Administrator account status changed to '${adm.status}'.`,
      status: 'SUCCESS',
    });
    this.save();
    return { success: true, message: `Administrator status successfully updated to ${adm.status}.` };
  }

  public toggleAuthorizedEmailStatus(id: string, actorEmail?: string): { success: boolean; message: string } {
    return this.toggleAdminStatus(id, actorEmail);
  }

  public deleteAdminUser(id: string, actorEmail?: string): { success: boolean; message: string } {
    const db = this.getSnapshot();
    if (actorEmail) {
      const actor = db.adminUsers.find((a) => a.email.toLowerCase() === actorEmail.toLowerCase() && a.status === 'active');
      if (!actor || actor.role !== 'OWNER') {
        return { success: false, message: 'Permission denied: Only the Primary Website Owner can remove administrator authorizations.' };
      }
    }
    const adm = db.adminUsers.find((a) => a.id === id);
    if (!adm) return { success: false, message: 'Administrator not found.' };

    if (adm.role === 'OWNER') {
      const owners = db.adminUsers.filter((a) => a.role === 'OWNER');
      if (owners.length <= 1) {
        return { success: false, message: 'Operation blocked: Cannot delete or remove the last remaining Primary Owner account.' };
      }
    }

    const targetEmail = adm.email;
    db.adminUsers = db.adminUsers.filter((a) => a.id !== id);
    if (db.authorizedAdminEmails) {
      db.authorizedAdminEmails = db.authorizedAdminEmails.filter((ae) => ae.email.toLowerCase() !== targetEmail.toLowerCase());
    }
    this.revokeAllSessionsForEmail(targetEmail);
    this.addAdminAuditLog({
      action: 'ADMIN_REMOVED',
      actorEmail: actorEmail || 'system',
      targetEmail,
      details: `Administrator authorization permanently revoked and all active sessions terminated.`,
      status: 'SUCCESS',
    });
    this.save();
    return { success: true, message: `Administrator ${targetEmail} access successfully revoked.` };
  }

  // --- OWNER-CONTROLLED ADMIN ACCESS MANAGEMENT ---
  public getAuthorizedAdminEmails(): AuthorizedAdminEmail[] {
    const db = this.getSnapshot();
    if (!db.authorizedAdminEmails || db.authorizedAdminEmails.length === 0) {
      db.authorizedAdminEmails = [...INITIAL_DATABASE.authorizedAdminEmails];
      this.save();
    }
    return db.authorizedAdminEmails;
  }

  public addAuthorizedEmail(
    params: { email: string; name: string; role: AdminUser['role']; notes?: string },
    actorEmail: string
  ): { success: boolean; message: string; record?: AuthorizedAdminEmail } {
    const db = this.getSnapshot();
    const cleanActor = actorEmail.trim().toLowerCase();
    const actor = db.adminUsers.find((a) => a.email.toLowerCase() === cleanActor && a.status === 'active');
    
    // Strict Owner check
    if (!actor || actor.role !== 'OWNER') {
      this.addAdminAuditLog({
        action: 'ADMIN_ADDED',
        actorEmail: cleanActor,
        targetEmail: params.email,
        details: 'Unauthorized attempt to add admin email blocked: Actor is not an Owner.',
        status: 'DENIED',
      });
      return { success: false, message: 'Permission denied: Only the Primary Website Owner can authorize administrator email addresses.' };
    }

    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Invalid email address format.' };
    }

    if (!db.authorizedAdminEmails) db.authorizedAdminEmails = [];
    const existing = db.authorizedAdminEmails.find((ae) => ae.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: `Email ${cleanEmail} is already registered on the authorized list.` };
    }

    const isPrimary = params.role === 'OWNER';
    const newAuthRecord: AuthorizedAdminEmail = {
      id: 'auth-email-' + Date.now(),
      email: cleanEmail,
      name: params.name.trim(),
      role: params.role,
      isPrimaryOwner: isPrimary,
      status: 'active',
      addedBy: cleanActor,
      addedAt: new Date().toISOString(),
      notes: params.notes || 'Authorized Staff Administrator',
    };

    db.authorizedAdminEmails.push(newAuthRecord);

    // Also sync into adminUsers
    const existingAdminIdx = db.adminUsers.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (existingAdminIdx >= 0) {
      db.adminUsers[existingAdminIdx] = {
        ...db.adminUsers[existingAdminIdx],
        name: params.name.trim(),
        role: params.role,
        status: 'active',
        isPrimaryOwner: isPrimary,
      };
    } else {
      const defaultPermissions = {
        canManageAdmins: params.role === 'OWNER',
        canManageContent: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(params.role),
        canManageMembership: ['OWNER', 'SUPER_ADMIN', 'MEMBERSHIP_ADMIN'].includes(params.role),
        canManageWorkshops: ['OWNER', 'SUPER_ADMIN', 'WORKSHOP_ADMIN'].includes(params.role),
        canManageSubscribers: ['OWNER', 'SUPER_ADMIN', 'COMMUNICATION_ADMIN'].includes(params.role),
        canManageGallery: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(params.role),
        canManageSettings: ['OWNER', 'SUPER_ADMIN'].includes(params.role),
        canManagePrices: ['OWNER'].includes(params.role),
      };

      db.adminUsers.push({
        id: 'adm-' + Date.now(),
        name: params.name.trim(),
        email: cleanEmail,
        role: params.role,
        status: 'active',
        isPrimaryOwner: isPrimary,
        permissions: defaultPermissions,
        createdAt: new Date().toISOString(),
        addedBy: cleanActor,
        addedAt: new Date().toISOString(),
      });
    }

    this.addAdminAuditLog({
      action: 'ADMIN_ADDED',
      actorEmail: cleanActor,
      targetEmail: cleanEmail,
      details: `New administrator email authorized with role ${params.role}.`,
      status: 'SUCCESS',
    });

    this.save();
    return {
      success: true,
      message: `Administrator email ${cleanEmail} successfully authorized for ${params.role} access.`,
      record: newAuthRecord,
    };
  }

  public removeAuthorizedEmail(idOrEmail: string, actorEmail: string): { success: boolean; message: string } {
    const db = this.getSnapshot();
    const cleanActor = actorEmail.trim().toLowerCase();
    const actor = db.adminUsers.find((a) => a.email.toLowerCase() === cleanActor && a.status === 'active');
    
    if (!actor || actor.role !== 'OWNER') {
      this.addAdminAuditLog({
        action: 'ADMIN_REMOVED',
        actorEmail: cleanActor,
        details: 'Unauthorized attempt to remove admin email blocked: Actor is not an Owner.',
        status: 'DENIED',
      });
      return { success: false, message: 'Permission denied: Only the Primary Website Owner can revoke administrator authorizations.' };
    }

    if (!db.authorizedAdminEmails) db.authorizedAdminEmails = [];
    const targetAuth = db.authorizedAdminEmails.find(
      (ae) => ae.id === idOrEmail || ae.email.toLowerCase() === idOrEmail.toLowerCase()
    );

    if (!targetAuth) {
      return { success: false, message: 'Authorized administrator email record not found.' };
    }

    // Check last primary owner protection
    if (targetAuth.role === 'OWNER') {
      const activeOwners = db.authorizedAdminEmails.filter((ae) => ae.role === 'OWNER' && ae.status === 'active');
      if (activeOwners.length <= 1) {
        this.addAdminAuditLog({
          action: 'ADMIN_REMOVED',
          actorEmail: cleanActor,
          targetEmail: targetAuth.email,
          details: 'Attempt to delete last primary owner blocked by safety guardrail.',
          status: 'BLOCKED',
        });
        return { success: false, message: 'Operation blocked: Cannot delete or remove the last remaining Primary Owner account.' };
      }
    }

    const targetEmail = targetAuth.email.toLowerCase();
    db.authorizedAdminEmails = db.authorizedAdminEmails.filter((ae) => ae.email.toLowerCase() !== targetEmail);
    db.adminUsers = db.adminUsers.filter((a) => a.email.toLowerCase() !== targetEmail);
    this.revokeAllSessionsForEmail(targetEmail);

    this.addAdminAuditLog({
      action: 'ADMIN_REMOVED',
      actorEmail: cleanActor,
      targetEmail,
      details: 'Administrator email authorization permanently removed by Owner. All active sessions invalidated.',
      status: 'SUCCESS',
    });

    this.save();
    return { success: true, message: `Administrator authorization for ${targetEmail} removed.` };
  }

  // --- AUDIT LOGS ---
  public getAdminAuditLogs(): AdminAuditLog[] {
    const db = this.getSnapshot();
    if (!db.adminAuditLogs) db.adminAuditLogs = [];
    return [...db.adminAuditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAdminAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): AdminAuditLog {
    const db = this.getSnapshot();
    if (!db.adminAuditLogs) db.adminAuditLogs = [];

    const newLog: AdminAuditLog = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      ...log,
    };

    db.adminAuditLogs.unshift(newLog);
    // Cap at 200 items
    if (db.adminAuditLogs.length > 200) {
      db.adminAuditLogs = db.adminAuditLogs.slice(0, 200);
    }
    this.save();
    return newLog;
  }

  // --- STRICT VERIFICATION & ACCESS CONTROL ---
  public verifyAdminAccess(
    email: string,
    method: 'google' | 'password',
    ip?: string,
    userAgent?: string
  ): {
    authorized: boolean;
    errorType?: 'NOT_AUTHORIZED' | 'ACCOUNT_DISABLED' | 'INVALID_ROLE';
    message: string;
    admin?: AdminUser;
    isOwner?: boolean;
    sessionToken?: string;
  } {
    const db = this.getSnapshot();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check in authorizedAdminEmails
    const authList = db.authorizedAdminEmails || [];
    const authRecord = authList.find((ae) => ae.email.toLowerCase() === cleanEmail);

    // 2. Also cross-reference in adminUsers
    const adminUser = db.adminUsers.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!authRecord && !adminUser) {
      if (method === 'google') {
        this.addAdminAuditLog({
          action: 'GOOGLE_AUTH_DENIED',
          actorEmail: cleanEmail,
          details: 'Unauthorized Google account attempted login. Blocked: Email not in authorized administrator list.',
          status: 'DENIED',
          ipAddress: ip,
          userAgent,
        });
        return {
          authorized: false,
          errorType: 'NOT_AUTHORIZED',
          message: 'This Google account is not authorized to access the Rang Gurukul Admin Panel. Please contact the website owner for access.',
        };
      }

      this.addAdminAuditLog({
        action: 'LOGIN_FAILED',
        actorEmail: cleanEmail,
        details: 'Login rejected: Email address not on authorized administrator whitelist.',
        status: 'DENIED',
        ipAddress: ip,
        userAgent,
      });
      return {
        authorized: false,
        errorType: 'NOT_AUTHORIZED',
        message: 'Access Denied: Your email address has not been authorized by the Rang Gurukul owner.',
      };
    }

    // Check if deactivated / disabled
    const isDeactivated =
      (authRecord && authRecord.status === 'disabled') || (adminUser && adminUser.status === 'disabled');

    if (isDeactivated) {
      this.addAdminAuditLog({
        action: 'LOGIN_FAILED',
        actorEmail: cleanEmail,
        details: 'Login blocked: Account has been deactivated by the Sansthan Trustee.',
        status: 'BLOCKED',
        ipAddress: ip,
        userAgent,
      });
      return {
        authorized: false,
        errorType: 'ACCOUNT_DISABLED',
        message: 'Access Restricted: This administrator account has been deactivated by the Sansthan Trustee.',
      };
    }

    // Active & Authorized
    const matchedAdmin = adminUser || {
      id: authRecord!.id,
      name: authRecord!.name,
      email: authRecord!.email,
      role: authRecord!.role,
      status: 'active' as const,
      isPrimaryOwner: authRecord!.isPrimaryOwner,
      permissions: {
        canManageAdmins: authRecord!.role === 'OWNER',
        canManageContent: true,
        canManageMembership: true,
        canManageWorkshops: true,
        canManageSubscribers: true,
        canManageGallery: true,
        canManageSettings: authRecord!.role === 'OWNER' || authRecord!.role === 'SUPER_ADMIN',
        canManagePrices: authRecord!.role === 'OWNER',
      },
      createdAt: authRecord!.addedAt,
    };

    // Update lastLogin
    const nowIso = new Date().toISOString();
    matchedAdmin.lastLogin = nowIso;
    if (adminUser) adminUser.lastLogin = nowIso;
    if (authRecord) authRecord.lastLogin = nowIso;

    // Create session
    const session = this.createAdminSession(matchedAdmin, ip, userAgent);

    this.addAdminAuditLog({
      action: 'LOGIN_SUCCESS',
      actorEmail: cleanEmail,
      details: `Administrator session authenticated successfully via ${
        method === 'google' ? 'Google OAuth' : 'Password / Passcode'
      }. Role: ${matchedAdmin.role}`,
      status: 'SUCCESS',
      ipAddress: ip,
      userAgent,
    });

    this.save();
    return {
      authorized: true,
      admin: matchedAdmin,
      isOwner: matchedAdmin.role === 'OWNER',
      sessionToken: session.token,
      message: `Welcome back, ${matchedAdmin.name}. Access granted.`,
    };
  }

  // --- SESSIONS ---
  public createAdminSession(admin: AdminUser, ip?: string, userAgent?: string): AdminSession {
    const db = this.getSnapshot();
    if (!db.adminSessions) db.adminSessions = [];

    const token =
      'rg_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    const session: AdminSession = {
      token,
      adminId: admin.id,
      email: admin.email.toLowerCase(),
      role: admin.role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
      ipAddress: ip,
      userAgent,
    };

    db.adminSessions.push(session);
    this.save();
    return session;
  }

  public validateAdminSession(token: string): { valid: boolean; admin?: AdminUser } {
    if (!token) return { valid: false };
    const db = this.getSnapshot();
    if (!db.adminSessions) return { valid: false };

    const session = db.adminSessions.find((s) => s.token === token);
    if (!session) return { valid: false };

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.revokeAdminSession(token);
      return { valid: false };
    }

    // Verify admin is still in authorized list and active
    const cleanEmail = session.email.toLowerCase();
    const authList = db.authorizedAdminEmails || [];
    const authRecord = authList.find((ae) => ae.email.toLowerCase() === cleanEmail);
    const adminUser = db.adminUsers.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!authRecord && !adminUser) {
      this.revokeAdminSession(token);
      return { valid: false };
    }

    if (
      (authRecord && authRecord.status === 'disabled') ||
      (adminUser && adminUser.status === 'disabled')
    ) {
      this.revokeAdminSession(token);
      return { valid: false };
    }

    return { valid: true, admin: adminUser || (authRecord as any) };
  }

  public revokeAdminSession(token: string): void {
    const db = this.getSnapshot();
    if (!db.adminSessions) return;
    const session = db.adminSessions.find((s) => s.token === token);
    if (session) {
      this.addAdminAuditLog({
        action: 'LOGOUT',
        actorEmail: session.email,
        details: 'Admin session terminated (logged out).',
        status: 'SUCCESS',
      });
    }
    db.adminSessions = db.adminSessions.filter((s) => s.token !== token);
    this.save();
  }

  public revokeAllSessionsForEmail(email: string): void {
    const db = this.getSnapshot();
    if (!db.adminSessions) return;
    const cleanEmail = email.toLowerCase();
    db.adminSessions = db.adminSessions.filter((s) => s.email.toLowerCase() !== cleanEmail);
    this.save();
  }

  public attemptAdminRegistration(email: string, _name?: string): { success: boolean; error: string; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    this.addAdminAuditLog({
      action: 'LOGIN_FAILED',
      actorEmail: cleanEmail,
      details: 'Public administrator registration attempted and blocked by policy.',
      status: 'BLOCKED',
    });
    return {
      success: false,
      error: 'Access Restricted',
      message: 'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
    };
  }

  // --- MEDIA LIBRARY REPOSITORY ---
  public getMediaLibrary(): MediaItem[] {
    return this.getSnapshot().mediaLibrary || [];
  }

  public saveMediaItem(item: MediaItem): MediaItem {
    const db = this.getSnapshot();
    if (!db.mediaLibrary) db.mediaLibrary = [];
    const idx = db.mediaLibrary.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      db.mediaLibrary[idx] = { ...db.mediaLibrary[idx], ...item };
    } else {
      db.mediaLibrary.unshift(item);
    }

    // Auto-sync into public galleryPhotos
    if (!db.galleryPhotos) db.galleryPhotos = [];
    const photoIdx = db.galleryPhotos.findIndex(
      (p) => p.imageUrl === item.url || p.id === 'photo-' + item.id || p.id === item.id
    );
    const galleryEntry: GalleryPhoto = {
      id: photoIdx >= 0 ? db.galleryPhotos[photoIdx].id : 'photo-' + item.id,
      title: item.title,
      caption: item.caption || item.title,
      category: (item.category || 'General') as any,
      albumId: item.albumId,
      albumTitle: item.albumTitle,
      tags: item.tags || ['Archival'],
      imageUrl: item.url,
      aspectRatio: item.aspectRatio === '1:1' ? 'square' : item.aspectRatio === '4:5' ? 'portrait' : 'landscape',
      isFeatured: item.isFeatured || false,
      order: photoIdx >= 0 ? db.galleryPhotos[photoIdx].order : 1,
      year: '2026',
      credit: 'Rang Gurukul Media Vault',
      createdAt: item.uploadedAt || new Date().toISOString(),
    };
    if (photoIdx >= 0) {
      db.galleryPhotos[photoIdx] = { ...db.galleryPhotos[photoIdx], ...galleryEntry };
    } else {
      db.galleryPhotos.unshift(galleryEntry);
    }

    this.save();
    return item;
  }

  public saveMultipleMediaItems(items: MediaItem[]): MediaItem[] {
    const db = this.getSnapshot();
    if (!db.mediaLibrary) db.mediaLibrary = [];
    if (!db.galleryPhotos) db.galleryPhotos = [];
    items.forEach((item) => {
      const idx = db.mediaLibrary.findIndex((m) => m.id === item.id);
      if (idx >= 0) {
        db.mediaLibrary[idx] = { ...db.mediaLibrary[idx], ...item };
      } else {
        db.mediaLibrary.unshift(item);
      }

      const photoIdx = db.galleryPhotos.findIndex(
        (p) => p.imageUrl === item.url || p.id === 'photo-' + item.id || p.id === item.id
      );
      const galleryEntry: GalleryPhoto = {
        id: photoIdx >= 0 ? db.galleryPhotos[photoIdx].id : 'photo-' + item.id,
        title: item.title,
        caption: item.caption || item.title,
        category: (item.category || 'General') as any,
        albumId: item.albumId,
        albumTitle: item.albumTitle,
        tags: item.tags || ['Archival'],
        imageUrl: item.url,
        aspectRatio: item.aspectRatio === '1:1' ? 'square' : item.aspectRatio === '4:5' ? 'portrait' : 'landscape',
        isFeatured: item.isFeatured || false,
        order: photoIdx >= 0 ? db.galleryPhotos[photoIdx].order : 1,
        year: '2026',
        credit: 'Rang Gurukul Media Vault',
        createdAt: item.uploadedAt || new Date().toISOString(),
      };
      if (photoIdx >= 0) {
        db.galleryPhotos[photoIdx] = { ...db.galleryPhotos[photoIdx], ...galleryEntry };
      } else {
        db.galleryPhotos.unshift(galleryEntry);
      }
    });
    this.save();
    return items;
  }

  public deleteMediaItem(id: string): void {
    const db = this.getSnapshot();
    if (db.mediaLibrary) {
      const itemToDelete = db.mediaLibrary.find((m) => m.id === id);
      db.mediaLibrary = db.mediaLibrary.filter((m) => m.id !== id);
      if (db.galleryPhotos) {
        db.galleryPhotos = db.galleryPhotos.filter(
          (p) =>
            p.id !== id &&
            p.id !== 'photo-' + id &&
            (!itemToDelete || (p.imageUrl !== itemToDelete.url && p.imageUrl !== itemToDelete.largeUrl))
        );
      }
      this.save();
    }
  }

  public deleteMultipleMediaItems(ids: string[]): void {
    const db = this.getSnapshot();
    if (db.mediaLibrary) {
      const itemsToDelete = db.mediaLibrary.filter((m) => ids.includes(m.id));
      const urlsToDelete = new Set(itemsToDelete.flatMap((m) => [m.url, m.largeUrl, m.mediumUrl].filter(Boolean)));
      const idsToDeleteSet = new Set(ids.flatMap((id) => [id, 'photo-' + id]));
      db.mediaLibrary = db.mediaLibrary.filter((m) => !ids.includes(m.id));
      if (db.galleryPhotos) {
        db.galleryPhotos = db.galleryPhotos.filter(
          (p) => !idsToDeleteSet.has(p.id) && !urlsToDelete.has(p.imageUrl)
        );
      }
      this.save();
    }
  }

  public updateMediaItem(id: string, updates: Partial<MediaItem>): void {
    const db = this.getSnapshot();
    if (db.mediaLibrary) {
      const idx = db.mediaLibrary.findIndex((m) => m.id === id);
      if (idx >= 0) {
        db.mediaLibrary[idx] = { ...db.mediaLibrary[idx], ...updates };
        const updated = db.mediaLibrary[idx];
        if (db.galleryPhotos) {
          const photoIdx = db.galleryPhotos.findIndex(
            (p) => p.id === id || p.id === 'photo-' + id || p.imageUrl === updated.url
          );
          if (photoIdx >= 0) {
            db.galleryPhotos[photoIdx] = {
              ...db.galleryPhotos[photoIdx],
              title: updated.title,
              caption: updated.caption || updated.title,
              category: (updated.category || db.galleryPhotos[photoIdx].category) as any,
              albumId: updated.albumId,
              albumTitle: updated.albumTitle,
              tags: updated.tags || db.galleryPhotos[photoIdx].tags,
              isFeatured: updated.isFeatured ?? db.galleryPhotos[photoIdx].isFeatured,
            };
          }
        }
        this.save();
      }
    }
  }

  // --- DISCIPLINES REPOSITORY ---
  public getDisciplines(): Discipline[] {
    return this.getSnapshot().disciplines || [];
  }

  public saveDiscipline(item: Partial<Discipline> & { title: string }): Discipline {
    const db = this.getSnapshot();
    if (!db.disciplines) db.disciplines = [];
    const id = item.id || 'disc-' + Date.now();
    const fullItem: Discipline = {
      id,
      title: item.title,
      sanskritTitle: item.sanskritTitle || 'साधना',
      tagline: item.tagline || '',
      description: item.description || '',
      keyPractices: item.keyPractices || [],
      facultyLead: item.facultyLead || 'Sansthan Faculty',
      duration: item.duration || 'Seasonal Cohort',
      image: item.image || '/assets/hero.jpg',
      quote: item.quote || '',
    };
    const idx = db.disciplines.findIndex((d) => d.id === id);
    if (idx >= 0) {
      db.disciplines[idx] = { ...db.disciplines[idx], ...fullItem };
    } else {
      db.disciplines.push(fullItem);
    }
    this.save();
    return fullItem;
  }

  public deleteDiscipline(id: string): void {
    const db = this.getSnapshot();
    if (db.disciplines) {
      db.disciplines = db.disciplines.filter((d) => d.id !== id);
      this.save();
    }
  }

  // --- ACADEMY PROGRAMS REPOSITORY ---
  public getPrograms(): AcademyProgram[] {
    return this.getSnapshot().programs || [];
  }

  public saveProgram(item: Partial<AcademyProgram> & { title: string }): AcademyProgram {
    const db = this.getSnapshot();
    if (!db.programs) db.programs = [];
    const id = item.id || 'prog-' + Date.now();
    const fullItem: AcademyProgram = {
      id,
      title: item.title,
      sanskritName: item.sanskritName || 'अकादमी',
      category: item.category || 'Full-Time Internship',
      duration: item.duration || '1 Academic Year',
      intake: item.intake || '16 Selected Interns Only',
      mentor: item.mentor || 'Gurukul Faculty',
      dates: item.dates || 'August 2026 – June 2027',
      location: item.location || 'Rang Gurukul Sanctum Campus',
      curriculum: item.curriculum || [],
      prerequisites: item.prerequisites || 'Audition and interview mandatory.',
      highlights: item.highlights || [],
      tuition: item.tuition || '',
      status: item.status || 'Applications Open',
    };
    const idx = db.programs.findIndex((p) => p.id === id);
    if (idx >= 0) {
      db.programs[idx] = { ...db.programs[idx], ...fullItem };
    } else {
      db.programs.push(fullItem);
    }
    this.save();
    return fullItem;
  }

  public deleteProgram(id: string): void {
    const db = this.getSnapshot();
    if (db.programs) {
      const prog = db.programs.find((p) => p.id === id);
      db.programs = db.programs.filter((p) => p.id !== id);
      if (prog && Array.isArray(db.siteSettings?.applicationPrograms)) {
        const titleLower = prog.title.trim().toLowerCase();
        db.siteSettings.applicationPrograms = db.siteSettings.applicationPrograms.filter(
          (ap) => !ap.toLowerCase().includes(titleLower)
        );
      }
      this.save();
    }
  }

  // --- EVENTS / PRODUCTIONS REPOSITORY ---
  public getEvents(): Production[] {
    return this.getSnapshot().events || [];
  }

  public saveEvent(item: Partial<Production> & { title: string }): Production {
    const db = this.getSnapshot();
    if (!db.events) db.events = [];
    const id = item.id || 'prod-' + Date.now();
    const fullItem: Production = {
      id,
      title: item.title,
      subTitle: item.subTitle || '',
      genre: item.genre || 'Classical Theatre',
      director: item.director || 'Artistic Director',
      playwright: item.playwright || 'Rang Gurukul',
      duration: item.duration || '90 minutes',
      status: item.status || 'Upcoming Premiere',
      statusColor: item.statusColor || '#D4AF37',
      season: item.season || 'Season 2026–2027',
      venue: item.venue || 'Rang Gurukul Amphitheatre',
      dates: item.dates || 'Upcoming',
      synopsis: item.synopsis || '',
      directorNote: item.directorNote || '',
      cast: item.cast || [],
      accolades: item.accolades || [],
      bannerImage: item.bannerImage || '/assets/hero.jpg',
      ticketPrice: item.ticketPrice || '₹500 – ₹2,000',
    };
    const idx = db.events.findIndex((e) => e.id === id);
    if (idx >= 0) {
      db.events[idx] = { ...db.events[idx], ...fullItem };
    } else {
      db.events.unshift(fullItem);
    }
    this.save();
    return fullItem;
  }

  public deleteEvent(id: string): void {
    const db = this.getSnapshot();
    if (db.events) {
      db.events = db.events.filter((e) => e.id !== id);
      this.save();
    }
  }

  // --- TOUR DATES REPOSITORY ---
  public getTourDates(): TourDate[] {
    return this.getSnapshot().tourDates || [];
  }

  public saveTourDate(item: Partial<TourDate> & { city: string; production: string }): TourDate {
    const db = this.getSnapshot();
    if (!db.tourDates) db.tourDates = [];
    const id = item.id || 'tour-' + Date.now();
    const fullItem: TourDate = {
      id,
      city: item.city,
      country: item.country || 'India',
      hall: item.hall || 'Main Auditorium',
      production: item.production,
      dates: item.dates || 'Upcoming',
      time: item.time || '19:00 IST',
      availableTickets: item.availableTickets !== undefined ? item.availableTickets : 40,
      priceRange: item.priceRange || '₹600 – ₹2,500',
      status: item.status || 'Selling Fast',
    };
    const idx = db.tourDates.findIndex((t) => t.id === id);
    if (idx >= 0) {
      db.tourDates[idx] = { ...db.tourDates[idx], ...fullItem };
    } else {
      db.tourDates.unshift(fullItem);
    }
    this.save();
    return fullItem;
  }

  public deleteTourDate(id: string): void {
    const db = this.getSnapshot();
    if (db.tourDates) {
      db.tourDates = db.tourDates.filter((t) => t.id !== id);
      this.save();
    }
  }

  // --- STORIES / JOURNAL REPOSITORY ---
  public getStories(): Story[] {
    return this.getSnapshot().stories || [];
  }

  public saveStory(item: Partial<Story> & { title: string }): Story {
    const db = this.getSnapshot();
    if (!db.stories) db.stories = [];
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'story-' + Date.now();
    const fullItem: Story = {
      slug,
      title: item.title,
      category: item.category || 'Journal',
      author: item.author || 'Rang Gurukul Intern',
      authorRole: item.authorRole || 'Contributor',
      date: item.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: item.readTime || '5 min read',
      coverImage: item.coverImage || '/assets/hero.jpg',
      excerpt: item.excerpt || '',
      content: item.content || [],
    };
    const idx = db.stories.findIndex((s) => s.slug === slug);
    if (idx >= 0) {
      db.stories[idx] = { ...db.stories[idx], ...fullItem };
    } else {
      db.stories.unshift(fullItem);
    }
    this.save();
    return fullItem;
  }

  public deleteStory(slug: string): void {
    const db = this.getSnapshot();
    if (db.stories) {
      db.stories = db.stories.filter((s) => s.slug !== slug);
      this.save();
    }
  }
}

export const dbService = DatabaseService.getInstance();
