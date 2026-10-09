import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useDatabase } from '../context/DatabaseContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Compass, Shield } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'Campus Immersion Visit',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSent(true);
  };

  return (
    <PageTransition>
      {/* Top Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            Sacred Geography & Inquiries
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            Visit the Himalayan Foothills Sanctum
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            Rang Gurukul welcomes rasikas, scholars, and apprentices to its stone courtyards,
            open-air amphitheatre, and living heritage archive.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Campus Info & Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="theatre-card p-8 rounded-2xl border border-[#332f2a] space-y-6">
              <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                Sansthan Secretariat
              </h3>

              <div className="space-y-4 text-xs text-[#d8d0c5]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#faf7f2]">Sanctum Campus Location</span>
                    <span>{siteSettings.addressLine1}</span>
                    <span className="block">{siteSettings.addressLine2}</span>
                    <span className="block text-[#9e968b]">{siteSettings.city}, {siteSettings.state} — {siteSettings.pincode}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#faf7f2]">Institutional Helpline</span>
                    <span>{siteSettings.contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#faf7f2]">Official WhatsApp Desk</span>
                    <span>{siteSettings.whatsappNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#faf7f2]">Inquiries & Correspondence</span>
                    <span>{siteSettings.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#c85a32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#faf7f2]">Visiting Protocol Hours</span>
                    <span>Tuesdays – Sundays: 09:30 AM – 05:30 PM IST</span>
                    <span className="block text-[#9e968b]">Prior appointment strictly requested</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Norms Box */}
            <div className="p-6 rounded-2xl bg-[#1a1816] border border-[#2b2723] space-y-2 text-xs text-[#9e968b]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37] block font-semibold">
                Sanctum Code of Conduct
              </span>
              <p>• Mobile phones placed on silent mode inside riyaaz pavilions.</p>
              <p>• Modest Indian attire (cotton kurta, saree, or loose trousers) honored.</p>
              <p>• Sattvic vegetarian cuisine prepared using campus organic harvests.</p>
            </div>
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="theatre-card p-8 sm:p-10 rounded-2xl border border-[#d4af37]/30">
              {sent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    Inquiry Received with Reverence
                  </h3>
                  <p className="text-xs text-[#9e968b] max-w-md mx-auto">
                    Thank you, {formData.name}. The Sansthan secretariat will respond to your communication within 24 to 48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: '', email: '', phone: '', purpose: 'Campus Immersion Visit', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#282522] text-[#d4af37] text-xs uppercase font-semibold tracking-wider hover:bg-[#d4af37] hover:text-[#121110] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#c85a32] font-semibold block mb-1">
                      Direct Correspondence
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                      Send an Inquiry
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Raghavan Nair"
                      className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98000 00000"
                        className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                      Nature of Inquiry
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="Campus Immersion Visit">Campus Immersion & Retreat Visit</option>
                      <option value="Internship / Audition Query">Internship / Auditions Query</option>
                      <option value="Paid Workshop Registration">Paid Workshop / Masterclass Query</option>
                      <option value="World Tour Repertoire Booking">World Tour Repertoire / Corporate Passes</option>
                      <option value="Patronage & Living Heritage Donation">Patronage & Living Heritage Donation</option>
                      <option value="Press & Media Accreditation">Press & Media Accreditation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                      Your Message or Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your questions or preferred visiting dates..."
                      className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-xs uppercase tracking-wider text-[#121110] bg-[#d4af37] hover:bg-[#fae69e] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4 text-[#121110]" />
                    <span>Send Inquiry to Gurukul Secretariat</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
