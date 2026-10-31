import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Ticket, QrCode, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCTIONS_DATA } from '../data/rangData';
import { useDatabase } from '../context/DatabaseContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduction?: string;
  defaultCity?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  defaultProduction,
  defaultCity,
}) => {
  const { events, siteSettings } = useDatabase();
  const availableProductions = events && events.length > 0 ? events : PRODUCTIONS_DATA;

  const defaultCities = [
    'New Delhi',
    'Mumbai',
    'London',
    'Bengaluru',
    'Varanasi',
    'Dehradun',
  ];

  const defaultTiersMap: { [key: string]: number } = {
    'Student / Artist Concession': 450,
    'Amphitheatre Earthen Tier': 850,
    'Grand Circle Stalls': 1600,
    'Royal Patron Box': 3200,
  };

  const citiesList = Array.isArray(siteSettings.reservationCities) && siteSettings.reservationCities.length > 0
    ? siteSettings.reservationCities
    : defaultCities;

  const tiersMap: { [key: string]: number } =
    Array.isArray(siteSettings.reservationTiers) && siteSettings.reservationTiers.length > 0
      ? siteSettings.reservationTiers.reduce((acc, t) => ({ ...acc, [t.name]: t.price }), {})
      : defaultTiersMap;

  const tierNames = Object.keys(tiersMap);

  const [production, setProduction] = useState(defaultProduction || availableProductions[0]?.title || '');
  const [city, setCity] = useState(defaultCity || citiesList[0] || 'New Delhi');
  const [tier, setTier] = useState(tierNames[tierNames.length - 1] || 'Royal Patron Box');
  const [ticketCount, setTicketCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  // Synchronize on default changes
  React.useEffect(() => {
    if (defaultProduction) {
      setProduction(defaultProduction);
    } else if (availableProductions.length > 0 && !availableProductions.some((p) => p.title === production)) {
      setProduction(availableProductions[0].title);
    }
  }, [defaultProduction, availableProductions]);

  React.useEffect(() => {
    if (defaultCity) {
      setCity(defaultCity);
    } else if (citiesList.length > 0 && !citiesList.includes(city)) {
      setCity(citiesList[0]);
    }
  }, [defaultCity, citiesList]);

  React.useEffect(() => {
    if (tierNames.length > 0 && !tiersMap[tier]) {
      setTier(tierNames[0]);
    }
  }, [tiersMap]);

  if (!isOpen) return null;

  const totalPrice = (tiersMap[tier] || 1200) * ticketCount;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `RG-${Math.floor(1000 + Math.random() * 9000)}-${city.substring(0, 3).toUpperCase()}`;
    setConfirmationCode(code);
    setIsSuccess(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#C85A32', '#FAF7F2', '#6D1A24'],
    });
  };

  const resetForm = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="theatre-card rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#d4af37]/40 p-6 sm:p-10 relative bg-[#181614] my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#201e1b] hover:bg-[#2b2723] text-[#faf7f2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Confirmation Pass Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
              <Flame className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Pass Reservation Confirmed
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-[#faf7f2] font-semibold">
                Welcome to the Sanctum
              </h3>
              <p className="text-xs text-[#9e968b] mt-1 max-w-md mx-auto">
                A digital pass and entrance instructions have been dispatched to <strong>{guestEmail}</strong>.
              </p>
            </div>

            {/* Bespoke Digital Pass Mockup */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#201d19] to-[#26221d] border border-[#d4af37]/50 text-left relative overflow-hidden shadow-2xl max-w-md mx-auto">
              <div className="flex justify-between items-start border-b border-[#332f2a] pb-4 mb-4">
                <div>
                  <span className="font-editorial text-xs text-[#d4af37] uppercase tracking-widest font-bold block">
                    RANG GURUKUL • OFFICIAL PASS
                  </span>
                  <h4 className="font-display text-xl text-[#faf7f2] font-semibold mt-1">
                    {production}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#9e968b] uppercase tracking-wider block">Reference</span>
                  <span className="font-mono text-sm text-[#d4af37] font-bold">{confirmationCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-[#9e968b] uppercase block">Guest</span>
                  <span className="text-[#faf7f2] font-medium">{guestName || 'Patron of the Arts'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9e968b] uppercase block">Tier</span>
                  <span className="text-[#d4af37] font-medium">{tier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9e968b] uppercase block">City & Venue</span>
                  <span className="text-[#faf7f2] font-medium">{city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9e968b] uppercase block">Passes</span>
                  <span className="text-[#faf7f2] font-medium">{ticketCount} Seats (₹{totalPrice.toLocaleString()})</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#332f2a] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#9e968b]">
                  <QrCode className="w-8 h-8 text-[#d4af37]" />
                  <span>Scan upon entry at Rang Gurukul box office</span>
                </div>
                <span className="text-[10px] font-mono text-[#c85a32] uppercase">Doors: 30m prior</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="px-8 py-3 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20"
            >
              Close & Return to Season
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Official Season Reservation
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#faf7f2] font-semibold">
                Reserve Season Passes
              </h2>
              <p className="text-xs text-[#9e968b] mt-1">
                Select your preferred production, city, and seating tier. Passes are strictly allocated on a first-confirmed basis.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Production select */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                  Selected Production
                </label>
                <select
                  value={production}
                  onChange={(e) => setProduction(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  {availableProductions.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* City and Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Performance City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Seating Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    {tierNames.map((t) => (
                      <option key={t} value={t}>
                        {t} — ₹{(tiersMap[t] || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ticket count */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                  Passes Count
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setTicketCount(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        ticketCount === num
                          ? 'border-[#d4af37] bg-[#d4af37] text-[#121110]'
                          : 'border-[#332f2a] bg-[#121110] text-[#faf7f2] hover:border-[#524b43]'
                      }`}
                    >
                      {num} {num === 1 ? 'Pass' : 'Passes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="vikram@sansthan.org"
                      className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                      Mobile Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98112 00000"
                      className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="p-4 rounded-xl bg-[#121110] border border-[#2b2723] flex items-center justify-between mt-4">
                <div>
                  <span className="text-[11px] text-[#9e968b] uppercase tracking-wider block">
                    Total Estimated Contribution
                  </span>
                  <span className="text-xl font-display font-bold text-[#d4af37]">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-[#9e968b]">
                  Includes complimentary herbal tea & house programme
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-2 hover:scale-102 mt-4"
              >
                <Ticket className="w-4 h-4" />
                Confirm & Issue Digital Passes
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
