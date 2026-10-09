import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { PhilosophySection } from '../components/PhilosophySection';
import { NavarasaExplorer } from '../components/NavarasaExplorer';
import { CampusVisit } from '../components/CampusVisit';
import { PatronageSection } from '../components/PatronageSection';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Editorial Header Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723] relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#d4af37] font-semibold block mb-3">
              About Rang Gurukul Sansthan
            </span>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[#faf7f2] leading-[1.08]">
              Preserving Sacred Lineage,{' '}
              <span className="italic gold-gradient-text">Forging Vanguard Theatre.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#d8d0c5] font-light leading-relaxed">
              Founded over three decades ago on the banks of the Song River, Rang Gurukul stands
              as a sanctuary where ancient dramaturgy, sacred martial movement, and contemporary
              theatrical innovations coalesce into living fire.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <PhilosophySection />

      {/* Navarasa Explorer Interactive Feature */}
      <NavarasaExplorer />

      {/* Gurukul Campus Sanctum */}
      <CampusVisit />

      {/* Patrons Circle */}
      <PatronageSection />
    </PageTransition>
  );
};
