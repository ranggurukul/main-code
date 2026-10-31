import React, { useState } from 'react';
import { MapPin, Sun, Moon, Flame, Navigation, Send, CheckCircle2 } from 'lucide-react';

export const CampusVisit: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    visitors: '2',
    interest: 'Open Amphitheatre Performance',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="visit" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#141210] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Campus Description & Atmosphere */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5" />
              The Living Foothill Sanctum
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
              Visiting the <span className="italic font-display text-[#d4af37]">Sanctuary</span>
            </h2>
            <p className="mt-4 text-[#d8d0c5] text-base leading-relaxed font-sans-clean">
              Located amidst 28 acres of preserved sal forest in the Himalayan foothills of Uttarakhand, Rang Gurukul is designed in accordance with ancient Vastu and the Natyashastra’s spatial treatises.
            </p>

            {/* Campus Spaces */}
            <div className="mt-8 space-y-4">
              <div className="theatre-card p-4 rounded-xl border border-[#332f2a]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#faf7f2] mb-1">
                  <Sun className="w-4 h-4 text-[#d4af37]" />
                  <span>The Great Earthen & Stone Amphitheatre</span>
                </div>
                <p className="text-xs text-[#9e968b] leading-relaxed">
                  A 600-seat amphitheatre carved into natural stone terracing. Designed for acoustic clarity without electrical amplification.
                </p>
              </div>

              <div className="theatre-card p-4 rounded-xl border border-[#332f2a]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#faf7f2] mb-1">
                  <Moon className="w-4 h-4 text-[#c85a32]" />
                  <span>Riyaaz Pavilions & Forest Studios</span>
                </div>
                <p className="text-xs text-[#9e968b] leading-relaxed">
                  Open-air teakwood floors sheltered by thatch roofs where vocalists, percussionists, and martial dancers practice with the dawn birds.
                </p>
              </div>

              <div className="theatre-card p-4 rounded-xl border border-[#332f2a]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#faf7f2] mb-1">
                  <Flame className="w-4 h-4 text-[#d4af37]" />
                  <span>The Artisans Guild Courtyard</span>
                </div>
                <p className="text-xs text-[#9e968b] leading-relaxed">
                  Living workshops where master mask carvers, natural dyers, and puppet sculptors demonstrate rare techniques to visiting patrons.
                </p>
              </div>
            </div>

            {/* Address & Directions */}
            <div className="mt-8 p-4 rounded-xl bg-[#121110] border border-[#2b2723] flex items-center justify-between text-xs text-[#9e968b]">
              <div>
                <strong className="text-[#faf7f2] block">Rang Gurukul Heritage Campus</strong>
                <span>Maldevta Valley, Raipur Foothills, Dehradun 248008, India</span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d4af37]/30 bg-[#1e1b18] text-[#d4af37] font-semibold hover:border-[#d4af37] transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                Directions
              </a>
            </div>
          </div>

          {/* Right Column: Schedule a Guided Experience Form */}
          <div className="lg:col-span-6">
            <div className="theatre-card rounded-2xl p-6 sm:p-10 border border-[#d4af37]/30 shadow-2xl relative">
              <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-1">
                Curated Access
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#faf7f2] font-semibold mb-2">
                Reserve an Immersion Visit
              </h3>
              <p className="text-xs text-[#9e968b] mb-6">
                Visits are kept intimate to protect the contemplative atmosphere of our residential artists. Please register in advance.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#121110] border border-[#d4af37]/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#d4af37] mx-auto animate-bounce" />
                  <h4 className="font-display text-xl text-[#faf7f2]">
                    Visit Reservation Received
                  </h4>
                  <p className="text-xs text-[#d8d0c5] leading-relaxed">
                    Our Guest Registrar will reach out to <strong>{formData.email}</strong> within 24 hours with your visitor credentials, directions, and recommended attire guidelines.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-full border border-[#332f2a] text-xs text-[#9e968b] hover:text-[#faf7f2] transition-colors"
                  >
                    Register Another Visit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Arundhati Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="arundhati@institute.org"
                        className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                        Preferred Date
                      </label>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                        Number of Visitors
                      </label>
                      <select
                        value={formData.visitors}
                        onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3-5">Small Delegation (3-5)</option>
                        <option value="6+">Academic Group (6+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                        Primary Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      >
                        <option value="Open Amphitheatre Performance">Open Amphitheatre Performance</option>
                        <option value="Dawn Riyaaz & Vocal Training">Dawn Riyaaz & Vocal Training</option>
                        <option value="Mask & Puppetry Guilds">Mask & Puppetry Guilds</option>
                        <option value="Archival Library Research">Archival Library Research</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-2 mt-4 hover:scale-102"
                  >
                    <Send className="w-4 h-4" />
                    Request Campus Immersion Pass
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
