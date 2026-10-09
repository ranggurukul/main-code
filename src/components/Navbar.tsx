import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, Shield, User, Crown, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentMember, isMemberLoggedIn } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSoundscape = () => {
    const active = audioEngine.toggle();
    setIsPlayingAudio(active);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Disciplines', to: '/disciplines' },
    { label: 'Programs', to: '/programs' },
    { label: 'Events', to: '/events' },
    { label: 'Workshops', to: '/workshops' },
    { label: 'Membership', to: '/membership' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Stories', to: '/stories' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121110]/95 backdrop-blur-xl border-b border-[#332f2a]/80 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#121110]/95 via-[#121110]/70 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full border border-[#d4af37]/60 bg-[#1e1b18] flex items-center justify-center transition-all duration-300 group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <span className="font-marcellus text-[#d4af37] text-lg font-bold leading-none">
                रं
              </span>
              <div className="absolute inset-0 rounded-full border border-[#c85a32]/40 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl font-bold tracking-widest text-[#faf7f2] group-hover:text-[#d4af37] transition-colors leading-tight">
                RANG GURUKUL
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#9e968b] font-medium">
                Sansthan • Art & Culture
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest transition-colors py-1 relative font-medium ${
                    isActive
                      ? 'text-[#d4af37] font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#d4af37]'
                      : 'text-[#d8d0c5] hover:text-[#d4af37]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleSoundscape}
              aria-label="Toggle ambient Tanpura soundscape"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 border ${
                isPlayingAudio
                  ? 'border-[#d4af37] bg-[#2a2622] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                  : 'border-[#332f2a] bg-[#1a1816]/70 text-[#9e968b] hover:text-[#faf7f2] hover:border-[#554e46]'
              }`}
              title="Experience ambient Indian acoustic tanpura drone"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                  <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase">Tanpura: On</span>
                  <div className="flex items-end gap-0.5 h-3 w-3.5">
                    <span className="w-0.5 bg-[#d4af37] rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
                    <span className="w-0.5 bg-[#d4af37] rounded-full animate-[bounce_1.2s_ease-in-out_infinite] h-2/3" />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase">Soundscape</span>
                </>
              )}
            </button>

            {/* Member Portal Button */}
            {isMemberLoggedIn ? (
              <Link
                to="/member"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#d4af37] border border-[#d4af37]/40 bg-[#24201c] hover:bg-[#2e2924] hover:border-[#d4af37] transition-all shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              >
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">{currentMember?.name.split(' ')[0]}</span>
                <span className="sm:hidden">Member</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider text-[#d8d0c5] border border-[#332f2a] bg-[#1c1a17] hover:border-[#d4af37] hover:text-[#faf7f2] transition-all"
              >
                <User className="w-3 h-3 text-[#d4af37]" />
                <span>Member Portal</span>
              </Link>
            )}


            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#faf7f2] hover:bg-[#282522] border border-[#332f2a] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-20 pb-6 px-6 bg-[#121110]/98 backdrop-blur-2xl xl:hidden overflow-y-auto border-b border-[#332f2a]">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm uppercase tracking-widest font-editorial font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2a2622] text-[#d4af37] border-l-2 border-[#d4af37]'
                      : 'text-[#d8d0c5] hover:bg-[#1a1816] hover:text-[#d4af37]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-4 border-t border-[#332f2a] flex flex-col gap-2.5">
              <Link
                to={isMemberLoggedIn ? '/member' : '/login'}
                className="w-full py-3 px-4 rounded-xl border border-[#d4af37]/40 bg-[#201e1b] text-center font-editorial text-sm tracking-wider uppercase text-[#d4af37] flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>{isMemberLoggedIn ? 'Open Member Dashboard' : 'Member Portal Login'}</span>
              </Link>

              <Link
                to="/admin/login"
                className="w-full py-2.5 px-4 rounded-xl border border-[#332f2a] bg-[#161513] text-center text-xs tracking-wider uppercase text-[#9e968b] hover:text-[#faf7f2] flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS Access</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
