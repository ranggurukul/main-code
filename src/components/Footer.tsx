import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, Globe, Shield, Lock, Phone, MapPin, Heart } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const Footer: React.FC = () => {
  const { siteSettings, subscribe } = useDatabase();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribe(name || 'Cultural Patron', email, 'Footer Bar');
    if (res.success) {
      setSubscribed(true);
      setMsg(res.message);
    } else {
      setMsg(res.message);
    }
  };

  return (
    <footer className="bg-[#0e0d0c] border-t border-[#2b2723] pt-16 pb-12 px-4 sm:px-6 lg:px-12 text-[#9e968b] relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Newsletter & Monograph Bar */}
        <div className="theatre-card rounded-2xl p-6 sm:p-10 mb-14 border border-[#332f2a] flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#1c1a17] via-[#221f1c] to-[#1c1a17]">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
              The Rang Patrika • रंग पत्रिका
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#faf7f2] font-normal">
              Stay Connected With Rang Gurukul
            </h3>
            <p className="mt-2 text-xs text-[#9e968b] leading-relaxed">
              Curated essays on ancient dramaturgy, season repertoire announcements, new masterclasses, and open calls for artist residencies.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#d4af37] bg-[#121110] p-4 rounded-xl border border-[#d4af37]/30">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#d4af37]" />
                <div>
                  <div className="font-semibold">{msg}</div>
                  <div className="text-[11px] text-[#9e968b]">We honor your presence in our cultural circle.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="px-3.5 py-2.5 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <div className="relative flex-grow">
                  <Mail className="w-4 h-4 text-[#9e968b] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            {msg && !subscribed && (
              <div className="text-[11px] text-amber-400 mt-2 px-1">{msg}</div>
            )}
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-[#25221e]">
          {/* Brand & Crest */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full border border-[#d4af37] bg-[#1a1816] flex items-center justify-center text-[#d4af37] font-marcellus font-bold">
                रं
              </div>
              <span className="font-editorial text-xl font-bold tracking-widest text-[#faf7f2]">
                RANG GURUKUL
              </span>
            </Link>
            <p className="text-xs text-[#9e968b] leading-relaxed max-w-sm mb-3">
              {siteSettings.tagline}
            </p>
            <div className="text-[11px] font-marcellus text-[#d4af37] italic mb-4">
              "नाट्यं भिन्नरुचेर्जनस्य बहुधाप्येकं समाराधनम्"
            </div>
            <div className="space-y-1 text-xs text-[#8f867c]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{siteSettings.addressLine1}, {siteSettings.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Col 1: Cultural Journey */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#faf7f2] font-semibold block mb-3 font-editorial">
              Exploration
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-[#d4af37] transition-colors">Lineage & Philosophy</Link></li>
              <li><Link to="/disciplines" className="hover:text-[#d4af37] transition-colors">The Six Disciplines</Link></li>
              <li><Link to="/programs" className="hover:text-[#d4af37] transition-colors">Internship Academies</Link></li>
              <li><Link to="/events" className="hover:text-[#d4af37] transition-colors">Season Repertoire</Link></li>
              <li><Link to="/workshops" className="hover:text-[#d4af37] transition-colors">Paid Masterclasses</Link></li>
            </ul>
          </div>

          {/* Col 2: Living Heritage */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#faf7f2] font-semibold block mb-3 font-editorial">
              Archives & Arts
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link to="/gallery" className="hover:text-[#d4af37] transition-colors">Digital Art Archive</Link></li>
              <li><Link to="/artists" className="hover:text-[#d4af37] transition-colors">Gurus & Ensemble</Link></li>
              <li><Link to="/stories" className="hover:text-[#d4af37] transition-colors">Cultural Journal</Link></li>
              <li><Link to="/subscribe" className="hover:text-[#d4af37] transition-colors">Newsletter Preferences</Link></li>
              <li><Link to="/contact" className="hover:text-[#d4af37] transition-colors">Visit Campus Sanctum</Link></li>
            </ul>
          </div>

          {/* Col 3: Internship & Portal */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#faf7f2] font-semibold block mb-3 font-editorial">
              Internship & CMS
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link to="/membership" className="text-[#d4af37] hover:underline font-medium">Join Paid Membership</Link></li>
              <li><Link to="/login" className="hover:text-[#d4af37] transition-colors">Member Sanctuary</Link></li>
              <li><Link to="/member" className="hover:text-[#d4af37] transition-colors">My Internship Portal</Link></li>
              <li className="pt-2 border-t border-[#25221e]">
                <Link to="/admin/login" className="text-[#c85a32] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Admin CMS Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6b635b]">
          <div>
            © 2026 Rang Gurukul Sansthan Cultural Trust. All Rights Reserved.
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-[#9e968b]">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              Dehradun • New Delhi • London
            </span>
            <span className="flex items-center gap-1 text-[#9e968b]">
              <Shield className="w-3.5 h-3.5 text-[#c85a32]" />
              Secured 80G Cultural Trust
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
