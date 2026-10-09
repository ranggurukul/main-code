import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, X, Shield, Eye } from 'lucide-react';
import { ARCHIVE_ARTIFACTS, type ArchiveArtifact } from '../data/rangData';

export const ArchiveGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArtifact, setActiveArtifact] = useState<ArchiveArtifact | null>(null);

  const categories = [
    'All',
    'Masks & Costumery',
    'Ancient Scripts',
    'Acoustic Instruments',
    'Puppetry & Shadow',
  ];

  const filtered = selectedCategory === 'All'
    ? ARCHIVE_ARTIFACTS
    : ARCHIVE_ARTIFACTS.filter((a) => a.category === selectedCategory);

  return (
    <section id="archive" className="py-28 px-4 sm:px-6 lg:px-12 bg-[#121110] relative border-t border-[#332f2a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#201e1b] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
              <Archive className="w-3.5 h-3.5" />
              Living Heritage Vault
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#faf7f2] font-normal tracking-tight">
              Cultural <span className="italic font-display text-[#d4af37]">Archive</span>
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'border-[#d4af37] bg-[#221f1b] text-[#faf7f2] shadow-sm shadow-[#d4af37]/20'
                    : 'border-[#332f2a] bg-[#181614]/70 text-[#9e968b] hover:text-[#faf7f2] hover:border-[#524b43]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((artifact) => (
            <motion.div
              key={artifact.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setActiveArtifact(artifact)}
              className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={artifact.image}
                  alt={artifact.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 right-3 bg-[#121110]/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-[#d4af37]" />
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#c85a32] font-semibold block">
                    {artifact.category}
                  </span>
                  <span className="text-xs text-[#9e968b] font-mono">
                    {artifact.era}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-editorial text-base font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors line-clamp-2">
                    {artifact.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#9e968b] line-clamp-3 leading-relaxed">
                    {artifact.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2b2723] flex items-center justify-between text-[11px] text-[#d4af37]">
                  <span className="truncate">{artifact.origin}</span>
                  <span className="font-semibold uppercase tracking-wider">Inspect →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Archival Research Statement */}
        <div className="mt-16 p-8 rounded-2xl border border-[#332f2a] bg-[#1a1816]/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#201e1b] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl text-[#faf7f2]">
                Scholarly Access & Digital Preservation
              </h4>
              <p className="text-xs text-[#9e968b] mt-0.5">
                Our vaults house over 2,400 cataloged theatrical artifacts, audio field recordings, and historical manuscripts available for doctoral researchers.
              </p>
            </div>
          </div>
          <a
            href="#visit"
            className="px-5 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#25221e] text-[#faf7f2] hover:bg-[#d4af37] hover:text-[#121110] text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Request Archival Access
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeArtifact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="theatre-card rounded-2xl max-w-2xl w-full overflow-hidden border border-[#d4af37]/40 p-6 sm:p-8 relative bg-[#181614]"
            >
              <button
                onClick={() => setActiveArtifact(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#201e1b] hover:bg-[#2b2723] text-[#faf7f2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden mb-6 border border-[#332f2a]">
                <img
                  src={activeArtifact.image}
                  alt={activeArtifact.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#121110]/80 backdrop-blur-md px-3 py-1 rounded-md text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                  {activeArtifact.category}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#c85a32] uppercase tracking-widest font-semibold block">
                  {activeArtifact.era} • {activeArtifact.origin}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-[#faf7f2] mt-1 mb-3">
                  {activeArtifact.title}
                </h3>
                <p className="text-sm text-[#d8d0c5] leading-relaxed mb-4">
                  {activeArtifact.description}
                </p>

                <div className="bg-[#121110] p-4 rounded-xl border border-[#2b2723] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#d4af37]">Preservation Status:</strong>{' '}
                    <span className="text-[#faf7f2]">{activeArtifact.preservationStatus}</span>
                  </div>
                  <div>
                    <strong className="text-[#c85a32]">Archival Registry Notes:</strong>{' '}
                    <span className="text-[#9e968b]">{activeArtifact.archivalNotes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
