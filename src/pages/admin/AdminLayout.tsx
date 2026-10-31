import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Crown,
  Ticket,
  Users,
  Mail,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
  Menu,
  X,
  Flame,
  GraduationCap,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminDisciplinesView } from './AdminDisciplinesView';
import { AdminProgramsView } from './AdminProgramsView';
import { AdminEventsView } from './AdminEventsView';
import { AdminStoriesView } from './AdminStoriesView';
import { AdminContentView } from './AdminContentView';
import { AdminMembershipView } from './AdminMembershipView';
import { AdminWorkshopsView } from './AdminWorkshopsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminCommunicationView } from './AdminCommunicationView';
import { AdminMediaView } from './AdminMediaView';
import { AdminSettingsView } from './AdminSettingsView';

export const AdminLayout: React.FC = () => {
  const { currentAdmin, isAdminLoggedIn, adminLogout, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState<
    | 'dashboard'
    | 'disciplines'
    | 'programs'
    | 'events'
    | 'stories'
    | 'media'
    | 'content'
    | 'workshops'
    | 'membership'
    | 'communication'
    | 'users'
    | 'settings'
  >('dashboard');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route guard
  if (!isAdminLoggedIn || !currentAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'disciplines', label: 'Disciplines', icon: Flame },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'content', label: 'Homepage Assets', icon: FileText },
    { id: 'workshops', label: 'Workshops', icon: Ticket },
    { id: 'membership', label: 'Membership', icon: Crown },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'users', label: 'Admin Access Management', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#faf7f2] flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="h-16 bg-[#181614] border-b border-[#2b2723] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" target="_blank" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full border border-amber-500/50 bg-white p-0.5 overflow-hidden flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Rang Gurukul Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="font-editorial text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>RANG GURUKUL CMS</span>
                <ExternalLink className="w-3 h-3 text-[#9e968b]" />
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#9e968b] font-mono">
                Management Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Right Admin Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white flex items-center justify-end gap-1.5">
              <span>{currentAdmin.name}</span>
              <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-amber-950 text-amber-400 border border-amber-500/40">
                {currentAdmin.role}
              </span>
            </div>
            <div className="text-[10px] text-[#9e968b]">{currentAdmin.email}</div>
          </div>

          <button
            onClick={() => {
              adminLogout();
              navigate('/admin/login');
            }}
            className="p-2 rounded-xl bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors border border-[#332f2a]"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`w-64 bg-[#141210] border-r border-[#25221e] flex flex-col justify-between shrink-0 fixed lg:static inset-y-16 left-0 z-30 transform transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav List */}
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-widest text-[#787168]">
              NAVIGATION MENU
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Status */}
          <div className="p-4 border-t border-[#25221e] text-[11px] text-[#787168] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Database Connected</span>
            </div>
            <div>Rang Gurukul CMS v2.4 (2026)</div>
          </div>
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0e0d0c]">
          {activeNav === 'dashboard' && <AdminDashboardView onNavigateTab={(tab) => setActiveNav(tab as any)} />}
          {activeNav === 'disciplines' && <AdminDisciplinesView />}
          {activeNav === 'programs' && <AdminProgramsView />}
          {activeNav === 'events' && <AdminEventsView />}
          {activeNav === 'stories' && <AdminStoriesView />}
          {activeNav === 'media' && <AdminMediaView />}
          {activeNav === 'content' && <AdminContentView />}
          {activeNav === 'workshops' && <AdminWorkshopsView />}
          {activeNav === 'membership' && <AdminMembershipView />}
          {activeNav === 'communication' && <AdminCommunicationView />}
          {activeNav === 'users' && <AdminUsersView />}
          {activeNav === 'settings' && <AdminSettingsView />}
        </main>
      </div>
    </div>
  );
};
