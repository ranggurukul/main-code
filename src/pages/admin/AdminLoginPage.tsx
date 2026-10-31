import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdminLoggedIn } = useAuth();
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

  return (
    <div className="min-h-screen bg-[#0e0d0c] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-black">
      <div className="w-full max-w-md bg-[#181614] border border-[#332f2a] rounded-2xl shadow-2xl p-8 sm:p-10 text-[#faf7f2]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-3">
            <div className="w-16 h-16 rounded-full bg-white p-1 border-2 border-amber-500/60 shadow-xl mx-auto overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Rang Gurukul Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </Link>
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

        <div className="mt-8 pt-6 border-t border-[#2a2622] text-center text-xs text-[#787168]">
          <Link to="/" className="text-[#9e968b] hover:text-[#faf7f2] underline">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
