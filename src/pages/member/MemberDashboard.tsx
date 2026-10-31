import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTransition } from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Crown,
  CheckCircle2,
  Phone,
  MessageSquare,
  Flame,
  Calendar,
  User,
  LogOut,
  Ticket,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { currentMember, memberLogout, switchMember } = useAuth();
  const {
    membershipPlans,
    participationOpportunities,
    participationRequests,
    submitParticipationRequest,
    workshopRegistrations,
    workshops,
    siteSettings,
    updateMemberProfile,
    members,
  } = useDatabase();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'membership' | 'contact' | 'participation' | 'workshops' | 'profile'>('membership');

  // Form for participation request
  const [selectedOppId, setSelectedOppId] = useState<string>('');
  const [statement, setStatement] = useState('');
  const [experienceNotes, setExperienceNotes] = useState('');
  const [requestSuccessMsg, setRequestSuccessMsg] = useState('');

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: currentMember?.name || '',
    phone: currentMember?.phone || '',
    city: currentMember?.city || '',
    bio: currentMember?.bio || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  if (!currentMember) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 px-4 text-center">
        <Crown className="w-12 h-12 text-[#d4af37] mb-4" />
        <h2 className="font-editorial text-2xl text-[#faf7f2] font-bold">
          Private Member Sanctuary
        </h2>
        <p className="text-xs text-[#9e968b] mt-2 max-w-md">
          Please log in to your internship account or enroll in a plan to access this sanctuary.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#121110] text-xs font-semibold uppercase tracking-wider"
          >
            Log In
          </Link>
          <Link
            to="/membership"
            className="px-6 py-2.5 rounded-xl border border-[#332f2a] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  // Find plan details
  const plan = membershipPlans.find((p) => p.id === currentMember.planId) || membershipPlans[0];

  // Eligible opportunities
  const eligibleOpps = participationOpportunities.filter((opp) => {
    if (opp.eligiblePlans.includes('all')) return true;
    return opp.eligiblePlans.includes(currentMember.planId);
  });

  // User's own participation requests
  const myRequests = participationRequests.filter((r) => r.memberId === currentMember.id);

  // User's registered workshops
  const myRegistrations = workshopRegistrations.filter(
    (reg) => reg.participantEmail.toLowerCase() === currentMember.email.toLowerCase()
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppId || !statement.trim()) return;

    const opp = participationOpportunities.find((o) => o.id === selectedOppId);
    if (!opp) return;

    submitParticipationRequest({
      memberId: currentMember.id,
      memberName: currentMember.name,
      memberEmail: currentMember.email,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      statement,
      experienceNotes,
    });

    setRequestSuccessMsg('Participation request submitted. The directorate will review your application.');
    setStatement('');
    setExperienceNotes('');
    setSelectedOppId('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberProfile(currentMember.id, profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <PageTransition>
      {/* Top Banner */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">
                INTERNSHIP SANCTUARY • ACTIVE
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#faf7f2]">
              {currentMember.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#9e968b]">
              <span>ID: <strong className="font-mono text-[#d4af37]">{currentMember.membershipId}</strong></span>
              <span>•</span>
              <span>Tier: <strong className="text-[#faf7f2]">{currentMember.planName}</strong></span>
              <span>•</span>
              <span>Valid to: {new Date(currentMember.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                memberLogout();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-wrap gap-2 border-b border-[#2b2723] pb-px">
          {[
            { id: 'membership', label: 'My Membership', icon: Crown },
            { id: 'contact', label: 'Direct Desk & WhatsApp', icon: Phone },
            { id: 'participation', label: 'Stage Acts Participation', icon: Flame },
            { id: 'workshops', label: 'My Workshops', icon: Ticket },
            { id: 'profile', label: 'Intern Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                  isActive
                    ? 'border-[#d4af37] text-[#d4af37] bg-[#201e1b]'
                    : 'border-transparent text-[#9e968b] hover:text-[#faf7f2] hover:bg-[#1a1816]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Tab Content */}
      <section className="py-14 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: MY MEMBERSHIP */}
          {activeTab === 'membership' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Gold Internship Credential Card */}
              <div className="lg:col-span-6">
                <div className="theatre-card p-8 rounded-3xl border-2 border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.15)] relative overflow-hidden bg-gradient-to-br from-[#24201c] via-[#1a1816] to-[#121110]">
                  <div className="flex items-center justify-between pb-6 border-b border-[#d4af37]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border border-[#d4af37] bg-white p-0.5 overflow-hidden flex items-center justify-center shadow-md shrink-0">
                        <img
                          src={siteSettings?.logoImage || '/logo.png'}
                          alt="Rang Gurukul Logo"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-editorial text-lg font-bold text-[#faf7f2]">
                          RANG GURUKUL SANSTHAN
                        </div>
                        <div className="text-[9px] uppercase tracking-widest text-[#d4af37]">
                          Living Heritage Intern
                        </div>
                      </div>
                    </div>
                    <Crown className="w-6 h-6 text-[#d4af37]" />
                  </div>

                  <div className="py-8 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#9e968b]">
                        Internship Holder
                      </span>
                      <div className="font-editorial text-2xl font-bold text-[#faf7f2]">
                        {currentMember.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[10px] uppercase text-[#9e968b] block">Member ID</span>
                        <span className="font-mono text-base font-bold text-[#d4af37]">
                          {currentMember.membershipId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#9e968b] block">Plan Tier</span>
                        <span className="text-xs font-semibold text-[#faf7f2]">
                          {currentMember.planName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#332f2a]/60">
                      <div>
                        <span className="text-[10px] uppercase text-[#9e968b] block">Commenced</span>
                        <span className="font-mono text-xs text-[#faf7f2]">
                          {new Date(currentMember.startDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#9e968b] block">Expiry</span>
                        <span className="font-mono text-xs text-emerald-400 font-semibold">
                          {new Date(currentMember.expiryDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#d4af37]/30 flex items-center justify-between text-[11px] text-[#9e968b]">
                    <span>Status: <strong className="text-emerald-400 uppercase">Active & In Good Standing</strong></span>
                    <span>Verified 80G Sansthan Intern</span>
                  </div>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="lg:col-span-6 space-y-6">
                <div className="theatre-card p-6 sm:p-8 rounded-2xl border border-[#332f2a]">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block mb-2 font-semibold">
                    Configured Privileges
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2] mb-4">
                    Your Enrolled Benefits
                  </h3>

                  <div className="space-y-3">
                    {plan?.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#161412] border border-[#26221e] text-xs text-[#faf7f2]">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#2a2622] flex items-center justify-between text-xs text-[#9e968b]">
                    <span>Need to extend or upgrade your internship?</span>
                    <Link to="/membership" className="text-[#d4af37] underline font-semibold">
                      Explore Higher Tiers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT DESK & WHATSAPP */}
          {activeTab === 'contact' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="theatre-card p-8 rounded-2xl border border-[#d4af37]/40 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block">
                    EXCLUSIVE INTERN CONTACT CHANNEL
                  </span>
                  <h2 className="font-editorial text-3xl font-bold text-[#faf7f2] mt-1">
                    Direct Liaison Desk
                  </h2>
                  <p className="text-xs text-[#9e968b] mt-2 max-w-md mx-auto leading-relaxed">
                    As an active intern, you enjoy priority access to the Gurukul directorate
                    and artist coordinators via direct phone and WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                  <div className="p-4 rounded-xl bg-[#161412] border border-[#2b2723]">
                    <span className="text-[10px] uppercase text-[#9e968b] block">Personal Hotline</span>
                    <div className="font-mono text-base font-bold text-[#faf7f2] mt-1">
                      {siteSettings.personalContactNumber}
                    </div>
                    <span className="text-[10px] text-[#787168]">Dedicated intern priority ring</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161412] border border-[#2b2723]">
                    <span className="text-[10px] uppercase text-[#9e968b] block">WhatsApp Desk</span>
                    <div className="font-mono text-base font-bold text-emerald-400 mt-1">
                      {siteSettings.whatsappNumber}
                    </div>
                    <span className="text-[10px] text-[#787168]">Instant pass reservations & queries</span>
                  </div>
                </div>

                <div>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Namaste%20Rang%20Gurukul%2C%20I%20am%20member%20${encodeURIComponent(currentMember.name)}%20(ID%3A%20${encodeURIComponent(currentMember.membershipId)})`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-editorial font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-950/40"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Launch Direct WhatsApp Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAGE ACTS PARTICIPATION */}
          {activeTab === 'participation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Available Acts */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block mb-1">
                    On-Stage Immersion
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    Available Acts & Auditions
                  </h3>
                  <p className="text-xs text-[#9e968b] mt-1">
                    Open ensemble roles, movement chorus, and backstage aharya crafts open to interns.
                  </p>
                </div>

                <div className="space-y-4">
                  {eligibleOpps.map((opp) => (
                    <div
                      key={opp.id}
                      className="theatre-card p-6 rounded-2xl border border-[#332f2a] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-[#c85a32] px-2.5 py-0.5 rounded bg-[#c85a32]/15">
                          {opp.roleType}
                        </span>
                        <span className="text-xs text-emerald-400 font-mono">Status: {opp.status}</span>
                      </div>

                      <h4 className="font-editorial text-xl font-bold text-[#faf7f2]">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-[#9e968b] leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="pt-2 text-xs text-[#787168] flex flex-wrap gap-4">
                        <span>Dates: <strong className="text-[#d8d0c5]">{opp.dates}</strong></span>
                        <span>Location: <strong className="text-[#d8d0c5]">{opp.location}</strong></span>
                      </div>

                      <div className="pt-3 border-t border-[#25221e]">
                        <button
                          type="button"
                          onClick={() => setSelectedOppId(opp.id)}
                          className="px-4 py-2 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all"
                        >
                          Request Audition / Participation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* My Submitted Requests */}
                <div className="pt-6 border-t border-[#2b2723]">
                  <h4 className="font-editorial text-xl font-bold text-[#faf7f2] mb-4">
                    My Submitted Participation Requests
                  </h4>
                  {myRequests.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#1a1816] text-xs text-[#9e968b]">
                      You have not submitted any stage participation requests yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-xl bg-[#1c1a17] border border-[#2e2a25] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#faf7f2]">{req.opportunityTitle}</div>
                            <div className="text-[11px] text-[#9e968b] line-clamp-1">{req.statement}</div>
                            <span className="text-[10px] text-[#787168]">
                              Submitted: {new Date(req.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                            req.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : req.status === 'Audition Scheduled'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-[#221f1b] text-[#9e968b]'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Request Form */}
              <div className="lg:col-span-5">
                <div className="theatre-card p-6 sm:p-8 rounded-2xl border border-[#d4af37]/30 sticky top-28">
                  <h3 className="font-editorial text-xl font-bold text-[#faf7f2] mb-2">
                    Submit Participation Request
                  </h3>
                  <p className="text-xs text-[#9e968b] mb-4">
                    Express your intent to perform with the Gurukul ensemble on stage or assist with scenic Aharya.
                  </p>

                  {requestSuccessMsg && (
                    <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                      {requestSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                        Select Act / Production *
                      </label>
                      <select
                        required
                        value={selectedOppId}
                        onChange={(e) => setSelectedOppId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="">-- Choose Opportunity --</option>
                        {eligibleOpps.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                        Statement of Intent *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        placeholder="Why do you wish to join this specific staging?"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                        Relevant Training & Prior Experience
                      </label>
                      <textarea
                        rows={3}
                        value={experienceNotes}
                        onChange={(e) => setExperienceNotes(e.target.value)}
                        placeholder="Mention physical training, dance or rhythm background..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#d4af37] text-[#121110] font-editorial font-bold text-xs uppercase tracking-wider hover:bg-[#fae69e] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit to Directorate</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY WORKSHOPS */}
          {activeTab === 'workshops' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    My Masterclass Passes
                  </h3>
                  <p className="text-xs text-[#9e968b]">
                    Your confirmed registrations and access credentials for Gurukul studios.
                  </p>
                </div>
                <Link
                  to="/workshops"
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#121110] text-xs font-semibold uppercase tracking-wider"
                >
                  Explore More Workshops
                </Link>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#1a1816] border border-[#2b2723] text-center text-xs text-[#9e968b] space-y-3">
                  <Ticket className="w-8 h-8 text-[#d4af37] mx-auto opacity-60" />
                  <p>You have not registered for any upcoming paid masterclasses yet.</p>
                  <Link to="/workshops" className="text-[#d4af37] underline block">
                    Browse 2026–2027 Schedule
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="theatre-card p-6 rounded-2xl border border-[#332f2a] space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#d4af37] font-bold">
                          {reg.registrationNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] uppercase font-semibold">
                          {reg.registrationStatus}
                        </span>
                      </div>

                      <h4 className="font-editorial text-xl font-bold text-[#faf7f2]">
                        {reg.workshopTitle}
                      </h4>

                      <div className="space-y-1 text-xs text-[#9e968b] pt-2 border-t border-[#25221e]">
                        <div className="flex justify-between">
                          <span>Participant:</span>
                          <span className="text-[#faf7f2]">{reg.participantName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tuition Paid:</span>
                          <span className="font-mono text-emerald-400">₹{reg.amountPaid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction:</span>
                          <span className="font-mono text-[11px] text-[#787168]">{reg.transactionId}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto theatre-card p-8 rounded-2xl border border-[#332f2a]">
              <div className="flex items-center gap-4 pb-6 border-b border-[#2b2723] mb-6">
                <div className="w-16 h-16 rounded-full bg-[#201e1b] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-editorial text-2xl font-bold">
                  {currentMember.name[0]}
                </div>
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    {currentMember.name}
                  </h3>
                  <span className="text-xs text-[#9e968b]">{currentMember.email}</span>
                </div>
              </div>

              {profileSaved && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                  Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                      City of Residence
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Biographical / Artistic Statement
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#121110] font-semibold text-xs uppercase tracking-wider hover:bg-[#fae69e] transition-all"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};
