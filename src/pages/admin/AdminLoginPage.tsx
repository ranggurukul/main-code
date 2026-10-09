import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Shield, Lock, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdminLoggedIn, currentAdmin } = useAuth();
  const { adminUsers } = useDatabase();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in as admin, redirect to dashboard
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const res = adminLogin(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (adminEmail: string) => {
    const res = adminLogin(adminEmail);
    if (res.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0d0c] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-black">
      <div className="w-full max-w-md bg-[#181614] border border-[#332f2a] rounded-2xl shadow-2xl p-8 sm:p-10 text-[#faf7f2]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            Institutional Administration
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold">
            Rang Gurukul CMS Portal
          </h1>
          <p className="text-xs text-[#9e968b] mt-1">
            Restricted access for Sansthan Trustees, Administrators & Curators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@ranggurukul.org"
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
              Secret Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate Session</span>
          </button>
        </form>

        {/* Quick Demo Admin Logins */}
        <div className="mt-8 pt-6 border-t border-[#2a2622]">
          <span className="text-[10px] uppercase tracking-wider text-[#9e968b] block mb-2 font-mono">
            Demo Administrative Roles:
          </span>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('owner@ranggurukul.org')}
              className="w-full p-2.5 rounded-xl bg-[#201e1b] border border-amber-500/40 hover:bg-[#282522] text-left flex items-center justify-between text-xs text-[#faf7f2] transition-colors"
            >
              <div>
                <span className="font-semibold text-amber-300">Sansthan Trustee (OWNER)</span>
                <div className="text-[10px] text-[#9e968b]">owner@ranggurukul.org • Full Sovereign Access</div>
              </div>
              <UserCheck className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => handleQuickLogin('workshops@ranggurukul.org')}
              className="w-full p-2.5 rounded-xl bg-[#201e1b] border border-[#332f2a] hover:border-amber-500/30 text-left flex items-center justify-between text-xs text-[#faf7f2] transition-colors"
            >
              <div>
                <span className="font-semibold">Workshop Registrar (WORKSHOP_ADMIN)</span>
                <div className="text-[10px] text-[#9e968b]">workshops@ranggurukul.org • Forms & Registrations</div>
              </div>
              <UserCheck className="w-4 h-4 text-[#9e968b]" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#787168]">
          <Link to="/" className="text-[#9e968b] hover:text-[#faf7f2] underline">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
