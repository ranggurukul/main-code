import React, { useState } from 'react';
import { HeartHandshake, Check, Flame, Shield, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PatronageSection: React.FC = () => {
  const [pledgedTier, setPledgedTier] = useState<string | null>(null);

  const tiers = [
    {
      name: 'Mitra',
      sanskrit: 'मित्र',
      level: 'Friend of the Arts',
      amount: '₹12,000 / $150',
      period: 'Annual Endowment',
      benefits: [
        'Priority access to all premiering theatrical stagings',
        'Complimentary invitations to 2 Gurukul lecture-demonstrations',
        'Annual print monograph on endangered folk traditions',
        'Listing in printed season house programmes',
      ],
      highlight: false,
    },
    {
      name: 'Raja Ravi Varma Circle',
      sanskrit: 'संरक्षक मंडल',
      level: 'Distinguished Patron',
      amount: '₹60,000 / $750',
      period: 'Annual Endowment',
      benefits: [
        'All Mitra privileges plus 4 VIP Season Passes across India',
        'Access to closed-door technical dress rehearsals and director notes',
        'Invitation to the annual Summer Solstice Amphitheatre Gala',
        'Direct sponsorship of 1 rural folk apprentice internship',
        'Private archival tour of rare manuscripts and mask vaults',
      ],
      highlight: true,
    },
    {
      name: 'Sahridaya Benefactor',
      sanskrit: 'सहृदय परिषद',
      level: 'Founders Council',
      amount: '₹2,50,000 / $3,000',
      period: 'Lifetime Lineage Patron',
      benefits: [
        'All Distinguished Patron privileges in perpetuity',
        'Endowment naming rights for 1 residential artist studio',
        'Private bespoke theatrical salon hosted at your estate',
        'Permanent bronze crest inscription at the Great Amphitheatre',
        'Advisory invitation to the Annual Artistic Direction Conclave',
      ],
      highlight: false,
    },
  ];

  const handlePledge = (tierName: string) => {
    setPledgedTier(tierName);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#C85A32', '#FAF7F2'],
    });
  };

  return (
    <section id="patronage" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#121110] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Support Living Heritage
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
            Preserve the <span className="italic font-display text-[#d4af37]">Sacred Fire</span>
          </h2>
          <p className="mt-4 text-[#d8d0c5] text-base sm:text-lg font-light leading-relaxed font-sans-clean">
            Unlike commercial entertainment, sacred cultural preservation relies upon visionary patrons. 100% of contributions directly support rural folk apprentices, endangered craft guilds, and residential theatrical interns.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`theatre-card rounded-2xl p-8 flex flex-col justify-between relative ${
                tier.highlight
                  ? 'border-[#d4af37] shadow-xl shadow-[#d4af37]/15 bg-gradient-to-b from-[#24201c] to-[#1a1816]'
                  : 'border-[#332f2a] bg-[#181614]'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#121110] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                  Most Beloved Patron Tier
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-editorial text-2xl text-[#faf7f2] font-bold">
                    {tier.name}
                  </h3>
                  <span className="font-marcellus text-lg text-[#d4af37]">
                    {tier.sanskrit}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-4">
                  {tier.level}
                </span>

                <div className="mb-6 pb-6 border-b border-[#2b2723]">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-[#faf7f2]">
                    {tier.amount}
                  </span>
                  <span className="text-xs text-[#9e968b] block mt-0.5">
                    {tier.period} • Tax Deductible (Sec 80G / 501c3)
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[11px] uppercase tracking-widest text-[#9e968b] font-semibold block">
                    Patron Privileges
                  </span>
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#d8d0c5]">
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {pledgedTier === tier.name ? (
                  <div className="w-full py-3 rounded-full bg-[#201e1b] border border-[#d4af37] text-[#d4af37] text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                    <Flame className="w-4 h-4" />
                    Pledge Registered • Gratitude
                  </div>
                ) : (
                  <button
                    onClick={() => handlePledge(tier.name)}
                    className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md ${
                      tier.highlight
                        ? 'bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] shadow-[#d4af37]/20 hover:scale-102'
                        : 'border border-[#d4af37]/40 bg-[#221f1c] hover:bg-[#2c2824] text-[#faf7f2] hover:border-[#d4af37]'
                    }`}
                  >
                    Join {tier.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Assurance */}
        <div className="p-6 rounded-2xl border border-[#332f2a] bg-[#161412] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#9e968b]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#d4af37] shrink-0" />
            <span>
              Rang Gurukul Cultural Trust is a registered non-profit. All domestic contributions receive formal receipts with Section 80G tax benefits. Global donations facilitate FCRA accreditation.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#faf7f2] shrink-0">
            <Gift className="w-4 h-4 text-[#c85a32]" />
            <span>Corporate CSR Inquiries: <strong>patrons@ranggurukul.org</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
