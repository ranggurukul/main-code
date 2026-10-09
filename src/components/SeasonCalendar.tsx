import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, AlertCircle } from 'lucide-react';
import { TOUR_DATES, type TourDate } from '../data/rangData';
import { useDatabase } from '../context/DatabaseContext';

interface SeasonCalendarProps {
  onOpenBooking: (productionTitle?: string, city?: string) => void;
}

export const SeasonCalendar: React.FC<SeasonCalendarProps> = ({ onOpenBooking }) => {
  const { tourDates, siteSettings } = useDatabase();
  const allTours = tourDates && tourDates.length > 0 ? tourDates : TOUR_DATES;

  const [selectedCity, setSelectedCity] = useState<string>('All');

  const configuredCities = Array.isArray(siteSettings.reservationCities) && siteSettings.reservationCities.length > 0
    ? siteSettings.reservationCities
    : ['New Delhi', 'Mumbai', 'London', 'Bengaluru', 'Varanasi'];

  const cities = ['All', ...configuredCities];

  const filteredDates = selectedCity === 'All'
    ? allTours
    : allTours.filter((t) => t.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <section id="calendar" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#141210] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Season 2026–2027 Tour
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
              Tour <span className="italic font-display text-[#d4af37]">Schedule</span>
            </h2>
          </div>

          {/* City Filters */}
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                  selectedCity === city
                    ? 'border-[#d4af37] bg-[#221f1b] text-[#faf7f2] shadow-sm shadow-[#d4af37]/20'
                    : 'border-[#332f2a] bg-[#181614]/70 text-[#9e968b] hover:text-[#faf7f2] hover:border-[#524b43]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredDates.map((tour: TourDate) => (
            <div
              key={tour.id}
              className="theatre-card rounded-2xl p-5 sm:p-6 lg:p-7 border border-[#332f2a] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#d4af37]/40 transition-all duration-300"
            >
              {/* City and Production */}
              <div className="lg:w-2/5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#c85a32] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tour.city}, {tour.country}</span>
                </div>
                <h3 className="font-display text-2xl text-[#faf7f2] font-semibold">
                  {tour.production}
                </h3>
                <p className="text-xs text-[#9e968b] mt-1">
                  {tour.hall}
                </p>
              </div>

              {/* Dates & Time */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 lg:w-1/3">
                <div className="bg-[#121110] p-3 rounded-xl border border-[#2b2723] min-w-[150px]">
                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Dates</span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#faf7f2] font-medium block">
                    {tour.dates}
                  </span>
                </div>

                <div className="bg-[#121110] p-3 rounded-xl border border-[#2b2723] min-w-[120px]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9e968b] font-semibold uppercase tracking-wider mb-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Curtain</span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#faf7f2] font-medium block">
                    {tour.time}
                  </span>
                </div>
              </div>

              {/* Pricing & Reservation CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#2b2723]">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] text-[#9e968b] uppercase tracking-wider block">
                    Tariff: {tour.priceRange}
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#c85a32]" />
                    <span>{tour.status} • {tour.availableTickets} Seats Remaining</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(tour.production, tour.city)}
                  className="px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20 flex items-center gap-2 hover:scale-105"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Book Passes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
