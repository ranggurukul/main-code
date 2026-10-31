import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Lock, AlertCircle, ShieldAlert, ShieldX, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, adminGoogleLogin, isAdminLoggedIn } = useAuth();
  const { attemptAdminRegistration } = useDatabase();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Modals for strict policy messages
  const [deniedModal, setDeniedModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    emailAttempted?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const [configHelpModal, setConfigHelpModal] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('');

  // If already logged in as admin, redirect to dashboard
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  // 1. Password Login Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');

    const res = adminLogin(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      if (res.errorType === 'NOT_AUTHORIZED') {
        setDeniedModal({
          isOpen: true,
          title: 'Permission Denied',
          message:
            'This account is not authorized to access the Rang Gurukul Admin Panel. Only administrators authorized by the primary owner may log in.',
          emailAttempted: email,
        });
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  // 2. Google OAuth Login Handler
  const handleGoogleSignIn = async (simulatedEmail?: string) => {
    setErrorMsg('');
    setIsGoogleLoading(true);

    try {
      const res = await adminGoogleLogin(simulatedEmail);
      setIsGoogleLoading(false);

      if (res.success) {
        navigate('/admin');
      } else {
        if (res.errorType === 'GOOGLE_CONFIG_REQUIRED') {
          setConfigHelpModal(true);
        } else {
          // Strict Unauthorized message requirement
          setDeniedModal({
            isOpen: true,
            title: 'Permission Denied',
            message:
              'This Google account is not authorized to access the Rang Gurukul Admin Panel. Please contact the website owner for access.',
            emailAttempted: simulatedEmail || 'Your Google Account',
          });
        }
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMsg(err.message || 'Google authentication failed.');
    }
  };

  // 3. Rejection of Public Registration Attempts
  const handlePublicRegistrationAttempt = () => {
    const res = attemptAdminRegistration(email || 'visitor@unauthorized.org');
    setDeniedModal({
      isOpen: true,
      title: 'Access Restricted',
      message:
        'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0d0c] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-black">
      <div className="w-full max-w-md bg-[#181614] border border-[#332f2a] rounded-2xl shadow-2xl p-8 sm:p-10 text-[#faf7f2] relative">
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
            Owner-authorized access for Sansthan Trustees, Curators & Administrators.
          </p>
        </div>

        {/* METHOD 1: CONTINUE WITH GOOGLE */}
        <div className="space-y-4 mb-6">
          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            disabled={isGoogleLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#201e1b] hover:bg-[#282522] border border-[#3a3530] hover:border-amber-400/60 text-[#faf7f2] font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-3 shadow-md group disabled:opacity-60 cursor-pointer"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span className="group-hover:text-amber-300 transition-colors">Continue with Google</span>
          </button>

          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[10px] text-[#787168]">Requires verified email authorization by Owner</span>
            <button
              type="button"
              onClick={() => setConfigHelpModal(true)}
              className="text-[#9e968b] hover:text-amber-400 text-[10px] inline-flex items-center gap-0.5"
              title="Google OAuth Details & Verification Tester"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2d2925]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
            <span className="bg-[#181614] px-3 text-[#787168]">
              Or Sign In With Email & Password
            </span>
          </div>
        </div>

        {/* METHOD 2: EMAIL & PASSWORD FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
              Authorized Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@ranggurukul.org"
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-amber-400 focus:outline-none placeholder:text-[#555]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
              Administrator Passcode / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-amber-400 focus:outline-none placeholder:text-[#555]"
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
            className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate Session</span>
          </button>
        </form>

        {/* REGISTRATION IS DISABLED */}
        <div className="mt-6 pt-5 border-t border-[#2a2622] flex items-center justify-between text-xs text-[#787168]">
          <Link to="/" className="text-[#9e968b] hover:text-[#faf7f2] underline text-[11px]">
            Return to Public Website
          </Link>

          <button
            type="button"
            onClick={handlePublicRegistrationAttempt}
            className="text-[11px] text-[#787168] hover:text-amber-400/80 transition-colors"
          >
            Register as Admin?
          </button>
        </div>
      </div>

      {/* PERMISSION DENIED / ACCESS RESTRICTED MODAL */}
      {deniedModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#181614] border border-rose-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400 mb-4 shadow-lg">
              <ShieldX className="w-7 h-7" />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 block mb-1">
              Owner Access Control Policy
            </span>

            <h3 className="font-editorial text-2xl font-bold text-white mb-2">
              {deniedModal.title}
            </h3>

            <p className="text-xs text-[#c4b9aa] leading-relaxed mb-4">
              {deniedModal.message}
            </p>

            {deniedModal.emailAttempted && (
              <div className="p-2.5 rounded-lg bg-[#201e1b] border border-[#332f2a] text-[11px] font-mono text-[#9e968b] mb-6 truncate">
                Attempted: <span className="text-amber-300">{deniedModal.emailAttempted}</span>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setDeniedModal({ isOpen: false, title: '', message: '' })}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all cursor-pointer"
              >
                Dismiss & Return
              </button>

              <div className="text-[10px] text-[#787168] pt-2">
                Rang Gurukul Sansthan • Strict Whitelist Authorization
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE OAUTH CONFIGURATION & VERIFICATION TESTBED MODAL */}
      {configHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-editorial text-xl font-bold text-white">
                  Google OAuth & Authorization Inspector
                </h3>
              </div>
              <button
                onClick={() => setConfigHelpModal(false)}
                className="text-[#9e968b] hover:text-white text-xs px-2 py-1 rounded bg-[#201e1b]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#c4b9aa]">
              <div className="p-3.5 rounded-xl bg-[#201e1b] border border-[#3a3530]">
                <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                  1. Official Firebase Google Provider Setup
                </h4>
                <p className="text-[11px] leading-relaxed text-[#9e968b]">
                  To enable live Google Sign-In popup in production or development:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-[11px] text-[#d6cec3]">
                  <li>Open Firebase Console (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">console.firebase.google.com</a>) for project <strong>rang-gurukul</strong>.</li>
                  <li>Go to <strong>Authentication &gt; Sign-in method</strong>.</li>
                  <li>Click <strong>Google</strong> and toggle <strong>Enable</strong>.</li>
                  <li>Set the support email to your administrator email and click <strong>Save</strong>.</li>
                  <li>Under <strong>Authorized domains</strong>, ensure your domain (e.g. <code>localhost</code> and your Vercel deployment URL) is listed.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40">
                <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                  2. Immediate Google OAuth Verification Test-Bed
                </h4>
                <p className="text-[11px] text-[#9e968b] mb-3">
                  You can immediately test and verify how the backend authorization logic handles any Google account email:
                </p>

                <div className="space-y-2">
                  <input
                    type="email"
                    value={testEmailInput}
                    onChange={(e) => setTestEmailInput(e.target.value)}
                    placeholder="Enter email to simulate Google Sign-In"
                    className="w-full px-3 py-2 rounded-lg bg-[#141210] border border-[#3a3530] text-white text-xs"
                  />

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn('thematrix2741@gmail.com')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] hover:brightness-110"
                    >
                      Test: Owner (thematrix2741@gmail.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn('owner@ranggurukul.org')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] hover:brightness-110"
                    >
                      Test: Owner (owner@ranggurukul.org)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn('superadmin@ranggurukul.org')}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-300 text-[10px] hover:brightness-110"
                    >
                      Test: Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn('unauthorized.stranger@gmail.com')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px] hover:brightness-110"
                    >
                      Test: Unauthorized Person
                    </button>
                  </div>

                  {testEmailInput && (
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn(testEmailInput)}
                      className="w-full mt-2 py-2 rounded-lg bg-amber-400 text-black font-semibold text-xs uppercase hover:brightness-110"
                    >
                      Verify "{testEmailInput}"
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

