import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { ReservationModal } from '../components/ReservationModal';
import { PRODUCTIONS_DATA, TOUR_DATES } from '../data/rangData';
import { ArrowLeft, Ticket, Calendar, Award, User, Clock, MapPin, Sparkles } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { events, tourDates } = useDatabase();
  const activeEvents = events && events.length > 0 ? events : PRODUCTIONS_DATA;
  const production = activeEvents.find((p) => p.id === id) || activeEvents[0];
  const allTours = tourDates && tourDates.length > 0 ? tourDates : TOUR_DATES;
  const prodTitle = (production.title || '').toLowerCase();
  const relatedTours = allTours.filter((t) => {
    const tProd = (t.production || '').toLowerCase();
    return (
      tProd.includes(prodTitle) ||
      prodTitle.includes(tProd) ||
      (prodTitle.split(' ')[0] && tProd.includes(prodTitle.split(' ')[0]))
    );
  });

  return (
    <PageTransition>
      {/* Top Breadcrumb & Hero */}
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-[#141210] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Productions</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#c85a32] text-xs font-semibold uppercase tracking-wider">
                  {production.status}
                </span>
                <span className="text-xs font-mono text-[#d4af37]">
                  {production.season}
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
                {production.title}
              </h1>

              <div className="text-base sm:text-lg text-[#d4af37] font-medium mt-2">
                {production.subTitle}
              </div>

              <p className="mt-6 text-sm text-[#d8d0c5] leading-relaxed max-w-2xl font-light">
                {production.synopsis}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-[#d4af37] text-[#121110] font-semibold text-xs sm:text-sm uppercase tracking-widest hover:bg-[#fae69e] transition-all flex items-center gap-2 shadow-xl shadow-[#d4af37]/20"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Reserve Passes ({production.ticketPrice})</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl">
                <img
                  src={production.bannerImage}
                  alt={production.title}
                  className="w-full h-80 sm:h-96 object-cover filter contrast-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Details & Cast */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Director's Note & Accolades */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
                Artistic Vision
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#faf7f2] font-bold">
                Director's Note
              </h2>
              <blockquote className="mt-4 p-6 rounded-2xl bg-[#1c1a17] border-l-4 border-[#d4af37] text-sm text-[#d8d0c5] italic leading-relaxed">
                "{production.directorNote}"
                <footer className="mt-3 text-xs not-italic text-[#d4af37] font-semibold">
                  — {production.director} (Director)
                </footer>
              </blockquote>
            </div>

            {/* Accolades */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-2 font-mono">
                Critical Acclaim
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#faf7f2] mb-4">
                Honors & Accolades
              </h3>
              <div className="space-y-3">
                {production.accolades.map((acc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#181614] border border-[#2e2a26] flex items-center gap-3 text-xs text-[#faf7f2]"
                  >
                    <Award className="w-5 h-5 text-[#d4af37] shrink-0" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Cast & Staging Meta */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1a1816] border border-[#332f2a]">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-4 font-mono">
                Dramatis Personae & Cast
              </span>
              <div className="space-y-4">
                {production.cast.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs pb-3 border-b border-[#2a2622]">
                    <span className="font-semibold text-[#faf7f2]">{c.role}</span>
                    <span className="text-[#9e968b]">{c.actor}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-[#332f2a] space-y-3 text-xs text-[#9e968b]">
                <div className="flex justify-between">
                  <span>Playwright:</span>
                  <span className="text-[#faf7f2]">{production.playwright}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-[#faf7f2]">{production.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premiere Venue:</span>
                  <span className="text-[#faf7f2]">{production.venue}</span>
                </div>
              </div>
            </div>

            {/* Tour Dates for this play */}
            {relatedTours.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#1a1816] border border-[#332f2a]">
                <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-4">
                  Upcoming Tour Stops
                </h4>
                <div className="space-y-3">
                  {relatedTours.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-[#201e1b] border border-[#2e2a25] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#faf7f2]">{t.city}, {t.country}</div>
                        <div className="text-[11px] text-[#9e968b]">{t.dates}</div>
                      </div>
                      <button
                        onClick={() => setIsBookingOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#121110] font-semibold text-[11px] uppercase tracking-wider"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ReservationModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultProduction={production.title}
      />
    </PageTransition>
  );
};
