import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle2, Link2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDatabase } from '../context/DatabaseContext';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultProgram,
}) => {
  const { programs, siteSettings } = useDatabase();

  const programOptions = Array.isArray(siteSettings.applicationPrograms)
    ? siteSettings.applicationPrograms
    : programs.map((p) => `${p.title} (${p.duration})`);

  const disciplineOptions = Array.isArray(siteSettings.applicationDisciplines)
    ? siteSettings.applicationDisciplines
    : [
        'Classical & Physical Theatre',
        'Classical Dance (Kathak, Bharatanatyam, Chhau)',
        'Indian Classical Vocal / Dhrupad',
        'Percussion (Pakhawaj, Mridangam, Tabla)',
        'Mask Sculpting & Puppetry',
        'Dramatic Playwriting & Dramaturgy',
      ];

  const trainingOptions = Array.isArray(siteSettings.applicationPriorTraining)
    ? siteSettings.applicationPriorTraining
    : [
        '1–2 Years',
        '3–5 Years',
        '5–8 Years',
        '8+ Years (Professional)',
        'Self-Taught / Folk Tradition',
      ];

  const [selectedProgram, setSelectedProgram] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [background, setBackground] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [statement, setStatement] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (programOptions.length === 0) {
      setSelectedProgram('');
      return;
    }
    if (defaultProgram) {
      const match = programOptions.find(
        (p) =>
          p.toLowerCase() === defaultProgram.toLowerCase() ||
          p.toLowerCase().includes(defaultProgram.toLowerCase()) ||
          defaultProgram.toLowerCase().includes(p.toLowerCase())
      );
      if (match) {
        setSelectedProgram(match);
        return;
      }
    }
    if (!selectedProgram || !programOptions.includes(selectedProgram)) {
      setSelectedProgram(programOptions[0]);
    }
  }, [defaultProgram, programOptions, selectedProgram]);

  useEffect(() => {
    if (disciplineOptions.length === 0) {
      setBackground('');
      return;
    }
    if (!background || !disciplineOptions.includes(background)) {
      setBackground(disciplineOptions[0]);
    }
  }, [disciplineOptions, background]);

  useEffect(() => {
    if (trainingOptions.length === 0) {
      setExperienceYears('');
      return;
    }
    if (!experienceYears || !trainingOptions.includes(experienceYears)) {
      setExperienceYears(trainingOptions[0]);
    }
  }, [trainingOptions, experienceYears]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedToken = `RG-ACAD-${Math.floor(10000 + Math.random() * 90000)}`;
    setToken(generatedToken);
    setIsSubmitted(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#C85A32', '#FAF7F2'],
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
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

        {isSubmitted ? (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Audition Dossier Received
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-[#faf7f2] font-semibold">
                Application Submitted
              </h3>
              <p className="text-xs text-[#9e968b] mt-2 max-w-md mx-auto">
                Your application for <strong>{selectedProgram}</strong> has been logged into the Gurukul Admissions Registry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121110] border border-[#2b2723] max-w-xs mx-auto">
              <span className="text-[10px] text-[#9e968b] uppercase tracking-wider block">
                Audition Tracking Token
              </span>
              <span className="font-mono text-lg text-[#d4af37] font-bold">{token}</span>
            </div>

            <p className="text-xs text-[#d8d0c5] max-w-md mx-auto">
              Our Academic Dean and Artistic Directorate review portfolios on a rolling cycle. You will receive an invitation to an audition monologue or studio interview within 7 business days.
            </p>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/20"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Sansthan Admissions 2026–2027
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#faf7f2] font-semibold">
                Apply for Gurukul Internship
              </h2>
              <p className="text-xs text-[#9e968b] mt-1">
                Open to dedicated practitioners across theatre, classical dance, percussion, mask carving, and playwriting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Program selector */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                  Selected Intensive / Program
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  disabled={programOptions.length === 0}
                  className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {programOptions.length > 0 ? (
                    programOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No programs available at this time
                    </option>
                  )}
                </select>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Varma"
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@arts.org"
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              {/* Background & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Artistic Discipline
                  </label>
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    disabled={disciplineOptions.length === 0}
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {disciplineOptions.length > 0 ? (
                      disciplineOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No disciplines configured
                      </option>
                    )}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                    Prior Training
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    disabled={trainingOptions.length === 0}
                    className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {trainingOptions.length > 0 ? (
                      trainingOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No training options configured
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                  Portfolio / Video Monologue Link (Vimeo, YouTube, Drive)
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-[#9e968b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://vimeo.com/your-audition-tape"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              {/* Statement of Artistic Intent */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9e968b] font-semibold block mb-1">
                  Statement of Artistic Intent & Lineage (Max 250 words)
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Share what draws you to the rigorous contemplation of the Gurukul and your artistic aspirations..."
                  className="w-full px-4 py-3 rounded-xl bg-[#121110] border border-[#332f2a] text-[#faf7f2] text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-2 hover:scale-102 mt-2"
              >
                <Send className="w-4 h-4" />
                Submit Audition Dossier
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
