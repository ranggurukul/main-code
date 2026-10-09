import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { Crown, Lock, ArrowRight, UserCheck, Sparkles, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { memberLogin, isMemberLoggedIn } = useAuth();
  const { members } = useDatabase();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect
  if (isMemberLoggedIn) {
    return <Navigate to="/member" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const res = memberLogin(email);
    if (res.success) {
      navigate('/member');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (memberEmail: string) => {
    const res = memberLogin(memberEmail);
    if (res.success) {
      navigate('/member');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="w-full max-w-md theatre-card p-8 sm:p-10 rounded-2xl border border-[#d4af37]/40 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
              <Crown className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#c85a32] block mb-1">
              Sanctum Community
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#faf7f2]">
              Member Portal Login
            </h1>
            <p className="text-xs text-[#9e968b] mt-1">
              Enter your registered internship email to access your personal dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Member Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@ranggurukul.org"
                className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-xs uppercase tracking-wider text-[#121110] bg-[#d4af37] hover:bg-[#fae69e] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Access Member Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-[#2a2622]">
            <span className="text-[10px] uppercase tracking-wider text-[#9e968b] block mb-2 font-mono">
              Quick Test Intern Accounts:
            </span>
            <div className="space-y-2">
              {members.slice(0, 2).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleQuickLogin(m.email)}
                  className="w-full p-2.5 rounded-xl bg-[#1c1a17] border border-[#332f2a] hover:border-[#d4af37]/60 text-left flex items-center justify-between text-xs text-[#d8d0c5] transition-all"
                >
                  <div>
                    <div className="font-semibold text-[#faf7f2]">{m.name}</div>
                    <div className="text-[10px] text-[#d4af37]">{m.planName} ({m.membershipId})</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-[#d4af37]" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#9e968b]">
            Not an intern yet?{' '}
            <Link to="/membership" className="text-[#d4af37] underline font-semibold">
              Join Paid Membership
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
