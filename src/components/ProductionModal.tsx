import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Award, Users, Ticket } from 'lucide-react';
import type { Production } from '../data/rangData';

interface ProductionModalProps {
  production: Production | null;
  onClose: () => void;
  onBookPasses: (title: string) => void;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({
  production,
  onClose,
  onBookPasses,
}) => {
  if (!production) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="theatre-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#d4af37]/35 p-6 sm:p-10 relative bg-[#181614] my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#201e1b] hover:bg-[#2b2723] text-[#faf7f2] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Media */}
          <div className="relative h-60 sm:h-80 rounded-xl overflow-hidden mb-6 border border-[#332f2a]">
            <img
              src={production.bannerImage}
              alt={production.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/30" />

            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10"
                style={{
                  backgroundColor: `${production.statusColor}25`,
                  color: production.statusColor,
                }}
              >
                {production.status}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                {production.genre}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#faf7f2] font-bold">
                {production.title}
              </h2>
            </div>
          </div>

          {/* Meta Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#121110] border border-[#2b2723] text-xs text-[#d8d0c5] mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>{production.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c85a32]" />
              <span className="truncate">{production.venue}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>{production.dates}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold mb-2">
              Dramaturgical Synopsis
            </h4>
            <p className="text-sm text-[#d8d0c5] leading-relaxed font-sans-clean">
              {production.synopsis}
            </p>
          </div>

          {/* Director's Note */}
          <div className="mb-6 p-4 rounded-xl bg-[#141210] border-l-2 border-[#d4af37] border-y border-r border-[#2b2723]">
            <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
              Director's Vision • {production.director}
            </h4>
            <p className="text-xs sm:text-sm text-[#9e968b] italic leading-relaxed">
              "{production.directorNote}"
            </p>
          </div>

          {/* Cast & Ensembles */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] font-semibold mb-3">
              <Users className="w-4 h-4 text-[#d4af37]" />
              Principal Performers
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {production.cast.map((item, idx) => (
                <div key={idx} className="bg-[#121110] p-3 rounded-lg border border-[#2b2723]">
                  <span className="text-[10px] text-[#c85a32] uppercase tracking-wider block font-semibold">
                    {item.role}
                  </span>
                  <span className="text-xs font-semibold text-[#faf7f2] mt-0.5 block truncate">
                    {item.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accolades */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">
              <Award className="w-4 h-4" />
              Critical Acclaim & Honors
            </div>
            <ul className="space-y-1.5 text-xs text-[#d8d0c5]">
              {production.accolades.map((acc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#d4af37]">•</span>
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#332f2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#9e968b] block">
                Admission Tariff
              </span>
              <span className="text-sm font-semibold text-[#faf7f2]">
                {production.ticketPrice}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookPasses(production.title);
              }}
              className="px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-2 hover:scale-105"
            >
              <Ticket className="w-4 h-4" />
              Reserve Passes for this Staging
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
