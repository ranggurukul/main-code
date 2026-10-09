import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilmModal: React.FC<FilmModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  const toggleSound = () => {
    setIsMuted(!isMuted);
    audioEngine.toggle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="theatre-card rounded-2xl max-w-4xl w-full overflow-hidden border border-[#d4af37]/40 relative bg-[#121110] shadow-2xl flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-[#faf7f2] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src="/assets/hero.jpg"
            alt="The Gurukul Film Preview"
            className="w-full h-full object-cover filter brightness-75 contrast-115 scale-105"
          />

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-black/60" />

          {/* Center Title overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <span className="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-semibold mb-2">
              Official Retrospective Film
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[#faf7f2] italic font-normal tracking-wide drop-shadow-lg max-w-xl">
              "The Fire That Does Not Turn to Ash"
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#d8d0c5] max-w-md drop-shadow">
              Directed by Gautama Sen • Winner: Best Cultural Documentary, Prague Film Triennale
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-[#d4af37] text-[#121110] hover:bg-[#fae69e] transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleSound}
                className="p-2 rounded-lg text-[#faf7f2] hover:bg-white/10 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#9e968b]" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
              </button>

              <span className="text-xs font-mono text-[#d8d0c5]">03:42 / 18:20</span>
            </div>

            {/* Simulated timeline */}
            <div className="hidden sm:flex items-center gap-2 flex-grow max-w-xs mx-4">
              <div className="w-full bg-[#332f2a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#d4af37] h-full w-1/4 rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4K Master Audio</span>
            </div>
          </div>
        </div>

        {/* Film Commentary */}
        <div className="p-6 sm:p-8 bg-[#161412] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#9e968b] max-w-xl leading-relaxed">
            Filmed over three seasons across the mountain amphitheatres of Uttarakhand, the sacred temples of Kerala, and the backstage corridors of London’s Barbican. A rare window into the ascetic dedication of contemporary Indian masters.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#1e1b18] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Close Film Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};
