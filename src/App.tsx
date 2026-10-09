import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DisciplinesPage } from './pages/DisciplinesPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage';
import { MembershipPage } from './pages/MembershipPage';
import { MembershipDetailPage } from './pages/MembershipDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { ContactPage } from './pages/ContactPage';
import { SubscribePage } from './pages/SubscribePage';
import { LoginPage } from './pages/LoginPage';

// Member Dashboard
import { MemberDashboard } from './pages/member/MemberDashboard';

// Admin CMS
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';


// Wrapper that selectively renders public Navbar & Footer
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#121110] text-[#FAF7F2] font-sans selection:bg-[#C85A32] selection:text-white relative flex flex-col justify-between">
      <ScrollToTop />

      {/* Render Public Navbar unless inside admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Route Views */}
      <main className="flex-grow">
        <Routes>
          {/* Public Institution Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/disciplines" element={<DisciplinesPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/:id" element={<MembershipDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:album" element={<GalleryPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:id" element={<ArtistDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:slug" element={<StoryDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Member Sanctuary Dashboard Routes */}
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/profile" element={<MemberDashboard />} />
          <Route path="/member/membership" element={<MemberDashboard />} />

          {/* Admin CMS Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Render Public Institutional Footer unless inside admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;
