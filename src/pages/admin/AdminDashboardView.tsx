import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Users,
  Crown,
  Calendar,
  Ticket,
  DollarSign,
  Mail,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const AdminDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const {
    members,
    subscribers,
    workshops,
    workshopRegistrations,
    membershipPlans,
    emailBroadcasts,
    disciplines,
    programs,
    events,
    stories,
  } = useDatabase();

  const activeMembers = members.filter((m) => m.status === 'active');
  const activeSubscribers = subscribers.filter((s) => s.status === 'active');

  // Calculate gross revenue
  const membershipRevenue = members.reduce((sum, m) => sum + (m.amountPaid || 0), 0);
  const workshopRevenue = workshopRegistrations.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const totalRevenue = membershipRevenue + workshopRevenue;

  const kpis = [
    {
      title: 'Total Active Interns',
      value: activeMembers.length,
      sub: `${members.length} total enrolled`,
      icon: Crown,
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-500/30',
      action: () => onNavigateTab('membership'),
    },
    {
      title: 'Email Subscribers',
      value: activeSubscribers.length,
      sub: `${subscribers.length} total records`,
      icon: Mail,
      color: 'text-sky-400',
      bg: 'bg-sky-950/40 border-sky-500/30',
      action: () => onNavigateTab('communication'),
    },
    {
      title: 'Workshop Registrations',
      value: workshopRegistrations.length,
      sub: `${workshops.length} active studios`,
      icon: Ticket,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/30',
      action: () => onNavigateTab('workshops'),
    },
    {
      title: 'Gross Cultural Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sub: `Memberships: ₹${membershipRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-amber-300',
      bg: 'bg-[#25221e] border-[#3d362e]',
      action: () => onNavigateTab('membership'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            EXECUTIVE OVERSIGHT • LIVE REPOSITORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Sansthan Dashboard Overview
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Real-time telemetry across memberships, masterclasses, subscribers, and cultural assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('communication')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Announcement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${kpi.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-medium text-[#9e968b]">
                  {kpi.title}
                </span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {kpi.value}
              </div>
              <div className="text-[11px] text-[#9e968b] mt-1.5 flex items-center justify-between">
                <span>{kpi.sub}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FOUR PRIMARY CULTURAL PILLARS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#25221e]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block">
              PRIMARY PUBLIC PILLARS
            </span>
            <h3 className="font-editorial text-lg font-bold text-white">
              Disciplines, Programs, Events & Stories Management
            </h3>
          </div>
          <span className="text-xs text-[#9e968b]">Syncs live with public website</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Disciplines Card */}
          <div
            onClick={() => onNavigateTab('disciplines')}
            className="p-5 rounded-2xl bg-[#181614] border border-[#2b2723] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  DISCIPLINES
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl font-bold font-editorial text-white group-hover:text-amber-300 transition-colors">
                Disciplines of Expression
              </div>
              <p className="text-xs text-[#9e968b] mt-1">
                Classical & contemporary schools, mudras, soundscapes, and crafts.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#25221e] flex items-center justify-between text-xs">
              <span className="font-mono text-amber-400 font-bold">{disciplines.length} Schools</span>
              <span className="text-xs text-[#9e968b] group-hover:text-white flex items-center gap-1">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Programs Card */}
          <div
            onClick={() => onNavigateTab('programs')}
            className="p-5 rounded-2xl bg-[#181614] border border-[#2b2723] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  PROGRAMS
                </span>
                <GraduationCap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl font-bold font-editorial text-white group-hover:text-amber-300 transition-colors">
                Gurukul Academies
              </div>
              <p className="text-xs text-[#9e968b] mt-1">
                Full-time residential internships, masterclass cohorts, and camps.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#25221e] flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-400 font-bold">{programs.length} Cohorts</span>
              <span className="text-xs text-[#9e968b] group-hover:text-white flex items-center gap-1">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Events Card */}
          <div
            onClick={() => onNavigateTab('events')}
            className="p-5 rounded-2xl bg-[#181614] border border-[#2b2723] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c85a32]">
                  EVENTS
                </span>
                <Calendar className="w-4 h-4 text-[#c85a32] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl font-bold font-editorial text-white group-hover:text-amber-300 transition-colors">
                Staged Productions
              </div>
              <p className="text-xs text-[#9e968b] mt-1">
                Touring repertory, world tour premiere dates, venues, and passes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#25221e] flex items-center justify-between text-xs">
              <span className="font-mono text-amber-400 font-bold">{events.length} Staged Acts</span>
              <span className="text-xs text-[#9e968b] group-hover:text-white flex items-center gap-1">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Stories Card */}
          <div
            onClick={() => onNavigateTab('stories')}
            className="p-5 rounded-2xl bg-[#181614] border border-[#2b2723] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                  STORIES
                </span>
                <BookOpen className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl font-bold font-editorial text-white group-hover:text-amber-300 transition-colors">
                Cultural Journal
              </div>
              <p className="text-xs text-[#9e968b] mt-1">
                Scholarly monographs, essays, craftsman lore, and treatises.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#25221e] flex items-center justify-between text-xs">
              <span className="font-mono text-sky-400 font-bold">{stories.length} Articles</span>
              <span className="text-xs text-[#9e968b] group-hover:text-white flex items-center gap-1">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Action Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Member Enrollments */}
        <div className="lg:col-span-7 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
            <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Recent Internship Enrollments</span>
            </h3>
            <button
              onClick={() => onNavigateTab('membership')}
              className="text-xs text-amber-400 hover:underline"
            >
              View All ({members.length})
            </button>
          </div>

          <div className="space-y-3">
            {members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-xl bg-[#201e1b] border border-[#2d2925] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{member.name}</div>
                  <div className="text-[11px] text-[#9e968b]">
                    {member.planName} • <span className="font-mono text-amber-300">{member.membershipId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-emerald-400">
                    ₹{member.amountPaid.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-[#787168]">{member.paymentMethod.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workshop Applications */}
        <div className="lg:col-span-5 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
            <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>Latest Workshop Passes</span>
            </h3>
            <button
              onClick={() => onNavigateTab('workshops')}
              className="text-xs text-amber-400 hover:underline"
            >
              Registrations ({workshopRegistrations.length})
            </button>
          </div>

          <div className="space-y-3">
            {workshopRegistrations.slice(0, 4).map((reg) => (
              <div
                key={reg.id}
                className="p-3.5 rounded-xl bg-[#201e1b] border border-[#2d2925] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{reg.participantName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {reg.registrationStatus}
                  </span>
                </div>
                <div className="text-[11px] text-[#9e968b] truncate">
                  {reg.workshopTitle}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#787168] pt-1">
                  <span>Pass: {reg.registrationNumber}</span>
                  <span className="font-mono text-amber-400">₹{reg.amountPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispatched Broadcasts History */}
      <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
          <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Recent Dispatched Announcements</span>
          </h3>
          <button
            onClick={() => onNavigateTab('communication')}
            className="text-xs text-amber-400 hover:underline"
          >
            Manage Broadcasts ({emailBroadcasts.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailBroadcasts.slice(0, 2).map((broad) => (
            <div
              key={broad.id}
              className="p-4 rounded-xl bg-[#201e1b] border border-[#2d2925] text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#2e2a25] text-amber-300">
                  {broad.type}
                </span>
                <span className="text-[11px] text-[#9e968b]">
                  {new Date(broad.sentAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {broad.title}
              </h4>
              <p className="text-[11px] text-[#9e968b] line-clamp-2">
                {broad.subject}
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-[#787168] border-t border-[#292622]">
                <span>Recipients: <strong className="text-white">{broad.recipientCount}</strong></span>
                <span>Via: <strong className="text-amber-400">{broad.provider}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
