import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Calendar, MapPin, Award, ArrowUpRight, Clock } from 'lucide-react';
import { PRODUCTIONS_DATA, type Production } from '../data/rangData';

interface RepertoireSectionProps {
  onSelectProduction: (production: Production) => void;
  onOpenBooking: (productionTitle?: string) => void;
}

export const RepertoireSection: React.FC<RepertoireSectionProps> = ({
  onSelectProduction,
  onOpenBooking,
}) => {
  const [filter, setFilter] = useState<'All' | 'Now Touring' | 'Upcoming Premiere' | 'Archival Vault'>('All');

  const filteredProductions = filter === 'All'
    ? PRODUCTIONS_DATA
    : PRODUCTIONS_DATA.filter((p) => p.status === filter);

  return (
    <section id="repertoire" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#121110] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
              <Film className="w-3.5 h-3.5" />
              Theatrical Canon
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
              Repertoire & <span className="italic font-display text-[#d4af37]">Stagings</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Now Touring', 'Upcoming Premiere', 'Archival Vault'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                  filter === tab
                    ? 'border-[#d4af37] bg-[#221f1b] text-[#faf7f2] shadow-sm shadow-[#d4af37]/20'
                    : 'border-[#332f2a] bg-[#181614]/70 text-[#9e968b] hover:text-[#faf7f2] hover:border-[#524b43]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProductions.map((production) => (
            <motion.div
              key={production.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group"
            >
              {/* Media Header */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={production.bannerImage}
                  alt={production.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-black/40" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: `${production.statusColor}25`,
                      color: production.statusColor,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: production.statusColor }} />
                    {production.status}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-[#121110]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-[#d8d0c5] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#d4af37]" />
                  {production.duration}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                    {production.genre}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#faf7f2] font-semibold drop-shadow-md">
                    {production.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <p className="text-xs text-[#c85a32] uppercase tracking-wider font-semibold mb-2">
                    {production.subTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#d8d0c5] leading-relaxed line-clamp-3 mb-6">
                    {production.synopsis}
                  </p>

                  <div className="space-y-2 border-t border-[#2b2723] pt-4 text-xs text-[#9e968b]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="text-[#faf7f2] font-medium">{production.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#c85a32]" />
                      <span>{production.dates}</span>
                    </div>
                    {production.accolades[0] && (
                      <div className="flex items-center gap-2 text-[#d4af37] pt-1">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate italic">{production.accolades[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-[#332f2a] flex items-center justify-between gap-4">
                  <button
                    onClick={() => onSelectProduction(production)}
                    className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-[#fae69e] font-semibold flex items-center gap-1 transition-colors"
                  >
                    View Production Dossier
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenBooking(production.title)}
                    className="px-4 py-2 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20"
                  >
                    Reserve Passes
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
