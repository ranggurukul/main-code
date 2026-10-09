import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Ticket,
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { FilmModal } from '../components/FilmModal';
import { PageTransition } from '../components/PageTransition';
import { useDatabase } from '../context/DatabaseContext';
import { DISCIPLINES_DATA, PRODUCTIONS_DATA } from '../data/rangData';

export const HomePage: React.FC = () => {
  const { homepageConfig, workshops, membershipPlans, galleryPhotos } = useDatabase();
  const [isFilmOpen, setIsFilmOpen] = useState(false);

  return (
    <PageTransition>
      {/* 1. Hero Section */}
      <HeroSection onOpenFilm={() => setIsFilmOpen(true)} />

      {/* 2. Philosophy & About Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#161412] border-t border-[#2a2622] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl group">
              <img
                src={homepageConfig.aboutImage}
                alt="Living Gurukul Tradition"
                className="w-full h-80 sm:h-96 object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37] block">
                  Parampara • Lineage
                </span>
                <p className="font-editorial text-xl text-[#faf7f2] font-semibold mt-1">
                  The Ancient Guru-Shishya Sanctum
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c85a32]/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-2 font-mono">
              Rasavada & Living Heritage
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[#faf7f2] font-normal leading-tight">
              An Architectural Temple of <br />
              <span className="italic gold-gradient-text">Indian Dramatic Spirit</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-[#d8d0c5] leading-relaxed font-light">
              Rang Gurukul is not a mere theatre academy; it is an ashram of creative fire.
              Nestled at the Maldevta foothills near Dehradun, our disciples train from dawn
              to midnight in the sacred geometry of the Natyashastra, Kalaripayattu balance,
              and microtonal Dhrupad acoustic architecture.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="px-6 py-3 rounded-full bg-[#d4af37] text-[#121110] text-xs font-semibold uppercase tracking-widest hover:bg-[#fae69e] transition-all flex items-center gap-2"
              >
                <span>Discover Lineage & Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/disciplines"
                className="px-6 py-3 rounded-full border border-[#332f2a] text-[#faf7f2] text-xs font-medium uppercase tracking-widest hover:border-[#d4af37] transition-all"
              >
                Explore Disciplines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 6 Disciplines Showcase Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110] border-t border-[#2a2622]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                The Six Pillars of Expression
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#faf7f2] font-bold">
                Mastery of the Sacred Senses
              </h2>
            </div>
            <Link
              to="/disciplines"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>View All 6 Disciplines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DISCIPLINES_DATA.slice(0, 3).map((discipline) => (
              <div
                key={discipline.id}
                className="theatre-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#c85a32] block mb-2">
                    {discipline.sanskritTitle}
                  </span>
                  <h3 className="font-editorial text-xl text-[#faf7f2] font-bold group-hover:text-[#d4af37] transition-colors">
                    {discipline.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#9e968b] leading-relaxed line-clamp-3">
                    {discipline.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#332f2a] flex items-center justify-between text-xs">
                  <span className="text-[#9e968b]">{discipline.duration}</span>
                  <Link
                    to="/disciplines"
                    className="text-[#d4af37] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Current Repertoire & 2026-2027 Touring Stagings */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#1a1816] border-t border-[#2a2622]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-1">
                Staged Productions & World Calendar
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#faf7f2] font-bold">
                The Living Repertoire
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>Explore Tour Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PRODUCTIONS_DATA.slice(0, 2).map((prod) => (
              <div
                key={prod.id}
                className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col sm:flex-row group"
              >
                <div className="sm:w-5/12 relative overflow-hidden h-52 sm:h-auto">
                  <img
                    src={prod.bannerImage}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#121110]/85 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wider">
                    {prod.status}
                  </div>
                </div>
                <div className="sm:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9e968b] block mb-1">
                      Directed by {prod.director}
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors">
                      {prod.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#9e968b] line-clamp-3 leading-relaxed">
                      {prod.synopsis}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#332f2a] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#d4af37]">{prod.ticketPrice}</span>
                    <Link
                      to={`/events/${prod.id}`}
                      className="px-4 py-2 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Ticket className="w-3 h-3" />
                      <span>Details & Passes</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Paid Workshops Section Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110] border-t border-[#2a2622]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Guru-Shishya Masterclasses
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#faf7f2] font-bold">
                Upcoming Paid Workshops
              </h2>
              <p className="text-xs text-[#9e968b] mt-1 max-w-xl">
                Hands-on immersions led by living legends. Seats strictly limited to preserve individual guidance.
              </p>
            </div>
            <Link
              to="/workshops"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>Browse All Workshops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.slice(0, 3).map((ws) => (
              <div
                key={ws.id}
                className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ws.image}
                      alt={ws.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#121110]/90 border border-[#d4af37]/40 text-[#d4af37] font-mono text-[11px] font-bold">
                      ₹{ws.price.toLocaleString('en-IN')}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-[#c85a32]/90 text-white text-[10px] uppercase font-semibold">
                      {ws.availableSeats} Seats Left
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-[#9e968b] uppercase tracking-wider block mb-1">
                      Mentor: {ws.instructor}
                    </span>
                    <h3 className="font-editorial text-lg text-[#faf7f2] font-bold group-hover:text-[#d4af37] transition-colors leading-snug">
                      {ws.title}
                    </h3>
                    <div className="mt-3 space-y-1 text-[11px] text-[#9e968b]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#d4af37]" />
                        <span>{ws.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        <span>{ws.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link
                    to={`/workshops/${ws.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Paid Membership System Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-[#181614] to-[#121110] border-t border-[#2a2622] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
              Patronage & Living Kinship
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#faf7f2] font-bold">
              Join the Rang Gurukul Internship
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#9e968b] leading-relaxed">
              Direct WhatsApp connection, stage act participation privileges, priority masterclass booking,
              and private cultural retreats. Support living traditions while gaining inner sanctum access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between border transition-all duration-300 relative ${
                  plan.isPopular
                    ? 'bg-[#221f1b] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.15)] scale-[1.02]'
                    : 'bg-[#1a1816] border-[#332f2a] hover:border-[#d4af37]/60'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d4af37] text-[#121110] text-[10px] font-bold uppercase tracking-wider">
                    {plan.badge || 'Most Valued'}
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#c85a32] tracking-wider block mb-1">
                    {plan.duration}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#faf7f2]">
                    {plan.name}
                  </h3>
                  <div className="mt-4 pb-4 border-b border-[#332f2a]">
                    <span className="text-xs text-[#9e968b]">Contribution</span>
                    <div className="font-mono text-3xl font-bold text-[#d4af37]">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-[#9e968b] leading-relaxed">
                    {plan.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs">
                    {plan.benefits.slice(0, 4).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[#d8d0c5]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="text-[11px]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    to={`/membership/${plan.id}`}
                    className={`w-full py-3 px-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      plan.isPopular
                        ? 'bg-[#d4af37] text-[#121110] hover:bg-[#fae69e]'
                        : 'border border-[#d4af37]/40 bg-[#25221e] text-[#faf7f2] hover:bg-[#d4af37] hover:text-[#121110]'
                    }`}
                  >
                    <span>Choose {plan.duration}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/membership"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline inline-flex items-center gap-1.5 font-semibold"
            >
              <span>Compare All Internship Plans & Perks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Large Digital Art Archive Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110] border-t border-[#2a2622]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-1">
                Digital Art Archive & Living Museum
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#faf7f2] font-bold">
                Visual Chronicles of Rang Gurukul
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>Enter Full Gallery Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPhotos.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to="/gallery"
                className="group relative rounded-xl overflow-hidden border border-[#332f2a] aspect-square"
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                    {p.category}
                  </span>
                  <div className="text-xs font-editorial font-bold text-[#faf7f2] truncate">
                    {p.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Global Film Modal */}
      <FilmModal isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />
    </PageTransition>
  );
};
