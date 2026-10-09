import React from 'react';
import { GraduationCap, Calendar, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { ACADEMY_PROGRAMS } from '../data/rangData';
import type { AcademyProgram } from '../types/database';
import { useDatabase } from '../context/DatabaseContext';

interface AcademySectionProps {
  onOpenApply: (programTitle?: string) => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ onOpenApply }) => {
  const { programs } = useDatabase();
  const activePrograms = (programs && programs.length > 0 ? programs : ACADEMY_PROGRAMS) as AcademyProgram[];

  return (
    <section id="academies" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#161412] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Admissions & Internships 2026–2027
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
            The Gurukul <span className="italic font-display text-[#d4af37]">Academies</span>
          </h2>
          <p className="mt-4 text-[#d8d0c5] text-base sm:text-lg font-light leading-relaxed font-sans-clean">
            Immersive residential apprenticeships nestled in the Himalayan foothills. We select a strictly limited cohort of dedicated practitioners who reside, eat, practice, and create alongside legendary living masters.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activePrograms.map((program) => (
            <div
              key={program.id}
              className="theatre-card rounded-2xl p-6 sm:p-8 border border-[#332f2a] flex flex-col justify-between"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[11px] uppercase tracking-widest text-[#c85a32] font-semibold bg-[#25201c] px-3 py-1 rounded-full border border-[#3d332a]">
                    {program.category}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                    program.status === 'Applications Open'
                      ? 'border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/10'
                      : 'border-[#9e968b]/30 text-[#9e968b] bg-[#1e1b18]'
                  }`}>
                    {program.status}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-marcellus text-[#d4af37] block">
                    {program.sanskritName}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#faf7f2] font-semibold mt-1">
                    {program.title}
                  </h3>
                </div>

                {/* Key Meta details */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-[#2b2723] text-xs text-[#d8d0c5] mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#c85a32]" />
                    <span>{program.intake}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="truncate">{program.location || 'Rang Gurukul Sanctum Campus'}</span>
                  </div>
                </div>

                {/* Curriculum Bullet Points */}
                {program.curriculum && program.curriculum.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] uppercase tracking-widest text-[#9e968b] font-semibold block">
                      Syllabus Highlights
                    </span>
                    {program.curriculum.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#d8d0c5]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-[#121110]/80 p-3 rounded-xl border border-[#2b2723] text-xs text-[#9e968b] mb-6">
                  <strong className="text-[#faf7f2]">Mentor Lead:</strong> {program.mentor}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-[#332f2a] flex items-center justify-between">
                <span className="text-[11px] text-[#9e968b]">
                  {program.prerequisites
                    ? program.prerequisites.length > 40
                      ? `${program.prerequisites.substring(0, 40)}...`
                      : program.prerequisites
                    : 'Audition and interview mandatory.'}
                </span>

                <button
                  onClick={() => onOpenApply(program.title)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20"
                >
                  Apply For Cohort
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
