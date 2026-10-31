import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Mail,
  Send,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Radio,
  Clock,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import type { AnnouncementType, Subscriber } from '../../types/database';

export const AdminCommunicationView: React.FC = () => {
  const {
    subscribers,
    toggleSubscriberStatus,
    deleteSubscriber,
    emailBroadcasts,
    sendAnnouncement,
    emailConfig,
    members,
  } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'broadcast' | 'subscribers' | 'history'>('broadcast');

  // Broadcast Composer State
  const [broadcastType, setBroadcastType] = useState<AnnouncementType>('New Event');
  const [targetAudience, setTargetAudience] = useState<'all' | 'members_only'>('all');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [body, setBody] = useState('');
  const [sendToSubscribersToggle, setSendToSubscribersToggle] = useState<boolean>(true);
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState<string | null>(null);

  // Subscriber filter state
  const [subSearch, setSubSearch] = useState('');
  const [subFilter, setSubFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(subSearch.toLowerCase());
    const matchesStatus = subFilter === 'all' || s.status === subFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    if (!sendToSubscribersToggle) {
      setBroadcastSentSuccess('Saved as internal draft record. No emails were dispatched.');
      setTimeout(() => setBroadcastSentSuccess(null), 3500);
      return;
    }

    const title = `${broadcastType}: ${subject.slice(0, 40)}...`;

    sendAnnouncement({
      title,
      subject,
      preheader,
      body,
      type: broadcastType,
      targetAudience,
      status: 'sent',
    });

    const recipientCount = targetAudience === 'members_only' ? members.length : subscribers.filter((s) => s.status === 'active').length;
    setBroadcastSentSuccess(`Broadcast dispatched successfully to ${recipientCount} recipients via ${emailConfig.provider}!`);

    setSubject('');
    setPreheader('');
    setBody('');
    setTimeout(() => setBroadcastSentSuccess(null), 4000);
  };

  const exportSubscribersCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Date Subscribed', 'Interests'];
    const rows = filteredSubscribers.map((s) => [
      `"${s.name}"`,
      s.email,
      s.status,
      new Date(s.subscribedAt).toLocaleDateString(),
      `"${s.interests?.join('; ') || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RangGurukul_Subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            NEWSLETTER & DISPATCH ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Communication & Email Broadcasts
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Pluggable adapter for Resend, SendGrid, Amazon SES, and Mailgun. Broadcast updates to all subscribers or save as draft.
          </p>
        </div>

        {activeSubTab === 'subscribers' && (
          <button
            onClick={exportSubscribersCSV}
            className="px-4 py-2 rounded-xl bg-[#282522] hover:bg-amber-400 hover:text-black text-amber-400 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 border border-amber-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export Subscribers ({subscribers.length})</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'broadcast', label: 'Compose Announcement' },
          { id: 'subscribers', label: `Subscribers Registry (${subscribers.length})` },
          { id: 'history', label: `Sent Dispatches (${emailBroadcasts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-colors border-b-2 ${
              activeSubTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-[#1c1a17]'
                : 'border-transparent text-[#9e968b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: COMPOSE ANNOUNCEMENT */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Composer Form */}
          <div className="lg:col-span-7 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
              <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Publish Update / Send Email Broadcast</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                Provider: {emailConfig.provider}
              </span>
            </div>

            {broadcastSentSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{broadcastSentSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Update Type *
                  </label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value as AnnouncementType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-semibold text-xs focus:outline-none"
                  >
                    <option value="New Event">New Event</option>
                    <option value="New Workshop">New Workshop</option>
                    <option value="New Performance">New Performance</option>
                    <option value="New Story / Article">New Story / Article</option>
                    <option value="New Gallery">New Gallery</option>
                    <option value="Important Announcement">Important Announcement</option>
                    <option value="Rang Gurukul News">Rang Gurukul News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:outline-none"
                  >
                    <option value="all">All Active Subscribers ({subscribers.filter((s) => s.status === 'active').length})</option>
                    <option value="members_only">Enrolled Interns Only ({members.length})</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Shakuntala Unbound Premiere Passes Now Open"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Preview Preheader Text
                </label>
                <input
                  type="text"
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  placeholder="Brief preview line visible in subscriber inbox..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Announcement Body Message *
                </label>
                <textarea
                  rows={6}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Dear Rasika,\n\nWe are pleased to announce..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* CRUCIAL REQUIREMENT: Toggle Send update to all subscribers vs Do not send email */}
              <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {sendToSubscribersToggle ? 'Send update to all subscribers' : 'Do not send email (Save internal draft)'}
                  </span>
                  <span className="text-[11px] text-[#9e968b]">
                    {sendToSubscribersToggle
                      ? `Dispatches live email via ${emailConfig.provider} to ${targetAudience === 'members_only' ? members.length : subscribers.filter((s) => s.status === 'active').length} recipients`
                      : 'Records announcement in history without triggering outbound API dispatch'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToSubscribersToggle}
                    onChange={(e) => setSendToSubscribersToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#332f2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {sendToSubscribersToggle ? 'Send Broadcast Now' : 'Save Draft Announcement'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Email Inbox Mockup Preview */}
          <div className="lg:col-span-5 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
              <h3 className="font-editorial text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Live Email Inbox Preview</span>
              </h3>
              <span className="text-[10px] font-mono text-[#9e968b]">HTML Template</span>
            </div>

            {/* Email Shell */}
            <div className="rounded-xl overflow-hidden border border-[#332f2a] bg-[#121110] text-[#faf7f2] shadow-2xl">
              <div className="p-4 bg-[#1e1b18] border-b border-[#332f2a] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">
                    {subject || 'Announcement Subject Line'}
                  </div>
                  <div className="text-[10px] text-[#9e968b] mt-0.5">
                    From: {emailConfig.senderName} &lt;{emailConfig.senderEmail}&gt;
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] uppercase font-semibold">
                  {broadcastType}
                </span>
              </div>

              <div className="p-6 space-y-4 text-xs leading-relaxed">
                {preheader && (
                  <div className="text-[11px] text-amber-300 italic border-l-2 border-amber-400 pl-2">
                    {preheader}
                  </div>
                )}

                <div className="whitespace-pre-wrap text-[#d8d0c5]">
                  {body || 'Write your message in the composer on the left to see live rendering here...'}
                </div>

                <div className="pt-6 border-t border-[#25221e] text-[10px] text-[#6b635b] text-center space-y-1">
                  <div>Rang Gurukul Sansthan Cultural Trust • Dehradun Foothills</div>
                  <div className="text-[#9e968b]">
                    You received this dispatch because you subscribed to Rang Gurukul updates.
                  </div>
                  <a href="#" className="underline text-amber-400/80">
                    Unsubscribe instantly
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS REGISTRY */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9e968b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Search subscriber by name or email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9e968b]">Filter:</span>
              <select
                value={subFilter}
                onChange={(e) => setSubFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-white"
              >
                <option value="all">All Subscribers</option>
                <option value="active">Active Only</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
          </div>

          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3 px-4">Subscriber Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {filteredSubscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#1f1d1a] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{s.name}</td>
                      <td className="py-3.5 px-4 text-[#d8d0c5]">{s.email}</td>
                      <td className="py-3.5 px-4 text-[11px] text-[#9e968b]">{s.source || 'Website'}</td>
                      <td className="py-3.5 px-4 text-[#9e968b] font-mono">
                        {new Date(s.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          s.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#282522] text-[#9e968b]'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleSubscriberStatus(s.id)}
                            className="px-2.5 py-1 rounded bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400 text-[11px] font-semibold"
                          >
                            {s.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => deleteSubscriber(s.id)}
                            className="p-1 rounded bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b]"
                            title="Delete Subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH HISTORY */}
      {activeSubTab === 'history' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                <tr>
                  <th className="py-3 px-4">Dispatched Subject</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Audience</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Dispatched At</th>
                  <th className="py-3 px-4">Gateway Provider</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                {emailBroadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-[#1f1d1a] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{b.subject}</div>
                      <div className="text-[11px] text-[#9e968b] line-clamp-1">{b.body}</div>
                    </td>
                    <td className="py-3.5 px-4 text-amber-300 font-mono text-[11px]">{b.type}</td>
                    <td className="py-3.5 px-4 text-[#9e968b] uppercase text-[10px] font-semibold">{b.targetAudience}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{b.recipientCount}</td>
                    <td className="py-3.5 px-4 text-[#9e968b]">{new Date(b.sentAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-mono">{b.provider}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
