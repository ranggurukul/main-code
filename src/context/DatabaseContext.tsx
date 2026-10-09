import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService, type DatabaseSchema } from '../services/db';
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

interface DatabaseContextValue {
  db: DatabaseSchema;
  subscribers: Subscriber[];
  membershipPlans: MembershipPlan[];
  members: MemberUser[];
  participationOpportunities: ParticipationOpportunity[];
  participationRequests: ParticipationRequest[];
  workshops: Workshop[];
  workshopRegistrations: WorkshopRegistration[];
  galleryPhotos: GalleryPhoto[];
  galleryAlbums: GalleryAlbum[];
  mediaLibrary: MediaItem[];
  adminUsers: AdminUser[];
  homepageConfig: HomepageConfig;
  siteSettings: SiteSettings;
  paymentConfig: PaymentGatewayConfig;
  emailConfig: EmailProviderConfig;
  emailBroadcasts: EmailBroadcast[];

  // Media Library Actions
  saveMediaItem: (item: MediaItem) => MediaItem;
  saveMultipleMediaItems: (items: MediaItem[]) => MediaItem[];
  deleteMediaItem: (id: string) => void;
  deleteMultipleMediaItems: (ids: string[]) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;

  // Actions
  subscribe: (name: string, email: string, source?: string, interests?: string[]) => { success: boolean; message: string; subscriber?: Subscriber };
  unsubscribe: (tokenOrEmail: string) => boolean;
  toggleSubscriberStatus: (id: string) => void;
  deleteSubscriber: (id: string) => void;

  sendAnnouncement: (data: Omit<EmailBroadcast, 'id' | 'sentAt' | 'recipientCount' | 'openRateEstimated' | 'provider'>) => EmailBroadcast;

  saveMembershipPlan: (plan: Partial<MembershipPlan> & { name: string; price: number; duration: string }) => MembershipPlan;
  deleteMembershipPlan: (id: string) => void;
  reorderMembershipPlans: (ids: string[]) => void;

  createMemberAccount: (params: {
    name: string;
    email: string;
    phone: string;
    planId: string;
    paymentMethod: string;
    amountPaid: number;
    address?: string;
    city?: string;
  }) => MemberUser;
  updateMemberProfile: (id: string, updates: Partial<MemberUser>) => MemberUser | null;
  submitParticipationRequest: (data: {
    memberId: string;
    memberName: string;
    memberEmail: string;
    opportunityId: string;
    opportunityTitle: string;
    statement: string;
    experienceNotes: string;
  }) => ParticipationRequest;
  updateParticipationRequestStatus: (id: string, status: ParticipationRequest['status']) => void;

  saveWorkshop: (ws: Partial<Workshop> & { title: string; price: number }) => Workshop;
  deleteWorkshop: (id: string) => void;
  updateWorkshopFormFields: (workshopId: string, formFields: FormField[]) => Workshop | null;

  submitWorkshopRegistration: (params: {
    workshopId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    amountPaid: number;
    answers: Record<string, any>;
    paymentMethod?: string;
  }) => WorkshopRegistration;
  updateRegistrationStatus: (id: string, status: WorkshopRegistration['registrationStatus']) => void;
  deleteRegistration: (id: string) => void;

  saveGalleryPhoto: (photo: Partial<GalleryPhoto> & { title: string; imageUrl: string }) => GalleryPhoto;
  bulkAddPhotos: (photos: Array<{ title: string; imageUrl: string; category?: string; albumId?: string }>) => number;
  deleteGalleryPhoto: (id: string) => void;
  saveAlbum: (album: Partial<GalleryAlbum> & { title: string }) => GalleryAlbum;
  deleteAlbum: (id: string) => void;

  updateHomepageConfig: (updates: Partial<HomepageConfig>) => HomepageConfig;
  updateSiteSettings: (updates: Partial<SiteSettings>) => SiteSettings;
  updatePaymentConfig: (updates: Partial<PaymentGatewayConfig>) => PaymentGatewayConfig;
  updateEmailConfig: (updates: Partial<EmailProviderConfig>) => EmailProviderConfig;

