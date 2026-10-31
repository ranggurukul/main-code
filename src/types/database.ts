export type MembershipStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string; // e.g., '1 Year', '2 Years', '3 Years', '5 Years'
  durationMonths: number;
  price: number; // in INR
  description: string;
  benefits: string[];
  status: 'active' | 'inactive';
  order: number;
  isPopular?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberUser {
  id: string;
  membershipId: string; // e.g., 'RG-M-2026-4821'
  name: string;
  email: string;
  phone: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: MembershipStatus;
  amountPaid: number;
  paymentMethod: string;
  transactionId: string;
  address?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  notificationPreferences?: {
    email: boolean;
    whatsapp: boolean;
  };
  createdAt: string;
}

export interface ParticipationOpportunity {
  id: string;
  title: string;
  productionId?: string;
  productionTitle: string;
  roleType: string; // e.g. 'Chorus / Chhau Ensemble', 'Percussion Accompaniment', 'Aharya Stage Craft'
  dates: string;
  location: string;
  description: string;
  eligiblePlans: string[]; // e.g. ['all'] or specific plan IDs
  status: 'open' | 'reviewing' | 'closed';
}

export interface ParticipationRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  opportunityId: string;
  opportunityTitle: string;
  statement: string;
  experienceNotes: string;
  status: 'Pending' | 'Audition Scheduled' | 'Approved' | 'Declined';
  appliedAt: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  source?: string;
  interests?: string[];
  unsubscribeToken: string;
}

export type AnnouncementType =
  | 'New Event'
  | 'New Workshop'
  | 'New Performance'
  | 'New Story / Article'
  | 'New Gallery'
  | 'Important Announcement'
  | 'Rang Gurukul News';

export interface EmailBroadcast {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  body: string;
  type: AnnouncementType;
  recipientCount: number;
  targetAudience: 'all' | 'members_only' | 'tier_specific';
  status: 'sent' | 'draft' | 'scheduled';
  sentAt: string;
  provider: string; // 'Resend' | 'SendGrid' | 'Amazon SES' | 'Mailgun'
  openRateEstimated?: string;
}

export type FormFieldType =
  | 'text'
  | 'longtext'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'address'
  | 'emergency_contact';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options?: string[]; // For dropdown, radio, checkbox
  order: number;
}

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar?: string;
  date: string;
  time: string;
  duration: string;
  location: string; // e.g. 'Rang Gurukul Campus' or 'Online Masterclass'
  isOnline: boolean;
  price: number;
  maxParticipants: number;
  availableSeats: number;
  image: string;
  requirements: string[];
  benefits: string[];
  status: 'Open' | 'Filling Fast' | 'Sold Out' | 'Completed';
  category: 'Theatre' | 'Music' | 'Movement' | 'Crafts' | 'Puppetry' | 'Dramaturgy';
  requiredMembershipTier?: string; // 'all' or specific plan ID
  formFields: FormField[];
  createdAt: string;
}

export interface WorkshopRegistration {
  id: string;
  registrationNumber: string; // e.g. 'RG-WS-2026-104'
  workshopId: string;
  workshopTitle: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  registrationDate: string;
  amountPaid: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  registrationStatus: 'Approved' | 'Pending' | 'Rejected';
  answers: Record<string, any>; // Dynamic answers mapped to FormField.id
  uploadedFiles?: { fieldId: string; fileName: string; fileUrl: string }[];
  transactionId: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category:
    | 'Performances'
    | 'Theatre'
    | 'Workshops'
    | 'Artists'
    | 'Festivals'
    | 'Behind the Scenes'
    | 'Cultural Events'
    | 'Rang Gurukul Memories';
  albumId?: string;
  albumTitle?: string;
  tags: string[];
  imageUrl: string;
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'wide';
  isFeatured: boolean;
  order: number;
  year: string;
  credit?: string;
  createdAt: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  year: string;
  photoCount: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  dimensions?: { width: number; height: number };
  aspectRatio?: string;
  altText: string;
  caption?: string;
  tags: string[];
  category: string;
  albumId?: string;
  albumTitle?: string;
  isFeatured?: boolean;
  uploadedAt: string;
  uploadedBy?: string;
  storageProvider?: 'indexeddb' | 'cloudinary' | 'supabase' | 's3' | 'firebase' | 'local';
}

export type AdminRole =
  | 'OWNER'
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'WORKSHOP_ADMIN'
  | 'MEMBERSHIP_ADMIN'
  | 'COMMUNICATION_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  status: 'active' | 'disabled';
  isPrimaryOwner?: boolean;
  authMethod?: 'password' | 'google' | 'both';
  addedBy?: string;
  addedAt?: string;
  lastLogin?: string;
  permissions: {
    canManageAdmins: boolean;
    canManageContent: boolean;
    canManageMembership: boolean;
    canManageWorkshops: boolean;
    canManageSubscribers: boolean;
    canManageGallery: boolean;
    canManageSettings: boolean;
    canManagePrices: boolean;
  };
  createdAt: string;
}

export interface AuthorizedAdminEmail {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isPrimaryOwner: boolean;
  status: 'active' | 'disabled';
  addedBy: string;
  addedAt: string;
  lastLogin?: string;
  notes?: string;
}

export type AdminAuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'GOOGLE_AUTH_DENIED'
  | 'ADMIN_ADDED'
  | 'ADMIN_REMOVED'
  | 'STATUS_CHANGED'
  | 'ROLE_UPDATED'
  | 'LOGOUT';

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: AdminAuditAction;
  actorEmail: string;
  targetEmail?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'DENIED' | 'BLOCKED';
}

export interface AdminSession {
  token: string;
  adminId: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  heroImage: string;
  aboutImage: string;
  featuredEventImage: string;
  featuredProgramImage: string;
  featuredPerformanceImage: string;
  ctaImage: string;
  galleryPreviewImages: string[];
  threeStageEnabled: boolean;
  threeStageColorTheme: 'gold' | 'terracotta' | 'celestial';
}

export interface SiteSettings {
  sansthanName: string;
  tagline: string;
  logoImage?: string;
  ogImage?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  personalContactNumber: string; // for eligible members
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  // Application Form Config
  applicationPrograms?: string[];
  applicationDisciplines?: string[];
  applicationPriorTraining?: string[];
  // Reservation Modal Config
  reservationCities?: string[];
  reservationTiers?: { name: string; price: number }[];
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

export interface PaymentGatewayConfig {
  provider: 'Razorpay' | 'Stripe';
  testMode: boolean;
  currency: string;
  razorpayKeyId: string;
  stripePublishableKey: string;
}

export interface EmailProviderConfig {
  provider: 'Resend' | 'SendGrid' | 'Amazon SES' | 'Mailgun';
  apiKeyMasked: string;
  senderEmail: string;
  senderName: string;
  webhookEnabled: boolean;
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
  statusColor?: string;
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
  dates?: string;
  location?: string;
  curriculum?: string[];
  prerequisites?: string;
  highlights?: string[];
  tuition?: string;
  status: 'Applications Open' | 'Limited Seats' | 'Waitlist Only';
}

export interface Story {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
}

