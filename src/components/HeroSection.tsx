import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight, Flame, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TheatreStageCanvas } from './TheatreStageCanvas';
import { INSTITUTIONAL_FACTS } from '../data/rangData';
import { useDatabase } from '../context/DatabaseContext';

interface HeroSectionProps {
  onOpenBooking?: () => void;
  onOpenFilm?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onOpenFilm }) => {
  const { homepageConfig } = useDatabase();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-[#121110] overflow-hidden theatre-spotlight">
      {/* Three.js interactive 3D sacred stage mandala & particles */}
      {homepageConfig.threeStageEnabled && <TheatreStageCanvas />}

      {/* Top Tag & Season Pill */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#1e1b18]/85 backdrop-blur-md text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-ping" />
            Season 2026–2027 In Session
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#9e968b] tracking-widest uppercase">
            SANSTHAN FOR SACRED & LIVING PERFORMING ARTS
          </span>
        </motion.div>

        {/* Hero Editorial Headlines */}
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <span className="font-editorial text-xs sm:text-sm tracking-[0.35em] uppercase text-[#c85a32] font-semibold block mb-3">
              {homepageConfig.heroTitle} • रंग गुरुकुल
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#faf7f2] leading-[1.05] tracking-tight">
              Where Millennia of{' '}
              <span className="italic font-display text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c85a32]">
                Sacred Expression
              </span>{' '}
              Ignite Contemporary Stages.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-6 text-[#d8d0c5] text-base sm:text-xl font-light leading-relaxed max-w-3xl font-sans-clean"
          >
            {homepageConfig.heroQuote}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link
              to="/events"
              className="px-7 py-3.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#d4af37]/20 flex items-center gap-2.5 hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              {homepageConfig.heroPrimaryCtaText || 'Explore Productions'}
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              to="/membership"
              className="px-6 py-3.5 rounded-full border border-[#d4af37]/40 bg-[#1c1a17]/90 hover:bg-[#25221e] text-[#faf7f2] font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2.5 hover:border-[#d4af37]"
            >
              <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
              {homepageConfig.heroSecondaryCtaText || 'Join Internship'}
            </Link>

            {onOpenFilm && (
              <button
                type="button"
                onClick={onOpenFilm}
                className="text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 py-2"
              >
                <Play className="w-3 h-3 text-[#c85a32] fill-[#c85a32]" />
                The Gurukul Film
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Flagship Imagery Preview Strip from dynamic config */}
      <div className="max-w-7xl mx-auto w-full relative z-10 mt-12 mb-6">
        <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-2xl group">
          <img
            src={homepageConfig.heroImage}
            alt="Rang Gurukul Contemporary Theatre Staging"
            className="w-full h-48 sm:h-72 md:h-84 object-cover object-center filter brightness-90 contrast-105 group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-[#121110]/40" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
            <div className="bg-[#121110]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#332f2a] max-w-lg">
              <span className="text-[#d4af37] font-semibold uppercase tracking-widest block text-[10px]">
                Current Staging • Production of the Year
              </span>
              <p className="text-[#faf7f2] font-editorial text-base sm:text-lg">
                The Celestial Loom (Vichitra) — Now Touring Kamani & Barbican
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-[#121110]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#332f2a] text-[#d8d0c5]">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>National Sangeet Natak Akademi Production Honor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Milestones Grid */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-4 border-t border-[#332f2a]/60">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {INSTITUTIONAL_FACTS.map((fact, idx) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 + idx * 0.08 }}
              className="flex flex-col"
            >
              <span className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#faf7f2]">
                {fact.value}
              </span>
              <span className="text-[11px] sm:text-xs text-[#9e968b] uppercase tracking-wider mt-1 font-medium">
                {fact.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
