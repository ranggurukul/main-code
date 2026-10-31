import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';
import { DISCIPLINES_DATA, type Discipline } from '../data/rangData';
import { useDatabase } from '../context/DatabaseContext';

interface DisciplinesSectionProps {
  onOpenApply: (programTitle?: string) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ onOpenApply }) => {
  const { disciplines } = useDatabase();
  const activeDisciplines = disciplines && disciplines.length > 0 ? disciplines : DISCIPLINES_DATA;
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(activeDisciplines[0]);

  useEffect(() => {
    if (activeDisciplines.length > 0) {
      const stillExists = activeDisciplines.find((d) => d.id === selectedDiscipline?.id);
      setSelectedDiscipline(stillExists || activeDisciplines[0]);
    }
  }, [activeDisciplines]);

  return (
    <section id="disciplines" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#141210] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5" />
            Curriculum of the Sansthan
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
            Disciplines of <span className="italic font-display text-[#d4af37]">Expression</span>
          </h2>
          <p className="mt-4 text-[#d8d0c5] text-base sm:text-lg font-light leading-relaxed font-sans-clean">
            Six foundational pillars spanning physical dramaturgy, sacred acoustics, and ancient material crafts. Each discipline is taught through intensive immersion under renowned national masters.
          </p>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-12">
          {activeDisciplines.map((item) => {
            const isSelected = selectedDiscipline.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDiscipline(item)}
                className={`p-3.5 rounded-xl text-left transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#d4af37] bg-[#221f1b] shadow-md shadow-[#d4af37]/10'
                    : 'border-[#332f2a] bg-[#181614]/70 hover:border-[#524b43] text-[#9e968b]'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${isSelected ? 'text-[#c85a32]' : 'text-[#6b635b]'}`}>
                  {item.sanskritTitle}
                </span>
                <span className={`font-editorial text-xs sm:text-sm font-semibold mt-1 line-clamp-2 ${isSelected ? 'text-[#faf7f2]' : 'text-[#9e968b]'}`}>
                  {item.title.split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Discipline Display Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDiscipline.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="theatre-card rounded-2xl overflow-hidden border border-[#d4af37]/25 shadow-2xl grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Visual Column */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[500px]">
              <img
                src={selectedDiscipline.image}
                alt={selectedDiscipline.title}
                className="w-full h-full object-cover filter brightness-85 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1a1816]" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#121110]/85 backdrop-blur-md border border-[#332f2a]">
                <blockquote className="font-display italic text-sm text-[#faf7f2] leading-snug">
                  "{selectedDiscipline.quote}"
                </blockquote>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#c85a32] font-semibold mb-2">
                  <span>{selectedDiscipline.sanskritTitle}</span>
                  <span>•</span>
                  <span>{selectedDiscipline.duration}</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-[#faf7f2] mb-3">
                  {selectedDiscipline.title}
                </h3>

                <p className="text-sm sm:text-base text-[#d4af37] font-medium mb-4">
                  {selectedDiscipline.tagline}
                </p>

                <p className="text-sm text-[#d8d0c5] leading-relaxed mb-6 font-sans-clean">
                  {selectedDiscipline.description}
                </p>

                {/* Key Practices */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#9e968b] font-semibold block">
                    Core Curriculum Practices
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDiscipline.keyPractices.map((practice, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-[#141210]/60 p-2.5 rounded-lg border border-[#2b2723]">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#d8d0c5] leading-snug">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Meta & CTA */}
              <div className="pt-6 border-t border-[#332f2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-5 text-xs text-[#9e968b]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span>Lead: <strong className="text-[#faf7f2]">{selectedDiscipline.facultyLead}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#c85a32]" />
                    <span>Cohort Intake</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenApply(selectedDiscipline.title)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20"
                >
                  Apply For Apprenticeship
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
