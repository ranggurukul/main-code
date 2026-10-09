import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useDatabase } from '../context/DatabaseContext';
import { Mail, CheckCircle2, Sparkles, Bell, ArrowRight, ShieldCheck, UserCheck, XCircle } from 'lucide-react';

export const SubscribePage: React.FC = () => {
  const { subscribe, unsubscribe } = useDatabase();

  const [activeTab, setActiveTab] = useState<'subscribe' | 'unsubscribe'>('subscribe');

  // Subscribe Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'New Event',
    'New Workshop',
    'New Performance',
    'New Story / Article',
    'Important Announcement',
  ]);
  const [subStatus, setSubStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Unsubscribe Form
  const [unsubInput, setUnsubInput] = useState('');
  const [unsubStatus, setUnsubStatus] = useState<string | null>(null);

  const interestOptions = [
    'New Event',
    'New Workshop',
    'New Performance',
    'New Story / Article',
    'New Gallery',
    'Important Announcement',
    'Rang Gurukul News',
  ];

  const handleInterestToggle = (opt: string) => {
    setSelectedInterests((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribe(name || 'Cultural Patron', email, 'Subscribe Page', selectedInterests);
    setSubStatus(res);
  };

  const handleUnsubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubInput) return;
    const success = unsubscribe(unsubInput);
    if (success) {
      setUnsubStatus('Your email address has been unsubscribed from all Rang Gurukul communications.');
    } else {
      setUnsubStatus('No active subscriber record matched this email address or token.');
    }
  };

  return (
    <PageTransition>
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#c85a32] block mb-2 font-semibold">
            Institutional Communications
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            Stay Connected With Rang Gurukul
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-xl mx-auto font-light leading-relaxed">
            Direct dispatches regarding new repertoire premieres, paid masterclass admissions,
            academic internships, and scholarly monographs.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-[#201e1b] border border-[#332f2a]">
            <button
              onClick={() => setActiveTab('subscribe')}
              className={`px-5 py-2 rounded-lg text-xs uppercase font-semibold tracking-wider transition-all ${
                activeTab === 'subscribe'
                  ? 'bg-[#d4af37] text-[#121110] shadow-md'
                  : 'text-[#9e968b] hover:text-[#faf7f2]'
              }`}
            >
              Subscribe
            </button>
            <button
              onClick={() => setActiveTab('unsubscribe')}
              className={`px-5 py-2 rounded-lg text-xs uppercase font-semibold tracking-wider transition-all ${
                activeTab === 'unsubscribe'
                  ? 'bg-[#d4af37] text-[#121110] shadow-md'
                  : 'text-[#9e968b] hover:text-[#faf7f2]'
              }`}
            >
              Manage / Unsubscribe
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-xl mx-auto">
          {activeTab === 'subscribe' ? (
            <div className="theatre-card p-8 sm:p-10 rounded-2xl border border-[#d4af37]/30 shadow-2xl">
              {subStatus?.success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    Subscription Confirmed
                  </h3>
                  <p className="text-xs text-[#9e968b] leading-relaxed">
                    {subStatus.message}
                  </p>
                  <p className="text-[11px] text-[#787168]">
                    You may update your preferences or unsubscribe at any time using the link in the email footer.
                  </p>
                  <button
                    onClick={() => {
                      setSubStatus(null);
                      setName('');
                      setEmail('');
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-[#332f2a] text-[#d4af37] text-xs uppercase tracking-wider font-semibold hover:border-[#d4af37]"
                  >
                    Subscribe Another Contact
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohini Bhattacharya"
                      className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] font-semibold mb-2">
                      Select Topics of Interest:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {interestOptions.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1a1816] border border-[#2b2723] cursor-pointer hover:border-[#d4af37]/40 text-xs text-[#faf7f2]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedInterests.includes(opt)}
                            onChange={() => handleInterestToggle(opt)}
                            className="accent-[#d4af37]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {subStatus && !subStatus.success && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300">
                      {subStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-editorial font-bold text-xs uppercase tracking-wider text-[#121110] bg-gradient-to-r from-[#d4af37] via-[#f3d068] to-[#d4af37] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-[#121110]" />
                    <span>Confirm Subscription</span>
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-[#787168] justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your privacy is sacred. No spam or commercial data sharing.</span>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Unsubscribe Form */
            <div className="theatre-card p-8 sm:p-10 rounded-2xl border border-[#332f2a] shadow-2xl">
              <h3 className="font-editorial text-2xl font-bold text-[#faf7f2] mb-2">
                Unsubscribe from Dispatches
              </h3>
              <p className="text-xs text-[#9e968b] mb-6">
                Enter your registered email address or your personal unsubscribe token below.
              </p>

              <form onSubmit={handleUnsubscribeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                    Email Address or Unsubscribe Token
                  </label>
                  <input
                    type="text"
                    required
                    value={unsubInput}
                    onChange={(e) => setUnsubInput(e.target.value)}
                    placeholder="email@example.com or token"
                    className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                {unsubStatus && (
                  <div className="p-3.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-[#faf7f2]">
                    {unsubStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Unsubscribe Me
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};
