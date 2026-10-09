import React, { useState } from 'react';
import { Flame, Compass, BookOpen, Layers, Quote, ShieldCheck } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const [activeAbhinaya, setActiveAbhinaya] = useState(0);

  const abhinayaPillars = [
    {
      title: 'Angika Abhinaya',
      sanskrit: 'आङ्गिक अभिनय',
      tag: 'Physical & Kinesthetic Expression',
      description: 'The geometry of the body in space. Articulation through spinal curvature, isolated eye saccades (Netra-bheda), precise foot stampings, and dynamic mudra syntax derived from Chhau, Kathakali, and Kalaripayattu.',
      essence: 'The flesh becomes an alphabet of sacred geometry.',
    },
    {
      title: 'Vachika Abhinaya',
      sanskrit: 'वाचिक अभिनय',
      tag: 'Vocal, Metrical & Poetic Delivery',
      description: 'The science of acoustic vibration. Training in Naad Yoga, Sanskrit metrical scansion (Chhandas), microtonal pitch control, diaphragmatic projection, and polyphonic speech in ancient and contemporary tongues.',
      essence: 'The breath transforms into resonant architectural sound.',
    },
    {
      title: 'Aharya Abhinaya',
      sanskrit: 'आहार्य अभिनय',
      tag: 'Costumery, Masks & Stage Scenography',
      description: 'The ceremonial alchemy of external transformation. Natural vegetable dyes, carved wooden face masks, terracotta adornments, bamboo scaffolding, and open-flame ambient stage lighting.',
      essence: 'The material world becomes a portal to mythological dimensions.',
    },
    {
      title: 'Sattvika Abhinaya',
      sanskrit: 'सात्त्विक अभिनय',
      tag: 'Pure Emotional & Inner State Inhabitation',
      description: 'The supreme pinnacle of Indian performance theory. The spontaneous, unforced physiological arousal of authentic emotion — goosebumps (Horripilation), tears, tremors, and sudden radiant stillness.',
      essence: 'The dissolution of the ego into pure luminous consciousness.',
    },
  ];

  return (
    <section id="philosophy" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#121110] relative overflow-hidden">
      {/* Subtle background ambient gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Subheader */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#332f2a] pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c85a32]/40 bg-[#1e1b18] text-[#c85a32] text-xs font-semibold uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5" />
              The Gurukul Ethos
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
              Tradition Meets <span className="italic font-display text-[#d4af37]">Vanguard</span>
            </h2>
          </div>
          <p className="max-w-md text-[#9e968b] text-sm leading-relaxed font-sans-clean">
            We reject the museumification of culture. At Rang Gurukul, heritage is not an artifact preserved in amber, but an untamed fire demanding constant reinvention.
          </p>
        </div>

        {/* The Triad: Rasa, Riti, Parampara */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Pillar 1 */}
          <div className="theatre-card rounded-2xl p-8 border border-[#332f2a] relative">
            <span className="font-marcellus text-5xl text-[#d4af37]/30 absolute top-6 right-6 select-none">
              रस
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#282522] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#faf7f2] font-bold tracking-wide">
              RASA • रस
            </h3>
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mt-1">
              Transcendent Aesthetic Essence
            </span>
            <p className="mt-4 text-sm text-[#d8d0c5] leading-relaxed">
              Every production is engineered to evoke a singular emotional awakening. The audience does not merely spectate; they are elevated into Sahridaya — sensitive souls who taste the cosmic unity behind transient passions.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="theatre-card rounded-2xl p-8 border border-[#332f2a] relative">
            <span className="font-marcellus text-5xl text-[#c85a32]/30 absolute top-6 right-6 select-none">
              रीति
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#282522] border border-[#c85a32]/30 flex items-center justify-center text-[#c85a32] mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#faf7f2] font-bold tracking-wide">
              RITI • रीति
            </h3>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mt-1">
              Rigorous Architectural Method
            </span>
            <p className="mt-4 text-sm text-[#d8d0c5] leading-relaxed">
              Freedom without discipline is chaos. Our artists undergo exhaustive conditioning in breath retention, Chhau martial balances, meter recitation, and the spatial mathematics of ancient Sanskrit amphitheaters.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="theatre-card rounded-2xl p-8 border border-[#332f2a] relative">
            <span className="font-marcellus text-5xl text-[#d4af37]/30 absolute top-6 right-6 select-none">
              परम्परा
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#282522] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#faf7f2] font-bold tracking-wide">
              PARAMPARA • परम्परा
            </h3>
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mt-1">
              Living Guru-Shishya Transmission
            </span>
            <p className="mt-4 text-sm text-[#d8d0c5] leading-relaxed">
              True artistry cannot be consumed through screens or mass curriculums. It flows through years of intimate apprenticeship — living alongside masters in forest studios, absorbing nuances of touch, cadence, and moral grace.
            </p>
          </div>
        </div>

        {/* Natyashastra Master Verse Callout */}
        <div className="relative rounded-2xl p-8 sm:p-12 border border-[#d4af37]/30 bg-gradient-to-r from-[#1c1a17] via-[#24201c] to-[#1c1a17] shadow-2xl mb-20">
          <Quote className="w-10 h-10 text-[#d4af37]/40 mb-4" />
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#faf7f2] italic font-light leading-relaxed max-w-4xl">
            "यतो हस्तस्ततो दृष्टिर्यतो दृष्टिस्ततो मनः।<br />
            यतो मनस्ततो भावो यतो भावस्ततो रसः॥"
          </blockquote>
          <p className="mt-6 text-sm text-[#d8d0c5] max-w-3xl leading-relaxed">
            <strong className="text-[#d4af37]">Nandikeshvara’s Abhinaya Darpana:</strong> Where the hand moves, the glance follows; where the glance goes, the mind awakens; where the mind focuses, deep authentic emotion is born; and where emotion blooms, aesthetic nectar (Rasa) arises.
          </p>
        </div>

        {/* The Fourfold Abhinaya Interactive Matrix */}
        <div>
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-2">
              The Four Dimensions of Performance
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-[#faf7f2]">
              The Fourfold <span className="italic text-[#d4af37]">Abhinaya</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {abhinayaPillars.map((pillar, index) => {
              const isSelected = activeAbhinaya === index;
              return (
                <div
                  key={pillar.title}
                  onClick={() => setActiveAbhinaya(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#221f1b] shadow-lg shadow-[#d4af37]/10'
                      : 'border-[#332f2a] bg-[#181614]/60 hover:border-[#524b43]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-marcellus text-sm text-[#d4af37]">
                      0{index + 1}
                    </span>
                    <ShieldCheck className={`w-4 h-4 ${isSelected ? 'text-[#d4af37]' : 'text-[#524b43]'}`} />
                  </div>
                  <h4 className="font-editorial text-lg text-[#faf7f2] font-bold">
                    {pillar.title}
                  </h4>
                  <span className="text-xs text-[#c85a32] font-marcellus block mt-0.5">
                    {pillar.sanskrit}
                  </span>
                  <p className="mt-3 text-xs text-[#9e968b] leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#332f2a] text-[11px] italic text-[#d4af37]">
                    "{pillar.essence}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
