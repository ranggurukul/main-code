import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Hand, Compass, Volume2, ShieldAlert, Flame } from 'lucide-react';
import { NAVARASA_DATA, type Rasa } from '../data/rangData';
import { audioEngine } from '../utils/audioEngine';

export const NavarasaExplorer: React.FC = () => {
  const [selectedRasa, setSelectedRasa] = useState<Rasa>(NAVARASA_DATA[0]);

  const handleSelectRasa = (rasa: Rasa) => {
    setSelectedRasa(rasa);
    audioEngine.playRasaHarmonic(rasa.chords);
  };

  return (
    <section id="navarasa" className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#161412] overflow-hidden border-t border-[#332f2a]">
      {/* Dynamic Ambient Background Glow reflecting selected Rasa */}
      <motion.div
        key={selectedRasa.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8 }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: selectedRasa.hex }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b]/80 backdrop-blur-md text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-4">
            <Flame className="w-3.5 h-3.5" />
            The Nine Archetypal Essences
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
            The Sanctum of <span className="italic font-display text-[#d4af37]">Navarasa</span>
          </h2>
          <p className="mt-4 text-[#d8d0c5] text-base sm:text-lg font-light leading-relaxed font-sans-clean">
            In Bharata Muni’s <span className="text-[#faf7f2] italic">Natyashastra</span>, performance is not an imitation of life, but the alchemy of transforming raw human emotion (Bhava) into transcendent aesthetic delight (Rasa). Select an essence to witness its theatrical staging, mudra, and harmonic chord.
          </p>
        </div>

        {/* Rasa Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {NAVARASA_DATA.map((rasa) => {
            const isSelected = selectedRasa.id === rasa.id;
            return (
              <button
                key={rasa.id}
                onClick={() => handleSelectRasa(rasa)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? 'border-[#d4af37] bg-[#2a2622] text-[#faf7f2] shadow-lg shadow-[#d4af37]/10'
                    : 'border-[#332f2a] bg-[#181614]/70 text-[#9e968b] hover:text-[#faf7f2] hover:border-[#524b43]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeRasaIndicator"
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: rasa.hex }}
                  />
                )}
                <span className="font-editorial tracking-wider">{rasa.name}</span>
                <span className="text-xs opacity-60 font-marcellus">({rasa.sanskrit})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Rasa Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRasa.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            className="theatre-card rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-xl border border-[#d4af37]/20 shadow-2xl"
          >
            {/* Top Bar with Devanagari Glyph & Sound Trigger */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#332f2a]">
              <div>
                <div className="flex items-baseline gap-4">
                  <h3 className="font-display text-4xl sm:text-5xl text-[#faf7f2]">
                    {selectedRasa.name}
                  </h3>
                  <span className="font-marcellus text-3xl sm:text-4xl text-[#d4af37]">
                    {selectedRasa.sanskrit}
                  </span>
                </div>
                <p className="mt-1 text-[#c85a32] text-sm uppercase tracking-widest font-semibold">
                  {selectedRasa.emotion}
                </p>
              </div>

              {/* Acoustic Chord Trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => audioEngine.playRasaHarmonic(selectedRasa.chords)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#282522] hover:bg-[#34302c] text-[#faf7f2] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:border-[#d4af37]"
                >
                  <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
                  Trigger Acoustic Harmonic
                </button>
              </div>
            </div>

            {/* Grid of Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-[#332f2a]">
              {/* Pillar 1: Philosophical Core */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9e968b]">
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  Cosmic Archetype & Deity
                </div>
                <div className="bg-[#181614]/80 p-4 rounded-xl border border-[#2b2723]">
                  <div className="text-sm font-semibold text-[#faf7f2]">{selectedRasa.archetype}</div>
                  <div className="text-xs text-[#9e968b] mt-1">Presiding Divinity: {selectedRasa.deity}</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#d8d0c5]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedRasa.hex }}></span>
                    Color: {selectedRasa.colorName}
                  </div>
                </div>
              </div>

              {/* Pillar 2: Raga & Soundscape */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9e968b]">
                  <Music className="w-4 h-4 text-[#c85a32]" />
                  Musical Resonance & Raga
                </div>
                <div className="bg-[#181614]/80 p-4 rounded-xl border border-[#2b2723]">
                  <div className="text-sm font-semibold text-[#faf7f2]">{selectedRasa.raga}</div>
                  <div className="text-xs text-[#9e968b] mt-1">
                    Evokes deep psychological frequencies through harmonic microtones (shrutis).
                  </div>
                </div>
              </div>

              {/* Pillar 3: Mudra & Gestural Sign */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9e968b]">
                  <Hand className="w-4 h-4 text-[#d4af37]" />
                  Hastha Mudra
                </div>
                <div className="bg-[#181614]/80 p-4 rounded-xl border border-[#2b2723]">
                  <div className="text-sm font-semibold text-[#faf7f2]">{selectedRasa.mudra}</div>
                  <div className="text-xs text-[#9e968b] mt-1">
                    Prescribed hand configuration to channel the energetic focus of this emotion.
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Staging Manifestation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 items-start">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d4af37] mb-2">
                  Theatrical Manifestation
                </h4>
                <p className="text-sm text-[#d8d0c5] leading-relaxed">
                  {selectedRasa.theatricalManifestation}
                </p>
                <p className="mt-4 text-sm text-[#9e968b] leading-relaxed">
                  {selectedRasa.description}
                </p>
              </div>

              <div className="bg-[#181614]/90 rounded-xl p-5 border border-[#332f2a] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d4af37] mb-2 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Natyashastra Inscription
                  </div>
                  <blockquote className="font-marcellus text-base text-[#faf7f2] italic leading-relaxed">
                    "{selectedRasa.natyashastraExcerpt}"
                  </blockquote>
                </div>
                <div className="mt-4 pt-3 border-t border-[#2b2723] text-right">
                  <span className="text-xs text-[#9e968b] font-mono">Chapter VI: Rasa-Vikalpa • Natyashastra</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
