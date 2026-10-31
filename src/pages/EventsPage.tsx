import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SeasonCalendar } from '../components/SeasonCalendar';
import { ReservationModal } from '../components/ReservationModal';
import { ProductionModal } from '../components/ProductionModal';
import { PRODUCTIONS_DATA, type Production } from '../data/rangData';
import { Ticket, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const EventsPage: React.FC = () => {
  const { events } = useDatabase();
  const activeEvents = events && events.length > 0 ? events : PRODUCTIONS_DATA;

  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProduction, setBookingProduction] = useState<string | undefined>(undefined);
  const [bookingCity, setBookingCity] = useState<string | undefined>(undefined);

  const handleOpenBooking = (productionTitle?: string, city?: string) => {
    setBookingProduction(productionTitle);
    setBookingCity(city);
    setIsBookingOpen(true);
  };

  return (
    <PageTransition>
      {/* Top Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            Season 2026–2027 Repertoire
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            Staged Productions & World Calendar
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            Monumental physical theatre, Sanskrit verse reclamation, Baul folk mysticism, and solo tragedies.
            Select a staging below for cast notes, accolades, and pass bookings.
          </p>
        </div>
      </section>

      {/* Productions Catalog */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeEvents.map((prod) => (
              <div
                key={prod.id}
                className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={prod.bannerImage}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#121110]/90 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                    {prod.status}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                      {prod.genre}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors">
                      {prod.title}
                    </h2>
                    <div className="text-xs text-[#c85a32] mt-1 font-medium">
                      {prod.subTitle}
                    </div>
                    <p className="mt-4 text-xs text-[#9e968b] leading-relaxed line-clamp-3">
                      {prod.synopsis}
                    </p>

                    <div className="mt-6 pt-4 border-t border-[#25221e] grid grid-cols-2 gap-2 text-xs text-[#9e968b]">
                      <div>
                        <span className="block text-[10px] uppercase text-[#6b635b]">Director</span>
                        <span className="text-[#d8d0c5] font-medium">{prod.director}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#6b635b]">Duration</span>
                        <span className="text-[#d8d0c5] font-medium">{prod.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-[#2a2622]">
                    <span className="text-xs font-mono text-[#d4af37]">{prod.ticketPrice}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/events/${prod.id}`}
                        className="px-4 py-2 rounded-xl bg-[#282522] hover:bg-[#332f2a] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        Read Dossier
                      </Link>
                      <button
                        onClick={() => handleOpenBooking(prod.title)}
                        className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Passes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Tour Calendar with City Filters */}
      <SeasonCalendar onOpenBooking={(title, city) => handleOpenBooking(title, city)} />

      {/* Modals */}
      <ProductionModal
        production={selectedProduction}
        onClose={() => setSelectedProduction(null)}
        onBookPasses={(title) => handleOpenBooking(title)}
      />

      <ReservationModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultProduction={bookingProduction}
        defaultCity={bookingCity}
      />
    </PageTransition>
  );
};