  saveAdminUser: (admin: Partial<AdminUser> & { name: string; email: string; role: AdminUser['role'] }) => AdminUser;
  toggleAdminStatus: (id: string) => void;
  deleteAdminUser: (id: string) => boolean;
  resetDatabase: () => void;

  // Four Pillars: Disciplines, Programs, Events, Stories
  disciplines: Discipline[];
  programs: AcademyProgram[];
  events: Production[];
  stories: Story[];

  saveDiscipline: (item: Partial<Discipline> & { title: string }) => Discipline;
  deleteDiscipline: (id: string) => void;

  saveProgram: (item: Partial<AcademyProgram> & { title: string }) => AcademyProgram;
  deleteProgram: (id: string) => void;

  saveEvent: (item: Partial<Production> & { title: string }) => Production;
  deleteEvent: (id: string) => void;

  saveStory: (item: Partial<Story> & { title: string }) => Story;
  deleteStory: (slug: string) => void;

  tourDates: TourDate[];
  saveTourDate: (item: Partial<TourDate> & { city: string; production: string }) => TourDate;
  deleteTourDate: (id: string) => void;
}

const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<DatabaseSchema>(() => dbService.getSnapshot());

  useEffect(() => {
    const handleDbChange = () => {
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        disciplines: [...(snap.disciplines || [])],
        programs: [...(snap.programs || [])],
        events: [...(snap.events || [])],
        stories: [...(snap.stories || [])],
        workshops: [...(snap.workshops || [])],
      });
    };

    window.addEventListener('rang_gurukul_db_changed', handleDbChange);
    return () => window.removeEventListener('rang_gurukul_db_changed', handleDbChange);
  }, []);

  const value: DatabaseContextValue = {
    db,
    subscribers: db.subscribers,
    membershipPlans: db.membershipPlans,
    members: db.members,
    participationOpportunities: db.participationOpportunities,
    participationRequests: db.participationRequests,
    workshops: db.workshops,
    workshopRegistrations: db.workshopRegistrations,
    galleryPhotos: db.galleryPhotos,
    galleryAlbums: db.galleryAlbums,
    mediaLibrary: db.mediaLibrary || [],
    adminUsers: db.adminUsers,
    homepageConfig: db.homepageConfig,
    siteSettings: db.siteSettings,
    paymentConfig: db.paymentConfig,
    emailConfig: db.emailConfig,
    emailBroadcasts: db.emailBroadcasts,

    saveMediaItem: (item) => {
      const res = dbService.saveMediaItem(item);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
      });
      return res;
    },
    saveMultipleMediaItems: (items) => {
      const res = dbService.saveMultipleMediaItems(items);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
      });
      return res;
    },
    deleteMediaItem: (id) => {
      dbService.deleteMediaItem(id);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
      });
    },
    deleteMultipleMediaItems: (ids) => {
      dbService.deleteMultipleMediaItems(ids);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
      });
    },
    updateMediaItem: (id, updates) => {
      dbService.updateMediaItem(id, updates);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        mediaLibrary: [...(snap.mediaLibrary || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        galleryAlbums: [...(snap.galleryAlbums || [])],
      });
    },

    subscribe: (name, email, source, interests) => dbService.addSubscriber(name, email, source, interests),
    unsubscribe: (token) => dbService.unsubscribe(token),
    toggleSubscriberStatus: (id) => dbService.toggleSubscriberStatus(id),
    deleteSubscriber: (id) => dbService.deleteSubscriber(id),

    sendAnnouncement: (data) => dbService.sendAnnouncement(data),

    saveMembershipPlan: (plan) => dbService.saveMembershipPlan(plan),
    deleteMembershipPlan: (id) => dbService.deleteMembershipPlan(id),
    reorderMembershipPlans: (ids) => dbService.reorderMembershipPlans(ids),

    createMemberAccount: (params) => dbService.createMemberAccount(params),
    updateMemberProfile: (id, updates) => dbService.updateMemberProfile(id, updates),
    submitParticipationRequest: (data) => dbService.submitParticipationRequest(data),
    updateParticipationRequestStatus: (id, status) => dbService.updateParticipationRequestStatus(id, status),

    saveWorkshop: (ws) => dbService.saveWorkshop(ws),
    deleteWorkshop: (id) => dbService.deleteWorkshop(id),
    updateWorkshopFormFields: (id, fields) => dbService.updateWorkshopFormFields(id, fields),

    submitWorkshopRegistration: (params) => dbService.submitWorkshopRegistration(params),
    updateRegistrationStatus: (id, status) => dbService.updateRegistrationStatus(id, status),
    deleteRegistration: (id) => dbService.deleteRegistration(id),

    saveGalleryPhoto: (photo) => {
      const res = dbService.saveGalleryPhoto(photo);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        galleryPhotos: [...(snap.galleryPhotos || [])],
        mediaLibrary: [...(snap.mediaLibrary || [])],
      });
      return res;
    },
    bulkAddPhotos: (photos) => {
      const res = dbService.bulkAddPhotos(photos);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        galleryPhotos: [...(snap.galleryPhotos || [])],
        mediaLibrary: [...(snap.mediaLibrary || [])],
      });
      return res;
    },
    deleteGalleryPhoto: (id) => {
      dbService.deleteGalleryPhoto(id);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        galleryPhotos: [...(snap.galleryPhotos || [])],
        mediaLibrary: [...(snap.mediaLibrary || [])],
      });
    },
    saveAlbum: (album) => {
      const res = dbService.saveAlbum(album);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        galleryAlbums: [...(snap.galleryAlbums || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        mediaLibrary: [...(snap.mediaLibrary || [])],
      });
      return res;
    },
    deleteAlbum: (id) => {
      dbService.deleteAlbum(id);
      const snap = dbService.getSnapshot();
      setDb({
        ...snap,
        galleryAlbums: [...(snap.galleryAlbums || [])],
        galleryPhotos: [...(snap.galleryPhotos || [])],
        mediaLibrary: [...(snap.mediaLibrary || [])],
      });
    },

    updateHomepageConfig: (updates) => {
      const res = dbService.updateHomepageConfig(updates);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    updateSiteSettings: (updates) => {
      const res = dbService.updateSiteSettings(updates);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    updatePaymentConfig: (updates) => {
      const res = dbService.updatePaymentConfig(updates);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    updateEmailConfig: (updates) => {
      const res = dbService.updateEmailConfig(updates);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },

    saveAdminUser: (admin) => dbService.saveAdminUser(admin),
    toggleAdminStatus: (id) => dbService.toggleAdminStatus(id),
    deleteAdminUser: (id) => dbService.deleteAdminUser(id),
    resetDatabase: () => {
      const fresh = dbService.resetToDefaults();
      setDb(fresh);
    },

    disciplines: db.disciplines || [],
    programs: db.programs || [],
    events: db.events || [],
    stories: db.stories || [],

    saveDiscipline: (item) => {
      const res = dbService.saveDiscipline(item);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    deleteDiscipline: (id) => {
      dbService.deleteDiscipline(id);
      setDb({ ...dbService.getSnapshot() });
    },

    saveProgram: (item) => {
      const res = dbService.saveProgram(item);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    deleteProgram: (id) => {
      dbService.deleteProgram(id);
      setDb({ ...dbService.getSnapshot() });
    },

    saveEvent: (item) => {
      const res = dbService.saveEvent(item);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    deleteEvent: (id) => {
      dbService.deleteEvent(id);
      setDb({ ...dbService.getSnapshot() });
    },

    saveStory: (item) => {
      const res = dbService.saveStory(item);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    deleteStory: (slug) => {
      dbService.deleteStory(slug);
      setDb({ ...dbService.getSnapshot() });
    },

    tourDates: db.tourDates || [],
    saveTourDate: (item) => {
      const res = dbService.saveTourDate(item);
      setDb({ ...dbService.getSnapshot() });
      return res;
    },
    deleteTourDate: (id) => {
      dbService.deleteTourDate(id);
      setDb({ ...dbService.getSnapshot() });
    },
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
